const DEFAULT_MAX_CANDIDATES = 1;
const DEFAULT_MAX_CHANGES = 20;

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const asArray = (value) => Array.isArray(value) ? value : [];

/**
 * Create the proposal boundary for the RSI engine.
 *
 * The proposer never edits a workspace. It turns a frozen task contract,
 * project memory and iteration evidence into one or more validated proposals.
 * Model access is deliberately injected so the engine does not depend on a
 * particular LLM SDK or provider.
 */
export function createProposer(options = {}) {
  const config = normalizeConfig(options);
  const generate = options.generate;

  return Object.freeze({
    config,
    buildPrompt,
    propose,
    validateProposal,
    normalizeProposal,
  });

  async function propose(input, request = {}) {
    validateInput(input);
    if (typeof generate !== 'function') {
      throw new Error('Proposer requires an injected generate function');
    }

    const prompt = buildPrompt(input, config);
    const raw = await generate({
      system: config.systemPrompt,
      prompt,
      input,
      signal: request.signal,
      config,
    });
    const decoded = decodeGenerated(raw);
    const candidates = Array.isArray(decoded) ? decoded : [decoded];
    const proposals = candidates
      .slice(0, config.maxCandidates)
      .map((candidate) => normalizeProposal(candidate, input, config))
      .map((candidate) => {
        const validation = validateProposal(candidate, input, config);
        if (!validation.valid) {
          throw new ProposalError('Generated proposal is invalid', validation.errors);
        }
        return candidate;
      });

    if (proposals.length === 0) {
      throw new ProposalError('Proposer returned no proposal', ['empty result']);
    }
    return proposals;
  }
}

export class ProposalError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ProposalError';
    this.errors = errors;
  }
}

export function normalizeConfig(options = {}) {
  const maxCandidates = Number.isInteger(options.maxCandidates) && options.maxCandidates > 0
    ? Math.min(options.maxCandidates, 10)
    : DEFAULT_MAX_CANDIDATES;
  const maxChanges = Number.isInteger(options.maxChanges) && options.maxChanges > 0
    ? Math.min(options.maxChanges, DEFAULT_MAX_CHANGES)
    : DEFAULT_MAX_CHANGES;

  return {
    maxCandidates,
    maxChanges,
    systemPrompt: nonEmpty(options.systemPrompt)
      ? options.systemPrompt.trim()
      : 'You are the RSI proposal planner. Return only a JSON proposal that respects the frozen task contract.',
    strategy: nonEmpty(options.strategy) ? options.strategy.trim() : 'evidence-first',
  };
}

export function validateInput(input) {
  if (!isRecord(input)) throw new TypeError('Proposer input must be an object');
  if (!isRecord(input.task)) throw new TypeError('Proposer input.task is required');
  for (const field of ['goal', 'scope', 'evaluation']) {
    if (!nonEmpty(input.task[field])) throw new TypeError(`task.${field} must be non-empty`);
  }
  if (!isRecord(input.projectMemory)) throw new TypeError('Proposer input.projectMemory is required');
  if (!Array.isArray(input.iterationMemory)) throw new TypeError('Proposer input.iterationMemory must be an array');
  return true;
}

export function buildPrompt(input, config = normalizeConfig()) {
  validateInput(input);
  const task = input.task;
  const scope = task.scope;
  const constraints = task.constraints ?? '';
  return [
    `Strategy: ${config.strategy}`,
    'Produce a JSON array of candidate proposals. Do not modify files.',
    'Every proposal must contain: id, hypothesis, changes, expectedOutcome, executionPlan, evaluationPlan, risks, rollbackPlan.',
    'Each change must identify a path or component and remain inside the allowed scope.',
    `Goal: ${task.goal}`,
    `Allowed scope: ${scope}`,
    `Evaluation: ${task.evaluation}`,
    `Constraints: ${constraints || '(none provided)'}`,
    `Project memory:\n${stableJson(input.projectMemory)}`,
    `Iteration memory:\n${stableJson(input.iterationMemory)}`,
  ].join('\n\n');
}

export function normalizeProposal(candidate, input, config = normalizeConfig()) {
  if (!isRecord(candidate)) return candidate;
  const proposal = {
    proposalId: nonEmpty(candidate.proposalId) ? candidate.proposalId.trim() : randomId('proposal'),
    targetProblem: nonEmpty(candidate.targetProblem) ? candidate.targetProblem.trim() : input.task.goal.trim(),
    hypothesis: candidate.hypothesis,
    changes: asArray(candidate.changes).slice(0, config.maxChanges),
    expectedOutcome: candidate.expectedOutcome,
    executionPlan: asArray(candidate.executionPlan),
    evaluationPlan: candidate.evaluationPlan,
    risks: asArray(candidate.risks),
    rollbackPlan: candidate.rollbackPlan,
    rationale: nonEmpty(candidate.rationale) ? candidate.rationale.trim() : '',
  };
  return proposal;
}

export function validateProposal(proposal, input, config = normalizeConfig()) {
  const errors = [];
  if (!isRecord(proposal)) return { valid: false, errors: ['proposal must be an object'] };
  for (const field of ['proposalId', 'targetProblem', 'hypothesis', 'expectedOutcome', 'evaluationPlan', 'rollbackPlan']) {
    if (!nonEmpty(proposal[field])) errors.push(`${field} must be non-empty`);
  }
  if (!Array.isArray(proposal.changes) || proposal.changes.length === 0) {
    errors.push('changes must contain at least one change');
  } else {
    if (proposal.changes.length > config.maxChanges) errors.push(`changes exceeds ${config.maxChanges}`);
    proposal.changes.forEach((change, index) => {
      if (!isRecord(change)) return errors.push(`changes[${index}] must be an object`);
      if (!nonEmpty(change.path) && !nonEmpty(change.component)) errors.push(`changes[${index}] needs path or component`);
      if (!nonEmpty(change.action)) errors.push(`changes[${index}].action must be non-empty`);
      if (!nonEmpty(change.description)) errors.push(`changes[${index}].description must be non-empty`);
      if (nonEmpty(change.path) && !isPathInScope(change.path, input.task.scope)) {
        errors.push(`changes[${index}].path is outside task scope`);
      }
    });
  }
  if (!Array.isArray(proposal.executionPlan) || proposal.executionPlan.length === 0) errors.push('executionPlan must not be empty');
  if (!Array.isArray(proposal.risks)) errors.push('risks must be an array');
  return { valid: errors.length === 0, errors };
}

function isPathInScope(path, scope) {
  // Scope is currently human-authored text. Reject explicit absolute paths and
  // obvious parent traversal; the executor remains the authoritative guard.
  if (path.startsWith('/') || path.includes('..')) return false;
  const scopes = scope.split(/[,\n;]/).map((item) => item.trim()).filter(Boolean);
  if (scopes.length === 0) return false;
  return scopes.some((allowed) => allowed === '*' || path === allowed || path.startsWith(allowed.endsWith('/') ? allowed : `${allowed}/`));
}

function decodeGenerated(value) {
  if (typeof value === 'string') {
    const text = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    return JSON.parse(text);
  }
  return value;
}

function stableJson(value) {
  return JSON.stringify(value, null, 2);
}

function randomId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default createProposer;

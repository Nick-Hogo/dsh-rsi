import assert from 'node:assert/strict';
import { createProposer, ProposalError } from '../host/engine/proposer.js';

const input = {
  task: {
    goal: '提高测试通过率',
    scope: 'src/, tests/',
    evaluation: 'npm test 全部通过',
    constraints: '禁止网络访问',
  },
  projectMemory: { components: [{ name: 'runner' }] },
  iterationMemory: [],
};

const valid = {
  proposalId: 'p-1',
  targetProblem: '测试失败',
  hypothesis: '补充边界测试并修复输入校验可提高通过率',
  changes: [{ path: 'src/validator.js', action: 'edit', description: '补充边界输入校验' }],
  expectedOutcome: '测试通过率提升',
  executionPlan: ['修改校验器', '运行测试'],
  evaluationPlan: '运行全部测试并比较失败数',
  risks: ['误拒绝合法输入'],
  rollbackPlan: '恢复基线版本',
};

const proposer = createProposer({
  generate: async () => JSON.stringify([valid]),
});
const proposals = await proposer.propose(input);
assert.equal(proposals.length, 1);
assert.equal(proposals[0].proposalId, 'p-1');
assert.match(proposer.buildPrompt(input), /提高测试通过率/);

const invalid = createProposer({ generate: async () => JSON.stringify([{ ...valid, changes: [{ path: '../secret', action: 'edit', description: 'bad' }] }]) });
await assert.rejects(() => invalid.propose(input), (error) => {
  assert.ok(error instanceof ProposalError);
  assert.match(error.errors.join(','), /outside task scope/);
  return true;
});

await assert.rejects(() => createProposer().propose(input), /injected generate function/);
await assert.rejects(() => proposer.propose({ ...input, task: { ...input.task, goal: '' } }), /task.goal/);
console.log('proposer tests passed');

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const json = (relative) => JSON.parse(read(relative));

const pkg = json('package.json');
assert.equal(pkg.name, 'dsh-RSI');
assert.equal(pkg.type, 'module');
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml');
assert.equal(pkg.dsh.client.platform, 'web');
assert.equal(pkg.dsh.client.immediately, true);
assert.ok(Array.isArray(pkg.dsh.client.inject) && pkg.dsh.client.inject.length > 0);

for (const file of ['host/index.js', 'client/client.js', 'cordis.patch.yml', 'icon.svg', 'README.md']) {
  assert.ok(exists(file), `missing ${file}`);
}
for (const file of ['locale/zh.json', 'locale/en.json', 'docs/DESIGN.md', 'docs/ARCHITECTURE.md']) {
  assert.ok(exists(file), `missing ${file}`);
}

assert.equal(pkg.exports['.'], './host/index.js');
assert.equal(pkg.exports['./client'], './client/client.js');
assert.ok(pkg.exports['./locale/*.json']);
assert.ok(pkg.exports['./icon']);
assert.ok(pkg.files.includes('client/client.js'));
assert.ok(pkg.files.includes('docs/*.md'));

const patch = read('cordis.patch.yml');
assert.match(patch, /-\s*insert:/);
assert.match(patch, /id:\s*dsh-rsi/);
assert.match(patch, /name:\s*'dsh-RSI'/);

const zh = json('locale/zh.json');
const en = json('locale/en.json');
const zhKeys = Object.keys(zh).sort();
const enKeys = Object.keys(en).sort();
assert.deepEqual(zhKeys, enKeys);
for (const dictionary of [zh, en]) {
  assert.equal(typeof dictionary.meta.title, 'string');
  assert.ok(dictionary.meta.title.length > 0);
  assert.equal(typeof dictionary.meta.description, 'string');
  assert.ok(dictionary.meta.description.length > 0);
  for (const [key, value] of Object.entries(dictionary)) {
    if (key === 'meta') {
      assert.equal(typeof value.title, 'string');
      assert.equal(typeof value.description, 'string');
    } else {
      assert.equal(typeof value, 'string', `non-string locale value ${key}`);
    }
  }
}

const icon = read('icon.svg').trim();
assert.ok(icon.startsWith('<svg'));
assert.ok(icon.endsWith('</svg>'));
assert.ok(Buffer.byteLength(icon) < 256 * 1024);
assert.match(icon, /viewBox="0 0 64 64"/);

const clientPath = path.join(root, 'client/client.js');
const clientText = read('client/client.js');
assert.match(clientText, /window\.__ModuleLoader__\.load\(/);
assert.match(clientText, /--dsw-alias-label-primary/);
assert.match(clientText, /rsi-planner/);
assert.match(clientText, /dsh-RSI\.projects\.v2/);
assert.match(clientText, /dsh-RSI\.evolution-spec\.v1/);

const requires = [...clientText.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((match) => match[1]);
assert.deepEqual([...new Set(requires)], ['react']);
assert.doesNotMatch(clientText, /from\s+['"]@deepseek-ai\//);
assert.doesNotMatch(clientText, /require\(\s*['"]@deepseek-ai\//);
assert.doesNotMatch(clientText, /#[0-9a-fA-F]{3,8}\b/);

let registration;
globalThis.window = {
  __ModuleLoader__: {
    load(entry) {
      registration = entry;
    },
  },
};
await import(pathToFileURL(clientPath).href + '?smoke=' + Date.now());
assert.equal(registration.id, pkg.name);
assert.equal(typeof registration.factory, 'function');

const fakeReact = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
  Fragment: Symbol('fragment'),
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
  useRef: (value) => ({ current: value }),
  useMemo: (factory) => factory(),
  useCallback: (callback) => callback,
  Component: class Component {
    constructor(props) {
      this.props = props;
      this.state = {};
    }
  },
};

const mod = registration.factory((name) => {
  assert.equal(name, 'react');
  return fakeReact;
});
assert.ok(Array.isArray(mod.inject));
for (const service of ['slots', 'locale', 'layout']) {
  assert.ok(mod.inject.includes(service), `missing inject service ${service}`);
}
assert.equal(typeof mod.apply, 'function');
assert.ok(mod.__test);

const model = mod.__test;
assert.deepEqual(Object.keys(model.dictionaries.zh).sort(), zhKeys);
assert.deepEqual(Object.keys(model.dictionaries.en).sort(), enKeys);

const registered = [];
const dictionaryRegistrations = [];
const ctx = {
  effect(fn) {
    const dispose = fn();
    assert.equal(typeof dispose, 'function');
    return dispose;
  },
  locale: {
    register(namespace, dictionaries) {
      dictionaryRegistrations.push({ namespace, dictionaries });
      return () => {};
    },
    bind() {
      return (key, params) => (params === undefined ? key : key + JSON.stringify(params));
    },
  },
  slots: {
    inject(name, callback) {
      assert.ok(name === 'main' || name === 'sidebar.panellist');
      callback();
    },
    register(options, component) {
      registered.push({ options, component });
      return () => {};
    },
  },
  layout: {
    selected: 'unset',
    selectPanel(panel) {
      this.selected = panel;
    },
  },
};

mod.apply(ctx);
assert.equal(registered.length, 2);
assert.equal(dictionaryRegistrations.length, 1);
assert.equal(dictionaryRegistrations[0].namespace, 'rsiPlanner');

const main = registered.find((entry) => entry.options.name === 'main');
const sidebar = registered.find((entry) => entry.options.name === 'sidebar.panellist');
assert.ok(main);
assert.ok(sidebar);
assert.equal(main.options.key, 'rsi-planner');
assert.equal(main.options.locale, 'rsiPlanner');
assert.equal(typeof main.component, 'function');
assert.equal(typeof main.options.inject, 'function');
const face = main.options.inject();
face.backToConversation();
assert.equal(ctx.layout.selected, null);
assert.equal(sidebar.options.id, 'rsi-planner');
assert.equal(typeof sidebar.options.label, 'function');
assert.equal(sidebar.options.order, 20);
assert.equal(typeof sidebar.component, 'function');

const empty = model.emptySpec();
assert.equal(empty.v, 1);
assert.equal(empty.idea, '');
assert.equal(empty.intent, null);
assert.equal(empty.stage, 'idea');
assert.equal(empty.status, 'draft');
assert.equal(empty.maxRounds, 3);

const ideaView = model.engineView(empty);
assert.equal(ideaView.status, 'idea');
assert.equal(ideaView.phase, 'idea');
assert.equal(ideaView.maxRounds, 0);
assert.equal(ideaView.steps[0].status, 'active');

let validation = model.validateSpec(empty);
assert.equal(validation.valid, false);
assert.deepEqual(validation.missing, ['goal', 'scope', 'evaluation']);
assert.equal(validation.maxRoundsInvalid, false);

const filled = {
  ...empty,
  idea: 'raise test pass rate',
  stage: 'review',
  goal: 'raise test pass rate',
  scope: 'src/, tests/',
  evaluation: 'all tests pass',
  constraints: 'no network',
  maxRounds: 3,
};
validation = model.validateSpec(filled);
assert.equal(validation.valid, true);
assert.deepEqual(validation.missing, []);

for (const maxRounds of [0, 21, 2.5, null, '3']) {
  assert.equal(model.validateSpec({ ...filled, maxRounds }).valid, false, `maxRounds ${maxRounds}`);
}

const normalized = model.normalizeSpec({
  v: 1,
  goal: 42,
  scope: 'src/',
  evaluation: 'tests',
  constraints: null,
  maxRounds: 99,
  status: 'confirmed',
  confirmedAt: 123,
});
assert.equal(normalized.goal, '');
assert.equal(normalized.scope, 'src/');
assert.equal(normalized.constraints, '');
assert.equal(normalized.maxRounds, 3);
assert.equal(normalized.status, 'draft');
assert.equal(normalized.confirmedAt, null);
assert.equal(normalized.idea, '');
assert.equal(normalized.stage, 'review');
assert.deepEqual(model.normalizeSpec({ v: 2 }), model.emptySpec());

const legacyNormalized = model.normalizeSpec(filled);
assert.equal(legacyNormalized.stage, 'review');
assert.ok(legacyNormalized.intent);
assert.equal(legacyNormalized.intent.sourceIdea, filled.idea);
assert.equal(legacyNormalized.intent.confirmedAt, '1970-01-01T00:00:00.000Z');

const ideaOnly = model.normalizeSpec({
  ...empty,
  idea: 'make the home page faster',
});
assert.equal(ideaOnly.stage, 'idea');
assert.equal(ideaOnly.idea, 'make the home page faster');

const fakeT = (key, params) => key + (params === undefined ? '' : ':' + JSON.stringify(params));
const parsedIntent = model.buildIntent('提升测试通过率并优化启动性能', fakeT);
assert.equal(parsedIntent.sourceIdea, '提升测试通过率并优化启动性能');
assert.equal(parsedIntent.confirmedAt, null);
assert.match(parsedIntent.summary, /intent\.summary/);
const clues = model.keywordProfile(parsedIntent.sourceIdea, fakeT);
assert.ok(clues.areas.some((area) => /draft\.scope\.tests/.test(area)));
assert.ok(clues.areas.some((area) => /draft\.scope\.performance/.test(area)));
assert.ok(clues.signals.some((signal) => /draft\.evaluation\.tests/.test(signal)));

const intentView = model.engineView({ ...empty, stage: 'intent', intent: parsedIntent });
assert.equal(intentView.status, 'intent');
assert.equal(intentView.phase, 'intent');
assert.equal(intentView.maxRounds, 0);

const fromIntent = model.buildSpecFromIntent(parsedIntent, fakeT, '2026-11-09T00:00:00.000Z');
assert.equal(fromIntent.stage, 'review');
assert.equal(fromIntent.goal, parsedIntent.summary);
assert.equal(fromIntent.idea, parsedIntent.sourceIdea);
assert.equal(fromIntent.intent.confirmedAt, '2026-11-09T00:00:00.000Z');
assert.equal(model.validateSpec(fromIntent).valid, true);

const editedIntent = { ...parsedIntent, summary: '优化首页加载速度，保持现有交互不变' };
const editedSpec = model.buildSpecFromIntent(editedIntent, fakeT, '2026-11-09T00:00:00.000Z');
assert.equal(editedSpec.goal, editedIntent.summary);
assert.match(editedSpec.scope, /draft\.scope\.home/);
assert.match(editedSpec.scope, /draft\.scope\.performance/);
assert.doesNotMatch(editedSpec.scope, /draft\.scope\.auth/);

const normalizedIntent = model.normalizeSpec({ ...empty, idea: parsedIntent.sourceIdea, intent: parsedIntent });
assert.equal(normalizedIntent.stage, 'intent');
const normalizedFromIntent = model.normalizeSpec(fromIntent);
assert.equal(normalizedFromIntent.stage, 'review');
assert.equal(normalizedFromIntent.intent.confirmedAt, '2026-11-09T00:00:00.000Z');
const dirtyNormalized = model.normalizeSpec({ ...fromIntent, idea: 'changed idea' });
assert.equal(dirtyNormalized.stage, 'idea');

const generated = model.buildDraft('提升测试通过率并优化启动性能', fakeT);
assert.equal(generated.stage, 'review');
assert.equal(generated.goal, '提升测试通过率并优化启动性能');
assert.equal(generated.status, 'draft');
assert.equal(generated.maxRounds, 3);
assert.match(generated.scope, /draft\.scope\.template/);
assert.match(generated.scope, /draft\.scope\.tests/);
assert.match(generated.scope, /draft\.scope\.performance/);
assert.match(generated.evaluation, /draft\.evaluation\.base/);
assert.match(generated.evaluation, /draft\.evaluation\.tests/);
assert.match(generated.constraints, /draft\.constraints/);
assert.equal(model.validateSpec(generated).valid, true);

const draftView = model.engineView(filled);
assert.equal(draftView.status, 'planning');
assert.equal(draftView.phase, 'plan');
assert.equal(draftView.round, 0);
assert.equal(draftView.maxRounds, 3);
assert.equal(draftView.steps.length, 6);
assert.equal(draftView.steps[0].id, 'plan');
assert.equal(draftView.steps[0].status, 'active');
assert.ok(draftView.steps.slice(1).every((step) => step.status === 'pending'));

const confirmedSpec = { ...filled, status: 'confirmed', confirmedAt: '2026-11-05T00:00:00.000Z' };
const confirmedView = model.engineView(confirmedSpec);
assert.equal(confirmedView.status, 'waiting');
assert.equal(confirmedView.phase, 'awaiting-engine');
assert.equal(confirmedView.steps[0].status, 'done');
assert.ok(confirmedView.steps.slice(1).every((step) => step.status === 'pending'));

const memory = new Map();
const storage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null;
  },
  setItem(key, value) {
    memory.set(key, value);
  },
};

const workspace = { id: 'w1', path: '/tmp/demo', title: 'demo' };
const project = {
  id: 'p1',
  name: 'Demo project',
  workspace,
  spec: filled,
  createdAt: '2026-11-09T00:00:00.000Z',
  updatedAt: '2026-11-09T00:00:00.000Z',
};
const store = { v: 2, projects: [project], lastUsedWorkspaceId: 'w1' };

assert.equal(model.saveStore(storage, store), true);
const loadedStore = model.loadStore(storage);
assert.equal(loadedStore.projects.length, 1);
assert.equal(loadedStore.projects[0].id, 'p1');
assert.equal(loadedStore.projects[0].workspace.path, '/tmp/demo');
assert.equal(loadedStore.projects[0].spec.scope, filled.scope);
assert.equal(loadedStore.lastUsedWorkspaceId, 'w1');

const legacyMemory = new Map();
const legacyStorage = {
  getItem(key) {
    return legacyMemory.has(key) ? legacyMemory.get(key) : null;
  },
  setItem(key, value) {
    legacyMemory.set(key, value);
  },
};
legacyStorage.setItem(model.LEGACY_STORAGE_KEY, JSON.stringify(fromIntent));
const migrated = model.loadStore(legacyStorage);
assert.equal(migrated.projects.length, 1);
assert.equal(migrated.projects[0].spec.goal, fromIntent.goal);
assert.equal(migrated.projects[0].spec.intent.confirmedAt, fromIntent.intent.confirmedAt);
assert.equal(migrated.projects[0].workspace.path, '');

const emptyProjects = model.normalizeStore({
  v: 2,
  projects: [{ id: 'empty', spec: model.emptySpec() }],
});
assert.equal(emptyProjects.projects.length, 0);

const workspaceOnly = model.normalizeWorkspace({ path: '/tmp/only' });
assert.equal(workspaceOnly.id, 'path:/tmp/only');
assert.equal(workspaceOnly.path, '/tmp/only');
assert.deepEqual(model.normalizeWorkspace(null), model.emptyWorkspace());

const freshProject = model.emptyProject();
assert.equal(freshProject.spec.stage, 'idea');
assert.equal(freshProject.workspace.path, '');
assert.ok(freshProject.id.length > 0);

const titled = model.projectTitle(fakeT, {
  name: '',
  spec: { ...model.emptySpec(), idea: '提升测试通过率并优化启动性能' },
});
assert.match(titled, /提升测试通过率并优化启动性能/);
assert.equal(model.projectTitle(fakeT, { name: 'Named', spec: model.emptySpec() }), 'Named');

const resolved = model.resolveLastWorkspace(
  { ...model.emptyStore(), lastUsedWorkspaceId: 'w1', projects: [project] },
  [],
);
assert.equal(resolved.path, '/tmp/demo');

memory.set(model.STORAGE_KEY, '{not json');
assert.deepEqual(model.loadStore(storage), model.emptyStore());
memory.set(model.STORAGE_KEY, JSON.stringify({ ...filled, v: 2 }));
assert.deepEqual(model.loadStore(storage), model.emptyStore());
assert.deepEqual(model.loadStore(null), model.emptyStore());

const brokenStorage = {
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
};
assert.equal(model.saveStore(brokenStorage, store), false);
assert.deepEqual(model.loadStore(brokenStorage), model.emptyStore());

function renderNode(node, depth = 0) {
  if (depth > 400) throw new Error('render depth exceeded');
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (typeof node === 'symbol') return '';
  if (Array.isArray(node)) return node.map((child) => renderNode(child, depth + 1)).join('');
  if (typeof node.type === 'function') {
    return renderNode(node.type({ ...node.props, children: node.children }), depth + 1);
  }
  return renderNode(node.children, depth + 1);
}

assert.equal(model.projectStage(model.emptySpec()), 'idea');
assert.equal(model.projectStage({ ...model.emptySpec(), idea: parsedIntent.sourceIdea, intent: parsedIntent }), 'intent');
assert.equal(model.projectStage(fromIntent), 'review');
assert.equal(model.projectStage({ ...fromIntent, idea: 'changed idea' }), 'idea');
assert.equal(model.projectStage({ ...fromIntent, status: 'confirmed' }), 'confirmed');
for (const good of ['/tmp/x', '~/code', 'C:\\work', 'D:/work']) assert.ok(model.isAbsolutePath(good), good);
for (const bad of ['', 'relative/dir', './x']) assert.ok(!model.isAbsolutePath(bad), bad);

function labelsOf(node, out = [], depth = 0) {
  if (depth > 400 || node === null || node === undefined || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const child of node) labelsOf(child, out, depth + 1);
    return out;
  }
  if (typeof node.type === 'function') return labelsOf(node.type({ ...node.props, children: node.children }), out, depth + 1);
  if (node.props && typeof node.props['aria-label'] === 'string') out.push(node.props['aria-label']);
  return labelsOf(node.children, out, depth + 1);
}

const { DashboardPage, PlannerPage } = model.components;
const noop = () => {};
const renderWorkspace = { id: 'w1', path: '/tmp/demo', title: 'demo' };
const renderProject = {
  id: 'p1',
  name: '',
  workspace: renderWorkspace,
  spec: { ...model.emptySpec(), idea: 'raise test pass rate' },
  run: null,
  createdAt: '2026-11-10T00:00:00.000Z',
  updatedAt: '2026-11-10T00:00:00.000Z',
};
const frozenSpec = { ...fromIntent, status: 'confirmed', confirmedAt: '2026-11-10T00:00:00.000Z' };
const withRun = (id, status, round, extra = {}) => ({
  ...renderProject,
  id,
  spec: frozenSpec,
  run: model.normalizeRun({
    status,
    round,
    maxRounds: 3,
    phase: 'evaluate',
    tokens: { input: 1000, output: 500 },
    agents: { active: status === 'running' ? 2 : 0, total: 3 },
    updatedAt: '2026-11-10T01:00:00.000Z',
    ...extra,
  }),
});

// run snapshot contract
assert.equal(model.normalizeRun(null), null);
assert.equal(model.normalizeRun({ status: 'bogus', round: 1, maxRounds: 3 }), null);
assert.equal(model.normalizeRun({ status: 'running', round: 1 }), null, 'maxRounds required');
assert.equal(model.normalizeRun({ status: 'running', round: 9, maxRounds: 3 }).round, 3, 'round clamped');
assert.equal(model.normalizeRun({ status: 'running', round: 1, maxRounds: 3, phase: 'nope' }).phase, null);
assert.equal(model.normalizeProject({ ...renderProject, run: { status: 'running', round: 1, maxRounds: 3 } }).run, null, 'draft spec drops run');
assert.equal(model.normalizeProject({ ...renderProject, spec: frozenSpec, run: { status: 'running', round: 1, maxRounds: 3 } }).run.status, 'running');

// status, summary, ordering
const fleet = [
  renderProject,
  { ...renderProject, id: 'ready', spec: frozenSpec },
  withRun('run', 'running', 2),
  withRun('fail', 'failed', 1, { message: 'evaluation failed' }),
  withRun('pause', 'paused', 1),
  withRun('done', 'completed', 3),
];
assert.deepEqual(fleet.map(model.projectStatus), ['planning', 'ready', 'running', 'failed', 'paused', 'completed']);
const counts = model.summarize(fleet);
assert.deepEqual(
  { all: counts.all, running: counts.running, attention: counts.attention, ready: counts.ready, planning: counts.planning, completed: counts.completed, failed: counts.failed, paused: counts.paused },
  { all: 6, running: 1, attention: 2, ready: 1, planning: 1, completed: 1, failed: 1, paused: 1 },
);
assert.deepEqual(model.sortProjects(fleet).map((p) => p.id), ['fail', 'pause', 'run', 'ready', 'p1', 'done']);

// engine totals and formatting
assert.deepEqual(model.normalizeRun({ status: 'running', round: 1, maxRounds: 3, tokens: { input: -5, output: 2.5 } }).tokens, { input: 0, output: 0 });
assert.deepEqual(model.normalizeRun({ status: 'running', round: 1, maxRounds: 3, agents: { active: 4, total: 1 } }).agents, { active: 4, total: 4 });
const blank = model.aggregate([renderProject, { ...renderProject, id: 'ready', spec: frozenSpec }]);
assert.equal(blank.tokens, null, 'no token metric without snapshots');
assert.equal(blank.agents, null, 'no agent metric without snapshots');
assert.equal(blank.slices.length, 0);
const stats = model.aggregate(fleet);
assert.equal(stats.runCount, 4);
assert.deepEqual(stats.tokens, { input: 4000, output: 2000, total: 6000 });
assert.deepEqual(stats.agents, { active: 2, total: 6 }, 'agents count only running and paused runs');
assert.deepEqual(stats.live.map((p) => p.id), ['fail', 'pause', 'run']);
const many = Array.from({ length: 7 }, (_, i) => withRun('m' + i, 'completed', 3, { tokens: { input: (i + 1) * 100, output: 0 } }));
const sliced = model.aggregate(many).slices;
assert.equal(sliced.length, 5, 'top four plus other');
assert.equal(sliced[0].value, 700);
assert.equal(sliced[4].id, 'other');
assert.equal(sliced[4].value, 100 + 200 + 300);
assert.deepEqual([950, 1000, 12345, 999999, 4100000].map(model.formatCount), ['950', '1k', '12k', '1000k', '4.1M']);
const demoFleet = model.demoProjects(fakeT);
assert.ok(demoFleet.every((p) => p.id.startsWith('demo-')));
assert.ok(model.aggregate(demoFleet).tokens.total > 0);
assert.ok(new Set(demoFleet.map(model.projectStatus)).size >= 6, 'demo covers every status');

const detail = (project, extra = {}) =>
  renderNode(
    PlannerPage({
      t: fakeT,
      project,
      onSpecChange: noop,
      onRename: noop,
      onBack: noop,
      workspaces: [renderWorkspace],
      onCreateWorkspace: noop,
      onWorkspaceChange: noop,
      storageFailed: false,
      ...extra,
    }),
  );
const dashboardNode = (projects, extra = {}) =>
    DashboardPage({
      t: fakeT,
      projects,
      removed: null,
      onNew: noop,
      onOpen: noop,
      onDelete: noop,
      onUndo: noop,
      onDismiss: noop,
      backToConversation: noop,
      storageFailed: false,
      ...extra,
    });
const dashboard = (projects, extra) => renderNode(dashboardNode(projects, extra));
const count = (text, needle) => text.split(needle).length - 1;

const emptyDash = dashboard([]);
assert.match(emptyDash, /board\.empty\.title/);
assert.equal(count(emptyDash, 'board.new'), 1, 'empty dashboard offers exactly one create action');
assert.doesNotMatch(emptyDash, /summary\./, 'no summary without projects');

const planningDash = dashboard([renderProject, { ...renderProject, id: 'ready', spec: frozenSpec }]);
for (const key of ['summary.all', 'summary.running', 'summary.attention', 'summary.ready', 'summary.planning', 'summary.completed']) {
  assert.match(planningDash, new RegExp(key.replace('.', '\\.')), key);
}
for (const key of ['panel.progressEmpty', 'panel.tokensEmpty', 'metric.noData', 'demo.open']) assert.ok(planningDash.includes(key), key);
assert.doesNotMatch(planningDash, /card\.round/, 'no progress without a run snapshot');
assert.ok(!labelsOf(dashboardNode([renderProject])).includes('dash.search'), 'search hidden for small fleets');

const fleetDash = dashboard(fleet);
for (const key of ['panel.progressEmpty', 'panel.tokensEmpty', 'metric.noData', 'demo.open']) assert.ok(!fleetDash.includes(key), key);
assert.match(fleetDash, /card\.tokens/);
assert.match(fleetDash, /card\.agents/);
assert.ok(labelsOf(dashboardNode(fleet)).some((label) => label.startsWith('a11y.donut')), 'donut rendered with a text alternative');
assert.match(fleetDash, /card\.round/);
assert.match(fleetDash, /evaluation failed/, 'failure reason shown on card');
assert.ok(labelsOf(dashboardNode(fleet)).includes('dash.search'), 'search appears for larger fleets');
assert.equal(count(fleetDash, 'board.delete'), 4, 'running and paused projects cannot be deleted');
assert.match(dashboard([renderProject], { removed: { project: renderProject, index: 0 } }), /board\.undo/);

assert.doesNotMatch(detail(withRun('run', 'running', 2)), /confirmed\.edit/, 'active run locks the spec');
assert.match(detail(withRun('done', 'completed', 3)), /confirmed\.edit/);

const ideaDetail = detail(renderProject);
assert.equal(count(ideaDetail, 'detail.back'), 1, 'exactly one return action');
assert.doesNotMatch(ideaDetail, /page\.back/, 'detail has no second return action');
assert.equal(count(ideaDetail, 'workspace.label'), 1, 'workspace shown once');
assert.match(ideaDetail, /bar\.parse/);
assert.match(ideaDetail, /stage\.lockedIntent/, 'locked reason visible inline');
const unboundView = detail({ ...renderProject, workspace: model.emptyWorkspace() }, { workspaces: [] });
assert.match(unboundView, /bar\.needWorkspace/);
assert.match(unboundView, /workspace\.choose/);
const reviewView = detail({ ...renderProject, spec: fromIntent });
assert.match(reviewView, /confirm\.action/);
assert.equal(count(reviewView, 'stage.review'), 1);
const frozenView = detail({ ...renderProject, spec: frozenSpec });
assert.match(frozenView, /confirmed\.banner/);
assert.doesNotMatch(frozenView, /workspace\.other|workspace\.change/, 'workspace locked after confirmation');
assert.match(detail(renderProject, { storageFailed: true }), /persistence\.failed/);

const design = read('docs/DESIGN.md');
const architecture = read('docs/ARCHITECTURE.md');
assert.match(design, /如无必要勿增实体/);
assert.match(design, /Evolution Planner/);
assert.match(design, /状态机/);
assert.match(architecture, /EvolutionSpec/);
assert.match(architecture, /EngineSnapshot/);
assert.match(architecture, /Phase 2/);
assert.match(architecture, /目录结构/);

console.log('smoke: ok');
console.log(`  package: ${pkg.name}@${pkg.version}`);
console.log(`  locales: ${zhKeys.length} keys, zh/en aligned`);
console.log(`  registrations: ${registered.map((entry) => entry.options.name).join(', ')}`);
console.log('  spec/validation/storage/engine-view: ok');
console.log('  docs: ok');

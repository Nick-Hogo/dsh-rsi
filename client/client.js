window.__ModuleLoader__.load({
  id: 'dsh-RSI',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'rsiPlanner';
    const PANEL_ID = 'rsi-planner';
    const STORAGE_KEY = 'dsh-RSI.projects.v2';
    const LEGACY_STORAGE_KEY = 'dsh-RSI.evolution-spec.v1';
    const MAX_ROUNDS = 20;
    const PHASES = ['plan', 'generate', 'evaluate', 'select', 'rewrite', 'iterate'];
    const OTHER_WORKSPACE = '__rsi-other__';
    const SEARCH_THRESHOLD = 6;

    const zh = {
      meta: {
        title: 'dsh-RSI · 递归自进化',
        description: '在侧边栏打开递归自进化：按工作区管理 RSI 项目，从想法、意图到可确认的进化规范。',
      },
      panel: '递归自进化',
      'page.back': '返回会话',
      'board.title': '递归自进化',
      'board.new': '新建项目',
      'board.empty.title': '还没有项目',
      'board.empty.hint': '每个项目绑定一个工作区，从一句想法开始，逐步形成可确认的进化规范。',
      'summary.all': '全部',
      'summary.running': '运行中',
      'summary.attention': '需关注',
      'summary.ready': '待启动',
      'summary.planning': '规划中',
      'summary.completed': '已完成',
      'status.running': '运行中',
      'status.paused': '已暂停',
      'status.failed': '失败',
      'status.completed': '已完成',
      'status.ready': '待启动',
      'status.planning': '规划中',
      'phase.plan': '规划',
      'phase.generate': '生成',
      'phase.evaluate': '评估',
      'phase.select': '选择',
      'phase.rewrite': '改写',
      'phase.iterate': '迭代',
      'card.round': '第 {round} / {max} 轮',
      'card.ready': '规范已确认 · 最多 {max} 轮',
      'card.planning': '当前阶段：{stage}',
      'dash.metrics': '关键指标',
      'dash.filter': '按状态筛选',
      'metric.running': '运行中',
      'metric.runningSub': '共 {total} 个项目',
      'metric.agents': '活跃 Agent',
      'metric.agentsSub': '已分配 {total} 个',
      'metric.tokens': 'Token 消耗',
      'metric.tokensSub': '输入 {input} · 输出 {output}',
      'metric.attention': '需关注',
      'metric.attentionSub': '失败 {failed} · 暂停 {paused}',
      'metric.noData': '引擎接入后统计',
      'panel.progress': '运行进度',
      'panel.progressEmpty': '暂无运行中的项目。引擎接入后，这里按轮次显示每个项目的进度。',
      'panel.more': '另有 {count} 个项目未显示',
      'panel.tokens': 'Token 消耗分布',
      'panel.tokensEmpty': '暂无 Token 数据。引擎接入后按项目统计消耗。',
      'panel.other': '其他',
      'tasks.title': '全部项目',
      'card.tokens': 'Token {value}',
      'card.agents': 'Agent {active}/{total}',
      'a11y.donut': 'Token 消耗分布，总计 {total}',
      'demo.open': '查看演示数据',
      'demo.banner': '正在预览演示数据：仅用于查看布局，不会保存，也不能打开。',
      'demo.exit': '退出演示',
      'demo.project': '示例项目 {n}',
      'demo.failure': '评估未通过：基准性能下降 12%',
      'demo.paused': '等待人工审查本轮改动',
      'dash.search': '搜索项目或工作区',
      'dash.allWorkspaces': '全部工作区',
      'dash.filterEmpty': '没有符合条件的项目。',
      'dash.clearFilters': '清除筛选',
      'board.untitled': '未命名项目',
      'board.delete': '删除',
      'board.deleteNamed': '删除「{name}」',
      'board.deleted': '已删除「{name}」',
      'board.undo': '撤销',
      'board.dismiss': '关闭提示',
      'detail.back': '返回面板',
      'badge.draft': '草稿',
      'badge.confirmed': '已确认',
      'stage.list': '规划阶段',
      'stage.idea': '想法',
      'stage.intent': '意图',
      'stage.review': '规范',
      'stage.confirmed': '已确认',
      'stage.rounds': '最多 {max} 轮',
      'stage.lockedIntent': '先解析意图',
      'stage.lockedReview': '先确认意图',
      'stage.lockedDirty': '想法已修改，需重新解析',
      'workspace.label': '工作区',
      'workspace.none': '未绑定',
      'workspace.noneLong': '未绑定工作区',
      'workspace.placeholder': '选择工作区',
      'workspace.other': '其他目录…',
      'workspace.choose': '选择',
      'workspace.change': '更改',
      'workspace.pathPlaceholder': '目录绝对路径，如 /Users/you/project',
      'workspace.bind': '绑定',
      'workspace.cancel': '取消',
      'workspace.notAbsolute': '请输入绝对路径。',
      'workspace.failed': '工作区创建失败，请检查路径后重试。',
      'idea.placeholder': '用一句话描述希望系统变成什么样，例如：让登录流程更稳定，同时不改变现有交互。',
      'idea.examples': '示例',
      'idea.example.1': '提升测试通过率，同时不增加启动时间',
      'idea.example.2': '减少登录模块的重复代码，让它更易维护',
      'idea.example.3': '优化首页加载速度，保持现有交互不变',
      'idea.dirty': '想法已修改，需要重新解析意图。',
      'idea.revert': '恢复上次解析的想法',
      'intent.label': '我的理解',
      'intent.hint': '这段理解会成为规范的目标，可直接修改。',
      'intent.clues': '线索',
      'intent.clue.generic': '通用改进',
      'intent.summary': '{idea}。在保持现有行为不回归的前提下，以可复现的检查确认改进。',
      'bar.needWorkspace': '先在上方绑定工作区，才能解析意图。',
      'bar.idea': '解析后先校对意图，确认后再生成规范。',
      'bar.ideaUnchanged': '想法未修改，可继续下一步。',
      'bar.ideaFrozen': '规范已确认，想法只读。',
      'bar.parse': '解析意图',
      'bar.reparse': '重新解析意图',
      'bar.continue': '继续',
      'bar.intent': '确认后将按这段理解生成规范。',
      'intent.confirm': '确认意图',
      'intent.editWarning': '重新确认会重新生成规范，可能覆盖手动修改。',
      'intent.lockedHint': '意图已确认；修改会重新生成规范。',
      'intent.lockedConfirmed': '规范已确认；先在规范中返回修改，才能修改意图。',
      'intent.unlock': '修改意图',
      'accordion.empty': '尚未填写',
      'draft.join': '；',
      'draft.scope.generic': '当前项目中与目标直接相关的源码与测试',
      'draft.scope.auth': '认证/登录相关源码与测试',
      'draft.scope.home': '首页相关源码、样式与测试',
      'draft.scope.tests': '测试与为通过测试所需的最小源码',
      'draft.scope.performance': '影响性能路径的源码与配置',
      'draft.scope.template': '仅允许修改：{areas}；不修改依赖锁文件、发布配置与 CI；未列出即不允许。',
      'draft.evaluation.base': '目标可由可复现的检查验证；现有测试与基准无回归',
      'draft.evaluation.tests': '全部相关测试通过，无新增失败',
      'draft.evaluation.performance': '基准性能不低于当前基线',
      'draft.evaluation.ui': '关键交互路径通过验收',
      'draft.constraints': '最多 {maxRounds} 轮；每轮开始前保留可回滚点；不新增依赖；评估未通过不得接受改动；不得越过修改空间。',
      'field.goal.label': '优化目标',
      'field.goal.short': '优化目标',
      'field.goal.hint': '期望达到的最终状态，而不是实现步骤。',
      'field.goal.placeholder': '例如：让测试通过率从 82% 提升到 95%，同时不增加启动时间。',
      'field.scope.label': '修改空间',
      'field.scope.short': '修改空间',
      'field.scope.hint': '允许修改的目录、文件或模块；未列出即视为不允许。',
      'field.scope.placeholder': '例如：src/、tests/；不可修改 package.json 与 CI 配置。',
      'field.evaluation.label': '评估标准',
      'field.evaluation.short': '评估标准',
      'field.evaluation.hint': '如何判断一次改动是成功的；尽量可度量、可复现。',
      'field.evaluation.placeholder': '例如：全部测试通过；基准性能不低于当前；无新增 lint 错误。',
      'field.constraints.label': '执行约束',
      'field.constraints.short': '执行约束',
      'field.constraints.hint': '时间、预算、安全或其他限制。',
      'field.constraints.placeholder': '例如：不得联网；单次改动不超过 5 个文件；每轮必须保留可回滚点。',
      'field.maxRounds.label': '最大迭代轮次',
      'field.maxRounds.unit': '轮',
      'field.maxRounds.hint': '1–20；引擎不得越过该上限。',
      'confirm.ack': '我已确认以上规范，允许引擎在修改空间内迭代。',
      'confirm.action': '确认规范',
      'confirm.missing': '还需完成：{fields}',
      'confirm.needAck': '勾选确认后才能冻结规范。',
      'confirm.ready': '确认后规范将冻结。',
      'confirmed.banner': '规范已冻结，等待引擎接入',
      'confirmed.banner.run': '规范已冻结 · 引擎状态：{status}',
      'confirmed.edit': '返回修改',
      'persistence.failed': '浏览器存储不可用；本次修改仅保留在当前页面。',
      'validation.maxRounds': '最大迭代轮次需为 1–20 的整数。',
      'a11y.rename': '项目名称',
      'error.title': '页面渲染失败',
      'error.retry': '重试',
      'error.back': '返回会话',
      'error.detail': '错误信息：{message}',
    };

    const en = {
      meta: {
        title: 'dsh-RSI · Recursive Self-Evolution',
        description: 'Open Recursive Self-Evolution from the sidebar: manage RSI projects per workspace, from idea and intent to a confirmed evolution specification.',
      },
      panel: 'Recursive Self-Evolution',
      'page.back': 'Back to session',
      'board.title': 'Recursive Self-Evolution',
      'board.new': 'New project',
      'board.empty.title': 'No projects yet',
      'board.empty.hint': 'Each project binds one workspace and grows from a single idea into a confirmable evolution specification.',
      'summary.all': 'All',
      'summary.running': 'Running',
      'summary.attention': 'Needs attention',
      'summary.ready': 'Ready',
      'summary.planning': 'Planning',
      'summary.completed': 'Completed',
      'status.running': 'Running',
      'status.paused': 'Paused',
      'status.failed': 'Failed',
      'status.completed': 'Completed',
      'status.ready': 'Ready',
      'status.planning': 'Planning',
      'phase.plan': 'Plan',
      'phase.generate': 'Generate',
      'phase.evaluate': 'Evaluate',
      'phase.select': 'Select',
      'phase.rewrite': 'Rewrite',
      'phase.iterate': 'Iterate',
      'card.round': 'Round {round} / {max}',
      'card.ready': 'Spec confirmed · up to {max} rounds',
      'card.planning': 'Current stage: {stage}',
      'dash.metrics': 'Key metrics',
      'dash.filter': 'Filter by status',
      'metric.running': 'Running',
      'metric.runningSub': '{total} projects in total',
      'metric.agents': 'Active agents',
      'metric.agentsSub': '{total} assigned',
      'metric.tokens': 'Token usage',
      'metric.tokensSub': 'In {input} · out {output}',
      'metric.attention': 'Needs attention',
      'metric.attentionSub': 'Failed {failed} · paused {paused}',
      'metric.noData': 'Available once the engine is connected',
      'panel.progress': 'Run progress',
      'panel.progressEmpty': 'Nothing is running. Once the engine is connected, each project’s round progress appears here.',
      'panel.more': '{count} more projects not shown',
      'panel.tokens': 'Token usage by project',
      'panel.tokensEmpty': 'No token data yet. Usage is broken down by project once the engine is connected.',
      'panel.other': 'Other',
      'tasks.title': 'All projects',
      'card.tokens': 'Tokens {value}',
      'card.agents': 'Agents {active}/{total}',
      'a11y.donut': 'Token usage by project, {total} in total',
      'demo.open': 'Preview sample data',
      'demo.banner': 'Previewing sample data: layout only, never saved and not openable.',
      'demo.exit': 'Exit preview',
      'demo.project': 'Sample project {n}',
      'demo.failure': 'Evaluation failed: benchmark 12% slower',
      'demo.paused': 'Waiting for human review of this round',
      'dash.search': 'Search projects or workspaces',
      'dash.allWorkspaces': 'All workspaces',
      'dash.filterEmpty': 'No projects match these filters.',
      'dash.clearFilters': 'Clear filters',
      'board.untitled': 'Untitled project',
      'board.delete': 'Delete',
      'board.deleteNamed': 'Delete “{name}”',
      'board.deleted': 'Deleted “{name}”',
      'board.undo': 'Undo',
      'board.dismiss': 'Dismiss',
      'detail.back': 'Back to dashboard',
      'badge.draft': 'Draft',
      'badge.confirmed': 'Confirmed',
      'stage.list': 'Planning stages',
      'stage.idea': 'Idea',
      'stage.intent': 'Intent',
      'stage.review': 'Spec',
      'stage.confirmed': 'Confirmed',
      'stage.rounds': 'Up to {max} rounds',
      'stage.lockedIntent': 'Parse the intent first',
      'stage.lockedReview': 'Confirm the intent first',
      'stage.lockedDirty': 'Idea changed; re-parse it',
      'workspace.label': 'Workspace',
      'workspace.none': 'Not bound',
      'workspace.noneLong': 'No workspace bound',
      'workspace.placeholder': 'Select a workspace',
      'workspace.other': 'Other directory…',
      'workspace.choose': 'Choose',
      'workspace.change': 'Change',
      'workspace.pathPlaceholder': 'Absolute directory path, e.g. /Users/you/project',
      'workspace.bind': 'Bind',
      'workspace.cancel': 'Cancel',
      'workspace.notAbsolute': 'Enter an absolute path.',
      'workspace.failed': 'Could not create the workspace; check the path and retry.',
      'idea.placeholder': 'Describe in one sentence how the system should change, e.g. make the login flow more reliable without changing current interactions.',
      'idea.examples': 'Examples',
      'idea.example.1': 'Raise test pass rate without increasing startup time',
      'idea.example.2': 'Remove duplication from the login module to make it easier to maintain',
      'idea.example.3': 'Speed up the home page without changing current interactions',
      'idea.dirty': 'The idea changed; re-parse the intent.',
      'idea.revert': 'Restore parsed idea',
      'intent.label': 'My understanding',
      'intent.hint': 'This understanding becomes the goal of the specification; edit it directly.',
      'intent.clues': 'Clues',
      'intent.clue.generic': 'General improvement',
      'intent.summary': '{idea}. Keep current behavior from regressing and verify the improvement with reproducible checks.',
      'bar.needWorkspace': 'Bind a workspace above before parsing the intent.',
      'bar.idea': 'Review the parsed intent first; the specification is generated after you confirm it.',
      'bar.ideaUnchanged': 'The idea is unchanged; continue to the next step.',
      'bar.ideaFrozen': 'The specification is confirmed; the idea is read-only.',
      'bar.parse': 'Parse intent',
      'bar.reparse': 'Re-parse intent',
      'bar.continue': 'Continue',
      'bar.intent': 'Confirming generates the specification from this understanding.',
      'intent.confirm': 'Confirm intent',
      'intent.editWarning': 'Re-confirming regenerates the specification and may replace manual changes.',
      'intent.lockedHint': 'Intent confirmed; editing it regenerates the specification.',
      'intent.lockedConfirmed': 'Specification confirmed; edit the specification first to change the intent.',
      'intent.unlock': 'Edit intent',
      'accordion.empty': 'Not filled in yet',
      'draft.join': '; ',
      'draft.scope.generic': 'source and test files in the current project that directly relate to the goal',
      'draft.scope.auth': 'authentication/login source and tests',
      'draft.scope.home': 'home page source, styles and tests',
      'draft.scope.tests': 'tests plus the minimal source needed to make them pass',
      'draft.scope.performance': 'source and configuration on the performance path',
      'draft.scope.template': 'Only these areas may change: {areas}; do not modify lockfiles, release config or CI; anything not listed is out of bounds.',
      'draft.evaluation.base': 'The goal is verified by reproducible checks; existing tests and benchmarks show no regression',
      'draft.evaluation.tests': 'All related tests pass with no new failures',
      'draft.evaluation.performance': 'Benchmarks are not slower than the current baseline',
      'draft.evaluation.ui': 'Key interaction paths pass acceptance',
      'draft.constraints': 'At most {maxRounds} rounds; keep a rollback point before each round; add no dependencies; never accept a change that fails evaluation; never leave the modification space.',
      'field.goal.label': 'Goal',
      'field.goal.short': 'Goal',
      'field.goal.hint': 'The desired end state, not the implementation steps.',
      'field.goal.placeholder': 'e.g. Raise test pass rate from 82% to 95% without increasing startup time.',
      'field.scope.label': 'Modification space',
      'field.scope.short': 'Modification space',
      'field.scope.hint': 'Directories, files or modules the engine may change; anything else is out of bounds.',
      'field.scope.placeholder': 'e.g. src/, tests/; package.json and CI config are off-limits.',
      'field.evaluation.label': 'Evaluation criteria',
      'field.evaluation.short': 'Evaluation criteria',
      'field.evaluation.hint': 'How a change is judged successful; make it measurable and reproducible.',
      'field.evaluation.placeholder': 'e.g. All tests pass; benchmark is not slower; no new lint errors.',
      'field.constraints.label': 'Execution constraints',
      'field.constraints.short': 'Execution constraints',
      'field.constraints.hint': 'Time, budget, safety or other limits.',
      'field.constraints.placeholder': 'e.g. No network access; at most 5 files per change; keep a rollback point each round.',
      'field.maxRounds.label': 'Max iterations',
      'field.maxRounds.unit': 'rounds',
      'field.maxRounds.hint': '1–20; the engine must not exceed this limit.',
      'confirm.ack': 'I confirm this specification and allow the engine to iterate within the modification space.',
      'confirm.action': 'Confirm specification',
      'confirm.missing': 'Still needed: {fields}',
      'confirm.needAck': 'Check the box to freeze the specification.',
      'confirm.ready': 'Confirming freezes the specification.',
      'confirmed.banner': 'Specification frozen, waiting for the engine',
      'confirmed.banner.run': 'Specification frozen · engine status: {status}',
      'confirmed.edit': 'Edit specification',
      'persistence.failed': 'Browser storage is unavailable; changes only live on this page.',
      'validation.maxRounds': 'Max iterations must be an integer from 1 to 20.',
      'a11y.rename': 'Project name',
      'error.title': 'The page failed to render',
      'error.retry': 'Retry',
      'error.back': 'Back to session',
      'error.detail': 'Error: {message}',
    };

    /** A fresh, versioned evolution specification. */
    function emptySpec() {
      return {
        v: 1,
        idea: '',
        intent: null,
        stage: 'idea',
        goal: '',
        scope: '',
        evaluation: '',
        constraints: '',
        maxRounds: 3,
        status: 'draft',
        confirmedAt: null,
      };
    }

    /**
     * Accept only the v1 shape; unknown or corrupt values fall back to safe
     * defaults. Stage is derived from the data so a stale UI stage cannot
     * expose unconfirmed intent or a confirmed spec without required fields.
     */
    function normalizeSpec(raw) {
      if (raw === null || typeof raw !== 'object' || raw.v !== 1) return emptySpec();
      const stringOf = (value) => (typeof value === 'string' ? value : '');
      const maxRounds =
        Number.isInteger(raw.maxRounds) && raw.maxRounds >= 1 && raw.maxRounds <= MAX_ROUNDS
          ? raw.maxRounds
          : 3;
      let intent = null;
      if (raw.intent !== null && typeof raw.intent === 'object') {
        const summary = stringOf(raw.intent.summary);
        const sourceIdea = stringOf(raw.intent.sourceIdea);
        if (summary.trim() !== '' && sourceIdea.trim() !== '') {
          intent = {
            summary,
            sourceIdea,
            confirmedAt:
              typeof raw.intent.confirmedAt === 'string' ? raw.intent.confirmedAt : null,
          };
        }
      }
      const spec = {
        v: 1,
        idea: stringOf(raw.idea),
        intent,
        stage: 'idea',
        goal: stringOf(raw.goal),
        scope: stringOf(raw.scope),
        evaluation: stringOf(raw.evaluation),
        constraints: stringOf(raw.constraints),
        maxRounds,
        status: raw.status === 'confirmed' ? 'confirmed' : 'draft',
        confirmedAt: typeof raw.confirmedAt === 'string' ? raw.confirmedAt : null,
      };
      const requiredPresent =
        spec.goal.trim() !== '' && spec.scope.trim() !== '' && spec.evaluation.trim() !== '';
      const anyFields = [spec.goal, spec.scope, spec.evaluation, spec.constraints].some(
        (value) => value.trim() !== '',
      );
      if (spec.intent === null && anyFields) {
        const summary = spec.goal.trim() !== '' ? spec.goal : spec.idea;
        const sourceIdea = spec.idea.trim() !== '' ? spec.idea : summary;
        if (summary.trim() !== '' && sourceIdea.trim() !== '') {
          spec.intent = {
            summary,
            sourceIdea,
            confirmedAt: spec.confirmedAt === null ? '1970-01-01T00:00:00.000Z' : spec.confirmedAt,
          };
        }
      }
      if (
        spec.status === 'confirmed' &&
        (!requiredPresent || (spec.intent !== null && spec.intent.confirmedAt === null))
      ) {
        spec.status = 'draft';
        spec.confirmedAt = null;
      }
      if (spec.status !== 'confirmed') spec.confirmedAt = null;
      if (spec.intent !== null && spec.intent.confirmedAt === null) spec.stage = 'intent';
      else if (spec.status === 'confirmed' || anyFields || spec.intent !== null) {
        spec.stage = 'review';
      } else {
        spec.stage = 'idea';
      }
      if (
        spec.status !== 'confirmed' &&
        spec.intent !== null &&
        spec.idea.trim() !== spec.intent.sourceIdea.trim()
      ) {
        spec.stage = 'idea';
      }
      return spec;
    }

    /** Validate the human-facing planning fields before the confirmation gate. */
    function validateSpec(spec) {
      const safe = spec === null || typeof spec !== 'object' ? emptySpec() : spec;
      const missing = ['goal', 'scope', 'evaluation'].filter(
        (key) => typeof safe[key] !== 'string' || safe[key].trim() === '',
      );
      const maxRoundsInvalid =
        !Number.isInteger(safe.maxRounds) || safe.maxRounds < 1 || safe.maxRounds > MAX_ROUNDS;
      return {
        valid: missing.length === 0 && !maxRoundsInvalid,
        missing,
        maxRoundsInvalid,
      };
    }

    /** Parse a rough idea into stable clues used by every later step. */
    function keywordProfile(text, t) {
      const lower = typeof text === 'string' ? text.toLowerCase() : '';
      const isTests = /(测试|质量|test|spec|coverage|覆盖)/u.test(lower);
      const isPerformance =
        /(性能|速度|延迟|启动|内存|吞吐|performance|latency|speed|memory|startup|load time)/u.test(
          lower,
        );
      const isAuth = /(登录|认证|login|auth|oauth|sso)/u.test(lower);
      const isUi = /(界面|交互|体验|ui|ux|首页|主页|home|landing)/u.test(lower);
      const areas = [];
      const signals = [];
      if (isAuth) areas.push(t('draft.scope.auth'));
      if (isUi) areas.push(t('draft.scope.home'));
      if (isTests) {
        areas.push(t('draft.scope.tests'));
        signals.push(t('draft.evaluation.tests'));
      }
      if (isPerformance) {
        areas.push(t('draft.scope.performance'));
        signals.push(t('draft.evaluation.performance'));
      }
      if (isUi) signals.push(t('draft.evaluation.ui'));
      return { areas, signals };
    }

    /**
     * Turn a rough idea into a complete, editable first draft. This is a local
     * deterministic scaffold: it never pretends to be an LLM, and every field
     * remains editable before confirmation.
     */
    function buildDraft(idea, t) {
      const text = typeof idea === 'string' ? idea.trim() : '';
      const profile = keywordProfile(text, t);
      const areasText =
        profile.areas.length > 0 ? profile.areas.join(t('draft.join')) : t('draft.scope.generic');
      const criteria = [t('draft.evaluation.base'), ...profile.signals];
      const maxRounds = 3;
      return {
        v: 1,
        idea: text,
        stage: 'review',
        goal: text,
        scope: t('draft.scope.template', { areas: areasText }),
        evaluation: criteria.join(t('draft.join')),
        constraints: t('draft.constraints', { maxRounds }),
        maxRounds,
        status: 'draft',
        confirmedAt: null,
      };
    }

    /**
     * Parse the idea into a proofreadable intent. The summary is a clarified
     * goal statement; the four sections are generated only after this intent is
     * confirmed.
     */
    function buildIntent(idea, t) {
      const text = typeof idea === 'string' ? idea.trim() : '';
      const stripped = text.replace(/[。.!！?？\s]+$/u, '');
      const summary = stripped === '' ? '' : t('intent.summary', { idea: stripped });
      return { summary, sourceIdea: text, confirmedAt: null };
    }

    /** Split a confirmed intent into the four planning sections. */
    function buildSpecFromIntent(intent, t, confirmedAt) {
      if (intent === null || typeof intent !== 'object') return null;
      const summary = typeof intent.summary === 'string' ? intent.summary : '';
      const sourceIdea = typeof intent.sourceIdea === 'string' ? intent.sourceIdea : '';
      const draft = buildDraft(summary, t);
      return {
        ...draft,
        idea: sourceIdea,
        goal: summary,
        intent: {
          summary,
          sourceIdea,
          confirmedAt: typeof confirmedAt === 'string' ? confirmedAt : null,
        },
      };
    }

    /**
     * The status model consumed by the panel. Phase 1 has no engine, so it
     * derives an honest idle view: the plan step is active until confirmation,
     * then everything waits for the engine. A future EngineSnapshot replaces
     * this derivation without changing the components.
     */
    function engineView(spec) {
      const safe = spec === null || typeof spec !== 'object' ? emptySpec() : spec;
      const confirmed = safe.status === 'confirmed';
      const stage = confirmed
        ? 'review'
        : safe.stage === 'intent'
          ? 'intent'
          : safe.stage === 'review'
            ? 'review'
            : 'idea';
      const maxRounds =
        stage === 'review' &&
        Number.isInteger(safe.maxRounds) &&
        safe.maxRounds >= 1 &&
        safe.maxRounds <= MAX_ROUNDS
          ? safe.maxRounds
          : 0;
      return {
        status: confirmed
          ? 'waiting'
          : stage === 'idea'
            ? 'idea'
            : stage === 'intent'
              ? 'intent'
              : 'planning',
        phase: confirmed
          ? 'awaiting-engine'
          : stage === 'idea'
            ? 'idea'
            : stage === 'intent'
              ? 'intent'
              : 'plan',
        round: 0,
        maxRounds,
        steps: PHASES.map((id) => ({
          id,
          status: id === 'plan' ? (confirmed ? 'done' : 'active') : 'pending',
        })),
      };
    }

    function nowIso() {
      return new Date().toISOString();
    }

    function makeId() {
      try {
        if (
          typeof globalThis !== 'undefined' &&
          globalThis.crypto &&
          typeof globalThis.crypto.randomUUID === 'function'
        ) {
          return globalThis.crypto.randomUUID();
        }
      } catch {
        /* fall through to a time-based id */
      }
      return 'rsi-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    }

    function emptyWorkspace() {
      return { id: '', path: '', title: '' };
    }

    function normalizeWorkspace(raw) {
      if (raw === null || typeof raw !== 'object') return emptyWorkspace();
      const path = typeof raw.path === 'string' ? raw.path.trim() : '';
      const id = typeof raw.id === 'string' ? raw.id.trim() : '';
      const title = typeof raw.title === 'string' ? raw.title.trim() : '';
      if (path === '' && id === '') return emptyWorkspace();
      return { id: id === '' ? 'path:' + path : id, path, title };
    }

    const RUN_STATUSES = ['running', 'paused', 'failed', 'completed'];

    /**
     * The engine's last report for a project (the EngineSnapshot contract).
     * Phase 1 has no engine, so every project carries run: null; the panel
     * renders execution data only when a real snapshot is present.
     */
    function normalizeRun(raw) {
      if (raw === null || typeof raw !== 'object' || !RUN_STATUSES.includes(raw.status)) return null;
      const maxRounds =
        Number.isInteger(raw.maxRounds) && raw.maxRounds >= 1 && raw.maxRounds <= MAX_ROUNDS
          ? raw.maxRounds
          : null;
      if (maxRounds === null) return null;
      const round = Number.isInteger(raw.round) ? Math.min(Math.max(raw.round, 0), maxRounds) : 0;
      const count = (value) => (Number.isInteger(value) && value >= 0 ? value : 0);
      const tokens =
        raw.tokens !== null && typeof raw.tokens === 'object'
          ? { input: count(raw.tokens.input), output: count(raw.tokens.output) }
          : null;
      const agents =
        raw.agents !== null && typeof raw.agents === 'object'
          ? {
              active: count(raw.agents.active),
              total: Math.max(count(raw.agents.total), count(raw.agents.active)),
            }
          : null;
      return {
        status: raw.status,
        round,
        maxRounds,
        phase: PHASES.includes(raw.phase) ? raw.phase : null,
        tokens,
        agents,
        message: typeof raw.message === 'string' ? raw.message.trim() : '',
        updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
      };
    }

    function emptyProject() {
      return {
        id: makeId(),
        name: '',
        workspace: emptyWorkspace(),
        spec: emptySpec(),
        run: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
    }

    function normalizeProject(raw) {
      if (raw === null || typeof raw !== 'object') return null;
      const spec = normalizeSpec(raw.spec);
      const name = typeof raw.name === 'string' ? raw.name.trim() : '';
      const workspace = normalizeWorkspace(raw.workspace);
      const createdAt =
        typeof raw.createdAt === 'string' && raw.createdAt !== '' ? raw.createdAt : nowIso();
      const updatedAt =
        typeof raw.updatedAt === 'string' && raw.updatedAt !== '' ? raw.updatedAt : createdAt;
      return {
        id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : makeId(),
        name,
        workspace,
        spec,
        run: spec.status === 'confirmed' ? normalizeRun(raw.run) : null,
        createdAt,
        updatedAt,
      };
    }

    /**
     * One user-facing status per project. Engine statuses come only from a run
     * snapshot; without one a project is either planning or ready to start.
     */
    function projectStatus(project) {
      const run = project !== null && typeof project === 'object' ? project.run : null;
      if (run !== null && run !== undefined) return run.status;
      return project.spec.status === 'confirmed' ? 'ready' : 'planning';
    }

    const STATUS_ORDER = ['failed', 'paused', 'running', 'ready', 'planning', 'completed'];
    const SUMMARY_GROUPS = [
      { id: 'all', statuses: STATUS_ORDER },
      { id: 'running', statuses: ['running'] },
      { id: 'attention', statuses: ['failed', 'paused'] },
      { id: 'ready', statuses: ['ready'] },
      { id: 'planning', statuses: ['planning'] },
      { id: 'completed', statuses: ['completed'] },
    ];

    /** Counts per summary group, computed from the whole store, never filtered. */
    function summarize(projects) {
      const list = Array.isArray(projects) ? projects : [];
      const counts = {};
      for (const group of SUMMARY_GROUPS) {
        counts[group.id] = list.filter((project) => group.statuses.includes(projectStatus(project))).length;
      }
      counts.failed = list.filter((project) => projectStatus(project) === 'failed').length;
      counts.paused = list.filter((project) => projectStatus(project) === 'paused').length;
      return counts;
    }

    const LIVE_STATUSES = ['running', 'paused', 'failed'];
    const DONUT_SLICES = 4;

    /**
     * Engine-reported totals across all projects. A metric is null (rendered
     * as "—") when no snapshot reports it; zero is shown only when reported.
     */
    function aggregate(projects) {
      const list = Array.isArray(projects) ? projects : [];
      const runs = list.filter((project) => project.run !== null && project.run !== undefined);
      let input = 0;
      let output = 0;
      let hasTokens = false;
      let active = 0;
      let total = 0;
      let hasAgents = false;
      const shares = [];
      for (const project of runs) {
        const run = project.run;
        if (run.tokens !== null) {
          hasTokens = true;
          input += run.tokens.input;
          output += run.tokens.output;
          const value = run.tokens.input + run.tokens.output;
          if (value > 0) shares.push({ id: project.id, project, value });
        }
        if (run.agents !== null) {
          hasAgents = true;
          if (run.status === 'running' || run.status === 'paused') {
            active += run.agents.active;
            total += run.agents.total;
          }
        }
      }
      shares.sort((a, b) => b.value - a.value);
      const slices = shares.slice(0, DONUT_SLICES);
      const rest = shares.slice(DONUT_SLICES).reduce((sum, item) => sum + item.value, 0);
      if (rest > 0) slices.push({ id: 'other', project: null, value: rest });
      return {
        runCount: runs.length,
        tokens: hasTokens ? { input, output, total: input + output } : null,
        agents: hasAgents ? { active, total } : null,
        slices,
        live: sortProjects(runs.filter((project) => LIVE_STATUSES.includes(project.run.status))),
      };
    }

    /** Compact counts for dense dashboards: 950, 12.3k, 4.1M. */
    function formatCount(value) {
      if (!Number.isFinite(value)) return '—';
      const trim = (text) => text.replace(/\.0$/u, '');
      if (value < 1000) return String(Math.round(value));
      if (value < 1e6) return trim((value / 1000).toFixed(value < 1e4 ? 1 : 0)) + 'k';
      return trim((value / 1e6).toFixed(1)) + 'M';
    }

    /**
     * Clearly labelled sample data so the layout can be reviewed before an
     * engine exists. Never stored, never openable.
     */
    function demoProjects(t) {
      const base = Date.now();
      const at = (minutes) => new Date(base - minutes * 60000).toISOString();
      const workspaces = [
        { id: 'demo-ws-app', path: '/Users/you/app', title: 'app' },
        { id: 'demo-ws-api', path: '/Users/you/api', title: 'api' },
      ];
      const frozen = {
        ...buildSpecFromIntent(buildIntent(t('idea.example.1'), t), t, at(600)),
        status: 'confirmed',
        confirmedAt: at(600),
      };
      const rows = [
        ['running', 2, 5, 'generate', 182000, 41000, 3, 4, ''],
        ['running', 4, 6, 'evaluate', 96000, 22000, 2, 3, ''],
        ['failed', 3, 5, 'evaluate', 64000, 15000, 0, 3, t('demo.failure')],
        ['paused', 1, 4, 'select', 21000, 6000, 0, 2, t('demo.paused')],
        ['completed', 5, 5, 'iterate', 240000, 58000, 0, 4, ''],
      ];
      const projects = rows.map(([status, round, maxRounds, phase, input, output, active, total, message], index) =>
        normalizeProject({
          id: 'demo-' + (index + 1),
          name: t('demo.project', { n: index + 1 }),
          workspace: workspaces[index % 2],
          spec: { ...frozen, maxRounds },
          run: { status, round, maxRounds, phase, tokens: { input, output }, agents: { active, total }, message, updatedAt: at(index * 7 + 2) },
          createdAt: at(900),
          updatedAt: at(index * 7 + 2),
        }),
      );
      projects.push(
        normalizeProject({ id: 'demo-6', name: t('demo.project', { n: 6 }), workspace: workspaces[0], spec: frozen, createdAt: at(900), updatedAt: at(120) }),
        normalizeProject({
          id: 'demo-7',
          name: t('demo.project', { n: 7 }),
          workspace: workspaces[1],
          spec: { ...emptySpec(), idea: t('idea.example.2') },
          createdAt: at(900),
          updatedAt: at(240),
        }),
      );
      return projects;
    }

    /** Most urgent first; within a status, most recently updated first. */
    function sortProjects(projects) {
      return [...projects].sort((a, b) => {
        const rank = STATUS_ORDER.indexOf(projectStatus(a)) - STATUS_ORDER.indexOf(projectStatus(b));
        if (rank !== 0) return rank;
        return String(b.updatedAt).localeCompare(String(a.updatedAt));
      });
    }

    function hasProjectContent(project) {
      if (project === null || typeof project !== 'object') return false;
      const spec = project.spec;
      if (spec === null || typeof spec !== 'object') return false;
      return (typeof spec.idea === 'string' && spec.idea.trim() !== '') || spec.intent !== null;
    }

    function emptyStore() {
      return { v: 2, projects: [], lastUsedWorkspaceId: '' };
    }

    function normalizeStore(raw) {
      if (raw === null || typeof raw !== 'object' || raw.v !== 2) return emptyStore();
      const seen = new Set();
      const projects = [];
      const list = Array.isArray(raw.projects) ? raw.projects : [];
      for (const entry of list) {
        const project = normalizeProject(entry);
        if (project === null || !hasProjectContent(project) || seen.has(project.id)) continue;
        seen.add(project.id);
        projects.push(project);
      }
      return {
        v: 2,
        projects,
        lastUsedWorkspaceId:
          typeof raw.lastUsedWorkspaceId === 'string' ? raw.lastUsedWorkspaceId : '',
      };
    }

    function loadStore(storage) {
      if (storage === null || storage === undefined) return emptyStore();
      let raw = null;
      try {
        raw = storage.getItem(STORAGE_KEY);
      } catch {
        return emptyStore();
      }
      if (typeof raw === 'string' && raw !== '') {
        try {
          return normalizeStore(JSON.parse(raw));
        } catch {
          return emptyStore();
        }
      }
      try {
        const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
        if (typeof legacyRaw === 'string' && legacyRaw !== '') {
          const spec = normalizeSpec(JSON.parse(legacyRaw));
          if (spec.idea.trim() !== '' || spec.intent !== null) {
            return {
              v: 2,
              projects: [
                {
                  id: makeId(),
                  name: '',
                  workspace: emptyWorkspace(),
                  spec,
                  createdAt: nowIso(),
                  updatedAt: nowIso(),
                },
              ],
              lastUsedWorkspaceId: '',
            };
          }
        }
      } catch {
        /* an unreadable legacy copy must not block the board */
      }
      return emptyStore();
    }

    function saveStore(storage, store) {
      if (storage === null || storage === undefined) return false;
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(normalizeStore(store)));
        return true;
      } catch {
        return false;
      }
    }

    function projectTitle(t, project) {
      const name = project !== null && typeof project === 'object' && typeof project.name === 'string'
        ? project.name.trim()
        : '';
      if (name !== '') return name;
      const spec =
        project !== null && typeof project === 'object' && project.spec !== null && typeof project.spec === 'object'
          ? project.spec
          : emptySpec();
      const idea = typeof spec.idea === 'string' ? spec.idea.trim() : '';
      if (idea !== '') {
        const first = idea.split(/\r?\n/u)[0].trim();
        return first.length > 42 ? first.slice(0, 42) + '…' : first;
      }
      if (spec.intent !== null && typeof spec.intent.summary === 'string' && spec.intent.summary.trim() !== '') {
        const summary = spec.intent.summary.trim();
        return summary.length > 42 ? summary.slice(0, 42) + '…' : summary;
      }
      return t('board.untitled');
    }

    function formatWhen(iso) {
      const date = new Date(typeof iso === 'string' ? iso : '');
      if (Number.isNaN(date.getTime())) return '';
      const pad = (value) => String(value).padStart(2, '0');
      return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        ' ' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes())
      );
    }

    function readWorkspaces(api) {
      if (api === null || typeof api !== 'object' || typeof api.list !== 'function') return [];
      try {
        const items = api.list();
        if (!Array.isArray(items)) return [];
        return items
          .map((item) => {
            const path = item !== null && typeof item.path === 'string' ? item.path : '';
            const id = item !== null && typeof item.id === 'string' && item.id !== '' ? item.id : '';
            const title = item !== null && typeof item.title === 'string' ? item.title : '';
            return { id: id === '' ? 'path:' + path : id, path, title };
          })
          .filter((item) => item.path !== '');
      } catch {
        return [];
      }
    }

    function resolveLastWorkspace(store, workspaces) {
      const lastId = store !== null && typeof store === 'object' ? store.lastUsedWorkspaceId : '';
      if (typeof lastId === 'string' && lastId !== '') {
        const fromStore = store.projects.find(
          (project) => project.workspace !== null && project.workspace.id === lastId,
        );
        if (fromStore !== undefined) return fromStore.workspace;
        const fromOptions = workspaces.find((item) => item.id === lastId);
        if (fromOptions !== undefined) return fromOptions;
      }
      return emptyWorkspace();
    }

    function getStorage() {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    }

    function fieldLabel(t, key) {
      return t('field.' + key + '.short');
    }

    function PlannerIcon({ size = 18 }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': true,
          focusable: false,
        },
        h('path', {
          d: 'M5.2 6.4l1.5 1.5 3.1-3.5',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M5.2 12.2l1.5 1.5 3.1-3.5',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M5.2 18l1.5 1.5 3.1-3.5',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M12.5 6.4h3.4M12.5 12.2h2.6M12.5 18h1.8',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M18.6 4.6a7.4 7.4 0 1 1-2.2 10',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M18.6 4.6v3.8m0-3.8h-3.8',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function FieldEditor({ t, id, field, spec, disabled, update }) {
      const hintId = id + '-hint';
      return h(
        React.Fragment,
        null,
        h('p', { className: 'rsi-hint', id: hintId }, t('field.' + field + '.hint')),
        h('textarea', {
          id,
          className: 'rsi-textarea',
          value: spec[field],
          placeholder: t('field.' + field + '.placeholder'),
          disabled,
          rows: 4,
          'aria-label': t('field.' + field + '.label'),
          'aria-describedby': hintId,
          onChange: (event) => update(field, event.target.value),
        }),
      );
    }

    function ConstraintsEditor({ t, spec, disabled, update }) {
      const hintId = 'rsi-constraints-hint';
      const roundsId = 'rsi-max-rounds';
      const roundsHintId = 'rsi-max-rounds-hint';
      return h(
        React.Fragment,
        null,
        h('p', { className: 'rsi-hint', id: hintId }, t('field.constraints.hint')),
        h(
          'div',
          { className: 'rsi-rounds' },
          h('label', { className: 'rsi-rounds-label', htmlFor: roundsId }, t('field.maxRounds.label')),
          h('input', {
            id: roundsId,
            className: 'rsi-input rsi-input--rounds',
            type: 'number',
            min: 1,
            max: MAX_ROUNDS,
            step: 1,
            value:
              spec.maxRounds === null || spec.maxRounds === undefined ? '' : String(spec.maxRounds),
            disabled,
            'aria-describedby': roundsHintId,
            onChange: (event) => {
              const raw = event.target.value;
              const parsed = raw === '' ? null : Number(raw);
              update('maxRounds', Number.isFinite(parsed) ? parsed : null);
            },
          }),
          h('span', { className: 'rsi-unit' }, t('field.maxRounds.unit')),
        ),
        h(
          'p',
          { className: 'rsi-hint rsi-hint--compact', id: roundsHintId },
          t('field.maxRounds.hint'),
        ),
        h('textarea', {
          id: 'rsi-constraints',
          className: 'rsi-textarea',
          value: spec.constraints,
          placeholder: t('field.constraints.placeholder'),
          disabled,
          rows: 4,
          'aria-label': t('field.constraints.label'),
          'aria-describedby': hintId,
          onChange: (event) => update('constraints', event.target.value),
        }),
      );
    }

    function AccordionSection({ t, id, index, title, summary, open, onToggle, children }) {
      return h(
        'section',
        { className: 'rsi-accordion-item' + (open ? ' rsi-accordion-item--open' : '') },
        h(
          'button',
          {
            type: 'button',
            className: 'rsi-accordion-head',
            'aria-expanded': open,
            'aria-controls': id + '-body',
            onClick: onToggle,
          },
          h('span', { className: 'rsi-index', 'aria-hidden': true }, index),
          h('span', { className: 'rsi-accordion-title' }, title),
          h('span', { className: 'rsi-accordion-summary' }, summary || t('accordion.empty')),
          h('span', { className: 'rsi-accordion-mark', 'aria-hidden': true }, open ? '−' : '+'),
        ),
        open ? h('div', { id: id + '-body', className: 'rsi-accordion-body' }, children) : null,
      );
    }

    function isAbsolutePath(value) {
      return typeof value === 'string' && /^(\/|~(\/|$)|[A-Za-z]:[\\/]|\\\\)/u.test(value.trim());
    }

    /** The single user-facing stage of a project: where the planner left off. */
    function projectStage(spec) {
      if (spec === null || typeof spec !== 'object') return 'idea';
      if (spec.status === 'confirmed') return 'confirmed';
      if (spec.intent === null) return 'idea';
      if (spec.idea.trim() !== spec.intent.sourceIdea.trim()) return 'idea';
      if (spec.intent.confirmedAt === null) return 'intent';
      return 'review';
    }

    function workspaceLabel(workspace) {
      if (workspace === null || typeof workspace !== 'object') return '';
      return workspace.title !== '' ? workspace.title : workspace.path;
    }

    /** One header row: the project's workspace, edited in place. */
    function WorkspaceField({ t, workspace, options, locked, onChange, onCreate }) {
      const [editing, setEditing] = React.useState(false);
      const [draft, setDraft] = React.useState('');
      const [error, setError] = React.useState('');
      const [busy, setBusy] = React.useState(false);
      const list = Array.isArray(options) ? options : [];
      const bound = workspace.path !== '';
      const value = bound ? workspaceLabel(workspace) : t('workspace.none');
      const key = h('span', { className: 'rsi-ws-key' }, t('workspace.label'));

      const cancel = () => {
        setEditing(false);
        setDraft('');
        setError('');
      };

      const submit = async () => {
        const path = draft.trim();
        if (path === '' || busy) return;
        if (!isAbsolutePath(path)) {
          setError(t('workspace.notAbsolute'));
          return;
        }
        setBusy(true);
        setError('');
        try {
          onChange(await onCreate(path));
          setEditing(false);
          setDraft('');
        } catch {
          setError(t('workspace.failed'));
        } finally {
          setBusy(false);
        }
      };

      if (locked) {
        return h(
          'div',
          { className: 'rsi-ws', title: workspace.path },
          key,
          h('span', { className: 'rsi-ws-value' + (bound ? '' : ' rsi-ws-value--empty') }, value),
        );
      }

      if (editing) {
        return h(
          'div',
          { className: 'rsi-ws-edit' },
          h(
            'div',
            { className: 'rsi-ws' },
            key,
            h('input', {
              className: 'rsi-input rsi-ws-input',
              type: 'text',
              value: draft,
              autoFocus: true,
              disabled: busy,
              placeholder: t('workspace.pathPlaceholder'),
              'aria-label': t('workspace.label'),
              'aria-invalid': error !== '',
              onChange: (event) => {
                setDraft(event.target.value);
                setError('');
              },
              onKeyDown: (event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void submit();
                } else if (event.key === 'Escape') {
                  event.preventDefault();
                  cancel();
                }
              },
            }),
            h(
              'button',
              {
                type: 'button',
                className: 'rsi-btn rsi-btn--primary rsi-btn--sm',
                disabled: busy || draft.trim() === '',
                onClick: () => void submit(),
              },
              t('workspace.bind'),
            ),
            h(
              'button',
              { type: 'button', className: 'rsi-btn rsi-btn--ghost rsi-btn--sm', disabled: busy, onClick: cancel },
              t('workspace.cancel'),
            ),
          ),
          error !== '' ? h('p', { className: 'rsi-ws-error', role: 'alert' }, error) : null,
        );
      }

      if (list.length === 0) {
        return h(
          'div',
          { className: 'rsi-ws', title: bound ? workspace.path : undefined },
          key,
          h('span', { className: 'rsi-ws-value' + (bound ? '' : ' rsi-ws-value--empty') }, value),
          h(
            'button',
            { type: 'button', className: 'rsi-link', onClick: () => setEditing(true) },
            bound ? t('workspace.change') : t('workspace.choose'),
          ),
        );
      }

      const known = bound && list.some((item) => item.id === workspace.id);
      return h(
        'label',
        { className: 'rsi-ws', title: bound ? workspace.path : undefined },
        key,
        h(
          'span',
          { className: 'rsi-ws-control' },
          h(
            'select',
            {
              className: 'rsi-ws-select' + (bound ? '' : ' rsi-ws-select--empty'),
              value: bound ? workspace.id : '',
              onChange: (event) => {
                const id = event.target.value;
                if (id === OTHER_WORKSPACE) {
                  setEditing(true);
                  return;
                }
                const match = list.find((item) => item.id === id);
                if (match !== undefined) onChange(match);
              },
            },
            bound ? null : h('option', { value: '', disabled: true }, t('workspace.placeholder')),
            bound && !known ? h('option', { value: workspace.id }, value) : null,
            list.map((item) => h('option', { key: item.id, value: item.id }, workspaceLabel(item))),
            h('option', { value: OTHER_WORKSPACE }, t('workspace.other')),
          ),
          h('span', { className: 'rsi-ws-caret', 'aria-hidden': true }, '▾'),
        ),
      );
    }

    /** Idea → intent → spec as one flat list; only the active stage shows its body. */
    function StageList({ t, items }) {
      return h(
        'ol',
        { className: 'rsi-stages', 'aria-label': t('stage.list') },
        items.map((item) =>
          h(
            'li',
            {
              key: item.id,
              className:
                'rsi-stage' +
                (item.active ? ' rsi-stage--active' : '') +
                (item.done ? ' rsi-stage--done' : '') +
                (item.locked ? ' rsi-stage--locked' : ''),
            },
            h(
              'button',
              {
                type: 'button',
                className: 'rsi-stage-head',
                disabled: item.locked,
                'aria-expanded': item.active,
                'aria-controls': 'rsi-stage-' + item.id,
                onClick: () => {
                  if (!item.active && !item.locked) item.onSelect();
                },
              },
              h('span', { className: 'rsi-stage-index', 'aria-hidden': true }, item.done ? '✓' : item.index),
              h('span', { className: 'rsi-stage-title' }, item.title),
              h(
                'span',
                { className: 'rsi-stage-note' },
                item.active ? '' : item.locked ? item.reason : item.summary,
              ),
            ),
            item.active ? h('div', { id: 'rsi-stage-' + item.id, className: 'rsi-stage-body' }, item.content) : null,
          ),
        ),
      );
    }

    function IdeaPane({ t, spec, dirty, readOnly, onIdeaChange, onRevert }) {
      const examples = [t('idea.example.1'), t('idea.example.2'), t('idea.example.3')];
      return h(
        React.Fragment,
        null,
        h('textarea', {
          id: 'rsi-idea',
          className: 'rsi-textarea rsi-idea-input',
          rows: 4,
          value: spec.idea,
          readOnly,
          placeholder: t('idea.placeholder'),
          'aria-label': t('stage.idea'),
          onChange: (event) => onIdeaChange(event.target.value),
        }),
        !readOnly && spec.idea.trim() === ''
          ? h(
              'div',
              { className: 'rsi-chips' },
              h('span', { className: 'rsi-chips-label' }, t('idea.examples')),
              examples.map((example, index) =>
                h(
                  'button',
                  { key: index, type: 'button', className: 'rsi-chip', onClick: () => onIdeaChange(example) },
                  example,
                ),
              ),
            )
          : null,
        dirty
          ? h(
              'p',
              { className: 'rsi-hint rsi-hint--warn' },
              t('idea.dirty') + ' ',
              h('button', { type: 'button', className: 'rsi-link', onClick: onRevert }, t('idea.revert')),
            )
          : null,
      );
    }

    function IntentPane({ t, spec, clues, readOnly, onChange }) {
      return h(
        React.Fragment,
        null,
        h('textarea', {
          id: 'rsi-intent-summary',
          className: 'rsi-textarea rsi-intent-input',
          rows: 4,
          value: spec.intent.summary,
          readOnly,
          'aria-label': t('intent.label'),
          'aria-describedby': 'rsi-intent-hint',
          onChange: (event) => onChange(event.target.value),
        }),
        h('p', { className: 'rsi-hint', id: 'rsi-intent-hint' }, t('intent.hint')),
        h(
          'div',
          { className: 'rsi-chips' },
          h('span', { className: 'rsi-chips-label' }, t('intent.clues')),
          clues.map((clue, index) => h('span', { key: index, className: 'rsi-clue' }, clue)),
        ),
      );
    }

    function SpecPane({ t, spec, disabled, openSection, onToggle, update }) {
      const constraintsSummary = [
        t('field.maxRounds.label'),
        spec.maxRounds === null || spec.maxRounds === undefined ? '—' : String(spec.maxRounds),
        t('field.maxRounds.unit'),
        spec.constraints.trim() === '' ? '' : ' · ' + spec.constraints.trim(),
      ]
        .filter(Boolean)
        .join(' ');
      const sections = [
        { key: 'goal', index: '01', summary: spec.goal },
        { key: 'scope', index: '02', summary: spec.scope },
        { key: 'evaluation', index: '03', summary: spec.evaluation },
        { key: 'constraints', index: '04', summary: constraintsSummary },
      ];
      return h(
        'div',
        { className: 'rsi-accordion' },
        sections.map((section) =>
          h(
            AccordionSection,
            {
              key: section.key,
              t,
              id: 'rsi-section-' + section.key,
              index: section.index,
              title: t('field.' + section.key + '.label'),
              summary: section.summary,
              open: openSection === section.key,
              onToggle: () => onToggle(section.key),
            },
            section.key === 'constraints'
              ? h(ConstraintsEditor, { t, spec, disabled, update })
              : h(FieldEditor, { t, id: 'rsi-' + section.key, field: section.key, spec, disabled, update }),
          ),
        ),
      );
    }

    /** The sticky action bar: the stage's one forward action always lives here. */
    function ActionBar({ copy, warn, lead, children }) {
      return h(
        'div',
        { className: 'rsi-bar' },
        lead !== undefined
          ? lead
          : h('p', { className: 'rsi-bar-copy' + (warn ? ' rsi-bar-copy--warn' : ''), role: 'status' }, copy),
        h('div', { className: 'rsi-bar-actions' }, children),
      );
    }

    function PlannerPage({
      t,
      project,
      onSpecChange,
      onRename,
      onBack,
      workspaces,
      onCreateWorkspace,
      onWorkspaceChange,
      storageFailed,
    }) {
      const spec = project.spec;
      const setSpec = onSpecChange;
      const workspace = normalizeWorkspace(project.workspace);
      const workspaceReady = workspace.path !== '';
      const [ack, setAck] = React.useState(false);
      const [openSection, setOpenSection] = React.useState(null);
      const [activeStep, setActiveStep] = React.useState(() => {
        const stage = projectStage(spec);
        return stage === 'confirmed' ? 'review' : stage;
      });
      const rootRef = React.useRef(null);
      const confirmed = spec.status === 'confirmed';
      const run = project.run !== null && project.run !== undefined ? project.run : null;
      // A running or paused project keeps its frozen spec; editing would orphan the run.
      const runActive = run !== null && (run.status === 'running' || run.status === 'paused');
      const hasIntent = spec.intent !== null;
      const intentConfirmed = hasIntent && spec.intent.confirmedAt !== null;
      const dirty = hasIntent && !confirmed && spec.idea.trim() !== spec.intent.sourceIdea.trim();
      const intentAvailable = hasIntent && !dirty;
      const reviewAvailable = intentAvailable && intentConfirmed;
      const step =
        activeStep === 'review' && !reviewAvailable
          ? intentAvailable
            ? 'intent'
            : 'idea'
          : activeStep === 'intent' && !intentAvailable
            ? 'idea'
            : activeStep;
      const hasFields = [spec.goal, spec.scope, spec.evaluation].some((value) => value.trim() !== '');
      const validation = validateSpec(spec);
      const clueProfile = keywordProfile(hasIntent ? spec.intent.summary : spec.idea, t);
      const clues = [...new Set([...clueProfile.areas, ...clueProfile.signals])];
      if (clues.length === 0) clues.push(t('intent.clue.generic'));

      React.useEffect(() => {
        if (rootRef.current !== null) rootRef.current.scrollTop = 0;
      }, [step]);

      const update = (field, value) => {
        setSpec((previous) => ({ ...previous, [field]: value }));
      };

      const updateIdea = (value) => {
        if (confirmed) return;
        setSpec((previous) => {
          const nextDirty =
            previous.intent !== null && value.trim() !== previous.intent.sourceIdea.trim();
          return { ...previous, idea: value, stage: nextDirty ? 'idea' : previous.stage };
        });
      };

      const parseIntent = () => {
        if (spec.idea.trim() === '' || !workspaceReady || confirmed) return;
        setSpec((previous) => ({
          ...previous,
          intent: buildIntent(previous.idea, t),
          stage: 'intent',
          goal: '',
          scope: '',
          evaluation: '',
          constraints: '',
          maxRounds: 3,
          status: 'draft',
          confirmedAt: null,
        }));
        setActiveStep('intent');
        setAck(false);
        setOpenSection(null);
      };

      const revertIdea = () => {
        setSpec((previous) =>
          previous.intent === null
            ? previous
            : {
                ...previous,
                idea: previous.intent.sourceIdea,
                stage: previous.intent.confirmedAt === null ? 'intent' : 'review',
              },
        );
      };

      const updateIntent = (value) => {
        if (intentConfirmed) return;
        setSpec((previous) =>
          previous.intent === null
            ? previous
            : { ...previous, intent: { ...previous.intent, summary: value, confirmedAt: null }, stage: 'intent' },
        );
      };

      const unlockIntent = () => {
        if (!hasIntent || confirmed) return;
        setSpec((previous) => ({
          ...previous,
          intent: { ...previous.intent, confirmedAt: null },
          stage: 'intent',
          status: 'draft',
          confirmedAt: null,
        }));
        setAck(false);
      };

      const confirmIntent = () => {
        if (!hasIntent || spec.intent.summary.trim() === '') return;
        const generated = buildSpecFromIntent(spec.intent, t, new Date().toISOString());
        if (generated === null) return;
        setSpec((previous) => ({ ...previous, ...generated }));
        setActiveStep('review');
        setAck(false);
        setOpenSection(null);
      };

      const confirm = () => {
        if (confirmed || step !== 'review' || !validation.valid || !ack) return;
        setSpec((previous) => ({
          ...previous,
          stage: 'review',
          status: 'confirmed',
          confirmedAt: new Date().toISOString(),
        }));
        setAck(false);
      };

      const edit = () => {
        setSpec((previous) => ({ ...previous, stage: 'review', status: 'draft', confirmedAt: null }));
        setActiveStep('review');
        setAck(false);
      };

      const roundsText = t('stage.rounds', {
        max: Number.isInteger(spec.maxRounds) ? spec.maxRounds : '—',
      });
      const items = [
        {
          id: 'idea',
          index: '1',
          title: t('stage.idea'),
          summary: spec.idea.trim(),
          done: hasIntent && !dirty,
          locked: false,
          active: step === 'idea',
          onSelect: () => setActiveStep('idea'),
          content: h(IdeaPane, {
            t,
            spec,
            dirty,
            readOnly: confirmed,
            onIdeaChange: updateIdea,
            onRevert: revertIdea,
          }),
        },
        {
          id: 'intent',
          index: '2',
          title: t('stage.intent'),
          summary: hasIntent ? spec.intent.summary.trim() : '',
          done: intentConfirmed && !dirty,
          locked: !intentAvailable,
          reason: dirty ? t('stage.lockedDirty') : t('stage.lockedIntent'),
          active: step === 'intent',
          onSelect: () => setActiveStep('intent'),
          content: hasIntent
            ? h(IntentPane, { t, spec, clues, readOnly: intentConfirmed, onChange: updateIntent })
            : null,
        },
        {
          id: 'review',
          index: '3',
          title: t('stage.review'),
          summary: confirmed ? t('stage.confirmed') + ' · ' + roundsText : roundsText,
          done: confirmed,
          locked: !reviewAvailable,
          reason: dirty ? t('stage.lockedDirty') : t('stage.lockedReview'),
          active: step === 'review',
          onSelect: () => setActiveStep('review'),
          content: h(SpecPane, {
            t,
            spec,
            disabled: confirmed,
            openSection,
            onToggle: (key) => setOpenSection((previous) => (previous === key ? null : key)),
            update,
          }),
        },
      ];

      const primary = (label, onClick, disabled) =>
        h('button', { type: 'button', className: 'rsi-btn rsi-btn--primary', disabled, onClick }, label);
      const ghost = (label, onClick) =>
        h('button', { type: 'button', className: 'rsi-btn rsi-btn--ghost', onClick }, label);

      let bar;
      if (step === 'idea') {
        const forward = hasIntent && !dirty;
        bar = h(
          ActionBar,
          {
            copy: confirmed
              ? t('bar.ideaFrozen')
              : !workspaceReady
                ? t('bar.needWorkspace')
                : forward
                  ? t('bar.ideaUnchanged')
                  : t('bar.idea'),
            warn: !confirmed && !workspaceReady,
          },
          forward
            ? primary(t('bar.continue'), () => setActiveStep(intentConfirmed ? 'review' : 'intent'), false)
            : primary(
                hasIntent ? t('bar.reparse') : t('bar.parse'),
                parseIntent,
                spec.idea.trim() === '' || !workspaceReady,
              ),
        );
      } else if (step === 'intent') {
        if (!intentConfirmed) {
          bar = h(
            ActionBar,
            { copy: hasFields ? t('intent.editWarning') : t('bar.intent'), warn: hasFields },
            primary(t('intent.confirm'), confirmIntent, spec.intent.summary.trim() === ''),
          );
        } else {
          bar = h(
            ActionBar,
            { copy: confirmed ? t('intent.lockedConfirmed') : t('intent.lockedHint') },
            confirmed ? null : ghost(t('intent.unlock'), unlockIntent),
            primary(t('bar.continue'), () => setActiveStep('review'), false),
          );
        }
      } else if (confirmed) {
        bar = h(
          ActionBar,
          {
            lead: h(
              'p',
              { className: 'rsi-bar-done', role: 'status' },
              h('span', { className: 'rsi-bar-check', 'aria-hidden': true }, '✓'),
              run === null ? t('confirmed.banner') : t('confirmed.banner.run', { status: t('status.' + run.status) }),
            ),
          },
          runActive ? null : ghost(t('confirmed.edit'), edit),
        );
      } else {
        const missing = validation.missing.map((key) => fieldLabel(t, key));
        if (validation.maxRoundsInvalid) missing.push(t('validation.maxRounds'));
        const hint = !validation.valid
          ? t('confirm.missing', { fields: missing.join(' · ') })
          : ack
            ? t('confirm.ready')
            : t('confirm.needAck');
        bar = h(
          ActionBar,
          {
            lead: h(
              'label',
              { className: 'rsi-check' },
              h('input', {
                type: 'checkbox',
                checked: ack,
                onChange: (event) => setAck(event.target.checked),
              }),
              h('span', null, t('confirm.ack')),
            ),
          },
          h(
            'p',
            { className: 'rsi-confirm-hint' + (validation.valid ? '' : ' rsi-confirm-hint--error') },
            hint,
          ),
          primary(t('confirm.action'), confirm, !validation.valid || !ack),
        );
      }

      return h(
        'div',
        { ref: rootRef, className: 'rsi-root' },
        h(
          'div',
          { className: 'rsi-shell' },
          h(
            'header',
            { className: 'rsi-detail-head' },
            h('button', { type: 'button', className: 'rsi-back', onClick: onBack }, t('detail.back')),
            h(
              'div',
              { className: 'rsi-title-row' },
              h('input', {
                className: 'rsi-title-input',
                value: project.name,
                readOnly: confirmed,
                placeholder: projectTitle(t, { ...project, name: '' }),
                'aria-label': t('a11y.rename'),
                onChange: (event) => onRename(event.target.value),
              }),
              h(
                'span',
                { className: 'rsi-badge' + (confirmed ? ' rsi-badge--confirmed' : '') },
                confirmed ? t('badge.confirmed') : t('badge.draft'),
              ),
            ),
            h(WorkspaceField, {
              t,
              workspace,
              options: workspaces,
              locked: confirmed,
              onChange: onWorkspaceChange,
              onCreate: onCreateWorkspace,
            }),
          ),
          h(StageList, { t, items }),
          storageFailed ? h('p', { className: 'rsi-storage-warn', role: 'status' }, t('persistence.failed')) : null,
          bar,
        ),
      );
    }

    const DONUT_COLORS = [
      'var(--dsw-alias-brand-primary)',
      'var(--dsw-alias-state-business-primary)',
      'var(--dsw-alias-state-success-primary)',
      'var(--dsw-alias-state-warn-primary)',
      'var(--dsw-alias-label-tertiary)',
    ];
    const PROGRESS_LIMIT = 6;

    function Meter({ status, round, max, label }) {
      return h(
        'span',
        {
          className: 'rsi-meter rsi-meter--' + status,
          role: 'progressbar',
          'aria-valuemin': 0,
          'aria-valuemax': max,
          'aria-valuenow': round,
          'aria-label': label,
        },
        h('span', { className: 'rsi-meter-fill', style: { width: (max > 0 ? (round / max) * 100 : 0) + '%' } }),
      );
    }

    /** Four headline numbers: what runs, who works, what it costs, what needs me. */
    function MetricTiles({ t, counts, stats }) {
      const tiles = [
        {
          id: 'running',
          label: t('metric.running'),
          value: String(counts.running),
          sub: t('metric.runningSub', { total: counts.all }),
        },
        {
          id: 'agents',
          label: t('metric.agents'),
          value: stats.agents === null ? '—' : String(stats.agents.active),
          sub: stats.agents === null ? t('metric.noData') : t('metric.agentsSub', { total: stats.agents.total }),
        },
        {
          id: 'tokens',
          label: t('metric.tokens'),
          value: stats.tokens === null ? '—' : formatCount(stats.tokens.total),
          sub:
            stats.tokens === null
              ? t('metric.noData')
              : t('metric.tokensSub', { input: formatCount(stats.tokens.input), output: formatCount(stats.tokens.output) }),
        },
        {
          id: 'attention',
          label: t('metric.attention'),
          value: String(counts.attention),
          sub: t('metric.attentionSub', { failed: counts.failed, paused: counts.paused }),
        },
      ];
      return h(
        'section',
        { className: 'rsi-metrics', 'aria-label': t('dash.metrics') },
        tiles.map((tile) =>
          h(
            'div',
            { key: tile.id, className: 'rsi-metric rsi-metric--' + tile.id + (tile.value === '—' ? ' rsi-metric--empty' : '') },
            h('span', { className: 'rsi-metric-label' }, tile.label),
            h('strong', { className: 'rsi-metric-value' }, tile.value),
            h('span', { className: 'rsi-metric-sub' }, tile.sub),
          ),
        ),
      );
    }

    /** Horizontal bars: round progress of every running, paused or failed project. */
    function ProgressPanel({ t, live, onOpen, onDemo }) {
      const shown = live.slice(0, PROGRESS_LIMIT);
      return h(
        'section',
        { className: 'rsi-panel rsi-panel--progress', 'aria-labelledby': 'rsi-panel-progress' },
        h('h2', { id: 'rsi-panel-progress', className: 'rsi-panel-title' }, t('panel.progress')),
        shown.length === 0
          ? h(
              'div',
              { className: 'rsi-panel-empty' },
              h('p', null, t('panel.progressEmpty')),
              typeof onDemo === 'function'
                ? h('button', { type: 'button', className: 'rsi-link', onClick: onDemo }, t('demo.open'))
                : null,
            )
          : h(
              'ul',
              { className: 'rsi-bars' },
              shown.map((project) => {
                const run = project.run;
                const title = projectTitle(t, project);
                const label = t('card.round', { round: run.round, max: run.maxRounds });
                return h(
                  'li',
                  { key: project.id },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'rsi-bar-row' + (onOpen === null ? ' rsi-bar-row--static' : ''),
                      'aria-disabled': onOpen === null ? true : undefined,
                      onClick: () => {
                        if (onOpen !== null) onOpen(project);
                      },
                    },
                    h(
                      'span',
                      { className: 'rsi-bar-name' },
                      h('span', { className: 'rsi-dot rsi-dot--' + run.status, 'aria-hidden': true }),
                      h('span', { className: 'rsi-bar-text', title }, title),
                    ),
                    h(Meter, { status: run.status, round: run.round, max: run.maxRounds, label: title + ' · ' + label }),
                    h(
                      'span',
                      { className: 'rsi-bar-value' },
                      run.round + '/' + run.maxRounds + (run.phase === null ? '' : ' · ' + t('phase.' + run.phase)),
                    ),
                  ),
                );
              }),
            ),
        live.length > shown.length
          ? h('p', { className: 'rsi-panel-foot' }, t('panel.more', { count: live.length - shown.length }))
          : null,
      );
    }

    function Donut({ slices, total, label }) {
      const radius = 42;
      const circumference = 2 * Math.PI * radius;
      let offset = 0;
      return h(
        'svg',
        { className: 'rsi-donut', viewBox: '0 0 120 120', role: 'img', 'aria-label': label },
        h('circle', { className: 'rsi-donut-track', cx: 60, cy: 60, r: radius }),
        slices.map((slice, index) => {
          const length = total > 0 ? (slice.value / total) * circumference : 0;
          const node = h('circle', {
            key: slice.id,
            className: 'rsi-donut-slice',
            cx: 60,
            cy: 60,
            r: radius,
            style: { stroke: DONUT_COLORS[Math.min(index, DONUT_COLORS.length - 1)] },
            strokeDasharray: Math.max(length - 1.5, 0) + ' ' + circumference,
            strokeDashoffset: -offset,
            transform: 'rotate(-90 60 60)',
          });
          offset += length;
          return node;
        }),
        h('text', { className: 'rsi-donut-total', x: 60, y: 58, textAnchor: 'middle' }, formatCount(total)),
        h('text', { className: 'rsi-donut-caption', x: 60, y: 74, textAnchor: 'middle' }, 'tokens'),
      );
    }

    /** Donut: which projects consumed the tokens. */
    function TokenPanel({ t, stats }) {
      const total = stats.tokens === null ? 0 : stats.tokens.total;
      return h(
        'section',
        { className: 'rsi-panel rsi-panel--tokens', 'aria-labelledby': 'rsi-panel-tokens' },
        h('h2', { id: 'rsi-panel-tokens', className: 'rsi-panel-title' }, t('panel.tokens')),
        stats.slices.length === 0
          ? h('div', { className: 'rsi-panel-empty' }, h('p', null, t('panel.tokensEmpty')))
          : h(
              'div',
              { className: 'rsi-donut-wrap' },
              h(Donut, { slices: stats.slices, total, label: t('a11y.donut', { total: formatCount(total) }) }),
              h(
                'ul',
                { className: 'rsi-legend' },
                stats.slices.map((slice, index) =>
                  h(
                    'li',
                    { key: slice.id, className: 'rsi-legend-row' },
                    h('span', {
                      className: 'rsi-swatch',
                      style: { background: DONUT_COLORS[Math.min(index, DONUT_COLORS.length - 1)] },
                      'aria-hidden': true,
                    }),
                    h(
                      'span',
                      { className: 'rsi-legend-name' },
                      slice.project === null ? t('panel.other') : projectTitle(t, slice.project),
                    ),
                    h('span', { className: 'rsi-legend-value' }, formatCount(slice.value)),
                    h(
                      'span',
                      { className: 'rsi-legend-pct' },
                      Math.round((slice.value / total) * 100) + '%',
                    ),
                  ),
                ),
              ),
            ),
      );
    }

    function TaskCard({ t, project, onOpen, onDelete }) {
      const status = projectStatus(project);
      const workspace = normalizeWorkspace(project.workspace);
      const title = projectTitle(t, project);
      const run = project.run !== undefined ? project.run : null;
      const interactive = typeof onOpen === 'function';
      const deletable = interactive && typeof onDelete === 'function' && status !== 'running' && status !== 'paused';
      const rounds = Number.isInteger(project.spec.maxRounds) ? project.spec.maxRounds : '—';
      let body;
      if (run !== null) {
        const label = t('card.round', { round: run.round, max: run.maxRounds });
        const usage = [];
        if (run.tokens !== null) usage.push(t('card.tokens', { value: formatCount(run.tokens.input + run.tokens.output) }));
        if (run.agents !== null) usage.push(t('card.agents', { active: run.agents.active, total: run.agents.total }));
        body = h(
          'span',
          { className: 'rsi-progress' },
          h(Meter, { status: run.status, round: run.round, max: run.maxRounds, label }),
          h('span', { className: 'rsi-progress-text' }, run.phase === null ? label : label + ' · ' + t('phase.' + run.phase)),
          usage.length > 0 ? h('span', { className: 'rsi-task-usage' }, usage.join(' · ')) : null,
        );
      } else if (status === 'ready') {
        body = h('span', { className: 'rsi-task-line' }, t('card.ready', { max: rounds }));
      } else {
        body = h('span', { className: 'rsi-task-line' }, t('card.planning', { stage: t('stage.' + projectStage(project.spec)) }));
      }
      return h(
        'article',
        { className: 'rsi-task rsi-task--' + status + (interactive ? '' : ' rsi-task--static') },
        h(
          'button',
          {
            type: 'button',
            className: 'rsi-task-open',
            'aria-disabled': interactive ? undefined : true,
            onClick: () => {
              if (interactive) onOpen();
            },
          },
          h(
            'span',
            { className: 'rsi-task-status' },
            h('span', { className: 'rsi-dot rsi-dot--' + status, 'aria-hidden': true }),
            t('status.' + status),
          ),
          h('span', { className: 'rsi-task-title' }, title),
          body,
          run !== null && run.message !== '' && (status === 'failed' || status === 'paused')
            ? h('span', { className: 'rsi-task-message rsi-task-message--' + status }, run.message)
            : null,
          h(
            'span',
            { className: 'rsi-task-meta' },
            h(
              'span',
              {
                className: 'rsi-task-ws' + (workspace.path === '' ? ' rsi-task-ws--empty' : ''),
                title: workspace.path === '' ? undefined : workspace.path,
              },
              workspace.path === '' ? t('workspace.noneLong') : workspaceLabel(workspace),
            ),
            h('span', { className: 'rsi-task-time' }, formatWhen(run !== null && run.updatedAt !== '' ? run.updatedAt : project.updatedAt)),
          ),
        ),
        deletable
          ? h(
              'button',
              { type: 'button', className: 'rsi-task-delete', 'aria-label': t('board.deleteNamed', { name: title }), onClick: onDelete },
              t('board.delete'),
            )
          : null,
      );
    }

    /** Status filter for the task list; counts always cover all projects. */
    function FilterTabs({ t, counts, filter, onFilter }) {
      return h(
        'div',
        { className: 'rsi-tabs', role: 'group', 'aria-label': t('dash.filter') },
        SUMMARY_GROUPS.map((group) =>
          h(
            'button',
            {
              key: group.id,
              type: 'button',
              className: 'rsi-tab' + (filter === group.id ? ' rsi-tab--active' : ''),
              'aria-pressed': filter === group.id,
              disabled: group.id !== 'all' && counts[group.id] === 0 && filter !== group.id,
              onClick: () => onFilter(filter === group.id ? 'all' : group.id),
            },
            t('summary.' + group.id),
            h('span', { className: 'rsi-tab-count' }, String(counts[group.id])),
          ),
        ),
      );
    }

    function DashboardPage({
      t,
      projects: storedProjects,
      removed,
      onNew,
      onOpen,
      onDelete,
      onUndo,
      onDismiss,
      backToConversation,
      storageFailed,
    }) {
      const [demo, setDemo] = React.useState(false);
      const [filter, setFilter] = React.useState('all');
      const [query, setQuery] = React.useState('');
      const [workspaceId, setWorkspaceId] = React.useState('');
      const demoList = React.useMemo(() => (demo ? demoProjects(t) : null), [demo, t]);
      const projects = demoList !== null ? demoList : storedProjects;
      const counts = summarize(projects);
      const stats = aggregate(projects);
      const empty = projects.length === 0;
      const workspaceOptions = [];
      for (const project of projects) {
        const workspace = normalizeWorkspace(project.workspace);
        if (workspace.path !== '' && !workspaceOptions.some((item) => item.id === workspace.id)) workspaceOptions.push(workspace);
      }
      const showSearch = projects.length >= SEARCH_THRESHOLD;
      const showWorkspaceFilter = workspaceOptions.length >= 2;
      const statuses = SUMMARY_GROUPS.find((group) => group.id === filter).statuses;
      const needle = query.trim().toLowerCase();
      const visible = sortProjects(projects).filter((project) => {
        if (!statuses.includes(projectStatus(project))) return false;
        if (showWorkspaceFilter && workspaceId !== '' && normalizeWorkspace(project.workspace).id !== workspaceId) return false;
        if (needle === '') return true;
        return [projectTitle(t, project), project.spec.idea, normalizeWorkspace(project.workspace).path]
          .join('\n')
          .toLowerCase()
          .includes(needle);
      });
      const filtered = filter !== 'all' || needle !== '' || (showWorkspaceFilter && workspaceId !== '');
      const resetFilters = () => {
        setFilter('all');
        setQuery('');
        setWorkspaceId('');
      };
      const toggleDemo = (next) => {
        resetFilters();
        setDemo(next);
      };
      const open = demo ? null : onOpen;

      return h(
        'div',
        { className: 'rsi-root' },
        h(
          'div',
          { className: 'rsi-shell rsi-shell--wide' },
          h(
            'header',
            { className: 'rsi-board-head' },
            h('h1', { className: 'rsi-board-title' }, t('board.title')),
            h(
              'div',
              { className: 'rsi-board-actions' },
              typeof backToConversation === 'function'
                ? h('button', { type: 'button', className: 'rsi-btn rsi-btn--ghost', onClick: backToConversation }, t('page.back'))
                : null,
              empty ? null : h('button', { type: 'button', className: 'rsi-btn rsi-btn--primary', onClick: onNew }, t('board.new')),
            ),
          ),
          demo
            ? h(
                'div',
                { className: 'rsi-notice rsi-notice--demo', role: 'status' },
                h('span', { className: 'rsi-notice-text' }, t('demo.banner')),
                h('button', { type: 'button', className: 'rsi-link', onClick: () => toggleDemo(false) }, t('demo.exit')),
              )
            : removed !== null && removed !== undefined
              ? h(
                  'div',
                  { className: 'rsi-notice', role: 'status' },
                  h('span', { className: 'rsi-notice-text' }, t('board.deleted', { name: projectTitle(t, removed.project) })),
                  h('button', { type: 'button', className: 'rsi-link', onClick: onUndo }, t('board.undo')),
                  h('button', { type: 'button', className: 'rsi-notice-close', 'aria-label': t('board.dismiss'), onClick: onDismiss }, '×'),
                )
              : null,
          empty
            ? h(
                'section',
                { className: 'rsi-empty' },
                h('h2', { className: 'rsi-empty-title' }, t('board.empty.title')),
                h('p', { className: 'rsi-empty-hint' }, t('board.empty.hint')),
                h('button', { type: 'button', className: 'rsi-btn rsi-btn--primary', onClick: onNew }, t('board.new')),
                h('button', { type: 'button', className: 'rsi-link', onClick: () => toggleDemo(true) }, t('demo.open')),
              )
            : h(
                React.Fragment,
                null,
                h(MetricTiles, { t, counts, stats }),
                h(
                  'div',
                  { className: 'rsi-charts' },
                  h(ProgressPanel, {
                    t,
                    live: stats.live,
                    onOpen: open,
                    onDemo: demo || stats.runCount > 0 ? null : () => toggleDemo(true),
                  }),
                  h(TokenPanel, { t, stats }),
                ),
                h(
                  'section',
                  { className: 'rsi-tasks', 'aria-labelledby': 'rsi-tasks-title' },
                  h(
                    'div',
                    { className: 'rsi-tasks-head' },
                    h('h2', { id: 'rsi-tasks-title', className: 'rsi-panel-title' }, t('tasks.title')),
                    h(FilterTabs, { t, counts, filter, onFilter: setFilter }),
                  ),
                  showSearch || showWorkspaceFilter
                    ? h(
                        'div',
                        { className: 'rsi-toolbar' },
                        showSearch
                          ? h('input', {
                              className: 'rsi-input rsi-search',
                              type: 'search',
                              value: query,
                              placeholder: t('dash.search'),
                              'aria-label': t('dash.search'),
                              onChange: (event) => setQuery(event.target.value),
                            })
                          : null,
                        showWorkspaceFilter
                          ? h(
                              'select',
                              {
                                className: 'rsi-filter-select',
                                value: workspaceId,
                                'aria-label': t('workspace.label'),
                                onChange: (event) => setWorkspaceId(event.target.value),
                              },
                              h('option', { value: '' }, t('dash.allWorkspaces')),
                              workspaceOptions.map((item) => h('option', { key: item.id, value: item.id }, workspaceLabel(item))),
                            )
                          : null,
                      )
                    : null,
                  visible.length === 0
                    ? h(
                        'div',
                        { className: 'rsi-filter-empty' },
                        h('span', null, t('dash.filterEmpty')),
                        filtered ? h('button', { type: 'button', className: 'rsi-link', onClick: resetFilters }, t('dash.clearFilters')) : null,
                      )
                    : h(
                        'div',
                        { className: 'rsi-grid' },
                        visible.map((project) =>
                          h(TaskCard, {
                            key: project.id,
                            t,
                            project,
                            onOpen: open === null ? null : () => open(project),
                            onDelete: demo ? null : () => onDelete(project.id),
                          }),
                        ),
                      ),
                ),
              ),
          storageFailed ? h('p', { className: 'rsi-storage-warn', role: 'status' }, t('persistence.failed')) : null,
        ),
      );
    }

    class PlannerBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }

      static getDerivedStateFromError(error) {
        return { error };
      }

      componentDidCatch(error, info) {
        console.error('dsh-RSI planner crashed', error, info);
      }

      render() {
        if (this.state.error === null) return this.props.children;
        const t = this.props.t;
        const message =
          this.state.error && this.state.error.message
            ? String(this.state.error.message)
            : String(this.state.error);
        return h(
          'div',
          { className: 'rsi-root' },
          h(
            'div',
            { className: 'rsi-shell' },
            h(
              'div',
              { className: 'rsi-card rsi-error' },
              h('h1', { className: 'rsi-error-title' }, t ? t('error.title') : 'Planner failed'),
              h(
                'p',
                { className: 'rsi-error-detail' },
                t ? t('error.detail', { message }) : message,
              ),
              h(
                'div',
                { className: 'rsi-error-actions' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'rsi-btn rsi-btn--primary',
                    onClick: () => this.setState({ error: null }),
                  },
                  t ? t('error.retry') : 'Retry',
                ),
                typeof this.props.onBack === 'function'
                  ? h(
                      'button',
                      {
                        type: 'button',
                        className: 'rsi-btn rsi-btn--ghost',
                        onClick: this.props.onBack,
                      },
                      t ? t('error.back') : 'Back',
                    )
                  : null,
              ),
            ),
          ),
        );
      }
    }

    function PlannerApp({ t, backToConversation, workspaceApi }) {
      const [store, setStore] = React.useState(() => loadStore(getStorage()));
      const [active, setActive] = React.useState(null);
      const [removed, setRemoved] = React.useState(null);
      const [storageFailed, setStorageFailed] = React.useState(false);
      const [workspaces, setWorkspaces] = React.useState(() => readWorkspaces(workspaceApi));

      React.useEffect(() => {
        if (
          workspaceApi === null ||
          typeof workspaceApi !== 'object' ||
          typeof workspaceApi.subscribe !== 'function'
        ) {
          return undefined;
        }
        const dispose = workspaceApi.subscribe(() => setWorkspaces(readWorkspaces(workspaceApi)));
        return typeof dispose === 'function' ? dispose : undefined;
      }, [workspaceApi]);

      React.useEffect(() => {
        const storage = getStorage();
        setStorageFailed(storage === null || !saveStore(storage, store));
      }, [store]);

      // A project is saved as soon as it has content; nothing typed is ever lost.
      React.useEffect(() => {
        if (active === null || !hasProjectContent(active.project)) return;
        const project = active.project;
        setStore((previous) => {
          const exists = previous.projects.some((item) => item.id === project.id);
          return {
            ...previous,
            projects: exists
              ? previous.projects.map((item) => (item.id === project.id ? project : item))
              : [...previous.projects, project],
            lastUsedWorkspaceId:
              project.workspace.id !== '' ? project.workspace.id : previous.lastUsedWorkspaceId,
          };
        });
      }, [active]);

      const patchActive = (patch) => {
        setActive((previous) =>
          previous === null
            ? previous
            : { project: { ...previous.project, ...patch(previous.project), updatedAt: nowIso() } },
        );
      };

      const openProject = (project) => {
        setRemoved(null);
        setActive({ project });
      };

      const startNew = () => {
        setRemoved(null);
        const project = emptyProject();
        project.workspace = resolveLastWorkspace(store, workspaces);
        setActive({ project });
      };

      const closeProject = () => {
        if (active !== null && !hasProjectContent(active.project)) {
          const id = active.project.id;
          setStore((previous) => ({
            ...previous,
            projects: previous.projects.filter((item) => item.id !== id),
          }));
        }
        setActive(null);
      };

      const deleteProject = (id) => {
        const index = store.projects.findIndex((item) => item.id === id);
        if (index < 0) return;
        setRemoved({ project: store.projects[index], index });
        setStore((previous) => ({
          ...previous,
          projects: previous.projects.filter((item) => item.id !== id),
        }));
      };

      const undoDelete = () => {
        if (removed === null) return;
        const { project, index } = removed;
        setStore((previous) => {
          if (previous.projects.some((item) => item.id === project.id)) return previous;
          const projects = [...previous.projects];
          projects.splice(Math.min(index, projects.length), 0, project);
          return { ...previous, projects };
        });
        setRemoved(null);
      };

      const createWorkspace = async (path) => {
        if (workspaceApi !== null && typeof workspaceApi === 'object' && typeof workspaceApi.create === 'function') {
          const created = normalizeWorkspace(await workspaceApi.create(path));
          if (created.path === '') throw new Error('workspace creation returned no path');
          return created;
        }
        return normalizeWorkspace({ path });
      };

      if (active !== null) {
        return h(PlannerPage, {
          key: active.project.id,
          t,
          project: active.project,
          onSpecChange: (updater) =>
            patchActive((project) => {
              const spec = typeof updater === 'function' ? updater(project.spec) : updater;
              // A run belongs to one frozen spec; reopening the spec ends that association.
              return { spec, run: spec.status === 'confirmed' ? project.run : null };
            }),
          onRename: (name) => patchActive(() => ({ name })),
          onBack: closeProject,
          workspaces,
          onCreateWorkspace: createWorkspace,
          onWorkspaceChange: (workspace) => patchActive(() => ({ workspace: normalizeWorkspace(workspace) })),
          storageFailed,
        });
      }

      return h(DashboardPage, {
        t,
        projects: store.projects,
        removed,
        onNew: startNew,
        onOpen: openProject,
        onDelete: deleteProject,
        onUndo: undoDelete,
        onDismiss: () => setRemoved(null),
        backToConversation,
        storageFailed,
      });
    }

    function PlannerRoot(props) {
      return h(
        React.Fragment,
        null,
        h('style', { key: 'dsh-rsi-styles' }, CSS),
        h(PlannerBoundary, { t: props.t, onBack: props.backToConversation }, h(PlannerApp, props)),
      );
    }

    const CSS = `.rsi-root {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: calc(var(--dsh-frame-top-clearance, 0px) + 24px) 32px 0;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  -webkit-font-smoothing: antialiased;
}
.rsi-shell { display: flex; flex-direction: column; box-sizing: border-box; max-width: 820px; min-height: 100%; margin: 0 auto; padding-bottom: 20px; }
.rsi-btn { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 14px; border: 1px solid transparent; border-radius: var(--dsw-radius-md); font: inherit; font-size: 13px; font-weight: 600; line-height: 1; white-space: nowrap; cursor: pointer; transition: background-color 0.15s ease, border-color 0.15s ease; }
.rsi-btn--primary { background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-label-primary-foreground); }
.rsi-btn--primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }
.rsi-btn--ghost { border-color: var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-primary); }
.rsi-btn--ghost:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.rsi-btn--sm { padding: 7px 10px; font-size: 12px; }
.rsi-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.rsi-link { appearance: none; padding: 0; border: 0; background: none; color: var(--dsw-alias-brand-primary); font: inherit; font-size: 12.5px; font-weight: 600; white-space: nowrap; cursor: pointer; }
.rsi-link:hover { text-decoration: underline; }
.rsi-input, .rsi-textarea { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: inherit; font-size: 13.5px; line-height: 1.55; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.rsi-textarea { min-height: 84px; resize: vertical; }
.rsi-input::placeholder, .rsi-textarea::placeholder { color: var(--dsw-alias-label-tertiary); }
.rsi-input:disabled, .rsi-textarea:disabled, .rsi-textarea[readonly] { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); cursor: default; }
.rsi-input:focus, .rsi-textarea:focus { outline: none; border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 var(--dsw-focus-ring-width) var(--dsw-focus-ring-color); }
.rsi-hint { margin: 8px 0 0; font-size: 12px; line-height: 1.55; color: var(--dsw-alias-label-secondary); }
.rsi-hint--compact { margin: 6px 0 10px; font-size: 11.5px; color: var(--dsw-alias-label-tertiary); }
.rsi-hint--warn { color: var(--dsw-alias-state-warn-primary); }
.rsi-storage-warn { margin: 12px 0 0; font-size: 12px; color: var(--dsw-alias-state-warn-primary); }

.rsi-board-head { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
.rsi-board-title { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
.rsi-board-actions { display: flex; gap: 8px; margin-left: auto; }
.rsi-shell--wide { max-width: 1080px; }
.rsi-metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
.rsi-metric { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 14px 16px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-layer-2); }
.rsi-metric-label { font-size: 12px; color: var(--dsw-alias-label-secondary); }
.rsi-metric-value { font-family: var(--dsw-font-mono); font-size: 26px; font-weight: 600; line-height: 1.15; letter-spacing: -0.02em; }
.rsi-metric-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11.5px; color: var(--dsw-alias-label-tertiary); }
.rsi-metric--running .rsi-metric-value { color: var(--dsw-alias-brand-primary); }
.rsi-metric--attention .rsi-metric-value { color: var(--dsw-alias-state-error-primary); }
.rsi-metric--empty .rsi-metric-value { color: var(--dsw-alias-label-tertiary); }
.rsi-charts { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 10px; margin-bottom: 24px; }
.rsi-panel { display: flex; flex-direction: column; min-width: 0; min-height: 200px; padding: 14px 16px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-layer-2); }
.rsi-panel-title { margin: 0 0 12px; font-size: 13px; font-weight: 600; }
.rsi-panel-empty { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 12px; text-align: center; }
.rsi-panel-empty p { max-width: 40ch; margin: 0; font-size: 12px; line-height: 1.6; color: var(--dsw-alias-label-tertiary); }
.rsi-panel-foot { margin: 8px 0 0; font-size: 11.5px; color: var(--dsw-alias-label-tertiary); }
.rsi-bars { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; list-style: none; }
.rsi-bar-row { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 2fr) 92px; align-items: center; gap: 12px; width: calc(100% + 16px); margin: 0 -8px; padding: 7px 8px; border: 0; border-radius: var(--dsw-radius-md); background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.rsi-bar-row:hover { background: var(--dsw-alias-interactive-bg-hover); }
.rsi-bar-row--static, .rsi-task--static .rsi-task-open { cursor: default; }
.rsi-bar-row--static:hover { background: transparent; }
.rsi-bar-name { display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 12.5px; }
.rsi-bar-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rsi-bar-value { font-family: var(--dsw-font-mono); font-size: 11.5px; text-align: right; white-space: nowrap; color: var(--dsw-alias-label-secondary); }
.rsi-meter { display: block; overflow: hidden; height: 8px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); }
.rsi-meter-fill { display: block; height: 100%; border-radius: inherit; background: var(--dsw-alias-brand-primary); }
.rsi-meter--paused .rsi-meter-fill { background: var(--dsw-alias-state-warn-primary); }
.rsi-meter--failed .rsi-meter-fill { background: var(--dsw-alias-state-error-primary); }
.rsi-meter--completed .rsi-meter-fill { background: var(--dsw-alias-state-success-primary); }
.rsi-donut-wrap { display: flex; flex: 1; align-items: center; gap: 18px; min-width: 0; }
.rsi-donut { flex: none; width: 132px; height: 132px; }
.rsi-donut-track { fill: none; stroke: var(--dsw-alias-bg-layer-3); stroke-width: 14; }
.rsi-donut-slice { fill: none; stroke-width: 14; }
.rsi-donut-total { fill: var(--dsw-alias-label-primary); font-family: var(--dsw-font-mono); font-size: 17px; font-weight: 600; }
.rsi-donut-caption { fill: var(--dsw-alias-label-tertiary); font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; }
.rsi-legend { display: flex; flex: 1; flex-direction: column; gap: 7px; min-width: 0; margin: 0; padding: 0; list-style: none; }
.rsi-legend-row { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto 36px; align-items: center; gap: 8px; font-size: 12px; }
.rsi-swatch { width: 10px; height: 10px; border-radius: 3px; }
.rsi-legend-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rsi-legend-value, .rsi-legend-pct { font-family: var(--dsw-font-mono); font-size: 11.5px; text-align: right; color: var(--dsw-alias-label-secondary); }
.rsi-legend-pct { color: var(--dsw-alias-label-tertiary); }
.rsi-tasks-head { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
.rsi-tasks-head .rsi-panel-title { margin: 0; font-size: 14px; }
.rsi-tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-left: auto; }
.rsi-tab { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer; }
.rsi-tab:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.rsi-tab:disabled { opacity: 0.45; cursor: default; }
.rsi-tab--active { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); font-weight: 600; }
.rsi-tab-count { font-family: var(--dsw-font-mono); font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.rsi-filter-empty { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 28px; border: 1px dashed var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); font-size: 12.5px; color: var(--dsw-alias-label-tertiary); }
.rsi-progress { display: flex; flex-direction: column; gap: 6px; }
.rsi-progress-text { font-family: var(--dsw-font-mono); font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.rsi-task-usage { font-family: var(--dsw-font-mono); font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.rsi-task-message--paused { color: var(--dsw-alias-state-warn-primary); }
.rsi-notice--demo { border-color: var(--dsw-alias-state-business-primary); }
.rsi-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.rsi-search { flex: 1 1 240px; max-width: 360px; padding: 7px 10px; font-size: 12.5px; }
.rsi-filter-select { padding: 7px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: inherit; font-size: 12.5px; }
.rsi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
.rsi-task { position: relative; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-2); transition: border-color 0.15s ease; }
.rsi-task:hover, .rsi-task:focus-within { border-color: var(--dsw-alias-border-l3); }
.rsi-task--failed { border-color: var(--dsw-alias-state-error-primary); }
.rsi-task-open { display: flex; flex-direction: column; gap: 8px; width: 100%; height: 100%; box-sizing: border-box; padding: 12px 14px; border: 0; border-radius: inherit; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.rsi-task-status { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
.rsi-task-title { padding-right: 40px; font-size: 13.5px; font-weight: 600; line-height: 1.4; overflow-wrap: anywhere; }
.rsi-task-line { font-size: 12px; color: var(--dsw-alias-label-secondary); }
.rsi-task-message { display: -webkit-box; overflow: hidden; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-state-error-primary); -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.rsi-task-meta { display: flex; align-items: center; gap: 8px; margin-top: auto; font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.rsi-task-ws { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rsi-task-ws--empty { color: var(--dsw-alias-state-warn-primary); }
.rsi-task-time { flex: none; margin-left: auto; font-family: var(--dsw-font-mono); }
.rsi-task-delete { position: absolute; top: 8px; right: 8px; padding: 3px 6px; border: 0; border-radius: var(--dsw-radius-md); background: transparent; color: var(--dsw-alias-label-tertiary); font: inherit; font-size: 11.5px; cursor: pointer; opacity: 0; transition: opacity 0.15s ease; }
.rsi-task:hover .rsi-task-delete, .rsi-task:focus-within .rsi-task-delete { opacity: 1; }
.rsi-task-delete:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-state-error-primary); }
@media (hover: none) { .rsi-task-delete { opacity: 1; } }
.rsi-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--dsw-alias-label-tertiary); }
.rsi-dot--running { background: var(--dsw-alias-brand-primary); }
.rsi-dot--paused { background: var(--dsw-alias-state-warn-primary); }
.rsi-dot--failed { background: var(--dsw-alias-state-error-primary); }
.rsi-dot--completed { background: var(--dsw-alias-state-success-primary); }
.rsi-dot--ready { background: var(--dsw-alias-state-business-primary); }
.rsi-notice { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; padding: 8px 10px 8px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-2); font-size: 12.5px; }
.rsi-notice-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rsi-notice-close { width: 24px; height: 24px; padding: 0; border: 0; border-radius: var(--dsw-radius-md); background: transparent; color: var(--dsw-alias-label-tertiary); font: inherit; font-size: 16px; line-height: 1; cursor: pointer; }
.rsi-notice-close:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.rsi-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 12vh; text-align: center; }
.rsi-empty-title { margin: 0; font-size: 15px; font-weight: 600; }
.rsi-empty-hint { max-width: 44ch; margin: 0 0 6px; font-size: 12.5px; line-height: 1.6; color: var(--dsw-alias-label-secondary); }

.rsi-detail-head { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 16px; }
.rsi-back { appearance: none; padding: 2px 0; border: 0; background: none; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12.5px; cursor: pointer; }
.rsi-back::before { content: "← "; }
.rsi-back:hover { color: var(--dsw-alias-label-primary); }
.rsi-title-row { display: flex; align-items: center; gap: 10px; width: 100%; }
.rsi-title-input { flex: 1; min-width: 0; margin-left: -6px; padding: 2px 6px; border: 1px solid transparent; border-radius: var(--dsw-radius-md); background: transparent; color: var(--dsw-alias-label-primary); font: inherit; font-size: 20px; font-weight: 600; line-height: 1.3; }
.rsi-title-input::placeholder { color: var(--dsw-alias-label-secondary); }
.rsi-title-input:not([readonly]):hover { border-color: var(--dsw-alias-border-l2); }
.rsi-title-input:focus { outline: none; border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 var(--dsw-focus-ring-width) var(--dsw-focus-ring-color); }
.rsi-badge { flex: none; padding: 2px 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.rsi-badge--confirmed { color: var(--dsw-alias-state-success-primary); }
.rsi-ws { display: flex; align-items: center; gap: 8px; max-width: 100%; font-size: 12.5px; }
.rsi-ws-key { flex: none; color: var(--dsw-alias-label-tertiary); }
.rsi-ws-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary); }
.rsi-ws-value--empty { color: var(--dsw-alias-state-warn-primary); }
.rsi-ws-control { position: relative; display: inline-flex; min-width: 0; }
.rsi-ws-select { appearance: none; min-width: 0; max-width: 460px; margin-left: -6px; padding: 3px 22px 3px 6px; border: 1px solid transparent; border-radius: var(--dsw-radius-md); background: transparent; color: var(--dsw-alias-label-primary); font: inherit; font-size: 12.5px; text-overflow: ellipsis; cursor: pointer; }
.rsi-ws-select:hover { border-color: var(--dsw-alias-border-l2); }
.rsi-ws-select--empty { color: var(--dsw-alias-state-warn-primary); }
.rsi-ws-caret { position: absolute; top: 50%; right: 7px; font-size: 10px; color: var(--dsw-alias-label-tertiary); pointer-events: none; transform: translateY(-50%); }
.rsi-ws-edit { display: flex; flex-direction: column; gap: 4px; width: 100%; }
.rsi-ws-input { flex: 1; min-width: 0; padding: 6px 10px; font-size: 12.5px; }
.rsi-ws-error { margin: 0; font-size: 12px; color: var(--dsw-alias-state-error-primary); }

.rsi-stages { margin: 0 0 20px; padding: 0; border-top: 1px solid var(--dsw-alias-border-l2); list-style: none; }
.rsi-stage { border-bottom: 1px solid var(--dsw-alias-border-l2); }
.rsi-stage-head { display: grid; grid-template-columns: 22px auto minmax(0, 1fr); align-items: center; gap: 10px; width: calc(100% + 16px); margin: 0 -8px; padding: 12px 8px; border: 0; border-radius: var(--dsw-radius-md); background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.rsi-stage-head:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.rsi-stage--active .rsi-stage-head { cursor: default; }
.rsi-stage--active .rsi-stage-head:hover { background: transparent; }
.rsi-stage-head:disabled { cursor: not-allowed; }
.rsi-stage-index { display: grid; place-items: center; width: 22px; height: 22px; border: 1px solid var(--dsw-alias-border-l3); border-radius: 50%; font-family: var(--dsw-font-mono); font-size: 10.5px; color: var(--dsw-alias-label-secondary); }
.rsi-stage--done .rsi-stage-index { border-color: var(--dsw-alias-state-success-primary); background: var(--dsw-alias-state-success-primary); color: var(--dsw-alias-label-primary-foreground); }
.rsi-stage--active .rsi-stage-index { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground); }
.rsi-stage-title { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
.rsi-stage--locked .rsi-stage-title { color: var(--dsw-alias-label-tertiary); }
.rsi-stage-note { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.rsi-stage-body { padding: 0 0 18px 32px; }
.rsi-idea-input { min-height: 120px; font-size: 14px; }
.rsi-intent-input { min-height: 100px; font-size: 14px; }
.rsi-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 10px; }
.rsi-chips-label { margin-right: 2px; font-size: 11.5px; color: var(--dsw-alias-label-tertiary); }
.rsi-chip { appearance: none; padding: 4px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 11.5px; line-height: 1.4; cursor: pointer; }
.rsi-chip:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.rsi-clue { padding: 3px 8px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); font-size: 11px; color: var(--dsw-alias-label-secondary); }

.rsi-accordion { overflow: hidden; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md); }
.rsi-accordion-item + .rsi-accordion-item { border-top: 1px solid var(--dsw-alias-border-l2); }
.rsi-accordion-head { display: grid; grid-template-columns: 24px minmax(96px, auto) minmax(0, 1fr) 18px; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.rsi-accordion-head:hover { background: var(--dsw-alias-interactive-bg-hover); }
.rsi-accordion-title { font-size: 13px; font-weight: 600; white-space: nowrap; }
.rsi-accordion-summary { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.rsi-accordion-mark { font-family: var(--dsw-font-mono); font-size: 15px; text-align: center; color: var(--dsw-alias-label-tertiary); }
.rsi-accordion-body { padding: 0 14px 14px; }
.rsi-accordion-body > .rsi-hint:first-child { margin: 0 0 8px; }
.rsi-index { font-family: var(--dsw-font-mono); font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.rsi-rounds { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.rsi-rounds-label { font-size: 13px; font-weight: 500; color: var(--dsw-alias-label-secondary); }
.rsi-input--rounds { width: 80px; padding: 7px 10px; text-align: center; font-family: var(--dsw-font-mono); font-size: 13px; }
.rsi-unit { font-size: 12px; color: var(--dsw-alias-label-tertiary); }

.rsi-bar { position: sticky; bottom: 12px; z-index: 4; display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: auto; padding: 10px 12px 10px 14px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-layer-2); box-shadow: var(--dsw-elevation-prominent); }
.rsi-bar-copy { flex: 1 1 240px; margin: 0; font-size: 12.5px; line-height: 1.5; color: var(--dsw-alias-label-secondary); }
.rsi-bar-copy--warn { color: var(--dsw-alias-state-warn-primary); }
.rsi-bar-actions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin-left: auto; }
.rsi-bar-done { display: flex; align-items: center; gap: 8px; flex: 1 1 240px; margin: 0; font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-state-success-primary); }
.rsi-bar-check { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--dsw-alias-state-success-primary); color: var(--dsw-alias-label-primary-foreground); font-size: 11px; }
.rsi-check { display: flex; flex: 1 1 300px; align-items: flex-start; gap: 10px; font-size: 12.5px; line-height: 1.5; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.rsi-check input { flex: none; width: 15px; height: 15px; margin: 2px 0 0; accent-color: var(--dsw-alias-brand-primary); }
.rsi-confirm-hint { margin: 0; font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.rsi-confirm-hint--error { color: var(--dsw-alias-state-error-primary); }

.rsi-btn:focus-visible, .rsi-link:focus-visible, .rsi-back:focus-visible, .rsi-chip:focus-visible, .rsi-stage-head:focus-visible, .rsi-accordion-head:focus-visible, .rsi-task-open:focus-visible, .rsi-task-delete:focus-visible, .rsi-tab:focus-visible, .rsi-bar-row:focus-visible, .rsi-filter-select:focus-visible, .rsi-notice-close:focus-visible, .rsi-ws-select:focus-visible, .rsi-check input:focus-visible { outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color); outline-offset: 2px; }
.rsi-stage-head:focus-visible, .rsi-accordion-head:focus-visible, .rsi-task-open:focus-visible { outline-offset: -2px; }
.rsi-card { padding: 20px; border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-layer-2); }
.rsi-error { max-width: 560px; margin: 10vh auto 0; }
.rsi-error-title { margin: 0 0 8px; font-size: 18px; }
.rsi-error-detail { margin: 0 0 16px; font-family: var(--dsw-font-mono); font-size: 12px; line-height: 1.6; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.rsi-error-actions { display: flex; flex-wrap: wrap; gap: 10px; }

@media (max-width: 900px) {
  .rsi-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rsi-charts { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 640px) {
  .rsi-tabs { margin-left: 0; }
  .rsi-bar-row { grid-template-columns: minmax(0, 1fr) 80px; }
  .rsi-bar-row .rsi-meter { grid-column: 1 / -1; grid-row: 2; }
  .rsi-donut-wrap { flex-direction: column; align-items: stretch; }
  .rsi-donut { align-self: center; }
  .rsi-root { padding: calc(var(--dsh-frame-top-clearance, 0px) + 16px) 16px 0; }
  .rsi-search { max-width: none; }
  .rsi-board-actions { width: 100%; margin-left: 0; }
  .rsi-stage-body { padding-left: 0; }
  .rsi-accordion-head { grid-template-columns: 24px minmax(0, 1fr) 18px; }
  .rsi-accordion-summary { display: none; }
  .rsi-ws-select { max-width: 62vw; }
  .rsi-bar-actions { width: 100%; margin-left: 0; }
  .rsi-bar-actions .rsi-btn { flex: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .rsi-btn, .rsi-input, .rsi-textarea, .rsi-task, .rsi-task-delete { transition: none; }
}
`;

    function apply(ctx) {
      const t = ctx.locale.bind(NS);
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-RSI: dictionaries');
      const workspaceService = () => {
        try {
          return typeof ctx.get === 'function' ? ctx.get('workspaces') : null;
        } catch {
          return null;
        }
      };
      const workspaceApi = {
        list: () => {
          try {
            const service = workspaceService();
            const snapshot =
              service !== null &&
              service.list !== undefined &&
              typeof service.list.getSnapshot === 'function'
                ? service.list.getSnapshot()
                : null;
            const items = snapshot !== null && Array.isArray(snapshot.items) ? snapshot.items : [];
            return items.map((item) => ({
              id: typeof item.workspaceId === 'string' ? item.workspaceId : '',
              path: typeof item.path === 'string' ? item.path : '',
              title: typeof item.title === 'string' ? item.title : '',
            }));
          } catch {
            return [];
          }
        },
        subscribe: (listener) => {
          try {
            const service = workspaceService();
            if (
              service !== null &&
              service.list !== undefined &&
              typeof service.list.subscribe === 'function'
            ) {
              return service.list.subscribe(listener);
            }
          } catch {
            /* no workspace service: fall back to a static list */
          }
          return () => {};
        },
        create: async (path) => {
          const service = workspaceService();
          // A host failure propagates so the UI can report it; only a missing
          // service falls back to binding the directory path directly.
          if (service !== null && typeof service.create === 'function') {
            const created = await service.create({ path });
            const id =
              created !== null && typeof created === 'object' ? created.workspaceId || created.id || '' : '';
            return {
              id: typeof id === 'string' ? id : '',
              path,
              title:
                created !== null && typeof created === 'object' && typeof created.title === 'string'
                  ? created.title
                  : '',
            };
          }
          return { id: 'path:' + path, path, title: '' };
        },
      };
      const face = {
        backToConversation: () => ctx.layout.selectPanel(null),
        workspaceApi,
      };
      ctx.slots.inject('main', () =>
        ctx.slots.register(
          {
            name: 'main',
            key: PANEL_ID,
            locale: NS,
            inject: () => face,
          },
          PlannerRoot,
        ),
      );
      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 20,
            label: () => t('panel'),
            locale: NS,
          },
          PlannerIcon,
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply,
      __test: {
        emptySpec,
        normalizeSpec,
        validateSpec,
        keywordProfile,
        buildDraft,
        buildIntent,
        buildSpecFromIntent,
        engineView,
        emptyWorkspace,
        normalizeWorkspace,
        emptyProject,
        normalizeProject,
        emptyStore,
        normalizeStore,
        loadStore,
        saveStore,
        projectTitle,
        formatWhen,
        readWorkspaces,
        resolveLastWorkspace,
        STORAGE_KEY,
        LEGACY_STORAGE_KEY,
        MAX_ROUNDS,
        PHASES,
        projectStage,
        projectStatus,
        normalizeRun,
        summarize,
        sortProjects,
        aggregate,
        formatCount,
        demoProjects,
        isAbsolutePath,
        components: { DashboardPage, TaskCard, MetricTiles, ProgressPanel, TokenPanel, PlannerPage, WorkspaceField, StageList },
        dictionaries: { zh, en },
      },
    };
  },
});

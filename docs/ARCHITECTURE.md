# dsh-RSI 架构设计

> 状态：Phase 1（规划器与状态骨架）
> 更新：2026-11-05

## 1. 系统上下文

```
┌──────────────────────── DSH Web GUI ────────────────────────┐
│  Sidebar                                                     │
│    └─ rsi-planner（递归自进化入口）                            │
│  main / rsi-planner                                          │
│    ├─ DashboardPage（数据面板：概览 + 任务卡片）                    │
│    └─ PlannerPage（项目详情：想法 / 意图 / 规范 三段展开）       │
└───────────────┬─────────────────────────────────────────────┘
                │ Phase 1: localStorage（ProjectStore v2）
                │ Phase 2+: EngineSnapshot（真实状态）
┌───────────────▼─────────────────────────────────────────────┐
│ DSH Host                                                     │
│  host/index.js（Phase 1 为空 apply）                          │
│  Phase 2+: Self-Improvement Engine                           │
│    generate → evaluate → select → rewrite → iterate          │
└───────────────┬─────────────────────────────────────────────┘
                │
        Workspace（修改空间 + 评估 + 回滚）
```

Phase 1 刻意让 Host 半区保持空。面板可以在没有引擎、没有 Host 服务、没有聊天会话的情况下独立工作。工作区绑定只读取宿主暴露的 `workspaces` 客户端服务（列表/创建），服务不可用时降级为手填目录路径。

## 2. DSH 插件组合

### 2.1 Bundle

`package.json` 声明：

- `dsh.bundle.patch` → `cordis.patch.yml`
- `dsh.client.platform: web`
- `dsh.client.immediately: true`
- `dsh.client.inject` 先加载 `locale`、`layout`、`sidebar` 的客户端模块

`cordis.patch.yml` 插入一行 Host 插件：

```yaml
- insert:
    - id: dsh-rsi
      name: 'dsh-RSI'
```

Host 入口 `host/index.js` 只导出空的 `apply()`，用于让 bundle 合法挂载；引擎在 Phase 2 挂到这里。

### 2.2 浏览器半区注册

`client/client.js` 通过 `window.__ModuleLoader__.load({ id, factory })` 注册，`id` 与包名一致（`dsh-RSI`）。

`apply(ctx)` 做三件事：

1. 注册 `rsiPlanner` 字典。
2. 注册 `main` keyed slot：`key = 'rsi-planner'`，并通过 `inject()` 传入 `backToConversation` 与 `workspaceApi`。
3. 注册 `sidebar.panellist`：`id = 'rsi-planner'`，点击后由侧栏调用 `ctx.layout.selectPanel('rsi-planner')`。

侧栏入口与主面板使用同一个 id；这是 DSH 全局页面的标准组合方式。

`workspaceApi` 是对 `ctx.get('workspaces')` 的窄包装：`list()` 读取快照、`subscribe()` 转发变更、`create({ path })` 创建目录工作区。服务缺席或抛错时返回空列表与 `path:` 兜底绑定，面板不因此不可用。

**只使用的服务**：`slots`、`locale`、`layout`，以及可选的 `workspaces` 客户端服务。不使用 `sessions`、`remote`、`webServer`。

### 2.3 生命周期

- 字典注册、slot 注册都由 `apply` 的 Cordis 上下文拥有；卸载时自动释放。
- 组件样式以 `<style>` 随组件挂载/卸载，不写 `document.body`。
- 无定时器、无轮询、无全局事件监听；唯一副作用是 localStorage 写入。

## 3. 目录结构

```
dsh-RSI/
├── package.json
├── cordis.patch.yml
├── host/
│   └── index.js          # 本阶段空 apply；Phase 2 引擎挂载点
├── client/
│   └── client.js         # 数据面板、项目详情、规范模型、样式、字典
├── locale/
│   ├── zh.json
│   └── en.json
├── icon.svg
├── docs/
│   ├── DESIGN.md
│   └── ARCHITECTURE.md
├── test/
│   └── smoke.mjs
└── README.md
```

Phase 1 不创建 `src/`、`dist/`、`engine/` 空目录。未来引擎模块在 Phase 2 按实际需要创建：

```
host/
  index.js
  engine/
    loop.js         # 轮次调度与状态机
    generate.js     # 候选生成
    evaluate.js     # 评估执行
    select.js       # 接受/拒绝/排序
    rewrite.js      # 改写与修复
    snapshot.js     # EngineSnapshot 上报
```

## 4. 数据模型：ProjectStore v2 与 EvolutionSpec v1

### 4.0 ProjectStore v2（项目台账）

面板唯一的数据根是一个版本化台账，`localStorage` 单 key：

```json
{
  "v": 2,
  "projects": [
    {
      "id": "uuid",
      "name": "可选的人工命名",
      "workspace": { "id": "宿主工作区 id 或 path:<目录>", "path": "/abs/path", "title": "显示名" },
      "spec": { "…EvolutionSpec v1…": "见 4.1" },
      "run": null,
      "createdAt": "ISO",
      "updatedAt": "ISO"
    }
  ],
  "lastUsedWorkspaceId": "w1"
}
```

约束：

- 项目 `id` 唯一；无内容（`idea` 为空且 `intent` 为 null）的项目不写入台账。
- `workspace` 与项目 1:1；`path` 必填，`id` 缺省补成 `path:<path>`。
- `spec` 归一化规则与 4.2 完全一致，单个项目损坏只影响该项目。
- `run` 是引擎对该项目的最新快照（`status: running | paused | failed | completed`、`round`、`maxRounds`、`phase`、`tokens: { input, output }`、`agents: { active, total }`、`message`、`updatedAt`），Phase 1 恒为 `null`。`tokens` 与 `agents` 可缺省；缺省时面板对应指标显示「—」。只有 `spec.status = confirmed` 的项目保留 `run`；规范被返回修改时，`run` 立即清空。
- 面板只从 `run` 读取执行信息。派生状态 `projectStatus`：有 `run` 取 `run.status`；否则规范已确认为 `ready`，其余为 `planning`。概览计数 `summarize` 与排序 `sortProjects` 都基于这一状态。全局指标由 `aggregate` 计算：Token 汇总全部快照，Agent 只汇总运行中与暂停的快照，环形图取 Token 前 4 名加「其他」，条形图取运行中、暂停、失败的项目。
- 项目出现第一段想法即写入台账；返回面板时，被清空的项目从台账移除。

### 4.1 Schema

```json
{
  "v": 1,
  "idea": "原始想法的文本",
  "intent": {
    "summary": "可校对的意图理解",
    "sourceIdea": "解析时使用的想法",
    "confirmedAt": null
  },
  "stage": "idea",
  "goal": "string",
  "scope": "string",
  "evaluation": "string",
  "constraints": "string",
  "maxRounds": 3,
  "status": "draft",
  "confirmedAt": null
}
```

| 字段 | 语义 | 约束 |
|---|---|---|
| `v` | 规范格式版本 | 当前固定为 `1` |
| `idea` | 用户输入的大致想法 | 可空；解析与改写的来源 |
| `intent.summary` | 用户校对后的意图理解 | 非空；成为规范目标 |
| `intent.sourceIdea` | 解析时使用的想法 | 用于检测想法是否被修改 |
| `intent.confirmedAt` | 意图确认时间 | 仅确认意图后存在 |
| `stage` | `idea` / `intent` / `review` | 由数据推导，不单独信任旧值 |
| `goal` | 优化目标（最终状态） | 确认时必填，非空白 |
| `scope` | 允许修改的目录/文件/模块 | 确认时必填，非空白 |
| `evaluation` | 成功标准 | 确认时必填，非空白 |
| `constraints` | 时间/预算/安全/其他限制 | 可空 |
| `maxRounds` | 最大迭代轮次 | 整数 1–20 |
| `status` | `draft` / `confirmed` | 确认后冻结 |
| `confirmedAt` | ISO 时间字符串 | 仅 `confirmed` 时存在 |

`goal / scope / evaluation` 目前是自由文本。它们是人类的规划语言，不是引擎的机器指令；引擎在 Phase 2 读取时需要自己的解析/校验层，不能假设文本已经结构化。

### 4.1.1 想法 → 意图 → 规范

Phase 1 用两个纯函数分离「理解」与「形式化」：

- `buildIntent(idea, t)`：
  - 去掉想法末尾标点，套用 `intent.summary` 模板，生成一段可校对的「我的理解」；
  - 记录 `sourceIdea` 与 `confirmedAt: null`；
  - 不生成四段规范，不调用模型。
- `buildSpecFromIntent(intent, t, confirmedAt)`：
  - 只用校对后的 `intent.summary` 走 `keywordProfile`，得到修改区域与成功信号；
  - 生成 `goal = intent.summary`、`scope`、`evaluation`、默认 `constraints`；
  - `stage = review`，`status = draft`，写入 `intent.confirmedAt`。

意图页还会用 `keywordProfile` 展示解析线索（登录/首页/测试/性能），让用户知道下一阶段会重点处理什么。修改「我的理解」后，`intent.confirmedAt` 会被清空，必须重新确认。

兼容旧数据：已有四段字段但缺少 `intent` 的规范，`normalizeSpec` 会用 `goal`/`idea` 合成一个已确认的 legacy intent（`confirmedAt` 使用 `1970-01-01T00:00:00.000Z` 作为迁移标记），使意图页仍可回看，并在修改想法时正确标记过期。

它**不调用模型**。这样做的原因是 Phase 1 没有引擎或 LLM 通道；使用确定性模板可以保证离线可用、可测试，并明确告诉用户这是「意图校对/初稿」而非智能规划。用户可以在确认前修改理解，并在确认后展开任意段落改写。

### 4.2 校验规则

确认前必须同时满足：

- `goal.trim()`、`scope.trim()`、`evaluation.trim()` 非空；
- `maxRounds` 为 1–20 的整数；
- 用户勾选确认框。

加载本地规范时：

- JSON 解析失败、版本不是 1、字段类型不符 → 回到空草稿；
- `maxRounds` 非法 → 回退为 3；
- `status = confirmed` 但必填字段为空，或引用的意图尚未确认 → 回退为 `draft`，并清空 `confirmedAt`；
- `intent` 存在但 `confirmedAt` 为空 → `stage = intent`；
- 有任何规划字段，或 `intent` 已确认 → `stage = review`；
- `idea` 与 `intent.sourceIdea` 不一致 → `stage = idea`（提示重新解析或恢复）；
- 其他情况 → `stage = idea`。

### 4.3 持久化

```text
localStorage key: dsh-RSI.projects.v2        # 项目台账
legacy key:       dsh-RSI.evolution-spec.v1  # 仅用于迁移，保留不删
```

- 每次修改项目（想法、意图、规范、名称、工作区）在提交后写入整份台账；台账写入前归一化并过滤空项目。
- 旧 key 只在 v2 不存在时读取一次，迁移成一个没有工作区的项目；迁移结果随首次保存写入 v2。
- 有内容的项目随每次修改写入；被清空的项目在返回面板时移除，面板不会出现空项目。
- 删除先从台账移除，面板提供「撤销」把项目放回原位置；关闭提示或打开其他项目后不可撤销。
- 刷新后回到面板；打开中的项目不单独持久化。
- 写入失败不阻塞 UI，页脚显示「浏览器存储不可用」。
- 多标签页不保证同步；最后一个写入者获胜。Phase 2 迁移到 Host 存储后消除该限制。

### 4.4 迁移路径

Phase 2 建议的迁移：

1. 面板启动时优先读取 Host 的规范存储；
2. Host 没有时，读取 localStorage 中的 v1 规范并提交；
3. 提交成功后删除/标记本地副本；
4. Host 存储带版本号，未来结构变更走迁移函数，不直接覆盖。

## 5. EngineSnapshot 契约（Phase 2）

面板未来只消费这一形状，不自行推断状态：

```ts
interface EngineSnapshot {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  round: number;
  maxRounds: number;
  phase: 'plan' | 'generate' | 'evaluate' | 'select' | 'rewrite' | 'iterate';
  steps: Array<{
    id: string;
    label?: string;
    status: 'pending' | 'active' | 'done' | 'failed';
  }>;
  updatedAt: string;
}
```

Phase 1 的 `engineView(spec)` 是一个**诚实的降级实现**：

- `stage: 'idea'` → `status: 'idea'`、`phase: 'idea'`，规划步骤 active，轮次 `0 / —`；
- `stage: 'intent'` → `status: 'intent'`、`phase: 'intent'`，规划步骤 active，轮次 `0 / —`；
- `stage: 'review'`（draft）→ `status: 'planning'`、`phase: 'plan'`，规划步骤 active，轮次 0 / N；
- `confirmed` → `status: 'waiting'`、`phase: 'awaiting-engine'`，规划步骤 done，轮次 0 / N。

组件已经按 `EngineSnapshot` 的形状渲染；Phase 2 只需把 `engineView` 的结果替换为引擎快照，不改 UI 结构。

## 6. 数据流

### Phase 1

```
用户输入一句想法
  → buildIntent(idea, t)：可校对的「我的理解」+ sourceIdea
  → stage = intent；用户校对 / 修改
  → 确认意图（intent.confirmedAt）
  → buildSpecFromIntent(intent, t)：goal / scope / evaluation / constraints
  → stage = review，四段折叠为摘要
  → 用户展开调整 → normalize/validate
  → localStorage（EvolutionSpec v1）
  → engineView(spec)（降级状态）
  → StatusStrip / StatusDetails 渲染
```

点击想法段只切换展开的阶段，不改变 `stage`；如果想法被修改，`idea` 与 `intent.sourceIdea` 不一致，页面要求重新解析或恢复，避免下游规范与想法脱节。

意图确认只改变 `intent.confirmedAt` 并生成四段规范；规范确认只改变 `status/confirmedAt`。两者都不触发执行。`idea`、`intent` 与 `stage` 一起持久化。

### Phase 2+

```
用户确认
  → EvolutionSpec 提交给 Host
  → RSI Engine 读取规范
  → 每轮生成/评估/选择/改写
  → EngineSnapshot 推送
  → PlannerPage 订阅快照
  → StatusPanel / 轮次条 / 步骤管线更新
```

## 7. 自进化引擎边界（Phase 2+）

### 7.1 循环

```
读取已确认规范
  → 生成候选
  → 评估候选
  → 选择或拒绝
  → 改写/修复
  → 记录本轮结果
  → 未达上限且未成功 → 下一轮
```

### 7.2 必须遵守的约束

- **只读/可写边界**：引擎只能修改 `scope` 允许的路径；越界必须拒绝并记录。
- **最大轮次**：`maxRounds` 是硬上限，不能由模型自行延长。
- **评估门**：未通过评估的候选不得进入工作区最终状态。
- **可回滚**：每轮开始前保留回滚点；失败可恢复。
- **人工确认**：规范确认与启动执行是两个动作，启动需要单独授权。
- **可观测**：每轮记录生成内容、评估结果、选择理由、耗时与失败原因。

### 7.3 传输层（未决）

| 方案 | 优点 | 代价 |
|---|---|---|
| DSH Remote 命名空间 | 类型化、复用 DSH 鉴权、可流式 | 需要 Typert/构建链，第三方纯 JS 插件成本高 |
| 插件自有同源 HTTP + SSE | 无需构建，DSH 内已有先例 | 需要自行做同源校验、限流、事件协议 |

Phase 2 根据「实时进度 + 取消 + 多客户端」需求一次性选型；Phase 1 不实现任何传输层，避免空壳。

## 8. 安全与失败边界

| 风险 | Phase 1 处理 |
|---|---|
| 本地规范损坏 | 解析/校验失败回到空草稿 |
| 存储不可用 | 内存继续，页脚提示 |
| 确认后误改 | 字段冻结，需显式返回修改 |
| 引擎未接入却显示进度 | 状态来自 `engineView` 降级实现，明确「未接入」 |
| 组件异常 | React 错误边界兜底 + 返回会话 |
| 包名大写安装失败 | 回退包名/module id 为 `dsh-rsi`，UI 不变 |

Phase 2+ 需要补充：

- 规范来源认证（确认动作绑定真实用户）；
- 引擎运行权限与沙箱；
- 越界修改拦截；
- 评估结果不可伪造；
- 轮次/成本配额；
- 失败回滚与审计日志。

## 9. 测试与验证

### 9.1 自动检查

`npm run check`：

- 语法：`node --check host/index.js`、`node --check client/client.js`
- 清单：exports / files / bundle patch / client 声明
- 元信息：locale 键集合与 `meta`、icon 合法性
- 注册：捕获 `__ModuleLoader__` 注册并执行 `apply(fakeCtx)`，断言 `sidebar.panellist` 与 `main` 的 id/key
- 模型：`emptySpec` / `normalizeSpec` / `validateSpec` / `keywordProfile` / `buildIntent` / `buildSpecFromIntent` / `buildDraft` / `engineView` / `emptyProject` / `normalizeProject` / `emptyStore` / `normalizeStore` / `loadStore` / `saveStore` / `projectTitle` / `resolveLastWorkspace`
- 约束：客户端只 require `react`，不导入 `@deepseek-ai/` Client 包，不含固定 hex 颜色
- 文档：两份 docs 存在且包含关键章节

### 9.2 安装后

`desktop` profile 由 Electron 应用独占，命令行 `dsh --profile desktop --dump-config` 会拒绝执行（`profile "desktop" is managed exclusively by the Electron application`）。安装后改为检查：

- 插件页的「已安装插件/组件行」中是否出现 `dsh-RSI` 与 `dsh-rsi` 行；
- `~/.dsh/profiles/desktop/package.json` 是否新增依赖与 `dsh.profile.bundles` 条目；
- `~/.dsh/profiles/desktop/node_modules/dsh-RSI` 是否链接到本仓库；
- 刷新页面后侧栏与面板是否出现、控制台是否有加载错误。

### 9.3 人工验收

- 侧栏入口出现，点击后先看到数据面板；空状态只有一个「新建项目」按钮；有项目时显示 6 个概览计数与任务卡片；
- 新建项目后进入详情：页头有「返回面板」、项目名输入、工作区路径与状态徽标；
- 想法段第一块是工作区选择：未选工作区时「解析意图」禁用并提示原因；
- 选择或手填工作区后输入想法，「解析意图」才可用；输入想法后项目即出现在面板「规划中」；
- 意图段显示「我的理解」与解析线索；可修改理解；规范生成后默认只读，点「修改意图」才解锁（已确认规范需先返回修改）；
- 三级手风琴：只有当前段展开；未满足前置条件的段禁用并提示；点击可切换；
- 修改想法后，意图/规范段禁用；恢复或重新解析后恢复；
- 确认意图后生成四段规范；四段默认折叠，一次只展开一段；
- 规范段点击想法标题回到想法输入；不修改可用吸底栏「继续」返回；修改后下游段锁定并显示原因，必须重新解析或恢复；
- 吸底栏直接勾选确认；冻结后显示「规范已冻结，等待引擎接入」，工作区、项目名与想法变为只读；
- 确认前修改「我的理解」会清空意图确认，必须重新确认；
- 「返回修改」恢复规范编辑；
- 点击概览计数筛选任务卡片，再点一次取消；返回面板后项目仍在；刷新后回到面板，项目与规范状态恢复；
- 中英文、亮暗、窄窗口正常；
- 控制台无未捕获错误。

**限制**：仓库开发环境中没有浏览器截图/控制工具；视觉验收由使用者在 GUI 中完成。

## 10. 路线图

| 阶段 | 内容 | 验收 |
|---|---|---|
| Phase 1（当前） | 插件骨架、想法 → 意图校对 → 四段规范、两级确认、数据面板、工作区绑定、docs | 本仓库 `npm run check` + 人工面板验收 |
| Phase 2 | Host 引擎骨架、EvolutionSpec 持久化、EngineSnapshot 推送 | 确认后能看到真实阶段/轮次（可仍是空跑） |
| Phase 3 | 生成、评估、选择、改写闭环；沙箱与回滚 | 在一个受控任务上完成一轮真实迭代 |
| Phase 4 | 递归迭代、历史、配额、安全门与人工审查 | 多轮运行可控、可审计、可恢复 |

## 11. 已知限制

- Phase 1 的意图确认与规范确认都是纯 UI 门槛，不会启动执行。
- 想法 → 意图 → 初稿是**本地确定性模板**，不调用模型；它的价值是快速起步，不适合替代复杂规划。Phase 2 可换成引擎/LLM 生成更细的理解与规范。
- 规范只保存在当前浏览器，不跨设备/跨浏览器同步。
- 自由文本的 `scope` / `evaluation` 尚未机器解析；引擎阶段需要额外校验。
- 轮次条只显示容量，不显示历史明细。
- 包名大写不符合 npm 新包命名规范，存在本地安装兼容性风险（已给出回退方案）。

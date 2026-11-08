# Proposer 设计

## 定位

Proposer 是 RSI 的提案生成模块。它读取冻结的任务契约、项目结构记忆和迭代记忆，生成一个或多个可执行、可评测、可回滚的改进提案。它不修改工作区、不运行改动、不决定是否提交。

```text
Task Contract + Project Memory + Iteration Memory
                         ↓
                      Proposer
                         ↓
       Proposal[] → Executor → Evaluator
```

## 必须具备的功能

1. **输入校验**：确认任务目标、修改范围和评估标准完整；确认两类记忆可用。
2. **证据读取**：优先使用项目结构事实、历史失败和已验证经验，避免无依据的任意改写。
3. **假设生成**：明确问题、改动假设和预期改善指标。
4. **变更规划**：为每项变更声明目标路径或组件、动作和理由。
5. **评测规划**：指定如何验证提案，而不是只描述“应该变好”。
6. **风险与回滚规划**：声明副作用、失败条件和恢复方法。
7. **范围预校验**：拒绝绝对路径、父目录穿越和明显超出任务 scope 的变更。
8. **结构化输出**：输出稳定的 Proposal 对象，供 Executor 和 Evaluator 使用。

范围校验只是 Proposer 的早期防线；Executor 必须再次执行权威权限检查。

## 不应由 Proposer 自行决定的内容

以下内容由外部任务契约或编排器控制：

- 目标、评估标准和安全约束；
- 最大轮次、资源预算和权限；
- 是否允许修改评测器、回滚机制和根策略；
- 是否提交候选版本；
- 最终采纳或回滚决定。

Proposer 可以建议改进方向，但不能修改任务契约，也不能把自己的建议写回稳定版本。

## 可自行调整的配置

配置通过 `createProposer(options)` 注入：

| 配置 | 默认值 | 作用 |
|---|---:|---|
| `maxCandidates` | `1` | 每轮最多生成的候选数量，上限 10 |
| `maxChanges` | `20` | 单个提案允许的变更项数量 |
| `strategy` | `evidence-first` | 提案策略标签，作为模型上下文 |
| `systemPrompt` | 内置提示 | 模型角色约束 |
| `generate` | 必填 | 模型/规则生成适配器 |

`generate` 由宿主注入，RSI 不绑定具体模型 SDK：

```js
const proposer = createProposer({
  maxCandidates: 2,
  generate: async ({ system, prompt, signal }) => {
    return llm.generate({ system, prompt, signal })
  },
})
```

建议第一阶段保持 `maxCandidates = 1`，先验证闭环，再引入候选排序。配置不能覆盖任务契约的约束。

## 对外接口

```js
createProposer(options) → Proposer

proposer.propose(input, request?) → Promise<Proposal[]>
proposer.buildPrompt(input, config?) → string
proposer.validateProposal(proposal, input, config?) → {
  valid: boolean,
  errors: string[]
}
proposer.normalizeProposal(candidate, input, config?) → Proposal
```

输入：

```js
{
  task: {
    goal: string,
    scope: string,
    evaluation: string,
    constraints?: string
  },
  projectMemory: object,
  iterationMemory: object[]
}
```

输出：

```js
{
  proposalId: string,
  targetProblem: string,
  hypothesis: string,
  changes: [{
    path?: string,
    component?: string,
    action: string,
    description: string
  }],
  expectedOutcome: string,
  executionPlan: string[],
  evaluationPlan: string,
  risks: string[],
  rollbackPlan: string,
  rationale?: string
}
```

## 设计边界

Proposer 的输出是候选提案，不是执行命令。Executor 负责重新校验权限并在隔离工作区执行；Evaluator 负责根据外部评估约束产生证据；Orchestrator 负责依据评测结果决定提交、改写或终止。这样可以避免生成模块同时拥有“提出、执行、评价、采纳”四种权力。

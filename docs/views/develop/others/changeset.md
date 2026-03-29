# changeset 详解

## 一、核心概念
### 1. 什么是 Changeset？
一个 YAML + Markdown 格式的文件，存放在 .changeset/ 目录下
声明：哪些包需要升级？升什么版本？为什么？
示例：.changeset/sweet-birds-sing.md

```md
---
"@holyer-libs/button": minor
"@holyer-libs/utils": patch
---

feat(button): add loading state

```

### 2. 核心工作流
![核心工作流](https://raw.githubusercontent.com/qlHuo/images/main/imgs/20260329140356705.png)

## 二、安装与初始化
### 1. 安装 CLI
```bash
# 推荐作为 devDependency
pnpm add -D @changesets/cli
# 或临时使用
npx changeset init

```

2. 初始化项目

```bash
npx changeset init
生成：
.changeset/ 目录
.changeset/config.json（默认配置）
.changeset/README.md（说明文件）
```

3. 配置文件 .changeset/config.json
```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```
| 字段 | 说明 |
|------|------|
| `access` | `"public"`（公开包）或 `"restricted"`（私有） |
| `baseBranch` | 主分支名（如 `main` / `master`） |
| `updateInternalDependencies` | 当 A 依赖 B，B 升级时，A 如何升级？<br>`"patch"`（默认）、`"minor"`、`"major"` |
| `ignore` | 忽略的包列表（如文档站） |



## 三、核心命令
### 1. npx changeset —— 创建变更声明（最常用）
> 交互式创建 .changeset/*.md 文件

**✅ 流程回顾：**
1. 选择受影响的包
2. 为每个包选版本类型（patch/minor/major）
3. 输入变更摘要（用于 CHANGELOG）
   
**💡 最佳实践：**
1. 只选直接受本次代码影响的包
2. 摘要写成祈使句：feat: add loading prop


### 2. npx changeset status —— 查看待处理变更
> ✅ 发布前必看！

显示：
* 所有未处理的 changeset 文件
* 预计哪些包会升级到什么版本
* 是否存在冲突

```bash
$ npx changeset status

■ 1 changeset currently active
  – cool-dogs-run.md

Packages to be bumped:
  @holyer-lib/button: 1.0.0 → 1.1.0 (minor)
  @holyer-lib/ui: 1.0.0 → 1.0.1 (patch) [auto]
```


### 3. npx changeset version —— 应用版本变更（本地）
执行以下操作：
* 读取所有 .changeset/*.md
* 计算新版本号
* 更新所有相关 package.json 的 version 字段
* 生成/更新各包的 CHANGELOG.md
* 删除已处理的 .changeset/*.md
* 创建一个 commit（如果配置了 commit: true）
使用场景：
* 你想在本地预览版本变更效果
* 你不用 CI 自动发布，而是手动发布

> ⚠️ 注意：此命令会修改你的代码（package.json 和 CHANGELOG.md）
### 4. npx changeset publish —— 发布到 npm
> 执行以下操作：
* 先运行 changeset version（应用版本）
* 对每个需要发布的包，执行 npm publish
* 推送更新后的 package.json 和 CHANGELOG.md 到 Git（可选）
  
**🚫 不要直接在本地运行！**
正确做法：在 CI/CD 流程中运行（如 GitHub Actions）
原因：避免本地环境差异导致发布失败

### 5. npx changeset add —— 非交互式创建（脚本用）
```bash
npx changeset add \
  --packages "@holyer-libs/button,@holyer-libs/ui" \
  --summary "feat: add loading state" \
  --type minor
```
适用于自动化脚本或 CI 中。


## 四、与 CI/CD 集成（GitHub Actions 示例）
**关键原则：**
1. CI 负责 build + publish
2. 开发者只负责 npx changeset + 提交文件
Workflow 片段：
```yaml

- name: Build
  run: pnpm run build

- name: Publish
  run: pnpm run release  # 即 "changeset publish"
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
> ✅ 永远不要在 CI 中运行 changeset version
> ✅ changeset publish 内部已包含 version 步骤

## 五、高级用法
### 1. 固定版本组（Fixed Mode）
让多个包始终保持相同版本号（如 React 生态）：
```json
// .changeset/config.json
{
  "fixed": [["@holyer-libs/ui", "@holyer-libs/core"]]
}
```

→ 当任一包升级，所有包同步升级。
### 2. 链接版本组（Linked Mode）
比 fixed 更灵活：主包升级时，附属包自动跟随：
```json
{
  "linked": [["@holyer-libs/ui", "@holyer-libs/button"]]
}
```

### 3. 自定义 CHANGELOG 模板
安装插件：
```bash
pnpm add -D @changesets/changelog-git

```
配置：
```json
{
  "changelog": ["@changesets/changelog-git", { "repo": "your/repo" }]
}
```


## 六、常见问题
### ❓ Q1: 什么时候该用 patch / minor / major？
| 类型 | 场景 |
|------|------|
| `patch` | bug 修复、文档、内部重构（无 API 变更） |
| `minor` | 新增向后兼容的功能（新 props、新方法） |
| `major` | 破坏性变更（移除 API、重命名 prop） |

> 📌 Vue 组件库典型场景：
> 新增 loading prop → minor
> 修复样式错位 → patch
> 移除 icon prop → major


### ❓ Q2: 需要为每个 PR 创建 changeset 吗？
> ✅ 是的！
* 每个功能/修复 PR 都应包含一个 changeset 文件
* 即使只是文档更新（可选 patch）
💡 如果 PR 不需要发版（如 CI 配置修改），可不加 changeset

### ❓ Q3: 能否跳过 changeset 直接改 package.json？
> ❌ 强烈不推荐！
* 手动改版本号会导致：
* CHANGELOG 缺失
* 依赖包版本不同步
* CI 发布逻辑混乱
### ❓ Q4: 如何处理紧急 hotfix？
* 切出 hotfix 分支
* 修改代码
* npx changeset → 选 patch
* 合并到 main 并发布
* （可选）cherry-pick 到其他稳定分支

## 七、对比其他工具
| 工具 | 优点 | 缺点 |
|------|------|------|
| Changesets | 声明式、Git 友好、社区标准 | 学习成本略高 |
| Lerna | 功能全面 | 版本管理弱，配置复杂 |
| Nx | 构建缓存强 | 版本发布需额外插件 |
| 手动管理 | 简单项目够用 | monorepo 易出错 |

> ✅ 现代 monorepo（pnpm/yarn）首选 Changesets

## 八、总结
| 能力 | 说明 |
|------|------|
| 声明式变更 | 用 Git 文件记录“谁要升什么级” |
| 自动版本计算 | 告别手动改 `package.json` |
| 依赖感知 | 自动升级依赖了变更包的其他包 |
| 标准化日志 | 自动生成 CHANGELOG |
| 安全发布 | CI 原子化发布，避免部分成功 |

🌟 记住一句话：
“Changesets 把版本决策交给开发者，把执行自动化交给机器。”

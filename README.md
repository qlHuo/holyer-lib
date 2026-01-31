### 技术栈

### 项目结构
```
holyer-lib
├─ .changeset              # changeset 多包管理版本发布工具
├─ .husky                  # Git 钩子（Git Hooks）管理工具
├─ docs
│  ├─ changset.md
│  └─ image.png

├─ packages                # 核心组件库目录
│  ├─ styles
│  ├─ ui
│  └─ utils
├─ scripts                 # 打包&构建脚本
│   ├─ build-ui.js
│   ├─ build-utils.js
│   ├─ rollup.config.js
│   └─ verify-changeset.js
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
```

### 开发流程

1. **同步最新代码**  
   在开始开发前，请先拉取远程主分支的最新变更：
   ```bash
   git pull origin main
   ```

2. **进行代码开发**  
   修改组件库源码（如新增/修复 `packages/` 下的功能）。

3. **生成 Changeset 文件（仅当涉及组件变更时）**  
   若本次修改影响组件库的公共 API 或功能行为，请运行以下命令创建版本变更记录：
   ```bash
   pnpm changeset
   ```
   > ✅ 此命令会生成一个 `.changeset/xxx-yyy-zzz.md` 文件，用于描述变更类型（patch/minor/major）及内容。

4. **暂存变更**  
   将代码变更和 Changeset 文件一并加入暂存区：
   ```bash
   git add .
   ```

5. **提交到本地仓库**  
   - **若涉及组件库功能变更**：直接提交，Husky 会自动校验 Changeset 是否存在：
     ```bash
     git commit -m "feat(button): add loading state"
     ```
   - **若仅为文档、示例、CI 配置等非组件变更**：可跳过校验：
     ```bash
     git commit --no-verify -m "docs: update README"
     ```
     > 💡 `--no-verify` 会跳过 Husky 的 pre-commit 钩子，适用于无需发布新版本的提交。

6. **推送到 GitHub**  
   ```bash
   git push
   ```

> 📌 **提示**：只有包含有效 Changeset 文件的提交被合并到 `main` 分支后，CI 才会自动生成 CHANGELOG、升级版本并发布到 npm。


### git 提交规范

| 类型 | 说明 | 是否触发版本升级 | Changesets 对应 |
|------|------|------------------|----------------|
| `feat` | 新功能 | ✅ minor | `minor` |
| `fix` | bug 修复 | ✅ patch | `patch` |
| `docs` | 文档更新 | ❌ | （可忽略或 `patch`） |
| `style` | 代码格式调整（空格、分号等） | ❌ | 忽略 |
| `refactor` | 重构（既非 feat 也非 fix） | ⚠️ 通常不升级 | 可选 `patch` |
| `perf` | 性能优化 | ✅ patch | `patch` |
| `test` | 测试相关 | ❌ | 忽略 |
| `build` | 构建系统 or 外部依赖变更 | ⚠️ 视情况 | 如 rollup 升级 → `patch` |
| `ci` | CI 配置文件 | ❌ | 忽略 |
| `chore` | 杂务（如脚本、配置） | ❌ | 忽略 |
| `revert` | 回滚 commit | ✅ 同原 commit | 同原级别 |



### pnpm 用法
1. 安装全局依赖 
   pnpm add -w vue 
2. 安装 @holyer-lib/title 到 @holyer-lib/ui
   pnpm add @holyer-lib/title@workspace:* -F @holyer-lib/ui


### changeset用法详解

### github CICD发布
https://www.qianwen.com/share/chat/05f298546c2847b091c0c23f555294c0

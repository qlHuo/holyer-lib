### pnpm 用法
1. 安装全局依赖 
   pnpm add -w vue 
2. 安装 @holyer-lib/title 到 @holyer-lib/ui
   pnpm add @holyer-lib/title@workspace:* -F @holyer-lib/ui


### changeset用法详解

### github CICD发布
https://www.qianwen.com/share/chat/05f298546c2847b091c0c23f555294c0

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


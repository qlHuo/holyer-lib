# 整体流程

> 基于 Monorepo 架构实现的 Vue 2.6 组件库，集成 Rollup 打包、Jest 测试、Changesets 版本管理、GitHub CI/CD 和 VuePress 文档，完整覆盖从开发到发布的全流程。

## 🌟 核心价值
- ✅ **Vue 2.6 生态兼容**：专为 Vue 2.6 优化，避免升级到 Vue 3 的迁移成本
- ✅ **自动化发布**：Changeset + GitHub Actions 实现一键发布
- ✅ **按需引入**：支持全量包和独立组件按需导入

## 🏗️ 架构概览

本项目采用 **pnpm workspace** 进行多包管理，旨在实现代码复用与模块化开发。

### 技术栈
- **核心**: Vue@2.6, Less
- **构建**: Rollup 
- **测试**: Jest@27, @vue/vue2-jest
- **文档**: VuePress@1.x
- **工程化**: Changesets, Husky, GitHub Actions

### 开发环境要求
- **Node.js**: >=14.0.0 (推荐 18.12.0)
- **pnpm**: >=7.0.0 (项目使用 10.15.0)
- **NPM Token**: 需配置 `NPM_TOKEN` 用于发布

### 目录结构
```
holyer-lib/
├── .changeset/                   # changeset 日志管理
├── .husky/                       # husky 代码校验
├── .github/workflows/            # GitHub Actions 配置目录
│   └── release.yml               # 发布流程
│   └── docs.yml                  # 文档部署流程
├── docs/                         # 文档站点
│   └── .vuepress/                # vuepress 配置
├── example/                      # 本地调试示例项目
├── packages/
│   ├── ui/                       # UI 全量组件
│   │   ├── [component]/          # 独立组件
│   │   │   ├── package.json
│   │   │   ├── index.js
│   │   │   └── src/
│   │   ├── index.js              # UI 包入口
│   │   └── package.json
│   ├── styles/                   # 全局样式
│   ├── directives/               # 指令
│   └── utils/                    # 工具函数
├── scripts/                      # 构建脚本
├── test/                         # 测试文件
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🚀 快速开始

### 本地开发
```bash
# 1. 安装依赖
pnpm install

# 2. 启动文档站点（含组件预览）
pnpm docs:dev

# 3. 开发 UI 组件
# 在 packages/ui/ 下创建组件，文档会自动热更新
```

### 发布流程
```bash
# 1. 拉取最新代码
git pull

# 2. 创建版本变更
pnpm changeset

# 3. 提交并推送
git add .
git commit -m "feat: add new component"
git push  # CI 自动发布
```

## 🛠️ 开发工作流

### 1. 包开发
遵循原子化设计原则
* UI组件开发：
  - 在 `packages/ui/` 下新建组件文件夹
  - 若需要打包到 `@holyer-lib/ui` 则需要在 `packages/ui/index.js` 中手动导出
* 其他包开发：
  - 在 `packages/` 下新建包文件夹并配置 `package.json`

### 2. 测试
使用 Jest 进行单元测试，确保覆盖率
```bash
pnpm test
```

### 3. 打包
使用 Rollup 构建 ESM/CJS/UMD 格式
```bash
pnpm build:all
```

## 📦 发布与 CI/CD

### 1. 版本管理
我们使用 **Changesets** 管理版本。
- 提交变更：`pnpm changeset`

### 2. 自动化流程
项目集成了 GitHub Actions：
- **代码提交到 main 分支**：自动检测 `.changeset/*.md` 文件，执行以下操作：
  1. 生成版本号 (`changeset version`)
  2. 构建组件库 (`pnpm build:all`)  
  3. 发布到 npm (`changeset publish`)
- **文档变更**：自动部署文档站点

## ⚠️ 常见问题预防

### Vue 2 生态兼容性
- **不要升级** `vuepress` 到 2.x 版本（不支持 Vue 2）
- **依赖版本**已在 `pnpm overrides` 中锁定，请勿手动修改

### 代码规范
- VSCode 请仅启用 ESLint 插件，**禁用 Prettier 插件**
- 格式化由 ESLint 统一处理，避免插件冲突

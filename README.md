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
│  ├─ styles               # 基础样式库
│  ├─ ui                   # ui 组件库（通过rollup打包）
│  └─ utils                # utils 工具库（通过rollup打包）
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

| 场景 | 命令 |
|------|------|
| 在子包目录内添加本地包 | `pnpm add @myorg/utils` |
| 在根目录为某子包添加本地包 | `pnpm add @myorg/utils -F @myorg/ui` |
| 添加的是 外部 npm 包（非 workspace） | `pnpm add lodash` → 会正常安装最新版 |
| 强制指定版本（不推荐用于本地包） | `pnpm add @myorg/utils@1.0.0` → 会去 npm 装，不是软链接！ |

### Vue2组件库与 eslint、 prettierr 集成

#### 配置流程
1. 安装相关插件和依赖
  * 安装 eslint、 prettier 插件
  * 安装依赖、配置脚本
  ```json
    // 配置 eslint 脚本
    "scripts": {
      "lint": "vue-cli-service lint",
      "lint:fix": "vue-cli-service lint --fix"
    },
    "devDependencies": {
      "@babel/eslint-parser": "^7.12.16",
      "@vue/cli-plugin-eslint": "~5.0.0",
      "eslint": "^7.32.0",
      "eslint-config-prettier": "^8.3.0",
      "eslint-plugin-prettier": "^4.0.0",
      "eslint-plugin-vue": "^8.0.3",
      "prettier": "^2.4.1",
    }
  ```

1. 添加 eslint、prettierrc 配置文件 
  * **.eslintrc.js 文件**
  ```js
    const path = require('path');
    module.exports = {
      root: true,
      env: {
        node: true
      },
      // 使用 prettier 兜底
      extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:prettier/recommended'],
      parserOptions: {
        // ← 这是给 .vue 和 .js 用的
        parser: '@babel/eslint-parser',
        // monorepo 架构下：显式指定 Babel 配置文件的绝对路径，确保 ESLint 能正确加载 Babel 配置
        babelOptions: {
          configFile: path.resolve(__dirname, './babel.config.js')
        }
      },
      rules: {
        'no-console': 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'vue/multi-word-component-names': 'off',
        'vue/no-multiple-template-root': 0,
        'vue/no-mutating-props': 0,
        'vue/no-use-v-if-with-v-for': 0,
        'vue/valid-template-root': 0,
        'no-empty': 0
      }
    };
  ```
  * **.eslintignore 文件**
  ```bash
    # docker
    docker/
    *.sh
    node_modules
    lib
    *.md
    *.woff
    *.ttf
    .vscode
    .idea
    dist
    mock
    public
    bin
    build
    config
    index.html
  ```

  * **.prettierrc.js 文件**
  ```js
    module.exports = {
      printWidth: 120,
      // 每个tab相当于多少个空格（默认2）
      tabWidth: 2,
      // 是否使用tab进行缩进（默认false）
      useTabs: false,
      // 行尾需要有分号(默认true)
      semi: true,
      // 使用单引号（默认false）
      singleQuote: true,
      // 对象的 key 仅在必要时用引号
      quoteProps: 'as-needed',
      // 多行使用拖尾逗号（默认none）
      trailingComma: 'none',
      // 在对象，数组括号与文字之间加空格 "{ foo: bar }"（默认true）
      bracketSpacing: true,
      // 根据显示样式决定 html 要不要折行
      htmlWhitespaceSensitivity: 'ignore',
      // 只有一个参数的箭头函数的参数是否带圆括号（默认avoid:添加括号）
      arrowParens: 'avoid',
      // 行尾换行符
      endOfLine: 'auto'
    };
  ```

  * **.prettierignore 文件**
  ```bash
    # docker
    docker/
    *.sh
    node_modules
    lib
    *.md
    *.woff
    *.ttf
    .vscode
    .idea
    dist
    mock
    public
    bin
    build
    config
    index.html
  ```

3. vscode 编辑器配置

   **.vscode/setting.json文件**
   ```json
    {
      // 🔑 关键：关闭直接格式化
      "editor.formatOnSave": false,

      // 🔑 关键：保存时让 ESLint 修复所有问题（含 Prettier）
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      },

      // 指定文件类型使用 ESLint 作为格式化器
      "[vue]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
      },
      "[javascript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
      },
      "[typescript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
      },

      // 确保 Prettier 插件尊重项目配置（即使不直接用它）
      "prettier.configPath": ".prettierrc.js",
      "prettier.requireConfig": true
    }
   ```

#### 冲突说明
  以上步骤基本可以保证 eslint 和 prettier 配置生效，但有可能跟本地插件冲突，需要确保：

  1. 禁用 Vue 插件（如果你用 Vue 3 禁用 Vetur 插件， Vue2 禁用 Vue official 插件）
  2. 确保只启用以下插件：
     * ESLint（Microsoft）
     * Prettier - Code formatter（可选，但不要让它直接格式化）
  3. Vetur 检查报错 `Property 'xxx' does not exist`
     * Vue 2 + JavaScript 项目中 极易误报
     * .vscode/setting.json 中配置 `"vetur.experimental.templateInterpolationService": false` 彻底禁用模板插值的 TS 类型检查


### `jsconfig.json` 的作用
`jsconfig.json` 是 **JavaScript 项目的配置文件**，作用类似于 `tsconfig.json`，但用于纯 JS 项目。

#### 🚀 核心作用

1. **标记项目根目录**  
   → 告诉 VS Code：“这是一个独立的 JS 项目”，启用智能提示、跳转、重构等。
2. **配置模块解析规则**  
   → 支持 `baseUrl` 和 `paths`（如 `@/components` → `src/components`），实现路径别名跳转和自动补全。
3. **控制 JavaScript 语言服务行为**  
   → 可选开启/关闭类型检查（`"checkJs": true/false`）、包含/排除文件等。


#### 📌 注意：
- **不是构建工具配置**（不影响 Webpack/Rollup）
- **仅用于编辑器（VS Code）和 IDE 的开发体验**
- 如果不写，VS Code 会按默认规则处理 JS 文件（功能受限）

> 💡 在 Vue 2 + JS 组件库中，`jsconfig.json` 主要用来支持 **路径别名跳转** 和 **明确项目范围**。


### changeset用法详解

### github CICD发布
https://www.qianwen.com/share/chat/05f298546c2847b091c0c23f555294c0

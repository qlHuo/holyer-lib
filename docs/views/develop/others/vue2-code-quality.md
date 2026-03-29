
# Vue2.x 项目 eslint 与 prettierr 集成

## 配置流程
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

2. 添加 eslint、prettierrc 配置文件 
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

## 冲突说明
  以上步骤基本可以保证 eslint 和 prettier 配置生效，但有可能跟本地插件冲突，需要确保：

  1. 禁用 Vue 插件（如果你用 Vue 3 禁用 Vetur 插件， Vue2 禁用 Vue official 插件）
  2. 确保只启用以下插件：
     * ESLint（Microsoft）
     * Prettier - Code formatter（可选，但不要让它直接格式化）
  3. Vetur 检查报错 `Property 'xxx' does not exist`
     * Vue 2 + JavaScript 项目中 极易误报
     * .vscode/setting.json 中配置 `"vetur.experimental.templateInterpolationService": false` 彻底禁用模板插值的 TS 类型检查

## 开发流程
  1. 安装组件依赖
    ```bash
      cd example
      # 它告诉 pnpm：“这个包来自 workspace，请用 workspace:* 协议链接，不要去 npm 下载”
      pnpm add @holyer-lib/title@workspace:*
    ```

  2. 组件打包
  > 若 packages/title 还没有 dist/ 目录（即未 build），那么 example 引入时会报错（找不到模块）。

  **构建组件**
  ```bash
    # 根目录
    pnpm build:all
  ```

  **或者开发时监听构建（用于本地开发）**
  > 每个组件都需要配置script脚本，若不配置则无法使用。
  ```bash
  # 终端1：监听 button 构建。假设 dev 脚本是 rollup -c -w
  pnpm --filter @mylib/button run dev

  # 终端2：启动 example
  pnpm --filter example run serve
  ```

  

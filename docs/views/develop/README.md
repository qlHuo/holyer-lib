# 开发流程

## 核心目标

以Vue2.6（无需支持ts和组合式api）、less、github CI/CD、pnpm、monorepo、rollup 为基础构建一个结构清晰、可复用、可维护的前端组件库，使用现代工具链优化开发和发布流程



## **一、项目规划与初始化**

### **1. 项目结构设计 (Monorepo)**
我们将采用 `pnpm` 的 `workspaces` 特性来管理多个包（packages）。

```
holyer-lib/
├── package.json          # 顶层 package.json
├── pnpm-workspace.yaml   # pnpm 工作区配置
├── .github/workflows/    # GitHub Actions 配置目录
│   └── ci.yml            # CI/CD 流程定义
├── packages/
│   ├── package-a/        # 示例组件包 A
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.js     # 入口文件
│   │   │   └── components/  # 组件源码
│   │   │       └── MyButton.vue
│   │   ├── styles/          # 样式文件
│   │   │   └── index.less
│   │   └── rollup.config.js # Rollup 配置
│   ├── package-b/        # 示例组件包 B
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   └── components/
│   │   │       └── MyInput.vue
│   │   ├── styles/
│   │   │   └── index.less
│   │   └── rollup.config.js
│   └── docs/             # 文档站点 (可选)
│       ├── package.json
│       └── src/          # 文档源码
└── README.md
```

### **2. 初始化顶层项目**
在 `my-component-library/` 目录下执行以下命令：

```bash
# 初始化 Git 仓库
git init
# 创建顶层 package.json
pnpm init -y
# 安装必要的依赖（如 Lerna 可选，但本方案用 pnpm workspaces）
# 这里我们不直接使用 Lerna，而是利用 pnpm 的工作区功能
```

### **3. 配置 pnpm 工作区 (pnpm-workspace.yaml)**
在项目根目录创建 `pnpm-workspace.yaml` 文件：

```yaml
packages:
  - 'packages/*'
  - 'packages/docs'
```

### **4. 配置顶层 package.json**
编辑根目录下的 `package.json`，添加以下内容：

```json
{
  "name": "@my-org/my-component-library",
  "version": "0.0.0", // 或者使用语义化版本号，如 1.0.0
  "private": true, // 因为是 monorepo，通常设为 true
  "scripts": {
    "build": "pnpm run build:packages",
    "build:packages": "pnpm --filter ./packages/* run build",
    "dev": "pnpm --filter ./packages/docs run dev",
    "lint": "pnpm run lint:js && pnpm run lint:css",
    "lint:js": "eslint packages/*/src/**/*.js",
    "lint:css": "stylelint packages/*/src/**/*.less",
    "test": "pnpm run test:unit",
    "test:unit": "jest packages/*/src/**/__tests__/*.spec.js",
    "release": "pnpm run build && npm publish" // 注意：如果需要发布到 npm，需要修改此逻辑
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "stylelint": "^14.0.0",
    "jest": "^29.0.0",
    "rollup": "^3.0.0"
    // 其他通用开发依赖...
  }
}
```

---

## **二、构建组件包 (以 `package-a` 为例)**

### **1. 创建组件包目录**
```bash
mkdir packages/package-a
cd packages/package-a
pnpm init -y
```

### **2. 安装依赖**
```bash
pnpm add vue@^2.6.14 less
pnpm add -D @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-less rollup-plugin-postcss @vue/cli-plugin-babel
```

*注意：* `@vue/cli-plugin-babel` 可能不是必须的，但如果你计划使用 Vue CLI 工具进行开发或构建，可以考虑。对于 Rollup 构建，核心插件是 `@rollup/plugin-node-resolve`, `@rollup/plugin-commonjs`, `@rollup/plugin-less`, `rollup-plugin-postcss`。

### **3. 配置 `package-a` 的 `package.json`**
```json
{
  "name": "@my-org/package-a",
  "version": "0.1.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "rollup -c"
  },
  "peerDependencies": {
    "vue": "^2.6.14"
  },
  "dependencies": {
    "less": "^4.0.0"
  },
  "devDependencies": {
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^25.0.0",
    "@rollup/plugin-less": "^5.0.0",
    "rollup-plugin-postcss": "^4.0.0",
    "rollup": "^3.0.0"
  }
}
```

### **4. 创建组件源码 (`src/components/MyButton.vue`)**
```vue
<template>
  <button :class="['my-button', `my-button--${type}`]" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    type: {
      type: String,
      default: 'default' // primary, secondary, ...
    }
  }
}
</script>

<style lang="less" scoped>
.my-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &--primary {
    background-color: #007bff;
    color: white;
  }

  &--secondary {
    background-color: #6c757d;
    color: white;
  }

  &:hover {
    opacity: 0.8;
  }
}
</style>
```

### **5. 创建入口文件 (`src/index.js`)**
```javascript
import MyButton from './components/MyButton.vue';

// 定义插件对象
const MyComponentPlugin = {
  install(Vue) {
    Vue.component(MyButton.name, MyButton);
  }
};

// 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MyComponentPlugin);
}

export { MyButton };
export default MyComponentPlugin;
```

### **6. 创建样式入口 (`src/styles/index.less`)**
```less
// 导入所有组件的样式
@import './my-button.less'; // 假设你有单独的样式文件
// 或者直接在这里写基础样式
```

### **7. 配置 Rollup 构建 (`rollup.config.js`)**
```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import less from '@rollup/plugin-less';
import postcss from 'rollup-plugin-postcss';
import vue from 'rollup-plugin-vue';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'named'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    less({
      insert: true // 将 CSS 插入到 DOM 中
    }),
    postcss({
      extract: false, // 不提取 CSS 到单独文件，因为 Vue 组件内已包含
      minimize: true
    }),
    vue({
      css: false, // 不处理 CSS，由 postcss 处理
      template: {
        isProduction: true
      }
    })
  ],
  external: ['vue'] // 告诉 rollup 不要将 vue 打包进最终产物
};
```

### **8. 构建组件包**
在 `packages/package-a` 目录下运行：
```bash
pnpm build
```

这会生成 `dist/index.js` 和 `dist/index.esm.js`。

---

## **三、构建文档站点 (可选)**

### **1. 创建文档包**
```bash
mkdir packages/docs
cd packages/docs
pnpm init -y
```

### **2. 安装依赖**
```bash
pnpm add vue@^2.6.14 vue-router@^3.5.0 @my-org/package-a
pnpm add -D @vue/cli-service @vue/cli-plugin-router
```

### **3. 配置文档包 `package.json`**
```json
{
  "name": "@my-org/docs",
  "version": "0.1.0",
  "scripts": {
    "dev": "vue-cli-service serve",
    "build": "vue-cli-service build"
  },
  "dependencies": {
    "vue": "^2.6.14",
    "vue-router": "^3.5.0",
    "@my-org/package-a": "workspace:*" // 使用 workspace 引用本地包
  },
  "devDependencies": {
    "@vue/cli-service": "^5.0.0",
    "@vue/cli-plugin-router": "^5.0.0"
  }
}
```

### **4. 创建简单的文档页面**
例如，在 `src/App.vue` 中引入并使用 `MyButton` 组件。

### **5. 启动文档站点**
```bash
pnpm dev
```

---

## **四、CI/CD 配置 (GitHub Actions)**

### **1. 创建 `.github/workflows/ci.yml`**
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        registry-url: 'https://registry.npmjs.org'

    - name: Install pnpm
      run: |
        corepack enable
        pnpm --version

    - name: Install dependencies
      run: pnpm install

    - name: Lint code
      run: pnpm lint

    - name: Run tests
      run: pnpm test

    - name: Build packages
      run: pnpm build

    # 如果你想自动发布到 npm
    # - name: Publish to npm
    #   if: github.ref == 'refs/heads/main'
    #   run: |
    #     echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
    #     pnpm release
    #   env:
    #     NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### **2. 配置环境变量**
在 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中添加 `NPM_TOKEN`（用于发布 npm 包）。

---

### **五、总结**

- 使用 `pnpm` 管理依赖和工作区。
- 每个组件作为一个独立的包，便于管理和复用。
- 使用 `Rollup` 进行打包，支持 CommonJS 和 ES Module。
- 使用 `Less` 编写样式，并集成到构建流程。
- 通过 `GitHub Actions` 实现 CI/CD 流水线，包括代码检查、单元测试和构建。

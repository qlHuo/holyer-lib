# pnpm 核心用法与特性详解

> **高效、严格、节省空间的现代包管理器**

## 一、为什么选择 pnpm？

| 特性 | pnpm | npm | Yarn (Classic) |
|------|------|-----|----------------|
| **磁盘空间** | ✅ 硬链接 + 符号链接（同一依赖只存一份） | ❌ 每个项目独立拷贝 | ⚠️ Plug’n’Play 可选，但默认仍拷贝 |
| **依赖隔离** | ✅ 严格：子包无法访问未声明依赖 | ❌ 宽松：可访问父级 node_modules | ⚠️ 较宽松（hoisting 行为类似 npm） |
| **Monorepo 支持** | ✅ 原生 workspace 协议 | ⚠️ 需 Lerna + npm | ✅ Yarn Workspaces（但 hoisting 不够严格） |
| **安装速度** | ✅ 极快（内容寻址存储） | ⚠️ 中等 | ✅ 快（缓存机制强） |
| **安全性** | ✅ 无幽灵依赖（phantom dependencies） | ❌ 存在 | ⚠️ 存在 |

> 💡 **核心优势**：  
> **“所见即所得”** —— 如果一个包没在 `package.json` 中声明，你就不能 `require()` 它。


## 二、基础命令速查（vs npm / yarn）

| 场景 | pnpm | npm | yarn |
|------|------|-----|------|
| 安装依赖 | `pnpm install` | `npm install` | `yarn install` |
| 添加依赖（生产） | `pnpm add lodash` | `npm install lodash` | `yarn add lodash` |
| 添加开发依赖 | `pnpm add -D eslint` | `npm install -D eslint` | `yarn add -D eslint` |
| 全局安装 | `pnpm add -g http-server` | `npm install -g http-server` | `yarn global add http-server` |
| 运行脚本 | `pnpm run dev` | `npm run dev` | `yarn run dev` |
| 列出依赖 | `pnpm list` | `npm list` | `yarn list` |

> 📌 **注意**：  
> pnpm **不支持** `pnpm i` 缩写（必须 `pnpm install` 或 `pnpm add`）。


## 三、Monorepo / Workspace 核心用法

### 1. 启用 Workspace
```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### 2. 引用本地包（关键！）
| 场景 | 命令 | 说明 |
|------|------|------|
| 在子包 A 中引用子包 B | `pnpm add @myorg/utils` | 自动识别为 `workspace:*` |
| 在根目录为子包 A 添加子包 B | `pnpm add @myorg/utils -F @myorg/ui` | `-F` = `--filter` |
| 强制使用 npm 版本（非链接） | `pnpm add @myorg/utils@1.0.0` | ⚠️ 会从 registry 安装，**失去本地链接！** |

> ✅ **正确做法**：  
> 本地包之间应始终使用 **无版本号** 或 **`workspace:*`**：
> ```bash
> pnpm add @myorg/utils@workspace:*
> ```

### 3. 跨包运行脚本
```bash
# 为所有包运行 test
pnpm -r run test

# 为特定包运行 build
pnpm -r --filter @myorg/ui run build

# 并行运行（加快 CI）
pnpm -r --parallel run lint
```

## 四、高级特性

### 1. Overrides（解决依赖冲突）
```json
// package.json
{
  "pnpm": {
    "overrides": {
      "lodash@<4.17.21": "^4.17.21",
      "react": "npm:@preact/compat@latest"
    }
  }
}
```
- 强制提升子依赖版本  
- 甚至可将 `react` 替换为 `preact`（兼容层）

### 2. `.pnpmfile.cjs`（自定义解析逻辑）
用于 patch 无法修改的第三方包依赖，例如：
```js
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.dependencies?.vue) {
        pkg.dependencies.vue = '^2.6.14';
      }
      return pkg;
    }
  }
};
```

### 3. 内容可寻址存储（CAS）
- 所有依赖按内容哈希存储于全局 store（`~/.pnpm/store`）  
- 多个项目共享同一份 `vue@2.6.14`，**节省 GB 级空间**


## 五、与 npm / yarn 的关键差异

### 1. node_modules 结构不同
- **npm / yarn**：扁平化（hoisting），依赖可能“意外可用”  
- **pnpm**：嵌套符号链接，结构如下：
  ```
  node_modules/
  ├── .pnpm/
  │   ├── vue@2.6.14/node_modules/vue → 实际代码
  │   └── lodash@4.17.21/node_modules/lodash
  ├── vue → symlink to .pnpm/vue@2.6.14/node_modules/vue
  └── lodash → symlink to .pnpm/lodash@4.17.21/node_modules/lodash
  ```
> ✅ **结果**：杜绝“幽灵依赖”（Phantom Dependencies）

### 2. 全局安装位置
- pnpm 全局 bin 目录需手动加入 PATH（或通过 `pnpm setup` 自动配置）  
- 推荐使用 `pnpm dlx` 临时运行全局工具：
  ```bash
  pnpm dlx create-vue@2
  ```

## 六、常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| “Cannot find module ‘xxx’” | 依赖未在 `package.json` 声明 | 显式 `pnpm add xxx` |
| 本地包未软链接 | 错误指定了版本号（如 `@1.0.0`） | 使用 `@workspace:*` 或不带版本 |
| CI 安装慢 | 未启用缓存 | GitHub Actions 中设置 `cache: pnpm` |
| 权限错误（Linux/macOS） | 全局 store 权限问题 | 运行 `pnpm setup` 修复 PATH 和权限 |


## 七、总结

1. **始终声明依赖**  
   即使父级已安装，子包也必须显式 `pnpm add`。

2. **本地包引用不带版本**  
   ```bash
   # ✅ 正确 pnpm add @myorg/utils@workspace:*
   pnpm add @myorg/utils
   
   # ❌ 危险（会从 npm 安装！）
   pnpm add @myorg/utils@1.0.0
   ```

3. **利用 overrides 解决冲突**  
   比 `resolutions`（yarn）更强大，支持任意路径匹配。

4. **CI 中启用缓存**  
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: pnpm
   ```

5. **不要混用包管理器**  
   项目一旦使用 pnpm，**禁止** 运行 `npm install` 或 `yarn`，否则会破坏 node_modules 结构。


> 📚 **官方资源**  
> - [pnpm 官网](https://pnpm.io/)  
> - [pnpm vs npm vs yarn](https://pnpm.io/motivation)  
> - [Workspace 指南](https://pnpm.io/workspaces)

✅ **记住**：  
**pnpm 不是“更快的 npm”，而是一个更严格、更可靠的依赖管理系统。**  
它用短期的学习成本，换取长期的工程稳定性。
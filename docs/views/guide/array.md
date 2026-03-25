
# Array 数组工具函数

提供一组轻量、高性能的常用数组处理方法，适用于前端业务中常见的 **去重、分页、树形结构转换** 等场景。所有函数均无副作用、不修改原数组，可安全用于 Vue 2 的 `data`、`computed`、方法或指令中。

## 引入方式

```js
import { uniqueArray, paginateArray, arrayToTree, treeToArray } from '@holyer-lib/utils';
```

## `uniqueArray` 数组去重

### 适用场景
- 基本类型数组（字符串、数字）快速去重；
- 对象数组按某个字段（如 `id`、`code`）去重；
- 自定义去重规则（例如按多个字段组合判断）。

### 参数说明
```js
uniqueArray(arr, key)
```
- `arr`：要处理的数组；
- `key`（可选）：
  - 若为 **字符串**，表示对象中用于比较的字段名；
  - 若为 **函数**，接收每个元素，返回用于比较的值；
  - 若不传，则对基本类型数组直接去重。

### 使用示例

#### 1. 基本类型去重
```js
const list = [1, 2, 2, 3, 'a', 'b', 'a'];
console.log(uniqueArray(list)); 
// => [1, 2, 3, 'a', 'b']
```

#### 2. 对象按字段去重
```js
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice Updated' }
];

console.log(uniqueArray(users, 'id'));
// => [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

#### 3. 自定义去重逻辑
```js
const items = [
  { code: 'A', type: 1 },
  { code: 'A', type: 2 },
  { code: 'B', type: 1 }
];

// 按 code + type 组合去重
const result = uniqueArray(items, item => `${item.code}-${item.type}`);
```

> ⚠️ 注意：如果传入的是非对象数组，但 `key` 是字符串，会打印警告并保留原项。


## `paginateArray` 数组分页

### 适用场景
- 前端模拟分页（如表格、卡片列表）；
- 将长列表按页码切片展示；
- 配合分页组件实现数据切换。

### 参数说明
```js
paginateArray(arr, page, pageSize)
```
- `arr`：源数组；
- `page`：当前页码（从 1 开始，必须为正整数）；
- `pageSize`：每页条数（必须为正整数）；

> 如果参数非法（如 `page <= 0`）或超出范围，返回空数组。

### 使用示例
```js
const data = Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`);

console.log(paginateArray(data, 1, 10)); // 第1页 → ['Item 1', ..., 'Item 10']
console.log(paginateArray(data, 3, 10)); // 第3页 → ['Item 21', ..., 'Item 25']
console.log(paginateArray(data, 4, 10)); // 超出范围 → []
console.log(paginateArray(data, 0, 10)); // 无效页码 → []
```

> ✅ 推荐在 `computed` 中使用：
```js
computed: {
  currentList() {
    return paginateArray(this.allData, this.currentPage, this.pageSize);
  }
}
```

## `arrayToTree` 扁平数组转树结构

### 适用场景
- 后台返回的菜单、组织架构、分类等扁平数据转为树形；
- 构建可递归渲染的树形 UI（如自定义 Tree 组件）。

### 参数说明
```js
arrayToTree(arr, options)
```
- `arr`：扁平数组；
- `options`（可选）：
  - `idField`：节点唯一标识字段，默认 `'id'`；
  - `parentField`：父节点 ID 字段，默认 `'parentId'`；
  - `childrenField`：子节点字段名，默认 `'children'`；
  - `rootId`：根节点的父 ID 值，默认 `null`。

### 使用示例
```js
const menus = [
  { id: 1, name: '系统管理', parentId: null },
  { id: 2, name: '用户管理', parentId: 1 },
  { id: 3, name: '角色管理', parentId: 1 },
  { id: 4, name: '编辑用户', parentId: 2 }
];

const tree = arrayToTree(menus, {
  idField: 'id',
  parentField: 'parentId',
  childrenField: 'children'
});
```

结果：
```js
[
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 2, name: '用户管理', children: [ /* ... */ ] },
      { id: 3, name: '角色管理', children: [] }
    ]
  }
]
```

> 💡 若你的数据用 `0` 表示顶级（如 `parentId: 0`），请设置 `rootId: 0`。


## `treeToArray` 树结构转扁平数组

### 适用场景
- 树形数据导出为线性列表（如 Excel 导出）；
- 全量遍历节点（搜索、筛选、统计）；
- 实现“展开所有”或“收起所有”功能。

### 参数说明
```js
treeToArray(tree, childrenField, includeRoot)
```
- `tree`：树形数组；
- `childrenField`：子节点字段名，默认 `'children'`；
- `includeRoot`：是否包含根节点，默认 `true`。

> 输出数组中每个元素会自动添加 `level` 字段（从 0 开始），便于缩进显示。

### 使用示例
```js
const tree = [
  {
    id: 1,
    name: 'Parent',
    children: [
      { id: 2, name: 'Child A', children: [] },
      { id: 3, name: 'Child B', children: [] }
    ]
  }
];

const flat = treeToArray(tree);
// 结果包含 level 字段：
// [
//   { id:1, name:'Parent', level:0, ... },
//   { id:2, name:'Child A', level:1, ... },
//   { id:3, name:'Child B', level:1, ... }
// ]

// 仅导出子节点（不含根）
const childrenOnly = treeToArray(tree, 'children', false);
```

> ✅ 结合 `level` 实现视觉缩进：
```vue
<div v-for="item in flatList" :key="item.id" :style="{ paddingLeft: item.level * 20 + 'px' }">
  {{ item.name }}
</div>
```


## 性能与注意事项

- 所有函数均为 **纯函数**，不修改原始数据；
- 时间复杂度均为 **O(n)**，适合千级以内数据处理；
- `arrayToTree` 和 `treeToArray` 适用于常规菜单、组织架构等场景，**不建议用于超大树（>1万节点）**；
- 在 Vue 2 中可放心用于 `computed` 或方法，不会引发响应式问题。

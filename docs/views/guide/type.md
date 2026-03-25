# Type 类型判断工具

提供一组精准、安全、无依赖的类型判断函数，覆盖 JavaScript 中几乎所有常见数据类型和边界情况。所有函数均基于 `typeof` 和 `Object.prototype.toString.call()` 实现，兼容 IE9+，适用于 Vue 2 项目中的参数校验、条件渲染、数据处理等场景。

## 引入方式

```js
import {
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isPlainObject,
  isDate,
  isRegExp,
  isError,
  isMap,
  isSet,
  isSymbol,
  isBigInt,
  isNull,
  isUndefined,
  isEmpty,
  isNotEmpty,
  isNumericString,
  isInteger,
  isPositive,
  isNegative,
  isElement,
  isPromise,
  isNodeList
} from '@holyer-lib/utils';
```


## 基础类型判断

### `isString(val)`
判断是否为字符串。
```js
isString('hello'); // true
isString(123);     // false
```

### `isNumber(val)`
判断是否为**有效数字**（排除 `NaN`、`Infinity`）。
```js
isNumber(42);      // true
isNumber(NaN);     // false
isNumber(Infinity); // false
```

### `isBoolean(val)`
判断是否为布尔值。
```js
isBoolean(true);   // true
isBoolean('true'); // false
```

### `isFunction(val)`
判断是否为函数。
```js
isFunction(() => {}); // true
isFunction(Math.max); // true
```

### `isSymbol(val)` / `isBigInt(val)`
判断是否为 `Symbol` 或 `BigInt`（现代 JS 类型）。
```js
isSymbol(Symbol('id')); // true
isBigInt(123n);         // true
```


## 对象与容器类型

### `isObject(val)`
判断是否为对象（排除 `null`）。
```js
isObject({});        // true
isObject([]);        // true（数组也是对象）
isObject(null);      // false
```

### `isArray(val)`
判断是否为数组（使用 `Array.isArray`）。
```js
isArray([1, 2]);     // true
isArray({});         // false
```

### `isPlainObject(val)`
判断是否为**纯粹的对象**（即由 `{}` 或 `new Object()` 创建，而非 `Date`、`RegExp` 等实例）。
```js
isPlainObject({});           // true
isPlainObject(new Date());   // false
isPlainObject(Object.create(null)); // true
```

### `isMap(val)` / `isSet(val)`
判断是否为 `Map` 或 `Set` 实例。
```js
isMap(new Map());  // true
isSet(new Set());  // true
```

### `isDate(val)` / `isRegExp(val)` / `isError(val)`
分别判断是否为日期、正则表达式、错误对象。
```js
isDate(new Date());     // true
isRegExp(/abc/);        // true
isError(new Error());   // true
```

## 空值与有效性判断

### `isNull(val)` / `isUndefined(val)`
严格判断 `null` 或 `undefined`。
```js
isNull(null);          // true
isUndefined(undefined); // true
```

### `isEmpty(val)`
判断是否为空值，支持以下情况：
- `null` / `undefined`
- 空字符串（含全空格）
- 空数组 `[]`
- 空对象 `{}`

```js
isEmpty('');        // true
isEmpty('   ');     // true
isEmpty([]);        // true
isEmpty({});        // true
isEmpty(0);         // false（数字 0 不视为空）
```

### `isNotEmpty(val)`
`isEmpty` 的反向判断。
```js
isNotEmpty('hello'); // true
isNotEmpty([]);      // false
```

## 数值相关扩展判断

### `isInteger(val)`
判断是否为整数（使用 `Number.isInteger`）。
```js
isInteger(5);    // true
isInteger(5.1);  // false
```

### `isPositive(val)` / `isNegative(val)`
判断是否为正数或负数（必须是 `number` 类型）。
```js
isPositive(10);  // true
isNegative(-5);  // true
isPositive('10'); // false（非 number）
```

### `isNumericString(val)`
判断是否为**有效的数字字符串**（可被 `parseFloat` 解析且不为 `NaN`）。
```js
isNumericString('123');    // true
isNumericString('-45.6');  // true
isNumericString('abc');    // false
isNumericString('');       // false
```

## DOM 与异步类型

### `isElement(val)`
判断是否为 DOM 元素（通过 `nodeType` 和 `nodeName` 判断）。
```js
isElement(document.body); // true
isElement({});            // false
```

### `isPromise(val)`
判断是否为 Promise（检查是否存在 `.then` 方法）。
```js
isPromise(Promise.resolve()); // true
isPromise({ then: () => {} }); // true（duck typing）
```

### `isNodeList(val)`
判断是否为 `NodeList`（如 `document.querySelectorAll` 返回值）。
```js
isNodeList(document.querySelectorAll('div')); // true
```


## 使用建议

| 场景 | 推荐函数 |
|------|--------|
| 表单校验 | `isString`, `isNumber`, `isNumericString`, `isEmpty` |
| props 类型守卫 | `isFunction`, `isPlainObject`, `isArray` |
| 数据预处理 | `isDate`, `isRegExp`, `isMap`, `isSet` |
| 条件渲染 | `isNotEmpty`, `isElement` |
| 错误处理 | `isError`, `isPromise` |
| 数值计算前校验 | `isInteger`, `isPositive`, `isFinite` |

> ✅ 所有函数均为纯函数，无副作用，可安全用于 `computed`、`watch`、方法或指令中。


## 兼容性说明

- 所有函数均兼容 **IE9+**；
- `isBigInt` 在不支持 `bigint` 的环境中始终返回 `false`；
- `isPromise` 采用“鸭子类型”判断，兼容原生 Promise 及类 Promise 对象（如 axios 请求）；
- `isElement` 不依赖 `instanceof HTMLElement`，避免跨 iframe 问题。

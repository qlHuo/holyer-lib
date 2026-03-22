/**
 * 通用辅助函数
 */

/**
 * 判断传入的值是否为 oneOf 的有效值
 */
export function oneOf(val) {
  return value => {
    return Array.isArray(val) && val.includes(value);
  };
}

/**
 * 创建一个只能被调用一次的函数。当这个函数被调用后，再次调用将不会有任何效果。
 * @param {Function} fn - 需要被包装的函数，这个函数只会被执行一次。
 * @return {Function} 返回一个新的函数，这个函数在第一次被调用时会执行原函数，之后调用将不会执行。
 * @throws {TypeError} 如果传入的 fn 不是函数类型，会抛出类型错误。
 * @example
 * this.handleSubmit = this.once(this.submitForm.bind(this));
 */
export function once(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  let hasBeenCalled = false;
  return function (...args) {
    if (!hasBeenCalled) {
      hasBeenCalled = true;
      fn.apply(this, args);
    }
  };
}

/**
 * 节流函数：确保函数在指定的延迟时间内最多执行一次
 * @param {Function} func - 需要被节流的函数
 * @param {number} delay - 节流延迟时间（毫秒），必须为正整数
 * @return {Function} 返回节流后的函数
 * @throws {TypeError} 如果传入的 func 不是函数类型或 delay 不是正整数，会抛出类型错误
 * @example
 * const throttledClick = throttle(handleClick, 300);
 * button.addEventListener('click', throttledClick);
 */
export function throttle(func, delay) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  if (typeof delay !== 'number' || delay <= 0 || !Number.isInteger(delay)) {
    throw new TypeError('Expected a positive integer delay');
  }

  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

/**
 * 防抖函数：确保函数在指定延迟时间内只执行一次（延迟结束后执行）
 * @param {Function} func - 需要被防抖的函数
 * @param {number} delay - 防抖延迟时间（毫秒），必须为正整数
 * @return {Function} 返回防抖后的函数
 * @throws {TypeError} 如果传入的 func 不是函数类型或 delay 不是正整数，会抛出类型错误
 * @example
 * const debouncedSearch = debounce(handleSearch, 300);
 * input.addEventListener('input', debouncedSearch);
 */
export function debounce(func, delay) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  if (typeof delay !== 'number' || delay <= 0 || !Number.isInteger(delay)) {
    throw new TypeError('Expected a positive integer delay');
  }

  let debounceTimer = null;
  return function (...args) {
    // 清除之前的定时器，确保每次调用都重置延迟
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    // 设置新的定时器，延迟执行函数
    debounceTimer = setTimeout(() => {
      func.apply(this, args); // 保持原函数的 this 指向和参数
      debounceTimer = null; // 执行后置空定时器引用，避免内存泄漏
    }, delay);
  };
}

/**
 * 生成一个符合 UUID v4 标准的随机唯一标识符。
 * 该函数优先使用现代浏览器的 crypto API 来生成 UUID，如果不支持，则回退到手动生成方案。
 *
 * @returns {string} 返回一个符合 UUID v4 标准的随机唯一标识符字符串。
 */
export function uuid() {
  // 尝试使用现代浏览器的 crypto API（优先使用）
  if (typeof crypto === 'object' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // 回退方案：手动生成 v4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 将数值或字符串转换为合法的 CSS 长度值（用于 style 绑定）
 * - 若为 number，自动追加 'px' 单位
 * - 若为 string，原样返回（假定用户已提供合法 CSS 长度值）
 * @param {number|string} value - 输入值（如 100, '100%', '50vh', 'auto'）
 * @returns {string} 合法的 CSS 长度字符串 默认值为 0
 * @example
 * formatSize(100)        // '100px'
 * formatSize('100%')     // '100%'
 * formatSize('50vh')     // '50vh'
 * formatSize(null)       // 0
 * formatSize(undefined)  // 0
 */
export function formatSize(value) {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return 0;
    }
    return value;
  }
  return 0;
}

/**
 * 深拷贝函数，支持处理循环引用和常见内置对象类型
 * @param {*} obj - 需要深拷贝的对象
 * @param {WeakMap} [visited=new WeakMap()] - 用于检测循环引用的WeakMap
 * @returns {*} 深拷贝后的对象
 */
export function deepClone(obj, visited = new WeakMap()) {
  // 处理基本类型、null、undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // 处理函数类型
  if (typeof obj === 'function') {
    return obj;
  }

  // 处理 Date 类型
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理 RegExp 类型
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理 Array 类型
  if (Array.isArray(obj)) {
    const clonedArray = [];
    visited.set(obj, clonedArray);
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], visited);
    }
    return clonedArray;
  }

  // 处理 Map 类型
  if (obj instanceof Map) {
    const clonedMap = new Map();
    visited.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, visited), deepClone(value, visited));
    });
    return clonedMap;
  }

  // 处理 Set 类型
  if (obj instanceof Set) {
    const clonedSet = new Set();
    visited.set(obj, clonedSet);
    obj.forEach(value => {
      clonedSet.add(deepClone(value, visited));
    });
    return clonedSet;
  }

  // 处理 ArrayBuffer 和 TypedArray
  if (obj instanceof ArrayBuffer) {
    return obj.slice(0);
  }

  // 处理普通对象
  const clonedObj = Object.create(Object.getPrototypeOf(obj));
  visited.set(obj, clonedObj);

  // 复制所有属性（包括不可枚举属性和 Symbol 属性）
  const allKeys = [...Object.keys(obj), ...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];

  allKeys.forEach(key => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);
      if (descriptor) {
        const clonedValue = deepClone(obj[key], visited);
        Object.defineProperty(clonedObj, key, {
          ...descriptor,
          value: clonedValue
        });
      } else {
        clonedObj[key] = deepClone(obj[key], visited);
      }
    } catch (e) {
      // 如果无法访问属性，使用默认方式
      clonedObj[key] = obj[key];
    }
  });

  return clonedObj;
}

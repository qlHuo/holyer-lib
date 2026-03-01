/**
 * 通用辅助函数
 */
export function noop() {}

export function once(fn) {
  let called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

export function throttle(func, delay) {
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

export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

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

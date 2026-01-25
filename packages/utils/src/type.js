/**
 * 类型判断工具
 */
export function isString(val) {
  return typeof val === 'string';
}

export function isNumber(val) {
  return typeof val === 'number' && !isNaN(val);
}

export function isFunction(val) {
  return typeof val === 'function';
}

export function isObject(val) {
  return val !== null && typeof val === 'object';
}

export function isArray(val) {
  return Array.isArray(val);
}

export function isUndefined(val) {
  return val === undefined;
}

export function isNull(val) {
  return val === null;
}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
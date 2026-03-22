/**
 * 类型判断工具 ./type.js
 */

/**
 * 判断传入的参数是否为字符串类型。
 * @param {any} val - 需要判断类型的参数。
 * @return {boolean} 如果参数是字符串类型，返回true；否则返回false。
 */
export function isString(val) {
  return typeof val === 'string';
}

/**
 * 判断传入的参数是否为布尔类型。
 * @param {any} val - 需要判断类型的参数。
 * @return {boolean} 如果参数是布尔类型，返回true；否则返回false。
 */
export function isBoolean(val) {
  return typeof val === 'boolean';
}

/**
 * 判断传入的值是否为有效的数字。
 * @param {any} val - 需要被判断是否为有效数字的值，类型不限。
 * @returns {boolean} - 如果`val`是有效的数字，返回`true`；否则返回`false`。
 */
export function isNumber(val) {
  return typeof val === 'number' && Number.isFinite(val);
}

/**
 * 判断传入的值是否为函数类型。
 * @param {any} val - 待判断类型的值，可以是任意类型。
 * @returns {boolean} 如果传入的值是函数类型，返回true；否则返回false。
 */
export function isFunction(val) {
  return typeof val === 'function';
}

/**
 * 判断传入的值是否为对象。
 * @param {*} val - 待判断的值，可以是任意类型。
 * @returns {boolean} 如果值不为 null 且类型为 'object'，则返回 true，否则返回 false。
 */
export function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * 判断传入的值是否为数组。
 * @param {any} val - 需要判断是否为数组的值，可以是任意类型。
 * @returns {boolean} - 如果传入的值是数组，返回 true；否则返回 false。
 */
export function isArray(val) {
  return Array.isArray(val);
}

/**
 * 判断传入的值是否为undefined。
 * @param {*} val - 需要判断的值，可以是任意类型。
 * @returns {boolean} - 如果传入的值严格等于undefined，返回true；否则返回false。
 */
export function isUndefined(val) {
  return val === undefined;
}

/**
 * 判断传入的值是否为 null。
 * @param {any} val - 待判断的值，可以是任意类型。
 * @returns {boolean} 如果传入的值严格等于 null，返回 true；否则返回 false。
 */
export function isNull(val) {
  return val === null;
}

/**
 * 判断传入的参数是否为一个纯粹的对象（plain object）。
 * @param {any} obj - 需要被判断类型的对象。
 * @returns {boolean} 如果传入的参数是纯粹的对象，返回true；否则返回false。
 */
export function isPlainObject(obj) {
  if (obj === null || typeof obj !== 'object') return false;
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 判断传入的值是否为日期对象。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是日期对象，返回true；否则返回false。
 */
export function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]';
}

/**
 * 判断传入的值是否为正则表达式对象。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是正则表达式对象，返回true；否则返回false。
 */
export function isRegExp(val) {
  return Object.prototype.toString.call(val) === '[object RegExp]';
}

/**
 * 判断传入的值是否为错误对象。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是错误对象，返回true；否则返回false。
 */
export function isError(val) {
  return Object.prototype.toString.call(val) === '[object Error]';
}

/**
 * 判断传入的值是否为 Map 对象。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是 Map 对象，返回true；否则返回false。
 */
export function isMap(val) {
  return Object.prototype.toString.call(val) === '[object Map]';
}

/**
 * 判断传入的值是否为 Set 对象。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是 Set 对象，返回true；否则返回false。
 */
export function isSet(val) {
  return Object.prototype.toString.call(val) === '[object Set]';
}

/**
 * 判断传入的值是否为 Symbol。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是 Symbol，返回true；否则返回false。
 */
export function isSymbol(val) {
  return typeof val === 'symbol';
}

/**
 * 判断传入的值是否为 BigInt。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是 BigInt，返回true；否则返回false。
 */
export function isBigInt(val) {
  return typeof val === 'bigint';
}

/**
 * 判断传入的值是否为空值（null、undefined、空字符串、空数组、空对象）。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值为空值，返回true；否则返回false。
 */
export function isEmpty(val) {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string' && val.trim() === '') return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (isObject(val) && Object.keys(val).length === 0) return true;
  return false;
}

/**
 * 判断传入的值是否为非空值。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值为非空值，返回true；否则返回false。
 */
export function isNotEmpty(val) {
  return !isEmpty(val);
}

/**
 * 判断传入的值是否为有效的数字字符串。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是有效的数字字符串，返回true；否则返回false。
 */
export function isNumericString(val) {
  return typeof val === 'string' && !isNaN(val) && !isNaN(parseFloat(val));
}

/**
 * 判断传入的值是否为整数。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是整数，返回true；否则返回false。
 */
export function isInteger(val) {
  return Number.isInteger(val);
}

/**
 * 判断传入的值是否为负数。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是负数，返回true；否则返回false。
 */
export function isNegative(val) {
  return typeof val === 'number' && val < 0;
}

/**
 * 判断传入的值是否为正数。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是正数，返回true；否则返回false。
 */
export function isPositive(val) {
  return typeof val === 'number' && val > 0;
}

/**
 * 判断传入的值是否为 DOM 元素。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是 DOM 元素，返回true；否则返回false。
 */
export function isElement(val) {
  return val && typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
}

/**
 * 判断传入的值是否为 Promise。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是 Promise，返回true；否则返回false。
 */
export function isPromise(val) {
  return val && typeof val.then === 'function';
}

/**
 * 判断传入的值是否为 NodeList。
 * @param {any} val - 待判断的值。
 * @returns {boolean} 如果传入的值是 NodeList，返回true；否则返回false。
 */
export function isNodeList(val) {
  return Object.prototype.toString.call(val) === '[object NodeList]';
}

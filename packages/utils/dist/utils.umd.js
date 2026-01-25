(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HolyerUtils = {}));
})(this, (function (exports) { 'use strict';

  /**
   * 类型判断工具
   */
  function isString(val) {
    return typeof val === 'string';
  }

  function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
  }

  function isFunction(val) {
    return typeof val === 'function';
  }

  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  function isArray(val) {
    return Array.isArray(val);
  }

  function isUndefined(val) {
    return val === undefined;
  }

  function isNull(val) {
    return val === null;
  }

  function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  /**
   * 简单 DOM 工具（兼容 IE9+）
   */
  function hasClass(el, cls) {
    if (!el || !cls) return false;
    return el.classList
      ? el.classList.contains(cls)
      : (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function addClass(el, cls) {
    if (!el || !cls) return;
    if (el.classList) {
      el.classList.add(cls);
    } else if (!hasClass(el, cls)) {
      el.className = el.className + ' ' + cls;
    }
  }

  function removeClass(el, cls) {
    if (!el || !cls) return;
    if (el.classList) {
      el.classList.remove(cls);
    } else {
      el.className = el.className.replace(
        new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
    }
  }

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function setScrollTop(value) {
    window.scrollTo(0, value);
  }

  /**
   * 通用辅助函数
   */
  function noop() {}

  function once(fn) {
    let called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    };
  }

  function throttle(func, delay) {
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

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function uuid() {
    // 尝试使用现代浏览器的 crypto API（优先使用）
    if (typeof crypto === 'object' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // 回退方案：手动生成 v4 UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  exports.addClass = addClass;
  exports.debounce = debounce;
  exports.getScrollTop = getScrollTop;
  exports.hasClass = hasClass;
  exports.isArray = isArray;
  exports.isFunction = isFunction;
  exports.isNull = isNull;
  exports.isNumber = isNumber;
  exports.isObject = isObject;
  exports.isPlainObject = isPlainObject;
  exports.isString = isString;
  exports.isUndefined = isUndefined;
  exports.noop = noop;
  exports.once = once;
  exports.removeClass = removeClass;
  exports.setScrollTop = setScrollTop;
  exports.throttle = throttle;
  exports.uuid = uuid;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

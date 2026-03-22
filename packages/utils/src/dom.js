/**
 * 简单 DOM 工具（兼容 IE9+）
 */

/**
 * 检查元素是否包含指定类名
 * @param {HTMLElement} el - 目标元素
 * @param {string} cls - 类名
 * @returns {boolean} 是否包含该类名
 */
/**
 * 检查元素是否包含指定类名
 * @param {HTMLElement} el - 目标元素
 * @param {string} cls - 类名
 * @returns {boolean} 是否包含该类名
 */
export function hasClass(el, cls) {
  if (!el || !cls) return false;

  const classNames = cls
    .trim()
    .split(/\s+/)
    .filter(name => name);
  if (classNames.length === 0) return false;

  if (el.classList) {
    return classNames.every(className => el.classList.contains(className));
  }

  const elementClassName = el.className;
  if (!elementClassName) return false;

  return classNames.every(targetClass => {
    const escapedClass = targetClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(^|\\s)' + escapedClass + '(\\s|$)');
    return regex.test(elementClassName);
  });
}

/**
 * 为元素添加类名
 * @param {HTMLElement} el - 目标元素
 * @param {string} cls - 类名
 */
export function addClass(el, cls) {
  if (!el || !cls || typeof cls !== 'string') return;

  // 去除空白并过滤空字符串
  const classNames = cls
    .trim()
    .split(/\s+/)
    .filter(name => name.length > 0);
  if (classNames.length === 0) return;

  if (el.classList) {
    classNames.forEach(className => {
      if (typeof className === 'string' && className && !el.classList.contains(className)) {
        el.classList.add(className);
      }
    });
  } else {
    const currentClassName = String(el.className || '');
    const currentClassNames = currentClassName
      .trim()
      .split(/\s+/)
      .filter(name => name.length > 0);

    // 找出需要添加的新类名
    const newClassNames = classNames.filter(className => {
      if (typeof className !== 'string') return false;
      return !currentClassNames.includes(className);
    });

    if (newClassNames.length > 0) {
      const separator = currentClassName ? ' ' : '';
      el.className = currentClassName + separator + newClassNames.join(' ');
    }
  }
}

/**
 * 从元素移除类名
 * @param {HTMLElement} el - 目标元素
 * @param {string} cls - 类名
 */
export function removeClass(el, cls) {
  if (!el || !cls) return;

  const classNames = cls
    .trim()
    .split(/\s+/)
    .filter(name => name);
  if (classNames.length === 0) return;

  if (el.classList) {
    classNames.forEach(className => {
      if (className) {
        el.classList.remove(className);
      }
    });
  } else {
    const currentClassName = el.className;
    if (currentClassName) {
      // 分割现有类名并过滤掉要移除的类名
      const currentClassNames = currentClassName
        .trim()
        .split(/\s+/)
        .filter(name => name);
      const remainingClassNames = currentClassNames.filter(currentClass => !classNames.includes(currentClass));

      // 重新设置类名
      el.className = remainingClassNames.join(' ');
    }
  }
}

/**
 * 切换元素上的类名。根据传入的 `force` 参数，可以强制添加或移除类名，或者在没有 `force` 参数时切换类名。
 *
 * @param {HTMLElement} el - 需要操作的DOM元素。
 * @param {string} cls - 需要切换的类名。
 * @param {boolean} [force] - 可选参数，如果为 `true`，则添加类名；如果为 `false`，则移除类名。如果未提供，则切换类名。
 * @returns {boolean} - 返回类名切换后的结果。如果类名被添加，返回 `true`；如果类名被移除，返回 `false`。
 */
export function toggleClass(el, cls, force) {
  if (!el || !cls) return false;

  if (el.classList) {
    return el.classList.toggle(cls, force);
  } else {
    const hasClassResult = hasClass(el, cls);

    if (typeof force === 'boolean') {
      if (force && !hasClassResult) {
        addClass(el, cls);
      } else if (!force && hasClassResult) {
        removeClass(el, cls);
      }
      return force ?? !hasClassResult;
    } else {
      if (hasClassResult) {
        removeClass(el, cls);
        return false;
      } else {
        addClass(el, cls);
        return true;
      }
    }
  }
}

/**
 * 获取滚动条位置
 * @returns {number} 页面垂直滚动位置
 */
export function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

/**
 * 设置滚动条位置
 * @param {number} value - 滚动位置
 */
export function setScrollTop(value) {
  window.scrollTo(0, value);
}

/**
 * 获取元素相对于视窗的位置
 * @param {HTMLElement} el - 目标元素
 * @returns {Object} 包含 top、left、width、height 的对象
 */
export function getBoundingClientRect(el) {
  if (!el) return { top: 0, left: 0, width: 0, height: 0 };

  if (el.getBoundingClientRect) {
    return el.getBoundingClientRect();
  } else {
    // 兼容性处理
    const rect = {};
    let currentEl = el;
    rect.top = 0;
    rect.left = 0;

    while (currentEl && currentEl !== document.body) {
      rect.top += currentEl.offsetTop;
      rect.left += currentEl.offsetLeft;
      currentEl = currentEl.offsetParent;
    }

    rect.width = el.offsetWidth;
    rect.height = el.offsetHeight;

    return rect;
  }
}

/**
 * 获取元素的尺寸
 * @param {HTMLElement} el - 目标元素
 * @returns {Object} 包含 width、height 的对象
 */
export function getElementSize(el) {
  if (!el) return { width: 0, height: 0 };

  if (el.getBoundingClientRect) {
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  } else {
    return {
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  }
}

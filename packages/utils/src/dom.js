/**
 * 简单 DOM 工具（兼容 IE9+）
 */
export function hasClass(el, cls) {
  if (!el || !cls) return false;
  return el.classList
    ? el.classList.contains(cls)
    : (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

export function addClass(el, cls) {
  if (!el || !cls) return;
  if (el.classList) {
    el.classList.add(cls);
  } else if (!hasClass(el, cls)) {
    el.className = el.className + ' ' + cls;
  }
}

export function removeClass(el, cls) {
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

export function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function setScrollTop(value) {
  window.scrollTo(0, value);
}
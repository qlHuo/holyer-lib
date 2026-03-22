import { debounce } from '@holyer-lib/utils';
export default {
  bind(el, binding, vnode) {
    const handler = () => {
      try {
        const method = vnode.context[binding.expression];
        if (typeof method === 'function') {
          method.apply();
        } else {
          // eslint-disable-next-line no-console
          console.warn(`指令绑定的表达式 "${binding.expression}" 对应的不是函数`);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('元素尺寸变化回调执行出错:', error);
      }
    };

    // 使用防抖包装 handler
    const debouncedHandler = debounce(handler, 200);

    el.resizeObserver = new ResizeObserver(debouncedHandler);
    el.resizeObserver.observe(el);
  },

  unbind(el) {
    if (el.resizeObserver) {
      el.resizeObserver.unobserve(el);
      el.resizeObserver.disconnect();
      el.resizeObserver = null;
    }
  }
};

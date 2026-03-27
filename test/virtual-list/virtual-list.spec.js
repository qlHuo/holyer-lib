import { mount } from '@vue/test-utils';
import HiVirtualList from '../../packages/ui/virtual-list/src/index.vue';

describe('HiVirtualList.vue', () => {
  const items = Array.from({ length: 30 }, (_, i) => ({ id: `item-${i}`, text: `item-${i}` }));

  const createWrapper = (props = {}) => {
    return mount(HiVirtualList, {
      propsData: {
        items,
        itemHeight: 20,
        height: 200,
        ...props
      },
      scopedSlots: {
        default(props) {
          return this.$createElement('div', { class: 'row' }, props.item ? props.item.text : '');
        }
      },
      attachTo: document.body
    });
  };

  const setRootClientHeight = (wrapper, value) => {
    Object.defineProperty(wrapper.vm.$refs.rootRef, 'clientHeight', {
      configurable: true,
      value
    });
  };

  beforeEach(() => {
    global.ResizeObserver = class {
      constructor(cb) {
        this.cb = cb;
        this.observe = jest.fn();
        this.disconnect = jest.fn();
      }
    };
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete global.ResizeObserver;
  });

  it('基础渲染和计算', async () => {
    const wrapper = createWrapper();
    setRootClientHeight(wrapper, 200);
    wrapper.vm.updateClientHeight();
    await wrapper.vm.$nextTick();

    expect(wrapper.classes()).toContain('hi-virtual-list');
    expect(wrapper.attributes('style')).toContain('height: 200px');
    expect(wrapper.vm.total).toBe(30);
    expect(wrapper.vm.itemHeight).toBe(20);
    expect(wrapper.vm.clientHeight).toBe(200);
    // expect(wrapper.vm.visibleCount).toBe(110);
    expect(wrapper.vm.visibleItems.length).toBe(Math.min(wrapper.vm.visibleCount, wrapper.vm.total));
    expect(wrapper.vm.visibleItems.length).toBe(30);
    expect(wrapper.findAll('.hi-virtual-list--item-wrapper').length).toBe(30);
    expect(wrapper.vm.topPlaceholderHeight).toBe('0px');
    expect(wrapper.vm.bottomPlaceholderHeight).toBe('0px');

    wrapper.destroy();
  });

  it('handleScroll 事件逻辑', async () => {
    const wrapper = createWrapper();
    setRootClientHeight(wrapper, 100);
    wrapper.vm.updateClientHeight();
    await wrapper.vm.$nextTick();

    // 模拟滚动到顶部
    wrapper.vm.scrollTop = 0;
    wrapper.vm.handleScroll({
      target: { scrollTop: 0, scrollHeight: 400, clientHeight: 100 }
    });
    expect(wrapper.emitted('scroll')).toBeTruthy();
    expect(wrapper.emitted('reach-top')).toBeTruthy();
    expect(wrapper.emitted('reach-bottom')).toBeFalsy();

    // 模拟滚动到底部
    wrapper.vm.scrollTop = 310;
    wrapper.vm.handleScroll({
      target: { scrollTop: 310, scrollHeight: 400, clientHeight: 100 }
    });
    expect(wrapper.emitted('reach-bottom')).toBeTruthy();
    expect(wrapper.emitted('visible-change')).toBeTruthy();

    wrapper.destroy();
  });

  it('_shouldUseNodeKey/getNodeKey', () => {
    const wrapper = createWrapper({ nodeKey: 'id' });
    setRootClientHeight(wrapper, 120);
    wrapper.vm.updateClientHeight();

    expect(wrapper.vm._shouldUseNodeKey()).toBe(true);
    expect(wrapper.vm.getNodeKey(items[1], 1)).toBe('item-1');
    expect(wrapper.vm.getNodeKey(null, 2)).toBe(2);

    wrapper.destroy();
  });

  it('scrollTo/scrollToTop/scrollToBottom/越界', async () => {
    const wrapper = createWrapper();
    setRootClientHeight(wrapper, 120);
    wrapper.vm.updateClientHeight();

    wrapper.vm._setScrollTop = jest.fn();
    wrapper.vm.scrollTo(5);
    expect(wrapper.vm._setScrollTop).toHaveBeenCalledWith(100);

    await wrapper.setProps({ nodeKey: 'id' });
    wrapper.vm.scrollTo('item-10');
    expect(wrapper.vm._setScrollTop).toHaveBeenCalledWith(200);

    wrapper.vm._setScrollTop.mockClear();
    wrapper.vm.scrollTo(999); // 无效 index
    expect(wrapper.vm._setScrollTop).not.toHaveBeenCalled();
    wrapper.vm.scrollTo('not-exist'); // 无效 key
    expect(wrapper.vm._setScrollTop).not.toHaveBeenCalled();

    wrapper.vm.scrollToTop();
    expect(wrapper.vm._setScrollTop).toHaveBeenCalledWith(0);
    wrapper.vm.scrollToBottom();
    expect(wrapper.vm._setScrollTop).toHaveBeenCalledWith(600);

    wrapper.destroy();
  });

  it('refresh + 资源清理', () => {
    const wrapper = createWrapper();
    setRootClientHeight(wrapper, 115);
    wrapper.vm.refresh();
    expect(wrapper.vm.clientHeight).toBe(115);

    expect(wrapper.vm.resizeObserver).not.toBeNull();

    wrapper.destroy();
    expect(wrapper.vm.resizeObserver).toBeNull();
  });

  // 边界和特殊值测试
  it('边界：items 为空', async () => {
    const wrapper = createWrapper({ items: [] });
    setRootClientHeight(wrapper, 200);
    wrapper.vm.updateClientHeight();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.total).toBe(0);
    expect(wrapper.vm.visibleItems.length).toBe(0);
    expect(wrapper.findAll('.hi-virtual-list--item-wrapper').length).toBe(0);
    expect(wrapper.vm.topPlaceholderHeight).toBe('0px');
    expect(wrapper.vm.bottomPlaceholderHeight).toBe('0px');

    wrapper.destroy();
  });

  it('边界：buffer 为 0', async () => {
    const wrapper = createWrapper({ buffer: 0 });
    setRootClientHeight(wrapper, 200);
    wrapper.vm.updateClientHeight();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.visibleCount).toBe(10);
    expect(wrapper.vm.visibleItems.length).toBe(10);

    wrapper.destroy();
  });

  it('边界：scrollTo 无效类型', () => {
    const wrapper = createWrapper();
    wrapper.vm._setScrollTop = jest.fn();

    wrapper.vm.scrollTo(null);
    expect(wrapper.vm._setScrollTop).not.toHaveBeenCalled();
    wrapper.vm.scrollTo(undefined);
    expect(wrapper.vm._setScrollTop).not.toHaveBeenCalled();
    wrapper.vm.scrollTo({});
    expect(wrapper.vm._setScrollTop).not.toHaveBeenCalled();

    wrapper.destroy();
  });



  it('updates visible items on scroll', async () => {
    const wrapper = createWrapper();
    setRootClientHeight(wrapper, 100);
    wrapper.vm.updateClientHeight();
    await wrapper.vm.$nextTick();

    wrapper.vm.handleScroll({
      target: { scrollTop: 100, scrollHeight: 600, clientHeight: 100 }
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('visible-change')).toBeTruthy();
    expect(wrapper.vm.visibleItems.length).toBeGreaterThan(0);
    wrapper.destroy();
  });

  it('handles dynamic item height changes', async () => {
    const wrapper = createWrapper();
    await wrapper.setProps({ itemHeight: 30 });
    setRootClientHeight(wrapper, 200);
    wrapper.vm.updateClientHeight();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.itemHeight).toBe(30);
    expect(wrapper.vm.visibleCount).toBe(107); // Math.ceil(200/30) + 100 ≈ 7 + 100 = 107
    wrapper.destroy();
  });

  it('scrollTo with nodeKey handles invalid keys gracefully', async () => {
    const wrapper = createWrapper({ nodeKey: 'id' });
    wrapper.vm._setScrollTop = jest.fn();
    wrapper.vm.scrollTo('invalid-key');
    expect(wrapper.vm._setScrollTop).not.toHaveBeenCalled();
    wrapper.destroy();
  });

  it('refresh updates client height correctly', () => {
    const wrapper = createWrapper();
    setRootClientHeight(wrapper, 150);
    wrapper.vm.refresh();
    expect(wrapper.vm.clientHeight).toBe(150);
    wrapper.destroy();
  });

  it('handles large number of items', async () => {
    const largeItems = Array.from({ length: 1000 }, (_, i) => ({ id: `item-${i}`, text: `item-${i}` }));
    const wrapper = createWrapper({ items: largeItems });
    setRootClientHeight(wrapper, 200);
    wrapper.vm.updateClientHeight();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.total).toBe(1000);
    expect(wrapper.vm.visibleItems.length).toBeLessThanOrEqual(110);
    wrapper.destroy();
  });

  it('supports string height', () => {
    const wrapper = createWrapper({ height: '300px' });
    expect(wrapper.attributes('style')).toContain('height: 300px');
  });

});

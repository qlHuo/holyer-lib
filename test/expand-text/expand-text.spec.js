import { mount } from '@vue/test-utils';
import HiExpandText from '../../packages/ui/expand-text/src/index.vue';

describe('HiExpandText.vue', () => {
  let wrapper = null;

  const patchTextRefRect = (wrapper, params) => {
    const el = wrapper.vm.$refs.textRef;
    Object.defineProperty(el, 'offsetParent', {
      get: () => params.offsetParent || document.body,
      configurable: true
    });
    Object.defineProperty(el, 'scrollHeight', {
      get: () => params.scrollHeight,
      configurable: true
    });
    Object.defineProperty(el, 'clientHeight', {
      get: () => params.clientHeight,
      configurable: true
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.style.userSelect = '';
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    if (wrapper) wrapper.destroy();
    wrapper = null;
  });

  it('默认渲染、slot/trigger 正确', async () => {
    wrapper = mount(HiExpandText, {
      attachTo: document.body,
      propsData: {
        content: 'short text'
      },
      slots: {
        default: '<span class="text-inner">short text</span>',
        toggleText: '<span class="custom-toggle">更多</span>'
      }
    });

    expect(wrapper.find('.text-inner').exists()).toBe(true);
    expect(wrapper.find('.custom-toggle').exists()).toBe(false); // short text 不溢出
    expect(wrapper.vm.showToggle).toBe(false);
    expect(wrapper.find('.hi-expand-text--toggle').exists()).toBe(false);
  });

  it('超长内容时 showToggle=true，点击切换 isExpanded 并发出 toggle 事件', async () => {
    wrapper = mount(HiExpandText, {
      attachTo: document.body,
      propsData: {
        content: 'long text that should overflow with lineClamp=2'
      }
    });

    patchTextRefRect(wrapper, { scrollHeight: 500, clientHeight: 100 });
    wrapper.vm.checkEllipsis();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.showToggle).toBe(true);
    expect(wrapper.find('.hi-expand-text--toggle').exists()).toBe(true);
    expect(wrapper.find('.hi-expand-text--toggle').text()).toBe('展开');

    await wrapper.find('.hi-expand-text--toggle').trigger('click');
    expect(wrapper.vm.isExpanded).toBe(true);
    expect(wrapper.emitted('toggle')).toEqual([[true]]);

    // 展开状态下 checkEllipsis 走 wouldOverflowIfCollapsed
    patchTextRefRect(wrapper, { scrollHeight: 500, clientHeight: 100 });
    wrapper.vm.checkEllipsis();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showToggle).toBe(true);

    // label 支持自定义
    await wrapper.setProps({ label: ['显示更多', '收起'] });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.expandText).toBe('收起');
  });

  it('update() 触发 checkEllipsis 并支持内容变更', async () => {
    wrapper = mount(HiExpandText, {
      attachTo: document.body,
      propsData: { content: 'some text' }
    });

    patchTextRefRect(wrapper, { scrollHeight: 120, clientHeight: 100 });
    wrapper.vm.update();
    jest.runAllTimers();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showToggle).toBe(true);

    // content 变更时 watch 触发
    await wrapper.setProps({ content: 'updated text' });
    patchTextRefRect(wrapper, { scrollHeight: 150, clientHeight: 80 });
    jest.runAllTimers();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showToggle).toBe(true);
  });
});

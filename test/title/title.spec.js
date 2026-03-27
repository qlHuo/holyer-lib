// test/title.spec.js
import { shallowMount, mount } from '@vue/test-utils';
import HiTitle from '../../packages/ui/title/src/index.vue';

describe('HiTitle.vue', () => {
  // 测试默认渲染
  it('renders correctly with default props', () => {
    const wrapper = shallowMount(HiTitle, {
      propsData: {
        content: 'Hello Title'
      }
    });

    expect(wrapper.find('.hi-title__text').text()).toBe('Hello Title');
    expect(wrapper.classes()).toContain('hi-title--medium'); // 默认 size
    expect(wrapper.find('.hi-title__bar').exists()).toBe(true); // 默认前缀是 bar
  });

  // 测试尺寸 prop
  it('applies correct size class and styles', async () => {
    const wrapper = shallowMount(HiTitle, {
      propsData: {
        content: 'Large Title',
        size: 'large'
      }
    });

    expect(wrapper.classes()).toContain('hi-title--large');
    expect(wrapper.find('.hi-title__text').attributes('style')).toContain('18px'); // large → 18px

    const barStyle = wrapper.find('.hi-title__bar').attributes('style');
    const heightMatch = barStyle.match(/height:\s*([\d.]+)px/);
    expect(parseFloat(heightMatch[1])).toBeCloseTo(21.6, 1); // 允许 1 位小数误差
  });

  // 测试自定义颜色
  it('applies custom text color when color prop is set', () => {
    const wrapper = shallowMount(HiTitle, {
      propsData: {
        content: 'Colored Title',
        color: '#ff0000'
      }
    });

    const style = wrapper.find('.hi-title__text').attributes('style');
    expect(style).toMatch(/color:\s*rgb\(255,\s*0,\s*0\)/);
  });

  // 测试 prefixIcon 插槽优先级
  it('renders prefix slot when provided (overrides prefixIcon and bar)', () => {
    const wrapper = shallowMount(HiTitle, {
      propsData: {
        content: 'With Prefix Slot'
      },
      slots: {
        prefix: '<span class="custom-prefix">★</span>'
      }
    });

    expect(wrapper.find('.custom-prefix').exists()).toBe(true);
    expect(wrapper.find('.hi-title__icon').exists()).toBe(false);
    expect(wrapper.find('.hi-title__bar').exists()).toBe(false);
  });

  // 测试 prefixIcon 组件
  it('renders prefixIcon component when provided', () => {
    const MockIcon = {
      name: 'MockIcon',
      render(h) {
        return h('svg', { class: 'mock-icon' });
      }
    };

    const wrapper = mount(HiTitle, {
      propsData: {
        content: 'With Icon',
        prefixIcon: MockIcon
      }
    });

    expect(wrapper.find('.mock-icon').exists()).toBe(true);
    expect(wrapper.find('.hi-title__bar').exists()).toBe(false);
  });

  // 测试 description 显示
  it('shows description when description prop is provided', () => {
    const wrapper = shallowMount(HiTitle, {
      propsData: {
        content: 'Main Title',
        description: 'This is a description'
      }
    });

    expect(wrapper.find('.hi-title__description').text()).toBe('This is a description');
    expect(wrapper.classes()).toContain('hi-title--has-desc');
  });

  // 测试 description slot 优先级高于 prop
  it('description slot overrides description prop', () => {
    const wrapper = shallowMount(HiTitle, {
      propsData: {
        content: 'Main Title',
        description: 'Prop Description'
      },
      slots: {
        description: 'Slot Description'
      }
    });

    expect(wrapper.find('.hi-title__description').text()).toBe('Slot Description');
  });

  // 测试 default slot 优先级高于 content prop
  it('default slot overrides content prop', () => {
    const wrapper = shallowMount(HiTitle, {
      propsData: {
        content: 'Prop Content'
      },
      slots: {
        default: 'Slot Content'
      }
    });

    expect(wrapper.find('.hi-title__text').text()).toBe('Slot Content');
  });

  // 测试 $attrs 透传（inheritAttrs: false，所以应绑定到根元素）
  it('binds $attrs to root element', () => {
    const wrapper = shallowMount(HiTitle, {
      attrs: {
        'data-test': 'title-root',
        id: 'my-title'
      }
    });

    expect(wrapper.attributes('data-test')).toBe('title-root');
    expect(wrapper.attributes('id')).toBe('my-title');
  });
});

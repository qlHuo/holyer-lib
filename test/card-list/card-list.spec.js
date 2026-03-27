// test/card-list/card-list.spec.js
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import HiCardList from '../../packages/ui/card-list/src/index.vue';
import HiCardItem from '../../packages/ui/card-list/src/item.vue';

/**
 * 创建一个预设 props 的 HiCardItem 组件构造器
 * @param {Object} propsData - 要传递给 HiCardItem 的 props
 * @returns {VueComponent} 可用于 slots 的组件构造函数
 */
function createCardItem(propsData = {}) {
  return Vue.extend({
    render(h) {
      return h(HiCardItem, {
        props: propsData
      });
    }
  });
}

describe('HiCardList + HiCardItem (Integrated)', () => {
  // ======================
  // HiCardList 自身测试
  // ======================

  it('renders slot content', () => {
    const wrapper = mount(HiCardList, {
      slots: { default: '<div class="test-child">Child</div>' }
    });
    expect(wrapper.find('.test-child').exists()).toBe(true);
  });

  it('applies responsive columns via CSS variables', () => {
    const wrapper = mount(HiCardList, {
      propsData: { col: 2, xs: 3, sm: 4 }
    });
    const styles = wrapper.vm.styles;
    expect(styles['--col-count']).toBe(2);
    expect(styles['--xs-col-count']).toBe(3);
    expect(styles['--sm-col-count']).toBe(4);
  });

  // ======================
  // 集成测试：HiCardItem 行为
  // ======================

  it('renders HiCardItem with props when no slots', () => {
    const CardItem = createCardItem({ title: 'Prop Title', content: 'Prop Content' });
    const wrapper = mount(HiCardList, {
      slots: { default: CardItem }
    });

    const item = wrapper.findComponent(HiCardItem);
    expect(item.find('.hi-card-item--header_title').text()).toBe('Prop Title');
    expect(item.find('.hi-card-item--content').text()).toBe('Prop Content');
  });


  // 模拟HiCardItem点击事件
  // findComponent().emitted()  为 undefined, 只有顶层wrapper.emitted() 有值
  it('emits click when clicked', async () => {
    const wrapper = mount(HiCardItem, {
      propsData: { title: 'Test' },
      // 使用 provideInherit 来继承父组件的 provide
      provide: {
        HiCardList: {
          col: 4,
          gutter: 16
        }
      }
    });

    await wrapper.find('.hi-card-item').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  // !!!无效!!!
  // it('emits click event from HiCardItem', async () => {
  //   const CardItem = createCardItem();
  //   const wrapper = mount(HiCardList, {
  //     slots: { default: CardItem }
  //   });

  //   const item = wrapper.findComponent(HiCardItem);
  //   const root = item.find('.hi-card-item'); // 替换为你的实际根元素选择器
  //   console.log('Item HTML:', item.html());

  //   expect(root.exists()).toBe(true);
  //   console.log('Root exists?', root.exists());

  //   await root.trigger('click');

  //   console.log('Emitted:', item.emitted());
  //   expect(item.emitted('click')).toBeTruthy();

  //   // const CardItem = createCardItem();
  //   // const wrapper = mount(HiCardList, {
  //   //   slots: { default: CardItem }
  //   // });

  //   // const item = wrapper.findComponent(HiCardItem);
  //   // await item.trigger('click');
  //   // expect(item.emitted('click')).toBeTruthy();
  // });

  it('applies active class when actived=true', () => {
    const ActiveCardItem = createCardItem({ actived: true });
    const wrapper = mount(HiCardList, {
      slots: { default: ActiveCardItem }
    });
    expect(wrapper.findComponent(HiCardItem).classes()).toContain('hi-card-item--active');
  });

  it('does not render header if neither title nor icon is provided', () => {
    const EmptyCardItem = createCardItem({ title: '', icon: '' });
    const wrapper = mount(HiCardList, {
      slots: { default: EmptyCardItem }
    });
    expect(wrapper.findComponent(HiCardItem).find('.hi-card-item--header').exists()).toBe(false);
  });

  it('passes itemClass to all HiCardItem instances', () => {
    const CardItem1 = createCardItem();
    const CardItem2 = createCardItem();
    const wrapper = mount(HiCardList, {
      propsData: { itemClass: 'custom-class' },
      slots: { default: [CardItem1, CardItem2] }
    });

    const items = wrapper.findAllComponents(HiCardItem);
    expect(items).toHaveLength(2);
    items.wrappers.forEach(item => {
      expect(item.classes()).toContain('custom-class');
    });
  });
});

// docs/.vuepress/config.js
const path = require('path');

module.exports = {
  title: 'holyer-lib',
  description: '开箱即用的Vue@2.6组件库，支持单包引入',
  base: process.env.NODE_ENV === 'production' ? '/holyer-lib/' : '/',
  // base: process.env.NODE_ENV === 'production' ? '/holyer-lib/' : '/',
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/views/guide/' },
      { text: '开发流程', link: '/views/develop/' },
    ],
    sidebar: {
      '/views/guide/': [
        {
          title: '使用指南',
          collapsable: false,
          children: [
            ''
          ]
        },
        {
          title: '组件',
          collapsable: false,
          children: [
            'card-list',
            'expand-panel',
            'expand-text',
            'title',
            'virtual-list'
          ]
        }
      ],
      '/views/develop/': [
        {
          title: '开发流程',
          collapsable: false,
          children: [
            '',
          ]
        }
      ],
    },
    lastUpdated: 'Last Updated',
    smoothScroll: true
  },

  plugins: [
    ['demo-container', {
      cssPreprocessor: 'less',
      jsLibs: [
        // 按需添加第三方库（示例中会自动引入）
        // 'https://unpkg.com/dayjs@1.11.7/dayjs.min.js'
      ],
      cssLibs: [
        // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
      ],
      // 代码高亮主题（与 VuePress 默认一致）
      codeStyle: 'github'
    }]
  ]
};

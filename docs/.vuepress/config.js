module.exports = {
  base: '/',
  title: 'Async的小破屋',
  description: 'Async的小破屋',
  port: '8090',
  head: [
    ['link', { rel: 'icon', href: '/img/logo.png' }],
  ],
  themeConfig: {
    lastUpdated: '最后更新时间',
    smoothScroll: true, // 启用页面滚动效果
    // 开启搜索
    search: true,
    searchMaxSuggestions: 10,
    sidebar: [
      ['/', '介绍'],
      {
        title: 'javascript',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          ['/javascript/runner', '生成器runner'],
          ['/javascript/typeof', '数据类型'],
          ['/javascript/promise', 'promise'],
          ['/javascript/type-conversion', '类型转换']
        ]
      }
    ]
  },
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/pwa',
    {
      serviceWorker: true,
      updatePopup: true
    }
  ]
}

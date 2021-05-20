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
    // displayAllHeaders: true, // 显示所有页面的标题链接
    sidebar: [
      ['/', '介绍'],
      {
        title: 'javascript',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          ['/javascript/runner', '生成器runner'],
          ['/javascript/typeof', '数据类型'],
          ['/javascript/promise', 'promise'],
          ['/javascript/typeConversion', '类型转换'],
          ['/javascript/json', 'JSON.stringify()'],
          ['/javascript/objectWrapper', '封装对象'],
          ['/javascript/scope', '作用域'],
          ['/javascript/letLoopAndClosure', '闭包和let循环'],
          // ['/javascript/function', '函数']
        ]
      },
      {
        title: 'typescript',
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          ['/typescript/this', 'this'],
          ['/typescript/unknown', 'unknown'],
          ['/typescript/never', 'never'],
          ['/typescript/asConst', 'const断言'],
          ['/typescript/enum', 'enum']
        ]
      }
    ]
  },
  plugins: [
    ['@vuepress/back-to-top'],
    [
      '@vuepress/pwa', 
      {
        serviceWorker: true,
        updatePopup: true
      }
    ],
  ]
}

module.exports = {
  title: 'Async的小破屋',
  description: 'Async的小破屋',
  port: '8090',
  themeConfig: {
    lastUpdated: 'Last Updated',
    smoothScroll: true, // 启用页面滚动效果
    // 开启搜索
    search: true,
    searchMaxSuggestions: 10,

    sidebar: [
      ['/', '介绍'],
      {
        title: 'javascript',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          ['/javascript/runner', '生成器runner'],
          ['/javascript/typeof', '数据类型']
        ]
      }
    ]
  }
}

module.exports = {
	theme: 'reco',
  base: '/',
  title: 'Async Blog',
  description: 'Async的小破屋',
  port: '8090',
  head: [
    ['link', { rel: 'icon', href: '/img/logo.png' }],
		['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  themeConfig: {
		logo: '/img/avatar.jpg',
		author: 'lw',
		subSidebar: 'auto',
    lastUpdated: '最后更新时间',
    smoothScroll: true, // 启用页面滚动效果
		noFoundPageByTencent: true, // 腾讯公益
    // 开启搜索
    search: true,
    searchMaxSuggestions: 10,
    // algolia: {
    //   apiKey: '25626fae796133dc1e734c6bcaaeac3c',
    //   indexName: 'docsearch',
    // },
		// 博客配置
		blogConfig: {
			category: {
				text: 'Category' // 默认文案 “分类”
			},
			tag: {
				text: 'Tag'      // 默认文案 “标签”
			},
			socialLinks: [     // 信息栏展示社交信息
				{ icon: 'reco-github', link: 'https://github.com/785184273/docs' },
			]
		},
    nav: [
      { text: 'GitHub', link: 'https://github.com/785184273/docs', icon: 'reco-github' },
			{ text: 'TimeLine', link: '/timeline/', icon: 'reco-date' }
    ],
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
          ['/javascript/offset', '偏移量']
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
          ['/typescript/enum', 'enum'],
					['/typescript/typeAssertionVSTypeDeclaration', '类型断言VS类型声明']
        ]
      },
      {
        title: '数据结构与算法',
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          ['/dataStructure/stack', '栈'],
          ['/dataStructure/queue', '队列'],
          ['/dataStructure/deque', '双端队列'],
          ['/dataStructure/linkedList', '链表'],
          ['/dataStructure/doublyLinkList', '双向链表'],
          ['/dataStructure/sortAlgorithm', '排序算法']
        ]
      },
      {
        title: 'vue',
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          ['/vue/fncCallComponent', 'vue组件函数式调用'],
					['/vue/newVue', 'new Vue过程'],
					['/vue/watcher', 'watcher'],
					['/vue/render', 'render'],
					['/vue/update', 'update'],
					['/vue/mergeOption', '参数合并'],
					['/vue/observe', '响应式对象'],
					['/vue/depCollection', '依赖收集'],
					['/vue/notifyUpdate', '派发更新'],
					['/vue/set', '响应式set方法'],
					['/vue/del', '响应式del方法'],
					['/vue/nextTick', 'nextTick'],
					['/vue/computed', '计算属性'],
					['/vue/watch', '监听器'],
					// ['/vue/props', 'props'],
					['/vue/createComponent', 'createComponent'],
					['/vue/patch', '初始化组件patch'],
					['/vue/componentRegistry', '组件注册'],
          ['/vue/domDiff', '组件更新'],
        ]
      }
    ]
  },
  plugins: [
    [
			'@vuepress/back-to-top',
			{
				icon: 'reco-up'
			},
		],
    [
      '@vuepress/pwa', 
      {
        serviceWorker: true,
        updatePopup: true
      }
    ],
  ]
}

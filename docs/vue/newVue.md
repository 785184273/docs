# new Vue

## 前提

**之后的小节都涉及到对Vue2.x源码的分析，需要读者对Vue2.x的使用有一定的了解，最好使用Vue2.x开发过大型项目，我会尽可能口语化的解释其中的一些原理（毕竟也是菜鸡），如未使用过建议先多次阅读[官方文档](https://cn.vuejs.org/)**

<code>new</code>关键字代表实例化一个对象，那么<code>Vue</code>可能是一个构造函数<code>function Vue</code>也可能是一个类<code>Class Vue</code>，从入口文件进行分析，<code>src/core/instance/index.js</code>中，<code>Vue</code>作为一个构造函数存在
```js
function Vue (options) {
	if (process.env.NODE_ENV !== 'production' &&
		!(this instanceof Vue)
	) {
		warn('Vue is a constructor and should be called with the `new` keyword')
	}
	this._init(options)
}

// 下面的各个mixin为Vue构造函数的原型对象扩展方法
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
	
```
<code>new Vue</code>会调用原型上的<code>_init</code>方法，该方法在<code>initMixin</code>中扩展，文件路径为<code>src/core/instance/init.js</code>
```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) { // options为new Vue时传递的参数对象
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) { // 实例化组件对象时会走此分支
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions( // 参数合并
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // 一系列初始化
    initLifecycle(vm) // 初始化生命周期
    initEvents(vm) // 初始化events
    initRender(vm) // 初始化渲染
    callHook(vm, 'beforeCreate') // 执行beforeCreate生命周期函数
    initInjections(vm) // resolve injections before data/props
    initState(vm) // 初始化状态（data，props，computed，watch）
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) { // 如果参数中包含el选项，则执行$mount方法
      vm.$mount(vm.$options.el)
    }
  }
}
```
<code>_init</code>方法主要做了参数合并（使用<code>mergeOptions</code>方法），和一些初始化工作（初始化生命周期、初始化events、初始化渲染、初始化注入、初始化<code>State</code>、初始化<code>Provide</code>），然后对实例化参数对象中的<code>el</code>做了次判断，如果存在则调用<code>vm.$mount</code>方法

**参数合并和初始化工作在后续的小节中再讲解，先主要看整个页面渲染的过程<code>Vue</code>是怎么处理的**

## $mount
在<code>src/platforms/web/entry-runtime-with-compiler.js</code>和<code>src/platforms/web/runtime/index.js</code>中，在<code>Vue</code>原型上定义了<code>$mount</code>方法
```js
const mount = Vue.prototype.$mount // 对src/platforms/web/runtime/index.js中定义的$mount方法进行缓存
// 重新定义$mount方法
Vue.prototype.$mount = function (
  el?: string | Element, // 参数可以为字符串或者真实dom
  hydrating?: boolean // 服务端渲染参数，可忽略
): Component {
  el = el && query(el) // query方法定义在src/platforms/web/util/index.js中，获取真实dom

  /* istanbul ignore if */
  // 对el元素做了一层限制，不能挂载在body和html标签上
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options //this.$options在Vue.prototype._init方法中，参数合并后会在当前实例创建$options对象
  // resolve template/el and convert to render function
  // 如果参数中定义了render方法则直接使用
  if (!options.render) { // 参数中未定义render方法
    let template = options.template
    // 如果存在template参数，则使用template参数
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) { // 如果没有template参数，则获取el的outerHTML作为template进行编译
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      // 将template编译成render方法，从源码中可以说明优先级顺序为render > template > el
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
			// 为$options中添加render和staticRenderFns
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  // 调用缓存的mount方法
  return mount.call(this, el, hydrating)
}

function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
```
首先对<code>src/platforms/web/runtime/index.js</code>中定义的<code>$mount</code>方法进行缓存

在重新定义的<code>$mount</code>方法中主要是对<code>el</code>元素和<code>template</code>的获取，然后将<code>template</code>编译为<code>render</code>函数添加在<code>$options</code>中，如果我们在实例化对象时在参数对象中自定义了<code>render</code>方法，则可跳过编译直接执行缓存的<code>$mount</code>方法

<code>src/platforms/web/runtime/index.js</code>中定义的<code>$mount</code>方法
```js
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```
接着调用<code>mountComponent</code>方法，在<code>src/core/instance/lifecycle.js</code>中定义
## mountComponent
```js
export function mountComponent (
  vm: Component, // 当前实例对象
  el: ?Element, // el元素
  hydrating?: boolean
): Component {
  vm.$el = el // 为当前实例添加$el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount') // 执行beforeMount生命周期方法

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  // 实例化渲染watcher
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) { // 只有vue才会走当前分支，组件实例不会进入当前分支
    vm._isMounted = true
    callHook(vm, 'mounted') // 调用mounted生命周期方法，挂载完毕
  }
  return vm
}
```
<code>mountComponent</code>主要是实例化一个渲染<code>watcher</code>，然后再实例化过程中调用<code>updateComponent</code>方法（核心是<code>updateComponent</code>回调函数中的<code>vm._update</code>和<code>vm._render</code>），接着执行<code>mounted</code>生命周期钩子，完成挂载，下一小节简单看下<code>Watcher</code>部分。
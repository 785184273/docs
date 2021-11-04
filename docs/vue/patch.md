# patch
在[update](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/update.html)小节分析了普通<code>vnode</code>渲染到页面的过程，这小节重点分析组件<code>vnode</code>（占位符<code>vnode</code>）的渲染过程

借助如下例子进行后续的逻辑分析
```html
<body>
	<div id="app"></div>
</body>
<script>
new Vue({
  el: '#app',
  render (h) {
    return h({
      template: `
        <div class="form-wrapper">
          <label class="form-title" for="name">姓名</label>
          <input class="form-input" :value="name">
        </div>
      `,
      data () {
        return {
          name: '张三'
        }
      }
    })
  }
})
</script>
```
渲染函数<code>render</code>方法会将生成的占位符<code>vnode</code>返回，并作为参数调用<code>vm._update</code>方法，在该方法内部会紧接着调用`vm.__patch__`方法，关于<code>vm._update</code>方法和`vm.__patch__`方法可以参考[update](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/update.html)小节中对应的部分，调用`vm.__update__`方法实际上是调用<code>src/core/vdom/patch.js</code>文件中返回的<code>patch</code>方法
```js
return function patch (oldVnode, vnode, hydrating, removeOnly) {
	if (isUndef(vnode)) {
		if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
		return
	}

	let isInitialPatch = false
	const insertedVnodeQueue = []

	if (isUndef(oldVnode)) {
		// empty mount (likely as component), create new root element
		isInitialPatch = true
		createElm(vnode, insertedVnodeQueue)
	} else {
		const isRealElement = isDef(oldVnode.nodeType)
		if (!isRealElement && sameVnode(oldVnode, vnode)) {
			// patch existing root node
			patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
		} else {
			if (isRealElement) {
				// mounting to a real element
				// check if this is server-rendered content and if we can perform
				// a successful hydration.
				if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
					oldVnode.removeAttribute(SSR_ATTR)
					hydrating = true
				}
				if (isTrue(hydrating)) {
					if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
						invokeInsertHook(vnode, insertedVnodeQueue, true)
						return oldVnode
					} else if (process.env.NODE_ENV !== 'production') {
						warn(
							'The client-side rendered virtual DOM tree is not matching ' +
							'server-rendered content. This is likely caused by incorrect ' +
							'HTML markup, for example nesting block-level elements inside ' +
							'<p>, or missing <tbody>. Bailing hydration and performing ' +
							'full client-side render.'
						)
					}
				}
				// either not server-rendered, or hydration failed.
				// create an empty node and replace it
				oldVnode = emptyNodeAt(oldVnode)
			}

			// replacing existing element
			const oldElm = oldVnode.elm
			const parentElm = nodeOps.parentNode(oldElm)

			// create new node
			createElm(
				vnode,
				insertedVnodeQueue,
				// extremely rare edge case: do not insert if old element is in a
				// leaving transition. Only happens when combining transition +
				// keep-alive + HOCs. (#4590)
				oldElm._leaveCb ? null : parentElm,
				nodeOps.nextSibling(oldElm)
			)

			// update parent placeholder node element, recursively

			// ......

			// destroy old node
			if (isDef(parentElm)) {
				removeVnodes([oldVnode], 0, 0)
			} else if (isDef(oldVnode.tag)) {
				invokeDestroyHook(oldVnode)
			}
		}
	}

	invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
	return vnode.elm
}
```
借助上面所写的例子分析，在调用该方法时，由于<code>vm</code>为根实例对象，所以<code>oldVnode</code>则为<code>vm.$el</code>真实<code>DOM</code>对象，并在该方法内会将其转化为虚拟<code>dom</code>，紧接着会调用<code>createElm</code>方法，该方法和<code>patch</code>方法在同一文件中
```js
function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    vnode.isRootInsert = !nested // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    // ......

  }
```
在<code>createElm</code>内由于参数<code>vnode</code>为占位符<code>vnode</code>，紧接着会调用<code>createComponent</code>方法，该方法和上一小节分析的<code>createComponent</code>方法不是同一个方法，该方法和<code>createElm</code>定义在同一文件中
```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
	let i = vnode.data
	if (isDef(i)) {
		const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
		if (isDef(i = i.hook) && isDef(i = i.init)) {
			i(vnode, false /* hydrating */)
		}
		// after calling the init hook, if the vnode is a child component
		// it should've created a child instance and mounted it. the child
		// component also has set the placeholder vnode's elm.
		// in that case we can just return the element and be done.
		if (isDef(vnode.componentInstance)) {
			initComponent(vnode, insertedVnodeQueue)
			insert(parentElm, vnode.elm, refElm)
			if (isTrue(isReactivated)) {
				reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
			}
			return true
		}
	}
}
```
在该方法内会首先判断是否存在<code>vnode.data</code>，如果存在则会将占位符<code>vnode</code>作为参数调用<code>vnode.data.hook.init</code>钩子函数，在[createComponent](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/createComponent.html#installcomponenthooks)小节分析过，在生成占位符<code>vnode</code>之前会先进行一些组件钩子函数的安装，所以实际调用的是在<code>src/core/vdom/create-component.js</code>中定义的组件钩子函数<code>init</code>方法
```js
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
  
  // ......
	
}
```
由于为初始渲染，占位符<code>vnode</code>还没有组件实例，所以会调用<code>createComponentInstanceForVnode</code>方法生成一个组件实例，需要注意的时，调用<code>createComponentInstanceForVnode</code>方法时传递的第二个参数为<code>activeInstance</code>，该变量定义在<code>src/core/instance/lifecycle.js</code>中，该变量主要用于存储当前<code>vm</code>实例，<code>createComponentInstanceForVnode</code>方法也定义在<code>src/core/vdom/create-component.js</code>中
```js
export function createComponentInstanceForVnode (
  // we know it's MountedComponentVNode but flow doesn't
  vnode: any,
  // activeInstance in lifecycle state
  parent: any
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```
该方法主要功能是<code>new</code>一个组件实例，并返回，在上一小节分析过，在生成占位符<code>vnode</code>之前会根据组件参数对象构建一个该组件对应的构造函数，该构造函数会作为实例化占位符<code>vnode</code>时的参数选项，所以这里的<code>vnode.componentOptions.Ctor</code>实际上就是实例化该占位符<code>vnode</code>时的构造函数，该构造函数在<code>Vue.extend</code>方法内生成并返回，该方法定义在<code>src/core/global-api/extend.js</code>中
```js
Vue.extend = function (extendOptions: Object): Function {
	extendOptions = extendOptions || {}
	const Super = this
	const SuperId = Super.cid
	const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
	if (cachedCtors[SuperId]) {
		return cachedCtors[SuperId]
	}

	const name = extendOptions.name || Super.options.name
	if (process.env.NODE_ENV !== 'production' && name) {
		validateComponentName(name)
	}

	const Sub = function VueComponent (options) {
		this._init(options)
	}
	Sub.prototype = Object.create(Super.prototype)
	Sub.prototype.constructor = Sub
	Sub.cid = cid++  
	Sub.options = mergeOptions(
		Super.options,
		extendOptions
	)
	Sub['super'] = Super

	// For props and computed properties, we define the proxy getters on
	// the Vue instances at extension time, on the extended prototype. This
	// avoids Object.defineProperty calls for each instance created.
	if (Sub.options.props) {
		initProps(Sub)
	}
	if (Sub.options.computed) {
		initComputed(Sub)
	}

	// allow further extension/mixin/plugin usage
	Sub.extend = Super.extend
	Sub.mixin = Super.mixin
	Sub.use = Super.use

	// create asset registers, so extended classes
	// can have their private assets too.
	ASSET_TYPES.forEach(function (type) {
		Sub[type] = Super[type]
	})
	// enable recursive self-lookup
	if (name) {
		Sub.options.components[name] = Sub
	}

	// keep a reference to the super options at extension time.
	// later at instantiation we can check if Super's options have
	// been updated.
	Sub.superOptions = Super.options
	Sub.extendOptions = extendOptions
	Sub.sealedOptions = extend({}, Sub.options)

	// cache constructor
	cachedCtors[SuperId] = Sub
	return Sub
}
```
<code>Vue.extend</code>生成的构造函数都原型继承与<code>Vue</code>构造函数，所以在调用<code>this._init</code>方法时，实际上调用的<code>Vue.prototype._init</code>方法，又回到了最开始分析的地方，又是熟悉的感觉，该方法定义在<code>src/core/instance/init.js</code>中
```js
  Vue.prototype._init = function (options?: Object) {
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
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
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
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```
需要注意的是，在实例化<code>Vue</code>根实例时调用该方法传递的参数和在实例化组件实例时调用该方法传递的参数不同
```js
// 实例化Vue根实例时传递的参数为
{
	data: {
		// .......
	},
	methods: {
		// .......
	},
	render () {
		// ......
	}
	// ......
}
// 实例化组件实例时传递的参数为
{
	_isComponent: true,
	_parentVnode: vnode, // 该组件对应的占位符vnode
	parent // 父实例对象 activeInstance 对应的vm对象
}
```
继续回到<code>_init</code>方法中，会先进行参数合并，由于实例化组件实例和实例化<code>Vue</code>根实例时传递的参数差异，所以会调用<code>initInternalComponent</code>，该方法和<code>_init</code>方法定义在同一文件中
```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```
该方法内部逻辑较简单，首先利用<code>vm.constructor.options</code>作为原型创建对象<code>vm.$options</code>，<code>vm.constructor.options</code>其实就是指向<code>Vue.options</code>和该构造函数对应的组件对象合并后的对象，可以查看[createComponent](http://localhost:8090/vue/createComponent.html#vue-extend)小节对<code>Vue.extend</code>部分的逻辑分析，这里则不过多赘述，接着将<code>options</code>中的一些属性（<code>parent，parentVnode</code>）和该构造函数对应的占位符<code>vnode</code>中的一些属性（<code>propsData，listeners，children，tag</code>）添加到<code>vm.$options</code>中

回到<code>_init</code>方法中，接着就是做对组件实例的生命周期，事件，<code>render</code>，状态等的一些初始化工作，由于组件对象不存在<code>el</code>属性，所以不会调用<code>vm.$mount</code>方法

接着回到<code>src/core/vdom/create-component.js</code>中定义的组件钩子<code>init</code>方法中
```js
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
 
      // ...... 
 
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
  
  // ......
	
}
```
生成的组件实例会赋给<code>vnode.componentIntance</code>和<code>child</code>，然后调用<code>child.$mount(undefined, false)</code>方法，由于在<code>createComponent</code>方法中调用<code>init</code>钩子时，传递的参数<code>hydrating</code>为<code>false</code>，所以参数为<code>undefined, false</code>

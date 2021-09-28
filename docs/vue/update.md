# update
<code>Vue.prototype._render</code>方法返回的<code>vnode</code>，会传入到<code>vm._update</code>方法中，该方法在<code>src/core/instance/lifecycle.js</code>中的<code>lifecycleMixin</code>中扩展到<code>Vue</code>的原型对象上（<code>Vue.prototype._update</code>）

该方法被调用的时机有两次，第一次为初始渲染页面，第二次则为数据更新的时候重新渲染，这小节只分析初始渲染，数据更新重新渲染放在[组件更新](http://localhost:8090/vue/domDiff.html)这一小节中
```js
export let activeInstance: any = null
export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}

Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode // 首次渲染的时候vm._vnode为undefined
  const restoreActiveInstance = setActiveInstance(vm) // 该方法实现对当前vue实例进行缓存
  vm._vnode = vnode // 将vm._render方法返回的vnode赋值给vm._vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) { // 初次渲染prevVnode为undefined则进入true分支，数据更新重新渲染的时候会进入else分支
    // 页面初始渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // 数据更新时
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  restoreActiveInstance() // 实例重置
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
	// 当前实例的$vnode存在 并且 当前实例的父实例也存在 并且 当前实例$vnode和父实例的_vnode是同一个vnode 则更新父实例的$el属性
	// 比如App组件 template 中只有一个根组件 hello-world
	/*
		父组件App：
		<template>
			<hello-world/>
		</template>
		<script>
		import helloWorld from './hello-world'
		export default {
			components: {
				helloWorld
			}
		}
		</script>
		子组件hello-world：
		<template>
			<div>hello world</div>
		</template>
		<script>
		export default {}
		</script>
		main.js
			import App from './App'
			new Vue({
				render: (h) => (h(App))
			})
	*/
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```
<code>vm._update</code>值得我们学习的一个点是<code>setActiveInstance</code>方法，利用闭包的方式实现对<code>vm</code>实例的缓存，调用`vm.__patch__`会返回一个真实<code>dom</code>重新赋值给<code>vm.$el</code>

## patch
<code>Vue.prototype._update</code>的核心就是`__patch__`方法，定义在Vue的原型对象上，在<code>src/platforms/web/runtime/index.js</code>中可查看
```js
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop
```
定义时做了一层判断，如果是浏览器环境则对应<code>patch</code>方法，我们只分析<code>patch</code>，可以在<code>src/platforms/web/runtime/patch.js</code>中查看定义
```js
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```
<code>patch</code>为<code>createPatchFunction</code>函数调用的返回值，<code>createPatchFunction</code>函数的参数为一个对象，其中<code>nodeOps</code>也为对象，包含一系列的<code>dom</code>操作方法，可在<code>src/platforms/web/runtime/node-ops.js</code>中查看，<code>modules</code>为一系列的模块数组，由<code>platformModules</code>和<code>baseModules</code>组合而成，可以在<code>web/runtime/modules/index</code>和<code>core/vdom/modules/index</code>中查看

<code>createPatchFunction</code>方法定义可在<code>src/core/vdom/patch.js</code>中查看

调用<code>createPatchFunction</code>方法会返回<code>patch</code>方法，如下:
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
			if (isDef(vnode.parent)) {
				let ancestor = vnode.parent
				const patchable = isPatchable(vnode)
				while (ancestor) {
					for (let i = 0; i < cbs.destroy.length; ++i) {
						cbs.destroy[i](ancestor)
					}
					ancestor.elm = vnode.elm
					if (patchable) {
						for (let i = 0; i < cbs.create.length; ++i) {
							cbs.create[i](emptyNode, ancestor)
						}
						// #6513
						// invoke insert hooks that may have been merged by create hooks.
						// e.g. for directives that uses the "inserted" hook.
						const insert = ancestor.data.hook.insert
						if (insert.merged) {
							// start at index 1 to avoid re-invoking component mounted hook
							for (let i = 1; i < insert.fns.length; i++) {
								insert.fns[i]()
							}
						}
					} else {
						registerRef(ancestor)
					}
					ancestor = ancestor.parent
				}
			}

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


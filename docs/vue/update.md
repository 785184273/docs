# update
<code>Vue.prototype._render</code>方法返回的<code>vnode</code>，会传入到<code>vm._update</code>方法中，该方法在<code>src/core/instance/lifecycle.js</code>中的<code>lifecycleMixin</code>中扩展到<code>Vue</code>的原型对象上（<code>Vue.prototype._update</code>）

该方法被调用的时机有两次，第一次为初始渲染页面，第二次则为数据更新的时候重新渲染，**这小节只分析初始渲染**，数据更新重新渲染放在[组件更新](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/domDiff.html)这一小节中
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
	
	// ....
	
}
```
<code>vm._update</code>值得我们学习的一个点是<code>setActiveInstance</code>方法，利用闭包的方式实现对<code>vm</code>实例的缓存，调用`vm.__patch__`会返回一个真实<code>dom</code>重新赋值给<code>vm.$el</code>

## patch
<code>Vue.prototype._update</code>的核心就是`__patch__`方法，定义在<code>Vue</code>的原型对象上，在<code>src/platforms/web/runtime/index.js</code>中可查看
```js
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop
```
定义时做了一层判断，如果是浏览器环境则对应<code>patch</code>方法，我们只分析<code>patch</code>，可以在<code>src/platforms/web/runtime/patch.js</code>中查看定义
```js
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```
<code>patch</code>为<code>createPatchFunction</code>函数调用的返回值，<code>createPatchFunction</code>函数的参数为一个对象，其中<code>nodeOps</code>是包含一系列的<code>dom</code>操作方法的对象，可在<code>src/platforms/web/runtime/node-ops.js</code>中查看，<code>modules</code>为一系列的模块数组，由<code>platformModules</code>和<code>baseModules</code>组合而成，可以在<code>web/runtime/modules/index</code>和<code>core/vdom/modules/index</code>中查看

<code>createPatchFunction</code>方法定义可在<code>src/core/vdom/patch.js</code>中查看

调用<code>createPatchFunction</code>方法会返回<code>patch</code>方法，然后赋值给`Vue.prototype.__patch__`。

<code>patch</code>部分的逻辑相对较复杂，使用如下例子来进行分析：
```html
<body>
	<div id="app">
	</div>
</body>
<script>
const vm = new Vue({
	el: '#app',
	data () {
		return {
			name: '张三'
		}
	},
	render: function renderFnc (h) {
		return h('div', {
			attr: { id: 'foo' },
			this.name
		})
	}
})
</script>
```
<code>patch</code>部分源码先针对上面例子进行分析，暂时不会分析所有分支代码

调用<code>createPatchFunction</code>方法会<code>return</code>出<code>patch</code>方法，<code>createPatchFunction</code>函数参数<code>backend</code>接收调用传入的对象参数，在函数内部将<code>modules</code>中的各个模块的钩子循环遍历添加到<code>cbs</code>对象中
```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
	let i, j
	const cbs = {}
	
	const { modules, nodeOps } = backend

  /*
		将modules中各个模块的钩子函数循环遍历添加到cbs中
	*/
	for (i = 0; i < hooks.length; ++i) {
	  cbs[hooks[i]] = []
	  for (j = 0; j < modules.length; ++j) {
	    if (isDef(modules[j][hooks[i]])) {
	      cbs[hooks[i]].push(modules[j][hooks[i]])
	    }
	  }
	}
	
	// .....
	
	return function patch (oldVnode, vnode, hydrating, removeOnly) {
		/*
			oldVnode 可以为vnode 也可以为 真实DOM对象
			vnode 则为vm._render方法返回的vnode对象
			hydrating 服务端渲染部分 略过分析
			removeOnly 主要用于在transition-group过渡，暂时略过
		*/
	 
		// 根据上述例子isUndef对vnode检测返回false不会进入当前分支
		if (isUndef(vnode)) {
			if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
			return
		}

		let isInitialPatch = false
		const insertedVnodeQueue = []
		if (isUndef(oldVnode)) { // // 在组件实例patch过程中会进入true分支，页面初始渲染且$options.el参数存在不会进入当前分支
			// empty mount (likely as component), create new root element
			isInitialPatch = true
			createElm(vnode, insertedVnodeQueue)
		} else {
			// 根据上述例子，初始渲染oldVnode为真实dom，则存在nodeType，使用isDef方法检测返回true
			const isRealElement = isDef(oldVnode.nodeType)
			if (!isRealElement && sameVnode(oldVnode, vnode)) {
				// patch existing root node
				patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
			} else {
				if (isRealElement) {
					// mounting to a real element
					// check if this is server-rendered content and if we can perform
					// a successful hydration.
					
					// 判断oldVnode是否有SSR_ATTR变量属性，服务端渲染会进入当前分支逻辑
					if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
						// 如果有SSR_ATTR变量属性则删除该属性
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
					
					// 将oldVnode真实DOM转换为虚拟DOM
					oldVnode = emptyNodeAt(oldVnode)
				}

				// replacing existing element
				const oldElm = oldVnode.elm // oldVnode的真实dom
				const parentElm = nodeOps.parentNode(oldElm) // 获取oldVnode的真实dom的parentNode（body）

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
				
        // ......
				
	}
}
```
<code>patch</code>方法将我们传入的<code>oldVnode</code>转换为虚拟<code>DOM</code>，然后再调用<code>createElm</code>方法
## createElm
<code>createElm</code>方法和<code>patch</code>方法在同一文件中，代码如下：
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
   // createComponent方法主要是创建子组件，后续再分析该分支逻辑
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    // 获取vnode的data，children，tag属性
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) { // 如果存在tag则进入该分支
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++
        }
        if (isUnknownElement(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          )
        }
      }

      // 为vnode创建elm属性，利用tag创建真实dom赋值给vnode的elm属性
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)
      setScope(vnode) // 作用域css部分，先略过

      /* istanbul ignore if */
      if (__WEEX__) { // WEEX相关部分略过分析
        // in Weex, the default insertion order is parent-first.
        // List items can be optimized to use children-first insertion
        // with append="tree".
        const appendAsTree = isDef(data) && isTrue(data.appendAsTree)
        if (!appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue)
          }
          insert(parentElm, vnode.elm, refElm)
        }
        createChildren(vnode, children, insertedVnodeQueue)
        if (appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue)
          }
          insert(parentElm, vnode.elm, refElm)
        }
      } else {
        // 调用createChildren方法
        createChildren(vnode, children, insertedVnodeQueue)
        if (isDef(data)) { // 判断是否存在data
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        // 将vnode.elm添加到parentElm中，refElm做为参考节点
        insert(parentElm, vnode.elm, refElm)
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--
      }
    } else if (isTrue(vnode.isComment)) {
      // 如果vnode为注释节点vnode则利用vnode.text创建真实dom赋值给vnode.elm，并且插入到父元素parentElm中（refElm为参考节点）
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {
      // 利用vnode.text创建真实dom赋值给vnode.elm，并插入到父元素parentElm中（refElm为参考节点）
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }
```
<code>createElm</code>方法会为传入的<code>vnode</code>先调用<code>createComponent</code>方法，如果是占位符<code>vnode</code>（组件<code>vnode</code>）则会创建组件实例（暂时先略过，后续再分析该部分），然后获取<code>vnode</code>的<code>tag、children、data</code>属性，对<code>tag</code>做一层判断，如果<code>tag</code>存在，则为标签<code>vnode（div、span、p....）</code>否则为注释节点<code>vnode</code>或文本节点<code>vnode</code>，如果为标签<code>vnode</code>则根据<code>tag</code>标签创建真实<code>dom</code>并赋值给<code>vnode.elm</code>属性，再调用<code>createChildren</code>方法
```js
function createChildren (vnode, children, insertedVnodeQueue) {
	if (Array.isArray(children)) {
		if (process.env.NODE_ENV !== 'production') {
			checkDuplicateKeys(children) // 遍历children中的每一项vnode，检查key是否有重复
		}
		for (let i = 0; i < children.length; ++i) { // 循环遍历children中的每一项vnode调用createElm，并添加到父元素（vnode.elm）中
			createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
		}
	} else if (isPrimitive(vnode.text)) {
		nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
	}
}
```
<code>createChildren</code>方法中如果<code>children</code>为数组循环则调用<code>createElm</code>，在遍历过程中<code>vnode.elm</code>会作为父元素传入，由于存在<code>data</code>，会继续调用<code>invokeCreateHooks</code>方法
```js
if (isDef(data)) {
	/*
	 如果存在data，则调用invokeCreateHooks方法
	 该方法主要是调用各个模块的create钩子函数
	 并且如果vnode是组件vnode（占位符vnode）
	 如果存在create钩子函数，则调用该钩子函数
	 如果存在insert钩子函数，则将该vnode push到insertedVnodeQueue中
	*/
	invokeCreateHooks(vnode, insertedVnodeQueue)
}

function invokeCreateHooks (vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
  i = vnode.data.hook // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode)
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
  }
}
```
<code>invokeCreateHooks</code>方法中，会循环调用<code>cbs</code>模块中<code>create</code>钩子回调，后面逻辑主要是针对占位符<code>vnode</code>（组件<code>vnode</code>），如果存在<code>create</code>钩子函数则调用，存在<code>insert</code>钩子函数，则将<code>vnode</code>添加到<code>insertedVnodeQueue</code>中。接着会继续调用<code>insert</code>方法，将<code>vnode.elm</code>插入到父元素中
```js
function insert (parent, elm, ref) {
	if (isDef(parent)) {
		if (isDef(ref)) {
			if (nodeOps.parentNode(ref) === parent) {
				nodeOps.insertBefore(parent, elm, ref)
			}
		} else {
			nodeOps.appendChild(parent, elm)
		}
	}
}
```
<code>insert</code>函数参数中，<code>parent</code>作为父元素，<code>elm</code>为需要插入到父元素中的子元素，<code>ref</code>作为参考节点存在，如果存在<code>ref</code>则使用<code>insertBefore</code>插入，否则使用<code>appenChild</code>追加在父元素末尾

**至此，所有的元素都会渲染到页面，但是<code>oldVnode</code>还存在**

再回到<code>patch</code>函数
```js
	return function patch (oldVnode, vnode, hydrating, removeOnly) {
		
		//...
			// destroy old node
			if (isDef(parentElm)) {
			  removeVnodes([oldVnode], 0, 0) // 删除销毁oldVnode
			} else if (isDef(oldVnode.tag)) {
			  invokeDestroyHook(oldVnode)
			}
			
		invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
		// 返回vnode的真实dom
		return vnode.elm
	}
```
销毁删除<code>oldVnode</code>，接着调用<code>invokeInsertHook</code>方法，然后再<code>return</code>出<code>vnode</code>的真实dom
```js
  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue
    } else {
      for (let i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i])
      }
    }
  }
```
<code>invokeInsertHook</code>方法在里面做了层判断，判断<code>initial</code>是否为<code>true</code>，如果<code>initial</code>为<code>true</code>，并且存在占位符<code>vnode</code>，将<code>queue</code>赋值给占位符<code>vnode.data.pendingInsert</code>），否则循环遍历<code>queen</code>中的占位符<code>vnode</code>，调用<code>insert</code>钩子函数，如果组件定义了<code>mounted</code>生命周期钩子函数，则会调用。**需要注意的是：根实例的<code>mounted</code>的调用和组件的<code>mounted</code>调用不一致**

回到<code>vm._update</code>中，将<code>patch</code>函数中返回的真实dom赋值给<code>vm.$el</code>，重置vm实例

```js
 Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
	
  // ... 
	
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

至此，完成了从把模板和数据渲染成最终的dom过程的分析，可以用下图更直观的看到整个过程
![renderProcess](/img/renderProcess.png)

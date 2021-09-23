# 概述
vue的核心是数据驱动和组件化，而当组件更新时主要核心则是domDiff算法

在lifecycleMixin方法中对Vue构造函数进行了一系列的原型扩展，其中包含原型方法Vue.prototype._update

该方法包含两个参数，第一个参数vnode，在实例化Vue过程中，会实例化一个渲染watcher，在实例化该watcher过程中会调用当前实例的_update（原型方法）方法，而该方法的vnode则由当前实例的_render（原型方法）方法生成并返回。第二个参数主要是在服务端渲染使用，可略过分析。

在实例化Vue过程中，会对data中每个属性进行遍历然后为每个属性分配一个订阅者对象dep，使用Object.defineProperty为每个属性定义Getter和Setter，在render方法生成虚拟dom过程中，对使用到的数据（data和props中的数据）进行依赖收集（为每个属性的dep实例的subs中添加watcher），当对数据进行修改操作时，则会触发依赖更新，会重新执行一次_render方法调用（意味着重新生成Vnode，也会重新调用一次_update方法）

初始化渲染和页面更新渲染都会调用__patch__方法
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
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm) // 该方法实现对当前vue实例进行缓存
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
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
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```
页面更新时，当oldVnode和vnode不是相同的vnode则会创建新的dom，并更新占位符节点，删除oldVnode
```js
function sameVnode (a, b) {
  // 判断两个虚拟dom是否是相同的，重点注意key和标签名tag
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}


return function patch (oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) { // 新生成的Vnode为undefined，例如template模板中的所有html代码都被删除
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode) // 递归调用组件的destory钩子和各个模块的destory方法
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) { // oldVnode为undefined，在实例化组件实例时会走到当前分支
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType) // 在实例化vue构造函数(初始化渲染)时oldVnode为node节点
    if (!isRealElement && sameVnode(oldVnode, vnode)) { // 不是node节点并且是相同的虚拟dom时
      // patch existing root node
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly) // 如果是相同的vnode则会调用patchVnode
    } else {
      // oldVnode和Vnode不是相同的虚拟dom时
      if (isRealElement) { // 当oldVnode为node节点时
        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.

        // 服务端渲染部分可略过
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
        oldVnode = emptyNodeAt(oldVnode) // 将真实node节点转换为虚拟dom
      }

      // replacing existing element
      const oldElm = oldVnode.elm // oldVnode的真实node
      const parentElm = nodeOps.parentNode(oldElm) // 获取父级元素

      // createElm递归为每个vnode的elm属性创建真实dom，并添加在父级vnode的真实dom中
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
      // 递归更新占位符节点
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent
        const patchable = isPatchable(vnode)
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor) // 调用各个模块的destory方法
          }
          ancestor.elm = vnode.elm // 更新elm
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor) // 调用这个模块的create方法
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
当oldVnode和vnode是相同的虚拟dom时，则会调用patchVnode方法
```js
  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    const elm = vnode.elm = oldVnode.elm // 将oldVnode的elm引用赋值给vnode.elm

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) { // 当vnode是组件时，则直接调用prepatch钩子方法（在实例化组件vnode时，会为每个组件挂载init insert prepatch destory钩子函数）
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode) // 调用各个模块的update方法
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode) // 调用update钩子
    }
    if (isUndef(vnode.text)) { // 如果vnode不是文本节点
      if (isDef(oldCh) && isDef(ch)) { // 如果oldVnode和vnode都存在children子节点，则调用updateChildren递归更新
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) { // 如果vnode是文本节点且文本内容不相同则更新elm的textContent属性值
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```


# 组件更新
vue的核心是数据驱动和组件化，而当组件更新时主要核心则是domDiff算法

该方法包含两个参数，第一个参数vnode，在实例化Vue过程中，会实例化一个渲染watcher，在实例化该watcher过程中会调用当前实例的_update（原型方法）方法，而该方法的vnode则由当前实例的_render（原型方法）方法生成并返回。第二个参数主要是在服务端渲染使用，可略过分析。

在实例化Vue过程中，会对data中每个属性进行遍历然后为每个属性分配一个订阅者对象dep，使用Object.defineProperty为每个属性定义Getter和Setter，在render方法生成虚拟dom过程中，对使用到的数据（data和props中的数据）进行依赖收集（为每个属性的dep实例的subs中添加watcher），当对数据进行修改操作时，则会触发依赖更新，会重新执行一次_render方法调用（意味着重新生成Vnode，也会重新调用一次_update方法）

初始化渲染和页面更新渲染都会调用__patch__方法
```js
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
  
  // ......

}
```
在组件更新时使用到较多的工具函数
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

// 检查是否为undefined和null
function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

// 检查是否不为undefine和null
function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}
```

## oldVnode和vnode不是相同的虚拟dom
页面更新时，当oldVnode和vnode不是相同的vnode则会创建新的dom，并更新占位符节点，删除oldVnode
```js
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
    } else { // oldVnode和Vnode不是相同的虚拟dom时
      if (isRealElement) { // 当oldVnode为node节点时
			
        // ......

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
              cbs.create[i](emptyNode, ancestor) // 调用各个模块的create方法
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
        removeVnodes([oldVnode], 0, 0) // 销毁删除oldVnode
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}

```
## oldVnode和vnode为相同的虚拟dom
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

    // ......

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) { // 当vnode是组件时，则直接调用prepatch钩子方法（在实例化组件vnode时，会为每个组件挂载init insert prepatch destory钩子函数）
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children // oldVnode的children
    const ch = vnode.children // vnode的children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode) // 调用各个模块的update方法
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode) // 调用update钩子
    }
    if (isUndef(vnode.text)) { // 如果vnode不是文本节点
      if (isDef(oldCh) && isDef(ch)) { // oldCh和ch都存在，则调用updateChildren递归更新
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '') // 如果ch存在，且oldVnode为文本类型的虚拟dom，则将elm的textContent置空
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue) // 将ch中的vnode循环调用createElm并添加到elm中，实现节点更新
      } else if (isDef(oldCh)) { // 如果oldCh存在
        removeVnodes(oldCh, 0, oldCh.length - 1) // 循环删除oldCh中的vnode
      } else if (isDef(oldVnode.text)) { // 如果ch不存在，且oldVnode为文本类型的虚拟dom，则将elm的textContent置空
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) { // 如果vnode是文本节点且文本内容不相同则更新elm的textContent属性值
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode) // 如果存在postpatch钩子则执行
    }
  }
```
## updateChildren
当oldVnode和vnode都存在children时，则会调用updateChildren

[更多domDiff算法详解参考](https://blog.csdn.net/qq2276031/article/details/106407647)
```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0 // oldCh的开始（左侧）索引位置
    let newStartIdx = 0 // newCh的开始（左侧）索引位置
    let oldEndIdx = oldCh.length - 1 // oldCh的结束（右侧）索引位置
    let oldStartVnode = oldCh[0] // 初始为oldCh的第一个vnode
    let oldEndVnode = oldCh[oldEndIdx] // 初始为oldCh的最后一个vnode
    let newEndIdx = newCh.length - 1 // newCh的结束（右侧）索引位置
    let newStartVnode = newCh[0] // 初始为newCh的第一个vnode
    let newEndVnode = newCh[newEndIdx] // 初始为oldChd的最后一个vnode
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) { // oldCh和newCh根据前后索引进行循环比对
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) { // 如果oldCh的第一个虚拟dom和ch的第一个虚拟dom是同一个
        /*
          可以使用如下代码分析
          oldVnode
            <ul>
              <li key="1">1</li>
              <li key="2">2</li>
            </ul>
          vnode
            <ul>
              <li key="1">2</li>
            </ul>
          newStartIdx > newEndIdx 跳出while循环 删除oldVnode中多余的vnode
        */
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx) // 进入patchVnode调用，在patchVnode循环调用到oldVnode和vnode为文本节点时，由于1不等于2，则更新elm的textContext实现节点更新
        oldStartVnode = oldCh[++] // oldCh左侧索引递增，oldStartVnode也随之对应为相应索引下的vnode
        newStartVnode = newCh[++newStartIdx] // newCh左侧索引递增，newStartVnode也随之对应为相应索引下的vnode
      } else if (sameVnode(oldEndVnode, newEndVnode)) { // 如果oldCh的最后一个虚拟dom和ch的最后一个虚拟dom是同一个
        /*
          可以使用如下代码分析
          oldVnode
            <ul>
              <li key="1">1</li>
              <li key="2">2</li>
            </ul>
          vnode
            <ul>
              <li key="2">3</li>
            </ul>
          newEndIdx < newStartIdx 跳出while循环 删除oldVnode中多余的vnode
        */
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx) // 进入patchVnode调用
        oldEndVnode = oldCh[--oldEndIdx] // oldCh右侧索引递减，oldEndVnode也随之对应为相应索引下的vnode
        newEndVnode = newCh[--newEndIdx] // newCh右侧索引递减，newEndVnode也随之对应为相应索引下的vnode
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right 
        /*
          oldCh的第一个vnode和ch的最后一个vnode相同
          可以使用如下代码分析
          oldVnode
            <ul>
              <li key="1">1</li>
              <li key="2">2</li>
            </ul>
          vnode
            <ul>
              <li key="2">2</li>
              <li key="1">1</li>
            </ul>
        */
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm)) // 移动位置，将oldStartVnode.elm移动到oldEndVnode.elm的下一个真实dom之前
        oldStartVnode = oldCh[++oldStartIdx] // oldCh左侧索引递增，oldStartVnode也随之对应为相应索引下的vnode
        newEndVnode = newCh[--newEndIdx] // newCh右侧索引递减，newEndVnode也随之对应为相应索引下的vnode
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        /*
          oldCh的最后一个vnode和ch的第一个vnode相同
          可以使用如下代码分析
          oldVnode
            <ul>
              <li key="1">1</li>
              <li key="2">2</li>
            </ul>
          vnode
            <ul>
              <li key="2">2</li>
              <li key="1">1</li>
              <li key="3">3</li>
            </ul>
          oldEndIdx < oldStartIdx 跳出循环 新增newCh中多余的元素
        */
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm) // 移动位置，将oldEndVnode.elm移动到oldStartVnode.elm之前
        oldEndVnode = oldCh[--oldEndIdx] // oldCh右侧索引递减，oldEndVnode也随之对应为相应索引下的vnode
        newStartVnode = newCh[++newStartIdx] // newCh左侧索引递增，newStartVnode也随之对应为相应索引下的vnode
      } else {
        /*
          以上情况都不满足
          可以使用如下代码分析
          oldVnode
            <ul>
              <li key="1">1</li>
              <li key="2">2</li>
              <li key="3">3</li>
              <li key="4">4</li>
            </ul>
          vnode
            <ul>
              <li key="5">5</li>
              <li key="3">3</li>
              <li key="6">6</li>
            </ul>
        */
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 生成一个基于oldCh的key => index索引的对象 { 1： 0, 2: 1, 3: 2, 4: 3 }
        idxInOld = isDef(newStartVnode.key) // key为5和6的vnode返回undefined，key为3返回对应的索引位置
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // key为5和6的vnode调用createElm方法插入到parentElm（ul真实dom）中（oldStartVnode.elm为参考节点）
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else { // key为3的vnode
          vnodeToMove = oldCh[idxInOld] // 找到oldCh中对应索引的vnode
          if (sameVnode(vnodeToMove, newStartVnode)) { // vnodeToMove和newStartVnode是相同的vnode
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined // 将oldCh中对应索引位置赋值为undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm) // 位置移动
          } else { // vnodeToMove和newStartVnode不是相同的vnode，可能不是相同的元素标签，但是key相同，比如<div key="1"></div>和<span key="1"></span>
            // same key but different element. treat as new element
            // 调用createElm方法，将不同元素但相同key的vnode创建真实dom并添加到parentElm（ul真实dom）中（oldStartVnode.elm）
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx] // newCh左侧索引递增，newStartVnode也随之对应为相应索引下的vnode
      }
    }
    if (oldStartIdx > oldEndIdx) {
      /*
        oldCh的左侧索引大于oldCh的右侧索引
          例如：
          oldVnode
            oldCh: [vnode]
            <ul>
              <li key="1">1</li>
            </ul>
          vnode
            newCh: [vnode, vnode]
            <ul>
              <li key="1">1</li>
              <li key="1">2</li>
            </ul>
          newStartIdx递增，oldStartIdx也会递增，当newCh中的vnode数目大于oldCh中vnode的数目（oldStartIdx > oldEndIdx），则会跳出while循环，添加newCh中其余的vnode，实现节点更新
      */
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      /*
        ch的左侧索引大于ch的右侧索引，则删除oldCh多余的vnode
          例如：
          oldVnode
            oldCh: [vnode, vnode]
            <ul>
              <li key="1">张三</li>
              <li key="2">李四</li>
            </ul>
          vnode
            newCh: [vnode]
            <ul>
              <li key="1">王二</li>
            </ul>
          newStartIdx递增，oldStartIdx也会递增，当newCh中的vnode数目小于oldCh中vnode的数目（newStartIdx > newEndIdx），则会跳出while循环，删除oldCh中多余的vnode，实现节点更新
      */
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }

```


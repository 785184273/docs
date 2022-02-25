---
title: 响应式del方法
date: 2021-10-25
categories:
 - 源码分析
tags:
 - vue
---

<code>del</code>同<code>set</code>方法一样，都是响应式方法，只不过<code>del</code>方法是删除数组或对象中的某一项，该方法在全局方法<code>Vue.delete</code>和实例方法<code>vm.$delete</code>内被调用，可分别在<code>src/core/global-api/index.js</code>和<code>src/core/instance/state.js</code>文件中可查看相关定义

这个方法应该很少会用到

```js
// src/core/global-api/index.js
Vue.delete = del

// src/core/instance/state.js
export function stateMixin (Vue: Class<Component>) {
  
  // ......
  Vue.prototype.$delete = del
  // ......
	
}
```
<code>del</code>方法和<code>set</code>方法定义在同一文件<code>src/core/observer/index.js</code>中
```js
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}
```
从该方法的参数<code>target</code>的类型就可以看出来，该参数只接受数组和对象，在方法内部首先对<code>target</code>做了层处理，如果为<code>undefined</code>或为简单类型的值，则会给出<code>warn</code>提示，接着会判断<code>target</code>是否为数组并且<code>key</code>是一个有效的索引，<code>isValidArrayIndex</code>方法在[响应式set方法](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/set.html)小节已经分析过，这里就不多做说明

## 数组
如果<code>target</code>为数组，则会直接使用<code>splice</code>方法删除然后<code>return</code>，由于数组的部分原型方法被重写，所以会在被重写的<code>splice</code>方法内部直接进行触发更新

## 对象
接着<code>del</code>方法的逻辑进行分析，如果<code>target</code>为<code>Vue</code>的实例化对象，或者为根<code>data</code>对象，则会报<code>warn</code>提示并<code>return</code>，如果需要删除的属性<code>key</code>不存在<code>target</code>自身中，会直接<code>return</code>，否则会使用<code>delete</code>方法删除对象的属性，如果<code>target</code>对象不是响应式对象则只是做单纯的删除属性操作，否则会进一步的做触发更新操作
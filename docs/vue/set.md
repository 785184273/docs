# set
<code>set</code>方法主要是为响应式对象中动态的添加响应式属性，该方法在全局方法<code>Vue.set</code>和实例方法<code>vm.$set</code>内被调用，可分别在<code>src/core/global-api/index.js</code>和<code>src/core/instance/state.js</code>文件中可查看相关定义

该方法会返回设置的响应式属性的值

```js
// src/core/global-api/index.js
Vue.set = set

// src/core/instance/state.js
export function stateMixin (Vue: Class<Component>) {
  
  // ......
  Vue.prototype.$set = set
  // ......
	
}
```
在<code>src/core/observer/index.js</code>中可查看对<code>set</code>方法的定义
```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```
该方法有三个参数，<code>target</code>为需要动态添加响应式属性的响应式对象，<code>key</code>和<code>val</code>则分别为属性和值，方法内部首先会判断<code>target</code>，如果为<code>undefined</code>或为简单类型的值，则会给出<code>warn</code>提示，接着会判断<code>target</code>是否为数组并且<code>key</code>是一个有效的索引

## 数组
在<code>src/shared/util.js</code>中可查看对<code>isValidArrayIndex</code>方法的定义
```js
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
```
<code>isValidArrayIndex</code>逻辑很简单，主要判断<code>val</code>是一个有限数值，大于等于0，且向下取证和原数值相等（确保<code>val</code>不是小数）

如果<code>target</code>为数组且<code>key</code>是有效索引，先利用<code>target.length</code>调整数组的长度，再利用<code>splice</code>方法添加新增项

**这里可能大家注意到了，为什么需要使用<code>target.length</code>，而不是直接使用<code>target.splice</code>动态添加？为什么<code>target.splice</code>的第二个参数为<code>1</code>？**

索引值<code>key</code>有两种情况
* 超出<code>target</code>的长度范围
* 在<code>target</code>的长度索引范围内

如果索引值<code>key</code>超出了<code>target</code>长度范围，直接使用<code>splice</code>添加会直接在数组的末尾进行添加，这样<code>target</code>的长度会不准确，比如:
```js
var a = [1, 2]
a.splice(3, 1, 3) // 直接在数组的末尾添加
a // [1, 2, 3]
```
按正确的逻辑，数组的长度为数组的最后一项的索引值加1，所以<code>target.length</code>应该为<code>4</code>，结合<code>target.length = Math.max(target.length, key)</code>，可以保证<code>target</code>的长度准确性

如果索引值<code>key</code>在<code>target</code>的长度范围内，<code>target.splice</code>的第二个参数<code>1</code>，会先删除再添加

在[响应式对象](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/observe.html#%E6%95%B0%E7%BB%84%E9%83%A8%E5%88%86%E5%93%8D%E5%BA%94%E5%BC%8F)小节说过，会对数组的原型进行重写，重写原型的逻辑在一个单独的文件中，可在<code>src/core/observer/array.js</code>中查看
```js
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```
重写的方法中，会对响应式数组新增的数据循环调用<code>Observe</code>方法，然后再根据响应式数组对应的<code>dep.notify</code>触发更新

## 对象
继续回到<code>set</code>方法中，后续则是对对象的分析处理
```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  
  // ......
  
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```
如果<code>key</code>是响应式对象<code>target</code>的自身属性，则会直接修改值，如果<code>target</code>为<code>Vue</code>的实例化对象，或者为根<code>data</code>对象，则会报<code>warn</code>提示，如果<code>target</code>不是响应式对象则会直接做赋值处理，接着会直接调用<code>defineReactive</code>方法为响应式对象<code>target</code>动态添加响应式属性，并且调用响应式对象<code>target</code>对应的<code>dep.notify</code>方法派发更新


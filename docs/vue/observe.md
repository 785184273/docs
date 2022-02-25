---
title: 响应式对象
date: 2021-10-12
categories:
 - 源码分析
tags:
 - vue
---

可能很多人都了解过Vue2.x实现响应式主要使用的是<code>Object.defineProperty</code>，但并没有具体探究，下面就来分析下

在分析前如果对<code>Object.defineProperty</code>这个方法不熟悉的，可以在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)上查看该方法的具体定义

在分析<code>new Vue</code>过程的这一小节中，<code>Vue.prototype._init</code>方法中做了很多初始化的工作，其中包括对状态的初始化<code>initState</code>
```js
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this

    // ......
	
    initState(vm) // 初始化State

    // ......

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
## initState
<code>initState</code>方法定义在<code>src/core/instance/state.js</code>中
```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
从代码中可以看出，其中包含了对<code>props</code>，<code>methods</code>，<code>data</code>，<code>computed</code>，<code>watch</code>的初始化，这小节先分析对<code>data</code>的初始化
## initData
<code>initData</code>方法和<code>initState</code>方法都定义在同一文件中
```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm) // 注意点，在参数合并后data会是一个function，而不是一个原始对象
    : data || {}
 
  // ......
}
```
在深入分析<code>initData</code>之前，需要注意的一个点就是，参数合并在初始化<code>State</code>之前，根据上节参数合并中对<code>data</code>合并策略的分析，合并后<code>data</code>会是一个函数，所以会调用<code>getData</code>方法，获取合并后的<code>data</code>数据，<code>getData</code>方法和<code>initData</code>同样定义在一个文件中
```js
export function getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}
```
<code>getData</code>方法返回<code>data</code>方法调用的返回结果，回到<code>initData</code>方法，这时<code>data</code>和<code>vm._data</code>都指向<code>getData</code>方法所返回对象的指针，接着分析后续代码
```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```
接着会对<code>data</code>做一层<code>if</code>对象检测，如果不为对象，则会给与报警提示，接着使用<code>while</code>循环遍历<code>data</code>中每一个<code>key</code>，在<code>props</code>和<code>methods</code>中做比对，如果有相同的<code>key</code>则会有报警提示，否则接着调用<code>proxy</code>方法做一层代理
::: tip 注意
在<code>Vue</code>中，<code>data</code>，<code>props</code>，<code>methods</code>这三个对象中，不能存在相同的<code>key</code>，因为他们都是代理在<code>vm</code>实例上的
:::
## proxy
<code>proxy</code>方法为一个公共的代理方法，和<code>initData</code>方法在同一文件中定义
```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
<code>proxy</code>方法内部利用<code>Object.defineProperty</code>的可描述对象的<code>Getter</code>和<code>Setter</code>做了一层代理，这样我们就能在<code>vm</code>实例上访问<code>data</code>中的数据，例如:
```js
const vm = new Vue({
	data: {
		name: 'zhangsan'
	}
})

vm.name === vm._data.name // true
```
因为<code>proxy</code>方法代理的原理，可以直接使用<code>vm.name</code>直接访问<code>data</code>中的数据，其实就是访问的<code>vm._data.name</code>

回到<code>initData</code>方法中，接着将<code>data</code>作为参数调用<code>observe</code>方法
## observe
<code>observe</code>方法定义在<code>src/core/observer/index.js</code>中
```js
export let shouldObserve: boolean = true

export function toggleObserving (value: boolean) {
  shouldObserve = value
}

export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) { // value不为对象，或者value是一个vnode实例
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) { // value是一个Observe对象，则返回响应式对象ob
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```
<code>observe</code>方法逻辑也很简单，先判断<code>value</code>是否为对象，不为对象或者<code>value</code>是一个<code>vnode</code>实例，则直接<code>return</code>，再接着判断<code>value</code>如果是响应式对象，则返回响应式对象<code>ob</code>，这里会直接实例化<code>Observer</code>对象

## Observer
<code>Observer</code>和<code>observe</code>都定义在同一文件中，<code>Observer</code>使用<code>class</code>类定义
```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```
<code>Observer</code>相较于<code>VNode</code>和<code>Watcher</code>的定义较简单，由于实例化过程会首先进入到<code>constructor</code>，为当前<code>observer</code>实例分配一个<code>Dep</code>实例，然后调用<code>def</code>方法将当前实例<code>observer</code>赋值给`value.__ob__`，然后判断<code>value</code>是否为数组，如果为数组则为数组添加重写的原型（数组部分的分析放在后面，这里先分析为对象的情况），否则调用实例方法<code>walk</code>，在该方法中循环<code>value</code>中的每个<code>key</code>并调用<code>defineReactive</code>方法
```js
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```
<code>def</code>方法内部使用到了<code>Object.defineProperty</code>，为对象<code>obj</code>添加属性<code>key</code>

## defineReactive
该方法是响应式原理的核心方法，同<code>Observer</code>类定义在同一文件中
```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep() // 为对象的每一个属性分配一个dep实例

  const property = Object.getOwnPropertyDescriptor(obj, key) // 获取属性的描述符对象
  if (property && property.configurable === false) { // 如果该属性的可配置性为false则直接return
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get // 描述符对象Getter
  const setter = property && property.set // 描述符对象Setter
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val) // 如果val是对象，则递归调用observe方法，达到为每个属性分配Getter和Setter的目的
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```
<code>defineReactive</code>方法内部主要是对每个属性分配一个<code>dep</code>实例，动态的添加<code>Getter</code>和<code>Setter</code>，接着获取当前属性的描述符对象，如果当前属性的值<code>val</code>为一个对象，则递归调用<code>observe</code>方法，这样无论对象的结构有多深都能为每个属性添加<code>Getter</code>和<code>Setter</code>，<code>Getter</code>中主要做的是依赖收集，而<code>Setter</code>中则主要做的是派发更新

## 数组部分响应式
继续回到上面<code>Observer</code>的<code>constructor</code>中对<code>value</code>的判断，当<code>value</code>为数组时，使用<code>hasProto</code>判断对象是否有`__proto__`属性，如果有原型对象则调用<code>protoAugment</code>方法，如果没有原型对象则调用<code>copyAugment</code>方法
```js

// src/core/util/env.js
export const hasProto = '__proto__' in {}

// src/core/observer/index.js

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      // ......
    }
  }
 
  // ......
	
}
```
先看下<code>arrayMethods</code>的定义，可在<code>src/core/observer/array.js</code>中查看
```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
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
上述代码主要是定义一个包含数组的响应式方法的对象，逻辑比较简单清晰，首先缓存原始数组的原型对象<code>arrayProto</code>，然后使用<code>Object.create(arrayProto)</code>创建一个原型为原始数组原型的<code>arrayMethods</code>对象，然后循环遍历<code>methodsToPatch</code>中定义的响应式方法名，根据遍历的方法名在缓存的原始数组原型对象<code>arrayProto</code>中查找对应的方法再做一个缓存处理<code>originnal</code>，利用<code>def</code>方法（上面分析过<code>def</code>方法的实现），在<code>arrayMethods</code>对象中定义，和缓存方法<code>originnal</code>同名的响应式方法（同名可以实现覆盖作用，这主要涉及到原型链的查找原理，原型链部分这里不做讲解），在调用定义的响应式方法时，会先通过<code>apply</code>方法在指定作用域调用缓存的原始数组原型对象的同名方法，然后通过<code>switch</code>分支语句拿到<code>push</code>，<code>unshift</code>，<code>splice</code>方法中新增的参数，然后通过当前数组<code>ob</code>对象的<code>observeArray</code>实例方法对新增的参数循环递归调用<code>observe</code>方法（<code>observe</code>方法在上面已经做过讲解），再通过<code>ob.dep.notify</code>方法派发更新

接着对<code>Observer</code>类中数组部分的分析
如果有原型对象则调用<code>protoAugment</code>方法，传入的参数分别为类型为<code>Array</code>的数组<code>value</code>，和上面分析的包含数组响应式方法的对象<code>arrayMethods</code>
```js
function protoAugment (target, src: Object) {
	/* eslint-disable no-proto */
	target.__proto__ = src
	/* eslint-enable no-proto */
}
```
在<code>protoAugment</code>中直接是直接重写<code>target</code>的原型对象，也可以使用[<code>Object.setPrototypeOf</code>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)方法设置指定对象的原型


如果没有原型对象则调用<code>copyAugment</code>方法，传入的参数同样为类型为<code>Array</code>的数组<code>value</code>，数组响应式方法对象<code>arrayMethods</code>和<code>arrayMethods</code>对象的响应式方法名的数组集合
```js
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```
<code>copyAugment</code>方法是直接将<code>arrayMethods</code>中定义的响应式方法拷贝到<code>target</code>参数数组中

接着<code>Observer</code>类中会调用当前<code>ob</code>实例的<code>observeArray</code>方法，循环<code>value</code>中的每一项并递归调用<code>observe</code>方法
```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    // ......
    if (Array.isArray(value)) {
			
      // ......
			
      this.observeArray(value)
    } else {
      // ......
    }
  }
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```
这样数组部分的响应式便完成，下一小节将分析依赖收集部分




# 计算属性
在<code>new Vue</code>实例化<code>vm</code>过程中，涉及到了对<code>state</code>的初始化，其中就包括对计算属性的初始化
```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
	
  // ......

  if (opts.computed) initComputed(vm, opts.computed) // 初始化计算属性
  // ......
}
```
<code>initComputed</code>和<code>initState</code>定义在同一文件中<code>src/core/instance/state.js</code>
```js
const computedWatcherOptions = { lazy: true }

function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      } else if (vm.$options.methods && key in vm.$options.methods) {
        warn(`The computed property "${key}" is already defined as a method.`, vm)
      }
    }
  }
}
```
<code>initComputed</code>方法中，首先利用<code>Object.create(null)</code>创建一个没有原型的对象<code>watchers</code>，用于存储对应计算属性的<code>watcher</code>实例，接着循环遍历<code>computed</code>中定义的每个计算属性，并为每个计算属性实例化一个<code>watcher</code>，然后根据计算属性名称存储到<code>watchers</code>当中，接着将每个计算属性的名称在<code>vm.$data</code>，<code>vm.$options.props</code>，<code>vm.$options.methods</code>中做比对，看是否有重复的键名，如果重复则会触发<code>warn</code>提示，如果没有重名则会调用<code>defineComputed</code>方法

<code>defineComputed</code>方法也定义在<code>src/core/instance/state.js</code>中
```js
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
<code>defineComputed</code>方法的逻辑非常简单，其实就是利用<code>Object.defineProperty</code>方法将每个属性代理在<code>vm</code>实例上，由于我们只是分析非服务端渲染部分，所以对象描述符中的<code>getter</code>方法会由<code>createComputedGetter</code>方法返回

在深入分析前，我们可以使用如下例子进行后续逻辑的分析
```js
new Vue({
	el: '#app',
	template: `
		<div id="app">
			<div>{{ name }}</div>
			<div>{{ age }}</div>
			<div>{{ info }}</div>
		</div>
	`,
	data: {
		name: '张三',
		age: 20
	},
	computed: {
		info () {
			return this.name + this.age
		}
	}
})
```

<code>createComputedGetter</code>方法和<code>definedComputed</code>方法定义在同一文件中
```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```
调用该方法，会返回<code>computedGetter</code>方法，当在<code>vm</code>实例上对该计算属性进行访问时，会先在<code>vm._computedWatchers</code>中找到对应的<code>watcher</code>，由于每个计算属性的<code>watcher</code>选项中<code>lazy</code>属性都为<code>true</code>，所以实例化每个计算属性的<code>watcher</code>过程中<code>watcher.dirty</code>初始也为<code>true</code>，接着会调用<code>watcher.evaluate</code>方法

回到<code>Watcher</code>定义部分
```js
export default class Watcher {

  // ......

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  // ......

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  // ......

}
```
<code>watcher.evaluate</code>方法会在内部调用<code>this.get</code>方法，将当前计算属性对应的<code>watcher</code>赋值给<code>Dep.target</code>，接着执行当前计算属性对应的<code>getter</code>方法（在我们分析的例子中就是<code>return this.name + this.age</code>），然后又会进行依赖收集，<code>Dep.target</code>返回为<code>push</code>之前的状态和清除依赖的过程，最后会将当前计算属性的<code>getter</code>方法返回的值赋给<code>this.value</code>，然后将<code>this.dirty</code>置为<code>false</code>

继续回到<code>computedGetter</code>中
```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```
在执行<code>watcher.get</code>方法中的<code>watcher.getter</code>之前（就是执行计算属性的<code>getter</code>方法，<code>return this.name + this.age</code>），总是会把当前<code>watcher</code>赋值给<code>Dep.target</code>，执行之后会将<code>Dep.target</code>的状态重置为赋值之前的状态，在我们上述例子中，在执行完计算属性<code>info</code>对应<code>watcher</code>的<code>get</code>方法后，<code>Dep.target</code>会指向渲染<code>watcher</code>，所以会接着执行<code>watcher.depend</code>方法

```js
export default class Watcher {

  // ......

  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  // ......

}
```
<code>depend</code>方法会循环调用计算属性所依赖的每个属性的<code>dep.depend</code>方法
```js
export default class Dep {

  // ......

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
	
  // ......

}
```
然后每个属性的<code>dep.subs</code>对渲染<code>watcher</code>进行订阅，同样渲染<code>watcher</code>也会对计算属性依赖的每个属性的<code>dep</code>进行依赖收集，不过在依赖收集时会有去重处理，所以不会重复依赖和订阅

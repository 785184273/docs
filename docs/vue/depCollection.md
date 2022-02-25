---
title: 依赖收集
date: 2021-10-12
categories:
 - 源码分析
tags:
 - vue
---

<code>Vue</code>会循环遍历<code>data</code>中的每个属性，并调用内部方法<code>defineReactive</code>，然后为每个属性分配一个<code>Dep</code>实例，再利用<code>Object.defineProperty</code>为每个属性添加一个<code>Getter</code>和<code>Setter</code>，而<code>Getter</code>则负责依赖收集
```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep() // 循环调用defineReactive时会为每个属性分配一个Dep

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get // 获取预先定义的Getter
  const setter = property && property.set // 获取预先定义的Setter
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
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
			
      // ......
			
    }
  })
}
```
<code>defineReactive</code>方法会先获取调用该方法的属性的预先定义的<code>Getter</code>和<code>Setter</code>

在<code>Getter</code>方法<code>reactiveGetter</code>中，会先判断调用<code>defineReactive</code>方法的属性是否存在预先定义的<code>getter</code>方法，如果存在，则调用预先定义的<code>Getter</code>，如下场景可能会存在
```js
const data = {}
Object.defineProperty(data, 'name', {
	enumerable: true,
	configurable: true,
	get: function GetterFnc () {
		return 'zhangsan'
	}
})
new Vue({
	el: '#app',
	data // data对象中的属性存在预先定义的getter
})
```

接口会通过<code>Dep.target</code>做一层判断，如果通过，则使用<code>dep.depend</code>方法实现依赖收集

## Dep
<code>Dep</code>定义比较简单，在<code>src/core/observer/dep.js</code>中可查看
```js
let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```
<code>Dep</code>使用<code>Class</code>定义，两个实例属性<code>id</code>，<code>subs</code>，从<code>flow</code>对<code>subs</code>的类型则可以看出，<code>subs</code>是一个<code>watcher</code>集合，四个实例方法<code>addSub</code>，<code>removeSub</code>，<code>depend</code>，<code>notify</code>，一个静态属性<code>Dep.target</code>，<code>depend</code>主要负责依赖收集，而<code>notify</code>负责循环调用<code>dep.subs</code>中的每个<code>watcher</code>实例的<code>update</code>方法实现数据更新

回顾<code>new Vue</code>实例化过程的分析中，在<code>src/core/instance/lifecycle.js</code>文件中的<code>mountComponent</code>方法中，实例化了一个渲染<code>watcher</code>
```js
updateComponent = () => {
	vm._update(vm._render(), hydrating)
}

new Watcher(vm, updateComponent, noop, {
	before () {
		if (vm._isMounted && !vm._isDestroyed) {
			callHook(vm, 'beforeUpdate')
		}
	}
}, true /* isRenderWatcher */)
```

## Watcher
<code>watcher</code>定义在<code>src/core/observer/watcher.js</code>中
```js
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy // watcher实例为lazy类型时不会调用this.get方法
      ? undefined
      : this.get()
  }

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

  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  // ......

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

 // ......
}
```

## 过程分析
在<code>watcher</code>小节分析过，只有当<code>watcher</code>实例的<code>lazy</code>属性为<code>false</code>时，才会调用<code>watcher</code>实例的<code>get</code>方法，在<code>get</code>方法前后会分别执行一次<code>pushTarget</code>和<code>popTarget</code>方法，这两个方法和<code>Dep</code>类定义在同一文件中
```js
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
```
根据方法定义可以看出，<code>pushTarget</code>会将<code>watcher</code>实例<code>push</code>到<code>targetStack</code>中，且赋值给<code>Dep.target</code>，而<code>popTarget</code>则是删除<code>targetStack</code>中的最后一个<code>watcher</code>实例，并重新赋值<code>Dep.target</code>，其实就是恢复到<code>push</code>前的状态

由此可以知道的是，在实例化渲染<code>watcher</code>过程中，会先将当前<code>watcher</code>实例赋值给<code>Dep.target</code>，再调用<code>updateComponent</code>回调生成<code>vnode</code>，再渲染到页面，而在生成<code>vnode</code>的过程中会对<code>data</code>中的数据进行访问，则会触发为每个属性定义的<code>reactiveGetter</code>方法，可以使用如下例子分析
```js
const vm = new Vue ({
	data: {
		name: '张三'
	},
	render (h) {
		return h('div', {
			attr: {
				id: 'foo'
			}
		}, this.name) // 在生成vnode的过程中会访问this.name
	}
})
```
回到<code>defineReactive</code>中为每个属性定义的<code>Getter</code>方法
```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
	
  // ......
	
  let childOb = !shallow && observe(val)
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
      // ......
    }
  })
}
```
在生成<code>vnode</code>过程中并访问到<code>data</code>中的数据时，此时<code>Dep.target</code>为渲染<code>watcher</code>，则会调用为当前属性分配的<code>dep</code>实例的<code>depend</code>方法
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
由于<code>Dep.target</code>为<code>watcher</code>实例，则会接着调用<code>watcher.addDep</code>，并将当前<code>dep</code>实例作为参数传递
```js
export default class Watcher {

	// ......

	this.deps = []
	this.newDeps = []
	this.depIds = new Set()
	this.newDepIds = new Set()

	// ......

	addDep (dep: Dep) {
		const id = dep.id
		if (!this.newDepIds.has(id)) {
			this.newDepIds.add(id)
			this.newDeps.push(dep)
			if (!this.depIds.has(id)) {
				dep.addSub(this)
			}
		}
	}

	// ......

}
```
<code>addDep</code>方法会拿传进来的<code>dep.id</code>做层判断，看是否在<code>newDepIds</code>的集合中存在，如果存在，则将<code>dep.id</code>和<code>dep</code>实例分别添加到<code>newDepIds</code>和<code>newDeps</code>中，这样做主要是为了防止重复添加属性的<code>dep.id</code>，例如:
```js
new Vue({
	data: {
		name: 'zhangsan'
	},
	render (h) {
		return h('div', null, [
			h('span', null, this.name),
			h('span', null, this.name)
		])
	}
})
```
在<code>vnode</code>生成过程中，对<code>this.name</code>访问了两次，则会触发两次<code>Getter</code>，如果不对<code>dep.id</code>做<code>has</code>判断，则会添加两次，起到去重的作用

接着会继续判断<code>dep.id</code>是否在<code>depIds</code>的集合中存在，如果不存在，则调用<code>dep.addSub</code>方法
```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // ......
	
}
```
将当前<code>watcher</code>实例<code>push</code>到依赖的属性对应的<code>dep</code>实例的<code>subs</code>集合中，对当前<code>watcher</code>实例实现订阅

至此，完成了依赖收集的过程

**既然有了依赖收集的过程，那么也存在依赖清空的过程**
回到<code>watcher</code>实例的<code>get</code>方法中
```js
export default class Watcher {
	// ......
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
}
```
在<code>this.getter</code>执行完后完成依赖收集，会跟着判断<code>this.deep</code>，该选项主要存在监听器<code>watcher</code>中，后续监听器<code>watcher</code>部分再进行分析，接着执行<code>popTarget</code>方法（可在上面查看该方法的定义），将<code>Dep.target</code>恢复为<code>pushTarget</code>之前的状态，接着执行<code>this.cleanupDeps</code>方法，清空依赖
```js
export default class Watcher {
	// ......
  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
	// ......
}
```
在依赖收集后会接着清空依赖，逻辑较简单，首先遍历<code>deps</code>，移除<code>dep.subs</code>数组中对<code>watcher</code>实例的订阅，然后<code>newDepIds</code>和<code>depIds</code>交换，并且清空<code>newDepIds</code>，<code>newDeps</code>和<code>deps</code>交换，清空<code>newDeps</code>，可以使用如下例子分析
```js
const vm = new Vue({
	el: '#app',
	template: `
		<div id="app">
			<button
				v-if="toggle"
				@click="changeState">{{ open }}</button>
			<button
				v-else
				@click="changeState">{{ close }}</button>
		</div>
	`,
	data: {
		open: '开',
		close: '关',
		toggle: true
	},
	methods: {
		changeState () {
			this.toggle = !this.toglle
		}
	}
})
```
使用流程图分析

**初始渲染的依赖收集阶段**
![依赖收集阶段](/img/depCollection1.png)
**初始渲染的依赖清除阶段**

依赖清除阶段中，<code>newDeps</code>和<code>deps</code>中的数据进行交换，且清空<code>newDeps</code>中的数据，<code>newDepIds</code>和<code>depIds</code>中的数据进行交换，且清空<code>newDepIds</code>中的数据
![依赖清除阶段](/img/depCollection2.png)

当<code>this.toggle</code>的状态变为<code>false</code>时，会触发该属性的<code>reactiveSetter</code>方法，由于<code>this.toggle</code>的<code>dep.subs</code>中订阅了渲染<code>watcher</code>，因此会重新生成<code>vnode</code>并利用<code>dom diff</code>算法重新渲染

**this.toggle为false的依赖收集阶段**
![依赖收集阶段](/img/depCollection3.png)
当<code>this.toggle</code>为<code>false</code>时，此时<code>depIds</code>中的数据不为空，会判断依赖的<code>dep.id</code>是否存在于<code>depIds</code>中，如果不存在，则为依赖的<code>dep.subs</code>中添加订阅<code>watcher</code>，这样做主要是为了去重处理，不会重复添加<code>watcher</code>

**this.toggle为false的依赖清除阶段**
![依赖收集阶段](/img/depCollection4.png)
当<code>this.toggle</code>为<code>false</code>时，此时<code>deps</code>中的数据不为空，会进行<code>while</code>循环，循环遍历其中的<code>dep</code>，利用他们<code>dep.id</code>，判断是否存在<code>newDepIds</code>中，如果有则不清空订阅的<code>watcher</code>，如果没有则清空

**为什么需要依赖清空呢？**

当我们切换<code>toggle</code>状态为<code>false</code>时，本身只需要依赖<code>toggle</code>和<code>close</code>，如果不做依赖清空，则之前的<code>open</code>也会被作为依赖，当我们修改<code>vm.open</code>的值时会直接触发重新渲染，做了依赖清空即使修改<code>vm.open</code>的值也不会触发重新渲染






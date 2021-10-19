# watch
监听器的初始化也是在<code>initState</code>方法中，在计算属性的初始化之后，在<code>src/core/instance/state.js</code>文件中可查看
```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
	
  // ......

  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
初始化监听器会调用<code>initWatch</code>方法，和<code>initState</code>方法定义在同一文件中
```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```
在[参数合并](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/mergeOption.html)小节对<code>watch</code>的合并做了分析，如果存在<code>parentVal</code>的情况下，合并后<code>watch</code>中的每项都会是一个数组，相同名称的监听器会合并为一个数组，所以在<code>initWatch</code>方法内会有一个数组的判断，接着会调用<code>createWatcher</code>方法

在分析之前，可借助如下例子逐步带入分析
```js
const vm = new Vue({
	el: '#app',
	template: `<div id="app"></div>`,
	data: {
		age: 30,
		name: 'zhangsan',
		detailInfo: {
			addr: '四川省巴中市',
			phone: '7799139'
		}
	},
	watch: {
		age (val, oldVal) {
			console.log(val, oldVal)
		},
		detailInfo: {
			handler (val, oldVal) {
				console.log(val, oldVal)
			},
			deep: true
		}
	}
})
```

<code>createWatcher</code>和<code>initWatch</code>方法在同一文件中定义
```js
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```
在<code>createWatcher</code>方法内部会对<code>handler</code>做对象和字符串的判断以便获取真正的监听器函数，需要注意的是<code>handler</code>如果为字符串，则会将<code>methods</code>中的同名方法作为监听器的<code>handler</code>，最后会调用<code>vm.$watch</code>方法

<code>vm.$watch</code>在<code>stateMixin</code>方法内部定义，该方法和<code>initState</code>方法定义在同一文件中
```js
export function stateMixin (Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.

  // ......

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      const info = `callback for immediate watcher "${watcher.expression}"`
      pushTarget()
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
      popTarget()
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```
<code>vm.$watch</code>方法逻辑较简单，在方法内部对<code>cb</code>也做了一层对象判断，因为<code>$watch</code>方法可以直接调用，参数<code>cb</code>可以是对象也可以是函数，<code>options</code>是监听器选项，且默认存在<code>user</code>选项，在方法内部为每个监听器创建一个监听器实例，需要注意的是<code>expOrFn</code>可以是一个函数也可以是一个字符串，例如:
```js
vm.$watch(
	function () { return this.name },
	function (val, oldVal) {
		console.log(val, oldVal)
	}
)
```

继续回到<code>Watcher</code>部分
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
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  // ......

}
```
在实例化监听器<code>watcher</code>的过程中，会对<code>expOrFn</code>做类型判断，如果为函数类型则直接赋值给<code>this.getter</code>，如果为字符串类型，则会调用<code>parsePath</code>方法，该方法会返回一个函数，该方法定义在<code>src/core/util/lang.js</code>中
```js
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

```
接着会调用<code>this.get</code>方法
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
会将当前监听器<code>watcher</code>赋值给<code>Dep.target</code>，执行<code>this.getter</code>方法将监听数据的值赋给<code>this.value</code>，收集监听器<code>watcher</code>的依赖，接着就是判断该监听器<code>watcher</code>是否有深度监听选项（<code>this.deep</code>），如果有深度监听则会调用<code>traverse</code>方法，该方法在一个单独的文件中定义<code>src/core/observer/traverse.js</code>
```js
const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```
看过<code>Vue</code>文档的同学都会知道，当监听一个对象，并且修改监听对象的某个键对应的值的时候，如果希望能够被监听器捕获到，这时需要深度监听，<code>traverse</code>方法在内部调用<code>_traverse</code>，在该方法内部会对被监听的数据做一层判断，如果被监听的数据<code>val</code>是一些简单类型的值，或者是被冻结的对象，或者为<code>vnode</code>会直接<code>return</code>，如果被监听的数据<code>val</code>为数组或对象的时候，会循环每一项的值并递归调用<code>_traverse</code>方法，这样便会触发被监听数据的每一项的<code>Getter</code>方法，进而实使得该监听器<code>watcher</code>对遍历的每一项进行依赖收集，如果不深度监听，监听器<code>watcher</code>只会依赖被监听的数据

**<code>_traverse</code>方法内部有个小的优化点值得关注下，在调用该方法之前有一个对监听数据的<code>depId</code>收集的过程，做了去重处理，这样可以避免重复依赖**
例如:
```js
const Person = { name: '张三' }
new Vue({
	data: {
		a: {
			b: Person,
			c: Person
		}
	},
	watch: {
		a: {
			deep: true,
			handler: function (val, newVal) {
				console.log(val, newVal)
			}
		}
	}
})
```
在上面例子中，对<code>this.a</code>进行深度监听，在递归调用<code>_tarverse</code>方法时会进行<code>depId</code>的收集，由于<code>this.a.b</code>和<code>this.a.c</code>都是引用的同一对象，所以不会重复收集，第二次调用会直接<code>return</code>

继续回到<code>get</code>方法的逻辑，依赖收集结束后，接着会将<code>Dep.target</code>重置为上一状态、依赖清除

当监听器<code>watcher</code>依赖的数据发生变化时，会循环调用依赖数据订阅的每个<code>watcher</code>的<code>update</code>方法
```js
export default class Watcher {
	
  // ......
	
	update () {
		/* istanbul ignore else */
		if (this.lazy) {
			this.dirty = true
		} else if (this.sync) {
			this.run()
		} else {
			queueWatcher(this)
		}
	}

  // ......

}
```
当定义的监听器为同步监听器时，会直接调用<code>this.run</code>方法，例如:
```js
new Vue({
	data: {
		name: '张三'
	},
	watch: {
		name: {
			sync: true,
			handler: function (val, newVal) {
				console.log(val, newVal)
			}
		}
	}
})
```
上述例子就是同步监听器，一般默认的监听器都是异步的，则会调用<code>queueWatcher</code>方法，异步更新，最后还是会执行<code>this.run</code>方法，<code>queueWatcher</code>方法在[派发更新](lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/notifyUpdate.html)小节已经讲解过，这里就不多说明，直接看<code>this.run</code>方法的定义
```js
export default class Watcher {
	
  // ......
	
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          const info = `callback for watcher "${this.expression}"`
          invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
	
  // ......

}
```
在[派发更新](lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/notifyUpdate.html)小节也有对<code>this.run</code>方法的说明，该方法会在内部执行<code>this.get</code>方法，获取被监听数据变化后的值，如果变化前的值和变化后的值不相同或者被监听的数据为一个对象，或者为深度监听，则将新旧值做一个交换，因为监听器<code>watcher</code>默认会存在<code>user</code>选项，所以会进入<code>true</code>分支执行监听器函数<code>this.cb</code>，<code>value</code>和<code>oldValue</code>会分别为调用监听器函数<code>this.cb</code>的第一个和第二个参数

至此，监听器部分则全部分析完毕



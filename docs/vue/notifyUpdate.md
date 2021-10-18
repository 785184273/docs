# 派发更新
上一小节分析了响应式数据依赖收集的过程，这一节接着分析当数据发生改变通知更新的过程，首先看下<code>defineReactive</code>的<code>Setter</code>部分，该方法定义在<code>src/core/observer/index.js</code>
```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
		
      // ......
			
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
当响应式对象的属性值发生变化时会触发对应的响应式<code>Setter</code>方法，在方法内部会先调用预先在该属性定义的<code>Getter</code>方法获取属性值<code>value</code>，并将修改的值<code>newVal</code>和<code>value</code>做一个比对，如果<code>value</code>和<code>newVal</code>为相同的值或者<code>value</code>和<code>newVal</code>都为<code>NaN</code>，则不会触发更新，接着会判断是否存在自定义<code>customSetter</code>，如果存在则调用该方法，<code>customSetter</code>后续小节会讲解到，如果只存在预先定义的<code>Getter</code>而没有<code>Setter</code>，相当于任何修改操作都无效，该属性为只读属性，始终返回的都是固定值，所以直接<code>return</code>返回，如果存在预先定义的<code>Setter</code>则调用，否则将修改的<code>newVal</code>赋值给<code>val</code>，接着是根据修改的值<code>newVal</code>生成新的<code>childOb</code>，这里其实用到了闭包的思想，就不细说了（只可意会不可言传了），最后调用响应式对象属性的<code>dep.notify</code>方法实现派发更新

继续回到<code>src/core/observer/dep.js</code>文件中，查看<code>Dep</code>类中对<code>notify</code>方法的实现
```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // ......

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
在<code>notify</code>方法中，会循环遍历响应式对象属性对应的<code>dep.subs</code>中订阅的<code>watcher</code>实例，并调用每个<code>watcher</code>的<code>update</code>方法

继续回到<code>Watcher</code>中，可在<code>src/core/observer/watcher.js</code>文件中查看对<code>update</code>部分的定义
```js
export default class Watcher {
	
  // ......
	
  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
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
在<code>watcher</code>实例的<code>update</code>方法中，做了两次判断，首先判断<code>this.lazy</code>是否为<code>true</code>，当只有<code>watcher</code>实例为<code>computed watcher</code>时，该属性才为<code>true</code>，后面到计算属性小节的时候再做分析，接着判断当前<code>watcher</code>实例是否为同步<code>watcher</code>，如果为同步<code>watcher</code>则直接执行<code>run</code>方法，到监听器小节时再做分析，接着会调用<code>queueWatcher</code>方法，将<code>watcher</code>实例作为参数传递

在<code>src/core/observer/scheduler.js</code>中可以查看对<code>queueWatcher</code>方法的定义
```js

const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

// ......

export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```
在<code>queueWatcher</code>中，首先做了一层<code>has[id] == null</code>的判断，保证没有重复的<code>watcher</code>，接着对<code>flushing</code>做了层判断，为<code>false</code>的情况将<code>watcher</code>添加到数组<code>queue</code>中，<code>else</code>的部分后面再分析，接着就是判断<code>waiting</code>，保证只调用了一次<code>nextTick</code>方法，异步的调用<code>flushSchedulerQueue</code>方法，对于<code>nextTick</code>方法的分析会专门写一个小节

<code>flushSchedulerQueue</code>和<code>queueWatcher</code>方法定义在同一文件中
```js
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {

      // ......
	
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```
该方法首先对数组<code>queue</code>中的<code>watcher</code>根据其<code>id</code>做了从小到大的排序，源码中主要做了三点解释:

1. 组件的更新是从父到子（因为父组件总是先于子组件创建）
2. 组件的用户观察程序（监听器<code>watcher</code>）在其渲染观察程序（渲染<code>watcher</code>）之前运行（因为监听器<code>watcher</code>会优先于渲染<code>watcher</code>创建）
3. 如果某个组件在父组件的观察程序运行期间被销毁，它的观察者可以跳过

接着就是循环遍历<code>queue</code>中的每一项<code>watcher</code>，需要注意的点是每次循环都会重新计算<code>queue.length</code>，如果存在<code>watcher.before</code>方法，则调用，然后调用每一个<code>watcher</code>实例的<code>run</code>方法，接着调用<code>resetSchedulerState</code>方法，重置相关状态，和对<code>activated</code>和<code>update</code>钩子函数的调用

接着继续分析<code>watcher.run()</code>的逻辑，定义在<code>src/core/observer/watcher.js</code>中。
```js
class Watcher {
	
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
}
```
<code>run</code>方法内部先对<code>this.get</code>方法进行了调用，如果当前<code>watcher</code>为渲染<code>watcher</code>，则会重新生成新的<code>vnode</code>，利用<code>DOM Diff</code>算法，做局部更新渲染，如果为监听器<code>watcher</code>，则会根据返回的新值<code>value</code>和旧值<code>this.value</code>做比对，如果不相等，或者新值<code>value</code>为一个不为<code>null</code>的对象，或者<code>watcher</code>为一个深度监听器，则将新值<code>value</code>赋值给<code>this.value</code>，然后执行监听器回调<code>this.cb</code>

重置状态
```js
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}
```
<code>resetSchedulerState</code>方法中对<code>index、queue、activatedChildren、has、circular、waiting、flushing</code>都进行了重置

回到<code>queueWatcher</code>方法中，继续对<code>else</code>逻辑进行分析
```js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    if (!waiting) {
      waiting = true
      // ......
      nextTick(flushSchedulerQueue)
    }
  }
}
```
当<code>flushing</code>为<code>true</code>时会进入<code>else</code>分支逻辑，意味着<code>flushSchedulerQueue</code>在执行中有新的<code>watcher</code>被添加进来，源码中使用<code>while</code>循环根据<code>watcher.id</code>在队列<code>queue</code>中从后往前进行比对（在<code>flushSchedulerQueue</code>方法中对<code>queue</code>中的<code>watcher</code>进行了排序，所以肯定是有序的<code>watcher</code>队列），然后找到合适的位置插入到<code>queue</code>队列中



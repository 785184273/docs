# Watcher
在上一节的<code>new Vue</code>过程中说到<code>mountComponent</code>方法中会实例化一个渲染<code>watcher</code>，相关部分定义在<code>src/core/observer/watcher.js</code>，<code>Watcher</code>使用<code>Class</code>定义，而非构造函数。

<code>Wathcer</code>只是定义了很多实例属性，其实代码也不复杂，根据上一节<code>vm</code>挂载先看部分代码
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
    if (isRenderWatcher) { // 判断是否是渲染watcher
      vm._watcher = this
    }
    vm._watchers.push(this) // 将当前watcher实例添加到当前vm.watchers数组中，在vue实例化过程中初始化states时定义了vm._watchers
    // options
    if (options) { // watcher选项
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
    if (typeof expOrFn === 'function') { // 判断是否是函数类型
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
    this.value = this.lazy // 只有是computed watcher this.lazy才为true
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this) // 将当前watcher实例赋值给Dep.target，并且push到targetStack数组中
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm) // 在指定的作用域下调用this.getter，如果是渲染watcher则为上一小节的mountComponent回调函数
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) { // 在侦听器watcher选项中会有deep选项，表示是否深度监听，渲染watcher和computed watcher不会进入该分支
        traverse(value)
      }
      popTarget() // 将当前watcher实例移除targetStack数组，并且将Dep.target赋值为targetStack数组中的最后一个watcher（如果有），没有则为undefined
      this.cleanupDeps() // 清除依赖
    }
    return value // 返回value，只有computed watcher会存在返回值value
  }
	
  //  ...

}
```
实例化<code>watcher</code>时会走到<code>constructor</code>构造函数部分，根据<code>this.lazy</code>判断是否执行回调<code>this.getter</code>，根据上一节<code>new Watcher</code>的参数：
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
可以看出，会执行<code>updateComponent</code>回调部分，下一小节再进入<code>vm._render</code>分析环节
# 参数合并
我们知道在<code>new Vue</code>时会传入一个参数对象，比如：
```js
new Vue({
	el: '#app',
	data: {
		name: 'zhangsan',
		age: 20
	},
	components: {
		HelloWorld
	},
	computed: {
		getInfo () {
			return `姓名: ${this.name}, 年龄: ${this.age}`
		}
	},
	methods: {
		getName () {
			return this.name
		}
	}
})
```
在实例化<code>Vue</code>实例时，会在源码中进行一次参数合并，在<code>src/core/instance/init.js</code>中的<code>Vue.prototype._init</code>方法中可以看到有<code>mergeOptions</code>这样一个方法，顾名思义就是配置合并
```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
		
    // ......
		
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      // 参数合并
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
		
    // ......

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

::: tip 提示
需要注意的是，Vue实例的参数合并在<code>Vue.prototype._init</code>中，而组件实例的参数合并在<code>Vue.extend</code>中，后面组件部分会介绍
:::
## resolveConstructorOptions
在合并参数之前，调用了<code>resolveConstructorOptions</code>方法，传递的参数为实例的<code>constructor</code>属性，我们知道实例的<code>constructor</code>属性会指向构造函数，所以实际上传递的就是<code>Vue</code>构造函数
```js
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    // 先省略这部分代码，主要是用在实例化 Vue.extend 方法返回的构造函数，后续再介绍
    // ......
  }
  return options
}
```
所以实际上<code>resolveConstructorOptions</code>方法返回的就是<code>Vue.options</code>。
在<code>src/core/global-api/index.js</code>中定义了很多<code>Vue</code>的属性，比如<code>Vue.set</code>，<code>Vue.delete</code>，<code>Vue.nextTick</code>...，不过我们先分析<code>Vue.options</code>
```js
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)
```
使用<code>Object.create(null)</code>方法创建一个没有原型链的对象，赋值给<code>Vue.options</code>，接着循环遍历常量<code>ASSET_TYPES</code>数组中的每一项，作为<code>Vue.options</code>中的属性，在<code>src/shared/constants.js</code>中可查看对<code>ASSET_TYPES</code>的定义
```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```
将<code>Vue.options._base</code>设置为对<code>Vue</code>的引用，并利用<code>extend</code>方法，将内置组件<code>KeepAlive</code>添加到<code>Vue.options.components</code>中，可在<code>src/shared/util.js</code>中查看<code>extend</code>工具函数的定义，在<code>src/core/components/index.js</code>中查看导出的内置组件对象<code>KeepAlive</code>
```js
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

// src/core/components/index.js
import KeepAlive from './keep-alive'

export default {
  KeepAlive
}
```
在<code>src/platforms/web/runtime/index.js</code>中也对<code>Vue.options.directives</code>和<code>Vue.options.components</code>进行了扩展
```js
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)
```
<code>platformDirectives</code>定义在<code>src/platforms/web/runtime/directives/index.js</code>中，主要是内置的指令<code>v-model</code>，<code>v-show</code>，<code>platformComponents</code>定义在<code>src/platforms/web/runtime/components/index.js</code>中，包含内置组件<code>transition</code>，<code>transition-group</code>
```js
// src/platforms/web/runtime/components/index.js
import Transition from './transition'
import TransitionGroup from './transition-group'

export default {
  Transition,
  TransitionGroup
}

// src/platforms/web/runtime/directives/index.js
import model from './model'
import show from './show'

export default {
  model,
  show
}
```



## mergeOptions
在<code>src/core/util/options.js</code>中，可以看到<code>mergeOptions</code>方法的定义，在<code>Vue.prototype._init</code>中的<code>mergeOptions</code>方法调用中传递了三个参数<code>Vue.options</code>，<code>options</code>对象，和<code>vm</code>实例，分别对应<code>mergeOptions</code>的<code>parent</code>，<code>child</code>，<code>vm</code>三个形参，且<code>vm</code>参数可选
```js
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child) // 验证options.components中的组件名称
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm) // 规范化props
  normalizeInject(child, vm) // 规范化Inject
  normalizeDirectives(child) // 规范化directives
	
  // ......

}
```
在<code>mergeOptions</code>中调用<code>normalizeProps</code>规范化<code>props</code>，<code>normalizeProps</code>方法和<code>mergeOptions</code>方法在同一文件中
```js
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val) // 将prop名称转为驼峰形式并返回
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}
```
<code>normalizeProps</code>方法逻辑很简单，定义<code>res</code>对象作为规范后的<code>props</code>，遍历<code>options.props</code>中的每一项<code>prop</code>，并对每个<code>prop</code>名称使用<code>camelize</code>方法转换为驼峰形式，例如: <code>dataInfo</code>，添加到<code>res</code>对象中，然后将<code>res</code>对象重新赋值给<code>options.props</code>

接着调用<code>normalizeInject</code>方法和<code>normalizeDirectives</code>方法，逻辑都很简单明了，<code>normalizeInject</code>方法同<code>normalizeProps</code>方法思想一样，也是定义一个对象然后循环遍历重新赋值，这里就只分析下<code>normalizeDirectives</code>方法
```js
function normalizeDirectives (options: Object) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}
```
<code>normalizeDirectives</code>方法将<code>options.directives</code>中的所有自定义指令循环遍历一次，做一次函数类型判断，如果是函数类型，则重新赋值为一个对象，并且默认包含<code>bind</code>和<code>update</code>，关于<code>bind</code>和<code>update</code>的使用可以查看[官方文档自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)部分

继续回到<code>mergeOptions</code>方法中
```js
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component

  // ......

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  // ......

}
```
接着
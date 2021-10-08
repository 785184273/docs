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
需要注意的是，<code>Vue</code>实例的参数合并在<code>Vue.prototype._init</code>中，而组件实例的参数合并在<code>Vue.extend</code>中，后面组件部分会介绍
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
所以实际上<code>resolveConstructorOptions</code>方法返回的就是<code>Vue.options</code>，
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
接着在<code>mergeOptions</code>中调用<code>normalizeProps</code>规范化<code>props</code>，<code>normalizeProps</code>方法和<code>mergeOptions</code>方法在同一文件中
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
<code>normalizeProps</code>方法逻辑很简单，定义<code>res</code>对象作为规范后的<code>props</code>，遍历<code>options.props</code>中的每一项<code>prop</code>，并对每个<code>prop</code>名称使用<code>camelize</code>方法转换为驼峰形式，（例如：将<code>data-info</code>转换为<code>dataInfo</code>），然后添加到<code>res</code>对象中，然后将<code>res</code>对象重新赋值给<code>options.props</code>

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
接着做一层<code>child._base</code>判断，确保<code>child</code>为原始选项对象，而不是合并后的对象，因为只有<code>parent</code>参数对象和<code>child</code>参数对象合并过后才会有<code>_base</code>属性（上面说明过<code>parent</code>形参对应<code>Vue.options</code>，而<code>Vue.options</code>中存在<code>_base</code>属性，所以只有合并后才会存在<code>_base</code>属性）

如果参数对象<code>child</code>中含有<code>extends</code>和<code>mixins</code>属性，则会递归调用<code>mergeOptions</code>方法

继续看<code>mergeOptions</code>中的逻辑
``` js
const options = {}
let key
for (key in parent) {
	mergeField(key)
}
for (key in child) {
	if (!hasOwn(parent, key)) {
		mergeField(key)
	}
}
function mergeField (key) {
	const strat = strats[key] || defaultStrat
	options[key] = strat(parent[key], child[key], vm, key)
}
return options
```
循环遍历<code>parent</code>和<code>child</code>中的每个属性并且调用<code>mergeField</code>方法，在遍历<code>child</code>中时多了一层判断，只有当遍历的属性不存在与<code>parent</code>中时才会调用<code>mergeField</code>方法，避免重复调用，在<code>mergeField</code>中，会根据不同的参数<code>key</code>获取不同的合并策略，然后进行合并，如果未定义相关<code>key</code>的合并策略，则默认使用<code>defaultStrat</code>进行合并，<code>parent._base</code>使用的就是<code>defaultStrat</code>方法进行的合并

先简单看下<code>defaultStrat</code>合并方法
```js
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}
```
<code>defaultStrat</code>只是做了一层简单的判断

## strats（合并策略对象）
<code>strats</code>合并策略对象和<code>mergeOptions</code>方法都在一个文件中定义，<code>strats</code>指向<code>config.optionMergeStrategies</code>，<code>config</code>对象为<code>src/core/config.js</code>中的默认导出对象
```js
// src/core/config.js
export default ({

  optionMergeStrategies: Object.create(null),
	
  // ......

}: Config)


// src/core/util/options.js
import config from '../config'

// ......

const strats = config.optionMergeStrategies

// ......
```
<code>strats</code>中定义了很多合并策略，可以在<code>src/core/util/options.js</code>中详细查看，这里不一一说明，可以自行查看，逻辑都挺简单的，这里主要分析下<code>data</code>和<code>props</code>，<code>watch</code>的合并
### data
对<code>data</code>的合并时，先对<code>vm</code>做了层判断，看是否存在
::: tip 注意
当<code>vm</code>为根实例时，<code>mergeOptions</code>的第三个参数<code>vm</code>是存在的，当为<code>Vue.extend</code>返回的构造函数的实例时，进行参数合并，<code>vm</code>参数没有传递
:::
```js
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )
      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
```
当<code>vm</code>不存在，则说明<code>vm</code>为<code>Vue.extend</code>返回的构造函数的实例，如果<code>childVal</code>类型不为<code>function</code>，则会报错，这就在源码层面解释了为什么组件中的<code>data</code>选项必须为一个<code>function</code>，接着都调用了<code>mergeDataOrFn</code>方法
```js
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // Vue.extend返回的构造函数参数合并
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    // vue根实例的参数和并
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
```
<code>mergeDataOrFn</code>中同样是对<code>vm</code>做了层是否存在的判断，并且都返回一个合并函数，当为根实例的参数合并时，返回<code>mergedInstanceDataFn</code>方法，且在内部对<code>childVal</code>进行了<code>function</code>类型判断，说明<code>new Vue</code>的参数对象中的<code>data</code>既可以为返回一个对象的<code>function</code>，也可以直接为一个对象，当为<code>Vue.extend</code>返回的构造函数的实例的参数合并时，返回<code>mergedDataFn</code>方法，且他们都在返回的函数中调用了<code>mergeData</code>方法
```js
function mergeData (to: Object, from: ?Object): Object {
  if (!from) return to
  let key, toVal, fromVal

  const keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    if (key === '__ob__') continue
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}
```
<code>mergeData</code>方法中对<code>from</code>参数对象中的每一项进行遍历并获取对应<code>key</code>的值，如果对应的<code>key</code>不存在于<code>to</code>对象中，则为<code>to</code>对象设置对应的<code>key</code>和值，如果存在，且在<code>to</code>和<code>from</code>中都为一个对象，则递归调用<code>mergeData</code>方法进行合并

综上就是对<code>data</code>参数的合并策略分析，单看代码，可能有点晦涩难懂，可以使用下列例子进行分析
<code>Vue</code>根实例的参数合并
```js
const mixin = {
	data: {
		name: '张三',
		info: {
			age: 20,
			addr: '四川省巴中市'
		}
	}
}

new Vue({
	mixins: [mixin],
	data: {
		name: '李四',
		info: {
			sex: '男'
		}
	}
})
```
根据上述的源码分析，<code>Vue.options</code>会先和<code>new Vue</code>参数项的<code>mixins</code>数组中的每一项mixin进行合并，并将返回的对象和<code>new Vue</code>的中其余的参数项进行合并
<code>Vue.extend返回的构造函数的实例的参数合并</code>
```js
const mixin = {
	data () {
		return {
			name: '张三',
			info: {
				age: 20,
				addr: '四川省巴中市'
			}
		}
	}
}
new Vue.extend({
	mixins: [mixin],
	data () {
		return {
			name: '李四',
			info: {
				sex: '男'
			}
		}
	}
})
```
需要注意的是<code>Vue.extend</code>参数对象中的<code>data</code>必须为<code>function</code>类型，同样的，<code>Vue.options</code>也会先和<code>mixins</code>中的每一项进行合并，再和其余项进行合并
### props
<code>props</code>、<code>methods</code>、<code>computed</code>都使用的相同的合并策略
```js
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
```
使用<code>Object.create(null)</code>创建原型链为<code>null</code>的对象，利用对象中的相同的<code>key</code>后面的<code>key</code>的值会替换掉前面的<code>key</code>的值的原理进行合并

### watch
<code>watch</code>相对于<code>props</code>的合并会复杂一点，但也仅仅是相对！
```js
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {

  // ......

  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal // 如果parentVal不存在，则直接返回childVal
  const ret = {}
  extend(ret, parentVal) // 将parentVal中的每一项都添加到ret中
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret // 返回的ret对象中，每个key都对应一个数组val
}
```
首先对<code>childVal</code>做是否存在判断，如果不存在则返回<code>Object.create(parent || null)</code>创建的对象，再利用<code>assertObjectType</code>对<code>childVal</code>做对象类型的断言判断，接着判断<code>parentVal</code>如果不存在，则直接返回<code>childVal</code>，如果条件都不成立则创建一个<code>ret</code>对象，将<code>parentVal</code>对象浅拷贝到<code>ret</code>中，再循环遍历<code>childVal</code>中的每个<code>key</code>，并根据遍历的<code>key</code>获取<code>ret</code>对象和<code>childVal</code>对象中的监听器，然后将每一项都重新设为数组，如果<code>ret</code>和<code>childVal</code>中都存在相同的监听器，则利用<code>concat</code>进行合并








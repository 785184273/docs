# 组件注册
组件注册分为两种形式，全局注册和局部注册，在分析组件注册之前，有必要先了解下<code>initGlobalAPI</code>方法

## initGlobalAPI
<code>initGlobalAPI</code>方法定义在<code>src/core/global-api/index.js</code>中，该方法在实例化<code>Vue</code>之前被调用
```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
```
该方法逻辑较简单，主要是在<code>Vue</code>上注册一些全局<code>API</code>，其中<code>Vue.use、Vue.mixin、Vue.extend、Vue.component</code>分别通过调用<code>initUse、initMixin、initExtend、initAssetRegisters</code>方法进行全局注册，参数合并需要用到的<code>Vue.options</code>也是在该方法内定义的

## 全局注册
全局注册需要使用<code>Vue.component</code>方法，在<code>src/shared/constants.js</code>中，可以查看对该方法的定义
```js
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```
<code>initAssetRegisters</code>方法在<code>initGlobalAPI</code>方法中调用，在该方法内会循环遍历<code>ASSET_TYPES</code>中的每一项，动态的在<code>Vue</code>上挂载全局<code>API</code>，<code>ASSET_TYPES</code>在<code>src/shared/constants.js</code>中定义
```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```
遍历结束完成对<code>Vue.component、Vue.directive、Vue.filter</code>全局方法的注册

全局注册一个组件时会传递两个参数
* 组件名称
* 组件选项对象

在使用<code>Vue.component</code>方法进行全局组件注册时在方法内部对<code>Vue.extend</code>进行了调用，可以查看在[createComponent](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/createComponent.html#vue-extend)小节对<code>Vue.extend</code>的分析，该方法会根据传入的组件对象返回一个继承了<code>Vue</code>原型对象的构造函数，然后将返回的构造函数添加在<code>Vue.options.component</code>中，并返回该构造函数，<code>Vue.directive、Vue.filter</code>和<code>Vue.component</code>共用的一个函数体，逻辑较简单，相信大家可以看懂

## 局部注册
在<code>Vue</code>中我们可以在一个组件或实例内注册另一个组件，比如：
```html
<body>
	<div id="app">
		<el-input/>
	</div>
</body>
<script>
const vm = new Vue({
	el: '#app',
	components: {
		'el-input': {
			template: `<input :value="name" />`,
			data () {
				return {
					name: 'zhangsan'
				}
			}
		}
	}
})
</script>
```
在分析前可以先回顾下[参数合并](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/mergeOption.html)小节

在实例化<code>vm</code>过程中，会进行[参数合并](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/mergeOption.html)，不同选项有不同的合并策略，在对<code>components</code>进行合并时会使用到<code>mergeAssets</code>方法，该方法定义在<code>src/core/util/options.js</code>中
```js
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}
```
该方法首先以<code>parentVal</code>（其实就是<code>Vue.options.components</code>）为原型创建<code>res</code>对象，再浅拷贝局部注册的组件并添加到<code>res</code>中

## 组件查找
组件注册完，使用组件有两种方式
* 在<code>template</code>模板内直接使用，例如`<el-input v-model="name"></el-input>`
* 使用渲染函数形式<code>vm.$createElement('el-input')</code>

在分析[new Vue过程](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/newVue.html#mount)时讲过，<code>template</code>模板形式最终都会被编译为渲染函数形式，所以最终都是直接调用<code>vm.$createElement('el-input')</code>方法，也就是直接调用<code>_createElement</code>方法，可以在[createComponent](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/createComponent.html)小节和[render](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/render.html)小节查看为什么会直接调用<code>_createElement</code>方法的分析，这里就不重复说明了，再次回到<code>_createElement</code>方法
```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {

  // ......
	
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn) && data.tag !== 'component') {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // 组件查询
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```
该方法内部代码可能看上去较多，但是逻辑较清晰，主要分析主线逻辑，会先规范化<code>children</code>，生成<code>children vnode</code>，接着会对<code>tag</code>做字符串判断，组件注册后，使用一个组件最终会编译为渲染函数的形式并根据组件名称进行查找，所以<code>tag</code>会是一个组件名字符串，由于组件名规范的问题不能是一个内置元素，所以会直接调用<code>resolveAsset</code>方法进行查询，<code>resolveAsset</code>方法定义在<code>src/core/util/options.js</code>中，
```js
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
```
该方法主要是在<code>assets</code>中查找组件名为<code>id</code>的构造函数，在查询的过程中，对组件名称做了几次转换处理，这样做的目的主要是为了解决如下情况
* 比如我注册一个组件名称为`MyComponent`，那么在使用时可以这样使用`<my-component />`，也可以这样`<MyComponent>`，或者渲染函数的形式<code>vm.$createElement('MyComponent')</code>或者<code>vm.$createElement('my-component')</code>
* 如果组件名称为`my-component`，那么在使用时只能这样使用`<my-component />`，或者渲染函数<code>vm.$createElement('my-component')</code>

在<code>Vue</code>官方文档[组件名大小写](https://cn.vuejs.org/v2/guide/components-registration.html#%E7%BB%84%E4%BB%B6%E5%90%8D%E5%A4%A7%E5%B0%8F%E5%86%99)一节也有说明

<code>resolveAsset</code>方法会返回查找到的对应组件名称的构造函数，将返回的构造函数作为参数调用<code>createComponent</code>方法创建组件<code>vnode</code>，也可以叫占位符<code>vnode</code>（源码标注的名称为占位符<code>vnode</code>），个人习惯叫组件<code>vnode</code>

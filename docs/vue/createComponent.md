# createComponent

该小节对于<code>createComponent</code>方法只会分析主要逻辑部分，对于<span style="border-bottom: 1px solid red; font-weight: bold;">异步组件、函数式组件、自定义组件v-model、keep-alive</span>分支逻辑先暂时略过，后续会出专门小节分析

在[render](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/render.html#createelement)小节分析过，<code>render</code>方法返回的<code>vnode</code>是通过调用<code>_createElement</code>内部方法而来

会借助如下例子做后续逻辑的分析
```js
new Vue({
  el: '#app',
  render (h) {
    return h('div', {
        attr: {
          id: 'form-container'
        }
      }, [
      h('div', {
        attr: {
          id: 'form-title'
        }
      }, '表单'),
      h({
        template: `
          <div class="form-wrapper">
            <div class="form-item">
              <label for="name">姓名:</label>
              <input :value="name" id="name" />
            </div>
            <div class="form-item">
              <label for="age">年龄:</label>
              <input :value="age" id="age" />
            </div>
          </div>
        `,
        data () {
          return {
            name: '张三'
          }
        }
      }, { props: { age: 20 }, attrs: { id: 'foo' } })
    ])
  }
})
```

普通标签<code>vnode</code>在<code>_createElement</code>方法内部直接通过<code>new VNode</code>生成返回，比如上例中的<code>id</code>为<code>form-container</code>和<code>form-title</code>的<code>div</code>，而组件<code>vnode</code>则是通过在<code>_createElement</code>方法内再调用<code>createComponent</code>方法生成

在<code>_createElement</code>方法内有这一段逻辑
```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
	
  // ......
	
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
      // component
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

  // ......

}
```
这段逻辑很简单，判断<code>tag</code>是否为字符串，如果为字符串且为内置的元素，则和生成普通标签<code>vnode</code>一样，直接<code>new VNode</code>，接着会判断<code>tag</code>是否为已注册的组件名称，如果是则会调用<code>createComponent</code>方法生成<code>vnode</code>（组件查找这段逻辑可在[组件注册](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/componentRegistry.html#%E7%BB%84%E4%BB%B6%E6%9F%A5%E6%89%BE)小节查看），如果<code>tag</code>不是字符串则直接调用<code>createComponent</code>方法生成<code>vnode</code>

在所写例子的参数对象<code>render</code>方法中，我们在调用参数<code>h</code>方法（其实就是调用<code>vm.$createElement</code>方法）时传入了一个组件对象，所以会走对<code>tag</code>类型判断的<code>else</code>分支，会直接调用<code>createComponent</code>方法，<code>tag</code>就是参数对象

<code>createComponent</code>方法定义在一个单独的文件<code>src/core/vdom/create-component.js</code>中

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  let asyncFactory
  /*
    异步组件部分
  */

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  /*
    自定义组件v-model部分
  */

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  /*
    函数式组件部分
  */

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn


  /*
    抽象组件部分 keep-alive
  */


  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  /*
	  weex部分
  */

  return vnode
}
```

在该方法内部首先注意的是<code>const baseCtor = context.$options._base</code>这段代码，在<code>src/core/global-api/index.js</code>文件中存在这样一行代码
```js
Vue.options._base = Vue
```
在实例化<code>vm</code>实例时会先进行参数合并，会对<code>new Vue</code>的参数对象和<code>Vue.options</code>进行合并，然后生成<code>vm.$options</code>，[参数合并](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/mergeOption.html#resolveconstructoroptions)小节有详细分析，可以查看对应的合并策略，所以，在<code>createComponent</code>中<code>baseCtor</code>指向<code>Vue</code>构造函数

经过上面的逻辑分析调用<code>createComponent</code>方法时，<code>Ctor</code>就是我们传入的组件对象，会接着调用<code>baseCtor.extend</code>方法，实际上就是调用<code>Vue.extend</code>方法


## Vue.extend
<code>Vue.extend</code>方法在单独的文件<code>src/core/global-api/extend.js</code>中定义

```js
export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++  
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}
```
<code>Vue.extend</code>的逻辑很清晰，其实就是根据传入的参数对象在该方法内创建一个构造函数<code>Sub</code>并返回，创建的构造函数原型继承自<code>Vue.prototype</code>，<code>Super</code>指向<code>Vue</code>，<code>this</code>指向性的问题不过多说明，接着将<code>Vue.options</code>和传入的组件对象进行合并，需要注意的是和实例化<code>Vue</code>实例过程中的参数合并不一样，<code>Vue.extend</code>中的参数合并没有第三个参数，接着就是为构造函数<code>Sub</code>做一些属性扩展和对配置合并后的<code>props</code>和<code>computed</code>做初始化工作（代理），最后在方法内对构造函数<code>Sub</code>做了缓存处理，避免重复创建构造函数
```js
Vue.extend = function (extendOptions: Object): Function {
  // ......
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }
	
  // ......
	
  // prop和computed代理
  if (Sub.options.props) {
    initProps(Sub)
  }
  if (Sub.options.computed) {
    initComputed(Sub)
  }

  // .......	

  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```
<code>initProps、initComputed</code>和<code>Vue.extend</code>定义在同一文件中
```js
function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
```
<code>initProps</code>和<code>initComputed</code>方法主要是做了层代理处理，代理在构造函数的原型对象上，<code>proxy</code>方法和<code>defineComputed</code>方法分别在[响应式对象](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/observe.html#proxy)和[计算属性](https://lw-source-0gry9eb6c4a0e823-1305870612.tcloudbaseapp.com/vue/computed.html#definecomputed)这两节中有过分析，这里不在赘述

需要注意的是，组件的<code>Props</code>和<code>computed</code>代理在<code>Vue.extend</code>阶段（因为组件实例是实例化<code>Vue.extend</code>返回的构造函数），根实例的<code>Props</code>和<code>computed</code>代理在初始化<code>state</code>阶段，组件是代理在组件实例的原型对象上，而根实例是代理在实例对象上

继续回到<code>createComponent</code>方法中，<code>Ctor</code>则为<code>Vue.extend</code>返回的构造函数，接着会调用<code>extractPropsFromVNodeData</code>方法提取<code>Props</code>
```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
	
  // ......
	
  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)
	
  // ......
	
}
```
## extractPropsFromVNodeData
定义在单独的文件<code>src/core/vdom/helpers/extract-props.js</code>中
```js
export function extractPropsFromVNodeData (
  data: VNodeData,
  Ctor: Class<Component>,
  tag?: string
): ?Object {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  const propOptions = Ctor.options.props
  if (isUndef(propOptions)) {
    return
  }
  const res = {}
  const { attrs, props } = data
  if (isDef(attrs) || isDef(props)) {
    for (const key in propOptions) {
      const altKey = hyphenate(key)
      if (process.env.NODE_ENV !== 'production') {
        const keyInLowerCase = key.toLowerCase()
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            `Prop "${keyInLowerCase}" is passed to component ` +
            `${formatComponentName(tag || Ctor)}, but the declared prop name is` +
            ` "${key}". ` +
            `Note that HTML attributes are case-insensitive and camelCased ` +
            `props need to use their kebab-case equivalents when using in-DOM ` +
            `templates. You should probably use "${altKey}" instead of "${key}".`
          )
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false)
    }
  }
  return res
}
```
该方法主要是提取<code>PropsData</code>，逻辑很清晰，借助上面所写例子进行分析，如果组件对象没有<code>Props</code>，则会直接<code>return undefined</code>，接着会根据传入<code>data</code>对象获取<code>attrs</code>和<code>props</code>数据，如果都为<code>undefined</code>则会直接返回空对象

如果<code>attrs</code>和<code>props</code>至少有一个存在数据，则会遍历组件对象的<code>Props</code>，获取每一个<code>Prop</code>名称（在参数项合并过程中会对<code>Props</code>规范化处理，将每个<code>Prop</code>名称转为驼峰形式），在调用<code>checkProp</code>之前会先做一层判断，如果定义的每个<code>Prop</code>名称和其小写形式不相同，且存在<code>attrs</code>对象，并且小写形式的<code>Prop</code>名称存在于<code>attrs</code>中，则会报出错误提示信息。

其实就是<code>Prop</code>大小写问题，组件中定义的<code>Prop</code>名称如果是驼峰形式，那么在<code>DOM</code>模板中使用时，传递数据的<code>Prop</code>名称必须是带有短横线分割的形式，在<code>Vue</code>文档[Prop](https://cn.vuejs.org/v2/guide/components-props.html#Prop-%E7%9A%84%E5%A4%A7%E5%B0%8F%E5%86%99-camelCase-vs-kebab-case)一节中也有对应的说明

接着会调用<code>checkProp</code>方法
```js
function checkProp (
  res: Object,
  hash: ?Object,
  key: string,
  altKey: string,
  preserve: boolean
): boolean {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key]
      if (!preserve) {
        delete hash[key]
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey]
      if (!preserve) {
        delete hash[altKey]
      }
      return true
    }
  }
  return false
}
```
<code>checkProp</code>方法逻辑较简单，其实就是在<code>props</code>和<code>attrs</code>中找到传递给组件<code>Prop</code>的数据，然后添加到<code>res</code>对象中，接着在<code>extractPropsFromVNodeData</code>方法中返回<code>res</code>对象

继续回到<code>createComponent</code>的后续逻辑
```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  
	// ......
	
  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // ......

  data = data || {}

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  // ......

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  
  /*
	  weex部分
  */

  return vnode
}
```
接着会调用<code>installComponentHooks</code>方法安装组件钩子函数
## installComponentHooks
<code>installComponentHooks</code>方法和<code>createComponent</code>方法定义在同一文件中
```js
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    // ......
  },

  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    // ......
  },

  insert (vnode: MountedComponentVNode) {
    // ......
  },

  destroy (vnode: MountedComponentVNode) {
    // ......
  }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

function mergeHook (f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}
```
<code>installComponentHooks</code>方法其实就是将<code>componentVNodeHooks</code>中定义的钩子函数添加到<code>data.hook</code>中，在添加过程中，如果<code>data.hook</code>中已经存在对应的钩子函数，则会利用<code>mergeHook</code>方法进行合并，在适当的实际会依次调用合并的钩子函数

接着分析<code>createComponent</code>中的后续逻辑，实例化组件<code>vnode</code>，也就是占位符<code>vnode</code>

## 实例化组件vnode
```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  
	// ......
	
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // ......

  return vnode
}
```
组件<code>vnode</code>的<code>tag</code>都会有一个固定前缀<code>vue-component</code>，值得注意的是，实例化组件<code>vnode</code>时会传递<code>{ Ctor, propsData, listeners, tag, children }</code>选项对象且没有传递<code>children</code>，而实例化普通标签<code>vnode</code>时不会传递选项对象但会传递<code>children</code>，实例化组件<code>vnode</code>后，会将其返回



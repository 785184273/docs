# render
<code>vm._render</code>方法定义在<code>src/core/instance/render.js</code>文件中。

通过<code>renderMixin</code>方法在<code>Vue</code>的原型上扩展:
```js
Vue.prototype._render = function (): VNode {
	const vm: Component = this
	const { render, _parentVnode } = vm.$options


	// ......

	vm.$vnode = _parentVnode
	// render self
	let vnode
	try {
		// There's no need to maintain a stack because all render fns are called
		// separately from one another. Nested component's render fns are called
		// when parent component is patched.
		currentRenderingInstance = vm
		// 调用render方法，返回vnode
		vnode = render.call(vm._renderProxy, vm.$createElement)
	} catch (e) {
		
    // ......
		
	} finally {
		currentRenderingInstance = null
	}
    // ......

	// set parent
	// 为返回的vnode设置parent属性。根实例为undefined，组件实例该属性则为组件vnode（占位符vnode）
	vnode.parent = _parentVnode
	return vnode
}
```
调用<code>_render</code>方法，会走到<code>$options</code>参数中<code>render</code>方法的执行，并为该方法传入<code>vm.$createElement</code>，<code>render</code>方法会返回一个<code>vnode</code>，<code>_render</code>方法中会为返回的<code>vnode</code>设置<code>parent</code>，如果vm为<code>Vue</code>的根实例，则该属性为<code>undefined</code>，如果vm为组件实例，则该属性为组件<code>vnode</code>（占位符<code>vnode</code>）

在<code>Vue</code>构造函数中，实例化<code>Vue</code>实例时会初始化渲染<code>initRender</code>，会为当前<code>vm</code>添加<code>$createElement</code>
```js
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree

  // ......
  // 为当前vm实例添加$createElememt方法
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // ......

}
```
在<code>Vue</code>官方文档的[渲染函数](https://cn.vuejs.org/v2/guide/render-function.html)一节中有详细描述<code>render</code>方法的使用，比如：
```js
const vm = new Vue({
	el: '#app',
	render (h) {
		return h('div',
			{ attr: { id: 'foo' } },
			'hello world'
		)
	}
})
```
参数<code>h</code>就相当于<code>vm.$createElement</code>，<code>vm.$createElement</code>函数内部通过调用<code>createElement</code>返回<code>vnode</code>，所以在看<code>createElement</code>之前先简单看下对<code>VNode</code>定义的部分，定义在<code>src/core/vdom/vnode.js</code>中。
## Vnode(Virtual DOM)
```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    // 下面是对vnode属性的定义
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```
<code>vnode</code>其实就是通过<code>new</code>一个<code>VNode</code>类的实例（和<code>Vue</code>使用构造函数不一样，而是使用<code>VNode</code>类），<code>tag, data, children, text, elm</code>...等，都是vnode实例的属性

## createElement
在<code>src/core/vdom/create-element.js</code>中可找到<code>createElement</code>方法的定义:
```js
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement (
  context: Component, // vm实例
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 如果第二个参数是数组或者isPrimitive（可在src/shared/util.js中查看该方法的定义）判断返回true则依次后移赋值
  // 在渲染函数官方文档定义中，h的第二个参数可选填，这就是可选填的实现
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
	// vm.$createElement方法定义中调用createElement时alwaysNormalize参数始终为true
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```
在<code>createElement</code>方法中主要对<code>h</code>方法第二个参数可选的实现，和对<code>_createElement</code>方法的调用
## _createElement
<code>createElement</code>和<code>_createElement</code>方法的定义都在同一文件中
```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // data不能为一个响应式对象
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 因为调用createElement时传递的最后一个参数为true，所以会走true分支
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children) // 规范化Children
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    // config.isReservedTag始终返回false
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
      // 创建组件vnode，预先注册组件，然后使用h('组件名称')该方式会走此分支
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      // 创建普通标签（比如：div,span,p...等）vnode
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // tag不为string类型，直接在h中传入参数对象也会创建一个组件vnode
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
<code>createElement</code>方法主要做了对<code>children</code>的规范化，和对<code>tag</code>的判断，如果为字符串，根据<code>config.isReservedTag</code>方法进行判断，由于该方法始终返回<code>false</code>，则跳过该分支，再判断是否为预先注册组件的<code>tag</code>，如果是，则创建预先注册组件的<code>vnode</code>，否则创建一个普通标签<code>vnode</code>，如果<code>tag</code>不为字符串则直接创建一个组件<code>vnode</code>
## children规范化
### normalizeChildren
可以在<code>src/core/vdom/helpers/normalize-children.js</code>中查看
```js
export function normalizeChildren (children: any): ?Array<VNode> {
	// 使用isPrimitive方法对children做类型判断，isPrimitive方法定义在src/shared/util.js中
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}
```
如果<code>isPrimitive</code>对<code>children</code>做类型校验返回<code>true</code>，则直接返回文本类型的<code>vnode</code>数组，否则再判断<code>children</code>是否为数组，如果为数组则调用<code>normalizeArrayChildren</code>方法，否则返回<code>undefined</code>

在分析<code>normalizeArrayChildren</code>之前，可看如下例子做代码分析使用
```js
const vm = new Vue({
	el: '#app',
	render: function renderFnc (h) {
		return h('div',
			{ attr: { id: 'app' } },
			// children为数组
			[
				'hello',
				'world'
			]
		)
	}
})
```
### normalizeArrayChildren
当<code>children</code>为数组时会调用<code>normalizeArrayChildren</code>
```js
function normalizeArrayChildren (children: any, nestedIndex?: string): Array<VNode> {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    if (isUndef(c) || typeof c === 'boolean') continue // 如果c为null和undefined或者为boolean类型则跳过当前循环
    lastIndex = res.length - 1 // lastIndex初始为-1
    last = res[lastIndex] // last 初始为undefined
    //  nested
    if (Array.isArray(c)) { // 如果c为数组，则进入该分支，相当于children内的子项还是数组
      if (c.length > 0) {
        // 递归调用normalizeArrayChildren
        c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
          c.shift()
        }
        res.push.apply(res, c)
      }
    } else if (isPrimitive(c)) { // 如果对c做isPrimitive类型验证返回true则进入该分支
      if (isTextNode(last)) { // 如果res数组的最后一项为文本类型的vnode
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
				// 将最后一项的text文本值和当前c合并创建文本类型的vnode，并重新赋给res的最后一项，保证了res数组只有一项
        res[lastIndex] = createTextVNode(last.text + c)
      } else if (c !== '') {
        // convert primitive to vnode
				// c不为空，根据c创建文本类型的vnode push到res数组中
        res.push(createTextVNode(c))
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
				// last和c都是文本类型的vnode，则合并为一个文本类型的vnode
        res[lastIndex] = createTextVNode(last.text + c.text)
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = `__vlist${nestedIndex}_${i}__`
        }
        res.push(c)
      }
    }
  }
  return res
}
```
<code>normalizeArrayChildren</code>的参数<code>children</code>为一个数组，可以是一维数组也可以是多维数组，遍历<code>children</code>的每一项，如果子项是数组且<code>length > 0</code>，则递归调用<code>normalizeArrayChildren</code>，如果子项通过<code>primitive</code>方法验证，则创建文本类型的<code>vnode</code>添加到<code>res</code>中，遍历过程中相邻的文本内容会合并成一个文本类型的<code>vnode</code>，相邻的文本类型的<code>vnode</code>也会合并成一个文本类型的<code>vnode</code>，然后返回<code>res</code>，且返回的<code>res</code>保证只有一项（<code>res.length</code>为1）

<code>render</code>函数创建<code>vnode</code>就是这么个过程，接下来分析<code>updateComponent</code>中<code>vm._update</code>方法

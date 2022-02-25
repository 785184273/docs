---
title: nextTick
date: 2021-10-15
categories:
 - 源码分析
tags:
 - vue
---


在上一小节派发更新中，对<code>queueWatcher</code>方法的分析中有对<code>nextTick</code>方法的使用，字面意义就是下一个<code>tick</code>，<code>nextTick</code>是一个异步方法，在解析该方法之前，需要读者对浏览器端事件循环有一定的理解，这里对事件循环就不做过多的讲解，可以参考[知乎事件循环](https://zhuanlan.zhihu.com/p/145383822)

我们知道<code>Vue</code>提供了两种对<code>nextTick</code>方法的调用方式，一种是<code>Vue.nextTick</code>，另一种则是在<code>Vue</code>实例上调用<code>vm.$nextTick</code>

在<code>src/core/global-api/index.js</code>中和<code>src/core/instance/render.js</code>中可分别查看这两种的定义
```js
// src/core/global-api/index.js
Vue.nextTick = nextTick

// src/core/instance/render.js
Vue.prototype.$nextTick = function (fn: Function) {
	return nextTick(fn, this)
}
```
可以看出这两种方式结果都会直接调用<code>nextTick</code>方法

在<code>Vue</code>中，对于<code>nextTick</code>方法的实现，有一个专门的<code>js</code>文件，在<code>src/core/util/next-tick.js</code>中可查看关于该方法的所有逻辑
```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
let timerFunc

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
<code>nextTick</code>方法的两个参数都是可选的，方法内部将<code>cb</code>回调函数包在一个箭头函数中，且将箭头函数<code>push</code>到<code>callbacks</code>回调函数队列中，然后根据对<code>pending</code>的判断，看是否执行<code>timerFunc</code>方法

<code>timerFunc</code>方法内部有多种实现方式，最优先的是使用<code>Promise</code>，其次判断环境是否支持<code>MutationObserver</code>，再判断是否支持<code>setImmediate</code>，再然后就是<code>setTimeout</code>，由于现在浏览器环境都支持<code>Promise</code>，所以<code>timerFunc</code>方法内部基本上都是使用<code>Promise</code>实现

当调用<code>timerFunc</code>方法时（这里只分析使用<code>Promise</code>方式实现的逻辑），会在下一个<code>tick</code>（关于事件循环部分参考上述连接）调用<code>flushCallbacks</code>方法，在该方法内部会将<code>pending</code>的值重置为<code>false</code>，且会循环调用<code>callbacks</code>中的方法，在执行<code>callbacks</code>队列中的方法时，会在方法内部判断<code>nextTick</code>是否传递回调方法<code>cb</code>，需要注意的是，当调用<code>nextTick</code>方法没有传递回调方法<code>cb</code>时，<code>nextTick</code>方法会直接返回一个<code>Promise</code>，如果传递了回调方法，则会在<code>ctx</code>的作用域下调用回调方法，否则会直接<code>resolve</code>返回的<code>Promise</code>
---
title: promise
date: 2021-05-11
categories:
 - 零碎点
tags:
 - js
---

::: tip 提示
主要说明promise中相关的疑点，基础Api可查看[es6入门](https://es6.ruanyifeng.com/#docs/promise)
:::
> thenable 指具有then方法的对象或者函数

## promise.resolve()
promise.resolve()会将传入的参数转为立即完成的promise

**假设我们要调用一个工具foo(), 且不确定得到的返回值是否是一个可信任的行为良好的promise，但是我们知道的是它至少是一个thenable**
```js
// 不要这么做
foo().then(function (v) {
	console.log(v)
})
// 而要这么做
Promise.resolve(foo()).then(v => console.log(v))
```
::: tip 注意
对于用Promise.resolve()为所有函数的返回值(不管是不是thenable)都封装一层，这样做的很容易把函数调用规范为定义良好的异步任务，如果foo()返回一个立即值，有时会返回Promise，那么Promise.resolve(foo())就能保证总返回一个Promise结果
:::

> promise.resolve()会将传入的真正promise直接返回，对传入的thenable则会展开，如果这个thenable展开得到一个拒绝状态，那么从Promise.resolve()返回的Promise实际就是这个状态
```js
var rejectedTh = {
	then (resolve, reject) {
  	reject('Oops')
  }
}
Promise.resolve(rejectedTh)
.then(v => {
	// 不会执行到这里, 会展开thenable
})
.catch(err => console.log(err))

```
## new Promise()
> 构造器的第一个参数(resolve)回调会展开thenable（和Promise.resolve()一样）或真正的Promise
```js
var rejectedPr = new Promise((resolve, rejected) => {
	resolve(Promise.reject('Oops')) // 用一个被拒绝的Promise完成这个promise
})
rejectedPr
.then(v => {
	// 永远不会到达这里
})
.catch(err => {
	console.log(err) // Oops
})
```
## promise链式流
1. 每次你对Promise调用then(或者catch)，它都会返回一个新的Promise，我们可以将其链接起来
2. 不管从then()调用的完成回调(第一个参数)返回的值是什么，它都会被自动设置为被链接Promise(第一点中的)的完成
::: warning 注意
使Promise序列真正能够在每一步有异步能力的关键是，回忆一下Promise.resolve。当传递给Promise.resolve()的是一个Promise或thenable而不是最终值时的运作方式。Promise.resolve()会直接返回接收到的真正Promise，或展开接收到的thenable值，并在持续展开thenable的同时递归的前进
:::
```js
var p = Promise.resolve(21)
p.then(v => {
  console.log(v) // 21
  // 创建一个Promise并将其返回
  return new Promise((resolve, reject) => {
  	resolve(v * 2) // 21 * 2
  })
}).then(v => {
  console.log(v) // 42
})
```
进一步阐释
```js
function delay(time) {
	return new Promise((resolve, reject) => {
  	setTimeout(resolve, time)
  })
}
delay(100) // 步骤1
.then(() => {
  console.log('step2')
  return delay(200)
})
.then(() => {
  console.log('step3')
})
```
调用delay(200)创建了一个将在200ms后完成的promise，然后我们从第一个then()完成回调中返回这个promise，这会导致第二个then()的promise等待这个200ms的promise

**严格的说，这个交互的过程中有两个promise: 200ms延迟promise和第二个then()链接到的那个链接promise，但是其实在脑子里把这两个promise合二为一之后更好理解，promise机制已经自动把它们的状态合并在一起，这样一来，可以把return delay(200)看做是创建了一个promise，并用其替换了前面返回的链接promise**
## 未能传递的参数
::: tip 提示
如果使用多个参数调用resolve和reject，第一个参数之后的所有参数都会被忽略，如果要传递多个值，你就必须要把它们封装在单个值中传递，使用对象或者数组
:::

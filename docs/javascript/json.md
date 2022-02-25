---
title: JSON.stringify()
date: 2021-05-15
categories:
 - 零碎点
tags:
 - js
 - json
---

所有安全的JSON值，都可以使用JSON.stringify()字符串化，安全的JSON值能够呈现为有效的JSON格式
::: tip 提示
  不安全的JSON值：undefined、function、symbol和包含循环引用（对象之间相互引用，形成一个无限循环）的对象都不符合JSON的结构标准
:::
JSON.stringify()在对象中遇到undefined、function、symbol时都会将其忽略，在数组中则会返回null，NaN会转换为null
```js
  JSON.stringify(undefined) // undefined
  JSOn.stringify(function () {}) // undefined

  JSON.stringify([1, undefined, function () {}, Symbol('hello'), NaN, '2']) // "[1, null, null, null, null, '2']"
  JSON.stringify({ a: 2, b: function () {}, c: null, d: undefined, e: NaN, f: Symbol('f') }) // "{ "a": 2, "c": null, "e": null }"
```
::: warning 注意
  对包含循环引用的对象执行JSON.stringify()会出错
:::
## toJSON
**如果对象中定义了toJSON()方法，JSON字符串化时会首先调用该方法，然后用它的返回值来进行序列化**

如果要对含有非法JSON值的对象做字符串化，或者对象中的某些值无法被序列化时，就需要定义toJSON()方法来返回一个安全的JSON值
```js
var o = {}
var a = {
  b: 42,
  c: o,
  d: function () {}
}
o.e = a // 创建一个循环引用
// JSON.stringify(a) // 出错
a.toJSON = function () {
  return { b: this.b }
}
JSON.stringify(a) // "{"b":42}"
```

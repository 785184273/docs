---
title: 封装对象
date: 2021-05-16
categories:
 - 零碎点
tags:
 - js
---

由于基本类型值没有.length和.toString()这样的属性和方法，需要通过封装对象才能访问，此时js会自动为基本类型值包装一个封装对象
```js
var a = 'abc'
a.length // 3
a.toUpperCase() // 'ABC'
```
我们基本上不需要直接使用封装对象例如new String('abc')等，而应该最优先考虑基本类型值

**如果想要自行封装基本类型值，可以使用Object()函数，等同于new Object()**
```js
var a = 'abc'
var b = Object(a)
var c = new String(a)

typeof a // "string"
typeof b // "object"
typeof c // "object"
```
## 拆封
如果想要得到封装对象中的基本类型值，可以使用valueOf()函数
```js
var a = new String('abc')
var b = new Boolean(true)
var c = new Number(123)

a.valueOf() // 'abc'
b.valueOf() // true
c.valueOf() // 123
```
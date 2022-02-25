---
title: 类型断言VS类型声明
date: 2022-02-25
categories:
 - 进阶
tags:
 - ts
---
类型声明比类型断言更加严格

## 类型断言
```ts
interface Animal {
	name: string
}

interface Cat {
	name: string
	run(): void
}

let tom: Animal = {
	name: 'tom'
}

let cat = tom as Animal // 成立
```
接口<code>Animal</code>和接口<code>Cat</code>相当于类的继承关系<code>class Cat extend Animal</code>，因为父类可以断言为子类，所以成立

## 类型声明
```ts
interface Animal {
	name: string
}

interface Cat {
	name: string
	run(): void
}

let tom: Animal = {
	name: 'tom'
}

let cat: Cat = tom // 不成立，Cat类型中的run在Animal类型中不存在，不能完成赋值，类型不兼容
```

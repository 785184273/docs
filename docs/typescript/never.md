---
title: never
date: 2021-05-20
categories:
 - 进阶
tags:
 - ts
---

[never的应用场景](https://www.zhihu.com/question/354601204/answer/888551021)

never类型是任何类型的子类型，也可以赋值给任何类型，但是没有类型是never的子类型或可以赋值给never类型（除了never本身之外）即使any也不可以赋值给never
```ts
var n: never
var num: number = n
var str: string = n
var bool: boolean = n
var obj: object = n
var arr: any[] = n
```
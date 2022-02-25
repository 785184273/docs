---
title: 栈
date: 2021-06-01
---

## 概念
栈是尊从**后进先出**原则的有序集合，新添加和待删除的元素都保存在栈的同一端，称作栈顶，另一端叫栈底。

在栈里，新元素都靠近栈顶，旧元素都靠近栈底（现实中的例子，桌子上的一堆书）

可以创建基于数组的栈，和基于对象的栈，但是在使用数组的时候，大部分方法的时间复杂度是O(n)（意思是我们需要迭代整个数组直到找到我们要找的那个元素，在最坏的情况下需要迭代数组的所有单元，其中n代表数组的长度，如果数组有更多元素的话，所需的时间会更长），数组是元素的有序几个，为了保证元素排列有序，会占用更多的内存空间

为了占用较少的内存空间，会使用js对象来存储所有的栈元素

## 方法
* push(element)： 向栈中添加一个新元素到栈顶
* pop()： 移除栈顶的元素，并且返回被移除的元素
* peek()： 返回栈顶的元素
* toString()： 相当于数组的toString()方法
* isEmpty()： 判断栈中是否存在元素，如果没有则返回true，否则返回false
* clear()： 移除栈里的所有元素
* size()： 返回栈里的元素个数，和数组的length属性类似

## 实现
``` js
class Stack {
  constructor () {
    this._count = 0
    this._items = {}
  }

  push (element) {
    this._items[this._count++] = element
  }

  pop () {
    if (this.isEmpty()) return undefined
    const item = this._items[this._count - 1] // 获取栈顶的元素
    delete this._items[this._count - 1]
    this._count--
    return item
  }

  peek () {
    if (this.isEmpty()) return undefined
    return this._items[this._count - 1]
  }

  toString () {
    if (this.isEmpty()) return ''
    let string = `${this._items[0]}`
    let i = 1
    while (i < this.count) {
      string = `${string},${this._items[i]}`
      i++
    }
    return string
  }

  isEmpty () {
    return this._count === 0
  }

  clear () {
    this._items = {}
    this._count = 0
  }

  size () {
    return this._count
  }
}
```
::: tip 提示
  因为class中暂时还没有私有属性，所以我们可以把其当成私有属性一样操作，只使用Stack中的方法，而不直接操作实例属性count和items，当然也可以使用
  ```js
  const Stack = (function Stack () {
    count = 0
    items = {}

    return {
      /* 
        暴露出的方法 
      */
    }
  })() 
  ```
  模块模式进行编写
:::
## 应用

### 十进制转换其它进制

* 二进制 数字0和1表示（计算机中的所有内容都是使用二进制数字表示的）
* 四进制 数字0-3表示
* 十进制 数字0-9表示
* 八进制 数字0-7表示
* 十六进制 数字0-9和字母A-F表示
``` js
// number 十进制数字，base 被转换成的进制参数
function decimalToBinary (number, base) {
  const stack = new Stack()
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let num = number
  let string = ''
  if (!(base >= 2 && base <= 36)) {
    return ''
  }

  while (num > 0) {
    stack.push(num % base)
    num = Math.floor(num / base)
  }

  while (!stack.isEmpty()) {
    string = `${string}${digits[stack.pop()]}`
  }
  return string
}
```
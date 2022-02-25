---
title: 队列
date: 2021-06-03
---

## 概念
队列是遵循**先进先出**原则的一组有序的项，队列从尾部添加新元素，并从顶部移除元素，最先添加的元素必须排在队列的末尾

现实中的例子有：排队

## 方法
* enQueue(element)：向队列尾部添加一个新的项
* deQueue()：移除队列的第一项，并返回被移除的元素
* peek()：返回队列中第一个元素
* toString()：相当于数组的toString()方法
* isEmpty()：判断队列中是否存在元素，如果存在则返回true，否则返回false
* clear()：清空队列的所有元素
* size()：返回队列元素的个数，和数组的length属性类型

## 实现
``` js
class Queue {
  constructor () {
    this._items = {}
    this._lowestCount = 0
    this._count = 0
  }

  enQueue (element) {
    this._items[this._count++] = element
  }

  deQueue () {
    if (this.isEmpty()) return undefined
    const item = this._items[this._lowestCount]
    delete this._items[this._lowestCount]
    this._lowestCount++
    return item
  }

  peek () {
    if (this.isEmpty()) return undefined
    return this._items[this._lowestCount]
  }

  toString () {
    if (this.isEmpty()) return ''
    let string = `${this._items[this._lowestCount]}`
    let i = this._lowestCount + 1
    while (i < this._count) {
      string = `${string},${this._items[i]}`
      i++
    }
    return string
  }

  isEmpty () {
    return this.size() === 0
  }

  clear () {
    this._items = {}
    this._lowestCount = 0
    this._count = 0
  }

  size () {
    return this._count - this._lowestCount
  }
}
```
## 应用
### 击鼓传花游戏

这个游戏中，小盆友们围坐成一个圈，把花尽快的传递给旁边的人，某一时刻传花停止，这个时候花在谁手里，谁就退出圈，游戏结束重复这个过程，直到只剩一个小盆友
``` js
function game (elements, num) {
  // 判断是否从传入的是数组
  if (
    elements == null ||
    Object
    .prototype
    .toString
    .call(elements)
    .slice(8, -1)
    .toLowerCase() !== 'array' ||
    !elements.length) return ''
  const Q = new Queue()
  const { length } = elements
  for (let i = 0; i < length; ++i) {
    Q.enQueue(elements[i])  
  }
  while (Q.size() > 1) {
    for (let i = 0; i < num; ++i) {
      Q.enQueue(Q.deQueue())
    }
    Q.deQueue()
  }
  return Q.deQueue() // 最后一个小盆友
}

let Persons = [
  '张三',
  '李四',
  '小明',
  '王二',
  '李华',
  '韩梅梅'
]

let lastPerson = game(Persons, 3)

```
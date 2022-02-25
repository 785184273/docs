---
title: 双端队列
date: 2021-06-03
---

## 概念
双端队列是一种允许我们**同时从队列的前端和后端添加和移除元素**的特殊队列

现实中的例子：电影院和餐厅中排队的队伍（排在队列前端的可以直接进入电影院，排在队列末尾的人觉得前面的人太多了不想排，很任性，也可以直接选择不看，离开队伍）

## 方法
* addFront(element)：该方法在双端队列前端添加新的元素
* addBack(element)：该方法在双端队列后端添加新的元素
* removeFront()：该方法会从双端队列前端移除第一个元素并返回
* removeBack()：该方法会从双端队列后端移除第一个元素并返回
* peekFront()：该方法返回双端队列前端的第一个元素
* peekBack()：该方法返回双端队列后端的第一个元素
* toString()：相当于数组的toString()方法
* isEmpty()：判断双端队列中是否存在元素，如果存在则返回true，否则返回false
* clear()：清空双端队列的所有元素
* size()：返回双端队列元素的个数，和数组的length属性类型

## 实现
``` js
class Deque {
  constructor () {
    this._items = {}
    this._lowestCount = 0
    this._count = 0
  }

  addFront (element) {
    if (this.isEmpty()) {
      this.addBack(element)
    } else if (this._lowestCount > 0) {
      this._lowestCount--
      this._items[this._lowestCount] = element
    } else {
      let i = this._count
      while (i > 0) {
        this._items[i] = this._items[i - 1]
        i--
      }
      this._count++
      this._lowestCount = 0
      this._items[0] = element
    }
  }

  addBack (element) {
    this._items[this._count++] = element
  }

  removeFront () {
    if (this.isEmpty()) return undefined
    const item = this._items[this._lowestCount]
    delete this._items[this._lowestCount]
    this._lowestCount++
    return item
  }

  removeBack () {
    if (this.isEmpty()) return undefined
    const item = this._items[this._count - 1]
    delete this._items[this._count - 1]
    this._count--
    return item
  }

  peekFront () {
    return this._items[this._lowestCount]
  }

  peekBack () {
    if (this.isEmpty()) return undefined
    return this._items[this._count - 1]
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
### 回文检查器
> **回文是正反都能读通的单词、词组、数或一系列字符的序列，例如：wow或madam**

* 最简单的检查方式就是将字符串反向排列并检查它和原字符是否相等：
``` js
function palindromeChecker (str) {
  const lowerStr = str.toString().replace(/\s+/g, '').toLowerCase()
  const newStr = [...lowerStr].reverse().join('')
  return lowerStr === newStr
}
```
* 使用双端队列：
``` js
function palindromeChecker (str) {
  const lowerStr = str.toString().replace(/\s+/g, '').toLowerCase()
  const { length } = lowerStr
  const DQ = new Deque()
  for (let i = 0; i < length; ++i) {
    DQ.addBack(lowerStr.charAt(i)) // 每个字符都添加到双端队列中
  }
  let isEqual = true
  let firstChar
  let lastChar
  while (isEqual && DQ.size() > 1) {
    firstChar = DQ.removeFront()
    lastChar = DQ.removeBack()
    if (firstChar != lastChar) {
      isEqual = false
    }
  }
  return isEqual
}
```
* 也可以使用栈实现



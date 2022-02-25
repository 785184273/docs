---
title: 链表
date: 2021-06-03
---

## 前言

存储多个元素，数组（或对象）可能是最常用的数据结构，然而数组存在一个缺点：数组的大小是固定的，从数组的起点或中间插入或移除项的成本很高，因为需要移动元素


## 概念
链表是存储有序的元素集合，但是不同于数组，链表中的元素在内存中并不是连续放置的。每个元素由一个存储元素本身的节点和一个指向下一个元素的引用组成
![链表](/img/linkedList1.jpg)

相对于传统的数组，链表的好处是，添加或删除元素的时候不需要移动其他元素，然而，链表需要使用指针

::: tip 提示
在数组中我们可以直接访问任何位置的任何元素，而要想访问链表中间的一个元素，则需要从起点开始迭代链表直到找到所需要的元素
:::

现实中的例子：火车每节的车厢、手拉手的一个长队伍

## 方法
* push(element)：向链表尾部添加新元素
* insert(element, index)：向链表的特定位置插入新元素
* getElementAt(index)：返回表中特定位置的元素，如果不存在这样的位置则返回undefined
* remove(element)：从链表中移除一个元素
* indexOf(element)：返回元素在链表中的索引，如果没有该元素则返回-1
* removeAt(position)：从链表的特定位置移除一个元素
* isEmpty()：如果链表中不包含任何元素，则返回true，否则返回false
* size()：返回链表包含的元素个数，和数组的length属性类似
* toString()：返回整个链表的字符串，相当于数组的toString()方法


### 实现
``` js
  class Node {
    constructor (element) {
      this.value = element
      this.next = undefined
    }
  }

  class LinkedList {
    constructor () {
      this._head = head
      this._count = 0 // 用于记录链表的长度
    }

    // 向链表的尾部添加元素
    push (element) {
      const node = new Node(element)
      if (this.isEmpty()) {
        // 如果链表不存在元素
        this._head = node
      } else {
        // 如果存在则依次递归
        let current = this._head
        while (current.next != null) {
          current = current.next
        }
        current.next = node
      }
      this._count++ 
    }

    // 向链表中插入新元素
    insert (element, index = 0) {
      if (index >= 0 && index <= this._count) {
        const node = new Node(element)
        if (index === 0) { // 如果是在头部插入
          const current = this._head
          node.next = current
          this._head = node
        } else {
          const previous = this.getElementAt(index - 1)
          const current = previous.next
          previous.next = node
          node.next = current
        }
        this._count++
        return true
      }
      return false
    }

    // 返回链表中指定位置的元素
    getElementAt (index) {
      if (index >= 0 && index < this._count) {
        let node = this._head
        let i = 1
        while (i <= index) {
          node = node.next
          i++
        }
        return node
      }
      return undefined
    }

    // 从链表中删除一个元素
    remove (element) {
      const index = this.indexOf(element)
      return this.removeAt(index)
    }

    // 返回元素在链表中的索引
    indexOf (element) {
      if (this._count > 0) {
        let current = this._head
        for (let i = 0; i < this._count; ++i) {
          if (current.value === element) return i
          current = current.next
        }
      }
      return -1
    }

    // 从链表的指定位置移除一个元素
    removeAt (index) {
      if (index >= 0 && index < this._count) {
        let current = this._head
        if (index === 0) {
          this._head = current.next          
        } else {
          const previous = this.getElementAt(index - 1)
          current = previous.next
          previous.next = current.next
        }
        this._count--
        return current.value
      }
      return undefined
    }

    // 判断是否为空
    isEmpty () {
      return this.size() === 0
    }

    // 链表元素个数
    size () {
      return this._count
    }

    // toString
    toString () {
      if (this._head == null) {
        return ''
      }
      let current = this._head
      let string = `${current.value}`
      for (let i = 1; i < this._count; ++i) {
        current = current.next
        string = `${string},${current.value}`
      }
      return string
    }
  }
```
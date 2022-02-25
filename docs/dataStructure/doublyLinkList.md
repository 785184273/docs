---
title: 双向链表
date: 2021-06-03
---

双向链表和普通链表的区别在于，在链表中一个节点只有链向下一个节点的链接，而在双向链表中，链接是双向的，一个链向下一个元素，另一个链向前一个元素

如图所示：
![双向链表](/img/doublyLinkedList1.jpg)

## 实现
``` js
  class Node {
    constructor (element) {
      this.value = element
      this.next = undefined
    }
  }
  
  class LinkedList {
    constructor () {
      this._head = undefined
      this._count = 0
    }
    /*
      ...
    */
  }

  // 继承单向链表Node
  class DoublyNode extends Node {
    constructor (element) {
      super(element)
      this.prev = undefined
    }
  }

  // 继承单向链表LinkedList
  class DoublyLinkedList extends LinkedList {
    constructor () {
      super()
      // _tail引用最后一个元素
      this._tail = undefined
    }

    // 双向链表添加元素
    push (element) {
      const node = new DoublyNode(element)
      if (this.isEmpty()) {
        // 如果链表不存在元素
        this._head = node
        this._tail = node
      } else {
        // 如果存在则依次递归
        let current = this._head
        while (current.next != null) {
          current = current.next
        }
        current.next = node
        node.prev = current
        this._tail = node
      }
      this._count++ 
    }
    
    // 向双向链表插入新元素
    insert (element, index = 0) {
      if (index >= 0 && index <= this._count) {
        const node = new DoublyNode(element)
        if (index === 0) { // 如果是在头部插入
          if (this._count === 0) { // 如果只有一个元素
            this._head = node
            this._tail = node
          } else {
            const current = this._head
            current.prev = node
            node.next = current
            this._head = node
          }
        } else if (index = this._count - 1) { // 插入最后一个位置
          const current = this._tail
          current.next = node
          node.prev = current
          this._tail = node 
        } else { // 插入链表的中间
          const previous = this.getElementAt(index - 1)
          const current = previous.next
          previous.next = node
          node.next = current
          node.prev = previous
          current.prev = node
        }
        this._count++
        return true
      }
      return false
    }
  }
```
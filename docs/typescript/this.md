# class

> **[ts中this部分详细解释请参看](https://zhuanlan.zhihu.com/p/104565681)**


## this参数
在方法或函数定义中，this参数在ts中有特殊意义。这些参数在编译过程中被删除
```ts
function foo (this: bar, x: number) {
  // ...
}
// 会被编译为
function foo (x) {
  // 
}
```
ts检查使用this参数调用函数是否在正确的上下文中完成。我们不需要使用箭头函数，而是可以向方法定义中添加this参数，以静态地强制正确调用方法：
```ts
class Base {
  public name: string = 'zhangsan'
  getName (this: Base) {
    return this.name
  }
}
const b = new Base()
const g = b.getName
console.log(g()) // 类型为“void”的 "this" 上下文不能分配给类型为“Base”的方法的 "this"
```
必须要在正确的this上下文中调用
```ts
b.getName()
```
和在class中使用箭头函数相比：
1. **this参数定义的方法是存在于类的原型上，而不是类的实例上**
2. **this参数定义的方法可以通过super调用（因为是定义在类的原型上，所以可以使用super）**

## this类型
在类中，this的特殊类型动态地引用当前类的类型
```ts
class Box {
  contents: string = ''
  set (value: string) {
    this.contents = value
    return this
  }
  sameAs (other: this) {
    return other.contents === this.contents
  }
}
class Person extends Box {
  clear () {
    this.contents = ''
  }
}
var b = new Box() // b 为 Box类型
var _b = new Box() // _b 为 Box类型
const bb = b.set('123')
bb.sameAs(_b)


var p = new Person() // p 为 Person类型
var _p = new Person() // p 为 Person类型
const pp = p.set('123')
pp.sameAs(_p)
```
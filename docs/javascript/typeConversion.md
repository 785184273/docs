# 类型转换

## ToString
> **负责处理非字符串到字符串的强制类型转换**

**转化规则为：**

1. **null转换为"null"**
2. **undefined转换为"undefined"**
3. **true转换为"true"**
4. **一般的数字则转换为正常的数值字符串，但是那种极大极小的数则转换为指数形式**
5. **对于普通对象来说除非自行定义（如果对象有自己的toString()方法，字符串化时就会调用该方法并使用其返回的值），否则返回"[object Object]"**
6. **数组的默认toString()方法经过了重新定义，将所有的单元字符串化后再用“，”连接起来，也可以自己重新定义toString()方法**
```js
null + '' === 'null' // true
undefined + '' === 'undefined' // true
true + '' === 'true' // true
10 + '' === '10' // true
10 ** 100 + '' === '1e+100'
'' + {} === '[object Object]' // true
[1, 2, 3] + '' ==== '1,2,3' // true

// 自行定义toString ---- 需要特别注意
var a = [1, 2, 3]
a.toString = function () {
  return 123
}
a + '' === '123' // true
var obj = {}
obj.toString = function () {
  return 'hello'
}
obj + '' === 'hello' // true
```
## ToPrimitive
为了将值转换为相应的基本类型值，抽象操作ToPrimitive会首先检查该值是否有valueOf()方法。如果有并且返回基本类型值，就使用该值进行强制类型转换，如果没有就使用toString()方法的返回值来进行强制类型转换

如果valueOf()和toString()均不返回基本类型值，会产生TypeError错误

::: warning 注意
  使用Object.create(null)创建的对象是没有原型对象的，所以不能直接转换，不过我们可以在对象实例上自行添加valueOf()方法和toString()方法
:::

## ToNumber
> **负责处理非数字值转换为数值**

**转换规则为：**

1. **true转换为1**
2. **false转换为0**
3. **undefined转换为NaN**
4. **null转换为0**
5. **对字符串的处理基本上遵循数字常量的相关规则，处理失败时返回NaN**
6. **关于对象（包含数组）则首先会根据ToPrimitive抽象操作转换为相应的基本类型值，如果返回的是非数字的基本类型，则再遵循上面的规则转换为数字**
```js
+true === 1 // true
+false === 0 // true
Number.isNaN(+undefined) // NaN
+null === 0 // true
Number.isNaN(+[1, 2, 3]) // true, 先根据ToPrimitive操作转换为字符串'1,2,3'，再根据'1,2,3'转换为失败数值NaN
Number.isNaN(+{}) // true 先根据ToPrimitive操作转换为字符串[object Object]，再根据[object Object]转换为失败数值NaN

// 自行定义toString
var a = [1, 2, 3]
a.toString = function () {
  return 123
}
123 === +a // true
var obj = {}
obj.toString = function () {
  return true
}
1 === +obj // true
var objN = Object.create(null)
objN.toString = function () {
  return false
}
0 === +objN // true
```
## ToBoolean
> 负责非布尔值到布尔值的转换

js中可以分为以下两类：
1. 可以被强制类型转换为false的值
2. 其它（被强制类型转换为true的值）

### 假值
js中具体定义了一小撮可以被强制类型转换为false的值

以下是假值falsy
* undefined
* null
* false
* +0, -0和NaN
* ""
::: tip 提示
  假值的布尔强制类型转换结果为false

  按常理来说，假值列表以外的都应该是真值，但是js规范中没有明确的定义，只是给了一些示例，例如
  **所有的对象都是真值，可以理解为假值列表以外的值都是真值**
:::

```js
var a = new Boolean(false)
var b = new Boolean(0)
var c = new Boolean('')
!!a // true
!!b // true
!!c // true
```
上例中都是封装了假值的对象，但是对象都是真值，所以转换为布尔类型则都为true
### 真值
**真值就是假值列表以外的值**。例如：
```js
var a = 'false'
var b = '0'
var c = "''"
!!a // true
!!b // true
!!c // true
```
## 显式强制类型转换
显示强制类型转换是指很明显的类型转换

### 字符串和数字之间的显示转换
> 字符串和数字之间的转换是通过String()和Number()这两个内建函数实现
```js
  var a = 42
  var b = String(42) // '42'

  var c = '3.14'
  var d = Number(c) // 3.14
```
::: tip 提示
  String()遵循ToString规则，Number()遵循ToNumber规则
:::
> 除了String()和Number()之外，还有其他方法可以实现字符串和数字之间的显示转换

```js
  var a = 12
  var b = a.toString() // '12'

  var c= '3'
  var d = +c // 3
```
::: tip 提示
  不能使用42.toString()，要么使用变量，要么在42..toString()，多加一个点（.）
:::

### 显示转换为布尔值
> 从非布尔值转换为布尔值使用Boolean()
```js
  var a = '0'
  var b = []
  var c = {}
  var d = ''
  var e = 0
  var f = null
  var g = undefined
  Boolean(a) // true
  Boolean(b) // true
  Boolean(c) // true
  Boolean(d) // false
  Boolean(e) // false
  Boolean(f) // false
  Boolean(g) // false
```
::: tip 提示
 虽然Boolean()是显示的，但是并不常用，**一元运算符（!）显示的将值强制类型转换为布尔值（将真值反转为假值，假值反转为真值），!!会将反转的结果再反转回原值**
:::
```js
  var a = '0'
  var b = []
  var c = {}
  var d = ''
  var e = 0
  var f = null
  var g = undefined
  !!a // true
  !!b // true
  !!c // true
  !!d // false
  !!e // false
  !!f // false
  !!g // false
```
## 隐式强制类型转换
隐式类型转换是指比较隐蔽的类型转换

### 字符串和数字之间的隐式转换
**（+）运算符既能用于数字加法，也能用于字符串拼接**
::: tip 提示
  如果某个操作数是字符串或者能够通过以下步骤转换为字符串的话，+将进行拼接操作，如果其中一个操作数是对象（包括数组），则首先对其调用ToPrimitive抽象操作，该抽象操作再调用[[DefaultValue]]，以数字作为上下文

  简单来说就是，如果+的其中一个操作数是字符串（或者通过以上步骤可以得到字符串），则只需字符串拼接，否则执行数字加法
:::
```js
true + 0 === 1 // 执行加法操作，true转化为1
false + 0 === 0 // 同理false转为0
null + 0 === 0 // null转为0
[1, 2] + [3, 4] === '1,23,4' // 根据ToPrimitive抽象操作进行转换，转为字符串1,2和3,4进行拼接
// 如果是对象
var a = {
  valueOf () {
    return 12
  },
  toString () {
    return 11
  }
}
a + '' // 12
String(a) // 11
```
**（-）运算符能将字符串强制转换为数字, 也可以使用（*）a * 1或（/）a / 1**
```js
  var a = '3.14'
  var b = a - 0
  b // 3.14
```
::: tip 提示
对象的-和+类似，为了执行减法运算，会首先会被转为字符串，然后再转化为数字
:::

## 符号的强制类型转换
::: tip 提示
es6允许从符号到字符串的显示强制类型转换，隐式强制类型转换会发生错误

符号不能够被强制类型转换为数字（显示和隐式都会报错），但可以被强制类型转换为布尔值（显示和隐式结果都为true）
:::
```js
var a = Symbol('a')
String(a) // 'Symbol(a)'
Boolean(a) // true
!!a // true
!a // false

a + '' // TypeError
Number(a) // TypeError
a - 0 // TypeError
```

## 宽松相等和严格相等
宽松相等（==）和严格相等（===）都用来判断两个值是否相等，但是他们之间有一个很重要的区别
::: warning 注意
**==允许在相等比较中进行强制类型转换（两个不同类型值的时候），而===不允许**
:::
### 字符串和数字之间的相等比较（==）
```js
var a = 42
var b = '42'
a === b // false
a == b // true
```
应为没有强制类型转换，所有a === b为false，42和“42”不相等，而a == b是宽松相等，即如果两个值的类型不同，会对其中一个或两者都进行强制类型转换
* 如果x是数字，y是字符串，则返回x == ToNumber(y)的结果
* 如果x是字符串，y是数字，则返回ToNumber(x) == y的结果
### 其它类型和布尔类型之间的相等比较（==）
```js
var a = '42'
var b = true
a == b // false
```
* 如果x是布尔类型，则返回y == ToNumber(x)的结果
* 如果y是布尔类型，则返回ToNumber(y) == x的结果

上例中会将true转换为1，再进行1 == '42'的比较，类型也不相同，再根据数字和字符串之间相等比较的规则进行转换为1 == 42，结果为false

反过来也一样
```js
var a = '42'
var b = false
a == b // false
```
会将false转为0，然后'42' == 0再变成 42 == 0，结果为false
### null和undefined之间的相等比较（==）
null和undefined之间的==也涉及隐式强制类型转换
* 如果x为null，y为undefined，则结果为true
* 如果x为undefined，y为null，则结果为true

**在==中null和undefined相等（它们也与其自身相等），除此之外其他值都不和它们两个相等**
```js
var a = null
var b // 声明一个变量，但是未赋值，相当于直接赋值为undefined

a == b // true
a == null // true
b == null // true

a == false // false
b == false // false
a == '' // false
b == '' // false
a == 0 // false
b == 0 // false
```
### 对象和非对象之间的相等比较
* 如果x为字符串或数字，y为对象，则返回x == ToPrimitive(y)的结果
* 如果x为对象，y为字符串或数字，则返回ToPrimitive(x) == y的结果
```js
var a = 12
var b = [12]

a == b // true
```
[12]首先调用ToPrimitive抽象操作，返回‘12’，再将其转为数字12，结果返回true

**我们也可以自定义valueOf方法从复杂的数据结构中返回一个简单值进行比较**
```js
var a = function () {}
a.valueOf = function () { return 12 }
var b = 12
a == b // true
```
### 少见的情况
更改内置原生原型
```js
Number.prototype.valueOf = function () {
  return 3
}
new Number(2) == 3 // true
```
更诡异的
```js
var i = 2
Number.prototype.valueOf = function () {
  return i++
}
var a = new Number(3)
if (a == 2 && a == 3) {
  console.log('鬼故事开始了....') // 会走到这一步
}
```
a == 2 和 a == 3会触发强制类型转换，涉及ToPrimitive抽象操作
```js
[] == ![] // true ([] == false) => ('' == 0) => (0 == 0) 
```
[]为真值，取反则为false，变为 [] == false，再根据前面其它类型和布尔类型之间的相等比较和对象和非对象的相等比较，过程演变为([] == false) => ('' == 0) => (0 == 0) 
```js
[] + {} == '[object Object]' // true ('' + '[object Object]')
{} + [] == 0 // true
```
第二行{}被当做一个独立的空代码块（不执行任何操作），代码块的结尾不需要分号，所以不存在语法问题，最后 + []将[]显示强制类型转换为0
### 假值的相等比较
```js
'0' == null // false
'0' == undefined // false
'0' == false // true ('0' == 0) => (0 == 0)
'0' == NaN // false
'0' == 0 // true 0 == 0
'0' == '' // false

 false == null // false
 false == undefined // false
 false == NaN // false
 false == 0 // true 0 == 0
 false == '' // true 0 == 0
 false == [] // true (0 == '') => (0 == 0)
 false == {} // false

 '' == null // false
 '' == undefined // false
 '' == NaN // false
 '' == 0 // true
 '' == [] // true [] => ''
 '' == {} // false {} => '[object Object]'

 0 == null // false
 0 == undefined // false
 0 == NaN // false
 0 == [] // true [] => '' => 0
 0 == {} // false
```

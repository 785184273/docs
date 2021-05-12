# 类型转换

## ToString
> **负责处理非字符串到字符串的强制类型转换**

**基本类型的字符串转化规则为：**

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
10 *** 10 + '' === '1e+100'
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

## ToNumber
> **负责处理非数字值转换为数值**

**转换规则为：**

1. **true转换为1**
2. **false转换为0**
3. **undefined转换为NaN**
4. **null转换为0**
5. **对字符串的处理基本上遵循数字常量的相关规则，处理失败时返回NaN**
6. **关于对象（包含数组）则首先会转换为相应的基本类型值，如果返回的是非数字的基本类型，则再遵循上面的规则转换为数字**
::: warning 注意
  为了将值转换为相应的基本类型值，抽象操作ToPrimitive会首先检查该值是否有valueOf()方法。如果有并且返回基本类型值，就使用该值进行强制类型转换，如果没有就使用toString()方法的返回值来进行强制类型转换

  如果valueOf()和toString()均不返回基本类型值，会产生TypeError错误

  使用Object.create(null)创建的对象是没有原型对象的，所以不能直接转换，不过我们可以在对象实例上自行添加valueOf()方法和toString()方法
:::
```js
+true === 1 // true
+false === 0 // true
+undefined === NaN // true
+null === 0 // true
+[1, 2, 3] === NaN // true, 先根据ToPrimitive操作转换为字符串'1,2,3'，再根据'1,2,3'转换为失败数值NaN
+{} === NaN // true 先根据ToPrimitive操作转换为字符串[object Object]，再根据[object Object]转换为失败数值NaN

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
  **所有的对象都是真值，可以理解为列表以外的值都是真值**
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
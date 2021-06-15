# 枚举
枚举类型用于取值被限定在一定范围内的场景

枚举使用enum关键字来定义，ts支持数字和基于字符串的枚举

## 数字枚举
声明一个枚举类型，如果没有赋值，它们的值默认为数字类型且从 0 开始累加，同时也会对枚举值到枚举名进行反向映射
```ts
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
console.log(Days["Sun"] === 0) // true
console.log(Days["Mon"] === 1) // true
console.log(Days["Tue"] === 2) // true
console.log(Days["Sat"] === 6) // true

console.log(Days[0] === "Sun") // true
console.log(Days[1] === "Mon") // true
console.log(Days[2] === "Tue") // true
console.log(Days[6] === "Sat") // true
```
## 字符串枚举
```ts
enum TokenType {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken'
}
// 两种不同的取值写法
console.log(TokenType.ACCESS === 'accessToken')        // true
console.log(TokenType['REFRESH'] === 'refreshToken')   // true
```
**<i>数字类型和字符串类型可以混合使用，但是不建议</i>** ：
```ts
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```
## 反向映射
反向映射就是指枚举的取值，不但可以正向的 Months.Jan 这样取值，也可以反向的 Months[1] 这样取值。
```ts
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}
```
将上面的代码进行编译，查看编译后的 JavaScript 代码：
```js
'use strict'
var Months;
(function (Months) {
  Months[Months['Jan'] = 1] = 'Jan'
  Months[Months['Feb'] = 2] = 'Feb'
  Months[Months['Mar'] = 3] = 'Mar'
  Months[Months['Apr'] = 4] = 'Apr'
})(Months || (Months = {}))
```
通过查看编译后的代码，可以得出：
```ts
console.log(Months.Mar === 3) // true
// 那么反过来能取到 Months[3] 的值吗？
console.log(Months[3])  // 'Mar'
// 所以
console.log(Months.Mar === 3)     // true
console.log(Months[3] === 'Mar')  // true
```
Tips:
1. 字符串枚举成员不会生成反向映射。
2. 枚举类型被编译成一个对象，它包含了正向映射（ name -> value）和反向映射（ value -> name）。
## 枚举合并
分开声明名称相同的枚举类型，会自动合并：
```ts
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}
enum Months {
  May = 5,
  Jun
}
console.log(Months.Apr) // 4
console.log(Months.Jun) // 6
```
 编译后的 JavaScript 代码
```js
'use strict'
var Months;
(function (Months) {
  Months[Months['Jan'] = 1] = 'Jan'
  Months[Months['Feb'] = 2] = 'Feb'
  Months[Months['Mar'] = 3] = 'Mar'
  Months[Months['Apr'] = 4] = 'Apr'
})(Months || (Months = {}));
(function (Months) {
  Months[Months['May'] = 5] = 'May'
  Months[Months['Jun'] = 6] = 'Jun'
})(Months || (Months = {}))
console.log(Months.Apr) // 4
console.log(Months.Jun) // 6
```
## 运行时枚举
枚举是运行时存在的真实对象。例如，以下枚举
```ts
enum E {
  X,
  Y,
  Z,
}
```
实际上可以传递给函数
```ts
enum E {
  X,
  Y,
  Z,
}
function f(obj: { X: number }) {
  return obj.X
}
f(E)
```
## 手动赋值
```ts
// 从第一个数字赋值，往后依次累加
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}
Months.Jan === 1 // true
Months.Feb === 2 // true
Months.Mar === 3 // true
Months.Apr === 4 // true
```
会被编译为：
```js
var Months;
(function (Months) {
    Months[Months["Jan"] = 1] = "Jan";
    Months[Months["Feb"] = 2] = "Feb";
    Months[Months["Mar"] = 3] = "Mar";
    Months[Months["Apr"] = 4] = "Apr";
})(Months || (Months = {}));
```
## 常数项和计算所得项
枚举项有两种类型：
* 常数项
* 计算所得项
### 计算所得项
一个典型的计算所得项的例子
```ts
enum Color { Red, Green, Blue = 'blue'.length }
```
上面的例子不会报错，但是如果紧跟计算项后面的是未手动赋值的项，那么就会因为无法或得初始值而报错
```ts
enum Color { Red, Green, Blue = 'blue'.length, Yellow } // Enum member must have initializer.
```
### 常数项
当满足以下条件时，枚举成员会被当做是常数
* 不具有初始化函数并且之前的枚举成员是常数，在这种情况下，当前枚举成员的值，是上一个枚举成员的值加1，但第一个枚举成员是例外，如果它没有初始化方法，那么它的初始值为0
* 枚举成员使用常数枚举表达式初始化，常数枚举表达式是ts表达式的子集，它可以在编译阶段求值，当一个表达式满足下面条件之一，它就是一个常数枚举表达式：
* 数值字面量
* 引用之前定义的常数枚举成员(可以是在不同的枚举类型中定义的)如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用
* 带括号的常数枚举表达式
* +，-，~一元运算符应用于常数枚举表达式
* +, -, *, /, %, <<, >>, >>>, &, |, ^ 二元运算符，常数枚举表达式做为其一个操作对象。若常数枚举表达式求值后为 NaN 或 Infinity，则会在编译阶段报错

所有其它情况的枚举成员被当作是需要计算得出的值
```ts
enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
```
* 枚举是在运行时，真正存在的一个对象，其中一个原因是因为这样可以从枚举值到枚举名进行反向映射
```ts
enum Enum {
    A
}
let a = Enum.A
let nameOfA = Enum[a] // "A"
// 编译成
var Enum
(function (Enum) {
    Enum[Enum["A"] = 0] = "A
})(Enum || (Enum = {}))
var a = Enum.A
var nameOfA = Enum[a] // "A"
```
## 常数枚举 -- 常量枚举
常数枚举是使用const enum定义的枚举类型

**常数枚举只能使用常数枚举表达式并且不同于常规的枚举的是它们在编译阶段会被删除，常数枚举成员在使用的地方被内联进来，这是因为常数枚举不可能拥有计算成员**
```ts
const enum Directions {
  Up,
  Down,
  Left,
  Right
}
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```
常数枚举和普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员，编译结果为：
```js
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```
假如包含计算成员则会在编译阶段报错
```ts
const enum Color { Red, Green, Blue = "blue".length } //  const enum member initializers can only contain literal values and other computed enum values.
```

## 外部枚举
外部枚举是使用declare enum定义的枚举类型
外部枚举用于描述已经存在的枚举类型的形状
```ts
declare enum Directions {
  Up,
  Donw,
  Right,
  Left
}
let directions = [ Directions.Up, Directions.Down, Directions.Left, Directions.Right ]
```
declare定义的类型只会用于编译时的检查，编译结果中会被删除，上面会被编译为：
```js
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```
外部枚举和声明语句一样，常出现在声明文件中
同时使用declare和const也是可以的
```ts
declare const enum Directions {
    Up,
    Down,
    Left,
    Right
}
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```
编译结果为
```js
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */]
```
# 概述
有时我们想在for循环内部定义的setTimeout中获取每次迭代的i的值，但是想法很美好，事实却不尽人意

for循环最常见的例子：
```js
  for (var i = 0; i < 5; ++i) {
    setTimeout(function () {
      console.log(i) // 5 次 5
    }, 0)
  }
```
根据作用域的工作原理，尽管循环中的5个函数是在每次迭代中分别定义，但是他们都被封闭在一个共享的作用域中，因此实际上只有1个i，所有函数共享一个i的引用

## let
let关键字可以将变量绑定到所在的任意作用域中（通常是{...}内部），换句话说，let为其声明的变量隐式的劫持了所在的块作用域

::: tip 提示
  块作用域指的是变量和函数不仅可以属于所处的作用域，也可以属于某个代码块（通常指{...}内部）
:::

### 循环
```js
  for (let i = 0; i < 3; ++i) {
    console.log(i) // 1 2 3
  }
```
> for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中（就是说每个迭代中都有保留一个单独的i），确保使用上一个循环迭代结束的值重新进行赋值

概述中的例子可以改为：
```js
  for (var i = 0; i < 5; ++i) {
    let j = i // 每个块中都定义了一个独立的变量j
    setTimeout(function () {
      console.log(j) // 1 2 3 4 5
    }, 0)
  }
  // 或者
  for (let i = 0; i < 5; ++i) {
    setTimeout(function () {
      console.log(i) // 1 2 3 4 5
    }, 0)
  }
```
## 闭包
当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外
> 在javascript高级程序设计第三版中对闭包的定义为：有权访问另一函数作用域中变量的函数

看一个闭包的例子：
```js
  function foo () {
    var a = 2
    function bar () {
      console.log(a)
    }
    return bar
  }
  var baz = foo()
  baz() // 2
```
函数bar()的词法作用域能够访问函数foo()的内部作用域，然后将bar()函数本身当做一个值类型进行传递，**这个函数bar()在定义时的词法作用域以外的地方被调用，闭包使得函数可以继续访问定义时的词法作用域**
```js
  var fn
  var a = 3
  function foo () {
    var a = 2
    function baz () {
      console.log(a)
    }
    fn = baz // 将baz分配给全局变量
  }
  function bar () {
    fn()
  }
  foo()

  bar() // 2
```
::: tip 提示
  无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包
::: 
```js
  function delay (msg) {
    setTimeout(function timer () {
      console.log(msg) // delay
    }, 1000)
  }
  delay('delay')
```
将一个内部函数timer传递给setTimeout()，timer具有函数delay()作用域的闭包，因此保有对变量msg的引用

delay()执行1000毫秒后，它的内部作用域并不会消失，timer函数依然保有delay()的闭包

概述中的例子可以改写为：
```js
for (var i = 0; i < 5; ++i) {
  (function (j) {
    setTimeout(function () {
      console.log(j)
    }, 0)
  })(i)
}
```
在每次迭代中都会生成一个新的作用域，每个迭代中都会包含一个变量（j）供我们访问

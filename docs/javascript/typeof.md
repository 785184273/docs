::: warning 注意
在查询值类型的时候，一般都会使用typeof运算符，但是返回类型往往会和我们所想有所出入

js中五种基本数据类型为null，undefined，boolean，string，number
:::

```js
typeof null === 'object' // true, 并不是null

typeof function () {} === 'function' // true, function也并不在7种数据类型当中
```

::: tip 提示
我们可能需要更加精确的类型，可以使用Object.prototype.toString.call()
:::

```js
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(123) // "[object Number]"
Object.prototype.toString.call('hello') // "[object String]"
Object.prototype.toString.call([1]) // "[object Array]"
Object.prototype.toString.call(function () {}) // "[object Function]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call(Symbol.iterator) // "[object Symbol]"
```
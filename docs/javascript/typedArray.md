---
title: TypedArray定型数组与二进制数据
categories:
 - 零碎点
tags:
 - js
---

## ArrayBuffer
`ArrayBuffer`对象代表存储在内存中的一段二进制数据，它不能直接读写，只能通过视图(`TypedArray`视图和`DataView`视图)来读写，视图的作用是以指定的格式解读二进制数据

`ArrayBuffer`是一个构造函数，分配一段可以存放数据的连续内存区域
```js
const buf = new ArrayBuffer(10)
```
`ArrayBuffer`构造函数的参数是所需的内存大小(单位: 字节)，上面代码生成一段10字节的内存区域，每个字节的默认值都是0

### ArrayBuffer.prototype.byteLength
`ArrayBuffer`实例的`byteLength`属性，返回所分配内存区域的字节长度
```js
const buf = new ArrayBuffer(10)
buf.byteLength // 10
```
### ArrayBuffer.prototype.slice()
`ArrayBuffer`实例的`slice`方法，允许将内存的一部分区域，拷贝生成一个新的`ArrayBuffer`对象
```js
const buf = new ArrayBuffer(10)
const newBuf = buf.slice(0, 3)
```
`slice`方法和`Array.prototype.slice`方法参数一样都是两个参数，第一个参数表示拷贝开始的字节序号，第二个参数表示拷贝截止的字节序号(不含该字节)，如果省略第二个参数，则默认到原`ArrayBuffer`对象的结尾

### ArrayBuffer.isView()
`isView`是`ArrayBuffer`的静态方法，返回一个布尔值，判断参数是否为`ArrayBuffer`的视图实例，例如: `TypedArray`实例或`DataView`实例。
```js
const buf = new ArrayBuffer(10)
ArrayBuffer.isView(buf) // false

const Int = Int8Array.of(1, 2, 3)
ArrayBuffer.isView(Int) // true
```

## TypedArray(定型数组)

定型数组最初在浏览器支持`WebGL`图形时就引入了客户端`javaScript`，只是到ES6才被提升为核心语言特性。
定型数组严格来讲并不是数组(`Array.isArray()`对它们返回`false`)，但它们实现了数组了大部分方法(改变数组元素个数的方法例外，比如`push()`, `pop()`, `unshift()`, `shift()`, `splice()`等方法除外，但实现了修改数组内容而不改变长度的方法如`sort()`, `reverse()`和`fill()`, 诸如`map()`和`slice()`等返回新数组的方法)，外加它们自己的方法，定型数组和常规数组存在如下几个非常重要的区别。

* 定型数组的元素全部都是数值，与常规js数组不同，定型数组允许指定存储在数组中的数值的类型(有符号和无符号数组以及IEEE-754浮点数)和大小(8-64位)
* 创建定型数组时必须指定长度，且该长度不能再改变
* 定型数组的元素在创建时始终都会被初始化为0

`TypedArray`视图一共有11种类型，每一种视图都是一种构造函数
* -`Int8Array`: 有符号8位整数 长度1个字节
* -`Uint8Array`: 无符号8位整数 长度1个字节
* -`Uint8ClampedArray`: 无符号8位字节(上溢不归零) 长度1个字节
* -`Int16Array`: 有符号16位短整数 长度2个字节
* -`Uint16Array`: 无符号16位短整数 长度2个字节
* -`Int32Array`: 有符号32位整数 长度4个字节
* -`Uint32Array`: 无符号32位整数 长度4个字节
* -`BigInt64Array`: 有符号64位BigInt值 长度8个字节
* -`BigUInt64Array`: 无符号64位BigInt值 长度8个字节
* -`Float32Array`: 32位浮点数 长度4个字节
* -`Float64Array`: 64位浮点数 长度8个字节 常规js数值

名字以`Int`开头的类型保存有符号1、2、4字节(8、16、32位)整数。名字以`Uint`开头的类型保存相同长度的无符号整数。`BigInt`和`BigUint`类型保存64位整数，以`js`的`BigInt`值表示。名字以`Float`开头的类型保存浮点数。`Float64Array`的元素与常规`js`数值是同一种类型。`Float32Array`的元素精度较低，表示的范围也较小，但只是占用一半的内存(这个类型对应`C`和`java`中的`Float`)

`Uint8ClampedArray`是`Uint8Array`的一种特殊变体。这两种类型都保存无符号字节，可表示的数值范围是0到255。对`Uint8Array`来说，如果要存储到数组元素的值大于255或小于0，这个值会“翻转”为其他值。`Uint8ClampedArray`还会额外做一些类型检查，如果你要存储的值大于255或小于0，那它会固定为255或0，不会翻转

### 创建定型数组

* new TypedArray(length)

创建定型数组最简单的方式就是调用相应的构造函数，并传入一个表示数组元素个数的数值参数，以这种方式创建的定型数组，数组元素一定会全部初始化为0、0n或0.0
```js
let bytes = new Uint8Array(10)
```
* TypedArray.of()

该方法和`Array.of()`方法所需参数一致，都需要一个参数序列作为参数
```js
let int = Int8Array.of(1, 2, 3)
```
* TypedArray.from()

该方法和`Array.from()`方法所需参数一致，都需要一个数组或可迭代对象作为参数
```js
let int = Int8Array.from([1, 2, 3])
```
* new TypedArray(buffer [, byteOffset [, length]])

我们知道，`ArrayBuffer`类不允许读取或写入分配的任何字节。但是可以创建使用该缓冲区内存的定型数组，通过这个数组来读取或写入该内存，参数`buffer`代表`ArrayBuffer`类实例，`byteOffset`作为第二个可选参数代表在`buffer`上的字节偏移量，`length`作为第三个可选参数代表数组的长度(单位是元素而非字节)，如果省略第二个和第三个参数，则数组会使用缓冲区的所有内存，如果只省略第三个参数，则数组会使用从起点位置到缓冲区的结束的所有可用内存
```js
const buf = new ArrayBuffer(8)
const int8 = new Int8Array(buf, 0, 4) // 一个参数一个字节
const int16 = new Int16Array(buf, 4, 7) // 一个参数两个字节
```
* new TypedArray(arrayLikeObject)

构造函数的参数也可以是一个普通数组/类数组对象/set，然后直接生成`TypedArray`实例
```js
const int8 = new Int8Array([1, 2, 3, 4])
const int16 = new Int16Array({ 0: 1, 1: 2, length: 1 })
const int32 = new Int32Array(new Set([1, 2, 3, 4]))
```
::: tip 提示
所有定型数组底层都有一个`ArrayBuffer`，即便你没有明确指定。如果调用定型数组构造函数时没有传递缓冲区对象，则会自动以适当大小创建一个缓冲区，所有定型数组都有一个`buffer`属性，引用自己底层的`ArrayBuffer`对象，之所以需要直接使用`ArrayBuffer`对象，是因为有时候可能需要一个缓冲区的多个定型数组视图
:::

### TypedArray.BYTES_PER_ELEMENT
该属性返回定型数组中每个元素所占据的字节数，只读
```js
Int8Array.BYTES_PER_ELEMENT // 1
Int16Array.BYTES_PER_ELEMENT // 2
Int32Array.BYTES_PER_ELEMENT // 4
Float64Array.BYTES_PER_ELEMENT // 8
```

### TypedArray.prototype.set()
该方法用于一次性设置定型数组的多个元素，即把其它常规数组或定型数组的元素复制到当前定型数组中，`set`方法以一个数组或定型数组作为其第一个参数，以一个元素偏移量作为其可选的第二个参数，如果不指定则默认为0
```js
const bytes = new Uint8Array(8)
const int = new Uint8Array([1, 2])

bytes.set(int)
bytes.set([3, 4], 2) // 从偏移量为2的位置开始设置定型数组的值
bytes.set([5, 6, 7, 8], 4) // 从偏移量为4的位置开始设置定型数组的值
```
### TypedArray.prototype.slice()
该方法用于将定型数组的一部分浅拷贝到一个新的定型数组中并返回，该方法并不会改变原数组的内容，该方法的参数和`Array.prototype.slice()`方法一致
```js
const int = new Int8Array([1, 2, 3, 4])
const newInt = int.slice(0, 2)
newInt[0] = 0
int[0] // 1
```
### TypedArray.prototype.subarray()
该方法接收和`slice()`方法相同的参数，而且看起来行为方式也相同，但有一点重要区别：`slice()`以新的、独立的定型数组返回指定的元素，不与原始数组共享内存，而`subarray()`则不复制内存，只返回相同底层值的新视图
```js
const int = new Int8Array([1, 2, 3, 4])
const newInt = int.subarray(2, 4) // newInt数组和int数组共享相同内存
```
### TypedArray.prototype.byteLength
该属性返回定型数组占据的内存长度(单位字节)，只读
```js
const int8 = new Int8Array(10)
int8.byteLength // 10字节

const int16 = new Int16Array(10)
int16.byteLength // 20字节

const int32 = new Int32Array(10)
int32.byteLength // 40字节

const float64 = new Float64Array(10)
float16.byteLength // 80字节
```
### TypedArray.prototype.byteOffset
该属性返回定型数组从底层`ArrayBuffer`对象的哪个字节开始，只读
```js
const buffer = new ArrayBuffer(8)

const int8 = new Int8Array(buffer, 2, 2)
int8.byteOffset // 2
```
### TypedArray.prototype.length
该属性返回定型数组的元素个数，只读
```js
const int8 = new Int8Array([1, 2, 3, 4])
int8.length // 4
```
### TypedArray.prototype.buffer
该属性返回定型数组底层对应的`ArrayBuffer`对象，只读
```js
const buffer = new ArrayBuffer(8)
const int8 = new Int8Array(buffer)
int8.buffer === buffer // true
```
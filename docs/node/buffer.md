---
title: Buffer
date: 2022-11-13
categories:
 - 进阶
tags:
 - node
---
## Buffer类

`Buffer`对象用于表示固定长度的字节序列，在`node`中很多api都会涉及到`Buffer`，流就是基于`Buffer`的

`Buffer`类是定型数组`Uint8Array`的子类，除了能使用`Uint8Array`的方法，还对自身扩展了一些特有方法

之所有`Buffer`类是`Uint8Array`的子类，在源码中是利用`Class`的`extends`实现，然而`Buffer`的定义使用的却是构造函数形式

``` js
// lib/buffer.js
// ......

const {
  FastBuffer,
  // ......
  addBufferPrototypeMethods
} = require('internal/buffer');

FastBuffer.prototype.constructor = Buffer;
Buffer.prototype = FastBuffer.prototype;

// ......

function Buffer(arg, encodingOrOffset, length) {
  showFlaggedDeprecation();
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new ERR_INVALID_ARG_TYPE('string', 'string', arg);
    }
    return Buffer.alloc(arg);
  }
  return Buffer.from(arg, encodingOrOffset, length);
}
```

在`lib/buffer.js`文件中，`Buffer.prototype`指向`FastBuffer`的原型对象，`FastBuffer`在`lib/internal/buffer.js`中实现如下，`FastBuffer`继承于`Uint8Array`
``` js
// lib/internal/buffer.js 
class FastBuffer extends Uint8Array {}
```

我们都知道，`Class`的继承其实是有两条继承链，对于上面的`extends`继承其实就是如下的关系
``` js
FastBuffer.__proto__ === Uint8Array // true
FastBuffer.prototype.__proto__ === Uint8Array.prototype // true
```
这样通过`Buffer`构造函数实例化一个`buf`对象，不仅可以使用`node`对`Buffer.prototype`上扩展的特有方法，还可以使用继承于`Uint8Array`上的方法，然而`node`早在`6.0`的版本就已经弃用了使用`new Buffer`的形式实例化`buf`对象，那么对于`Buffer`类是`Uint8Array`的子类又是怎么实现的呢？细心的小伙伴可能发现了在`Buffer`构造函数内部针对传递的参数如果是数值类型调用的是`Buffer.alloc`方法，而其它类型调用的是`Buffer.from`方法

### Buffer.alloc()
该方法定义在`lib/buffer.js`文件中
```js
// lib/buffer.js
const assertSize = hideStackFrames((size) => {
  if (typeof size !== 'number') {
    throw new ERR_INVALID_ARG_TYPE('size', 'number', size);
  }
  if (!(size >= 0 && size <= kMaxLength)) {
    throw new ERR_INVALID_OPT_VALUE.RangeError('size', size);
  }
});

Buffer.alloc = function alloc(size, fill, encoding) {
  assertSize(size);
  if (fill !== undefined && fill !== 0 && size > 0) {
    const buf = createUnsafeBuffer(size);
    return _fill(buf, fill, 0, buf.length, encoding);
  }
  return new FastBuffer(size);
};
```
该方法会在内部先调用`assertSize`方法，`assertSize`方法内部实现较简单，如果`size`不为数值类型或大小不在`0`到`4GB`字节范围之间都会抛出错误，接着会判断`fill`参数，如果`fill`参数不存在，则直接返回`new FastBuffer(size)`实例化`buf`对象，由于`FastBuffer`类继承于定型数组`Uint8Array`，所以返回的`buf`对象也能使用`Uint8Array`原型上的方法。

如果`fill`不为`undefined`并且不严格相等于0并且`size`大于0，则会先调用`createUnsafeBuffer`方法，该方法在`lib/buffer.js`文件中被定义
```js
function createUnsafeBuffer(size) {
  zeroFill[0] = 0;
  try {
    return new FastBuffer(size);
  } finally {
    zeroFill[0] = 1;
  }
}
```
关于`zeroFill`可以先忽略，该方法内部其实也是`new FastBuffer`，返回一个`buf`对象，接着调用`_fill`方法，该方法同样在`lib/buffer.js`文件中被定义
```js
function _fill(buf, value, offset, end, encoding) {
  if (typeof value === 'string') {
    if (offset === undefined || typeof offset === 'string') {
      encoding = offset;
      offset = 0;
      end = buf.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = buf.length;
    }

    const normalizedEncoding = normalizeEncoding(encoding);
    if (normalizedEncoding === undefined) {
      validateString(encoding, 'encoding');
      throw new ERR_UNKNOWN_ENCODING(encoding);
    }

    if (value.length === 0) {
      // If value === '' default to zero.
      value = 0;
    } else if (value.length === 1) {
      // Fast path: If `value` fits into a single byte, use that numeric value.
      if (normalizedEncoding === 'utf8') {
        const code = value.charCodeAt(0);
        if (code < 128) {
          value = code;
        }
      } else if (normalizedEncoding === 'latin1') {
        value = value.charCodeAt(0);
      }
    }
  } else {
    encoding = undefined;
  }

  if (offset === undefined) {
    offset = 0;
    end = buf.length;
  } else {
    validateInt32(offset, 'offset', 0);
    // Invalid ranges are not set to a default, so can range check early.
    if (end === undefined) {
      end = buf.length;
    } else {
      validateInt32(end, 'end', 0, buf.length);
    }
    if (offset >= end)
      return buf;
  }


  if (typeof value === 'number') {
    // OOB check
    const byteLen = TypedArrayProto_byteLength.call(buf);
    const fillLength = end - offset;
    if (offset > end || fillLength + offset > byteLen)
      throw new ERR_BUFFER_OUT_OF_BOUNDS();

    TypedArrayFill.call(buf, value, offset, end);
  } else {
    const res = bindingFill(buf, value, offset, end, encoding);
    if (res < 0) {
      if (res === -1)
        throw new ERR_INVALID_ARG_VALUE('value', value);
      throw new ERR_BUFFER_OUT_OF_BOUNDS();
    }
  }

  return buf;
}
```
该方法逻辑较清晰，一共有5个参数，后面的3个参数`offset、end、encoding`都是可选参数，如果对`buf`填充的数据为字符串，
则首先会对3个可选参数进行赋值处理，`encoding`默认为`utf8`，如果`value`为空字符串，则对`buf`对象底层引用的`arrayBuffer`对象的每个二进位填充为0，如果`value`是长度为1的字符串，对不同的编码填充的值也有所区别，该方法大部分的逻辑都是在处理三个默认参数的值，其实该方法内部最重要的三部分是`TypedArrayProto_byteLength`、`TypedArrayFill`、`bindingFill`，前两个方法在`lib/buffer.js`的最前方定义，`bindingFill`方法我还没找到在哪个位置，哈哈哈哈哈哈。。。
```js
const TypedArrayPrototype = ObjectGetPrototypeOf(Uint8ArrayPrototype);
const TypedArrayProto_byteLength = ObjectGetOwnPropertyDescriptor(TypedArrayPrototype, 'byteLength').get;
const TypedArrayFill = TypedArrayPrototype.fill;
```
上述代码其实可翻译如下:
```js
const TypedArrayPrototype = Uint8Array.prototype.__proto__
const TypedArrayProto_byteLength = Object.getOwnPropertyDescriptor(Uint8Array.prototype.__proto__, 'byteLength').get
const TypedArrayFill = Uint8Array.prototype.__proto__.fill
```
其实到这里就可以看出来，在`_fill`内部还是使用的`Uint8Array`原型链上的`fill`方法进行填充，关于`bindingFill`方法，等我晓得了我再补上

### Buffer.allocUnsafe()
```js
// lib/buffer.js
Buffer.allocUnsafe = function allocUnsafe(size) {
  assertSize(size);
  return allocate(size);
};
```
`Buffer.allocUnsafe`会直接调用`allocate`方法
```js
// lib/buffer.js
function allocate(size) {
  if (size <= 0) {
    return new FastBuffer();
  }
  if (size < (Buffer.poolSize >>> 1)) {
    if (size > (poolSize - poolOffset))
      createPool();
    const b = new FastBuffer(allocPool, poolOffset, size);
    poolOffset += size;
    alignPool();
    return b;
  }
  return createUnsafeBuffer(size);
}
```
`allocate`方法内部会先对`size`参数做判断，如果`size`小于等于0，则直接返回`new FastBuffer`生成的实例对象，如果`size`小于内部内存池大小的一半，并且`size`超出内部内存池剩余的空间，则会创建一个新的内存池，返回的`buf`对象会将内部内存池作为底层引用的`ArrayBuffer`对象，如果`size`大于内部内存池大小的一半，则接着调用`createUnsafeBuffer`方法
```js
// lib/buffer.js
function createUnsafeBuffer(size) {
  zeroFill[0] = 0;
  try {
    return new FastBuffer(size);
  } finally {
    zeroFill[0] = 1;
  }
}
```
该方法在前面也分析过，不过按照`node`文档分析，该方法返回的`buf`对象的底层内存每个字节都没有被初始化，如需用到底层内存每个字节都初始化为0的`buf`对象可直接使用`Buffer.alloc()`方法或者`Buffer.allocUnsafe(size).fill(0)`方法
### Buffer.allocUnsafeSlow()
```js
Buffer.allocUnsafeSlow = function allocUnsafeSlow(size) {
  assertSize(size);
  return createUnsafeBuffer(size);
};

```
`Buffer.allocUnsafeSlow()`方法直接调用`createUnsafeBuffer`方法，返回的`buf`对象的底层内存的每个字节都未用0初始化

### Buffer.alloc、Buffer.allocUnsafe()、Buffer.allocUnsafeSlow()的区别
* `Buffer.alloc(size[, fill[, encoding]])`方法创建的`buf`对象底层内存每个字节都会用0进行初始化
* `Buffer.allocUnsafe(size)`方法当`size`参数小于内部内存池大小的一半则会将内部内存池作为底层内存，返回的`buf`对象的底层内存的每个字节都未用0初始化
* `Buffer.allocUnsafeSlow(size)`方法返回的`buf`对象未用内部内存池作为底层内存，但是底层内存的每个字节都未用0初始化


### Buffer.from()
#### 字符串参数
在`lib/buffer.js`文件中该方法被定义
```js
// lib/buffer.js
Buffer.from = function from(value, encodingOrOffset, length) {
  if (typeof value === 'string')
    return fromString(value, encodingOrOffset);

  // ......

};
```
首先先分析参数为字符串的情况，会直接调用`fromString`方法
```js
// lib/buffer.js
function fromString(string, encoding) {
  let ops;
  if (typeof encoding !== 'string' || encoding.length === 0) {
    if (string.length === 0)
      return new FastBuffer();
    ops = encodingOps.utf8;
    encoding = undefined;
  } else {
    ops = getEncodingOps(encoding);
    if (ops === undefined)
      throw new ERR_UNKNOWN_ENCODING(encoding);
    if (string.length === 0)
      return new FastBuffer();
  }
  return fromStringFast(string, ops);
}
```
该方法内部存在两种情况，指定编码或未指定编码(编码默认为`utf8`)，在这两种情况下，都会获取编码选项对象`ops`，如果`string`为空字符串则直接返回`new FastBuffer()`生成的实例对象，在未指定编码的情况下`encoding`会赋为`undefined`，最后会接着调用`fromStringFast`方法
```js
// lib/buffer.js
function fromStringFast(string, ops) {
  const length = ops.byteLength(string);

  if (length >= (Buffer.poolSize >>> 1))
    return createFromString(string, ops.encodingVal);

  if (length > (poolSize - poolOffset))
    createPool();
  let b = new FastBuffer(allocPool, poolOffset, length);
  const actual = ops.write(b, string, 0, length);
  if (actual !== length) {
    // byteLength() may overestimate. That's a rare case, though.
    b = new FastBuffer(allocPool, poolOffset, actual);
  }
  poolOffset += actual;
  alignPool();
  return b;
}
```
该方法首先会根据编码获取`string`参数的字节长度，`createFromString`方法为内部绑定方法，先略过，如果字节长度`length`大于内部内存池`poolOffset`到字节尾部的长度，则调用`createPool`方法重新创建一个内存池，`allocPool`为长度默认为`8 * 1024`字节的`ArrayBuffer`内存池，该方法返回的`buf`对象底层引用的是内存池中指定的偏移量和字节长度的`ArrayBuffer`对象，然后根据编码选项对象的`ops.write`方法将`string`数据写入到`buf`对象底层引用的内存中，一般默认编码为`utf8`，`ops.write`方法为内部绑定的`utf8Write`方法，最后递增内存池的偏移量`poolOffset`和调用`alignPool`方法
#### 数组/类数组对象/buffer对象
```js
// lib/buffer.js
Buffer.from = function from(value, encodingOrOffset, length) {

  // ......

  if (typeof value === 'object' && value !== null) {
    if (isAnyArrayBuffer(value))
      return fromArrayBuffer(value, encodingOrOffset, length);

    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null &&
        valueOf !== value &&
        (typeof valueOf === 'string' || typeof valueOf === 'object')) {
      return from(valueOf, encodingOrOffset, length);
    }

    const b = fromObject(value);
    if (b)
      return b;

    if (typeof value[SymbolToPrimitive] === 'function') {
      const primitive = value[SymbolToPrimitive]('string');
      if (typeof primitive === 'string') {
        return fromString(primitive, encodingOrOffset);
      }
    }
  }

  // ......
};
```
当`value`为一个数组/类数组对象/buffer对象，会直接调用`fromObject`方法
```js
// lib/buffer.js
function fromObject(obj) {
  if (obj.length !== undefined || isAnyArrayBuffer(obj.buffer)) {
    if (typeof obj.length !== 'number') {
      return new FastBuffer();
    }
    return fromArrayLike(obj);
  }

  if (obj.type === 'Buffer' && ArrayIsArray(obj.data)) {
    return fromArrayLike(obj.data);
  }
}
```
`fromObject`方法内对参数`obj.length`属性不为数值类型时返回`new FastBuffer`生成的实例对象，否则会直接调用`fromArrayLike`方法
```js
// lib/buffer.js
function fromArrayLike(obj) {
  if (obj.length <= 0)
    return new FastBuffer();
  if (obj.length < (Buffer.poolSize >>> 1)) {
    if (obj.length > (poolSize - poolOffset))
      createPool();
    const b = new FastBuffer(allocPool, poolOffset, obj.length);
    b.set(obj, 0);
    poolOffset += obj.length;
    alignPool();
    return b;
  }
  return new FastBuffer(obj);
}
```
`fromArrayLike`方法内部，会首先对`length`做判断，当小于等于0会直接返回`new FastBuffer`生成的实例对象，当`obj.length`小于内部内存池大小的一半，则会将内存池作为返回`buf`对象`ArrayBuffer`，当`obj.length`小于内部内存池剩余的空间，则重新创建一个内部内存池，接着将`obj`的数据利用`TypedArray.prototype.set`方法保存在返回的`buf`对象中，当`obj.length`大于内部内存池大小的一半，则会直接返回`new FastBuffer(obj)`


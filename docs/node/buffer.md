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

之所有`Buffer`类是`Uint8Array`的子类，在源码中是利用`Class`的`extends`实现，然而`Buffer`的定义使用的确是构造函数形式

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
则首先会对3个可选参数进行赋值处理，`encoding`默认为`utf8`，如果`value`为空字符串，则对`buf`对象底层引用的`arrayBuffer`对象的每个二进位填充为0，如果`value`是长度为1的字符串，对不同的编码填充的值也有所区别，该方法大部分的逻辑都是在处理三个默认参数的值，其实该方法内部最重要的两部分是`TypedArrayProto_byteLength`和`TypedArrayFill`，这两个方法在`lib/buffer.js`的最前方定义
```js
const TypedArrayPrototype = ObjectGetPrototypeOf(Uint8ArrayPrototype);
const TypedArrayProto_byteLength = ObjectGetOwnPropertyDescriptor(TypedArrayPrototype, 'byteLength').get;
const TypedArrayFill = TypedArrayPrototype.fill;
```
上述代码其实可翻译如下:
```js
const TypedArrayPrototype = Uint8Array.prototype.__proto__
const TypedArrayFill = Uint8Array.prototype.__proto__.fill
```
对于`TypedArrayProto_byteLength`其实就是`Uint8Array.prototype.__proto__`对象上定义的`get byteLength`方法，到这里其实就可以看出来，内部其实还是使用的`Uint8Array`原型链上的`fill`方法进行填充
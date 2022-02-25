---
title: 生成器runner
date: 2021-06-15
categories:
 - 零碎点
tags:
 - js
---

::: tip 提示
在使用生成器函数(function* () {...})进行一系列异步操作时，我们一般都不想每次在每个yield异步请求完成时手动调用生成器实例的next方法进行迭代，可能更加需要一个runner自动迭代
:::

```js
/*
  调用方式
  run(function* gen () {
    yield function () {}
  
    yield new Promise((resolve, reject) => {
      // ...一系列异步操作
    })
  }).then(() => {}).catch(() => {})
  返回Promise
*/

function run (gen) {
  const arg = [].slice.call(arguments, 1)
  const it = gen.apply(this, arg) // 在当前环境下调用生成器函数
  return Promise.resolve()
    .then(function handleNext(value) {
      const next = it.next(value)
      return (function handleResult({ value: val, done }) {
        if (done) return val // 判断是否结束
        return Promise.resolve(val)
          .then(
            handleNext,
            err => {
              return Promise.resolve(it.throw(err)) // throw方法被捕获以后，会附带执行下一条yield表达式（就是会附带执行next方法）
                .then(handleResult)
            }
        )
      })(next)
    })
}
// 调用
function *foo () {
  try {
    yield Promise.reject(123)
  } catch (err) {
    console.log(err)
  }
  yield 123
  yield Promise.resolve(111)
}
run(foo).then(res => console.log(res))
```
::: tip 提示
async函数其实就是生成器函数的语法糖，async函数就是将生成器函数的星号（*）替换成async，将yield替换成await，生成器函数的执行必须需要类似runner的执行器，async函数原理类似runner，返回一个promise
:::
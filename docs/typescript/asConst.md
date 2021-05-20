# const断言
const断言是一种类型断言，const代替了类型名

## const
### 字面量
当我们使用const关键字申明一个字面量时，类型是赋值符号（=）右边的值
```ts
  const x = '123' // const x: 123
```
const关键字确保不会发生对变量进行重新分配，并且只保证该字面量的严格类型，但是如果使用let（或者var）的话，该变量会被重新分配，并且类型会被扩展为变量值所属的类型
```ts
  let x = '123' // let x: string
```
使用let（或者var）定义的x被扩展为更加通用的类型，并允许将其重新分配给该类型的其他值，而使用const定义的x只能具有'123'的值
### 对象
当使用const申明一个变量为对象时，由于对象的属性都具有可修改性，ts会对他们【从宽】类型推断
```ts
const person = {
  name: 'zhangsan'
} // const person: { name: string }
const fnc = function () {} // const fnc: () => void
const arr = [1, 2, 3, 4] // const arr: number[]
```
::: tip 提示
  **const声明是es6的语法，对ts而言，它只能反映该常量本身是不可被重新赋值的，它的子属性仍然可以被修改，ts只会对它们做松散的类型推断**
:::
## as const
::: tip 提示
  **as const是ts的语法，它告诉ts它所断言的值以及该值的所有层级的子属性都是不可篡改的，故对每一级子属性都会做最严格的类型推断**
:::
* 对象字面量获取readonly属性
* 数组字面量称为readonly元组
```ts
const person = {
  name: 'zhangsan',
  age: 20,
  addr: '四川省巴中市',
  relationship: [
    {
      name: 'lisi',
      age: 18,
      addr: '四川省成都市'
    }
  ]
} as const 
```
对应于
```ts
const person: {
    readonly name: "zhangsan";
    readonly age: 20;
    readonly addr: "四川省巴中市";
    readonly relationship: readonly [{
        readonly name: "lisi";
        readonly age: 18;
        readonly addr: "四川省成都市";
    }]
}
```
## 用作枚举
常量断言可以让我们不需要enum关键字就能定义枚举对象
```ts
const EnvEnum = {
  Development: 'dev',
  Production: 'prod',
  Testing: 'test',
} as const
type Env = typeof EnvEnum[keyof typeof EnvEnum]
const env: Env = EnvEnum.Testing
```
[更多as const详解](https://zhuanlan.zhihu.com/p/121558249)

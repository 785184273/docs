# unknown
unknown类型表示任何值。这与any类型相似，但是更安全，因为用unknown值做任何事情都是不合法的

::: tip 提示
unknown 类型只能分配给 any 类型和 unknown 类型本身

unknown 类型在被确定为某个类型之前，不能被进行诸如函数执行、实例化等操作，一定程度上对类型进行了保护
:::
```ts
var un: unknown
var un1: unknown = un // ok
var any: any = un // ok

un.a() // Error
var num: number = un // Error
var str: string = un // Error
var arr: any[] = un // Error
var bool: boolean un // Error
```
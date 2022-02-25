---
title: vue组件函数式调用
date: 2021-09-27
categories:
 - 源码分析
tags:
 - vue
---

正常情况下使用组件都是，先导入组件，再注册组件，然后再在模板中使用

例如：
``` html
<!-- 模板使用 -->
<template>
  <message />
</template>

<script>
// 导入组件
import message from 'Message.vue'

// 注册组件
export default {
  compoents: {
    message
  }
}
</script>
```
## 函数式调用
::: tip 提示
  所写的例子使用vue3和ts
:::

以element dialog组件为例，先编写好组件：
``` html
<!-- Dialog.vue -->
<template>
  <!--  teleport使该组件渲染到#dialog下  -->
  <teleport to="#dialog">
    <el-dialog
      v-model="visible"
      title="提示"
      width="300px">
      <span>{{ title }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="default"
            size="mini"
            @click="close">取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="callback">确 定</el-button>
        </span>
      </template>
  </el-dialog>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, PropType, onUnmounted, ref } from 'vue'

export default defineComponent({
  props: {
    title: String,
    callback: {
      type: Function as PropType<() => void>
    },
    close: {
      type: Function as PropType<() => void>
    }
  },
  setup (props) {
    const DialogNode = document.createElement('div')
    DialogNode.id = 'dialog'
    document.body.appendChild(DialogNode)
    // 组件卸载的时候删除dialog
    onUnmounted(() => {
      document.body.removeChild(DialogNode)
    })
    
    const visible = ref(true)
    const close = () => {
      document.body.removeChild(DialogNode)
      if (props.close) props.close()
      visible.value = false
    }
    return {
      visible,
      close
    }
  }
})
</script>
```
再编写调用函数ts文件
``` ts
// Dialog.ts
import { createApp } from 'vue'
import Dialog from './Dialog.vue'

// element
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

export interface DialogOptions {
  title: string,
  callback: () => void
}

export default (dialogOption: DialogOptions): void => {
  const { title, callback } = dialogOption

  const node = document.createElement('div')
  document.body.appendChild(node)

  const close = () => {
    document.body.removeChild(node)
  }
  const app = createApp(Dialog, {
    title,
    callback,
    close
  })

  app.use(ElementPlus)
  app.mount(node)
}
```
使用组件时直接导入函数调用即可（例如）：
``` html
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Dialog, { DialogOptions } from '@/components/Dialog'

export default defineComponent({
  setup (props, { emit }) {
    // 退出登录时提示
    const dialogProps: DialogOptions = {
      title: '确定要退出登录？',
      callback: () => {
        console.log(123)
      }
    }
    Dialog(dialogProps)
  }
})
</script>
```



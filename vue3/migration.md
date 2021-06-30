# vue3 升级指南

对用户来说，为什么需要 [vue3](https://github.com/vuejs/vue-next):

- 使用了新的语言特性
  
  旧版本 `vue` 的响应式更新依靠 [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 中的 `get` 及 `set` 来实现，但是它无法检测对象中属性的添加，我所以我们经常要使用 `$set` 来手动操作。而在 `vue3` 中，切换到 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 特性，则可以拦截到对象属性操作，可以提供更好的体验及性能。

- 更好的 `typesciprt` 支持， 更好的处理大型应用程序能力

  Composition Api

- 更小的 `bundle` 大小

  不到 `vue2` 一半的基线（必须）大小

如果你已经在 `vue2` 中重度使用了 `ts`, 那么你更应该积极进行这次升级。


## 升级流程

- `vue-loader` `^16.0.0`
- `vue-cli` 更新到最新的 `@vue/cli-service`
- `vue` 及 `@vue/compiler-sfc` 升级到相同的 `^3.0.0` 以上版本
- 去除 `node-sass` 并使用 `dart-sass` 代替
- `vuex` 升级到 `v4`
- `vue-router` 升级到 `v4`
- 更新 `slot` 语法

做完以上步骤，你的 `vue3` 应用就可以运行了。

## 变化

下面介绍部分 `vue3` 中常用的特性及变化:

### v-model

在 `vue2` 中，手动实现 `v-model` 语法糖是通过 `props` 获取 `value` 并且在数据改变时通过触发 `$emit('input', value)` 来实现的。

在 `vue3` 中，组件默认的接收参数是 `modelValue`, 以触发 `$emit('update:modelValue', value)` 来进行数据更新，并且可以通过 `v-model:modelValue` 同时设置多个双向绑定数据。

## composition api

### setup
`setup` 中允许用户自由组合和重用有状态的组件逻辑，同时提供出色的 `typeScript`支持。

例
`vue3` 中 `filter` 过滤器不再支持，原本的全局过滤器我们就可以通过`组合式api`实现:

```ts
setup() {
  const time = ref('');
  const { timeFilter } = shareMethods; // 公用方法

  const filterTime = computed(() => timeFilter(time));

  return {
    time,
    filterTime

  }
}
```
除了一些函数，我们还可以做出一个 模板并在 `setup` 中引入，以达到 `mixin` 相同的效果并且没有副作用。

### 生命周期

`setup` 中的生命周期通过引用使用，`setup` 本身就作为是 `created`, 并且旧的 `destroyed` 更名为 `unmounted`。

```ts
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    onMounted(() => {
      /* ... */
    })

    return {};
  }
})
```

### ref, reactive

推荐 `ref` 推荐定义基本数据类型,`reactive` 定义复杂数据类型。

它们都将会数据进行响应式化，但是注意若对 `reactive` 的数据进行解构后的数据将不具有响应式特性，需要使用 `toRefs` 转化来确保其解构后数据依然具有响应式特性。

```ts
import { defineComponent, ref, reactive, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const firstName = ref('hfut');
    const info = reactive({ lastName: 'sora' });

    return { 
      firstName,
      ...toRefs(info)
     };
  }
})
```


### 模板引用

在 `setup` 中，我们可以通过 `ref(null)` 来获取绑定的 `ref`。

```ts

import { defineComponent, ref, Ref, onMounted } from 'vue'

export default defineComponent({
  render() {
    return (
      <div ref="root"></div>
    )
  },
  setup() {
    const root: Ref<HTMLElement | null> = ref(null);

    onMounted(()=>{
      // DOM元素将在初始渲染后分配给ref
      console.log(root.value);
    })

    return { root };
  }
})
```

### props 类型注解

子组件接收值时，可以通过注解来完成 `ts` 类型声明:

```ts
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    info: {
      required: true,
      type: Object as PropType<UserInfo>
    }
  }
})
```

通过给 `PropType` 传入泛型， 对应 `prop` 的属性将会被推断为对应类型。


### provide / inject

在组件传值时，如果组件的深度较深，在最外层的组件向内层组件传值时会非常的繁琐且易出错，此时我们可以通过 `provide` 及 `inject` 语法可以大大简化此操作。

![provide](./components_provide.png)

在外层我们提供数据

```ts
import { provide, defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const name = ref('');

    provide('name', name);

    return { name };
  }
})
```

然后在该组件的任意层级的子组件下，我们可以接收

```ts
import { inject, defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    return { 
      name: inject('name') 
    };
  }
})
```

`provide` 提供的数据若使用 `ref` 或 `reactive` 转化，`inject` 时的数据也将是响应式的。

由 `provide / inject` 一定程度上代替 `vuex` 也是可行的。


## 注意事项

- 虽然 `vue3` 中单文件已经支持能同时存在多个根节点，但是在引用组件时，若子组件没有手动 绑定 `attrs` 将会发生错误（无法将属性继承到正确的节点上），所以建议组件统一由一个根节点包裹来避免该错误。

- 使用 `组合式 api` 代替 `mixin`

- 多看文档 [vue3](https://v3.cn.vuejs.org/)，这是最重要的，正所谓读书百遍，其义自见。
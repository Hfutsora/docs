# 从零开始学 `vue`

##  Chapter 1 `学习 vue-0.6.0`

> 本系列将从vue的 0.6.0 版本开始，从零构建我们自己的类vue简易版框架，该过程中我们将更加深入地学习 `vue` 框架内部实现，并对其中用到的某些知识点进行简单介绍，让我们能够更全面地认识这个框架。通过系统学习 `vue` 源码我们希望能提升自己的 `js` 水平，并在将来使用时，能有更好的框架理解，并且了解代码原理亦能有效避免在项目中踩很多不必要的坑。

### 学习之前

做过阅读理解的我们都知道，为了以最大效率找到题目答案，在阅读文章之前，我们首先需要明确自己有哪些问题，然后带着这些问题再去仔细地有目的性地学习，这样通常会更快地解决问题。

那么，学习源码我们的目的有哪些。首先我们希望能通过阅读源码及其项目结构，我们能学习到一个扩展性、稳定性良好的项目应该如何设计；希望学习 `vue` 框架内部的功能如何实现，如双向绑定、自定义指令等；希望知道项目内的依赖项及项目版本如何管理；希望知道项目的相关测试如何编写，覆盖率如何抉择。

那么就带着 `项目结构`、`数据模板双向绑定`、`框架内置函数`、`测试`、`版本管理` 这些关键词开始学习吧。

### `vue-0.6.0` 源码解析

>  为什么是 `vue-0.6.0`?
>
> 最新的 vue 已经趋于完整，项目十分庞大，通过直接学习最初版本更有利于我们了解作者创造框架的初衷和学习最核心的实现机制，而不用花费大量精力在分辨代码上。

初版的项目结构十分简单，`src` 目录下我们容易看到入口 `main.js`。

在 `main.js` 中，这里首先引入了框架需要的依赖项及相关配置：

```js
var config      = require('./config'),
    ViewModel   = require('./viewmodel'),
    directives  = require('./directives'),
    filters     = require('./filters'),
    utils       = require('./utils')
```

其中

- `config` vue 基础配置，包括属性前缀，开发模式，class等
- `ViewModel` 视图模型 （组件）
- `directives` 指令
- `filters` 过滤器
- `utils` 工具函数

这里默认你已掌握 vue2 的基本语法，下面首先介绍 vue 是如何解析 `tempalte` 模板并且实现数据与视图的双向绑定。

#### Compiler

AST [抽象语法树](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9)

我们知道每当操作 DOM 时，都会导致页面的 [重排或重绘](https://sites.google.com/site/getsnippet/javascript/dom/repaints-and-reflows-manipulating-the-dom-responsibly) 。为了减少浏览器性能开销，我们可以模仿真实的 dom 内部生成一个形状相同的语法树，当数据更新时我们先在语法树中去更新，当本轮数据修改结束后，我们将当前树与真实 dom 比较，只去更新发生变化的节点，减少重绘等发生的次数和规模。

首先我们尝试将一个 template 字符串转换为真实节点

```js
function toFragment(tempalte) {
  const node = document.createElement('div');
  const frag = document.createDocumentFragment(); //  fragment 不会引起页面回流
  let child = null;

  node.innerHTML = tempalte.trim();

  while(child = node.firstChild) {
    frag.appendChild(child);
  }

  return frag;
}

// 在浏览器控制台执行查看 frag 内容
console.log([toFragment('<div>hello world</div>')]);
```

然后我们使用该[文档片段](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment)作为 tempalte 用来创建真实 dom 元素.

```js
function setupElement(tempalte) {
  const el = document.createElement('div');

  el.innerHTML = '';
  el.appendChild(tempalte.cloneNode(true));

  return el;
}
```

此时我们已经根据 template 模板得到完整的节点树了
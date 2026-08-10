# DOM0&DOM2级事件绑定的区别

*2019-08-20*

**Q:** 在同一页面，多次使用 DOM0 级事件监听，会出现失效的情况。比如在 vue/react 最外层的 layout 使用 onresize 监听，其他子页面中再使用会出现失效的情况。

**DOM0 事件绑定**：

```
// 父组件
window.onresize = funcRef
// 子组件
window.onresize = funcRef2

```

onresize 监听只会触发一次，原因是 DOM0 级事件绑定是赋值过程，会覆盖前面的赋值

**DOM0 事件解绑：**

```
window.onresize = null

```

由于是赋值过程，只需要赋值为 null 即可

**DOM2 事件绑定**

```
window.addEventListener('resize', funcRef)

```

**DOM2 事件解绑**

```
window.removeEventListener('resize', funcRef)

```

**注意：**

> 当使用  addEventListener()  时, 如果  options参数不同, 那么你可以在相同的type  上多次添加相同的监听, 唯一需要  removeEventListener()  检测的是  capture/useCapture  标志. 这个标志必须与  removeEventListener()  的对应标志匹配, 但是其他的值不需要.
> 

**参考：**

[EventTarget.addEventListener() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
# 如何在使用Vue3时更好地展示控制台内容

例如，在 Vue.js 3 中，当我们在控制台打印一个 ref 数据时：

```
const msg = ref('Hello World!')
console.log(msg)

```

打开控制台查看输出，结果如图所示：

![Untitled](%E5%A6%82%E4%BD%95%E5%9C%A8%E4%BD%BF%E7%94%A8Vue3%E6%97%B6%E6%9B%B4%E5%A5%BD%E5%9C%B0%E5%B1%95%E7%A4%BA%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%86%85%E5%AE%B9/Untitled.png)

可以发现，打印的数据非常不直观。当然，我们可以选择直接打印 msg.value 的值，这样就只会输出值。

那么有没有办法在打印 msg 的时候让输出的信息更友好呢？当然可以，浏览器允许我们编写自定义的 formatter从而自定义输出形式。在 Vue.js3 的源码中，你可以搜索到名为 `initCustomFormatter` 的函数，该函数就是用来在开发环境下初始化自定义 `formatter` 的。

以 Chrome为例，我们可以打开 DevTools 的设置，然后勾选`Console → Enablecustom formatters`选项

具体路径，`DevTools > Menu > Settings F1 > Preferences > Console` 。如图所示：

![Untitled](%E5%A6%82%E4%BD%95%E5%9C%A8%E4%BD%BF%E7%94%A8Vue3%E6%97%B6%E6%9B%B4%E5%A5%BD%E5%9C%B0%E5%B1%95%E7%A4%BA%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%86%85%E5%AE%B9/Untitled%201.png)

![Untitled](%E5%A6%82%E4%BD%95%E5%9C%A8%E4%BD%BF%E7%94%A8Vue3%E6%97%B6%E6%9B%B4%E5%A5%BD%E5%9C%B0%E5%B1%95%E7%A4%BA%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%86%85%E5%AE%B9/Untitled%202.png)

重新查看控制台，会发现输出内容变得非常直观，如图所示

![Untitled](%E5%A6%82%E4%BD%95%E5%9C%A8%E4%BD%BF%E7%94%A8Vue3%E6%97%B6%E6%9B%B4%E5%A5%BD%E5%9C%B0%E5%B1%95%E7%A4%BA%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%86%85%E5%AE%B9/Untitled%203.png)
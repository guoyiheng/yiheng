# 关于Yak Shaving ── 从理解 TS 中 any 与 unknow 的区别中学英语

*2022-08-23*

## TS 中 any 与 unknown 的区别

今天看 Vuejs 源码的时候，发现大部分的参数类型，设置的是 `unknown` 。像这样：

```
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function isShallow(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_SHALLOW])
}

export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

```

虽然经常看到 unknow，但自己却没写过（经常写 `anyscript`哈哈），于是搜了几篇文章深入研究下。

### 从 RC 中寻找新增 `unknown` 的缘由

以下引用来自 [Announcing TypeScript 3.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-3-0-rc-2/#the-unknown-type)

> The any type is the most-capable type in TypeScript – while it encompasses the type of every possible value, it doesn’t force us to do any checking before we try to call, construct, or access properties on these values. It also lets us assign values of type any to values that expect any other type.
> 

```
let foo: any = 10

// All of these will throw errors, but TypeScript
// won't complain since `foo` has the type `any`.
foo.x.prop
foo.y.prop
foo.z.prop
foo()
new foo()
upperCase(foo)
foo`hello world!`

function upperCase(x: string) {
  return x.toUpperCase()
}

```

> There are often times where we want to describe the least-capable type in TypeScript.
> 

翻译下就是：在你不知道输入类型的时候，往往会设置个兜底的类型，这是经常使用 `any`的主要原因。但是不推荐这么做

> This is mostly useful, but it can be a bit lax
> 

它并不鼓励使用 `any`，因为使用它就会丢掉类型限制，而类型限制是我们选择 TypeScript 的，这显得有点背道而驰。

> This is useful for APIs that want to signal “this can be any value, so you must perform some type of checking before you use it”. This forces users to safely introspect returned values.
> 

所以**我们需要一个新的类型，既能做兜底类型，又能在使用前强制类型检查**。这便是 unknow 诞生的主要原因。

### 从 RC 中寻找 'unknown' 的用法

> TypeScript 3.0 introduces a new type called unknown that does exactly that. Much like any, any value is assignable to unknown; however, unlike any, you cannot access any properties on values with the type unknown, nor can you call/construct them. Furthermore, values of type unknown can only be assigned to unknown or any.
> 

现在，我们可以用新的类型 `unknown` 替换 `any`！

```
let foo: unknown = 10

// Since `foo` has type `unknown`, TypeScript
// errors on each of these usages.
foo.x.prop
foo.y.prop
foo.z.prop
foo()
new foo()
upperCase(foo)
foo`hello world!`

function upperCase(x: string) {
  return x.toUpperCase()
}

```

这段在实际书写中，类型检查会报错，如下：

![Untitled](%E5%85%B3%E4%BA%8EYak%20Shaving%20%E2%94%80%E2%94%80%20%E4%BB%8E%E7%90%86%E8%A7%A3%20TS%20%E4%B8%AD%20any%20%E4%B8%8E%20unknow%20%E7%9A%84%E5%8C%BA%E5%88%AB%E4%B8%AD%E5%AD%A6%E8%8B%B1%E8%AF%AD/Untitled.png)

等等! `Object is of type 'unknown'?` 怎么看上去有些别捏呢！

## be of 结构用法

看到文章标题你可能会觉得，在编程中学英语，不就是扔出来几篇英文文档，大谈特谈多读英文文档，顺带装逼嘛，NO！

在读英文文档的时候，像是做阅读理解，一目十行读过去，知道大概意思就行了。或者直接翻译整个网页，看中文找关键字看，我也经常这么干 ── 因为看文档大部分是为了解决问题和学习知识（如果有中文文档那当然更好）。

但有些场景，比如报错信息，会格外引人注目。而这句话是当你使用 'unknown' 不当的时候给的错误提示，它需要官方且简洁明了，所以它成功引起了我的注意。

`Object is of type 'unknown'` 一眼看过去没什么问题，也能猜出它的意思，却感觉有些别捏。思考过后，我想，它不应该是 `The type of object is 'unknown'`嘛，这下就舒服多了。

好奇心使我进步！一顿搜索之后我总结出了 `be of` 的用法

be of 结构用法很灵活，在句中可作表语、后置定语或宾补。

1. **`be of` + 表示（age/size/color/weight/height/price/opinion/shape/kind/type/way 等）的名词**
    
    表示 “具有……”，说明主语的特征。例如：
    
    - The two boys are of the same age. 这两个男孩年龄相同
    - **Object is of type 'unknown'. 对象的类型为“未知”**
2. **`be of` + 抽象名词**（value ， importance ， use ， help ， interest 等）
    
    相当于“ be + 该抽象名词相对应的形容词”。其中 of 表示“具备；具有”， of 不可以省略
    
    - They are of great help / very helpful to learners of English. 它们对英语学习者来说是很有帮助的。
3. **`be of` + 物质名词**
    
    表示主语是由某种材料制成或由某种成分构成，相当于 be made of ， be built of ， be made up of 等。例如：
    
    - The necklace is ( made ) of glass. 这条项链是由玻璃制成的。
    - Our class is( made up ) of over 50 students. 我们班有 50 多个学生。
4. **`be of` 还可以表示所属关系**
    
    相当于 belong to . 例如：
    
    - Workers and peasants are of one family. 工人和农民是一家。
5. **`be of` + 形容词最高级**
    
    相当于 be one of … . 例如：
    
    - Mr Guo is of the best CVer in our company. 郭老师是我们公司最好的程序员之一。

PS: 搜索中发现 sql 中也有 `IS OF TYPE` 条件的用法：

```
SELECT * FROM persons p
   WHERE VALUE(p) IS OF TYPE (employee_t)

```

## 关于 Yak Shaving

等等！这篇文章的主题是什么来着！刚才 TS 的 any 与 unknown 说到哪了？

> 在第一个要解决的事情中发现了其他的事情，到第二个事情中又发现了更多的事情，再到第三个事情中。
> 

这个过程就是 “Yak Shaving” 。

它的定义是：

> A less useful activity done consciously or subconsciously to procrastinate about a larger but more useful task.
> 

大概意思是：有意无意地进行小的事情而拖延更重要的事情。

是不是听起来有些像猴子掰玉米，我们很多时候都会无意中这样。AntFu 在《关于 Yak Shaving》中说：

> Shave the Good Yak
> 

这句话很有琢磨的价值，我想，只要做的事情对你来说有价值，哪怕脱离了你要做的事情的初衷，结果看来都应该是有意义的。

让我们从头来看：

1. 我在看 Vuejs 的源码，发现很多地方设置了类型 unknown。
2. 我不清楚它的深层含义，于是搜索了一下文档。
3. 在文档中我发现有示例说明，于是我尝试了一下示例。
4. 示例的报错信息引起了我的注意，我有些好奇这个 `Object is of type 'unknown'`的语法结构。
5. 通过搜索我了解到了 `be of`的使用，忽然觉得这是个很好的文章素材，于是我写了这篇博客。
6. 之后我回到 Vuejs 源码中，继续看源码。

每件小事都有了结果，而我也回到了最开始着手的事情。这就是一个正向的 Yak Shaving！

> 虽然我极力想在人类历史长河中留下自己的印记，但我慢慢意识到我穷尽一生也终将一事无成，然而这看似消极的态度却让我在人生的每个阶段很容易地完成身份的转变。
> 

即使我们不能像[关于 Yak Shaving](https://antfu.me/posts/about-yak-shaving-zh) 文中所说的那些大佬一样天赋异禀，总是能发现新的点子，做出有趣的产品，但是保持对事物的好奇和对知识的渴望，能让我们拥有持续学习的动力。

## 回到从 RC 中寻找 'unknown' 的用法

> Instead, we’re now forced to either perform checking, or use a type assertion to convince the type-system that we know better.
> 

所以我们需要进行强制类型检查，概念有些像是 Java 的强制类型转换。示例：

```
let foo: unknown = 10;

function hasXYZ(obj: any): obj is { x: any, y: any, z: any } {
    return !!obj &&
        typeof obj === "object" &&
        "x" in obj &&
        "y" in obj &&
        "z" in obj;
}

// Using a user-defined type guard...
if (hasXYZ(foo)) {
    // ...we're allowed to access certain properties again.
    foo.x.prop;
    foo.y.prop;
    foo.z.prop;
}

// We can also just convince TypeScript we know what we're doing
// by using a type assertion.
upperCase(foo as string);

function upperCase(x: string) {
    return x.toUpperCase();
}

```

更多详细内容请查阅附录。

## 附录

- [Announcing TypeScript 3.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-3-0-rc-2/#the-unknown-type)
- [PR - New 'unknown' top type](https://github.com/Microsoft/TypeScript/pull/24439)
- [关于 Yak Shaving](https://antfu.me/posts/about-yak-shaving-zh)
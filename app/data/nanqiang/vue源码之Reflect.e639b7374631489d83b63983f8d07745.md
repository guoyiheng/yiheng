# vue源码之Reflect

---

*2022-02-13*

Vue3 的响应式中，有一个重要的对象：`Reflect` ，源码位置：`packages/reactivity/src/baseHandlers.ts` 。

源码片段：**简化版一**：

```
const reactive = target =>
  new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      trigger(target, key)
      return Reflect.set(target, key, value, receiver)
    },
  })

```

另外一个大概实现：**简化版二**:

```
const reactive = target =>
  new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
      return true
    },
  })

```

那么，简化版一和简化版二有什么区别呢？

## 区别一：有无参数 receiver

举一个例子：

```
const people = {
  _name: '人类',
  get name() {
    return this._name
  },
}

const PeopleProxy = new Proxy(people, {
  get(target, prop) {
    return target[prop]
  },
})

const ctrlCV = {
  __proto__: PeopleProxy,
  _name: '程序员',
}

// output: 预期是程序员，但输出的是人类
console.log(ctrlCV.name)

```

 要想行为正常，则需要用到 `receiver`（setter 同理） 。

```
const people = {
  _name: '人类',
  get name() {
    return this._name
  },
}

const PeopleProxy = new Proxy(people, {
  get(target, prop, receiver) {
    // 如果 target 对象中指定了 getter，receiver 则为 getter 调用时的 this 值
    return Reflect.get(target, prop, receiver)
  },
})

const ctrlCV = {
  __proto__: PeopleProxy,
  _name: '程序员',
}

console.log(ctrlCV.name)

```

**Reflect 的作用一：通过使用 receiver 正确 获取/设置 目标值**

PS: 如果想在控制台运行代码 console.log 查看 receiver，需要用到完整版的代码，如下：

```
const people = {
  _name: '人类',
  get name() {
    return this._name
  },
}

const PeopleProxy = new Proxy(people, {
  get(target, prop, receiver) {
    console.log('target', target)
    console.log('prop', prop)
    console.log('receiver', receiver)
    return Reflect.get(target, prop, receiver)
  },
})

const ctrlCV = {
  __proto__: PeopleProxy,
  _name: '程序员',
  splice: undefined,
  [Symbol.toStringTag]() {
    return 'Validator'
  },
}

console.log(ctrlCV.name)

```

## 区别二：返回值

举一个例子：

```
const readonlyObj = {
  name: 'ctrlCV',
}
Object.defineProperty(readonlyObj, 'name', {
  writable: false,
})
// output coder
console.log((readonlyObj.name = 'coder'))
// output false
console.log(Reflect.set(readonlyObj, 'name', 'coder'))

```

上述例子中，我们把对象 readonlyObj 的 name 属性设置为只读之后，依次使用 `=` 和 `Reflect.set` 对 name 属性进行赋值。可以发现，直接赋值，我们不知道赋值是否成功，但使用`Reflect.set` ，我们可以通过返回值 true/false 来确定。

**Reflect 的作用二：可以通过 `Reflect.set` 的返回值来确定赋值是否成功**

## 总结 Reflect 的作用

通过对比上面两个简化版的代码片段，我们得出了在 vue3 响应式源码中 Reflect 的两个作用：

- **Reflect 的作用一：通过使用 receiver 正确 获取/设置 目标值**
- **Reflect 的作用二：可以通过 `Reflect.set` 的返回值来确定赋值是否成功**

另外，vue3 响应式源码中使用 `Reflect` 还有其他好处：

- **Reflect 的作用三：报错不会影响代码继续执行**

举一个例子：

```
;(function () {
  'use strict'
  const frozenObj = { name: 'ctrlCV' }
  Object.freeze(frozenObj)
  // TypeError: Cannot assign to read only property 'name' of object '#<Object>'
  frozenObj.name = 'coder'
  // no log
  console.log('log something')
})()

```

由于赋值了对象的只读属性，运行会报错，且中断下面的代码执行。使用 `Reflect.set` 可以避免此问题

- **Reflect 的作用四：配合 Proxy 使用天然友好**
    1. Reflect get/set 和 Proxy 的 handle 参数方法一样，返回值也正是 Proxy get/set 方法需要的返回值
    2. 发生继承关系后，必须使用 receiver 参数才行
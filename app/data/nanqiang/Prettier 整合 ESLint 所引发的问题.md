# Prettier 整合 ESLint 所引发的问题

---

*2020-06-23*

*本文重点在解决配合使用上的问题*

## 整合原因

项目中通过使用 Prettier 整合 ESLint 来规范代码，提升代码质量

先后顺序：先格式化代码，再进行代码质量检测。

各自使用配置请自行查阅

### ESLint 是什么

官网：

> Find and fix problems in your JavaScript codeESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs. In many ways, it is similar to JSLint and JSHint with a few exceptions:ESLint uses Espree for JavaScript parsing.ESLint uses an AST to evaluate patterns in code.ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.
> 

### Prettier 是什么

官网：

> An opinionated code formatterSupports many languagesIntegrates with most editorsHas few options
> 

## 问题起因-[Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)

然而，使用的时候有一个问题：**当你用 Prettier 格式化代码后再用 ESLint 去检测，会出现一些因为格式化导致的 warning**。

引用自[https://github.com/prettier/prettier-eslint](https://github.com/prettier/prettier-eslint)

> The fix feature of eslint is pretty great and can auto-format/fix much of your code according to your ESLint config. prettier is a more powerful automatic formatter. One of the nice things about prettier is how opinionated it is. Unfortunately, it's not opinionated enough and/or some opinions differ from my own. So after prettier formats the code, I start getting linting errors.
> 

## 解决方案

1. 先 prettier 之后，再使用 eslint --fix 格式化，这样把冲突的部分以 ESLint 的格式为标准覆盖掉，剩下的 warning 就都是代码质量问题了。
2. 在配置 ESLint 的校验规则时候把和 Prettier 冲突的规则 disable 掉，然后再使用 Prettier 的规则作为校验规则。那么使用 Prettier 格式化后，使用 ESLint 校验就不会出现对前者的 warning。

### 方案一

1、安装 prettier-eslint

```
npm install --save-dev prettier-eslint prettier-eslint-cli

```

2、运行，prettier-eslint 会一次执行 prettier 和 eslint --fix 命令。

```
npm prettier-eslint "src/**/*.js"

```

大致流程：

```
Code ➡️ prettier ➡️ eslint --fix ➡️ Formatted Code ✨

```

### 方案二

思路：主要是在 eslint 的规则配置文件上做文章，安装特定的 plugin，把其配置到规则的尾部，实现 prettier 规则对 eslint 规则的覆盖。

1、安装 plugin：

```
npm install --save-dev eslint-config-prettier

```

2、在 eslint 配置文件里面的 extends 字段添加：

```
{
  "extends": [
    ...,
    "已经配置的规则",
+   'plugin:prettier/recommended',
+   'prettier/vue'
  ]
}

```

3、完成上述两步可以实现的是运行 eslint 命令会按照 prettier 的规则做相关校验，但是还是需要分别运行 prettier 和 eslint 命令。社区有一个方案整合了上述两步，在使用 eslint --fix 时候，实际使用 prettier 来替代 eslint 的格式化功能。 安装：

```
npm install --save-dev eslint-plugin-prettier

```

修改 eslint 配置

```
module.exports = {
  plugins: ['vue', 'prettier', 'jest'],
}

```

这个时候你运行 eslint --fix 实际使用的是 Prettier 去格式化文件，具体见：[https://github.com/prettier/eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
# 动态生成代码模板——编写基于 nodejs 的 cli 工具

## 目标

项目结构

```
.
├── README.md
├── bin
│   ├── config.js // 处理用户的输入
│   ├── createIndexTemplate.js
│   ├── createPackageTemplate.js
│   ├── index.js // 主文件
│   ├── questions // 用户输入
│   │   ├── index.js
│   │   ├── middleware.js
│   │   ├── packageName.js
│   │   └── port.js
│   └── template // 待生成的模板
│       ├── index.ejs
│       └── package.ejs
├── koaTemplate // 生成的模板
│   ├── index.js
│   └── package.json
├── package-lock.json
└── package.json

```

## 思路

![Untitled](%E5%8A%A8%E6%80%81%E7%94%9F%E6%88%90%E4%BB%A3%E7%A0%81%E6%A8%A1%E6%9D%BF%E2%80%94%E2%80%94%E7%BC%96%E5%86%99%E5%9F%BA%E4%BA%8E%20nodejs%20%E7%9A%84%20cli%20%E5%B7%A5%E5%85%B7/Untitled.png)

大致思路：

用户终端输入 koa-cli，根据用户输入的内容生成配置，将配置作用于脚本，生成符合理想的内容

**Script 关键步骤分为 4 步:**

1. 创建项目文件夹
    
    文件名称——用户输入（input）
    
2. 创建 index.js
    
    index.js 的内容——已有的模板 ➕ 用户选择安装的中间件等服务（input）
    
3. 创建 package.json
    
    package 的内容——已有的模板 ➕ 用户选择安装的第三方包（input）
    
4. 进入生成的项目，安装依赖（output）

## 过程

### 创建基本项目

1. 新建项目文件夹 koa-cli
2. 初始化项目：`npm init -y`
    1. 修改`"type": "module"` 方便使用 esm 语法
3. 新建入口文件：`bin/index.js`

```
import fs from 'fs'

const indexTemplateString = '...'
const packageTemplateString = '...'

// 1. 创建项目文件夹
fs.mkdirSync('koaTemplate')
// 2. 创建 index.js
fs.writeFileSync('koaTemplate/index.js', indexTemplateString)
// 3. 创建 package.json
fs.writeFileSync('koaTemplate/package.json', packageTemplateString)

```

1. `node index.js` 测试
2. 添加 npm test 命令方便测试

```
"scripts": {
    "test": "rm -rf ./koaTemplate && node ./bin/index.js"
}

```

1. koa 项目已经创建完成。进入到文件夹，安装依赖，需要用到 npm 包`execa`

```
import fs from 'fs'
import execa from 'execa'

const indexTemplateString = '...'
const packageTemplateString = '...'

// 1. 创建项目文件夹
fs.mkdirSync('koaTemplate')
// 2. 创建 index.js
fs.writeFileSync('koaTemplate/index.js', indexTemplateString)
// 3. 创建 package.json
fs.writeFileSync('koaTemplate/package.json', packageTemplateString)
// 4. 安装依赖
execa('yarn', {
  cwd: koaTemplate,
  stdio: [2, 2, 2],
})

```

### 完善项目

至此，CLI 的基本内容已经完成。可以直接运行脚本生成项目。

但是有几个**重要问题**：

1. 生成的项目名称是固定的
2. 脚手架没有可选的安装选项
3. 模板内容和用户输入的可选项有关联
4. 首先不用考虑用户输入的部分，可以直接抽离成为`InputConfig`, 大概长这样

```
const inputConfig = {
  packageName: '',
  port: 8000,
  middleware: {
    static: false,
    views: false,
    router: false,
    body: false,
  },
}

```

然后将 InputConfig，依次传给需要的部分

1. 通过 InputConfig 中的内容对模板内容进行控制，模板需要用`ejs`
    
    *tip: 通过将安装的可选项后面逗号前置，保证 package 的 json 格式无误*
    
2. 和用户交互获取用户输入内容，需要用 `inquirer`
3. 格式化最后的模板代码，需要用 `prettier`

### 运行测试

通过`npm link` 将此目录下的 bin 链接到全局

通过 `npm root -g`, 获取全局安装的命令，查看上一步是否成功

## 工具

```
exaca: 执行脚本命令

ejs: 模板工具

inquire: 获取用户输入内容

prettier: 格式化代码

chalk: 美化输出

F2: 更换全局变量名

Quick and Simple Text Selection: 更换边界符号

terminalizer: 命令行录制

Travis CI: 自动发布

gren: 自动生成发布日志 github-release-notes

```
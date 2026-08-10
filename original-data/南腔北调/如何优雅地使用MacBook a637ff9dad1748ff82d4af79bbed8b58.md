# 如何优雅地使用MacBook

*2022-06-01*

> 工欲善其事，必先利其器 ── 《论语》
> 

虽然说 MacBook 作为生产力工具的使用体验已经非常舒适，但是在某些方面，还是需要一些调教，使用一些配置和软件进行配合，来达到一个更加舒服的姿势，注意是“舒服”，而不是“高效”。注意关键在于“舒服”而不是“高效”，用高效一词来证明东西的好用，容易忽略普适性。文章内容为笔者多年使用 macbook 的经验汇总，主观性较强，大家理性观看。

以下为笔者个人电脑设置，所有配置和软件只是分享，仅作参考。（是否适合在办公电脑上配置，请读者自行斟酌。）

部分内容抛砖引玉，展开说明篇幅会比较长，所以只是一笔带过，请大家就感兴趣的部分自行查阅。

## 软件篇

我选择一款软件的原则：

1. `颜值`
2. `开源 > 闭源`、`免费 > 收费`
3. 工具是否满足我的 `关注点`
4. 是否符合自己的 `使用习惯`

总结起来就是，找一款好看的、安全的、符合需要的软件。以下是一些我日常使用最为**频繁**的软件：

### 输入法 ── Rime(鼠须管)

![input.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/input.png)

**关注点：**

- 一键切换中英文（最好是 shift 键）
- 自定义短语&词库
- 可以定制皮肤（最好是和原生的接近）

因为我打字的需求比较多，所以输入法首当其冲，是我第一个亟需解决的问题。

### 中英文切换

我经常会切换中英文，所以我很关心切换的速度和使用习惯（一键切换且最好是 shift 键）。这一点搜狗使用起来还是挺顺手的（当然如果它是开源软件就好了）。

如果你是使用原生的输入法中英文切换其实很简单，在输入法设置中，可以选择设置按下`Caps Lock`键切换（注意是勾选项不是自定义项），但是`Caps Lock`已经被我改为了`Control`键（原因见下文），而`Control`键的位置又注定了这个键位按起来及其不舒服且容易按错。

同时，键盘左下角的`fn`健，是可以切换输入法的（如果支持的话），注意是切换输入法不是中英文。这里要明确一个概念，中文输入法和英文输入法在`macOS`是属于两个输入法，所谓的中英文切换是切换为另外一个输入法，所以使用`fn`打开弹窗选择会是输入法选择，故速度会很慢。而上文所说的`Caps Lock`切换，应该是苹果做的一个静默切换的功能罢了。

因为`Control`（现在是`Caps Lock`）键位的不便性，我又将`fn`和`Control`健的功能做了一个调换。即用`fn`来直接切换中英文输入，中英文切换是方便了许多，但是`fn`的其他组合键功能被破坏，也使得我必须重新思考其他的解决思路了。

### 关于词库

macOS 自带的输入法**非常难用**。中文词库异常简陋，对中文极其不友好（iOS 一样）。我一开始的解决方案是使用搜狗输入法，尽管禁用了联网权限，但还是会担心安全问题。而使用自定义词库和自定义短语是刚需，所以我曾试过一些其他的奇技淫巧拓展原生的词库，但最终都不及预期。

### 自定义词库&短语

关于自定义词库，[接近原生的鼠须管 Rime 配置](https://github.com/wongdean/rime-settings)中内置的词库已经足够。而自定义短语特别使用了[CasePolice](https://github.com/antfu/case-police)，对一些常用的软件名称和专业名词做出修正。

### 关于颜值

因为经常打字，我非常讨厌输入法过于花里胡哨，容易分散注意力更容易审美疲劳，定制化样式使得我至少能把控它的颜值下限。不过 Rime 社区已经有了现成的方案，配合使用起来感觉非常好。

### 输入法切换

虽然安装了 Rime（第三方输入法），但有时候 macOS 还是会莫名其妙的切换到其他输入法，然后你就需要用`Control+Space`切换回来，这个过程也挺痛苦。而 Rime 已经包含了中英文，且可以定制切换的按键，那自带的输入法好像都没有存在的必要了。但是，macOS 输入法设置规定必须保留一个自带的 `ABC` 输入法（即英文输入法）。

### 手动删除 ABC 输入法

1. 打开终端。输入`csrutil status`回车，如果显示`System Integrity Protection status: enabled`，则继续。
2. 输入`sudo open ~/Library/Preferences/com.apple.HIToolbox.plist`回车（或者手动找到此文件并用相关软件打开）。这一步需要提前安装的有`Xcode`或者`PlistEdit Pro`等工具，目的是打开`.plist` 文件。
3. 点开 `Root` - `AppleEnabledInputSources` 。依次打开子文件，找到其中`KeyboardLayout Name`为`ABC`的那一列，然后将整个母文件夹删掉，保存文件并重启电脑即可。

### 截图工具 ── iShot

![iShot.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/iShot.png)

**关注点：**

- 截图效果
- 贴图
- 常用的圈选/画笔工具
- OCR

截图工具其实最重要的是截图和贴图的便捷性，以及在此基础上的美观和可定制化，比如边框效果、阴影模糊效果。

基于关注点，我选择使用的是 iShot，虽然软件不开源且收费，但是作为截图工具使用起来得心应手，并不是极力推荐使用它，只是我使用习惯罢了，没有特别的需要，snipaste 也是比较好的选择。其他内容不作赘述，有兴趣查看官网描述。

### OCR 工具 ──iText

![iText.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/iText.png)

**关注点：**

- 使用的便捷性
- 识别速度
- 无额外信息干扰

虽说 iShot 已经有集截图和 OCR 一体（甚至还有录音录屏等功能），但是我还是喜欢用一个独立的软件去用来做 OCR 识别。（PS：没有对所谓集成软件和独立软件有什么区别对待。如果说经常用某个功能的话，独立的软件可能更简洁快速，如果一些功能不常用，但是偶尔会用的话，集成软件会比较适合）我只需要识别出来文字，如果需要去截图出来，再做识别，未免过于繁琐。iText 识别出来之后可以直接复制到粘贴版，短语不需要查看识别结果的话，一键就搞定了 OCR 识别。

### 笔记软件 ── 备忘录&提醒事项&Notion&Typora

备忘录

![memo.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/memo.png)

提醒事项

![remind.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/remind.png)

Notion

![Notion.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/Notion.png)

Typora

![Typora.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/Typora.png)

**备忘录/提醒事项关注点：**

- 颜值
- 跨平台
- 纯文字/表情记录

备忘录/提醒事项 用原生的就可以，写备忘非常方便。而 Typora 是写帖子草稿用的，可以直接看到 Markdown 的效果（这篇文章就是用 Typora 写的）。

**云笔记关注点：**

- 颜值
- 代码片段的支持
- 笔记版本功能
- 导出导入功能

云笔记软件我也用过一些，基本功能都差不多，我曾发过 Notion 能脱颖而出的原因，这里引用一下：

> 记再一次地迁移笔记
> 
> 
> 我最近几年的笔记历程跟我搬家差不多，一再更换。
> 
> 先是用的有道云，有广告我就不用了；
> 
> 之后换到了 OneNote，发现贴代码非常不好用就不用了；
> 
> 再之后换到了 evernote，免费版功能不全就不用了；
> 
> 再之后换到了语雀，客户端支持度太低，桌面端新出功能孱弱，手机端没有，导出的内容是自有格式，其他体验还算可以，所以我又用回了 OneNote。
> 
> 目前我在用的是语雀+OneNote，语雀用来写技术博客和一些其他的笔记，OneNote 用来写 todolist。总体体验过得去，但是来回切换软件让人神伤。
> 
> 接下来准备迁移到**Notion**，这已经是我不知道第几次迁移笔记了，因为笔记内容实在太多，每次迁移跟搬家一样让人头疼。希望这次是最后一次吧
> 
> PS：语雀也不推荐使用了，导出笔记备份没有 markdown 格式可选择（非源文件）
> 
> 再 PS：Notion 可导出源文件进行备份
> 
> 再再 PS：Notion 用的女友学校邮箱，可以免费使用高级功能
> 

弃用`sublime`：其他文本编辑器比如`sublime`(主题 ayu/one dark pro)，虽说打开速度很快，但没有必要为了打开速度再单独用一个软件（常年开着 VS Code），转而用 VS Code 替代。

### 编辑器 ── VS Code

![vscode.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/vscode.png)

**关注点：**

- 这没什么可挑的（非引战）

字体：[Fira Code](https://github.com/tonsky/FiraCode)

![FiraCode.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/FiraCode.png)

颜色主题：`One Dark Pro Darker`

其他部分配置和拓展可参考 antfu 大佬的 VS Code 配置。再自定义一些代码片段、快捷键、[GitHub Copilot](https://copilot.github.com/)以及[Oh My Zsh](https://ohmyz.sh/)终端，配合使用起来相当丝滑。

详细开发配置参见附录。

### 内录 ── loopback

**关注点：**

- 在不安装额外录屏软件的基础上，实现内录功能

![loopback.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/loopback.png)

> With the power of Loopback, it's easy to pass audio from one application to another. Loopback can combine audio from both application sources and audio input devices, then make it available anywhere on your Mac. With an easy-to-understand wire-based interface, Loopback gives you all the power of a high-end studio mixing board, right inside your computer!
> 

简而言之，loopback 可以将麦克风的声音和电脑本身播放的声音进行混合，然后播放。

如果你需要录制电脑内部声音，且没有太多额外的需求的话，QuickTime Player 是一个不错的系统自带软件。但是使用 QuickTime Player 进行屏幕录制时，只能录制麦克风的声音，无法对电脑本身播放的声音进行录制。当遇到一些录屏场景需要录制电脑内部声音时很不方便。

在使用 QuickTime Player 进行屏幕录制时，将 loopback 作为麦克风输入源，即可录制电脑的声音。

详情见官网。

### 软件篇总结

总结以及其他在用软件：

- 输入法：Rime(鼠须管)
- 截图工具：iShot / snipaste
- OCR 工具：iText
- 笔记软件：原生备忘录 & 原生提醒事项 & Notion & Typora
- 音乐：原生 Music
- 媒体播放器: [IINA](https://iina.io/)
- 阅读：Kindle & Calibre & GoodNote(PDF 阅读器)
- 存储：iCloud、百度云盘、Synology NAS
- 科学上网：ClashX Pro
- 菜单栏配置：Bartender
- 启动器：raycast / alfred
- 内录：[loopback](https://rogueamoeba.com/loopback/)
- 粘贴板：Clipy
- 专注模式：HazeOver
- 终端：自带 Terminal 或者 iTerm2
- 浏览器：arc / edge / chrome
- ...

有更好地软件推荐可以在评论区留言喔~

## 配置篇

### 程序坞

在侧边程序坞中添加空白区块，让程序坞看起来更整洁，方便程序坞的管理。

![program-wall.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/program-wall.png)

```
defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'; killall Dock
```

### 修饰键

设置 -> 修饰键，交换`Caps Lock` 和 `Control` 的功能。`Caps Lock` 占了极好的位置，使用频率却极低。

### Zsh ── Oh My Zsh

通过配置一些变量和别名让自己变得更懒。详情见附录

> Zsh（Z-shell）是一款用于交互式使用的 shell，也可以作为脚本解释器来使用。其包含了 bash，ksh 等其他 shell 中许多优秀功能，也拥有诸多自身特色。从 macOS Catalina 版开始，其默认 shell 从 bash 改为 zsh。
> 

打开终端：

- 输入 i 打开 VS Code 工作空间目录，输入 code .在 VS Code 中开始编码
- 输入 cool 在 VS Code 中打开博客目录
- 输入 zsh 在 vscode 中打开.zshrc 配置
- 输入 nas 通过 ssh 免密登录 NAS
- 输入 xxx 通过 ssh 免密登录自建服务器
- 需要从 GitHub 上 clone 一个项目，输入 clonei 即可直接 clone 到工作空间并在 VS Code 中打开
- ...

所有的操作一瞬极达，这就是 ZSH 的魅力，懒人必备！

### 软件/包管理器 ── Homebrew

> The Missing Package Manager for macOS (or Linux)
> 

开发工具包统一用 [Homebrew](https://brew.sh/) 安装和管理，例如`brew install tomcat brew install redis`

## 备份篇

### 备份关系

百度云盘用来备份 NAS 和其他资料非常方便。注：网盘只用来备份，不直接存储重要数据，数据皆存储在本地中。

![backup.png](%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E4%BD%BF%E7%94%A8MacBook/backup.png)

使用`TimeMachine`定期将 MacBook 备份到 NAS 中。详情见附录

### TimeMachine 备份排除目录

由于前端项目会有很多的 `node_modules` 依赖包，备份慢且无意义，由于一个个排除备份非常麻烦，可以用[asimov](https://github.com/stevegrunwell/asimov)**定时自动批量设置**来解决。详情见附录

## 附录

**输入法**

- [v2ex 相关讨论](https://v2ex.com/t/786762)
- [Rime 官网](https://rime.im/)
- [東風破，Rime configuration manager](https://github.com/rime/plum)
- [接近原生的鼠须管 Rime 配置](https://github.com/wongdean/rime-settings)
- [CasePolice](https://github.com/antfu/case-police)

**笔记软件**

- [Icon that can be used in Notion](https://icones.js.org/collection/all)

**编辑器**

- [antfu VS Code 配置](https://github.com/antfu/vscode-settings)
- [vscode-file-nesting-config](https://github.com/antfu/vscode-file-nesting-config)
- 字体[Fira Code](https://github.com/tonsky/FiraCode)

**zsh**

- [Oh My Zsh](https://ohmyz.sh/)
- [antfu 的.zshrc](https://github.com/antfu/dotfiles/blob/main/.zshrc)

**备份**

- [使用“时间机器”备份您的 Mac - 官方 Apple 支持 (中国)](https://support.apple.com/zh-cn/HT201250)
- [如何使用 Time Machine 将文件从 Mac 备份到 Synology NAS？](https://kb.synology.cn/zh-cn/DSM/tutorial/How_to_back_up_files_from_Mac_to_Synology_NAS_with_Time_Machine)
- [Automatically exclude development dependencies from Apple Time Machine backups](https://github.com/stevegrunwell/asimov)
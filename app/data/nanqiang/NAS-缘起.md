# NAS-缘起

[NAS-立项申请书](NAS-%E7%BC%98%E8%B5%B7/NAS-%E7%AB%8B%E9%A1%B9%E7%94%B3%E8%AF%B7%E4%B9%A6.md)

[里程碑](NAS-%E7%BC%98%E8%B5%B7/%E9%87%8C%E7%A8%8B%E7%A2%91.md)

[项目进度](NAS-%E7%BC%98%E8%B5%B7/%E9%A1%B9%E7%9B%AE%E8%BF%9B%E5%BA%A6.md)

[项目进度自建版](NAS-%E7%BC%98%E8%B5%B7/%E9%A1%B9%E7%9B%AE%E8%BF%9B%E5%BA%A6%E8%87%AA%E5%BB%BA%E7%89%88.md)

[媒体内容](NAS-%E7%BC%98%E8%B5%B7/%E5%AA%92%E4%BD%93%E5%86%85%E5%AE%B9.md)

[配置相关](NAS-%E7%BC%98%E8%B5%B7/%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3.md)

最近小女友没事干，看部电视剧总被喂屎，看篇公众号推送文章完了还自我感动，什么优酷腾讯爱奇艺轮番薰陶，不如咱给搭建个NAS，总不至于让小仙女饥不择食

期望

- 7*24小时开机，小型UPS电源保护。
- 家庭影院服务器。PT、BT等服务
- 远程连接
- 文件共享服务。SMB(文件共享)、FTP等服务

额外

- 文件备份。TimeMachine
- 私有云盘。Nextcloud
- HTPC
- 其它用途(DNS Server / 小型网站服务器等)

基础媒体内容

- 奥斯卡近40年最佳电影
- 艾美奖近10年获得多项提名的电视节目
- 格莱美奖近40年年度专辑
- 托尼奖近20年最佳话剧、最佳音乐剧
- 以上四项演艺圈大满贯获得者及获奖作品
- 近120年诺贝尔文学奖获得者及代表作品

补充：

硬件

- 万由四盘位NAS，华擎Q1900-ITX主板，J1900CPU，4G内存
- 小型UPS电源。防断电（APC BK650-CH）

软件

- 系统。采用开源方案Openmediavault（OMV） / FreeNAS（docker安装以下软件）
- UPS。OMV管理界面服务（Service），UPS插件就叫做openmediavault-nut(Network UPS Tools)
- 多媒体播放。Plex（Sub-Zero插件）
- 多媒体下载。
- Sonarr（我个人将它翻译为“声纳”，电视剧自动化管理软件）
- Radarr（暂且叫“雷达”吧，电影自动化管理软件）;
- SABnzbd（Usenet下载客户端）
- 下载软件。SABnzbd
- nzb索引网站。通过nzb文件搜索，找到自己需要下载的文件，有免费的索引网站。比如Binsearch，也有收费的，个人建议使用收费的索引网站，索引质量和稳定性较高
- 购买Usenet服务。
- Transmission（bt下载客户端）。

过程：在nzb索引网站找到你想下载资源的nzb文件下载下来，使用SABnzbd等客户端打开，由于下载软件里面已经配置好了服务器，所以你的资源就会从这些服务器上下载了，不是很难是吧？

[参考链接](https://www.zhihu.com/question/21359049/answer/588579088?utm_source=wechat_session&utm_medium=social&utm_oi=710493798915911680)

- （Ngrok）（[https://www.ngrok.cc/user.html）（https://dashboard.ngrok.com/status）](https://www.ngrok.cc/user.html%EF%BC%89%EF%BC%88https:/dashboard.ngrok.com/status%EF%BC%89)
- [https://pockies.github.io/2019/03/25/everaver-emby-kodi/](https://pockies.github.io/2019/03/25/everaver-emby-kodi/)
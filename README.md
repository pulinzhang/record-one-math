# 记一数学

出题人究竟想干嘛!

这里整理期中、期末里值得再看的题目。每道题先写出用到的数学思想，再用大家读得懂的话，把为什么这样想讲清楚。

网站在 [https://math.shpubing.com/](https://math.shpubing.com/)。有兴趣就看看现有专题。题目在 `public/lectures/`，按 `高一/`、`高二/`、`高三/` 分开放。

## 用 AI 加一篇讲义

用 Cursor 或 Trae 打开这个文件夹，把题目交给 AI。规则已经放在项目里，打开就会生效：Cursor 读 [.cursor/rules/lecture.mdc](.cursor/rules/lecture.mdc)，Trae 读 [.trae/rules/lecture.md](.trae/rules/lecture.md)。两份内容相同。照它写，不要改这两份规则。

对 AI 说清这三件事：

1. 年级：高一、高二或高三。
2. 出处：例如「高一上期中考试 20题」。
3. 题目原文：小问按原题顺序整段贴上。

可以这样说：

> 高一上期中考试第 20 题。出处写成「高一上期中考试 20题」。题目是：……请按规则加进讲义和目录。

AI 会做这三处改动：

- 在 `public/lectures/高一`、`高二` 或 `高三` 里新建一篇讲义。文件名像 `高一上期中考试20-题目名.html`。页眉先写这一篇的数学称呼，再写一句白话。小问按原题顺序往下排。最后有一段按试卷写的标准解答，里面不写想法。
- 在 `public/index.html` 对应年级下加一张卡片，写出专题名、出处和这一篇的思想。
- 把题目正文放进 `public/index.html` 末尾的 `.sheet`，打印题目时才会带上。

目录和页眉先不写算出的数。生成之后，打开新讲义和目录页看一遍：公式是否出来，返回目录是否回到首页，卡片是否进了对应年级。

## 提交之后自动发版

看过没问题，就提交，并推送到 GitHub 仓库 [pulinzhang/record-one-math](https://github.com/pulinzhang/record-one-math) 的 `main`。直接推到 `main`，或把改动合并进 `main`，都会触发发版。

Cloudflare 接到这次推送后自动发布。它按 [wrangler.jsonc](wrangler.jsonc) 把 `public/` 里的网页发出去，样式、脚本、图标、公式库和讲义都在这个目录里。不需要再手动点一次部署。推送完成后等这一次发布结束，再打开 [https://math.shpubing.com/](https://math.shpubing.com/) 看新讲义。

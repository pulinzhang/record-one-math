---
description: 记一数学的修改边界。只改这一次要改的地方。
alwaysApply: true
---

# 最小变更

所有修改必须遵循最小变更原则。

- 只修改本次需求涉及的文件和代码。
- 不顺手重构。
- 不擅自统一或改变其他页面的内容。
- 不为了追求代码形式上的整齐而改变现有功能。
- 发现相关问题先报告，不擅自扩大修改范围。

这与讲义规则里的「不改其他题目」是同一条边界。`.cursor/rules/change.mdc` 与 `.trae/rules/change.md` 是同一份规则。改其中一份，另一份同时改成相同内容。

改动 `public/css/site.css`、`public/js/site.js`、`public/js/jsxgraphcore.js` 或 `public/vendor/tex-svg.js` 时：所有 HTML（及 `site.js` 内拼出的引用）里**该文件**的 `?v=N` 加 1。这是缓存刷新，不算扩大修改范围。

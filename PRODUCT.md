# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要用户是在 Web 产品中集成富文本编辑能力的 React 开发者。他们需要以较低成本接入完整编辑体验，并能够按业务需求定制工具栏、命令、扩展、上传流程和主题。

## Product Purpose

`zt-reactjs-tiptap` 提供完整、可定制且可稳定升级的 TipTap React 编辑器。成功意味着开发者无需重复拼装常见富文本能力，即可快速集成编辑器，同时保留对业务交互和扩展能力的控制。

## Positioning

产品同时提供开箱即用的完整编辑体验与可嵌入的定制接口，并在同一个库中覆盖 Notion-like 与 Headless 两种使用模式。它以完整能力、清晰扩展边界和宿主环境隔离降低 TipTap 集成与长期维护成本。

## Operating Context

- 通过 npm 生态安装到 React 18+ Web 应用，并导入独立样式入口。
- 以受控组件方式管理内容，与宿主提供的图片、视频和附件上传服务协作。
- 根据产品场景选择 Notion-like 或 Headless 模式，并配置工具栏、斜杠命令、TipTap 扩展和代码格式化能力。
- 支持浅色与暗色主题，以及 `zh-CN` 和 `en-US` 两种界面语言。

## Capabilities and Constraints

- 基于 React、TypeScript、Vite、TipTap 和 ProseMirror，保持 strict mode 类型约束。
- 采用 `core + react/editor + shared` 分层；React 视图逻辑不得反向进入 core。
- 对外主组件为 `ReactTiptapEditor`，发布主入口、core 子路径和样式入口保持稳定。
- 提供文本格式、链接、媒体、附件、表格、任务列表、颜色、高亮、数学公式、代码块、斜杠命令、BubbleMenu、对齐、缩进和国际化能力。
- 编辑器主题、Portal 和组件样式必须与宿主页面隔离。
- 遵循 SemVer：非主版本不破坏公共 API、导出路径和核心行为；必要的破坏性变更必须提供迁移说明。

## Brand Commitments

- 产品名为 `zt-reactjs-tiptap`。
- React 对外主组件名为 `ReactTiptapEditor`。
- Notion-like 与 Headless 是对外使用的模式术语。
- 产品文档和界面支持中文与英文。

## Evidence on Hand

- 产品说明、能力清单、API 示例和集成文档：[README.md](./README.md)。
- npm 发布页：https://www.npmjs.com/package/zt-reactjs-tiptap
- GitHub 仓库：https://github.com/lzt-T/md-tiptap
- 公开演示：https://tiptap.xjoker.top/
- 当前没有可引用的客户案例、用户评价、性能基准、商业数据或媒体背书；后续内容不得虚构这些证据。

## Product Principles

1. 提供完整默认能力，同时保留清晰、实用的定制入口。
2. 优先保护公共 API、核心行为和升级路径的稳定性。
3. 隔离主题、Portal 和样式，避免干扰宿主应用。
4. 保持 core、React 编辑器域与 shared 的职责边界清晰。
5. 将国际化、键盘操作和无障碍作为长期产品质量要求。

## Accessibility & Inclusion

以 WCAG 2.2 AA 为目标，持续保障键盘操作、可见焦点、语义信息、颜色对比度和页面缩放能力。交互状态不能只依赖颜色传达。

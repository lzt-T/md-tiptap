---
name: zt-reactjs-tiptap
description: 内容优先、紧凑安静且可安全嵌入宿主应用的编辑器设计系统
colors:
  primary: "oklch(0.53 0.2 275)"
  primary-dark: "oklch(0.74 0.14 275)"
  canvas: "oklch(1 0 0)"
  canvas-dark: "oklch(0.145 0 0)"
  panel: "#ffffff"
  panel-dark: "oklch(0.265 0.005 255)"
  toolbar: "#f9fafb"
  subtle: "#f1f5f9"
  selection: "color-mix(in oklch, oklch(0.53 0.2 275) 10%, white)"
  ink: "#111827"
  text: "#374151"
  text-muted: "#64748b"
  border: "#e5e7eb"
  border-strong: "#cbd5e1"
  destructive: "#dc2626"
typography:
  headline:
    fontFamily: "inherit"
    fontSize: "2em"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "inherit"
    fontSize: "1.5em"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "inherit"
    fontSize: "1em"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "inherit"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.2
  caption:
    fontFamily: "inherit"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  pill: "999px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  toolbar-button:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
    height: "32px"
  toolbar-button-active:
    backgroundColor: "{colors.selection}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
    height: "32px"
  input-compact:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "30px"
  menu-surface:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "4px"
  dialog-surface:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
    width: "min(32rem, calc(100vw - 2rem))"
  editor-container:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
---

# Design System: zt-reactjs-tiptap

## Overview

**Creative North Star: "安静工作台"**

这套系统像一张安静、精确的工作台：编辑内容始终是视觉主体，工具在需要时清晰出现，完成任务后退回背景。中性表面提供稳定画布，清透靛青只承担状态、焦点和关键操作，不作为装饰铺陈。

界面密度紧凑但不拥挤。控制区使用小尺度、短动效和明确状态，内容区保留更宽裕的阅读与编辑节奏。系统明确避开沉闷企业蓝、大面积实心状态色和模板化管理后台观感。

**Key Characteristics:**

- 内容优先，中性画布保持安静。
- 清透靛青稀缺出现，只编码交互意义。
- 控件紧凑精确，内容区域留有呼吸空间。
- 常驻表面保持平面，浮层通过阴影抬升。
- 浅暗主题共享同一语义，并严格隔离于宿主页面。

## Colors

颜色体系由单一清透靛青与冷静中性色构成；浅暗主题改变明度关系，但不改变颜色职责。

### Primary

- **清透靛青**（`primary`）：用于主要按钮、链接、焦点、选中边框和交互状态，避免覆盖大面积常驻表面。
- **夜间靛青**（`primary-dark`）：暗色主题中的高可见强调色，与深色画布保持清晰对比。

### Neutral

- **纸白画布**（`canvas`）与**深墨画布**（`canvas-dark`）：编辑器的浅暗基础背景。
- **浮层白**（`panel`）与**夜间浮层**（`panel-dark`）：菜单、Popover 和 Dialog 的承载表面。
- **工具栏雾白**（`toolbar`）与**内容浅层**（`subtle`）：区分工作区层级而不制造装饰色块。
- **主墨色**（`ink`）、**控件文本**（`text`）与**辅助文本**（`text-muted`）：建立三级可读性层次。
- **细边界**（`border`）与**强边界**（`border-strong`）：分隔常驻表面和需要更清晰轮廓的控件。
- **危险红**（`destructive`）：仅用于删除、错误和不可逆操作。

**The Scarce Accent Rule.** 强调色只用于状态、焦点、链接和关键操作；常驻容器不得使用大面积实心强调色。

**The Semantic Theme Rule.** 浅暗主题必须通过相同语义角色映射，不得机械反相或改变状态含义。

## Typography

**Display Font:** 继承宿主字体（`inherit`）  
**Body Font:** 继承宿主字体（`inherit`）  
**Label/Mono Font:** 控件继承宿主字体；代码使用系统等宽字体栈

**Character:** 字体策略刻意低侵入，让编辑器自然融入宿主产品。层级依靠字号、字重、行高与间距建立，不依赖品牌字体或装饰性排版。

### Hierarchy

- **Headline**（700，`2em`，1.3）：编辑内容中的一级标题。
- **Title**（700，`1.5em`，1.4）：编辑内容中的二级标题和较强结构标题。
- **Body**（400，`1em`，1.7）：正文与长时间编辑内容，优先保证阅读舒适度。
- **Label**（500，`14px`，1.2）：工具栏按钮、菜单项和常规控件。
- **Caption**（500，`12px`，`16px`）：分组标题、帮助信息和次级标签。
- **Code**（系统等宽字体栈）：行内代码与代码块，保持技术内容的字形稳定。

**The Host Voice Rule.** 普通界面与正文继承宿主字体，只有代码内容切换到等宽字体；不要擅自引入新的品牌字体。

## Layout

编辑器采用纵向工作台结构：工具栏固定在内容区上方，正文滚动区使用 `12px 14px` 内边距，Portal 按用途分层但保持在主题作用域内。工具栏控件之间以 `2px` 紧凑排列，分组间通过细分隔线和 `4px` 间距建立节奏；菜单通常使用 `4px` 内边距和 `6–8px` 项内距。

浮层宽度服从内容并限制在 `calc(100vw - 16px)` 内；Dialog 在窄屏保留 `1rem` 双侧安全距离，并在 `640px` 以上采用最大 `32rem` 宽度。Demo 在 `720px` 以下将标题和操作区纵向排列。粗指针环境中的主要交互目标至少为 `44px × 44px`。

**The Dense Tools, Airy Content Rule.** 工具区使用紧凑间距，正文区使用更宽裕的行高与块间距；不要把工具栏密度复制到阅读内容中。

## Elevation & Depth

系统遵循“静止平面、浮层抬升”。编辑器容器、工具栏和常驻控件主要依靠背景明度与 1px 边框区分；阴影只用于分段切换的活动项、菜单、Popover 和 Dialog。暗色主题使用更深、更宽的阴影维持浮层分离度。

### Shadow Vocabulary

- **微抬升**（`0 1px 2px rgb(0 0 0 / 0.05)`）：分段切换活动项。
- **低浮层**（`0 1px 4px rgb(0 0 0 / 0.15)`）：小型操作表面。
- **中浮层**（`0 2px 8px rgb(0 0 0 / 0.15)`）：需要明确分离的小面板。
- **菜单浮层**（`0 4px 12px rgb(0 0 0 / 0.08), 0 2px 4px rgb(0 0 0 / 0.04)`）：工具栏菜单与 BubbleMenu。
- **模态浮层**（`0 4px 16px rgb(0 0 0 / 0.2)`）：CommandMenu 和 Dialog 等最高层级表面。

**The Flat-at-Rest Rule.** 常驻表面保持平面；只有脱离文档流并覆盖其他内容的界面才使用明显阴影。

## Shapes

形状语言紧凑、轻微圆润。行内代码和细小元素使用 `4px`，工具按钮与菜单项使用 `6px`，容器和浮层使用 `8px`，分段切换外壳使用 `10px`。滚动条滑块使用胶囊圆角，但普通按钮不得无缘由变成药丸形。

边框始终细而克制，常规轮廓为 1px；焦点使用 2px 主题色轮廓或 3px 半透明焦点环，并保留 `2px` 外偏移以避免吞没组件边界。

**The Radius Hierarchy Rule.** 元素越接近内容越小圆角，承载多个控件的表面使用更大圆角；不要在同一层级混用无关半径。

## Components

组件是紧凑安静的工具：默认状态低调，hover、focus、active 和 disabled 状态必须清晰且一致。

### Buttons

- **Shape:** 通用按钮使用 `8px` 圆角和 `36px` 默认高度；工具栏按钮使用 `6px` 圆角和 `32px` 最小尺寸。
- **Primary:** 清透靛青背景、浅色文字、`8px 16px` 内边距；hover 仅轻微加深。
- **Outline / Ghost:** Outline 使用细边框与画布背景，Ghost 默认透明；hover 进入中性浅层。
- **Active / Focus:** 格式激活态使用浅靛青背景与靛青图标，不使用大面积实心色；键盘焦点必须保留可见轮廓。
- **Disabled:** 禁止交互并降低到 50% 左右不透明度，不再响应 hover。

### Inputs / Fields

- **Style:** 紧凑输入框使用 `30px` 高度、`6px` 圆角、1px 中性边框和 `0 8px` 内边距。
- **Focus:** 聚焦时边框切换为主题强调色，复杂表单可增加半透明焦点环。
- **Error / Disabled:** 错误使用危险红边框与语义提示；禁用状态降低不透明度并显示不可用光标。

### Cards / Containers

- **Corner Style:** 编辑器容器、菜单和面板统一使用 `8px` 圆角。
- **Background:** 常驻容器使用画布或轻微色调表面，浮层使用 Panel 表面。
- **Shadow Strategy:** 常驻容器仅用边框；菜单、Popover 和 Dialog 使用对应浮层阴影。
- **Internal Padding:** 编辑内容为 `12px 14px`，菜单壳为 `4px`，Dialog 为 `24px`。

### Menus & Toolbars

- **Toolbar:** 雾白背景、底部细边框、`6px 12px` 内边距；按钮按 `2px` 间距紧凑排列。
- **Menu Items:** 典型高度至少 `32px`，使用 `6px` 圆角和 `8px` 水平内距；选中态使用浅强调色表面。
- **Floating Menus:** 使用 `8px` 圆角、细边框和菜单浮层阴影，进入动效为 0.14–0.15s 的轻微淡入与位移。

### Dialogs

- **Surface:** 浮层背景、`10px` 圆角、1px 边框、`24px` 内边距和模态阴影。
- **Overlay:** 浅色主题使用约 56% 黑色遮罩，暗色主题约 62%。
- **Motion:** 200ms 淡入与轻微缩放；必须遵守 reduced-motion 偏好。

### Segmented Controls

- **Shell:** `10px` 圆角、`4px` 内边距和 muted 背景。
- **Option:** `8px` 圆角、`7px 12px` 内边距；活动项使用画布背景与微抬升阴影。

## Do's and Don'ts

### Do:

- **Do** 让编辑内容保持最高视觉优先级，控制表面退居辅助位置。
- **Do** 用语义 Token 同时维护浅色与暗色主题，并保持 Portal 内外视觉一致。
- **Do** 使用浅色选中面、图标颜色和可见焦点共同表达状态。
- **Do** 在粗指针环境把主要交互目标提升到至少 `44px × 44px`。
- **Do** 为进入、加载和光标动效提供 reduced-motion 降级。

### Don't:

- **Don't** 使用沉闷企业蓝、大面积实心状态色或模板化后台配色。
- **Don't** 给常驻容器添加无意义阴影；边框和色调已经承担基础分层。
- **Don't** 用颜色作为状态的唯一线索，必须同时保留形状、位置、图标或语义属性。
- **Don't** 在编辑器作用域外声明主题变量或把浮层挂到错误的 Portal 层级。
- **Don't** 为追求品牌感覆盖宿主字体或引入与内容无关的装饰元素。

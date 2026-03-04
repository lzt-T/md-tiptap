import type { Editor } from "@tiptap/react";

export type TextAlignValue = "left" | "center" | "right" | "justify";

export function toggleBold(editor: Editor): void {
  editor.chain().focus().toggleBold().run();
}

export function toggleItalic(editor: Editor): void {
  editor.chain().focus().toggleItalic().run();
}

export function toggleUnderline(editor: Editor): void {
  editor.chain().focus().toggleUnderline().run();
}

export function toggleStrike(editor: Editor): void {
  editor.chain().focus().toggleStrike().run();
}

export function toggleCode(editor: Editor): void {
  editor.chain().focus().toggleCode().run();
}

export function toggleSuperscript(editor: Editor): void {
  editor.chain().focus().toggleSuperscript().run();
}

export function toggleSubscript(editor: Editor): void {
  editor.chain().focus().toggleSubscript().run();
}

export function setTextAlign(
  editor: Editor,
  align: TextAlignValue
): void {
  editor.chain().focus().setTextAlign(align).run();
}

export function setColor(editor: Editor, color: string): void {
  editor.chain().focus().setColor(color).run();
}

export function unsetColor(editor: Editor): void {
  editor.chain().focus().unsetColor().run();
}

export function setHighlight(editor: Editor, color: string): void {
  editor.chain().focus().setHighlight({ color }).run();
}

export function unsetHighlight(editor: Editor): void {
  editor.chain().focus().unsetHighlight().run();
}

export function setHeading(
  editor: Editor,
  level: 1 | 2 | 3
): void {
  editor.chain().focus().setNode("heading", { level }).run();
}

/**
 * 切换标题：若当前已是该级别标题则改为段落，否则设为该级别标题。
 * 用于工具栏「再次点击同一项可取消」的交互。
 */
export function toggleHeading(
  editor: Editor,
  level: 1 | 2 | 3
): void {
  if (editor.isActive("heading", { level })) {
    editor.chain().focus().setNode("paragraph").run();
  } else {
    editor.chain().focus().setNode("heading", { level }).run();
  }
}

export function toggleBulletList(editor: Editor): void {
  editor.chain().focus().toggleBulletList().run();
}

export function toggleOrderedList(editor: Editor): void {
  editor.chain().focus().toggleOrderedList().run();
}

export function toggleTaskList(editor: Editor): void {
  editor.chain().focus().toggleTaskList().run();
}

/** 不允许在表格内部再插入表格（与 EditorMode 无关） */
export function insertTable(editor: Editor): void {
  if (editor.isActive('table')) return;
  editor
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();
}

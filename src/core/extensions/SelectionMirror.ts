import { Extension } from "@tiptap/core";
import type { Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin, PluginKey } from "@tiptap/pm/state";

/** 选区镜像高亮样式类名。 */
const SELECTION_MIRROR_CLASS = "zt-selection-mirror";

// 选区镜像插件键，同时承载当前编辑器交互域的聚焦状态。
const SELECTION_MIRROR_PLUGIN_KEY = new PluginKey<boolean>("selectionMirror");

/** 在指定范围内按文本块切分并构建行内高亮装饰。 */
function createMirrorDecorations(
  doc: ProseMirrorNode,
  from: number,
  to: number,
): DecorationSet {
  const decorations: Decoration[] = [];
  const safeFrom = Math.max(0, Math.min(from, doc.content.size));
  const safeTo = Math.max(0, Math.min(to, doc.content.size));
  if (safeTo <= safeFrom) return DecorationSet.empty;

  doc.nodesBetween(safeFrom, safeTo, (node, pos) => {
    if (!node.isTextblock) return;
    const blockStart = pos + 1;
    const blockEnd = pos + node.nodeSize - 1;
    const markFrom = Math.max(safeFrom, blockStart);
    const markTo = Math.min(safeTo, blockEnd);
    if (markTo <= markFrom) return;
    decorations.push(
      Decoration.inline(markFrom, markTo, { class: SELECTION_MIRROR_CLASS }),
    );
  });

  return decorations.length > 0
    ? DecorationSet.create(doc, decorations)
    : DecorationSet.empty;
}

/** 同步选区镜像的聚焦状态，并避免派发无效事务。 */
export function setSelectionMirrorFocused(
  editor: Editor,
  isFocused: boolean,
): void {
  if (editor.isDestroyed) return;

  // 插件当前保存的聚焦状态。
  const currentIsFocused = SELECTION_MIRROR_PLUGIN_KEY.getState(editor.state);
  if (
    typeof currentIsFocused !== "boolean" ||
    currentIsFocused === isFocused
  ) {
    return;
  }

  editor.view.dispatch(
    editor.state.tr.setMeta(SELECTION_MIRROR_PLUGIN_KEY, isFocused),
  );
}

/** 仅基于当前文本选区，镜像显示编辑器高亮。 */
export const SelectionMirror = Extension.create({
  name: "selectionMirror",

  /** 创建由显式聚焦状态驱动的选区镜像插件。 */
  addProseMirrorPlugins() {
    return [
      new Plugin<boolean>({
        key: SELECTION_MIRROR_PLUGIN_KEY,
        state: {
          /** 默认隐藏选区镜像，等待编辑器焦点控制器同步。 */
          init: () => false,
          /** 仅在事务携带聚焦 meta 时更新插件状态。 */
          apply(transaction, isFocused) {
            // 事务指定的下一聚焦状态。
            const nextIsFocused = transaction.getMeta(
              SELECTION_MIRROR_PLUGIN_KEY,
            );
            return typeof nextIsFocused === "boolean"
              ? nextIsFocused
              : isFocused;
          },
        },
        props: {
          /** 根据插件聚焦状态为当前逻辑选区生成镜像装饰。 */
          decorations: (state) => {
            if (!SELECTION_MIRROR_PLUGIN_KEY.getState(state)) {
              return DecorationSet.empty;
            }
            const { selection } = state;
            if (selection.empty) return DecorationSet.empty;
            return createMirrorDecorations(
              state.doc,
              selection.from,
              selection.to,
            );
          },
        },
      }),
    ];
  },
});

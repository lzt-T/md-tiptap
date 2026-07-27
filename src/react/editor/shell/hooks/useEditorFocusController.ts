import { useEffect, useRef, useState } from "react";
import type {
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from "react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Selection } from "@tiptap/pm/state";
import type { Editor } from "@tiptap/react";
import { setSelectionMirrorFocused } from "@/core/extensions/SelectionMirror";
import { HeadlessToolbarMode } from "@/react/editor/types";

// 编辑器焦点域标识属性，用于关联根容器与 body 下的 Dialog 宿主。
const EDITOR_FOCUS_SCOPE_ATTRIBUTE = "data-editor-focus-scope";

// 聚焦稳定等待时间，避免旧选区样式在恢复焦点时短暂闪现。
const FOCUS_STABLE_DELAY_MS = 80;

interface UseEditorFocusControllerOptions {
  editor: Editor | null;
  isNotionLike: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  focusScopeId: string;
  headlessToolbarMode: HeadlessToolbarMode;
  onInlineMathClick: (node: ProseMirrorNode, pos: number) => void;
  onBlockMathClick: (node: ProseMirrorNode, pos: number) => void;
}

/**
 * 管理编辑器交互域的聚焦状态，并保留首次点击公式的兼容处理。
 */
export function useEditorFocusController({
  editor,
  isNotionLike,
  containerRef,
  focusScopeId,
  headlessToolbarMode,
  onInlineMathClick,
  onBlockMathClick,
}: UseEditorFocusControllerOptions) {
  // 编辑器交互域是否处于聚焦态。
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  // 编辑器聚焦是否已通过视觉稳定等待期。
  const [isEditorFocusStable, setIsEditorFocusStable] = useState(false);
  // 聚焦稳定定时器 id。
  const focusStableTimerIdRef = useRef<number | null>(null);
  // 延迟失焦检查的 requestAnimationFrame id。
  const blurCheckRafIdRef = useRef<number | null>(null);
  // 未聚焦点击公式时缓存的待处理元素。
  const pendingMathClickRef = useRef<{
    element: Element;
    isBlock: boolean;
  } | null>(null);

  /** 取消尚未完成的聚焦稳定任务。 */
  const clearFocusStableTimer = () => {
    if (focusStableTimerIdRef.current == null) return;
    window.clearTimeout(focusStableTimerIdRef.current);
    focusStableTimerIdRef.current = null;
  };

  /** 取消尚未执行的失焦边界检查。 */
  const clearBlurCheck = () => {
    if (blurCheckRafIdRef.current == null) return;
    window.cancelAnimationFrame(blurCheckRafIdRef.current);
    blurCheckRafIdRef.current = null;
  };

  /** 判断事件目标是否位于编辑器 DOM 根容器内。 */
  const isInsideEditorContainer = (target: EventTarget | null) => {
    if (!(target instanceof Node)) return false;
    return Boolean(containerRef.current?.contains(target));
  };

  /** 判断事件目标是否属于当前编辑器的焦点域。 */
  const isInsideEditorFocusScope = (target: EventTarget | null) => {
    if (isInsideEditorContainer(target)) return true;
    if (!(target instanceof Element)) return false;

    // 目标最近的编辑器焦点域宿主。
    const scopeElement = target.closest(`[${EDITOR_FOCUS_SCOPE_ATTRIBUTE}]`);
    return (
      scopeElement?.getAttribute(EDITOR_FOCUS_SCOPE_ATTRIBUTE) === focusScopeId
    );
  };

  /** 激活编辑器聚焦态并启动视觉稳定等待。 */
  const activateEditorFocus = () => {
    clearBlurCheck();
    if (isEditorFocused) return;

    setIsEditorFocused(true);
    setIsEditorFocusStable(false);
    clearFocusStableTimer();
    focusStableTimerIdRef.current = window.setTimeout(() => {
      setIsEditorFocusStable(true);
      focusStableTimerIdRef.current = null;
    }, FOCUS_STABLE_DELAY_MS);
  };

  /** 折叠范围选区并将编辑器交互域切换为失焦态。 */
  const deactivateEditorFocus = () => {
    clearFocusStableTimer();
    if (editor && !editor.isDestroyed) {
      // 真正失焦时需要清除的当前逻辑选区。
      const selection = editor.state.selection;
      if (!selection.empty) {
        // 原选区起点处的折叠选区。
        const collapsedSelection = Selection.near(
          editor.state.doc.resolve(selection.from),
          1,
        );
        editor.view.dispatch(
          editor.state.tr.setSelection(collapsedSelection),
        );
      }
    }
    setIsEditorFocused(false);
    setIsEditorFocusStable(false);
  };

  /** 浮层关闭后仅在焦点真正离开当前编辑器交互域时执行失焦收口。 */
  const handleFocusScopeExit = () => {
    if (isInsideEditorFocusScope(document.activeElement)) return;
    deactivateEditorFocus();
  };

  /** 补触发失焦状态下首次点击的公式节点事件。 */
  const runPendingMathClick = () => {
    // 当前待处理的公式点击。
    const pendingMathClick = pendingMathClickRef.current;
    if (!editor || !pendingMathClick) return;
    pendingMathClickRef.current = null;

    window.requestAnimationFrame(() => {
      try {
        // 公式元素当前对应的文档位置。
        const position = editor.view.posAtDOM(pendingMathClick.element, 0);
        // 公式位置对应的 ProseMirror 节点。
        const node = editor.state.doc.nodeAt(position);
        if (!node) return;
        if (pendingMathClick.isBlock) {
          onBlockMathClick(node, position);
          return;
        }
        onInlineMathClick(node, position);
      } catch {
        // 元素可能已被移除，忽略即可。
      }
    });
  };

  /** 记录失焦状态下按下的公式节点，等待焦点进入后补触发。 */
  const handleMouseDownCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isEditorFocused || !(event.target instanceof Element)) return;

    // 当前指针命中的公式元素。
    const mathElement = event.target.closest(".tiptap-mathematics-render");
    if (!mathElement) return;
    pendingMathClickRef.current = {
      element: mathElement,
      isBlock: mathElement.getAttribute("data-type") === "block-math",
    };
  };

  /** 捕获焦点进入编辑器交互域，并处理待触发公式点击。 */
  const handleFocusCapture = () => {
    activateEditorFocus();
    runPendingMathClick();
  };

  /** 捕获焦点离开，并在下一帧确认是否真正越过编辑器边界。 */
  const handleBlurCapture = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (isInsideEditorFocusScope(event.relatedTarget)) return;

    clearBlurCheck();
    blurCheckRafIdRef.current = window.requestAnimationFrame(() => {
      blurCheckRafIdRef.current = null;
      if (isInsideEditorFocusScope(document.activeElement)) return;
      deactivateEditorFocus();
    });
  };

  // 保留聚焦状态变化日志，便于调试交互域边界。
  useEffect(() => {
    console.log("Editor focus state changed:", isEditorFocused);
    if (!editor) return;
    setSelectionMirrorFocused(editor, isEditorFocused);
  }, [editor, isEditorFocused]);

  useEffect(() => {
    return () => {
      if (focusStableTimerIdRef.current != null) {
        window.clearTimeout(focusStableTimerIdRef.current);
      }
      if (blurCheckRafIdRef.current != null) {
        window.cancelAnimationFrame(blurCheckRafIdRef.current);
      }
    };
  }, []);

  // Headless 模式工具栏显示开关。
  const showHeadlessToolbar =
    !isNotionLike &&
    (headlessToolbarMode === HeadlessToolbarMode.Always ||
      (headlessToolbarMode === HeadlessToolbarMode.OnFocus && isEditorFocused));

  // 代码语言菜单显示开关。
  const showCodeBlockLanguageMenu = isEditorFocused && isEditorFocusStable;

  return {
    isEditorFocused,
    isEditorFocusStable,
    showHeadlessToolbar,
    showCodeBlockLanguageMenu,
    isInsideEditorContainer,
    handleFocusScopeExit,
    handleMouseDownCapture,
    handleFocusCapture,
    handleBlurCapture,
  };
}

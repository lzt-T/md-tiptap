import type { Editor } from "@tiptap/react";
import { useState, useEffect } from "react";
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Palette,
  MoreHorizontal,
  Superscript,
  Subscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  List,
  ListOrdered,
  ListTodo,
  Table,
  Sigma,
  SquareFunction,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorCommands } from "@/hooks";
import ColorPicker from "../ColorPicker";
import "./Toolbar.css";

interface ToolbarProps {
  editor: Editor;
  /** 打开数学公式弹窗（headless 时由 TiptapEditor 传入） */
  onOpenMathDialog?: (
    type: "inline" | "block",
    initialValue: string,
    callback: (latex: string) => void
  ) => void;
  /** 打开图片上传弹窗（headless 时由 TiptapEditor 传入） */
  onOpenImageDialog?: (callback: (src: string, alt?: string) => void) => void;
}

const Toolbar = ({
  editor,
  onOpenMathDialog,
  onOpenImageDialog,
}: ToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState<
    "text" | "highlight" | null
  >(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMoreMenuReady, setIsMoreMenuReady] = useState(false);
  const [isHeadingMenuReady, setIsHeadingMenuReady] = useState(false);
  /** 选区/内容变化时自增，用于让工具栏根据当前选区重新计算 isActive 并重渲染 */
  const [selectionKey, setSelectionKey] = useState(0);

  /* 是否聚焦公式或图片（此时禁用格式/块级操作按钮） */
  const isFocusNodeOnly =
    !!editor &&
    (editor.isActive("inlineMath") ||
      editor.isActive("blockMath") ||
      editor.isActive("image"));

  useEffect(() => {
    if (!editor) return;
    const onSelectionUpdate = () => {
      setSelectionKey((k) => k + 1);
      if (
        editor.isActive("inlineMath") ||
        editor.isActive("blockMath") ||
        editor.isActive("image")
      ) {
        setShowHeadingMenu(false);
        setShowMoreMenu(false);
        setShowColorPicker(null);
      }
    };
    editor.on("selectionUpdate", onSelectionUpdate);
    editor.on("transaction", onSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", onSelectionUpdate);
      editor.off("transaction", onSelectionUpdate);
    };
  }, [editor]);

  const { refs, floatingStyles } = useFloating({
    open: showColorPicker !== null,
    placement: "bottom-start",
    middleware: [offset(8), flip({ padding: 16 }), shift({ padding: 16 })],
  });

  const { refs: moreRefs, floatingStyles: moreFloatingStyles } = useFloating({
    open: showMoreMenu,
    placement: "bottom-start",
    middleware: [offset(8), flip({ padding: 16 }), shift({ padding: 16 })],
  });

  const { refs: headingRefs, floatingStyles: headingFloatingStyles } =
    useFloating({
      open: showHeadingMenu,
      placement: "bottom-start",
      middleware: [offset(8), flip({ padding: 16 }), shift({ padding: 16 })],
    });

  useEffect(() => {
    if (showColorPicker) {
      const t0 = setTimeout(() => setIsReady(false), 0);
      const t = setTimeout(() => setIsReady(true), 50);
      return () => {
        clearTimeout(t0);
        clearTimeout(t);
      };
    }
    const t = setTimeout(() => setIsReady(false), 0);
    return () => clearTimeout(t);
  }, [showColorPicker]);

  useEffect(() => {
    if (showMoreMenu) {
      const t0 = setTimeout(() => setIsMoreMenuReady(false), 0);
      const t = setTimeout(() => setIsMoreMenuReady(true), 50);
      return () => {
        clearTimeout(t0);
        clearTimeout(t);
      };
    }
    const t = setTimeout(() => setIsMoreMenuReady(false), 0);
    return () => clearTimeout(t);
  }, [showMoreMenu]);

  useEffect(() => {
    if (showHeadingMenu) {
      const t0 = setTimeout(() => setIsHeadingMenuReady(false), 0);
      const t = setTimeout(() => setIsHeadingMenuReady(true), 50);
      return () => {
        clearTimeout(t0);
        clearTimeout(t);
      };
    }
    const t = setTimeout(() => setIsHeadingMenuReady(false), 0);
    return () => clearTimeout(t);
  }, [showHeadingMenu]);

  const { format, block, dialogs } = useEditorCommands(editor, {
    onOpenMathDialog,
    onOpenImageDialog,
  });

  const currentHeadingLevel = editor.isActive("heading", { level: 1 })
    ? 1
    : editor.isActive("heading", { level: 2 })
    ? 2
    : editor.isActive("heading", { level: 3 })
    ? 3
    : null;

  const onTextColorSelect = (color: string) => {
    format.setColor(color);
    setShowColorPicker(null);
  };

  const onHighlightColorSelect = (color: string) => {
    if (color === "") format.unsetHighlight();
    else format.setHighlight(color);
    setShowColorPicker(null);
  };

  const onHeadingSelect = (level: 1 | 2 | 3) => {
    block.setHeading(level);
    setShowHeadingMenu(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div
      className="editor-toolbar"
      data-selection-key={selectionKey}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="editor-toolbar-inner">
        <button
          type="button"
          ref={(el) => {
            if (showHeadingMenu) headingRefs.setReference(el);
          }}
          onClick={() => {
            if (isFocusNodeOnly) return;
            setShowHeadingMenu(!showHeadingMenu);
          }}
          className={cn(
            "editor-toolbar-btn",
            (showHeadingMenu || currentHeadingLevel !== null) && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          title="标题"
        >
          <span className="editor-toolbar-heading-btn">H</span>
          <ChevronDown size={14} className="editor-toolbar-chevron" />
        </button>
        <span className="editor-toolbar-separator" />
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("bulletList") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            block.toggleBulletList();
          }}
          title="无序列表"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("orderedList") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            block.toggleOrderedList();
          }}
          title="有序列表"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("taskList") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            block.toggleTaskList();
          }}
          title="任务列表"
        >
          <ListTodo size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            (editor.isActive("table") || isFocusNodeOnly) && "is-disabled"
          )}
          onClick={() => {
            if (editor.isActive("table") || isFocusNodeOnly) return;
            block.insertTable();
          }}
          title="插入表格"
        >
          <Table size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            (!onOpenMathDialog || isFocusNodeOnly) && "is-disabled"
          )}
          onClick={() => {
            if (!onOpenMathDialog || isFocusNodeOnly) return;
            dialogs.openInlineMath();
          }}
          title="行内公式"
        >
          <Sigma size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            (!onOpenMathDialog || isFocusNodeOnly) && "is-disabled"
          )}
          onClick={() => {
            if (!onOpenMathDialog || isFocusNodeOnly) return;
            dialogs.openBlockMath();
          }}
          title="块公式"
        >
          <SquareFunction size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            (!onOpenImageDialog || isFocusNodeOnly) && "is-disabled"
          )}
          onClick={() => {
            if (!onOpenImageDialog || isFocusNodeOnly) return;
            dialogs.openImage();
          }}
          title="图片"
        >
          <Image size={16} />
        </button>
        <span className="editor-toolbar-separator" />
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("bold") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            format.toggleBold();
          }}
          title="粗体 (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("italic") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            format.toggleItalic();
          }}
          title="斜体 (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("underline") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            format.toggleUnderline();
          }}
          title="下划线 (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("strike") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            format.toggleStrike();
          }}
          title="删除线"
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("code") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          onClick={() => {
            if (isFocusNodeOnly) return;
            format.toggleCode();
          }}
          title="行内代码"
        >
          <Code size={16} />
        </button>
        <span className="editor-toolbar-separator" />
        <button
          type="button"
          ref={(el) => {
            if (showColorPicker === "highlight") {
              refs.setReference(el);
            }
          }}
          onClick={() => {
            if (isFocusNodeOnly) return;
            setShowColorPicker(
              showColorPicker === "highlight" ? null : "highlight"
            );
          }}
          className={cn(
            "editor-toolbar-btn",
            editor.isActive("highlight") && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          title="高亮颜色"
        >
          <Highlighter size={16} />
        </button>
        <button
          type="button"
          ref={(el) => {
            if (showColorPicker === "text") {
              refs.setReference(el);
            }
          }}
          onClick={() => {
            if (isFocusNodeOnly) return;
            setShowColorPicker(showColorPicker === "text" ? null : "text");
          }}
          className={cn(
            "editor-toolbar-btn",
            isFocusNodeOnly && "is-disabled"
          )}
          title="文字颜色"
        >
          <Palette size={16} />
        </button>
        <span className="editor-toolbar-separator" />
        <button
          type="button"
          ref={(el) => {
            if (showMoreMenu) {
              moreRefs.setReference(el);
            }
          }}
          onClick={() => {
            if (isFocusNodeOnly) return;
            setShowMoreMenu(!showMoreMenu);
          }}
          className={cn(
            "editor-toolbar-btn",
            showMoreMenu && "is-active",
            isFocusNodeOnly && "is-disabled"
          )}
          title="更多"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {showColorPicker && (
        <>
          <div
            className="editor-toolbar-overlay"
            onClick={() => setShowColorPicker(null)}
            aria-hidden
          />
          <div
            ref={(el) => refs.setFloating(el)}
            className="editor-toolbar-dropdown"
            style={{
              ...floatingStyles,
              opacity: isReady ? 1 : 0,
              transition: "opacity 0.1s ease",
            }}
          >
            <ColorPicker
              type={showColorPicker}
              onColorSelect={
                showColorPicker === "text"
                  ? onTextColorSelect
                  : onHighlightColorSelect
              }
            />
          </div>
        </>
      )}

      {showMoreMenu && (
        <>
          <div
            className="editor-toolbar-overlay"
            onClick={() => setShowMoreMenu(false)}
            aria-hidden
          />
          <div
            ref={(el) => moreRefs.setFloating(el)}
            className="editor-toolbar-more-menu"
            style={{
              ...moreFloatingStyles,
              opacity: isMoreMenuReady ? 1 : 0,
              transition: "opacity 0.1s ease",
            }}
          >
            <button
              type="button"
              className={cn(
                "editor-toolbar-btn",
                editor.isActive("superscript") && "is-active"
              )}
              onClick={() => {
                format.toggleSuperscript();
                setShowMoreMenu(false);
              }}
              title="上标"
            >
              <Superscript size={16} />
            </button>
            <button
              type="button"
              className={cn(
                "editor-toolbar-btn",
                editor.isActive("subscript") && "is-active"
              )}
              onClick={() => {
                format.toggleSubscript();
                setShowMoreMenu(false);
              }}
              title="下标"
            >
              <Subscript size={16} />
            </button>
            <div className="editor-toolbar-more-separator" />
            <button
              type="button"
              className={cn(
                "editor-toolbar-btn",
                editor.isActive({ textAlign: "left" }) && "is-active"
              )}
              onClick={() => {
                format.setTextAlign("left");
                setShowMoreMenu(false);
              }}
              title="左对齐"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              className={cn(
                "editor-toolbar-btn",
                editor.isActive({ textAlign: "center" }) && "is-active"
              )}
              onClick={() => {
                format.setTextAlign("center");
                setShowMoreMenu(false);
              }}
              title="居中对齐"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              className={cn(
                "editor-toolbar-btn",
                editor.isActive({ textAlign: "right" }) && "is-active"
              )}
              onClick={() => {
                format.setTextAlign("right");
                setShowMoreMenu(false);
              }}
              title="右对齐"
            >
              <AlignRight size={16} />
            </button>
            <button
              type="button"
              className={cn(
                "editor-toolbar-btn",
                editor.isActive({ textAlign: "justify" }) && "is-active"
              )}
              onClick={() => {
                format.setTextAlign("justify");
                setShowMoreMenu(false);
              }}
              title="两端对齐"
            >
              <AlignJustify size={16} />
            </button>
          </div>
        </>
      )}

      {showHeadingMenu && (
        <>
          <div
            className="editor-toolbar-overlay"
            onClick={() => setShowHeadingMenu(false)}
            aria-hidden
          />
          <div
            ref={(el) => headingRefs.setFloating(el)}
            className="editor-toolbar-heading-menu"
            style={{
              ...headingFloatingStyles,
              opacity: isHeadingMenuReady ? 1 : 0,
              transition: "opacity 0.1s ease",
            }}
          >
            {([1, 2, 3] as const).map((level) => (
              <button
                key={level}
                type="button"
                className={`editor-toolbar-heading-item ${
                  currentHeadingLevel === level ? "is-active" : ""
                }`}
                onClick={() => onHeadingSelect(level)}
                title={`Heading ${level}`}
              >
                <span className="editor-toolbar-heading-num">
                  H{["₁", "₂", "₃"][level - 1]}
                </span>
                <span>Heading {level}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Toolbar;

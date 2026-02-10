import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useFloating, flip, shift, offset } from "@floating-ui/react";
import ColorPicker from "../ColorPicker";
import "./BubbleMenu.css";

interface BubbleMenuProps {
  editor: Editor;
}

const BubbleMenu = ({ editor }: BubbleMenuProps) => {
  const [showColorPicker, setShowColorPicker] = useState<
    "text" | "highlight" | null
  >(null);
  const [isReady, setIsReady] = useState(false);

  // 使用 Floating UI 处理颜色选择器定位
  const { refs, floatingStyles } = useFloating({
    open: showColorPicker !== null,
    placement: "bottom",
    middleware: [
      offset(8), // 距离按钮 8px
      flip({ padding: 16 }), // 自动翻转避免溢出
      shift({ padding: 16 }), // 保持在视口内
    ],
  });

  // useEffect 必须在条件语句之前调用
  useEffect(() => {
    if (showColorPicker) {
      setIsReady(false);
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [showColorPicker]);

  if (!editor) {
    return null;
  }

  const handleFormat = (formatAction: () => void) => {
    const { to } = editor.state.selection;
    formatAction();
    // 取消选中,将光标移到选中区域末尾
    editor.commands.setTextSelection(to);
  };

  const handleTextColorSelect = (color: string) => {
    handleFormat(() => editor.chain().focus().setColor(color).run());
    setShowColorPicker(null);
  };

  const handleHighlightColorSelect = (color: string) => {
    handleFormat(() => editor.chain().focus().setHighlight({ color }).run());
    setShowColorPicker(null);
  };

  return (
    <>
      <TiptapBubbleMenu editor={editor} className="bubble-menu">
        <button
          onClick={() =>
            handleFormat(() => editor.chain().focus().toggleBold().run())
          }
          className={editor.isActive("bold") ? "is-active" : ""}
          title="粗体 (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() =>
            handleFormat(() => editor.chain().focus().toggleItalic().run())
          }
          className={editor.isActive("italic") ? "is-active" : ""}
          title="斜体 (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() =>
            handleFormat(() => editor.chain().focus().toggleUnderline().run())
          }
          className={editor.isActive("underline") ? "is-active" : ""}
          title="下划线 (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          onClick={() =>
            handleFormat(() => editor.chain().focus().toggleStrike().run())
          }
          className={editor.isActive("strike") ? "is-active" : ""}
          title="删除线"
        >
          <s>S</s>
        </button>
        <span className="separator">|</span>
        <button
          onClick={() =>
            handleFormat(() => editor.chain().focus().toggleCode().run())
          }
          className={editor.isActive("code") ? "is-active" : ""}
          title="行内代码"
        >
          {"</>"}
        </button>
        <span className="separator">|</span>
        {/* 官方是免费的 */}
        <button
          ref={(el) => {
            if (showColorPicker === "highlight") {
              refs.setReference(el);
            }
          }}
          onClick={() =>
            setShowColorPicker(
              showColorPicker === "highlight" ? null : "highlight"
            )
          }
          className={editor.isActive("highlight") ? "is-active" : ""}
          title="高亮颜色"
        >
          🖍️
        </button>
        {/* 官方的需要钱 */}
        <button
          ref={(el) => {
            if (showColorPicker === "text") {
              refs.setReference(el);
            }
          }}
          onClick={() =>
            setShowColorPicker(showColorPicker === "text" ? null : "text")
          }
          title="文字颜色"
        >
          🎨
        </button>
      </TiptapBubbleMenu>

      {showColorPicker && (
        <>
          <div
            className="color-picker-overlay"
            onClick={() => setShowColorPicker(null)}
          />
          <div
            // eslint-disable-next-line
            ref={refs.setFloating}
            className="color-picker-container"
            style={floatingStyles}
          >
            {
              <ColorPicker
                type={showColorPicker}
                onColorSelect={
                  showColorPicker === "text"
                    ? handleTextColorSelect
                    : handleHighlightColorSelect
                }
                style={{
                  opacity: isReady ? 1 : 0,
                  transition: "opacity 0.1s ease",
                }}
              />
            }
          </div>
        </>
      )}
    </>
  );
};

export default BubbleMenu;

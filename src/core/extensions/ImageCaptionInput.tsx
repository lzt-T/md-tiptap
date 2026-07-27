import { useLayoutEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

interface ImageCaptionInputProps {
  /** 图片描述输入框的无内容提示。 */
  placeholder: string;
  /** 图片描述输入框的无障碍标签。 */
  ariaLabel: string;
  /** 是否在输入框挂载后自动聚焦一次。 */
  autoFocus?: boolean;
  /** 当前图片描述文本。 */
  caption?: string;
  /** 当前图片描述是否允许编辑。 */
  editable: boolean;
  /** 自动聚焦完成后的回调，用于清除外层一次性状态。 */
  onAutoFocusComplete?: () => void;
  /** 图片描述变更回调。 */
  onCaptionChange: (caption: string) => void;
  /** 回车确认描述时的回调。 */
  onEnter?: () => void;
}

/** 渲染图片描述输入框，并隔离输入事件避免影响编辑器选择。 */
export function ImageCaptionInput({
  placeholder,
  ariaLabel,
  autoFocus = false,
  caption = "",
  editable,
  onAutoFocusComplete,
  onCaptionChange,
  onEnter,
}: ImageCaptionInputProps) {
  // 当前是否有可展示的描述文本。
  const hasCaption = caption?.trim().length > 0;
  // 描述输入框节点，用于按内容自动撑高。
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    // 当前描述输入框节点。
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [caption]);

  useLayoutEffect(() => {
    // 当前描述输入框节点。
    const textarea = textareaRef.current;
    if (!autoFocus || !editable || !textarea) return;

    // 聚焦后把光标放在已有描述末尾。
    const cursorPosition = textarea.value.length;
    textarea.focus();
    textarea.setSelectionRange(cursorPosition, cursorPosition);
    onAutoFocusComplete?.();
  }, [autoFocus, editable, onAutoFocusComplete]);

  /** 阻止输入区域触发图片节点的选择、拖拽等外层交互。 */
  const stopEditorEvent = (event: MouseEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
  };

  /** 阻止输入时的按键继续冒泡到编辑器快捷键。 */
  const stopEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;

    event.preventDefault();
    onEnter?.();
  };

  /** 将图片描述写回当前图片节点属性。 */
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onCaptionChange(event.target.value);
  };

  if (!editable && !hasCaption) return null;

  if (!editable) {
    return <div className="image-caption-text">{caption}</div>;
  }

  return (
    <textarea
      ref={textareaRef}
      className="image-caption-input"
      value={caption}
      placeholder={placeholder}
      aria-label={ariaLabel}
      rows={1}
      onChange={handleChange}
      onMouseDown={stopEditorEvent}
      onClick={stopEditorEvent}
      onKeyDown={stopEditorKeyDown}
    />
  );
}

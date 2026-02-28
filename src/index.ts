// 导出主组件
export { default as TiptapEditor } from "./components/TiptapEditor";

// 导出组件类型
export type {
  TiptapEditorProps,
  EditorMode,
  HeadlessToolbarMode,
} from "./components/TiptapEditor/types";

// 导出公式分类相关，便于扩展 formulaCategories
export { FORMULA_CATEGORIES } from "./config/formulaCategories";
export type { FormulaPickerCategory } from "./config/formulaCategories";
export type { FormulaSnippetItem } from "./components/TiptapEditor/MathDialog/FormulaSnippetButton";

// 导入样式，这样会被打包到 style.css
import "./style.css";

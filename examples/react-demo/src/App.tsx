import { useState, useEffect } from "react";
import {
  ReactTiptapEditor,
  EditorMode,
  EditorTheme,
  htmlToPlainText,
} from "../../../src/index";
import "./App.css";

// 覆盖编辑器主要富文本能力的中文演示文档。
const DEMO_CONTENT = String.raw`
  <h1>zt-reactjs-tiptap 功能演示</h1>
  <p>这是一个基于 <strong>React</strong>、<strong>TypeScript</strong> 与 <strong>TipTap</strong> 构建的富文本编辑器。你可以直接修改本文档，体验常用编辑能力。</p>
  <blockquote><p>提示：切换顶部的模式、只读状态和主题，观察编辑器在不同配置下的表现。</p></blockquote>

  <h2>文本与段落</h2>
  <p>编辑器支持 <strong>粗体</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s>、<code>行内代码</code>，也可以插入 <a href="https://tiptap.dev/" target="_blank" rel="noopener noreferrer">安全链接</a>。</p>
  <h3>列表与任务</h3>
  <ul>
    <li><p>使用无序列表整理并列信息</p></li>
    <li><p>通过 Tab 和 Shift + Tab 调整列表层级</p></li>
  </ul>
  <ol>
    <li><p>选中文本并尝试 Bubble Menu</p></li>
    <li><p>使用工具栏修改格式、颜色和对齐方式</p></li>
  </ol>
  <ul data-type="taskList">
    <li data-type="taskItem" data-checked="true"><p>体验主题与编辑器模式切换</p></li>
    <li data-type="taskItem" data-checked="false"><p>勾选任务并继续编辑内容</p></li>
  </ul>

  <h2>代码块</h2>
  <p>代码块支持语言选择、语法高亮、复制和格式化操作：</p>
  <pre><code class="language-typescript">type EditorSettings = {
  language: "zh-CN" | "en-US";
  disabled: boolean;
};

const editorSettings: EditorSettings = {
  language: "zh-CN",
  disabled: false,
};</code></pre>

  <h2>表格</h2>
  <p>点击任意单元格后，可以插入或删除行列，并设置表头与对齐方式。</p>
  <table>
    <tbody>
      <tr><th><p>能力</p></th><th><p>入口</p></th><th><p>状态</p></th></tr>
      <tr><td><p>文本格式</p></td><td><p>工具栏 / Bubble Menu</p></td><td><p>可直接体验</p></td></tr>
      <tr><td><p>斜杠命令</p></td><td><p>输入 /</p></td><td><p>Notion-like 模式</p></td></tr>
      <tr><td><p>图片、视频与附件</p></td><td><p>工具栏 / 斜杠命令</p></td><td><p>支持模拟上传</p></td></tr>
    </tbody>
  </table>

  <h2>数学公式</h2>
  <p>行内公式示例：<span data-type="inline-math" data-latex="E = mc^2"></span>。点击公式可以重新编辑 LaTeX 内容。</p>
  <div data-type="block-math" data-latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"></div>

  <hr>
  <h2>继续探索</h2>
  <p>切换到 Notion-like 模式后，在空段落中输入 <code>/</code> 打开命令菜单；选中一段文本可打开 Bubble Menu。图片、视频和附件可以通过工具栏或斜杠命令插入。</p>
  <p>现在就从这里开始编辑吧。</p>
`;

/** 渲染 ReactTiptapEditor 功能演示页面。 */
function App() {
  // 控制编辑器浅色/深色主题。
  const [editorTheme, setEditorTheme] = useState<EditorTheme>(
    EditorTheme.Light,
  );
  // 当前编辑器 HTML 内容。
  const [content, setContent] = useState("");
  // 编辑器内容变更次数。
  const [count, setCount] = useState(0);
  // 编辑器是否禁用。
  const [disabled, setDisabled] = useState(false);
  // 当前编辑器模式。
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.Headless);

  /** 切换编辑器模式。 */
  const handleToggleMode = () => {
    setEditorMode((prevMode) =>
      prevMode === EditorMode.Headless
        ? EditorMode.NotionLike
        : EditorMode.Headless,
    );
  };

  /** 切换编辑器禁用状态。 */
  const handleToggleDisabled = () => {
    setDisabled((prevDisabled) => !prevDisabled);
  };

  /** 切换编辑器主题（浅色/深色）。 */
  const handleToggleTheme = () => {
    setEditorTheme((prevTheme) =>
      prevTheme === EditorTheme.Dark ? EditorTheme.Light : EditorTheme.Dark,
    );
  };

  /** 同步编辑器内容与变更次数。 */
  const handleEditorChange = (html: string) => {
    setCount(count + 1);
    setContent(html);
    console.log(
      "htmlToPlainText",
      htmlToPlainText(html, {
        singleLine: true,
      }),
    );
    console.log("count", count);
    console.log("✏️ onChange 被触发 - 用户编辑:", html);
  };

  /** 模拟图片预上传并返回图片地址。 */
  const handleImagePreUpload = async (file: File): Promise<string> => {
    console.log("📤 上传图片:", file.name, file.size, "bytes");
    console.log("count", count);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          // 模拟上传成功后的图片地址。
          const mockUrl = `https://picsum.photos/seed/${Date.now()}/300/200`;
          console.log("✅ 上传成功:", mockUrl);
          resolve(mockUrl);
        } else {
          console.log("❌ 上传失败");
          reject(new Error("Mock upload failed, please retry"));
        }
      }, 1500);
    });
  };

  /** 记录图片确认上传结果。 */
  const onImageUpload = (payload: {
    file: File;
    url: string;
    alt?: string;
  }) => {
    console.log("count", count);
    console.log("✅ 图片 Confirm 回调:", payload);
  };

  /** 模拟附件预上传并返回附件信息。 */
  const onFilePreUpload = async (
    file: File,
  ): Promise<{ url: string; name: string }> => {
    console.log("📤 上传文件:", file.name, file.size, "bytes");
    console.log("count", count);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url: "https://example.com/file.pdf", name: file.name });
      }, 1500);
    });
  };

  /** 记录附件确认上传结果。 */
  const onFileUpload = (payload: { file: File; url: string; name: string }) => {
    console.log("count", count);
    console.log("✅ 文件 Confirm 回调:", payload);
  };

  /** 记录附件点击信息。 */
  const onFileAttachmentClick = ({
    url,
    name,
  }: {
    url: string;
    name: string;
  }) => {
    console.log(count, "count");
    console.log("📤 点击文件:", { url, name });
  };

  /** 记录图片删除信息。 */
  const onImageDelete = (params: {
    src: string;
    alt?: string;
    title?: string;
  }) => {
    console.log("count", count);
    console.log("🗑️ 删除图片:", params);
  };

  /** 记录附件删除信息。 */
  const onFileDelete = (params: { url: string; name: string }) => {
    console.log("count", count);
    console.log("🗑️ 删除附件:", params);
  };

  useEffect(() => {
    console.log("📡 准备从接口加载数据...");
    setTimeout(() => {
      console.log("📥 接口数据返回，设置 content（此操作不应触发 onChange）");
      setContent(DEMO_CONTENT);
    }, 2000);
  }, []);

  // 当前是否为 headless 模式。
  const isHeadlessMode = editorMode === EditorMode.Headless;
  // 当前是否为 disabled 状态。
  const isEditorDisabled = disabled;
  // 当前是否为浅色主题。
  const isLightTheme = editorTheme === EditorTheme.Light;

  // 模式按钮展示文案。
  const modeLabel = `模式：${isHeadlessMode ? "headless" : "notionLike"}`;
  // disabled 按钮展示文案。
  const disabledLabel = `disabled：${isEditorDisabled ? "开" : "关"}`;
  // 主题按钮展示文案。
  const themeLabel = `主题：${isLightTheme ? "light" : "dark"}`;

  return (
    <div
      className={`app ${editorTheme === EditorTheme.Dark ? "app-dark" : "app-light"}`}
    >
      <main className="demo-shell">
        <header className="demo-header">
          <h1>Tiptap Markdown Editor</h1>
          <div className="demo-actions">
            <button
              type="button"
              onClick={handleToggleMode}
              className={`demo-action-btn ${isHeadlessMode ? "is-active" : ""}`}
            >
              {modeLabel}
            </button>
            <button
              type="button"
              onClick={handleToggleDisabled}
              className={`demo-action-btn ${isEditorDisabled ? "is-active" : ""}`}
            >
              {disabledLabel}
            </button>
            <button
              type="button"
              onClick={handleToggleTheme}
              className={`demo-action-btn ${!isLightTheme ? "is-active" : ""}`}
            >
              {themeLabel}
            </button>
          </div>
        </header>

        {/*<div onClick={() => setDisabled(true)}>disabled</div>
        <div onClick={() => setDisabled(false)}> not disabled</div>*/}
        <div className="demo-workspace">
          <ReactTiptapEditor
            disabled={disabled}
            editorMode={editorMode}
            theme={editorTheme}
            value={content}
            onChange={(str: string) => {
              console.log("str", str);
              handleEditorChange(str);
            }}
            language="zh-CN"
            fileUploadTypes={["pdf"]}
            onImagePreUpload={handleImagePreUpload}
            onImageUpload={onImageUpload}
            onImageDelete={onImageDelete}
            maxHeight="600px"
            onFilePreUpload={onFilePreUpload}
            onFileUpload={onFileUpload}
            onFileDelete={onFileDelete}
            onFileAttachmentClick={onFileAttachmentClick}
            // onCodeBlockFormat={onCodeBlockFormat}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

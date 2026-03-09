import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp, AlertCircle } from "lucide-react";
import { config } from "@/config";
import { formatFileSize } from "@/lib/utils";
import "./FileUploadDialog.css";

const ACCEPT = config.FILE_UPLOAD_ACCEPT;
const ALLOWED_EXTENSIONS = [".docx", ".pdf"];

function isAllowedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))) return true;
  const mime = file.type;
  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "application/pdf"
  )
    return true;
  return false;
}

export interface FileUploadDialogProps {
  isOpen: boolean;
  onConfirm: (url: string, name: string) => void;
  onCancel: () => void;
  onUpload: (file: File) => Promise<{ url: string; name: string }>;
  fileMaxSizeBytes?: number;
}

const FileUploadDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  onUpload,
  fileMaxSizeBytes = config.FILE_UPLOAD_MAX_SIZE_BYTES,
}: FileUploadDialogProps) => {
  const [result, setResult] = useState<{ url: string; name: string } | null>(
    null
  );
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetStates = useCallback(() => {
    setResult(null);
    setError("");
    setIsUploading(false);
    setIsDragOver(false);
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (!isAllowedFile(file)) {
        setError("请选择 Word (.docx) 或 PDF (.pdf) 文件");
        return;
      }
      if (file.size > fileMaxSizeBytes) {
        setError(`文件大小不能超过 ${formatFileSize(fileMaxSizeBytes)}`);
        return;
      }

      setError("");
      try {
        setIsUploading(true);
        const res = await onUpload(file);
        setResult(res);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "上传失败，请重试"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, fileMaxSizeBytes]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    if (!isUploading) setIsDragOver(true);
  }, [isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (isUploading) return;
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [isUploading, processFile]
  );

  const handleConfirm = useCallback(() => {
    if (!result) {
      setError("请先选择并上传文件");
      return;
    }
    if (isUploading) {
      setError("正在上传，请稍候");
      return;
    }
    onConfirm(result.url, result.name);
    resetStates();
  }, [result, isUploading, onConfirm, resetStates]);

  const handleCancel = useCallback(() => {
    onCancel();
    resetStates();
  }, [onCancel, resetStates]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleConfirm, handleCancel]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent
        className="file-upload-dialog-content max-w-lg overflow-hidden flex flex-col"
        showCloseButton={false}
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>上传附件</DialogTitle>
        </DialogHeader>

        <div className="file-upload-content">
          <div className="file-upload-file">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              onChange={handleFileChange}
              className="file-upload-input-hidden"
              id="fileUploadInput"
            />
            <label
              htmlFor="fileUploadInput"
              className={`file-upload-file-label ${isDragOver ? "is-drag-over" : ""} ${result ? "has-result" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <>
                  <div className="file-upload-file-icon">
                    <Loader2
                      size={40}
                      className="file-upload-file-icon-spin"
                    />
                  </div>
                  <div className="file-upload-file-text">正在上传…</div>
                </>
              ) : result ? (
                <>
                  <div className="file-upload-file-icon">
                    <FileUp size={40} />
                  </div>
                  <div className="file-upload-file-text">已选择文件</div>
                  <div className="file-upload-file-name">{result.name}</div>
                  <div className="file-upload-file-hint">
                    点击或拖拽可重新选择
                  </div>
                </>
              ) : (
                <>
                  <div className="file-upload-file-icon">
                    <FileUp size={40} />
                  </div>
                  <div className="file-upload-file-text">
                    点击选择或拖拽文件到此处
                  </div>
                  <div className="file-upload-file-hint">
                    支持 Word (.docx)、PDF (.pdf)，最大{" "}
                    {formatFileSize(fileMaxSizeBytes)}
                  </div>
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="file-upload-error" role="alert">
              <AlertCircle size={16} className="file-upload-error-icon" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!result || !!error || isUploading}
          >
            {isUploading ? "上传中…" : "插入链接"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;

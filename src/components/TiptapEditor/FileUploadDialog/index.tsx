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
  onPreUpload: (file: File) => Promise<{ url: string; name: string }>;
  onUpload?: (payload: { file: File; url: string; name: string }) => void | Promise<void>;
  fileMaxSizeBytes?: number;
}

const FileUploadDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  onPreUpload,
  onUpload,
  fileMaxSizeBytes = config.FILE_UPLOAD_MAX_SIZE_BYTES,
}: FileUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ url: string; name: string } | null>(
    null
  );
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetStates = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setError("");
    setIsUploading(false);
    setIsDragOver(false);
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (!isAllowedFile(file)) {
        setSelectedFile(null);
        setResult(null);
        setError("Please select a Word (.docx) or PDF (.pdf) file");
        return;
      }
      if (file.size > fileMaxSizeBytes) {
        setSelectedFile(null);
        setResult(null);
        setError(`File size must not exceed ${formatFileSize(fileMaxSizeBytes)}`);
        return;
      }

      setSelectedFile(file);
      setError("");
      try {
        setIsUploading(true);
        const res = await onPreUpload(file);
        setResult(res);
      } catch (err) {
        setResult(null);
        setError(
          err instanceof Error ? err.message : "Upload failed, please try again"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onPreUpload, fileMaxSizeBytes]
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
    if (!selectedFile || !result) {
      setError("Please select and upload a file first");
      return;
    }
    if (isUploading) {
      setError("Uploading, please wait");

      return;
    }
    onConfirm(result.url, result.name);
    if (onUpload) {
      void Promise.resolve(
        onUpload({ file: selectedFile, url: result.url, name: result.name })
      );
    }
    resetStates();
  }, [selectedFile, result, isUploading, onConfirm, onUpload, resetStates]);

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
          <DialogTitle>Upload Attachment</DialogTitle>
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
                  <div className="file-upload-file-text">Uploading…</div>
                </>
              ) : result ? (
                <>
                  <div className="file-upload-file-icon">
                    <FileUp size={40} />
                  </div>
                  <div className="file-upload-file-text">File selected</div>
                  <div className="file-upload-file-name">{result.name}</div>
                  <div className="file-upload-file-hint">
                    Click or drag to choose another file
                  </div>
                </>
              ) : (
                <>
                  <div className="file-upload-file-icon">
                    <FileUp size={40} />
                  </div>
                  <div className="file-upload-file-text">
                    Click to select or drag files here
                  </div>
                  <div className="file-upload-file-hint">
                    Supports Word (.docx), PDF (.pdf), max{" "}
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
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!result || !!error || isUploading}
          >
            {isUploading ? "Uploading…" : "Insert Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;

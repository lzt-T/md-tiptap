import { useState, useCallback } from "react";

export function useFileUploadDialog() {
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [fileUploadCallback, setFileUploadCallback] = useState<
    ((url: string, name: string) => void) | null
  >(null);

  const openFileUploadDialog = useCallback(
    (callback: (url: string, name: string) => void) => {
      setFileUploadCallback(() => callback);
      setShowFileUploadDialog(true);
    },
    []
  );

  const handleFileUploadConfirm = useCallback(
    (url: string, name: string) => {
      if (fileUploadCallback) {
        fileUploadCallback(url, name);
      }
      setShowFileUploadDialog(false);
      setFileUploadCallback(null);
    },
    [fileUploadCallback]
  );

  const handleFileUploadCancel = useCallback(() => {
    setShowFileUploadDialog(false);
    setFileUploadCallback(null);
  }, []);

  return {
    showFileUploadDialog,
    openFileUploadDialog,
    handleFileUploadConfirm,
    handleFileUploadCancel,
  };
}

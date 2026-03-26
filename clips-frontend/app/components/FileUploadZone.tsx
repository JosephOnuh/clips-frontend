"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, FileVideo, AlertCircle } from "lucide-react";

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".webm"];

export default function FileUploadZone({ onFileSelect, selectedFile, disabled }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    setError(null);

    // Check file type
    const isAllowedType = ALLOWED_TYPES.includes(file.type) || 
      ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isAllowedType) {
      setError("Only MP4, MOV, and WEBM files are supported.");
      return false;
    }

    // Check file size (2GB limit)
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 2GB limit.");
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  }, [disabled]);

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${
          disabled
            ? "cursor-not-allowed border-zinc-800 bg-zinc-900/10 opacity-50"
            : isDragging
            ? "border-[#00E68A] bg-[#00E68A]/5 scale-[1.01]"
            : selectedFile
            ? "border-zinc-700 bg-zinc-900/40"
            : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center p-6 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00E68A]/10 text-[#00E68A]">
              <FileVideo className="h-8 w-8" />
            </div>
            <p className="max-w-[280px] truncate text-sm font-medium text-white">
              {selectedFile.name}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
            <button
              onClick={clearFile}
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center p-8 text-center">
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 text-zinc-400 transition-transform ${isDragging ? "scale-110 text-[#00E68A]" : ""}`}>
              <Upload className="h-8 w-8" />
            </div>
            <p className="text-base font-medium text-white">
              {isDragging ? "Drop your video here" : "Click to upload or drag and drop"}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              MP4, MOV, or WEBM (up to 2GB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileField {
  id: string;
  type: "file";
  question: string;
  required: boolean;
  placeholder?: string; // Used for accept attribute
}

interface FilePreviewProps {
  field: FileField;
  value?: File[];
  onChange?: (value: File[]) => void;
  disabled?: boolean;
  error?: string;
}

export function FilePreview({ field, value = [], onChange, disabled = false, error }: FilePreviewProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && onChange) {
      const fileArray = Array.from(files);
      onChange([...value, ...fileArray]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    if (onChange) {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!disabled) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = field.placeholder || '*';
            input.multiple = true;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFileSelect(target.files);
            };
            input.click();
          }
        }}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">
          Click to upload or drag and drop
        </p>
        {field.placeholder && (
          <p className="text-xs text-gray-500">
            Accepted files: {field.placeholder}
          </p>
        )}
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default FilePreview;

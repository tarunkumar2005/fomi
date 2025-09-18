"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ParagraphField {
  id: string;
  type: "textarea";
  question: string;
  required: boolean;
  placeholder?: string;
  rows?: number;
}

interface ParagraphBuilderProps {
  field: ParagraphField;
  onUpdate: (updates: Partial<ParagraphField>) => void;
}

interface ParagraphPreviewProps {
  field: ParagraphField;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function ParagraphBuilder({ field, onUpdate }: ParagraphBuilderProps) {
  const handlePlaceholderChange = (placeholder: string) => {
    onUpdate({ placeholder: placeholder || undefined });
  };

  const handleRowsChange = (rows: number) => {
    const validRows = Math.max(2, Math.min(10, rows));
    onUpdate({ rows: validRows });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="min-w-0 flex-shrink-0">Placeholder:</span>
          <Input
            value={field.placeholder || ""}
            onChange={(e) => handlePlaceholderChange(e.target.value)}
            placeholder="Enter placeholder text"
            className="text-xs h-8 flex-1"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="min-w-0 flex-shrink-0">Rows:</span>
          <Input
            type="number"
            value={field.rows || 3}
            onChange={(e) => handleRowsChange(parseInt(e.target.value) || 3)}
            min="2"
            max="10"
            className="text-xs h-8 w-16"
          />
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Preview:</p>
        <ParagraphPreview field={field} disabled />
      </div>
    </div>
  );
}

export function ParagraphPreview({ field, value, onChange, disabled = false, error }: ParagraphPreviewProps) {
  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  return (
    <div className="space-y-1">
      <Textarea
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={field.placeholder || "Long answer text"}
        disabled={disabled}
        required={field.required}
        rows={field.rows || 3}
        className={`bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all duration-200 resize-none ${
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
      />
      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default ParagraphPreview;

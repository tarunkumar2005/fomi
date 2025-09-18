"use client";

import { Input } from "@/components/ui/input";

interface DateField {
  id: string;
  type: "date";
  question: string;
  required: boolean;
  min?: string;
  max?: string;
}

interface DatePreviewProps {
  field: DateField;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function DatePreview({ field, value, onChange, disabled = false, error }: DatePreviewProps) {
  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  return (
    <div className="space-y-1">
      <Input
        type="date"
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        required={field.required}
        min={field.min}
        max={field.max}
        className={`bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all duration-200 ${
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

export default DatePreview;

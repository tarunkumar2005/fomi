"use client";

import { Input } from "@/components/ui/input";

interface NumberField {
  id: string;
  type: "number";
  question: string;
  required: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface NumberPreviewProps {
  field: NumberField;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  error?: string;
}

export function NumberPreview({ field, value, onChange, disabled = false, error }: NumberPreviewProps) {
  const handleChange = (newValue: string) => {
    const numValue = parseFloat(newValue);
    onChange?.(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <div className="space-y-1">
      <Input
        type="number"
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={field.placeholder || "Enter number"}
        disabled={disabled}
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step}
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

export default NumberPreview;

"use client";

import { Input } from "@/components/ui/input";

interface ShortAnswerField {
  id: string;
  type: "text" | "email" | "phone";
  question: string;
  required: boolean;
  placeholder?: string;
}

interface ShortAnswerBuilderProps {
  field: ShortAnswerField;
  onUpdate: (updates: Partial<ShortAnswerField>) => void;
}

interface ShortAnswerPreviewProps {
  field: ShortAnswerField;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function ShortAnswerBuilder({ field, onUpdate }: ShortAnswerBuilderProps) {
  const handlePlaceholderChange = (placeholder: string) => {
    onUpdate({ placeholder: placeholder || undefined });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="min-w-0 flex-shrink-0">Placeholder:</span>
        <Input
          value={field.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e.target.value)}
          placeholder="Enter placeholder text"
          className="text-xs h-8 flex-1"
        />
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Preview:</p>
        <ShortAnswerPreview field={field} disabled />
      </div>
    </div>
  );
}

export function ShortAnswerPreview({ field, value, onChange, disabled = false, error }: ShortAnswerPreviewProps) {
  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  const getInputType = () => {
    switch (field.type) {
      case "email": return "email";
      case "phone": return "tel";
      default: return "text";
    }
  };

  const getDefaultPlaceholder = () => {
    switch (field.type) {
      case "email": return "Enter email address";
      case "phone": return "Enter phone number";
      default: return "Short answer text";
    }
  };

  return (
    <div className="space-y-1">
      <Input
        type={getInputType()}
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={field.placeholder || getDefaultPlaceholder()}
        disabled={disabled}
        required={field.required}
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

export default ShortAnswerPreview;

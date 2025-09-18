"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface DropdownField {
  id: string;
  type: "select";
  question: string;
  required: boolean;
  options: string[];
  placeholder?: string;
}

interface DropdownBuilderProps {
  field: DropdownField;
  onUpdate: (updates: Partial<DropdownField>) => void;
}

interface DropdownPreviewProps {
  field: DropdownField;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function DropdownBuilder({ field, onUpdate }: DropdownBuilderProps) {
  const addOption = () => {
    const newOptions = [...field.options, `Option ${field.options.length + 1}`];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    if (value.trim() === "") return;
    
    const newOptions = [...field.options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (field.options.length > 1) {
      const newOptions = field.options.filter((_, i) => i !== index);
      onUpdate({ options: newOptions });
    }
  };

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
          placeholder="Choose an option"
          className="text-xs h-8 flex-1"
        />
      </div>

      <div className="space-y-2">
        {field.options.map((option, i) => (
          <div key={i} className="flex items-center gap-3 group/option">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
              {i + 1}
            </div>
            <Input
              value={option}
              onChange={(e) => updateOption(i, e.target.value)}
              className="flex-1 border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
              placeholder={`Option ${i + 1}`}
            />
            {field.options.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOption(i)}
                className="opacity-0 group-hover/option:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                title="Remove option"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={addOption}
          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 w-full justify-start"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add option
        </Button>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Preview:</p>
        <DropdownPreview field={field} disabled />
      </div>
    </div>
  );
}

export function DropdownPreview({ field, value, onChange, disabled = false, error }: DropdownPreviewProps) {
  const handleChange = (selectedValue: string) => {
    onChange?.(selectedValue);
  };

  return (
    <div className="space-y-1">
      <select
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        required={field.required}
        className={`w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all duration-200 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
      >
        <option value="">{field.placeholder || "Choose an option"}</option>
        {field.options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default DropdownPreview;

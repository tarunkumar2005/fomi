"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface CheckboxesField {
  id: string;
  type: "checkbox";
  question: string;
  required: boolean;
  options: string[];
}

interface CheckboxesBuilderProps {
  field: CheckboxesField;
  onUpdate: (updates: Partial<CheckboxesField>) => void;
}

interface CheckboxesPreviewProps {
  field: CheckboxesField;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
}

export function CheckboxesBuilder({ field, onUpdate }: CheckboxesBuilderProps) {
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

  return (
    <div className="space-y-3">
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
        <CheckboxesPreview field={field} disabled />
      </div>
    </div>
  );
}

export function CheckboxesPreview({ field, value = [], onChange, disabled = false, error }: CheckboxesPreviewProps) {
  const handleChange = (option: string, checked: boolean) => {
    if (!onChange) return;
    
    if (checked) {
      onChange([...value, option]);
    } else {
      onChange(value.filter(v => v !== option));
    }
  };

  return (
    <div className="space-y-1">
      <div className="space-y-3">
        {field.options.map((option, i) => (
          <label
            key={i}
            className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
              disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={(e) => handleChange(option, e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              aria-describedby={error ? `${field.id}-error` : undefined}
            />
            <span className="text-gray-700 select-none">{option}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default CheckboxesPreview;

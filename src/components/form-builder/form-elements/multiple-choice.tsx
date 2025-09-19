"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, GripVertical } from "lucide-react";
import { ChoiceField, FieldBuilderProps, FieldPreviewProps } from "@/types/form";

export function MultipleChoiceBuilder({ field, onUpdate }: FieldBuilderProps<ChoiceField>) {
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

  const moveOption = (fromIndex: number, toIndex: number) => {
    const newOptions = [...field.options];
    const [movedOption] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, movedOption);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Options
            <Badge variant="secondary" className="text-xs">
              {field.options.length} options
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {field.options.map((option, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                {i + 1}
              </div>
              
              <Input
                value={option}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1"
                placeholder={`Option ${i + 1}`}
              />
              
              {field.options.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(i)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 flex-shrink-0"
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
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add option
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <MultipleChoicePreview field={field} disabled />
        </CardContent>
      </Card>
    </div>
  );
}

export function MultipleChoicePreview({ 
  field, 
  value, 
  onChange, 
  disabled = false, 
  error 
}: FieldPreviewProps<ChoiceField>) {
  const validateInput = (selectedValue: string): string | null => {
    if (field.required && !selectedValue) {
      return "Please select an option";
    }
    return null;
  };

  const inputError = error || (field.required && !value ? validateInput(value) : null);

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {field.options.map((option, i) => (
          <label
            key={i}
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
              disabled 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:bg-muted/50 hover:border-primary/50'
            } ${
              value === option 
                ? 'border-primary bg-primary/5' 
                : 'border-border'
            }`}
          >
            <input
              type="radio"
              name={field.id}
              value={option}
              checked={value === option}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              required={field.required}
              className="w-4 h-4 text-primary border-border focus:ring-primary/20"
            />
            <span className="text-foreground select-none flex-1">{option}</span>
          </label>
        ))}
      </div>
      
      {inputError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full" />
          {inputError}
        </p>
      )}
    </div>
  );
}

export default MultipleChoicePreview;

"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TextareaField, FieldBuilderProps, FieldPreviewProps } from "@/types/form";

export function ParagraphBuilder({ field, onUpdate }: FieldBuilderProps<TextareaField>) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Configuration
            <Badge variant="secondary" className="text-xs">
              textarea
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder Text</Label>
            <Input
              id="placeholder"
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value || undefined })}
              placeholder="Enter placeholder text"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rows" className="text-xs text-muted-foreground">
                Rows
              </Label>
              <Input
                id="rows"
                type="number"
                value={field.rows || 3}
                onChange={(e) => onUpdate({ 
                  rows: parseInt(e.target.value) || 3 
                })}
                min="2"
                max="10"
                className="h-8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minLength" className="text-xs text-muted-foreground">
                Min Length
              </Label>
              <Input
                id="minLength"
                type="number"
                value={field.minLength || ""}
                onChange={(e) => onUpdate({ 
                  minLength: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="0"
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxLength" className="text-xs text-muted-foreground">
                Max Length
              </Label>
              <Input
                id="maxLength"
                type="number"
                value={field.maxLength || ""}
                onChange={(e) => onUpdate({ 
                  maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="500"
                className="h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ParagraphPreview field={field} disabled />
        </CardContent>
      </Card>
    </div>
  );
}

export function ParagraphPreview({ 
  field, 
  value, 
  onChange, 
  disabled = false, 
  error 
}: FieldPreviewProps<TextareaField>) {
  const validateInput = (inputValue: string): string | null => {
    if (field.required && !inputValue.trim()) {
      return "This field is required";
    }

    if (field.minLength && inputValue.length < field.minLength) {
      return `Minimum ${field.minLength} characters required`;
    }

    if (field.maxLength && inputValue.length > field.maxLength) {
      return `Maximum ${field.maxLength} characters allowed`;
    }

    return null;
  };

  const inputError = error || (value ? validateInput(value) : null);

  return (
    <div className="space-y-2">
      <Textarea
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={field.placeholder || "Long answer text"}
        disabled={disabled}
        required={field.required}
        rows={field.rows || 3}
        minLength={field.minLength}
        maxLength={field.maxLength}
        className={`resize-none transition-all duration-200 ${
          inputError 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-input focus:border-primary'
        }`}
        aria-invalid={!!inputError}
      />
      
      {inputError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full" />
          {inputError}
        </p>
      )}
      
      {field.maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {value?.length || 0}/{field.maxLength}
        </p>
      )}
    </div>
  );
}

export default ParagraphPreview;

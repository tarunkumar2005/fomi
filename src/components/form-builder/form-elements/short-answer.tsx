"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TextField, FieldBuilderProps, FieldPreviewProps } from "@/types/form";

export function ShortAnswerBuilder({ field, onUpdate }: FieldBuilderProps<TextField>) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Configuration
            <Badge variant="secondary" className="text-xs">
              {field.type.toLowerCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="placeholder" className="text-sm">
              Placeholder Text
            </Label>
            <Input
              id="placeholder"
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value || undefined })}
              placeholder="Enter placeholder text"
              className="h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                placeholder="100"
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
          <ShortAnswerPreview field={field} disabled />
        </CardContent>
      </Card>
    </div>
  );
}

export function ShortAnswerPreview({ 
  field, 
  value, 
  onChange, 
  disabled = false, 
  error 
}: FieldPreviewProps<TextField>) {
  const getInputType = () => {
    switch (field.type) {
      case "EMAIL": return "email";
      case "PHONE": return "tel";
      case "URL": return "url";
      default: return "text";
    }
  };

  const getDefaultPlaceholder = () => {
    switch (field.type) {
      case "EMAIL": return "Enter email address";
      case "PHONE": return "Enter phone number";
      case "URL": return "Enter website URL";
      default: return "Short answer text";
    }
  };

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

    if (field.type === "EMAIL" && inputValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        return "Please enter a valid email address";
      }
    }

    if (field.type === "URL" && inputValue) {
      try {
        new URL(inputValue);
      } catch {
        return "Please enter a valid URL";
      }
    }

    return null;
  };

  const inputError = error || (value ? validateInput(value) : null);

  return (
    <div className="space-y-2">
      <Input
        type={getInputType()}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={field.placeholder || getDefaultPlaceholder()}
        disabled={disabled}
        required={field.required}
        minLength={field.minLength}
        maxLength={field.maxLength}
        className={`transition-all duration-200 ${
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
      
      {field.maxLength && value && (
        <p className="text-xs text-muted-foreground text-right">
          {value.length}/{field.maxLength}
        </p>
      )}
    </div>
  );
}

export default ShortAnswerPreview;

"use client";

import { useState } from "react";
import { GripVertical, MoreVertical, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ShortAnswerBuilder } from "./form-elements/short-answer";
import { ParagraphBuilder } from "./form-elements/paragraph";
import { MultipleChoiceBuilder } from "./form-elements/multiple-choice";
import { CheckboxesBuilder } from "./form-elements/checkboxes";
import { DropdownBuilder } from "./form-elements/dropdown";

interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "email" | "phone" | "number" | "rating" | "file" | "date" | "time";
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface FormElementProps {
  field: FormField;
  index: number;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isDragging?: boolean;
}

export function FormElement({ field, index, onUpdate, onDelete, onDuplicate, isDragging }: FormElementProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTypeColor = () => {
    switch (field.type) {
      case "text": return "bg-blue-50 text-blue-700 border-blue-200";
      case "textarea": return "bg-green-50 text-green-700 border-green-200";
      case "select": return "bg-purple-50 text-purple-700 border-purple-200";
      case "radio": return "bg-orange-50 text-orange-700 border-orange-200";
      case "checkbox": return "bg-pink-50 text-pink-700 border-pink-200";
      case "email": return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "phone": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "number": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "rating": return "bg-amber-50 text-amber-700 border-amber-200";
      case "file": return "bg-violet-50 text-violet-700 border-violet-200";
      case "date": return "bg-rose-50 text-rose-700 border-rose-200";
      case "time": return "bg-teal-50 text-teal-700 border-teal-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTypeName = () => {
    switch (field.type) {
      case "text": return "Short Answer";
      case "textarea": return "Paragraph";
      case "select": return "Dropdown";
      case "radio": return "Multiple Choice";
      case "checkbox": return "Checkboxes";
      case "email": return "Email";
      case "phone": return "Phone Number";
      case "number": return "Number";
      case "rating": return "Rating";
      case "file": return "File Upload";
      case "date": return "Date";
      case "time": return "Time";
      default: return field.type;
    }
  };

  const handleQuestionUpdate = (question: string) => {
    if (question.trim().length === 0) {
      setError("Question cannot be empty");
    } else {
      setError(null);
    }
    onUpdate({ question });
  };

  const renderFieldBuilder = () => {
    try {
      switch (field.type) {
        case "text":
          return (
            <ShortAnswerBuilder 
              field={field as any} 
              onUpdate={onUpdate}
            />
          );
        case "textarea":
          return (
            <ParagraphBuilder 
              field={field as any} 
              onUpdate={onUpdate}
            />
          );
        case "select":
          return (
            <DropdownBuilder 
              field={{ ...field, options: field.options || ["Option 1"] } as any} 
              onUpdate={onUpdate}
            />
          );
        case "radio":
          return (
            <MultipleChoiceBuilder 
              field={{ ...field, options: field.options || ["Option 1"] } as any} 
              onUpdate={onUpdate}
            />
          );
        case "checkbox":
          return (
            <CheckboxesBuilder 
              field={{ ...field, options: field.options || ["Option 1"] } as any} 
              onUpdate={onUpdate}
            />
          );
        case "email":
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="min-w-0 flex-shrink-0">Placeholder:</span>
                <Input
                  value={field.placeholder || ""}
                  onChange={(e) => onUpdate({ placeholder: e.target.value || undefined })}
                  placeholder="Enter email placeholder"
                  className="text-xs h-8 flex-1"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <Input
                  type="email"
                  placeholder={field.placeholder || "Enter email address"}
                  disabled
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          );
        case "phone":
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="min-w-0 flex-shrink-0">Placeholder:</span>
                <Input
                  value={field.placeholder || ""}
                  onChange={(e) => onUpdate({ placeholder: e.target.value || undefined })}
                  placeholder="Enter phone placeholder"
                  className="text-xs h-8 flex-1"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <Input
                  type="tel"
                  placeholder={field.placeholder || "Enter phone number"}
                  disabled
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          );
        case "number":
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>Min:</span>
                  <Input
                    type="number"
                    value={field.min || ""}
                    onChange={(e) => onUpdate({ min: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="text-xs h-8"
                  />
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>Max:</span>
                  <Input
                    type="number"
                    value={field.max || ""}
                    onChange={(e) => onUpdate({ max: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="text-xs h-8"
                  />
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>Step:</span>
                  <Input
                    type="number"
                    value={field.step || ""}
                    onChange={(e) => onUpdate({ step: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="text-xs h-8"
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <Input
                  type="number"
                  placeholder="Enter number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  disabled
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          );
        case "rating":
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Max Rating:</span>
                <Input
                  type="number"
                  value={field.max || 5}
                  onChange={(e) => onUpdate({ max: parseInt(e.target.value) || 5 })}
                  min="3"
                  max="10"
                  className="text-xs h-8 w-16"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="flex gap-1">
                  {Array.from({ length: field.max || 5 }, (_, i) => (
                    <span key={i} className="text-2xl text-gray-300">★</span>
                  ))}
                </div>
              </div>
            </div>
          );
        case "file":
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Accept:</span>
                <Input
                  value={field.placeholder || ""}
                  onChange={(e) => onUpdate({ placeholder: e.target.value || undefined })}
                  placeholder=".pdf,.doc,.docx"
                  className="text-xs h-8 flex-1"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                </div>
              </div>
            </div>
          );
        case "date":
          return (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <Input
                  type="date"
                  disabled
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          );
        case "time":
          return (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <Input
                  type="time"
                  disabled
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          );
        default:
          return (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">Unsupported field type: {field.type}</p>
            </div>
          );
      }
    } catch (err) {
      console.error("Error rendering field builder:", err);
      return (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-600">Error loading field component</p>
        </div>
      );
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl border-2 transition-all duration-200 group cursor-pointer ${
        isFocused || isDragging 
          ? 'border-indigo-300 shadow-lg shadow-indigo-100' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      } ${error ? 'border-red-300' : ''}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Header with drag handle */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor()}`}>
            {getTypeName()}
          </div>
          <span className="text-sm text-gray-500">Question {index + 1}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Duplicate question"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            title="Delete question"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Question Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Input
              value={field.question}
              onChange={(e) => handleQuestionUpdate(e.target.value)}
              className={`text-lg font-medium border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-gray-400 flex-1 mr-2 ${
                error ? 'text-red-600' : ''
              }`}
              placeholder="Question"
              onFocus={() => setIsFocused(true)}
            />
            {field.required && (
              <span className="text-red-500 text-lg font-medium flex-shrink-0">*</span>
            )}
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>

        {/* Field Builder Component */}
        <div className="mb-6">
          {renderFieldBuilder()}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
            <span className="text-sm text-gray-600 font-medium">Required</span>
          </div>
          
          <div className="text-xs text-gray-400">
            ID: {field.id.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
}

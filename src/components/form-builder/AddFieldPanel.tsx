"use client";

import { X, Type, AlignLeft, ChevronDown, Circle, Square, Mail, Phone, Hash, Star, Upload, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddFieldPanelProps {
  onAddField: (type: "text" | "textarea" | "select" | "radio" | "checkbox" | "email" | "phone" | "number" | "rating" | "file" | "date" | "time") => void;
  onClose: () => void;
}

const fieldTypes = [
  {
    type: "text" as const,
    icon: Type,
    title: "Short answer",
    description: "Single line text input"
  },
  {
    type: "textarea" as const,
    icon: AlignLeft,
    title: "Paragraph",
    description: "Multiple lines of text"
  },
  {
    type: "radio" as const,
    icon: Circle,
    title: "Multiple choice",
    description: "Pick one option"
  },
  {
    type: "checkbox" as const,
    icon: Square,
    title: "Checkboxes",
    description: "Pick multiple options"
  },
  {
    type: "select" as const,
    icon: ChevronDown,
    title: "Dropdown",
    description: "Choose from a list"
  },
  {
    type: "email" as const,
    icon: Mail,
    title: "Email",
    description: "Email address input"
  },
  {
    type: "phone" as const,
    icon: Phone,
    title: "Phone number",
    description: "Phone number input"
  },
  {
    type: "number" as const,
    icon: Hash,
    title: "Number",
    description: "Numeric input"
  },
  {
    type: "rating" as const,
    icon: Star,
    title: "Rating",
    description: "Star rating scale"
  },
  {
    type: "file" as const,
    icon: Upload,
    title: "File upload",
    description: "Upload files"
  },
  {
    type: "date" as const,
    icon: Calendar,
    title: "Date",
    description: "Date picker"
  },
  {
    type: "time" as const,
    icon: Clock,
    title: "Time",
    description: "Time picker"
  }
];

export function AddFieldPanel({ onAddField, onClose }: AddFieldPanelProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add question</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {fieldTypes.map((fieldType) => {
            const Icon = fieldType.icon;
            return (
              <Button
                key={fieldType.type}
                variant="ghost"
                onClick={() => onAddField(fieldType.type)}
                className="w-full justify-start p-4 h-auto hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{fieldType.title}</div>
                  <div className="text-sm text-gray-500">{fieldType.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

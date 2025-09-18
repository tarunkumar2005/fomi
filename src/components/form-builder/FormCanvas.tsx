"use client";

import { useState, useEffect } from "react";
import { Plus, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormElement } from "./FormElement";
import { AddFieldPanel } from "./AddFieldPanel";
import { useFormSave } from "@/hooks/useFormSave";
import { useSession } from "@/hooks/useSession";

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

interface FormCanvasProps {
  formId: string;
}

export function FormCanvas({ formId }: FormCanvasProps) {
  const { session } = useSession();
  const { 
    isSaving, 
    lastSaved, 
    error, 
    triggerAutoSave, 
    loadForm, 
    clearError 
  } = useFormSave();

  const [formTitle, setFormTitle] = useState("Untitled form");
  const [formDescription, setFormDescription] = useState("Form description");
  const [estimatedTime, setEstimatedTime] = useState("5-7 minutes");
  const [fields, setFields] = useState<FormField[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load form data
  useEffect(() => {
    const initializeForm = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      const result = await loadForm(formId);
      
      if (result.success && result.form) {
        const form = result.form;
        setFormTitle(form.title || "Untitled form");
        setFormDescription(form.description || "Form description");
        setEstimatedTime(form.estimatedTime || "5-7 minutes");
        
        const convertedFields = form.fields.map((field: any) => ({
          id: field.id,
          type: field.type.toLowerCase(),
          question: field.question,
          required: field.required,
          options: field.options ? JSON.parse(field.options) : undefined,
          placeholder: field.placeholder,
          rows: field.rows,
          min: field.min,
          max: field.max,
          step: field.step,
        }));
        
        setFields(convertedFields);
      }
      setIsLoading(false);
    };

    initializeForm();
  }, [formId, session, loadForm]);

  // Auto-save when data changes
  useEffect(() => {
    if (!isLoading && session && formId) {
      triggerAutoSave({
        id: formId,
        title: formTitle,
        description: formDescription,
        estimatedTime,
        fields
      });
    }
  }, [formTitle, formDescription, estimatedTime, fields, isLoading, session, formId, triggerAutoSave]);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      question: "Untitled Question",
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1"] : undefined,
      max: type === "rating" ? 5 : undefined
    };
    setFields([...fields, newField]);
    setShowAddPanel(false);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter(field => field.id !== id));
    }
  };

  const duplicateField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field) {
      const newField = { ...field, id: Date.now().toString() };
      const index = fields.findIndex(f => f.id === id);
      const newFields = [...fields];
      newFields.splice(index + 1, 0, newField);
      setFields(newFields);
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFields(newFields);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveField(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access the form builder.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-6">
        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 hover:shadow-md transition-shadow duration-200">
          <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>
          
          <div className="p-8">
            <div className="mb-6">
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-3xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-400 mb-4"
                placeholder="Form title"
              />
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-gray-600 border-none bg-transparent p-0 resize-none focus-visible:ring-0 placeholder:text-gray-400 text-base leading-relaxed"
                placeholder="Add a description to help people understand your form"
                rows={2}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Palette className="w-4 h-4" />
                <span>Powered by Fomi</span>
              </div>
              <div className="flex items-center gap-4">
                {error && (
                  <div className="text-xs text-red-500 flex items-center gap-1">
                    <span>Save failed</span>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600">×</button>
                  </div>
                )}
                {isSaving && (
                  <div className="text-xs text-blue-600 flex items-center gap-1">
                    <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                )}
                {lastSaved && !isSaving && (
                  <div className="text-xs text-green-600">
                    Saved {lastSaved.toLocaleTimeString()}
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  Form ID: {formId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`transition-all duration-200 ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              }`}
            >
              <FormElement
                field={field}
                index={index}
                onUpdate={(updates) => updateField(field.id, updates)}
                onDelete={() => deleteField(field.id)}
                onDuplicate={() => duplicateField(field.id)}
                isDragging={draggedIndex === index}
              />
            </div>
          ))}
        </div>

        {/* Add Field Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setShowAddPanel(true)}
            className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl px-8 py-4 h-auto transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <Plus className="w-5 h-5 mr-3 text-gray-500 group-hover:text-indigo-500 transition-colors" />
            <span className="font-medium">Add question</span>
          </Button>
        </div>

        {showAddPanel && (
          <AddFieldPanel
            onAddField={addField}
            onClose={() => setShowAddPanel(false)}
          />
        )}
      </div>
    </div>
  );
}

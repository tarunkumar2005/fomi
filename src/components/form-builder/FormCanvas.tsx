"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Palette, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormElement } from "./FormElement";
import { AddFieldPanel } from "./AddFieldPanel";
import { useFormSave } from "@/hooks/useFormSave";
import { useSession } from "@/hooks/useSession";
import { calculateEstimatedTime } from "@/lib/timeEstimation";

interface FormField {
  id: string;
  type: "TEXT" | "TEXTAREA" | "SELECT" | "RADIO" | "CHECKBOX" | "EMAIL" | "PHONE" | "NUMBER" | "RATING" | "FILE" | "DATE" | "TIME";
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
}

interface FormCanvasProps {
  formId: string;
  onSaveStateChange?: (isSaving: boolean, lastSaved: Date | null) => void;
}

export function FormCanvas({ formId, onSaveStateChange }: FormCanvasProps) {
  const { isAuthenticated } = useSession();
  const { 
    isSaving, 
    lastSaved, 
    error, 
    triggerAutoSave, 
    loadForm, 
    clearError,
    manualSave
  } = useFormSave();

  const [formTitle, setFormTitle] = useState("Untitled form");
  const [formDescription, setFormDescription] = useState("Form description");
  const [estimatedTime, setEstimatedTime] = useState("5-7 minutes");
  const [fields, setFields] = useState<FormField[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized form data
  const formData = useMemo(() => ({
    id: formId,
    title: formTitle,
    description: formDescription,
    estimatedTime,
    fields
  }), [formId, formTitle, formDescription, estimatedTime, fields]);

  // Load form data
  useEffect(() => {
    const initializeForm = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      const result = await loadForm(formId);
      
      if (result.success && result.form) {
        const form = result.form;
        setFormTitle(form.title || "Untitled form");
        setFormDescription(form.description || "Form description");
        setEstimatedTime(form.estimatedTime || "5-7 minutes");
        
        const convertedFields = form.fields.map((field: FormField) => ({
          id: field.id,
          type: field.type.toUpperCase(), // Normalize to uppercase
          question: field.question,
          required: field.required,
          options: field.options && typeof field.options === 'string' ? JSON.parse(field.options) : field.options,
          placeholder: field.placeholder,
          rows: field.rows,
          min: field.min,
          max: field.max,
          step: field.step,
          minLength: field.minLength,
          maxLength: field.maxLength,
        }));
        
        setFields(convertedFields);
        toast.success("Form loaded successfully");
      } else {
        toast.error("Failed to load form");
      }
      setIsLoading(false);
    };

    initializeForm();
  }, [formId, isAuthenticated, loadForm]);

  // Auto-calculate estimated time when fields change
  useEffect(() => {
    if (fields.length > 0) {
      const newEstimatedTime = calculateEstimatedTime(fields);
      if (newEstimatedTime !== estimatedTime) {
        setEstimatedTime(newEstimatedTime);
      }
    }
  }, [fields, estimatedTime]);

  const handleManualSave = useCallback(async () => {
    const result = await manualSave(formData);
    
    if (result.success) {
      toast.success("Form saved successfully");
    } else {
      toast.error("Failed to save form");
    }
  }, [manualSave, formData]);

  // Notify parent of save state changes
  useEffect(() => {
    if (onSaveStateChange) {
      onSaveStateChange(isSaving, lastSaved);
    }
  }, [isSaving, lastSaved, onSaveStateChange]);

  // Listen for manual save events from header
  useEffect(() => {
    const handleManualSaveEvent = () => {
      handleManualSave();
    };

    window.addEventListener('manualSave', handleManualSaveEvent);
    return () => window.removeEventListener('manualSave', handleManualSaveEvent);
  }, [handleManualSave]);

  // Auto-save when data changes (memoized)
  useEffect(() => {
    if (!isLoading && isAuthenticated && formId) {
      triggerAutoSave(formData);
    }
  }, [formData, isLoading, isAuthenticated, formId, triggerAutoSave]);

  const addField = useCallback((type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      question: "Untitled Question",
      required: false,
      options: type === "SELECT" || type === "RADIO" || type === "CHECKBOX" ? ["Option 1"] : undefined,
      max: type === "RATING" ? 5 : undefined
    };
    setFields(prev => [...prev, newField]);
    setShowAddPanel(false);
    toast.success("Field added successfully");
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields(prev => {
      if (prev.length > 1) {
        toast.success("Field deleted");
        return prev.filter(field => field.id !== id);
      } else {
        toast.error("Cannot delete the last field");
        return prev;
      }
    });
  }, []);

  const duplicateField = useCallback((id: string) => {
    setFields(prev => {
      const field = prev.find(f => f.id === id);
      if (field) {
        const newField = { ...field, id: Date.now().toString() };
        const index = prev.findIndex(f => f.id === id);
        const newFields = [...prev];
        newFields.splice(index + 1, 0, newField);
        toast.success("Field duplicated");
        return newFields;
      }
      return prev;
    });
  }, []);

  const moveField = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setFields(prev => {
      const newFields = [...prev];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return newFields;
    });
  }, []);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    if (draggedIndex !== null && draggedIndex !== index) {
      moveField(draggedIndex, index);
      setDraggedIndex(index);
    }
  }, [draggedIndex, moveField]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to access the form builder.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="max-w-3xl mx-auto py-8 px-6">
          {/* Header Skeleton */}
          <div className="bg-card rounded-xl shadow-sm border overflow-hidden mb-8">
            <div className="h-3 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
            <div className="p-8">
              <div className="mb-6 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Fields Skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-3xl mx-auto py-8 px-6">
        {/* Form Header */}
        <div className="bg-card rounded-xl shadow-sm border overflow-hidden mb-8 hover:shadow-md transition-shadow duration-200">
          <div className="h-3 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
          
          <div className="p-8">
            <div className="mb-6">
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-3xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground mb-4 cursor-text"
                placeholder="Form title"
              />
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-muted-foreground border-none bg-transparent p-0 resize-none focus-visible:ring-0 placeholder:text-muted-foreground text-base leading-relaxed cursor-text"
                placeholder="Add a description to help people understand your form"
                rows={2}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Palette className="w-4 h-4" />
                <span>Powered by Fomi</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground">
                  Estimated time: {estimatedTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              {/* Drop indicator */}
              {dragOverIndex === index && draggedIndex !== index && (
                <div className="absolute -top-2 left-0 right-0 h-1 bg-indigo-500 rounded-full opacity-75 z-10" />
              )}
              
              <div
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDragLeave={handleDragLeave}
                className={`transition-all duration-200 ${
                  draggedIndex === index ? 'opacity-50 scale-95 rotate-2' : ''
                } ${dragOverIndex === index && draggedIndex !== index ? 'transform translate-y-2' : ''}`}
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
            </div>
          ))}
        </div>

        {/* Add Field Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setShowAddPanel(true)}
            variant="outline"
            className="border-2 border-dashed hover:border-primary/50 rounded-xl px-8 py-4 h-auto transition-all duration-200 group"
          >
            <Plus className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
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

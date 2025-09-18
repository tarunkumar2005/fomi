"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, CheckCircle, AlertCircle, Clock, BarChart3, Users } from "lucide-react";
import { ShortAnswerPreview } from "@/components/form-builder/form-elements/short-answer";
import { ParagraphPreview } from "@/components/form-builder/form-elements/paragraph";
import { MultipleChoicePreview } from "@/components/form-builder/form-elements/multiple-choice";
import { CheckboxesPreview } from "@/components/form-builder/form-elements/checkboxes";
import { DropdownPreview } from "@/components/form-builder/form-elements/dropdown";
import NumberPreview from "@/components/form-builder/form-elements/number-input";
import RatingPreview from "@/components/form-builder/form-elements/rating";
import FilePreview from "@/components/form-builder/form-elements/file-upload";
import DatePreview from "@/components/form-builder/form-elements/date-picker";
import TimePreview from "@/components/form-builder/form-elements/time-picker";
import { useFormSave } from "@/hooks/useFormSave";

interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "email" | "phone" | "number" | "rating" | "file" | "date" | "time";
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  rows?: number;
  min?: number | string;
  max?: number | string;
  step?: number;
}

interface FormData {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: string;
  fields: FormField[];
}

export default function FormPreview() {
  const params = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { loadForm } = useFormSave();

  // Load form data
  useEffect(() => {
    const loadFormData = async () => {
      setIsLoading(true);
      console.log("Loading form for preview:", params.id);
      
      const result = await loadForm(params.id, true); // true for preview mode
      
      if (result.success && result.form) {
        const loadedForm = result.form;
        
        // Convert database fields to frontend format
        const convertedFields = loadedForm.fields.map((field: any) => ({
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

        setForm({
          id: loadedForm.id,
          title: loadedForm.title || "Untitled Form",
          description: loadedForm.description || "Form description",
          estimatedTime: loadedForm.estimatedTime || "5-7 minutes",
          fields: convertedFields
        });
        
        console.log("Form loaded successfully for preview:", loadedForm.id);
      } else {
        console.error("Failed to load form for preview:", result.error);
        setLoadError(result.error || "Failed to load form");
      }
      setIsLoading(false);
    };

    loadFormData();
  }, [params.id, loadForm]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleBack = () => {
    window.location.href = `/form/${params.id}/edit`;
  };

  const handleClearForm = () => {
    setFormData({});
    setErrors({});
  };

  const validateField = (field: FormField): string | null => {
    const value = formData[field.id];
    
    if (field.required) {
      if (field.type === "checkbox") {
        if (!Array.isArray(value) || value.length === 0) {
          return "Please select at least one option";
        }
      } else if (field.type === "file") {
        if (!Array.isArray(value) || value.length === 0) {
          return "Please upload at least one file";
        }
      } else {
        if (!value || value.toString().trim() === "") {
          return "This field is required";
        }
      }
    }
    
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }
    
    return null;
  };

  const validateForm = (): boolean => {
    if (!form) return false;
    
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      const error = validateField(field);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id];
    
    try {
      switch (field.type) {
        case "text":
        case "email":
        case "phone":
          return (
            <ShortAnswerPreview
              field={field as any}
              value={formData[field.id] || ""}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "textarea":
          return (
            <ParagraphPreview
              field={field as any}
              value={formData[field.id] || ""}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "select":
          return (
            <DropdownPreview
              field={field as any}
              value={formData[field.id] || ""}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "radio":
          return (
            <MultipleChoicePreview
              field={field as any}
              value={formData[field.id] || ""}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "checkbox":
          return (
            <CheckboxesPreview
              field={field as any}
              value={formData[field.id] || []}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "number":
          return (
            <NumberPreview
              field={field as any}
              value={formData[field.id] || ""}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "rating":
          return (
            <RatingPreview
              field={field as any}
              value={formData[field.id] || 0}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "file":
          return (
            <FilePreview
              field={field as any}
              value={formData[field.id] || []}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "date":
          return (
            <DatePreview
              field={field as any}
              value={formData[field.id] || ""}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        case "time":
          return (
            <TimePreview
              field={field as any}
              value={formData[field.id] || ""}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={fieldError}
            />
          );
        default:
          return (
            <div className="text-gray-500 p-3 bg-gray-50 rounded border">
              Unsupported field type: {field.type}
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering field:", error);
      return (
        <div className="text-red-500 p-3 bg-red-50 rounded border border-red-200">
          Error loading field component
        </div>
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Submit form response to API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Form submitted:", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h1>
          <p className="text-gray-600 mb-6">{loadError || "The form you're looking for doesn't exist or has been deleted."}</p>
          <Button onClick={handleBack} variant="outline">
            Back to Editor
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-medium text-gray-900">Fomi</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your response has been recorded</h1>
            <p className="text-gray-600 mb-6">Thank you for completing the form.</p>
            <Button onClick={handleBack} variant="outline">
              Back to Editor
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Full-width Header */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            
            <div className="h-4 w-px bg-gray-300" />
            
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-gray-900">Form Preview</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{form.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>{form.fields.length} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Powered by Fomi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Enhanced Form Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="border-l-4 border-indigo-500 pl-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {form.title}
            </h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              {form.description}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-6 mt-6 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Estimated time: {form.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>{form.fields.length} questions</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field, index) => (
            <div key={field.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <label className="block text-base font-medium text-gray-900 mb-2">
                  {field.question}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
              
              {renderField(field)}
            </div>
          ))}

          {/* Simple Submit Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {Object.keys(errors).length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Please fix the errors above before submitting.
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClearForm}
                disabled={isSubmitting}
              >
                Clear form
              </Button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Never submit passwords through Fomi forms.
        </div>
      </div>
    </div>
  );
}

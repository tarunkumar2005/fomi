"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, CheckCircle, AlertCircle, Clock, BarChart3, Users, Send, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const { loadForm } = useFormSave();

  useEffect(() => {
    const fetchForm = async () => {
      setIsLoading(true);
      try {
        const result = await loadForm(params.id, true);
        if (result.success && result.form) {
          setForm(result.form);
        }
      } catch (error) {
        console.error("Failed to load form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [params.id, loadForm]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    form?.fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedFields = form?.fields.filter(field => formData[field.id]?.trim()).length || 0;
  const totalFields = form?.fields.length || 0;
  const progressPercentage = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
            <p className="text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your response has been submitted successfully.</p>
            <Button 
              onClick={() => window.close()} 
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                <Eye className="w-3 h-3 mr-1" />
                Preview Mode
              </Badge>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {form.estimatedTime || "5 min"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Form Header */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-xl border-0">
          <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-lg"></div>
          <CardHeader className="pb-6">
            <div className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                {form.title}
              </CardTitle>
              {form.description && (
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {form.description}
                </p>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{completedFields} of {totalFields} completed</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Form Fields */}
        <div className="space-y-6">
          {form.fields.map((field, index) => {
            const fieldType = field.type.toUpperCase();
            
            return (
              <Card key={field.id} className="bg-white/70 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        {field.question}
                        {field.required && <span className="text-red-500">*</span>}
                      </h3>
                    </div>
                    
                    {errors[field.id] && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors[field.id]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {(() => {
                      switch (fieldType) {
                        case "TEXT":
                        case "EMAIL":
                        case "PHONE":
                          return (
                            <ShortAnswerPreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "TEXTAREA":
                          return (
                            <ParagraphPreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "RADIO":
                          return (
                            <MultipleChoicePreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "CHECKBOX":
                          return (
                            <CheckboxesPreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "SELECT":
                          return (
                            <DropdownPreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "NUMBER":
                          return (
                            <NumberPreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "RATING":
                          return (
                            <RatingPreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "FILE":
                          return (
                            <FilePreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "DATE":
                          return (
                            <DatePreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        case "TIME":
                          return (
                            <TimePreview
                              field={field}
                              value={formData[field.id] || ""}
                              onChange={(value) => handleFieldChange(field.id, value)}
                              error={errors[field.id]}
                            />
                          );
                        default:
                          return (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-600 text-sm">
                                Unsupported field type: {field.type}
                              </p>
                            </div>
                          );
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submit Button */}
        <Card className="mt-8 bg-white/70 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Form
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Your response will be recorded securely
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by <span className="font-semibold text-indigo-600">Fomi</span></p>
        </div>
      </div>
    </div>
  );
}

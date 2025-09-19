"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "@/hooks/useSession";

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
}

interface FormData {
  id?: string;
  title: string;
  description?: string;
  estimatedTime?: string;
  fields: FormField[];
}

interface UseFormSaveOptions {
  autoSaveInterval?: number;
}

export function useFormSave(options: UseFormSaveOptions = {}) {
  const { autoSaveInterval = 30000 } = options;
  const { session } = useSession();
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFormDataRef = useRef<string>("");

  const clearAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
  }, []);

  const saveForm = useCallback(async (formData: FormData, force = false) => {
    if (!session || !session?.user?.id) {
      setError("User not authenticated");
      return { success: false, error: "User not authenticated" };
    }

    const currentDataString = JSON.stringify(formData);
    
    if (!force && currentDataString === lastFormDataRef.current) {
      return { success: true, message: "No changes to save" };
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/forms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: formData.id, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save form");
      }

      setLastSaved(new Date());
      lastFormDataRef.current = currentDataString;
      
      return { success: true, form: result.form };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save form";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [session, session?.user?.id]);

  const scheduleAutoSave = useCallback((formData: FormData) => {
    clearAutoSave();
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveForm(formData, false);
    }, autoSaveInterval);
  }, [clearAutoSave, saveForm, autoSaveInterval]);

  const manualSave = useCallback((formData: FormData) => {
    clearAutoSave();
    return saveForm(formData, true);
  }, [clearAutoSave, saveForm]);

  const triggerAutoSave = useCallback((formData: FormData) => {
    if (formData.id && session) {
      scheduleAutoSave(formData);
    }
  }, [scheduleAutoSave, session]);

  const loadForm = useCallback(async (id: string, isPreview = false) => {
    try {
      const url = isPreview ? `/api/forms/${id}?preview=true` : `/api/forms/${id}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load form");
      }
      
      return { success: true, form: result.form };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load form";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    return () => clearAutoSave();
  }, [clearAutoSave]);

  return {
    isSaving,
    lastSaved,
    error,
    session,
    manualSave,
    triggerAutoSave,
    loadForm,
    clearError: () => setError(null),
  };
}

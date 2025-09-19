"use server"

import { prisma } from "@/lib/db";
import { FieldType, Prisma } from "@prisma/client";

export const checkIfUserExists = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  return !!user;
}

// Types for form data
interface FormFieldData {
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

interface FormData {
  id?: string; // Optional for new forms
  title: string;
  description?: string;
  estimatedTime?: string;
  fields: FormFieldData[];
}

// Map frontend field types to Prisma enum
const mapFieldType = (type: string): FieldType => {
  const typeMap: Record<string, FieldType> = {
    "text": "TEXT",
    "email": "EMAIL", 
    "phone": "PHONE",
    "textarea": "TEXTAREA",
    "radio": "RADIO",
    "checkbox": "CHECKBOX",
    "select": "SELECT",
    "number": "NUMBER",
    "rating": "RATING",
    "date": "DATE",
    "time": "TIME",
    "file": "FILE"
  };
  return typeMap[type] || "TEXT";
};

// Create a new form
export const createForm = async (userId: string, formData: FormData) => {
  try {
    const form = await prisma.form.create({
      data: {
        userId,
        title: formData.title,
        description: formData.description,
        estimatedTime: formData.estimatedTime,
        slug: `form-${Date.now()}`, // Generate unique slug
        fields: {
          create: formData.fields.map((field, index) => ({
            question: field.question,
            type: mapFieldType(field.type),
            required: field.required,
            order: index,
            placeholder: field.placeholder,
            options: field.options ? JSON.stringify(field.options) : Prisma.DbNull,
            rows: field.rows,
            min: field.min,
            max: field.max,
            step: field.step,
            maxRating: field.type === "rating" ? (field.max || 5) : null,
          }))
        }
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return { success: true, form };
  } catch (error) {
    console.error("Error creating form:", error);
    return { success: false, error: "Failed to create form" };
  }
};

// Update an existing form
export const updateForm = async (formId: string, userId: string, formData: FormData) => {
  try {
    // Verify form ownership
    const existingForm = await prisma.form.findFirst({
      where: { id: formId, userId }
    });

    if (!existingForm) {
      return { success: false, error: "Form not found or access denied" };
    }

    // Delete existing fields and create new ones (simpler than complex updates)
    await prisma.field.deleteMany({
      where: { formId }
    });

    const form = await prisma.form.update({
      where: { id: formId },
      data: {
        title: formData.title,
        description: formData.description,
        estimatedTime: formData.estimatedTime,
        updatedAt: new Date(),
        fields: {
          create: formData.fields.map((field, index) => ({
            question: field.question,
            type: mapFieldType(field.type),
            required: field.required,
            order: index,
            placeholder: field.placeholder,
            options: field.options ? JSON.stringify(field.options) : Prisma.DbNull,
            rows: field.rows,
            min: field.min,
            max: field.max,
            step: field.step,
          }))
        }
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return { success: true, form };
  } catch (error) {
    console.error("Error updating form:", error);
    return { success: false, error: "Failed to update form" };
  }
};

// Get form by ID with fields - FIXED
export const getFormById = async (formId: string, userId?: string) => {
  try {
    console.log("Getting form by ID:", formId, "for user:", userId);
    
    const form = await prisma.form.findFirst({
      where: { 
        id: formId,
        ...(userId && { userId }) // Only check userId if provided
      },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    console.log("Form found:", !!form, "Fields count:", form?.fields?.length || 0);

    if (!form) {
      return { success: false, error: "Form not found" };
    }

    return { success: true, form };
  } catch (error) {
    console.error("Error fetching form:", error);
    return { success: false, error: "Failed to fetch form" };
  }
};

// Get all forms for a user
export const getUserForms = async (userId: string) => {
  try {
    const forms = await prisma.form.findMany({
      where: { userId },
      include: {
        fields: {
          select: { id: true }
        },
        responses: {
          select: { id: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform to include counts
    const formsWithCounts = forms.map(form => ({
      ...form,
      fieldCount: form.fields.length,
      responseCount: form.responses.length,
      fields: undefined, // Remove fields array
      responses: undefined // Remove responses array
    }));

    return { success: true, forms: formsWithCounts };
  } catch (error) {
    console.error("Error fetching user forms:", error);
    return { success: false, error: "Failed to fetch forms" };
  }
};

// Delete a form
export const deleteForm = async (formId: string, userId: string) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: formId, userId }
    });

    if (!form) {
      return { success: false, error: "Form not found or access denied" };
    }

    await prisma.form.delete({
      where: { id: formId }
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting form:", error);
    return { success: false, error: "Failed to delete form" };
  }
};

// Publish/unpublish form
export const toggleFormPublish = async (formId: string, userId: string, isPublished: boolean) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: formId, userId }
    });

    if (!form) {
      return { success: false, error: "Form not found or access denied" };
    }

    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: {
        isPublished,
        isDraft: !isPublished,
        publishedAt: isPublished ? new Date() : null
      }
    });

    return { success: true, form: updatedForm };
  } catch (error) {
    console.error("Error toggling form publish status:", error);
    return { success: false, error: "Failed to update form status" };
  }
};

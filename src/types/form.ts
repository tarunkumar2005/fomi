import { FieldType } from "@prisma/client";

// Base field interface
export interface BaseField {
  id: string;
  type: FieldType;
  question: string;
  description?: string;
  required: boolean;
  order: number;
}

// Field-specific configurations
export interface TextField extends BaseField {
  type: "TEXT" | "EMAIL" | "PHONE" | "URL";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface TextareaField extends BaseField {
  type: "TEXTAREA";
  placeholder?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

export interface ChoiceField extends BaseField {
  type: "RADIO" | "CHECKBOX" | "SELECT";
  options: string[];
}

export interface NumberField extends BaseField {
  type: "NUMBER";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface RatingField extends BaseField {
  type: "RATING";
  maxRating: number;
}

export interface DateTimeField extends BaseField {
  type: "DATE" | "TIME";
  minDate?: string;
  maxDate?: string;
  minTime?: string;
  maxTime?: string;
}

export interface FileField extends BaseField {
  type: "FILE";
  acceptedTypes?: string;
  maxFileSize?: number;
  maxFiles?: number;
}

// Union type for all field types
export type FormField = 
  | TextField 
  | TextareaField 
  | ChoiceField 
  | NumberField 
  | RatingField 
  | DateTimeField 
  | FileField;

// Form interfaces
export interface Form {
  id: string;
  title: string;
  description?: string;
  slug: string;
  isPublished: boolean;
  isDraft: boolean;
  estimatedTime?: string;
  theme?: FormTheme;
  settings?: FormSettings;
  viewCount: number;
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
  fields: FormField[];
}

export interface FormTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
}

export interface FormSettings {
  allowMultipleResponses?: boolean;
  showProgressBar?: boolean;
  redirectUrl?: string;
  confirmationMessage?: string;
}

// Builder interfaces
export interface FieldBuilderProps<T extends FormField = FormField> {
  field: T;
  onUpdate: (updates: Partial<T>) => void;
}

export interface FieldPreviewProps<T extends FormField = FormField> {
  field: T;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  error?: string;
}

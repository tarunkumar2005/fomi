interface FormField {
  type: string;
  options?: string[];
  required: boolean;
  minLength?: number;
  maxLength?: number;
}

export function calculateEstimatedTime(fields: FormField[]): string {
  let totalSeconds = 0;
  
  // Base time for reading form title and description
  totalSeconds += 15;
  
  fields.forEach(field => {
    const fieldType = field.type.toUpperCase();
    
    switch (fieldType) {
      case 'TEXT':
      case 'EMAIL':
      case 'PHONE':
        // Short text inputs: 10-20 seconds
        totalSeconds += field.required ? 20 : 15;
        if (field.minLength && field.minLength > 20) totalSeconds += 10;
        break;
        
      case 'TEXTAREA':
        // Long text: 30-60 seconds
        totalSeconds += field.required ? 45 : 30;
        if (field.minLength && field.minLength > 100) totalSeconds += 30;
        break;
        
      case 'SELECT':
      case 'RADIO':
        // Choice fields: 5-15 seconds based on options
        const optionCount = field.options?.length || 3;
        totalSeconds += Math.min(5 + (optionCount * 2), 20);
        break;
        
      case 'CHECKBOX':
        // Multiple choice: 10-25 seconds
        const checkboxCount = field.options?.length || 3;
        totalSeconds += Math.min(10 + (checkboxCount * 3), 30);
        break;
        
      case 'NUMBER':
        // Number input: 8-15 seconds
        totalSeconds += field.required ? 15 : 10;
        break;
        
      case 'RATING':
        // Rating: 5-10 seconds (quick)
        totalSeconds += 8;
        break;
        
      case 'FILE':
        // File upload: 30-60 seconds
        totalSeconds += 45;
        break;
        
      case 'DATE':
      case 'TIME':
        // Date/time picker: 10-20 seconds
        totalSeconds += 15;
        break;
        
      default:
        // Unknown field type: default 15 seconds
        totalSeconds += 15;
    }
    
    // Add extra time for required fields (thinking time)
    if (field.required) {
      totalSeconds += 5;
    }
  });
  
  // Add buffer time (20% extra)
  totalSeconds = Math.ceil(totalSeconds * 1.2);
  
  // Convert to human readable format
  if (totalSeconds < 60) {
    return "< 1 minute";
  } else if (totalSeconds < 120) {
    return "1-2 minutes";
  } else if (totalSeconds < 300) {
    const minutes = Math.ceil(totalSeconds / 60);
    return `${minutes-1}-${minutes} minutes`;
  } else {
    const minutes = Math.ceil(totalSeconds / 60);
    return `${minutes-2}-${minutes} minutes`;
  }
}

// Generate consistent IDs that work both client and server side
export function generateFormId(): string {
  // Use a combination of timestamp and random string for uniqueness
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `form_${timestamp}_${randomPart}`;
}

export function generateFieldId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `field_${timestamp}_${randomPart}`;
}

// Validate if an ID looks like a form ID
export function isValidFormId(id: string): boolean {
  return id.startsWith('form_') || id.length > 10; // Support both new and existing IDs
}

// Check if this is a "new" form placeholder
export function isNewForm(id: string): boolean {
  return id === 'new' || id === 'create';
}

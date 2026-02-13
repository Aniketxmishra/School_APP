export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationResult => {
  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  return { isValid: true };
};

export const validateStudentId = (studentId: string): ValidationResult => {
  const studentIdRegex = /^[A-Z]{2,3}\d{4,8}$/;
  
  if (!studentId.trim()) {
    return { isValid: false, error: 'Student ID is required' };
  }
  
  if (!studentIdRegex.test(studentId.toUpperCase())) {
    return { isValid: false, error: 'Student ID format: ABC1234 or AB123456' };
  }
  
  return { isValid: true };
};
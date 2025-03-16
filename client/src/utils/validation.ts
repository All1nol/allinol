/**
 * Validation utility functions for form validation
 */

/**
 * Validates that a value is not empty
 */
export const required = (value: any, message = 'This field is required'): string | null => {
  if (value === undefined || value === null || value === '') {
    return message;
  }
  return null;
};

/**
 * Validates that a value is a number within a specified range
 */
export const numberInRange = (
  value: number,
  min?: number,
  max?: number,
  message?: string
): string | null => {
  if (value === undefined || value === null) {
    return null; // Let required validation handle this
  }

  if (typeof value !== 'number' || isNaN(value)) {
    return 'Please enter a valid number';
  }

  if (min !== undefined && value < min) {
    return message || `Value must be at least ${min}`;
  }

  if (max !== undefined && value > max) {
    return message || `Value must be at most ${max}`;
  }

  return null;
};

/**
 * Validates that a value is a valid email address
 */
export const email = (value: string, message = 'Please enter a valid email address'): string | null => {
  if (!value) {
    return null; // Let required validation handle this
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return message;
  }

  return null;
};

/**
 * Validates that a value has a minimum length
 */
export const minLength = (
  value: string,
  min: number,
  message?: string
): string | null => {
  if (!value) {
    return null; // Let required validation handle this
  }

  if (value.length < min) {
    return message || `Must be at least ${min} characters`;
  }

  return null;
};

/**
 * Validates that a value has a maximum length
 */
export const maxLength = (
  value: string,
  max: number,
  message?: string
): string | null => {
  if (!value) {
    return null; // Let required validation handle this
  }

  if (value.length > max) {
    return message || `Must be at most ${max} characters`;
  }

  return null;
};

/**
 * Combines multiple validators and returns the first error message
 */
export const composeValidators = (...validators: ((value: any) => string | null)[]) => (value: any) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return null;
};

/**
 * Creates a validator for an object with multiple fields
 */
export const createValidator = <T extends Record<string, any>>(
  validationRules: Record<keyof T, (value: any) => string | null>
) => {
  return (values: T) => {
    const errors: Record<string, string> = {};
    
    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key as keyof T](values[key as keyof T]);
      if (error) {
        errors[key] = error;
      }
    });
    
    return errors;
  };
}; 
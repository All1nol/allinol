import { createValidator, numberInRange, required } from '../utils/validation';
import useForm from './useForm';
import templateService from '../services/templateService';

export interface PerformanceFormValues {
  successRate: number;
  avgResponseTime: number;
  userRating: number;
  sampleSize: number;
}

interface UsePerformanceFormProps {
  templateId: string;
  versionId: string;
  onSuccess: () => void;
}

// Create a validator for the performance form
const validatePerformanceForm = createValidator<PerformanceFormValues>({
  successRate: (value) => numberInRange(value, 0, 100, 'Success rate must be between 0 and 100'),
  avgResponseTime: (value) => numberInRange(value, 0, undefined, 'Response time must be a positive number'),
  userRating: (value) => numberInRange(value, 0, 5, 'User rating must be between 0 and 5'),
  sampleSize: (value) => {
    const requiredError = required(value, 'Sample size is required');
    if (requiredError) return requiredError;
    
    return numberInRange(value, 1, undefined, 'Sample size must be at least 1');
  },
});

/**
 * Custom hook for handling performance form state and submission
 */
export function usePerformanceForm({ templateId, versionId, onSuccess }: UsePerformanceFormProps) {
  return useForm<PerformanceFormValues>({
    initialValues: {
      successRate: 0,
      avgResponseTime: 0,
      userRating: 0,
      sampleSize: 0,
    },
    validate: validatePerformanceForm,
    onSubmit: async (formValues) => {
      const result = await templateService.updateVersionPerformance(
        templateId,
        versionId,
        formValues
      );
      
      if (result.success) {
        onSuccess();
      } else {
        throw new Error(result.message || 'Failed to update performance metrics');
      }
    },
  });
} 
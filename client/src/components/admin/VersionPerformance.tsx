import React from 'react';
import { PromptTemplate } from '../../types/promptTemplate';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import useForm from '../../hooks/useForm';
import templateService from '../../services/templateService';
import { createValidator, numberInRange, required } from '../../utils/validation';

interface VersionPerformanceProps {
  template: PromptTemplate;
  versionId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

interface PerformanceFormValues {
  successRate: number;
  avgResponseTime: number;
  userRating: number;
  sampleSize: number;
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

const VersionPerformance: React.FC<VersionPerformanceProps> = ({
  template,
  versionId,
  onSubmit,
  onCancel,
}) => {
  // Initialize form with useForm hook
  const {
    values,
    errors,
    handleNumberChange,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useForm<PerformanceFormValues>({
    initialValues: {
      successRate: 0,
      avgResponseTime: 0,
      userRating: 0,
      sampleSize: 0,
    },
    validate: validatePerformanceForm,
    onSubmit: async (formValues) => {
      const result = await templateService.updateVersionPerformance(
        template._id,
        versionId,
        formValues
      );
      
      if (result.success) {
        onSubmit();
      } else {
        throw new Error(result.message || 'Failed to update performance metrics');
      }
    },
  });

  return (
    <Modal isOpen={true} onClose={onCancel} title="Update Performance Metrics">
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          Version: <span className="font-medium">{versionId}</span>
        </p>
      </div>

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Success Rate */}
          <FormInput
            id="successRate"
            label="Success Rate (%)"
            type="number"
            value={values.successRate}
            onChange={(e) => handleNumberChange('successRate', Number(e.target.value))}
            min={0}
            max={100}
            step="0.1"
            error={errors.successRate}
          />

          {/* Average Response Time */}
          <FormInput
            id="avgResponseTime"
            label="Average Response Time (ms)"
            type="number"
            value={values.avgResponseTime}
            onChange={(e) => handleNumberChange('avgResponseTime', Number(e.target.value))}
            min={0}
            step="1"
            error={errors.avgResponseTime}
          />

          {/* User Rating */}
          <FormInput
            id="userRating"
            label="User Rating (0-5)"
            type="number"
            value={values.userRating}
            onChange={(e) => handleNumberChange('userRating', Number(e.target.value))}
            min={0}
            max={5}
            step="0.1"
            error={errors.userRating}
          />

          {/* Sample Size */}
          <FormInput
            id="sampleSize"
            label="Sample Size"
            type="number"
            value={values.sampleSize}
            onChange={(e) => handleNumberChange('sampleSize', Number(e.target.value))}
            min={1}
            step="1"
            required
            error={errors.sampleSize}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Update Metrics
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default VersionPerformance; 
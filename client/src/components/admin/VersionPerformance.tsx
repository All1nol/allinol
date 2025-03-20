import React from 'react';
import { PromptTemplate } from '../../types/promptTemplate';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import { usePerformanceForm } from '../../hooks/usePerformanceForm';

interface VersionPerformanceProps {
  template: PromptTemplate;
  versionId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const VersionPerformance: React.FC<VersionPerformanceProps> = ({
  template,
  versionId,
  onSubmit,
  onCancel,
}) => {
  // Use the custom hook for form handling
  const {
    values,
    errors,
    handleNumberChange,
    isSubmitting,
    submitError,
    handleSubmit,
  } = usePerformanceForm({
    templateId: template._id,
    versionId,
    onSuccess: onSubmit
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
            title="successRate"
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
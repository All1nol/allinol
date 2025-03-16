import axios from 'axios';
import { PromptTemplate } from '../types/promptTemplate';

const API_URL = import.meta.env.VITE_API_URL;

interface PerformanceMetrics {
  successRate: number;
  avgResponseTime: number;
  userRating: number;
  sampleSize: number;
}

export const templateService = {
  /**
   * Get all prompt templates
   */
  getAllTemplates: async (): Promise<PromptTemplate[]> => {
    const response = await axios.get(`${API_URL}/prompt-templates`);
    return response.data.templates;
  },

  /**
   * Get a specific prompt template by ID
   */
  getTemplateById: async (templateId: string): Promise<PromptTemplate> => {
    const response = await axios.get(`${API_URL}/prompt-templates/${templateId}`);
    return response.data.template;
  },

  /**
   * Create a new prompt template
   */
  createTemplate: async (templateData: Partial<PromptTemplate>): Promise<PromptTemplate> => {
    const response = await axios.post(`${API_URL}/prompt-templates`, templateData);
    return response.data.template;
  },

  /**
   * Update a prompt template
   */
  updateTemplate: async (templateId: string, templateData: Partial<PromptTemplate>): Promise<PromptTemplate> => {
    const response = await axios.put(`${API_URL}/prompt-templates/${templateId}`, templateData);
    return response.data.template;
  },

  /**
   * Delete a prompt template
   */
  deleteTemplate: async (templateId: string): Promise<{ success: boolean }> => {
    const response = await axios.delete(`${API_URL}/prompt-templates/${templateId}`);
    return response.data;
  },

  /**
   * Update performance metrics for a specific version
   */
  updateVersionPerformance: async (
    templateId: string,
    versionId: string,
    performanceData: PerformanceMetrics
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.put(
        `${API_URL}/prompt-templates/${templateId}/versions/${versionId}/performance`,
        performanceData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.message || 'Failed to update performance metrics' 
        };
      }
      throw error;
    }
  }
};

export default templateService; 
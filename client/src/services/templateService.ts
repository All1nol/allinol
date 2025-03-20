import { PromptTemplate } from '../types/promptTemplate';
import httpClient, { IHttpClient } from './httpClient';

interface PerformanceMetrics {
  successRate: number;
  avgResponseTime: number;
  userRating: number;
  sampleSize: number;
}

interface TemplateResponse {
  template: PromptTemplate;
}

interface TemplatesResponse {
  templates: PromptTemplate[];
}

/**
 * Service for managing prompt templates
 */
class TemplateService {
  private readonly httpClient: IHttpClient;
  
  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get all prompt templates
   */
  async getAllTemplates(): Promise<PromptTemplate[]> {
    const response = await this.httpClient.get<TemplatesResponse>('/prompt-templates');
    return response.templates;
  }

  /**
   * Get a specific prompt template by ID
   */
  async getTemplateById(templateId: string): Promise<PromptTemplate> {
    const response = await this.httpClient.get<TemplateResponse>(`/prompt-templates/${templateId}`);
    return response.template;
  }

  /**
   * Create a new prompt template
   */
  async createTemplate(templateData: Partial<PromptTemplate>): Promise<PromptTemplate> {
    const response = await this.httpClient.post<TemplateResponse>('/prompt-templates', templateData);
    return response.template;
  }

  /**
   * Update a prompt template
   */
  async updateTemplate(templateId: string, templateData: Partial<PromptTemplate>): Promise<PromptTemplate> {
    const response = await this.httpClient.put<TemplateResponse>(`/prompt-templates/${templateId}`, templateData);
    return response.template;
  }

  /**
   * Delete a prompt template
   */
  async deleteTemplate(templateId: string): Promise<{ success: boolean }> {
    return await this.httpClient.delete<{ success: boolean }>(`/prompt-templates/${templateId}`);
  }

  /**
   * Update performance metrics for a specific version
   */
  async updateVersionPerformance(
    templateId: string,
    versionId: string,
    performanceData: PerformanceMetrics
  ): Promise<{ success: boolean; message?: string }> {
    try {
      return await this.httpClient.put<{ success: boolean; message?: string }>(
        `/prompt-templates/${templateId}/versions/${versionId}/performance`,
        performanceData
      );
    } catch (error) {
      if (error instanceof Error) {
        return { 
          success: false, 
          message: error.message || 'Failed to update performance metrics' 
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }
}

// Create and export a singleton instance
const templateService = new TemplateService(httpClient);

export default templateService; 
import apiClient from '../config/api';

/**
 * Interface for code analysis request
 * Match these with your backend API structure
 */
export interface CodeAnalysisRequest {
  code: string;
  language: string;
  fileName?: string;
}

/**
 * Interface for bug details
 */
export interface Bug {
  id?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  line: number;
  column?: number;
  suggestion?: string;
}

/**
 * Interface for security issues
 */
export interface SecurityIssue {
  id?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  line: number;
  cwe?: string;
  recommendation?: string;
}

/**
 * Interface for recommendations
 */
export interface Recommendation {
  id?: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact?: string;
}

/**
 * Interface for performance metrics
 */
export interface PerformanceMetrics {
  complexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  estimatedExecutionTime?: number;
}

/**
 * Interface for complete analysis response
 */
export interface CodeAnalysisResponse {
  id: string;
  qualityScore: number;
  bugs: Bug[];
  securityIssues: SecurityIssue[];
  recommendations: Recommendation[];
  performance: PerformanceMetrics;
  timestamp: string;
  language?: string;
  fileName?: string;
}

/**
 * Code Analysis Service
 * Handles all API calls related to code analysis
 */
export const codeAnalysisService = {
  /**
   * Analyze code using backend AI
   * @param data - Code analysis request data
   * @returns Analysis results from backend
   */
  analyzeCode: async (data: CodeAnalysisRequest): Promise<CodeAnalysisResponse> => {
    try {
      // POST request to backend /analysis/analyze endpoint
      // Adjust the endpoint path to match your backend
      const response = await apiClient.post('/analysis/analyze', data);
      return response.data;
    } catch (error) {
      console.error('Code analysis failed:', error);
      throw error;
    }
  },

  /**
   * Get analysis history for current user
   * @returns Array of previous analyses
   */
  getHistory: async (): Promise<CodeAnalysisResponse[]> => {
    try {
      const response = await apiClient.get('/analysis/history');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch history:', error);
      throw error;
    }
  },

  /**
   * Get specific analysis by ID
   * @param id - Analysis ID
   * @returns Single analysis result
   */
  getAnalysisById: async (id: string): Promise<CodeAnalysisResponse> => {
    try {
      const response = await apiClient.get(`/analysis/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
      throw error;
    }
  },

  /**
   * Delete an analysis
   * @param id - Analysis ID to delete
   */
  deleteAnalysis: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/analysis/${id}`);
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      throw error;
    }
  },

  /**
   * Re-analyze existing code
   * @param id - Previous analysis ID
   */
  reAnalyze: async (id: string): Promise<CodeAnalysisResponse> => {
    try {
      const response = await apiClient.post(`/analysis/${id}/reanalyze`);
      return response.data;
    } catch (error) {
      console.error('Failed to re-analyze:', error);
      throw error;
    }
  },
};

export default codeAnalysisService;

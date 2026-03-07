import apiClient from '../config/api';

/**
 * Interface for dashboard statistics
 */
export interface DashboardStats {
  totalAnalyses: number;
  bugsDetected: number;
  securityIssues: number;
  averageQualityScore: number;
  recentActivity: Activity[];
  languageDistribution: LanguageStats[];
  trendsData?: TrendsData;
}

/**
 * Interface for activity items
 */
export interface Activity {
  id: string;
  type: 'analysis' | 'bug' | 'security' | 'recommendation';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: any;
}

/**
 * Interface for language statistics
 */
export interface LanguageStats {
  language: string;
  count: number;
  percentage?: number;
}

/**
 * Interface for trends data
 */
export interface TrendsData {
  dates: string[];
  analyses: number[];
  bugs: number[];
  qualityScores: number[];
}

/**
 * Interface for recent analysis summary
 */
export interface RecentAnalysisSummary {
  id: string;
  fileName: string;
  language: string;
  qualityScore: number;
  bugsCount: number;
  timestamp: string;
  status: 'completed' | 'failed' | 'in-progress';
}

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns Dashboard stats including counts and recent activity
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get recent analyses summary
   * @param limit - Number of recent analyses to fetch
   * @returns Array of recent analysis summaries
   */
  getRecentAnalyses: async (limit: number = 10): Promise<RecentAnalysisSummary[]> => {
    try {
      const response = await apiClient.get('/dashboard/recent', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent analyses:', error);
      throw error;
    }
  },

  /**
   * Get activity feed
   * @param limit - Number of activities to fetch
   * @returns Array of activity items
   */
  getActivityFeed: async (limit: number = 20): Promise<Activity[]> => {
    try {
      const response = await apiClient.get('/dashboard/activity', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity feed:', error);
      throw error;
    }
  },

  /**
   * Get language distribution
   * @returns Array of language statistics
   */
  getLanguageDistribution: async (): Promise<LanguageStats[]> => {
    try {
      const response = await apiClient.get('/dashboard/languages');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch language distribution:', error);
      throw error;
    }
  },

  /**
   * Get trends data for charts
   * @param days - Number of days to fetch trends for
   * @returns Trends data for specified period
   */
  getTrends: async (days: number = 30): Promise<TrendsData> => {
    try {
      const response = await apiClient.get('/dashboard/trends', {
        params: { days },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trends:', error);
      throw error;
    }
  },

  /**
   * Refresh dashboard data
   * Forces a fresh fetch of all dashboard data
   */
  refreshDashboard: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.post('/dashboard/refresh');
      return response.data;
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      throw error;
    }
  },
};

export default dashboardService;

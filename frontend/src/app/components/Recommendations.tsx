import { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Shield, Zap, Code, CheckCircle, AlertTriangle, FileWarning } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useNavigate } from 'react-router-dom';
export default function Recommendations() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
    // Check if user is logged in
    const currentUserData = localStorage.getItem('codeguard_current_user');
    if (!currentUserData) {
      setLoading(false);
      return;
    }

    const currentUser = JSON.parse(currentUserData);

    // Load user-specific latest analysis
    const userAnalysisKey = `analysis_${currentUser.id}`;
    const latestAnalysis = localStorage.getItem(userAnalysisKey);
    
    if (latestAnalysis) {
      try {
        const data = JSON.parse(latestAnalysis);
        setAnalysisData(data);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading recommendations...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

if (!analysisData || !analysisData.ai_review) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <FileWarning className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">No Analysis Data</h2>
            <p className="text-gray-400 mb-6">
              Please analyze your code first to get personalized recommendations.
            </p>
            <a 
              href="/analyzer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Go to Code Analyzer
            </a>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const aiReview = analysisData.ai_review || {};
  const bugs = analysisData.bugs || [];

  // Generate personalized recommendations from actual bugs
  const recommendations = aiReview.suggestions || [];
  
  // Categorize recommendations
  const securityRecommendations = bugs
    .filter((bug: any) => bug.category === 'Security')
    .map((bug: any) => ({
      icon: Shield,
      title: bug.type,
      description: bug.message,
      priority: bug.severity.toLowerCase(),
      suggestion: bug.suggestion,
      category: 'Security'
    }));

  const performanceRecommendations = bugs
    .filter((bug: any) => 
      bug.type?.includes('Complexity') || 
      bug.type?.includes('Nested') ||
      bug.type?.includes('Long Function')
    )
    .map((bug: any) => ({
      icon: Zap,
      title: bug.type,
      description: bug.message,
      priority: bug.severity.toLowerCase(),
      suggestion: bug.suggestion,
      category: 'Performance'
    }));

  const codeQualityRecommendations = bugs
    .filter((bug: any) => bug.category === 'Code Smell')
    .map((bug: any) => ({
      icon: Code,
      title: bug.type,
      description: bug.message,
      priority: bug.severity.toLowerCase(),
      suggestion: bug.suggestion,
      category: 'Code Quality'
    }));

  const allCategorizedRecommendations = [
    ...securityRecommendations,
    ...performanceRecommendations,
    ...codeQualityRecommendations
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  

  const stats = {
    total: allCategorizedRecommendations.length,
    security: securityRecommendations.length,
    performance: performanceRecommendations.length,
    codeQuality: codeQualityRecommendations.length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl text-white mb-2 flex items-center gap-3">
            <Lightbulb className="w-10 h-10 text-yellow-400" />
            Personalized Recommendations
          </h1>
          <p className="text-gray-400">Actionable suggestions based on your code analysis</p>
        </div>

        {/* Stats Overview - Icons Left of Numbers */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">

  {/* Total Recommendations */}
  <div className="glass-card p-6 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
        <Lightbulb className="w-6 h-6 text-blue-400" />
      </div>
      <div>
        <span className="text-4xl text-white font-bold leading-none">
          {stats.total}
        </span>
        <p className="text-gray-400 text-sm">
          Total Recommendations
        </p>
      </div>
    </div>
  </div>

  {/* Security Improvements */}
  <div className="glass-card p-6 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
        <Shield className="w-6 h-6 text-red-400" />
      </div>
      <div>
        <span className="text-4xl text-white font-bold leading-none">
          {stats.security}
        </span>
        <p className="text-gray-400 text-sm">
          Security Improvements
        </p>
      </div>
    </div>
  </div>

  {/* Performance Optimizations */}
  <div className="glass-card p-6 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
        <Zap className="w-6 h-6 text-purple-400" />
      </div>
      <div>
        <span className="text-4xl text-white font-bold leading-none">
          {stats.performance}
        </span>
        <p className="text-gray-400 text-sm">
          Performance Optimizations
        </p>
      </div>
    </div>
  </div>

  {/* Code Quality Issues */}
  <div className="glass-card p-6 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
        <Code className="w-6 h-6 text-green-400" />
      </div>
      <div>
        <span className="text-4xl text-white font-bold leading-none">
          {stats.codeQuality}
        </span>
        <p className="text-gray-400 text-sm">
          Code Quality Issues
        </p>
      </div>
    </div>
  </div>

</div>

        {/* General AI Suggestions */}
        {recommendations.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              General Improvement Suggestions
            </h2>
            <div className="space-y-3">
              {recommendations.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specific Recommendations from Your Code */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-2xl text-white mb-6">Issues Found in Your Code</h2>
          
          {allCategorizedRecommendations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-xl text-white mb-2">No Issues Found!</p>
              <p className="text-gray-400">Your code looks great. Keep up the good work!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allCategorizedRecommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <div key={index} className="border border-gray-700 rounded-xl p-6 bg-[#0B0F1A] hover:border-blue-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg text-white font-semibold">{rec.title}</h3>
                          <span className="text-sm text-gray-500">{rec.category}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs uppercase font-semibold border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-4">{rec.description}</p>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">How to Fix:</span>
                      </div>
                      <p className="text-gray-300 text-sm">{rec.suggestion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Assessment */}
        {aiReview.overall_assessment && (
          <div className="glass-card p-8 rounded-xl neon-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-white mb-3">AI Assessment</h3>
                <p className="text-gray-300 leading-relaxed">
                  {aiReview.overall_assessment}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
    
  );
}
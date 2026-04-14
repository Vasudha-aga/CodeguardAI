import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, TrendingUp, Code, Shield, Zap, FileWarning } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
export default function AICodeReview() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // If no analysis data, show prompt
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analysis data...</p>
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
              Please analyze some code first to see AI-powered review and recommendations.
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

  // Extract data from backend response
  const reviewSummary = {
    overallScore: analysisData.quality_score || 0,
    strengths: aiReview.positive_aspects || [],
    improvements: aiReview.suggestions || [],
  };

  // Categorize bugs for AI insights
  const securityBugs = bugs.filter((bug: any) => bug.category === 'Security');
  const codeSmellBugs = bugs.filter((bug: any) => bug.category === 'Code Smell');

  // Calculate scores based on bugs
  const securityScore = Math.max(0, 100 - (securityBugs.length * 15));
  const codeQualityScore = analysisData.quality_score || 0;
  const performanceScore = Math.max(0, 100 - (codeSmellBugs.filter((b: any) => 
    b.type?.includes('Complexity') || b.type?.includes('Nested')
  ).length * 10));

  const aiInsights = [
    {
      icon: Shield,
      title: 'Security Analysis',
      score: securityScore,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      findings: securityBugs.length > 0 
        ? securityBugs.map((bug: any) => bug.message)
        : ['No security vulnerabilities detected', 'Code follows security best practices'],
    },
    {
      icon: Zap,
      title: 'Performance Insights',
      score: performanceScore,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      findings: aiReview.design_issues && aiReview.design_issues.length > 0
        ? aiReview.design_issues
        : ['No performance issues detected', 'Code structure is optimized'],
    },
    {
      icon: Code,
      title: 'Code Quality',
      score: codeQualityScore,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      findings: codeSmellBugs.length > 0
        ? codeSmellBugs.slice(0, 4).map((bug: any) => bug.message)
        : ['Clean code structure', 'Good coding practices followed', 'Well-organized code'],
    },
  ];

  // Create detailed suggestions from bugs
  const detailedSuggestions = bugs
    .filter((bug: any) => bug.severity === 'Critical' || bug.severity === 'High')
    .map((bug: any) => ({
      priority: bug.severity === 'Critical' ? 'high' : bug.severity.toLowerCase(),
      category: bug.category || 'General',
      title: bug.type || 'Code Issue',
      description: bug.message || '',
      impact: bug.suggestion || 'Improve code quality and reliability',
      codeExample: `Line ${bug.line}: ${bug.message}`,
    }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-blue-400" />
            AI Code Review
          </h1>
          <p className="text-gray-400">Advanced AI-powered analysis and recommendations</p>
        </div>

        {/* Overall Score Card */}
        <div className="glass-card p-8 rounded-2xl pulse-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl text-white mb-2">Overall Code Health Score</h2>
              <p className="text-gray-400">Based on comprehensive AI analysis of your codebase</p>
            </div>
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="10"
                  strokeDasharray={`${reviewSummary.overallScore * 3.14} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl gradient-text">{reviewSummary.overallScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="glass-card p-6 rounded-xl stat-card">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${insight.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${insight.color}`} />
                  </div>
                  <span className={`text-2xl ${insight.color}`}>{insight.score}/100</span>
                </div>
                <h3 className="text-xl text-white mb-4">{insight.title}</h3>
                <ul className="space-y-2">
                  {insight.findings.map((finding: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Summary Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl text-white">What's Working Well</h3>
            </div>
            <ul className="space-y-3">
              {reviewSummary.strengths.map((strength: any, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl text-white">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {reviewSummary.improvements.map((improvement: any, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed AI Recommendations - PERSONALIZED */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-2xl text-white mb-6">Personalized Recommendations for Your Code</h3>
          
          {detailedSuggestions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-xl text-white mb-2">Excellent Work!</p>
              <p className="text-gray-400">No critical or high-priority issues found in your code.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {detailedSuggestions.map((suggestion: any, index: number) => (
                <div key={index} className="border border-blue-500/20 rounded-xl p-6 bg-[#0B0F1A]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`
                        px-3 py-1 rounded-full text-xs uppercase font-semibold
                        ${suggestion.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : suggestion.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}
                      `}>
                        {suggestion.priority} priority
                      </span>
                      <span className="text-sm text-gray-400 px-3 py-1 bg-gray-800/50 rounded-full">
                        {suggestion.category}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xl text-white mb-3 font-semibold">{suggestion.title}</h4>
                  <p className="text-gray-300 mb-4 leading-relaxed">{suggestion.description}</p>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-400">Why Fix This:</span>
                    </div>
                    <p className="text-gray-300 text-sm">{suggestion.impact}</p>
                  </div>

                  {/* Specific Location in Your Code */}
                  <div className="bg-[#0E1325] rounded-lg p-4 border border-purple-500/20 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-400">Found in your code:</span>
                    </div>
                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                      <code>{suggestion.codeExample}</code>
                    </pre>
                  </div>
                  {/* Removed Apply Suggestion Button */}
                      <button
                      onClick={() => window.open('https://docs.python.org/3/tutorial/errors.html', '_blank')}
                      className="px-6 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                      >
                      Learn More
                      </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

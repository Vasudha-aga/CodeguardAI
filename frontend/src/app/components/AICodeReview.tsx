import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Lightbulb, ExternalLink, FileCode, Shield } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function AICodeReview() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load latest analysis
    const currentUserData = localStorage.getItem('codeguard_current_user');
    if (!currentUserData) {
      setLoading(false);
      return;
    }

    const currentUser = JSON.parse(currentUserData);
    const userAnalysisKey = `analysis_${currentUser.id}`;
    const latestAnalysis = localStorage.getItem(userAnalysisKey);

    if (latestAnalysis) {
      setAnalysisData(JSON.parse(latestAnalysis));
    }
    setLoading(false);
  }, []);

  // Dynamic Learn More links based on bug type
  const getLearnMoreLink = (bugType: string) => {
    const links: { [key: string]: string } = {
      // Python
      'Bare Except Clause': 'https://docs.python.org/3/tutorial/errors.html#handling-exceptions',
      'Long Function': 'https://refactoring.guru/smells/long-method',
      'Eval Usage': 'https://nedbatchelder.com/blog/201206/eval_really_is_dangerous.html',
      'Hardcoded Credential': 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
      'SQL Injection': 'https://owasp.org/www-community/attacks/SQL_Injection',
      'Unused Variable': 'https://www.python.org/dev/peps/pep-0008/#programming-recommendations',
      
      // JavaScript
      'Loose Equality': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness',
      'Deprecated var': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let',
      'Console.log': 'https://eslint.org/docs/rules/no-console',
      'Missing Semicolon': 'https://standardjs.com/rules.html#semicolons',
      
      // Java
      'System.out.println': 'https://www.baeldung.com/java-system-out-println-vs-loggers',
      'Empty Catch Block': 'https://wiki.sei.cmu.edu/confluence/display/java/ERR00-J',
      'Magic Number': 'https://refactoring.guru/replace-magic-number-with-symbolic-constant',
      'Long Method': 'https://refactoring.guru/smells/long-method',
      
      // C++
      'Memory Leak': 'https://en.cppreference.com/w/cpp/memory',
      'Namespace Pollution': 'https://www.learncpp.com/cpp-tutorial/using-declarations-and-using-directives/',
      'C-style Cast': 'https://en.cppreference.com/w/cpp/language/explicit_cast',
      'Buffer Overflow': 'https://owasp.org/www-community/vulnerabilities/Buffer_Overflow',
      'Uninitialized Pointer': 'https://en.cppreference.com/w/cpp/language/pointer',
      'Missing Virtual Destructor': 'https://isocpp.org/wiki/faq/virtual-functions#virtual-dtors',
    };

    // Return specific link or Google search
    return links[bugType] || `https://www.google.com/search?q=${encodeURIComponent(bugType + ' best practices')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'high': return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <CheckCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Loading AI Review...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analysisData || !analysisData.ai_review) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-white mb-2">AI Code Review</h1>
            <p className="text-gray-400">Get intelligent insights and recommendations for your code</p>
          </div>

          <div className="glass-card p-12 rounded-xl text-center">
            <FileCode className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No Analysis Available</h3>
            <p className="text-gray-400 mb-6">
              Run a code analysis first to get AI-powered recommendations
            </p>
            
            <a
              href="/analyzer"
              className="gradient-button px-6 py-3 rounded-lg text-white inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Analysis
            </a>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { ai_review } = analysisData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl text-white mb-2">AI Code Review</h1>
          <p className="text-gray-400">Intelligent analysis and personalized recommendations</p>
        </div>

        {/* Overall Assessment */}
        {ai_review.overall_assessment && (
          <div className="glass-card p-6 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl text-white mb-2 font-semibold">Overall Assessment</h3>
                <p className="text-gray-300 leading-relaxed">{ai_review.overall_assessment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Code Explanation */}
        {ai_review.code_explanation && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <FileCode className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl text-white font-semibold">Code Explanation</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{ai_review.code_explanation}</p>
          </div>
        )}

        {/* Language-Specific Tips */}
        {ai_review.language_tips && (
          <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl text-white font-semibold">Language-Specific Tips</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{ai_review.language_tips}</p>
          </div>
        )}

        {/* Suggestions */}
        {ai_review.suggestions && ai_review.suggestions.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl text-white font-semibold">Improvement Suggestions</h3>
            </div>
            <div className="space-y-4">
              {ai_review.suggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-[#0B0F1A] rounded-lg border border-green-500/20">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 text-sm font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed flex-1">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Issues */}
        {ai_review.design_issues && ai_review.design_issues.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl text-white font-semibold">Design Issues</h3>
            </div>
            <div className="space-y-3">
              {ai_review.design_issues.map((issue: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-[#0B0F1A] rounded-lg border border-orange-500/20">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-300 leading-relaxed flex-1">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Positive Aspects */}
        {ai_review.positive_aspects && ai_review.positive_aspects.length > 0 && (
          <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl text-white font-semibold">What You're Doing Right</h3>
            </div>
            <div className="space-y-2">
              {ai_review.positive_aspects.map((aspect: string, index: number) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{aspect}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized Recommendations */}
        {analysisData.findings && analysisData.findings.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-2xl text-white mb-6 font-semibold">Personalized Recommendations for Your Code</h3>
            <div className="space-y-6">
              {analysisData.findings.map((bug: any, index: number) => (
                <div key={index} className="bg-[#0B0F1A] rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(bug.severity)}
                      <div>
                        <h4 className="text-xl text-white font-semibold mb-2">{bug.type}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getSeverityColor(bug.severity)}`}>
                            {bug.severity?.toUpperCase() || 'MEDIUM'} PRIORITY
                          </span>
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {bug.category || 'Code Quality'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">{bug.message}</p>

                  {/* Why Fix This */}
                  <div className="bg-blue-500/5 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <h5 className="text-blue-400 font-semibold">Why Fix This:</h5>
                    </div>
                    <p className="text-gray-300 ml-7">{bug.suggestion || 'Improve code quality and maintainability'}</p>
                  </div>

                  {/* Location */}
                  {bug.line && (
                    <div className="bg-[#0A0E1A] border border-purple-500/20 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCode className="w-5 h-5 text-purple-400" />
                        <h5 className="text-purple-400 font-semibold">Found in your code:</h5>
                      </div>
                      <code className="text-gray-300 font-mono text-sm block ml-7">
                        Line {bug.line}: {bug.code || 'Check your code at this line'}
                      </code>
                    </div>
                  )}

                  {/* Learn More Button */}
                  <button
                    onClick={() => window.open(getLearnMoreLink(bug.type), '_blank')}
                    className="px-6 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30 flex items-center gap-2 group"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Learn More About This Issue
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

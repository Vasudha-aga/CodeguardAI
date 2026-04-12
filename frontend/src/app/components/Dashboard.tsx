import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Code,
  Bug,
  Zap,
  ArrowRight,
  FileCode  // ADD THIS LINE
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from './DashboardLayout';

export default function Dashboard() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

useEffect(() => {
    // Check if user is logged in
    const currentUserData = localStorage.getItem('codeguard_current_user');
    if (!currentUserData) {
      return;
    }

    const currentUser = JSON.parse(currentUserData);

    // Load user-specific latest analysis
    const userAnalysisKey = `analysis_${currentUser.id}`;
    const latestAnalysis = localStorage.getItem(userAnalysisKey);
    if (latestAnalysis) {
      setAnalysisData(JSON.parse(latestAnalysis));
    }

    // Load user-specific history
    const userHistoryKey = `history_${currentUser.id}`;
    const history = localStorage.getItem(userHistoryKey);
    if (history) {
      setHistoryData(JSON.parse(history));
    }
  }, []);

  // Calculate stats from real data
  const totalIssues = analysisData 
    ? (analysisData.summary?.critical || 0) + (analysisData.summary?.high || 0) + (analysisData.summary?.medium || 0)
    : 0;

  const qualityScore = analysisData?.quality_score || 0;
  const filesAnalyzed = historyData.length;

  // Prepare chart data from history
  const qualityTrendData = historyData.slice(-6).map((item, index) => ({
    date: `Analysis ${index + 1}`,
    score: item.quality_score || 0
  }));

  const issuesData = analysisData ? [
    { category: 'Critical', count: analysisData.summary?.critical || 0 },
    { category: 'High', count: analysisData.summary?.high || 0 },
    { category: 'Medium', count: analysisData.summary?.medium || 0 },
  ] : [];

  const pieData = analysisData ? [
    { name: 'Critical', value: analysisData.summary?.critical || 0, color: '#EF4444' },
    { name: 'High', value: analysisData.summary?.high || 0, color: '#F59E0B' },
    { name: 'Medium', value: analysisData.summary?.medium || 0, color: '#3B82F6' },
  ].filter(item => item.value > 0) : [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl md:text-4xl text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Monitor your code quality and analysis results</p>
          {analysisData && (
            <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <span className="text-gray-400">Latest Analysis Language:</span>
            <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium">
            {analysisData.language || 'Python'}
            </span>
            </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Issues */}
          <div className="glass-card p-6 rounded-xl stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl text-white mb-1">{totalIssues || '—'}</h3>
            <p className="text-gray-400 text-sm">Issues Found</p>
            {!analysisData && (
              <div className="mt-3 text-sm text-gray-500">
                Run an analysis to view
              </div>
            )}
          </div>

          {/* Code Quality Score */}
          <div className="glass-card p-6 rounded-xl stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Latest</span>
            </div>
            <h3 className="text-3xl text-white mb-1">
              {qualityScore ? `${qualityScore}/100` : '—'}
            </h3>
            <p className="text-gray-400 text-sm">Quality Score</p>
            {!analysisData && (
              <div className="mt-3 text-sm text-gray-500">
                No analysis yet
              </div>
            )}
          </div>

          {/* Files Analyzed */}
          <div className="glass-card p-6 rounded-xl stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl text-white mb-1">{filesAnalyzed || '—'}</h3>
            <p className="text-gray-400 text-sm">Files Analyzed</p>
            {filesAnalyzed === 0 && (
              <div className="mt-3 text-sm text-gray-500">
                No files analyzed
              </div>
            )}
          </div>

          {/* Last Analysis */}
          <div className="glass-card p-6 rounded-xl stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Recent</span>
            </div>
            <h3 className="text-3xl text-white mb-1">
              {historyData.length > 0 ? 'Recent' : '—'}
            </h3>
            <p className="text-gray-400 text-sm">Last Analysis</p>
            {historyData.length > 0 ? (
              <div className="mt-3 text-sm text-gray-400">
                {historyData[historyData.length - 1].timestamp}
              </div>
            ) : (
              <div className="mt-3 text-sm text-gray-500">
                No analysis history
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {qualityTrendData.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quality Trend */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl text-white mb-4">Code Quality Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={qualityTrendData}>
                  <defs>
                    <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0E1325', 
                      border: '1px solid #3B82F6',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#qualityGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Issues by Category */}
            {issuesData.length > 0 && (
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl text-white mb-4">Issues by Severity</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={issuesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0E1325', 
                        border: '1px solid #3B82F6',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-12 rounded-xl text-center">
            <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No Data Yet</h3>
            <p className="text-gray-400">
              Charts will appear after you analyze your code
            </p>
          </div>
        )}

        {/* Issue Severity & Recent Analysis */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Issue Severity Distribution */}
          {pieData.length > 0 && (
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl text-white mb-4">Issue Severity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-400">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Analysis */}
          <div className={`glass-card p-6 rounded-xl ${pieData.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-white">Recent Analysis</h3>
              <Link to="/history" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {historyData.length > 0 ? (
              <div className="space-y-3">
                {historyData.slice(-4).reverse().map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#0B0F1A] rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Code className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white">Analysis</h4>
                        <p className="text-sm text-gray-400">{item.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Issues</p>
                        <p className="text-white">
                          {(item.summary?.critical || 0) + (item.summary?.high || 0) + (item.summary?.medium || 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Score</p>
                        <p className="text-green-400">{item.quality_score}/100</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Code className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No analysis history yet</p>
                <p className="text-sm text-gray-500 mt-1">Start analyzing code to see results here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/analyzer" className="glass-card p-6 rounded-xl stat-card group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
              Analyze Code
            </h3>
            <p className="text-gray-400 mb-4">Paste your code for instant analysis</p>
            <div className="flex items-center gap-2 text-blue-400">
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/bugs" className="glass-card p-6 rounded-xl stat-card group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <Bug className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
              View Bugs
            </h3>
            <p className="text-gray-400 mb-4">Check detected bugs and vulnerabilities</p>
            <div className="flex items-center gap-2 text-blue-400">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/ai-review" className="glass-card p-6 rounded-xl stat-card group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
              AI Review
            </h3>
            <p className="text-gray-400 mb-4">Get AI-powered code review insights</p>
            <div className="flex items-center gap-2 text-blue-400">
              <span>Get Review</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import { Bug, Shield, AlertTriangle, XCircle, Filter, Search, Eye, CheckCircle as CheckIcon, EyeOff } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

interface BugItem {
  id: number;
  title: string;
  severity: string;
  category: string;
  file: string;
  line: number;
  description: string;
  recommendation: string;
  status: 'active' | 'fixed' | 'ignored';
  type?: string;
  message?: string;
  suggestion?: string;
}

interface SeverityColors {
  bg: string;
  border: string;
  text: string;
  badge: string;
}

export default function BugDetection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [bugs, setBugs] = useState<BugItem[]>([]);
  const [selectedBug, setSelectedBug] = useState<BugItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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
      const data = JSON.parse(latestAnalysis);
      // Backend returns bugs array directly
      if (data.bugs && Array.isArray(data.bugs)) {
        const bugsWithStatus = data.bugs.map((bug: any, index: number) => ({
          id: index + 1,
          ...bug,
          status: 'active',
          title: bug.type || 'Issue',
          category: bug.category || 'Code Quality',
          severity: (bug.severity || 'medium').toLowerCase(),
          file: 'Analyzed Code',
          line: bug.line || 0,
          description: bug.message || 'No description available',
          recommendation: bug.suggestion || 'Review and fix this issue'
        }));
        setBugs(bugsWithStatus);
      }
    }
  }, []);

  const getSeverityColor = (severity: string): SeverityColors => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20' };
      case 'high':
        return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20' };
      case 'medium':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20' };
      case 'low':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20' };
      default:
        return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', badge: 'bg-gray-500/20' };
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <XCircle className="w-5 h-5" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bug className="w-5 h-5" />;
    }
  };

  const handleViewDetails = (bug: BugItem) => {
    setSelectedBug(bug);
    setShowDetails(true);
  };

  const handleMarkAsFixed = (bugId: number) => {
    setBugs((prevBugs: BugItem[]) => 
      prevBugs.map((bug: BugItem) => 
        bug.id === bugId ? { ...bug, status: 'fixed' as const } : bug
      )
    );
  };

  const handleIgnore = (bugId: number) => {
    setBugs((prevBugs: BugItem[]) => 
      prevBugs.map((bug: BugItem) => 
        bug.id === bugId ? { ...bug, status: 'ignored' as const } : bug
      )
    );
  };

  const filteredBugs = bugs.filter((bug: BugItem) => {
    const matchesSearch = bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bug.file.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || bug.severity === selectedSeverity;
    const isActive = bug.status === 'active';
    return matchesSearch && matchesSeverity && isActive;
  });

  const stats = {
    total: bugs.filter((b: BugItem) => b.status === 'active').length,
    critical: bugs.filter((b: BugItem) => b.severity === 'critical' && b.status === 'active').length,
    high: bugs.filter((b: BugItem) => b.severity === 'high' && b.status === 'active').length,
    medium: bugs.filter((b: BugItem) => b.severity === 'medium' && b.status === 'active').length,
    low: bugs.filter((b: BugItem) => b.severity === 'low' && b.status === 'active').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl text-white mb-2">Bug Detection</h1>
          <p className="text-gray-400">Review detected bugs and security vulnerabilities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card p-4 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Total Issues</p>
            <p className="text-2xl text-white">{stats.total || '—'}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Critical</p>
            <p className="text-2xl text-red-400">{stats.critical || '—'}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">High</p>
            <p className="text-2xl text-orange-400">{stats.high || '—'}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Medium</p>
            <p className="text-2xl text-yellow-400">{stats.medium || '—'}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Low</p>
            <p className="text-2xl text-blue-400">{stats.low || '—'}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bugs by title or file..."
                className="w-full bg-[#0B0F1A] border border-blue-500/30 rounded-lg pl-12 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-[#0B0F1A] border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bug List */}
        <div className="space-y-4">
          {filteredBugs.length === 0 ? (
            <div className="glass-card p-12 rounded-xl text-center">
              <Bug className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No bugs found</h3>
              <p className="text-gray-400">
                {bugs.length === 0 
                  ? 'Run an analysis to detect bugs in your code'
                  : 'Try adjusting your search or filter criteria'}
              </p>
            </div>
          ) : (
            filteredBugs.map((bug: BugItem) => {
              const colors = getSeverityColor(bug.severity);
              return (
                <div key={bug.id} className={`glass-card p-6 rounded-xl border ${colors.border}`}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 ${colors.text}`}>
                      {getSeverityIcon(bug.severity)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-xl text-white mb-2">{bug.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className={`px-3 py-1 ${colors.badge} ${colors.text} rounded-full uppercase text-xs`}>
                              {bug.severity}
                            </span>
                            <span className="text-gray-400">
                              {bug.category}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400">
                              {bug.file} {bug.line > 0 && `: Line ${bug.line}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-[#0B0F1A] rounded-lg p-4 mb-4">
                        <p className="text-gray-300 text-sm mb-3">
                          <span className="text-gray-500">Issue:</span> {bug.description}
                        </p>
                        <p className="text-gray-300 text-sm">
                          <span className="text-blue-400">Recommendation:</span> {bug.recommendation}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleViewDetails(bug)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleMarkAsFixed(bug.id)}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors flex items-center gap-2"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Mark as Fixed
                        </button>
                        <button 
                          onClick={() => handleIgnore(bug.id)}
                          className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg text-sm hover:bg-gray-500/30 transition-colors flex items-center gap-2"
                        >
                          <EyeOff className="w-4 h-4" />
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {bugs.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl text-white">Security Summary</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your code has {stats.critical + stats.high} high-priority issues that require immediate attention.
              {stats.critical + stats.high > 0 && ' Focus on resolving critical security vulnerabilities first to protect your application from potential threats.'}
            </p>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedBug && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowDetails(false)}>
            <div className="glass-card p-8 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl text-white">{selectedBug.title}</h2>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg text-blue-400 mb-2">Severity</h3>
                  <span className={`px-3 py-1 ${getSeverityColor(selectedBug.severity).badge} ${getSeverityColor(selectedBug.severity).text} rounded-full uppercase text-xs`}>
                    {selectedBug.severity}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg text-blue-400 mb-2">Location</h3>
                  <p className="text-gray-300">{selectedBug.file} {selectedBug.line > 0 && `(Line ${selectedBug.line})`}</p>
                </div>
                
                <div>
                  <h3 className="text-lg text-blue-400 mb-2">Description</h3>
                  <p className="text-gray-300">{selectedBug.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg text-blue-400 mb-2">Recommendation</h3>
                  <p className="text-gray-300">{selectedBug.recommendation}</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    handleMarkAsFixed(selectedBug.id);
                    setShowDetails(false);
                  }}
                  className="flex-1 gradient-button px-4 py-2 rounded-lg text-white"
                >
                  Mark as Fixed
                </button>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 glass-card text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

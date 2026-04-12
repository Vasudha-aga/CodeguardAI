import { useState , useEffect } from "react";
import { Code, Play, CheckCircle, AlertTriangle, XCircle, FileCode, Download } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import jsPDF from 'jspdf';

export default function CodeAnalyzer() {
  const [code, setCode] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    const currentUserData = localStorage.getItem('codeguard_current_user');
    if (!currentUserData) return;

    const currentUser = JSON.parse(currentUserData);
    const userAnalysisKey = `analysis_${currentUser.id}`;
    const lastAnalysis = localStorage.getItem(userAnalysisKey);

    if (lastAnalysis) {
      try {
        const data = JSON.parse(lastAnalysis);
        if (data.code) {
          setCode(data.code);
          setAnalysisResult(data);
          setAnalyzed(true);
        }
      } catch (error) {
        console.error('Error loading last analysis:', error);
      }
    }
  }, []);

const handleAnalyze = async () => {
    if (!code.trim()) {
      alert("Please enter code to analyze");
      return;
    }

    // Check if user is logged in
    const currentUserData = localStorage.getItem('codeguard_current_user');
    if (!currentUserData) {
      alert("Please sign in to analyze code");
      return;
    }

    const currentUser = JSON.parse(currentUserData);
    setAnalyzing(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code , language: selectedLanguage}),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Analysis failed");
        return;
      }

      setAnalysisResult(data);
      setAnalyzed(true);

      // Save for current user with user ID prefix
      const userAnalysisKey = `analysis_${currentUser.id}`;
      const analysisWithCode = { ...data, code: code };
      localStorage.setItem(userAnalysisKey, JSON.stringify(analysisWithCode));
      
      // Also save as latest for quick access
      localStorage.setItem("latestAnalysis", JSON.stringify(data));

      // Save to user-specific history
      const userHistoryKey = `history_${currentUser.id}`;
      const history = JSON.parse(localStorage.getItem(userHistoryKey) || "[]");

      history.push({
        id: `analysis_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        summary: data.summary,
        quality_score: data.quality_score,
        bugs: data.bugs,
        ai_review: data.ai_review,
        code: code, // SAVE CODE HERE
        language: selectedLanguage  
      });

      localStorage.setItem(userHistoryKey, JSON.stringify(history));
      
      // Update global history reference
      localStorage.setItem("analysisHistory", JSON.stringify(history));

    } catch (error) {
      alert("Backend not reachable. Is FastAPI running?");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExportPDF = () => {
    if (!analysisResult) {
      alert("No analysis results to export");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text("CodeGuard AI - Analysis Report", pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Quality Score
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Overall Quality Score", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // Green
    doc.text(`${analysisResult.quality_score}/100`, 20, yPos);
    yPos += 15;

    // Issue Summary
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Issue Summary", 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(239, 68, 68); // Red
    doc.text(`Critical: ${analysisResult.summary?.critical || 0}`, 25, yPos);
    yPos += 8;

    doc.setTextColor(251, 146, 60); // Orange
    doc.text(`High: ${analysisResult.summary?.high || 0}`, 25, yPos);
    yPos += 8;

    doc.setTextColor(234, 179, 8); // Yellow
    doc.text(`Medium: ${analysisResult.summary?.medium || 0}`, 25, yPos);
    yPos += 15;

    // Lines Analyzed
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Lines Analyzed: ${analysisResult.summary?.lines_analyzed || 0}`, 20, yPos);
    yPos += 15;

    // Detailed Findings
    if (analysisResult.findings && analysisResult.findings.length > 0) {
      doc.setFontSize(16);
      doc.text("Detailed Findings", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      analysisResult.findings.forEach((finding: any, index: number) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${finding.type || 'Issue'}`, 20, yPos);
        yPos += 6;

        doc.setTextColor(100, 100, 100);
        const lines = doc.splitTextToSize(finding.message || '', pageWidth - 40);
        lines.forEach((line: string) => {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 25, yPos);
          yPos += 5;
        });
        yPos += 5;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by CodeGuard AI - B.Tech Final Year Project", pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    doc.save(`CodeGuard_Analysis_${new Date().getTime()}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl text-white mb-2">Code Analyzer</h1>
          <p className="text-gray-400">Paste your code below for instant AI-powered analysis</p>
        </div>

        {/* Language Selector & Actions */}
        <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-gray-300">Language:</label>
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#0B0F1A] border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {analyzed && (
              <button 
                onClick={handleExportPDF}
                className="glass-card px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors flex items-center gap-2 neon-border"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            )}
            <button 
              onClick={handleAnalyze}
              disabled={!code || analyzing}
              className={`
                gradient-button px-6 py-2 rounded-lg text-white flex items-center gap-2
                ${(!code || analyzing) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Play className="w-4 h-4" />
              {analyzing ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-blue-400" />
                  Code Editor
                </h3>
                <span className="text-sm text-gray-400">
                  {code.split('\n').length} lines
                </span>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`# Paste your ${selectedLanguage} code here...\n\ndef example_function():\n    print("Hello, CodeGuard AI!")`}
                className="w-full h-96 bg-[#0B0F1A] border border-blue-500/20 rounded-lg p-4 text-gray-300 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            {analyzed && analysisResult && (
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl text-white mb-4">Analysis Results</h3>
                
                {/* Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Quality Score</span>
                    <span className="text-2xl text-green-400">
                      {analysisResult.quality_score}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#0B0F1A] rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-1000"
                      style={{ width: `${analysisResult.quality_score || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Issue Count */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#0B0F1A] rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-gray-300">Critical</span>
                    </div>
                    <span className="text-white">{analysisResult.summary?.critical || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#0B0F1A] rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-300">High</span>
                    </div>
                    <span className="text-white">{analysisResult.summary?.high || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#0B0F1A] rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Medium</span>
                    </div>
                    <span className="text-white">{analysisResult.summary?.medium || 0}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-blue-500/20">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Lines Analyzed</span>
                    <span className="text-white">{analysisResult.summary?.lines_analyzed || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Analysis Time</span>
                    <span className="text-white">Real-time</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            {!analyzed && (
              <div className="glass-card p-6 rounded-xl">
                <Code className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl text-white mb-2">Ready to Analyze</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Paste your code in the editor and click "Analyze Code" to get started.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-gray-300">
                  <p className="mb-2">We'll check for:</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Security vulnerabilities</li>
                    <li>• Code quality issues</li>
                    <li>• Performance problems</li>
                    <li>• Best practice violations</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Code Templates */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg text-white mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setCode('def authenticate(username, password):\n    # TODO: Add authentication logic\n    return True')}
                  className="w-full text-left px-3 py-2 bg-[#0B0F1A] rounded-lg text-sm text-gray-300 hover:text-white hover:border-blue-500/50 border border-transparent transition-all"
                >
                  Authentication Example
                </button>
                <button 
                  onClick={() => setCode('import requests\n\nasync def fetch_data(url):\n    response = requests.get(url)\n    return response.json()')}
                  className="w-full text-left px-3 py-2 bg-[#0B0F1A] rounded-lg text-sm text-gray-300 hover:text-white hover:border-blue-500/50 border border-transparent transition-all"
                >
                  API Call Example
                </button>
                <button 
                  onClick={() => setCode('class DataProcessor:\n    def __init__(self, data):\n        self.data = data\n    \n    def process(self):\n        # Processing logic\n        pass')}
                  className="w-full text-left px-3 py-2 bg-[#0B0F1A] rounded-lg text-sm text-gray-300 hover:text-white hover:border-blue-500/50 border border-transparent transition-all"
                >
                  Class Example
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        {analyzed && analysisResult && analysisResult.findings && analysisResult.findings.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl text-white mb-4">Detailed Findings</h3>
            <div className="space-y-4">
              {analysisResult.findings.map((finding: any, index: number) => {
                const getSeverityColor = (severity: string) => {
                  if (severity === 'critical') return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20' };
                  if (severity === 'high') return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20' };
                  return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20' };
                };

                const colors = getSeverityColor(finding.severity || 'medium');

                return (
                  <div key={index} className={`p-4 ${colors.bg} border ${colors.border} rounded-lg`}>
                    <div className="flex items-start gap-3">
                      {finding.severity === 'critical' && <XCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />}
                      {finding.severity === 'high' && <AlertTriangle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />}
                      {finding.severity === 'medium' && <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white">{finding.type || 'Issue'}</h4>
                          <span className={`px-2 py-1 ${colors.badge} ${colors.text} text-xs rounded uppercase`}>
                            {finding.severity || 'MEDIUM'}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">
                          {finding.message}
                        </p>
                        {finding.line && (
                          <p className="text-gray-400 text-xs">Line {finding.line}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {analyzed && (!analysisResult.findings || analysisResult.findings.length === 0) && (
          <div className="glass-card p-6 rounded-xl text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-xl text-white mb-2">Great Job!</h3>
            <p className="text-gray-400">No critical issues found in your code.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

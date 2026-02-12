import React, { useState, useRef } from 'react';
import { Upload, FileText, Briefcase, Brain, Download, Star, CheckCircle, XCircle, AlertCircle, Trash2, User, ChevronRight, Sparkles, TrendingUp, MessageSquare } from 'lucide-react';

const ResumeScreeningSystem = () => {
  const [activeTab, setActiveTab] = useState('screening');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const fileInputRef = useRef(null);

  // Mock NLP processing function
  // Real-time API processing function
  const processResume = async (file, jobDesc) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDesc);

      const response = await fetch('http://localhost:5015/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const analysisResult = await response.json();

      // Add default empty comments if not present
      analysisResult.recruiterComments = '';

      setIsProcessing(false);
      return analysisResult;

    } catch (error) {
      console.error("Error processing resume:", error);
      setIsProcessing(false);
      alert(`Error analyzing ${file.name}: ${error.message}`);
      return null;
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleScreening = async () => {
    if (!jobDescription.trim() || uploadedFiles.length === 0) {
      alert('Please provide job description and upload at least one resume');
      return;
    }

    const newResults = [];
    for (const file of uploadedFiles) {
      const result = await processResume(file, jobDescription);
      if (result) {
        newResults.push(result);
      }
    }

    setResults(newResults);
    setHistory(prev => [...prev, ...newResults]);
    setActiveTab('results');
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 70) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  const getClassificationIcon = (classification) => {
    if (classification === 'Highly Suitable') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (classification === 'Moderate') return <AlertCircle className="w-5 h-5 text-amber-500" />;
    return <XCircle className="w-5 h-5 text-rose-500" />;
  };

  const exportToPDF = (result) => {
    // Mock PDF export logic
    const reportContent = `Report for ${result.fileName}`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${result.fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-pink-500/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  AutoScreen.ai
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Intelligent Recruitment</p>
              </div>
            </div>

            <div className="flex bg-slate-100/50 p-1 rounded-xl backdrop-blur-sm border border-slate-200/50">
              {['screening', 'results', 'dashboard'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-md shadow-slate-200/50 scale-100'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {tab === 'screening' && <Upload className="w-4 h-4" />}
                  {tab === 'results' && <FileText className="w-4 h-4" />}
                  {tab === 'dashboard' && <TrendingUp className="w-4 h-4" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Screening View */}
        {activeTab === 'screening' && (
          <div className="space-y-10 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Find the Perfect Candidate <span className="text-indigo-600">Instantly</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Upload resumes and let our advanced AI analyze compatibility, extract key insights, and rank candidates based on your specific job requirements.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Job Description Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-card rounded-2xl p-1">
                  <div className="bg-white/50 rounded-xl p-6 border border-white/40">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Job Description</h3>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                        Required
                      </span>
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste your job description here (e.g., 'Senior React Developer with 5+ years of experience in Node.js...')"
                      className="w-full h-80 p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all text-slate-700 placeholder:text-slate-400 leading-relaxed"
                    />
                    <div className="mt-4 flex items-center justify-end">
                      <span className={`text-sm font-medium transition-colors ${jobDescription.trim() ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {jobDescription.length} characters
                      </span>
                      {jobDescription.trim() && <CheckCircle className="w-4 h-4 text-emerald-500 ml-2" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 bg-slate-50/30 hover:bg-indigo-50/30"
                  >
                    <div className="w-20 h-20 bg-white rounded-full shadow-xl shadow-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Resumes</h3>
                    <p className="text-slate-500 mb-6">Drag & drop files or click to browse</p>
                    <button className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors">
                      Select Files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="glass-card rounded-2xl p-6">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Ready to Process ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-12 pb-12">
              <button
                onClick={handleScreening}
                disabled={isProcessing || !jobDescription.trim() || uploadedFiles.length === 0}
                className="btn-primary px-10 py-5 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center gap-3 group"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                    <span>Start AI Analysis</span>
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results View */}
        {activeTab === 'results' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Analysis Results</h2>
                <p className="text-slate-500 mt-1">Found {results.length} matches based on your criteria</p>
              </div>
              <button onClick={() => setActiveTab('screening')} className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-2">
                New Search <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-6">
              {results.map((result) => (
                <div key={result.id} className="glass-card rounded-2xl p-1 hover:border-indigo-200 transition-colors group">
                  <div className="bg-white/60 p-6 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                      {/* Left: Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm">
                              {result.matchScore}%
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-800">{result.fileName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getClassificationIcon(result.classification)}
                                <span className="text-sm font-medium text-slate-600">{result.classification}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveNoteId(activeNoteId === result.id ? null : result.id)}
                            className={`mr-2 transition-colors ${activeNoteId === result.id ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                            title="Recruiter Notes"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setActiveNoteId(activeNoteId === result.id ? null : result.id)}
                            className={`mr-2 transition-colors ${activeNoteId === result.id ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                            title="Recruiter Notes"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          <button onClick={() => exportToPDF(result)} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Export PDF">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>

                        <p className="text-slate-600 leading-relaxed mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                          {result.summary}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {result.keywordMatches.map((k, i) => (
                            <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${k.found
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                              }`}>
                              {k.found ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {k.keyword}
                            </span>
                          ))}
                        </div>

                        {result.interviewQuestions && (
                          <div className="mt-8 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                              <Brain className="w-5 h-5 text-indigo-600" />
                              AI Interview Questions
                            </h3>

                            <div className="grid gap-4">
                              {/* Level 1 */}
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                  Level 1: Basic
                                </h4>
                                <ul className="space-y-2">
                                  {result.interviewQuestions.level1?.map((q, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start">
                                      <span className="mr-2">•</span>
                                      {q}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Level 2 */}
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                  Level 2: Intermediate
                                </h4>
                                <ul className="space-y-2">
                                  {result.interviewQuestions.level2?.map((q, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start">
                                      <span className="mr-2">•</span>
                                      {q}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Level 3 */}
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                                  Level 3: Advanced
                                </h4>
                                <ul className="space-y-2">
                                  {result.interviewQuestions.level3?.map((q, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start">
                                      <span className="mr-2">•</span>
                                      {q}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* DSA */}
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                                  DSA Challenges
                                </h4>
                                <div className="space-y-3">
                                  {result.interviewQuestions.dsa?.map((q, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${q.difficulty?.includes('Easy') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {q.difficulty}
                                      </span>
                                      <p className="mt-2 text-sm text-slate-700 font-medium leading-relaxed">{q.question}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Comments (Hidden by default, toggled by icon) */}
                      {activeNoteId === result.id && (
                        <div className="mt-6 animate-fade-in-up">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Recruiter Notes
                          </label>
                          <textarea
                            value={result.recruiterComments}
                            onChange={(e) => {
                              const updatedResults = results.map(r => r.id === result.id ? { ...r, recruiterComments: e.target.value } : r);
                              setResults(updatedResults);
                            }}
                            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-inner"
                            placeholder="Add private notes about this candidate..."
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in-up space-y-8">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Total Candidates', value: history.length, icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Highly Suitable', value: history.filter(h => h.classification === 'Highly Suitable').length, icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Moderate Fit', value: history.filter(h => h.classification === 'Moderate').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Low Fit', value: history.filter(h => h.classification === 'Low Suitability').length, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Candidate</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Score</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700">{item.fileName}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(item.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getScoreColor(item.matchScore)}`}>
                            {item.matchScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            {getClassificationIcon(item.classification)}
                            {item.classification}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {history.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    No history available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ResumeScreeningSystem;

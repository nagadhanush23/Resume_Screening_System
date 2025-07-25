import React, { useState, useRef } from 'react';
import { Upload, FileText, Briefcase, Brain, Download, Star, CheckCircle, XCircle, AlertCircle, Search, Filter, Trash2, Eye, Calendar, User } from 'lucide-react';

// CSS styles object to replace Tailwind classes
const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)' },
  header: { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' },
  headerContent: { maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', paddingBottom: '1rem' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logoIcon: { background: 'linear-gradient(45deg, #2563eb, #7c3aed)', padding: '0.5rem', borderRadius: '0.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 },
  subtitle: { fontSize: '0.875rem', color: '#6b7280', margin: 0 },
  nav: { display: 'flex', gap: '0.5rem' },
  navButton: { padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', transition: 'all 0.2s', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  navButtonActive: { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  navButtonInactive: { color: '#6b7280', backgroundColor: 'transparent' },
  main: { maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' },
  card: { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', padding: '1.5rem' },
  button: { backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  textarea: { width: '100%', height: '16rem', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', resize: 'none', fontFamily: 'inherit' },
  uploadArea: { border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', backgroundColor: '#f9fafb', cursor: 'pointer', transition: 'all 0.2s' },
  grid: { display: 'grid', gap: '1.5rem' },
  gridCols2: { gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' },
  gridCols3: { gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' },
  scoreHigh: { backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '1.5rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' },
  scoreMedium: { backgroundColor: '#fef3c7', color: '#92400e', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '1.5rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' },
  scoreLow: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '1.5rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }
};



const ResumeScreeningSystem = () => {
  const [activeTab, setActiveTab] = useState('screening');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  // Mock NLP processing function (in real app, this would call your backend API)
  const processResume = async (file, jobDesc) => {
    setIsProcessing(true);
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted text and analysis
    const mockAnalysis = {
      id: Date.now() + Math.random(),
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      extractedText: "John Doe - Software Engineer with 5 years experience in React, Node.js, Python, and machine learning. Previously worked at Tech Corp as Senior Developer. Skills include: JavaScript, Python, React, Node.js, Docker, AWS, Machine Learning, TensorFlow, MongoDB, PostgreSQL. Education: BS Computer Science from Tech University.",
      summary: "Experienced Software Engineer with strong background in full-stack development and emerging ML skills. Proficient in modern web technologies and cloud platforms.",
      matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
      classification: Math.random() > 0.3 ? 'Highly Suitable' : Math.random() > 0.6 ? 'Moderate' : 'Low Suitability',
      keywordMatches: [
        { keyword: 'React', found: true, importance: 'high' },
        { keyword: 'Python', found: true, importance: 'high' },
        { keyword: 'Machine Learning', found: true, importance: 'medium' },
        { keyword: 'AWS', found: true, importance: 'medium' },
        { keyword: 'Docker', found: true, importance: 'low' },
        { keyword: 'Kubernetes', found: false, importance: 'medium' }
      ],
      recruiterComments: ''
    };

    const matchScore = mockAnalysis.matchScore;
    mockAnalysis.classification = matchScore >= 80 ? 'Highly Suitable' : matchScore >= 60 ? 'Moderate' : 'Low Suitability';
    
    setIsProcessing(false);
    return mockAnalysis;
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
      newResults.push(result);
    }

    setResults(newResults);
    setHistory(prev => [...prev, ...newResults]);
    setActiveTab('results');
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getClassificationIcon = (classification) => {
    if (classification === 'Highly Suitable') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (classification === 'Moderate') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const exportToPDF = (result) => {
    // Mock PDF export
    const reportContent = `
Resume Screening Report
======================
File: ${result.fileName}
Date: ${new Date(result.uploadDate).toLocaleDateString()}
Match Score: ${result.matchScore}%
Classification: ${result.classification}

Summary: ${result.summary}

Keyword Analysis:
${result.keywordMatches.map(k => `- ${k.keyword}: ${k.found ? '✓' : '✗'} (${k.importance} importance)`).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screening_report_${result.fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Resume Screener</h1>
                <p className="text-sm text-gray-600">Intelligent Resume Analysis & Matching</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('screening')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'screening' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Screen Resumes
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'results' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Results
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Screening Tab */}
        {activeTab === 'screening' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Screen Resumes with AI</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload resumes and provide a job description. Our AI will analyze compatibility, 
                extract key information, and provide detailed matching scores.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Job Description</h3>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here. Include required skills, experience, and qualifications..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {jobDescription.length} characters
                  </span>
                  {jobDescription.trim() && (
                    <span className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Job description ready
                    </span>
                  )}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Upload Resumes</h3>
                </div>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload resumes</p>
                  <p className="text-sm text-gray-500">Supports PDF and DOCX files</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Process Button */}
            <div className="text-center">
              <button
                onClick={handleScreening}
                disabled={isProcessing || !jobDescription.trim() || uploadedFiles.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin inline-block w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing Resumes...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 inline mr-3" />
                    Analyze Resumes with AI
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Screening Results</h2>
              <p className="text-gray-600">AI-powered analysis results for uploaded resumes</p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No results yet. Upload resumes and run analysis first.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {results.map((result) => (
                  <div key={result.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <FileText className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{result.fileName}</h3>
                          <p className="text-sm text-gray-500">
                            Analyzed on {new Date(result.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => exportToPDF(result)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Score & Classification */}
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getScoreColor(result.matchScore)}`}>
                            {result.matchScore}%
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Match Score</p>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          {getClassificationIcon(result.classification)}
                          <span className="font-medium text-gray-900">{result.classification}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-2">AI Summary</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
                      </div>
                    </div>

                    {/* Keywords Analysis */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Keyword Analysis</h4>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {result.keywordMatches.map((keyword, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              keyword.found ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            <span className="font-medium text-gray-900">{keyword.keyword}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                keyword.importance === 'high' ? 'bg-red-100 text-red-800' :
                                keyword.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {keyword.importance}
                              </span>
                              {keyword.found ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recruiter Comments */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Recruiter Comments</h4>
                      <textarea
                        value={result.recruiterComments}
                        onChange={(e) => {
                          const updatedResults = results.map(r => 
                            r.id === result.id ? { ...r, recruiterComments: e.target.value } : r
                          );
                          setResults(updatedResults);
                        }}
                        placeholder="Add your comments about this candidate..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recruiter Dashboard</h2>
              <p className="text-gray-600">Overview of all screening activities and history</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{history.length}</div>
                <div className="text-sm text-gray-600">Total Resumes</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.classification === 'Highly Suitable').length}
                </div>
                <div className="text-sm text-gray-600">Highly Suitable</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.classification === 'Moderate').length}
                </div>
                <div className="text-sm text-gray-600">Moderate</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.classification === 'Low Suitability').length}
                </div>
                <div className="text-sm text-gray-600">Low Suitability</div>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Screening History</h3>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No screening history yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resume
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Classification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-gray-400 mr-3" />
                              <span className="text-sm font-medium text-gray-900">{item.fileName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.matchScore)}`}>
                              {item.matchScore}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getClassificationIcon(item.classification)}
                              <span className="ml-2 text-sm text-gray-900">{item.classification}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => exportToPDF(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeScreeningSystem;
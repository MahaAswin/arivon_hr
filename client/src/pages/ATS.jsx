import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  Activity, 
  Star, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Building2, 
  Cpu,
  Layers,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const ATS = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('atsResult');
      if (saved) {
        setResult(JSON.parse(saved));
      }
    } catch (err) {
      console.warn("Could not parse saved ATS result", err);
    }
  }, []);

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setError(null);
    localStorage.removeItem('atsResult');
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      try {
        localStorage.setItem('atsResult', JSON.stringify(response.data));
      } catch (err) {
        console.warn("Failed to save ATS result", err);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while analyzing the resume.');
    } finally {
      setLoading(false);
    }
  };

  const getStrokeColor = (grade) => {
    if (grade === "A") return "stroke-success";
    if (grade === "B") return "stroke-warning";
    return "stroke-error";
  };

  const getTextColor = (grade) => {
    if (grade === "A") return "text-success";
    if (grade === "B") return "text-warning";
    return "text-error";
  };

  const getBarColor = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-error";
  };

  const renderCategory = (title, key, icon) => {
    if (!result?.categoryScores || result.categoryScores[key] === undefined) return null;
    const score = result.categoryScores[key];
    const skills = result.categorizedSkills[key] || [];
    let level = "Weak";
    if (score >= 70) level = "Strong";
    else if (score >= 40) level = "Medium";

    return (
      <div className="glass-card p-5 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-white font-bold">{title}</h4>
          </div>
          <span className={`text-sm font-bold ${getTextColor(score >= 70 ? 'A' : score >= 40 ? 'B' : 'C')}`}>
            {level} ({score}%)
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${getBarColor(score)}`}
          />
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.length > 0 ? skills.map(skill => (
            <span key={skill} className="px-2 py-1 bg-white/5 text-secondary border border-white/10 rounded text-xs">
              {skill}
            </span>
          )) : (
            <span className="text-xs text-white/30">No skills mapped</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-1">SkillCheck Technology</p>
              <h1 className="text-4xl font-black tracking-tighter text-white">Full-Stack Match Engine</h1>
            </div>
          </div>
          <p className="text-secondary text-lg mt-2 max-w-2xl">
            Evaluate your technical stack against real market role requirements to reveal deep progression insights.
          </p>
        </div>
        
        {result && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2 border border-white/10 whitespace-nowrap"
          >
            <UploadCloud className="w-5 h-5 text-primary" />
            Upload New Resume
          </motion.button>
        )}
      </div>

      {!result && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <div className="glass-card p-10 border border-white/5 relative overflow-hidden group text-center mt-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <Target className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-bold text-white mb-2">Upload Resume Payload</h2>
            <p className="text-secondary mb-8">PDF format max 5MB. Powered by our multi-domain SkillCheck heuristic.</p>

            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer relative">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className={`w-12 h-12 mx-auto mb-4 ${file ? 'text-primary' : 'text-secondary'}`} />
              <p className="text-white font-bold mb-1">
                {file ? file.name : "Click or drag your PDF here"}
              </p>
            </div>

            {error && (
               <div className="mt-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-left">
                 <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                 <p className="text-sm text-error">{error}</p>
               </div>
            )}

            <button 
              onClick={handleAnalyze} 
              disabled={!file}
              className={`w-full mt-8 py-4 rounded-xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 ${!file ? 'bg-white/5 text-secondary cursor-not-allowed border border-white/10' : 'bg-primary text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-1'}`}
            >
              Analyze Architecture
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="py-24 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-primary/20 rounded-full" />
            <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
            <Cpu className="w-10 h-10 text-primary absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Engaging Core Architectures...</h3>
            <p className="text-secondary text-lg">Cross-referencing roles and categorizing technical domains</p>
          </div>
        </div>
      )}

      {result && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Main Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ATS Score Card */}
            <div className="lg:col-span-1 glass-card p-8 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              
              <h2 className="text-white font-bold mb-6 text-lg tracking-wide uppercase text-white/50 w-full text-left">Master Rating</h2>

              <div className="relative mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" className="stroke-white/5" strokeWidth="16" fill="none" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 502 }}
                    animate={{ strokeDashoffset: 502 - (502 * result.score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="96" cy="96" r="80" 
                    className={getStrokeColor(result.grade)} 
                    strokeWidth="16" 
                    fill="none" 
                    strokeDasharray="502" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/20 rounded-full blur-0 m-2">
                  <span className={`text-6xl font-black ${getTextColor(result.grade)} tracking-tighter`}>{result.score}%</span>
                </div>
              </div>

              <span className={`px-4 py-1.5 rounded-full text-sm font-black border uppercase tracking-widest ${
                result.grade === "A" ? 'bg-success/10 text-success border-success/20' : 
                result.grade === "B" ? 'bg-warning/10 text-warning border-warning/20' : 
                'bg-error/10 text-error border-error/20'
              }`}>
                Grade {result.grade} • {result.label}
              </span>

              <div className="w-full mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Keywords Hit</p>
                  <p className="text-2xl font-black text-white">{result.matchedCount}</p>
                </div>
                <div>
                  <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Keywords Missed</p>
                  <p className="text-2xl font-black text-white">{result.missingCount}</p>
                </div>
              </div>
            </div>

            {/* Role Match Rankings */}
            <div className="lg:col-span-2 glass-card p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-6 h-6 text-warning" />
                <h2 className="text-xl font-bold text-white">Target Role Trajectory</h2>
              </div>

              <div className="space-y-5">
                {result.roleMatches.slice(0, 5).map((role, idx) => (
                  <div key={role.role} className="group relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${idx === 0 ? 'text-primary' : 'text-white'}`}>
                          {role.role}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black uppercase rounded border border-primary/20">Top Match</span>
                        )}
                      </div>
                      <span className={`text-sm font-bold ${getBarColor(role.score).replace('bg-', 'text-')}`}>
                        {role.score}% Match
                      </span>
                    </div>
                    
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${role.score}%` }}
                        transition={{ duration: 1.2, delay: idx * 0.1 }}
                        className={`h-full ${getBarColor(role.score)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domain Specific Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest text-white/50 px-2 mt-4">Hardware & Software Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {renderCategory("Frontend Stack", "frontend", <Layers className="w-5 h-5 text-blue-400" />)}
              {renderCategory("Backend Systems", "backend", <Cpu className="w-5 h-5 text-emerald-400" />)}
              {renderCategory("Database", "database", <Target className="w-5 h-5 text-purple-400" />)}
              {renderCategory("DevOps & Cloud", "devops", <UploadCloud className="w-5 h-5 text-orange-400" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Skills Warning */}
            <div className="glass-card p-8 border border-white/5 border-l-4 border-l-error">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                 <XCircle className="w-6 h-6 text-error" />
                 Critical Scope Gaps for {result.topRole}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {result.missingSkills.length > 0 ? result.missingSkills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-error/10 text-error border border-error/20 rounded-xl text-sm font-bold shadow-sm shadow-error/10">
                    {skill}
                  </span>
                )) : (
                  <p className="text-secondary p-4 bg-white/5 rounded-xl">Your skill density is sufficient. No major gaps strictly detected.</p>
                )}
              </div>
            </div>

            {/* AI Action Plan */}
            <div className="glass-card p-8 border border-white/5 border-l-4 border-l-primary relative overflow-hidden">
               <div className="absolute -right-6 -bottom-6 opacity-5">
                 <Zap className="w-48 h-48 text-primary" />
               </div>
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                 <Zap className="w-6 h-6 text-primary" />
                 AI Strategic Actions
               </h3>
               <ul className="space-y-4 relative z-10">
                 {result.suggestions.map((s, idx) => (
                   <li key={idx} className="flex items-start gap-4">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-black shrink-0 mt-0.5">
                       {idx + 1}
                     </span>
                     <span className="text-secondary leading-relaxed">{s}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {/* Job Market Insights (Static) */}
          <div className="glass-card p-8 border border-white/5 bg-gradient-to-br from-card to-card/50">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
               <div>
                 <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                   <TrendingUp className="w-6 h-6 text-success" />
                   Market Intel
                 </h2>
                 <p className="text-secondary">Pulsing live demand mapping for specifically <span className="text-white font-bold">{result.topRole}</span> capabilities.</p>
               </div>
               <span className="px-4 py-2 rounded-xl bg-success/10 text-success border border-success/20 font-black text-sm whitespace-nowrap">
                  ELEVATED HIRING VOLUME
               </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-4 text-white/50">
                    <Briefcase className="w-5 h-5" />
                    <h4 className="font-bold uppercase tracking-wider text-xs">Active Roles</h4>
                  </div>
                  <p className="text-4xl font-black text-white">1,049<span className="text-success text-sm ml-2">↑ 12%</span></p>
                </div>
                
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-4 text-white/50">
                    <Building2 className="w-5 h-5" />
                    <h4 className="font-bold uppercase tracking-wider text-xs">Top Requisitioners</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["TCS", "Infosys", "Wipro", "Cognizant"].map(co => (
                      <span key={co} className="px-3 py-1 bg-white/5 text-white border border-white/10 rounded-lg text-xs font-bold">{co}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-4 text-white/50">
                    <MapPin className="w-5 h-5" />
                    <h4 className="font-bold uppercase tracking-wider text-xs">Hot Zones</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Bangalore", "Hyderabad", "Pune"].map(loc => (
                      <span key={loc} className="px-3 py-1 bg-white/5 text-white border border-white/10 rounded-lg text-xs font-bold">{loc}</span>
                    ))}
                  </div>
                </div>
             </div>
          </div>
          
        </motion.div>
      )}
    </div>
  );
};

export default ATS;

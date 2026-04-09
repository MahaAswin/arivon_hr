import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Search,
  Building2,
  Calendar,
  Zap,
  Target,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JOBS_DATABASE } from '../data/jobs';
import api from '../api/axios';

const roleKeywords = {
  "MERN Developer": ["mern", "mongodb", "express", "react", "node"],
  "Frontend Developer": ["frontend", "react", "javascript", "vue", "next.js", "ui"],
  "Backend Developer": ["backend", "node", "express", "postgresql", "api"],
  "Full Stack Developer": ["full", "react", "node", "mongodb", "postgresql", "java"],
  "Python Developer": ["python", "django", "fastapi"],
  "Data Analyst": ["data", "machine learning", "python", "pandas", "sql"],
  "DevOps Engineer": ["devops", "docker", "kubernetes", "aws", "ci/cd", "linux"],
  "Java Backend Developer": ["java", "spring", "mysql", "backend"],
  "Cloud Engineer": ["cloud", "aws", "docker", "kubernetes"],
  "Mobile Developer": ["mobile", "react", "ios", "android"],
  "Software Engineer": ["software", "engineering"],
  "Developer": [] 
};

const JobCard = ({ job, isPersonalized }) => {
  const date = job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "";
  
  return (
    <div className="glass-card p-6 border border-white/5 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/10 transition-all" />
      
      {isPersonalized && (
        <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[10px] uppercase font-black px-3 py-1 rounded-bl-xl border-b border-l border-primary/20">
          Smart Match
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-primary transition-colors">{job.title}</h3>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-white/50" />
              {job.company}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-white/50" />
              {job.location}
            </span>
            {date && (
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-white/50" />
                {date}
              </span>
            )}
          </div>
          
          <p className="text-sm text-white/70 leading-relaxed mb-6 line-clamp-2">
            {job.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-2">
          {job.extractedSkills?.slice(0, 5).map(skill => (
            <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 rounded-lg text-xs font-semibold">
              {skill}
            </span>
          ))}
          {job.extractedSkills?.length > 5 && (
            <span className="px-3 py-1 text-xs text-white/40 font-semibold self-center">
              +{job.extractedSkills.length - 5} more
            </span>
          )}
        </div>

        <a 
          href={job.redirect_url || job.applyUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-shrink-0 px-6 py-2 bg-white/10 hover:bg-primary hover:text-white hover:border-primary border border-white/10 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const BrowseJobs = () => {
  const [atsRole, setAtsRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAiFiltered, setIsAiFiltered] = useState(false);

  // Initial load: check ATS result and set role
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atsResult');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.topRole) {
          setAtsRole(parsed.topRole);
          setSearchQuery(parsed.topRole); // Prefill search with top role
        }
      }
    } catch (err) {
      console.warn("ATS Result Parse Error:", err);
    }
  }, []);

  // Effect to trigger initial search once ATS role is set
  useEffect(() => {
    handleSearch(searchQuery || atsRole || "Developer", locationQuery);
  }, [atsRole]);

  const handleSearch = async (role = searchQuery, location = locationQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/jobs/search?role=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`);
      if (res.data && res.data.length > 0) {
        setJobs(res.data);
        setIsAiFiltered(!!atsRole && role.toLowerCase() === atsRole.toLowerCase());
      } else {
        // Fallback to local data if no results from API
        applyFallback(role);
      }
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      // Fallback on error
      applyFallback(role);
      setError("We encountered an issue fetching live jobs. Showing some curated roles based on your search.");
    } finally {
      setLoading(false);
    }
  };

  const applyFallback = (role) => {
    const query = (role || "").toLowerCase();
    const fallback = JOBS_DATABASE.filter(job => 
      job.title.toLowerCase().includes(query) || 
      job.extractedSkills.some(s => s.toLowerCase().includes(query))
    );
    setJobs(fallback.length > 0 ? fallback : JOBS_DATABASE);
    setIsAiFiltered(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen relative">
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-1">Career Intelligence</p>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Live Market Feed</h1>
            </div>
          </div>
          <p className="text-secondary text-lg mt-2 max-w-2xl">
            {atsRole 
              ? `Your resume mapped to ${atsRole}. We've live-tuned this feed to your career trajectory.` 
              : "Explore real-time technical opportunities worldwide powered by Adzuna."}
          </p>
        </div>
      </div>

      {/* Search Bar Group */}
      <div className="glass-card p-6 border border-white/5 relative z-20 shadow-2xl shadow-background/50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative group">
            <Search className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Role (e.g. MERN Developer)"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-all font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="md:col-span-4 relative group">
            <MapPin className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location (e.g. Hyderabad)"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-all font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="md:col-span-3">
            <button 
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full h-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Roles →"}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Results Status */}
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-3">
             {isAiFiltered ? <Zap className="w-5 h-5 text-primary" /> : <Target className="w-5 h-5 text-secondary" />}
             {isAiFiltered ? "Personalized AI Matches" : "Live Opportunities"}
          </h2>
          <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            {jobs.length} Results
          </span>
        </div>

        {error && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-warning">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card p-6 h-48 border border-white/5 animate-pulse flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-6 bg-white/5 rounded w-1/3" />
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                  </div>
                  <div className="h-10 bg-white/5 rounded w-full" />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              {jobs.length > 0 ? jobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <JobCard job={job} isPersonalized={isAiFiltered} />
                </motion.div>
              )) : (
                <div className="py-24 text-center glass-card border border-white/5">
                  <Search className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white uppercase">Zero Hits Detected</h3>
                  <p className="text-secondary max-w-sm mx-auto mt-2">Adjust your role or location filters to find matching market requisitions.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrowseJobs;

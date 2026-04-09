import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Sparkles, 
  BrainCircuit, 
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import api from '../../api/axios';
import CandidateCard from '../../components/recruiter/CandidateCard';
import CandidateDetailsModal from '../../components/recruiter/CandidateDetailsModal';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ skills: '', minATS: '', jobId: '' });
  const [jobs, setJobs] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('recruiterToken');
      const res = await api.get('/recruiter/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Fetch jobs failed', err);
    }
  };

  const fetchCandidates = async (queryFilters = filters) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('recruiterToken');
      const { skills, minATS, jobId } = queryFilters;
      let url = `/recruiter/candidates?`;
      if (skills) url += `skills=${skills}&`;
      if (minATS) url += `minATSScore=${minATS}&`;
      if (jobId) url += `jobId=${jobId}&`;

      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (candidateId) => {
    try {
      const token = localStorage.getItem('recruiterToken');
      await api.post('/recruiter/shortlist', { candidateId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Candidate added to your shortlist cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to shortlist');
    }
  };
  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 relative min-h-screen">
      <div className="neural-glow top-20 left-0 opacity-10" />
      
      {/* Search Header Section */}
      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 flex items-center gap-4">
            Candidate <span className="text-primary underline decoration-primary/20 underline-offset-8 italic">Discovery</span>
          </h1>
          <p className="text-secondary font-medium">Search our neural network of elite candidates using AI-powered skill matching.</p>
        </div>

        <div className="glass-card p-4 rounded-[2.5rem] flex flex-col lg:flex-row gap-4 items-center border-primary/10 group">
          <div className="flex-grow flex items-center gap-4 px-6 w-full lg:w-auto">
            <Search className="text-primary w-6 h-6 group-focus-within:scale-110 transition-transform" />
            <input 
              type="text" 
              placeholder="Filter by skills (e.g. React, Node, Python)"
              className="bg-transparent border-none outline-none text-xl font-bold w-full placeholder:text-secondary/30"
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && fetchCandidates()}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto p-2">
            <select 
              className="bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm font-bold text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
              value={filters.jobId}
              onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
            >
              <option value="">Select Job for AI Match</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>

            <button 
              onClick={() => fetchCandidates()}
              className="glow-button px-10 py-4 flex items-center justify-center gap-3"
            >
              <BrainCircuit className="w-5 h-5" /> Launch AI Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-primary w-5 h-5" />
            <span className="text-sm font-black text-secondary uppercase tracking-[0.3em]">Found {candidates.length} Match Entities</span>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-white/5 border border-white/5 rounded-lg"><Filter className="w-4 h-4 text-secondary" /></div>
          </div>
        </div>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3].map(i => (
                <motion.div key={i} className="glass-card h-40 animate-pulse bg-white/[0.02]" />
              ))
            ) : candidates.length > 0 ? (
              candidates.map((candidate) => (
                <CandidateCard 
                  key={candidate._id} 
                  candidate={candidate} 
                  onShortlist={handleShortlist}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-32 glass-card border-dashed border-white/10"
              >
                <Search className="w-16 h-16 text-secondary/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-secondary tracking-tight">No entities match your criteria</h3>
                <p className="text-secondary/60 mt-2">Try adjusting your skill filters or select a different job profile.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CandidateDetailsModal 
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CandidateSearch;

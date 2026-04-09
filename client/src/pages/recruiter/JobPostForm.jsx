import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusSquare, 
  Tag, 
  MapPin, 
  DollarSign, 
  FileText, 
  Layers,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const JobPostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    location: '',
    salaryRange: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('recruiterToken');
      const skillArray = formData.requiredSkills.split(',').map(s => s.trim());
      
      await api.post('/recruiter/jobs', {
        ...formData,
        requiredSkills: skillArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Job posted successfully!');
      navigate('/recruiter/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Posting failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-10 relative min-h-screen">
      <div className="neural-glow bottom-0 right-0 opacity-10" />
      
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-xl"
        >
          <PlusSquare className="text-primary w-8 h-8" />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tighter">Deploy New <span className="text-primary italic">Vacancy</span></h1>
        <p className="text-secondary font-medium">Broadcast your recruitment requirements to our neural network of talent.</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="glass-card p-10 lg:p-14 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" /> Core Position Title
            </label>
            <div className="relative group">
              <Layers className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                required
                className="floating-label-input pl-14"
                placeholder="Senior Full Stack Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-primary" /> Operational Hub
            </label>
            <div className="relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                required
                className="floating-label-input pl-14"
                placeholder="Remote / New York, NY"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            <Tag className="w-3 h-3 text-primary" /> Skill Architecture (Comma Separated)
          </label>
          <div className="relative group">
            <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              required
              className="floating-label-input pl-14"
              placeholder="React, NodeJS, MongoDB, AWS"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            />
          </div>
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-primary" /> Compensantion Range
          </label>
          <div className="relative group">
            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              className="floating-label-input pl-14"
              placeholder="$120k - $180k / Annual"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            <FileText className="w-3 h-3 text-primary" /> Mission Description
          </label>
          <div className="relative group">
            <textarea
              required
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/20"
              placeholder="Outline the mission, technical stack, and core responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full glow-button py-5 text-lg flex items-center justify-center gap-4 group"
        >
          {loading ? 'UPLOADING TO NETWORK...' : (
            <>
              Deploy Position <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default JobPostForm;

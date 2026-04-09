import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  Linkedin, 
  MapPin, 
  Users, 
  Save, 
  CheckCircle,
  FileText,
  Camera
} from 'lucide-react';
import api from '../../api/axios';
import { useRecruiter } from '../../context/RecruiterContext';

const RecruiterProfilePage = () => {
  const { recruiterProfile, setRecruiterProfile } = useRecruiter();
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    location: '',
    industry: '',
    companySize: '',
    linkedin: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recruiterProfile) {
      setFormData({
        companyName: recruiterProfile.companyName || '',
        companyWebsite: recruiterProfile.companyWebsite || '',
        companyDescription: recruiterProfile.companyDescription || '',
        location: recruiterProfile.location || '',
        industry: recruiterProfile.industry || '',
        companySize: recruiterProfile.companySize || '',
        linkedin: recruiterProfile.linkedin || ''
      });
    }
  }, [recruiterProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('recruiterToken');
      const res = await api.put('/recruiter/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecruiterProfile(res.data);
      alert('Profile updated and distributed to the network.');
    } catch (err) {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12 relative min-h-screen">
      <div className="neural-glow top-0 right-0 opacity-10" />
      
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/10">
          <Building2 className="text-primary w-12 h-12" />
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tighter">Business <span className="text-primary italic">Identity</span></h1>
          <p className="text-secondary font-medium">Configure your organizational footprint on the Arivon network.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 glass-card p-10 space-y-8">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
              <FileText className="text-primary w-5 h-5" /> Organizational Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest ml-1">Company Entity Name</label>
                <input
                  type="text"
                  className="floating-label-input"
                  placeholder="Arivon Intelligence"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest ml-1">HQ Location</label>
                <input
                  type="text"
                  className="floating-label-input"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-secondary uppercase tracking-widest ml-1">Mission Brief (Description)</label>
              <textarea
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary/50 outline-none transition-all"
                placeholder="Tell candidates about your culture and mission..."
                value={formData.companyDescription}
                onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
              />
            </div>
          </div>

          {/* Social / Technical */}
          <div className="glass-card p-10 space-y-6">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
              <Globe className="text-primary w-4 h-4" /> Digital Presence
            </h3>
            <div className="space-y-4">
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-primary/50 outline-none"
                  placeholder="https://company.com"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                />
              </div>
              <div className="relative group">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-primary/50 outline-none"
                  placeholder="linkedin.com/company/arivon"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-10 space-y-6">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
              <Users className="text-primary w-4 h-4" /> Market Segments
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 outline-none"
                placeholder="Industry (e.g. AI, Fintech)"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 outline-none"
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              >
                <option value="">Select Workforce Size</option>
                <option value="1-10">1-10 Entities</option>
                <option value="11-50">11-50 Entities</option>
                <option value="51-200">51-200 Entities</option>
                <option value="200+">200+ Entities</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full glow-button py-5 text-lg flex items-center justify-center gap-4 group"
        >
          {loading ? 'SYNCHRONIZING...' : (
            <>
              Update Entity Records <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RecruiterProfilePage;

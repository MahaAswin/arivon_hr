import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  Search, 
  TrendingUp,
  ArrowRight,
  Zap,
  Sparkles,
  Building2
} from 'lucide-react';
import { useRecruiter } from '../../context/RecruiterContext';
import api from '../../api/axios';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`} />
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-primary/30 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-black text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-tighter">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-secondary text-sm font-black uppercase tracking-[0.2em] mb-1">{label}</h3>
    <p className="text-4xl font-black tracking-tight">{value}</p>
  </motion.div>
);

const RecruiterDashboard = () => {
  const { recruiterProfile } = useRecruiter();
  const [stats, setStats] = useState({
    totalCandidates: 0,
    shortlistedCandidates: 0,
    activeJobs: 0,
    recentCandidates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('recruiterToken');
        const res = await api.get('/recruiter/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-12 text-secondary animate-pulse font-black text-xl">INITIALIZING HQ...</div>;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 relative">
      <div className="neural-glow top-0 right-0 opacity-20" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black tracking-tighter mb-2"
          >
            Hiring <span className="text-primary italic">Intelligence</span>
          </motion.h1>
          <p className="text-secondary font-medium">Welcome, {recruiterProfile?.recruiterName || 'HR Lead'}. Your talent pipeline is optimized.</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/5"
        >
          <div className="text-right">
            <p className="text-xs font-black text-white uppercase tracking-widest">{recruiterProfile?.companyName || 'Arivon Enterprise'}</p>
            <p className="text-[10px] text-secondary font-bold">Verified Business Partner</p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <Building2 className="text-primary w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} label="Total Candidates" value={stats.totalCandidates} trend="+12%" color="from-primary to-transparent" />
        <StatCard icon={CheckCircle} label="Your Shortlist" value={stats.shortlistedCandidates} trend="+5" color="from-info to-transparent" />
        <StatCard icon={Briefcase} label="Active Openings" value={stats.activeJobs} color="from-success to-transparent" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Candidates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 glass-card p-10"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
              <h2 className="text-2xl font-black tracking-tight">Recent Discovery</h2>
            </div>
            <button className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all underline decoration-2 underline-offset-8 decoration-primary/30">
              View All Pipeline <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {stats.recentCandidates.map((candidate, idx) => (
              <motion.div 
                key={candidate._id}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
                className="flex items-center justify-between p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all bg-white/[0.01]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-primary border border-white/10 group-hover:border-primary/30">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white tracking-tight">{candidate.name}</h4>
                    <p className="text-xs text-secondary font-medium italic">{candidate.skills.slice(0, 3).join(' • ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">ATS AI</p>
                    <p className="text-lg font-black text-primary">{candidate.atsScore || 0}</p>
                  </div>
                  <button className="p-3 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl transition-all border border-white/10">
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions / AI Matching Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-gradient-to-br from-primary to-primary-dark p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="text-white/40 w-8 h-8 group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white mb-4 leading-tight">Post New<br/>Vacancy</h3>
            <p className="text-white/80 text-sm font-medium mb-8">Deploy our AI matching algorithm to find your perfect candidate in seconds.</p>
            <button className="w-full bg-white text-primary font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Initialize Posting
            </button>
          </div>

          <div className="glass-card p-10 border-primary/20">
            <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Global Filter
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-secondary text-sm">
                "Show me Node.js developers with ATS > 80"
              </div>
              <button className="w-full glow-button py-3 text-sm">
                Open Discovery Engine
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

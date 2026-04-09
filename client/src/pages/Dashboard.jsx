import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, CheckCircle2, TrendingUp, Sparkles, BookOpen, Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading || !profile) return <div className="p-20"><Loader text="Loading Profile..." /></div>;

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-6 flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-1">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Hero Welcome */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary mb-4"
          >
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Profile Overview</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
            Welcome back, <span className="text-primary">{profile?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-secondary max-w-xl text-lg leading-relaxed">
            Manage your professional profile, skills, and projects in one centralized dashboard.
          </p>
        </div>
        
        <div className="glass-card p-6 min-w-[300px] border-primary/20 bg-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="text-primary w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">Profile Progress</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary" style={{ width: profile?.isProfileComplete ? '100%' : '65%' }} />
          </div>
          <p className="text-[10px] text-secondary text-right font-bold">{profile?.isProfileComplete ? '100% Complete' : '65% Complete'}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Layers} label="Skills Added" value={profile.skills?.length || 0} color="bg-primary/20 text-primary" />
        <StatCard icon={CheckCircle2} label="Interests" value={profile.interests?.length || 0} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Briefcase} label="Projects" value={profile.projects?.hasProjects ? profile.projects.count : 0} color="bg-success/20 text-success" />
        <StatCard icon={BookOpen} label="Education" value={profile.level || profile.education || 'Pending'} color="bg-purple-500/20 text-purple-400" />
      </div>

      {/* Feature Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Snapshot */}
        <div className="glass-card p-8 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
          <div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4">Complete Profile Setup</h3>
            <p className="text-secondary text-sm leading-relaxed mb-8">
              Update your educational highlights, past experience, and projects. Share your comprehensive skill set.
            </p>
          </div>
          <Link to="/profile" className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold tracking-wide transition-all">
            Update Profile
          </Link>
        </div>

        {/* Skills Overview Preview */}
        <div className="glass-card p-8 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
          <div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4">Skills Overview</h3>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              Your registered capabilities forming your technical architecture.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {profile.skills?.slice(0, 5).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold">
                  {skill}
                </span>
              ))}
              {(profile.skills?.length > 5) && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-primary">
                  +{profile.skills.length - 5} more
                </span>
              )}
              {(!profile.skills || profile.skills.length === 0) && (
                <span className="text-xs text-secondary italic">No skills registered yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecruiter } from '../context/RecruiterContext'; // Import recruiter context
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, ArrowRight, Sparkles, Building2 } from 'lucide-react';

const AuthCard = ({ type }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState('candidate'); // 'candidate' or 'recruiter'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const { recruiterLogin, recruiterRegister } = useRecruiter();
  const navigate = useNavigate();

  const isLogin = type === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        if (role === 'candidate') {
          await login(formData.email, formData.password);
          navigate('/dashboard', { replace: true });
        } else {
          await recruiterLogin(formData.email, formData.password);
          navigate('/recruiter/dashboard', { replace: true });
        }
      } else {
        if (role === 'candidate') {
          await register(formData.name, formData.email, formData.password);
          navigate('/onboarding', { replace: true });
        } else {
          await recruiterRegister(formData.name, formData.email, formData.password);
          navigate('/recruiter/onboarding', { replace: true });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative pt-20 pb-12">
      <div className="neural-glow top-0 right-0 opacity-20" />
      <div className="neural-glow bottom-0 left-0 opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-lg p-10 md:p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-xl shadow-primary/5"
          >
            {isLogin ? <LogIn className="text-primary w-10 h-10" /> : <UserPlus className="text-primary w-10 h-10" />}
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight mb-2">{isLogin ? 'Welcome Back' : 'Join Arivon'}</h2>
          <p className="text-secondary font-medium">{isLogin ? 'Access your intelligence HQ' : 'Start your career evolution'}</p>
        </div>

        {/* Role Selector Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 relative border border-white/5">
          <motion.div
            animate={{ x: role === 'candidate' ? 0 : '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-primary/20 border border-primary/30 rounded-xl"
          />
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all relative z-10 ${role === 'candidate' ? 'text-primary' : 'text-secondary hover:text-white'}`}
          >
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all relative z-10 ${role === 'recruiter' ? 'text-primary' : 'text-secondary hover:text-white'}`}
          >
            Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-2xl flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-error" />
                </div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black text-secondary uppercase tracking-widest ml-1">{role === 'candidate' ? 'Full Name' : 'Company/HR Name'}</label>
              <div className="relative group">
                {role === 'candidate' ? (
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                ) : (
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                )}
                <input
                  type="text"
                  required
                  className="floating-label-input pl-14"
                  placeholder={role === 'candidate' ? "John Doe" : "Arivon Corp"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-secondary uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                required
                className="floating-label-input pl-14"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-secondary uppercase tracking-widest ml-1">Secret Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                className="floating-label-input pl-14"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-button w-full flex items-center justify-center gap-3 text-lg h-[64px]"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                {isLogin ? 'Access Console' : 'Initialize Account'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <p className="text-secondary font-medium">
            {isLogin ? "Don't have an intelligence HQ?" : "Already an elite member?"}
            <Link 
              to={isLogin ? "/register" : "/login"} 
              className="ml-2 text-primary hover:text-primary-light font-black underline underline-offset-8 decoration-primary/30 hover:decoration-primary transition-all"
            >
              {isLogin ? "Join Evolution" : "Access Console"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const Login = () => <AuthCard type="login" />;
export const Register = () => <AuthCard type="register" />;

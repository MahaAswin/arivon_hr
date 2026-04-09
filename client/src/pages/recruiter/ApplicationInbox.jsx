import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Check, 
  X, 
  ChevronRight, 
  ExternalLink, 
  Search,
  Zap,
  Clock,
  Briefcase,
  User as UserIcon
} from 'lucide-react';
import api from '../../api/axios';
import emailjs from '@emailjs/browser';

const ApplicationInbox = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recruiter/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Fetch applications failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (application, decision) => {
    setProcessingId(application._id);
    const status = decision === 'approve' ? 'accepted' : 'rejected';
    
    try {
      // 1. Update Backend
      await api.patch(`/recruiter/applications/${application._id}`, { status });

      // 2. Trigger Email via EmailJS
      const templateParams = {
        to_name: application.candidateId.name,
        to_email: application.candidateId.email,
        candidate_name: application.candidateId.name,
        job_title: application.jobId.title,
        message: decision === 'approve' 
          ? `We are pleased to inform you that you have been selected for a position at our company.\n\nWe believe your skills and profile are a great fit, and we are excited about the possibility of working with you.\n\nKindly confirm your acceptance by replying to this email.\n\nIf you have any questions, feel free to reach out.`
          : `Thank you for your interest in our company.\n\nAfter careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe appreciate your time and effort, and we wish you the very best in your future endeavors.`
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        decision === 'approve' 
          ? import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID 
          : import.meta.env.VITE_EMAILJS_REJECT_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 3. Update UI
      setApplications(prev => prev.filter(app => app._id !== application._id));
      alert(`Candidate ${decision === 'approve' ? 'Accepted' : 'Rejected'} and email dispatched!`);
    } catch (err) {
      console.error('Decision process failed', err);
      alert('Failed to process decision. Please check EmailJS configuration.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApps = applications.filter(app => app.status === filter);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 min-h-screen">
      <div className="neural-glow top-0 right-0 opacity-10" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 flex items-center gap-4">
            Talent <span className="text-primary italic underline decoration-primary/20 underline-offset-8">Inbox</span>
          </h1>
          <p className="text-secondary font-medium">Manage incoming applications and orchestrate selection workflows.</p>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {['pending', 'accepted', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-secondary hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="glass-card h-32 animate-pulse" />)
          ) : filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card group overflow-hidden"
              >
                <div className="p-8 flex flex-col md:flex-row items-start md:items-center gap-8">
                  {/* Candidate Initials */}
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-primary group-hover:border-primary/50 transition-all shrink-0">
                    {app.candidateId.name.charAt(0)}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{app.candidateId.name}</h3>
                      <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                        {app.candidateId.atsScore}% ATS
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-secondary text-sm font-medium">
                      <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {app.jobId.title}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <a 
                      href={app.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <ExternalLink className="w-4 h-4 text-secondary group-hover/btn:text-white" />
                      <span className="text-xs font-bold text-secondary group-hover/btn:text-white hidden lg:inline">Resume</span>
                    </a>

                    {app.status === 'pending' && (
                      <>
                        <button
                          disabled={processingId === app._id}
                          onClick={() => handleDecision(app, 'reject')}
                          className="p-3 bg-error/10 hover:bg-error text-error hover:text-white rounded-xl border border-error/20 hover:border-error transition-all disabled:opacity-50"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          disabled={processingId === app._id}
                          onClick={() => handleDecision(app, 'approve')}
                          className="p-3 bg-success/10 hover:bg-success text-success hover:text-white rounded-xl border border-success/20 hover:border-success transition-all disabled:opacity-50 shadow-lg shadow-success/5"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Job Request Message Section */}
                <div className="px-8 pb-8">
                  <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-6 relative">
                    <div className="absolute top-4 left-6 italic text-4xl text-primary/10 font-serif">"</div>
                    <p className="text-secondary/80 text-sm leading-relaxed whitespace-pre-wrap pl-4 italic">
                      {app.message || "No introductory message provided."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 glass-card border border-dashed border-white/10 space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                <Mail className="w-10 h-10 text-secondary/20" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">Inbox Synchronized</h3>
                <p className="text-secondary/60 mt-2">No {filter} applications currently detected in the neural buffer.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ApplicationInbox;

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  ExternalLink,
  Target,
  FileText,
  Download,
  BrainCircuit
} from 'lucide-react';

const CandidateDetailsModal = ({ candidate, isOpen, onClose }) => {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl shadow-primary/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-start justify-between relative">
              <div className="neural-glow top-0 left-0 opacity-10" />
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl border border-primary/20 flex items-center justify-center text-primary text-3xl font-black">
                  {candidate.name[0]}
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase">{candidate.name}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-secondary text-sm font-medium">
                      <Mail className="w-4 h-4" /> {candidate.email}
                    </span>
                    <span className="px-3 py-1 bg-success/10 text-success border border-success/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Verified Talent
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Stats & Experience */}
                <div className="lg:col-span-2 space-y-8">
                  {/* AI Match Info if exists */}
                  {candidate.matchScore !== undefined && (
                    <div className="glass-card p-6 border-primary/20 bg-primary/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl">
                          <BrainCircuit className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-secondary text-xs font-bold uppercase tracking-widest">AI Matching Intelligence</p>
                          <h4 className="text-xl font-black">{candidate.matchScore}% Match Accuracy</h4>
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin-slow flex items-center justify-center">
                         <span className="text-xs font-black animate-none">{candidate.matchScore}</span>
                      </div>
                    </div>
                  )}

                  {/* Academic Profile */}
                  <div className="glass-card p-8 space-y-6">
                    <h3 className="text-sm font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-2">
                       <GraduationCap className="w-4 h-4 text-primary" /> Academic Records
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Current Level</p>
                        <p className="font-bold text-white uppercase">{candidate.level || 'Not Specified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Branch</p>
                        <p className="font-bold text-white uppercase">{candidate.branch || 'Not Specified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Performance</p>
                        <p className="font-bold text-primary">{candidate.cgpa || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Experience */}
                  <div className="glass-card p-8 space-y-6">
                    <h3 className="text-sm font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-2">
                       <Briefcase className="w-4 h-4 text-primary" /> Key Project Assets
                    </h3>
                    {candidate.projects?.hasProjects ? (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                          {(candidate.projects.types || []).map((type, idx) => (
                            <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">
                              {type}
                            </span>
                          ))}
                        </div>
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
                           <span className="text-secondary text-xs font-medium">Verified Project Count:</span>
                           <span className="text-primary font-black">{candidate.projects.count || 0} Entities</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 opacity-40 italic text-sm">No specific projects declared in database.</div>
                    )}
                  </div>
                </div>

                {/* Right Column: Skills & Actions */}
                <div className="space-y-8">
                  {/* Skills Cloud */}
                  <div className="glass-card p-8 space-y-6 border-white/5">
                    <h3 className="text-sm font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-primary" /> Core Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(candidate.skills || []).map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="glass-card p-8 space-y-6 border-white/5">
                    <h3 className="text-sm font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-2">
                       <Target className="w-4 h-4 text-primary" /> Focal Points
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(candidate.interests || []).map(interest => (
                        <span key={interest} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-secondary uppercase italic">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resume Action */}
                  {candidate.resumeUrl ? (
                    <a 
                      href={`http://localhost:5000${candidate.resumeUrl.startsWith('http') ? '' : candidate.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white border border-white/20 text-white hover:text-black px-6 py-4 rounded-3xl font-black text-sm transition-all shadow-xl shadow-white/5 group"
                    >
                      <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                      Inspect Resume 
                      <ExternalLink className="w-4 h-4 opacity-50" />
                    </a>
                  ) : (
                    <div className="p-4 bg-error/10 text-error border border-error/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                      Resume not uploaded
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end">
               <button 
                 onClick={onClose}
                 className="px-8 py-3 text-secondary hover:text-white font-bold text-sm transition-colors"
               >
                 Dismiss Intelligence
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CandidateDetailsModal;

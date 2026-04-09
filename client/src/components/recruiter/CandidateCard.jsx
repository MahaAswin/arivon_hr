import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';

const CandidateCard = ({ candidate, onShortlist, onViewDetails }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card p-8 group relative overflow-hidden"
    >

      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center font-black text-3xl text-primary p-2 group-hover:border-primary/50 transition-colors">
            {candidate.name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-4 border-card flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>

        <div className="flex-grow space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{candidate.name}</h3>
            {candidate.atsScore >= 80 && (
              <span className="text-[10px] font-black bg-info/10 text-info border border-info/20 px-2 py-0.5 rounded-lg uppercase tracking-widest">Elite</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-secondary text-sm font-medium">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail className="w-4 h-4" /> {candidate.email}</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MapPin className="w-4 h-4" /> Available for Hire</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {candidate.skills.slice(0, 5).map(skill => (
              <span key={skill} className="px-3 py-1 bg-white/5 rounded-xl text-[11px] font-bold text-secondary border border-white/5 hover:border-primary/30 hover:text-primary transition-all cursor-default uppercase tracking-tight">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 5 && (
              <span className="px-3 py-1 bg-white/5 rounded-xl text-[11px] font-bold text-secondary border border-white/5">+{candidate.skills.length - 5} MORE</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <button 
            onClick={() => onViewDetails(candidate)}
            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 px-8 py-3 rounded-2xl font-black text-sm transition-all"
          >
            Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateCard;

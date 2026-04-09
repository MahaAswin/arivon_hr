import { motion } from 'framer-motion';
import { Rocket, Sparkles, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

const JobCard = ({ career, index }) => {
  const { role, match, reason, improvementTips, strengths, missingCoreSkills, missingSecondarySkills } = career;

  // Relative Ranking Labels (Positive Reinforcement)
  const isStrong = match >= 80;
  const isGood = match >= 65;

  const getStatusConfig = () => {
    if (isStrong) return { label: "STRONG MATCH", color: "text-success", bg: "bg-success/20", border: "border-success/20" };
    if (isGood) return { label: "GOOD MATCH", color: "text-warning", bg: "bg-warning/20", border: "border-warning/20" };
    return { label: "GROWTH MATCH", color: "text-primary", bg: "bg-primary/20", border: "border-primary/20" };
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card p-8 group transition-all duration-500 relative overflow-hidden h-full flex flex-col ${
        isStrong 
          ? 'border-primary/40 shadow-[0_0_40px_rgba(249,115,22,0.15)]' 
          : 'hover:border-primary/30'
      }`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isStrong ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/20 text-primary'
        }`}>
          <Rocket className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                {config.label}
            </span>
            <span className="text-[9px] font-black text-secondary/40 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Relative Match Verified
            </span>
        </div>
      </div>

      <h3 className="text-xl font-black mb-1 uppercase tracking-tighter">{role}</h3>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-grow h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${match}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full ${isStrong ? 'orange-gradient' : 'bg-primary/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]'}`}
          />
        </div>
        <span className="text-sm font-black text-white">{match}%</span>
      </div>

      <p className="text-sm text-secondary leading-relaxed mb-6 flex-grow font-medium italic opacity-80">
        "{reason}"
      </p>

      {/* Skills & Tips */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        
        {/* Core Strengths */}
        {strengths?.length > 0 && (
          <div className="space-y-3">
            <p className="text-[9px] font-black text-success uppercase tracking-[0.2em] flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> Core Strengths
            </p>
            <div className="flex flex-wrap gap-2">
              {strengths.slice(0, 3).map((skill) => (
                <span key={skill} className="text-[9px] bg-success/5 px-2.5 py-1 rounded-lg text-success border border-success/10 font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Growth Areas (Missing Skills) */}
        {(missingCoreSkills?.length > 0 || missingSecondarySkills?.length > 0) && (
          <div className="space-y-3">
            <p className="text-[9px] font-black text-secondary/40 uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" /> Key Improvement Areas
            </p>
            <div className="flex flex-wrap gap-2">
              {[...(missingCoreSkills || []), ...(missingSecondarySkills || [])].slice(0, 3).map((skill) => (
                <span key={skill} className="text-[9px] bg-white/5 px-2.5 py-1 rounded-lg text-secondary border border-white/5 font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Coach's Recommendation */}
        {improvementTips && (
           <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl group-hover:bg-primary/10 transition-colors">
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                 <Sparkles className="w-3 h-3" /> Strategic Insight
              </p>
              <p className="text-[11px] font-bold text-white italic leading-relaxed">
                 {improvementTips}
              </p>
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;

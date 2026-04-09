import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const SkillCard = ({ skill, type = "missing" }) => {
  const isMissing = type === "missing";
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
        isMissing 
          ? 'bg-error/5 border-error/20 text-error' 
          : 'bg-success/5 border-success/20 text-success'
      }`}
    >
      <div className="flex items-center gap-3">
        {isMissing ? (
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="font-bold text-sm tracking-tight">{skill}</span>
      </div>
      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
        isMissing ? 'bg-error/10' : 'bg-success/10'
      }`}>
        {isMissing ? 'Gap' : 'Mastered'}
      </div>
    </motion.div>
  );
};

export default SkillCard;

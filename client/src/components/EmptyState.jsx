import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const EmptyState = ({ icon: Icon = Sparkles, title, description, actionText, onAction }) => {
  return (
    <div className="glass-card p-20 text-center flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px] -z-10" />
      
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-secondary/30 mb-6 border border-white/5">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-black mb-2 text-white/50">{title}</h3>
      <p className="text-secondary/60 max-w-sm mb-10 text-sm leading-relaxed">
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="glow-button flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

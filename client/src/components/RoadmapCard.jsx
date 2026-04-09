import { motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';

const RoadmapCard = ({ week, topic, tasks, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-6 relative"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center text-primary z-10 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="w-0.5 flex-grow bg-white/5 my-2" />
      </div>

      <div className="flex-grow pb-12">
        <div className="glass-card p-8 group hover:border-primary/20 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/10">
              Week {week}
            </span>
            <h3 className="text-xl font-bold text-white">{topic}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-white/2 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group/task">
                <CheckCircle2 className="w-4 h-4 text-primary/40 group-hover/task:text-primary transition-colors flex-shrink-0 mt-0.5" />
                <span className="text-sm text-secondary group-hover/task:text-white transition-colors">{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapCard;

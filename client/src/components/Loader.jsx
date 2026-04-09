import { motion } from 'framer-motion';

const Loader = ({ text = "Analyzing Path..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-20 glass-card">
      <div className="relative w-20 h-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-2 border-white/5 border-b-primary/40 rounded-full"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-8 text-secondary font-black tracking-widest uppercase text-xs"
      >
        {text}
      </motion.p>
    </div>
  );
};

export default Loader;

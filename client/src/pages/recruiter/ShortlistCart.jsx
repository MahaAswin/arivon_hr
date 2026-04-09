import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  ExternalLink, 
  Mail, 
  User, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../../api/axios';

const ShortlistCart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    try {
      const token = localStorage.getItem('recruiterToken');
      const res = await api.get('/recruiter/shortlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error('Fetch shortlist failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (candidateId) => {
    // Note: I need a remove endpoint in backend or I'll just skip for now.
    // I'll assume for now this is just a view.
    alert('Removal feature coming soon in v2.0');
  };

  if (loading) return <div className="p-12 text-secondary animate-pulse font-black text-xl italic">LOADING RECRUITMENT CART...</div>;

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-12">
      <div className="neural-glow top-0 left-0 opacity-10" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Talent <span className="text-primary italic">Cart</span></h1>
          <p className="text-secondary font-medium">Your curated list of elite professionals ready for evaluation.</p>
        </div>
        <div className="glass-card px-8 py-4 flex items-center gap-4 border-primary/20">
          <ShoppingBag className="text-primary w-6 h-6" />
          <span className="text-2xl font-black">{items.length} Entity(s)</span>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 group flex flex-col md:flex-row items-center justify-between gap-8 border-white/5 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-6 flex-grow">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl text-primary border border-white/10 group-hover:border-primary/30 transition-colors">
                  {item.candidateId?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-black tracking-tight">{item.candidateId?.name}</h4>
                  <p className="text-sm text-secondary font-medium italic">{item.candidateId?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">ATS Score: {item.candidateId?.atsScore || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <a 
                  href={`http://localhost:5000${item.candidateId?.resumeUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold border border-white/5 transition-all"
                >
                  Inspect Resume <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href={`mailto:${item.candidateId?.email}`}
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-sm font-bold border border-primary/20 transition-all"
                >
                  Initiate Contact <Mail className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => handleRemove(item.candidateId?._id)}
                  className="p-3 bg-error/10 hover:bg-error/20 text-error rounded-xl border border-error/20 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="text-center py-32 glass-card border-dashed border-white/10 opacity-50">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-secondary" />
            <p className="text-xl font-black tracking-tight text-secondary uppercase tracking-[0.2em]">Your cart is currently empty</p>
            <p className="text-secondary/60 mt-2">Start discovering candidates and add them to your pool.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistCart;

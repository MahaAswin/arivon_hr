import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  ExternalLink, 
  Mail, 
  User, 
  Sparkles,
  ArrowRight,
  X,
  Check
} from 'lucide-react';
import api from '../../api/axios';
import emailjs from '@emailjs/browser';

const ShortlistCart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactCandidate, setContactCandidate] = useState(null);
  const [mailContent, setMailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

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

  const handleRemove = (item) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const token = localStorage.getItem('recruiterToken');
      await api.delete(`/recruiter/shortlist/${itemToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i._id !== itemToDelete._id));
      setIsConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Removal failed', err);
      alert('Failed to remove from cart');
    }
  };
  const handleContact = (candidate) => {
    setContactCandidate(candidate);
    setIsContactOpen(true);
    setMailContent('');
    setIsSent(false);
  };

  const sendEmail = async () => {
    if (!mailContent || !contactCandidate) return;
    setIsSending(true);
    try {
      const templateParams = {
        to_name: contactCandidate.name,
        to_email: contactCandidate.email,
        message: mailContent,
        from_name: 'Arivon Recruitment' // In a real app, get this from RecruiterContext/Profile
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Still log to backend for tracking if needed, or just proceed
      await api.post('/recruiter/shortlist/send-email', {
        candidateId: contactCandidate._id,
        subject: `Opportunity regarding your profile`,
        content: mailContent
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('recruiterToken')}` }
      });

      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsContactOpen(false);
        setIsSent(false);
      }, 2000);
    } catch (err) {
      console.error('EmailJS Dispatch failed', err);
      alert('Failed to dispatch interaction via EmailJS. Check your environment variables.');
      setIsSending(false);
    }
  };

  const templates = [
    { label: 'Interview Request', text: `Hi ${contactCandidate?.name},\n\nWe were impressed with your ATS score and your background. We'd love to schedule a technical interview with our team next week.\n\nBest regards,\nArivon Hiring Team` },
    { label: 'Portfolio Inquiry', text: `Hello ${contactCandidate?.name},\n\nWe are currently reviewing candidates for our new role. Could you please share links to any additional projects or your GitHub portfolio?\n\nRegards!` },
    { label: 'Direct Follow-up', text: `Hi ${contactCandidate?.name},\n\nReaching out to see if you are still looking for new opportunities. We have a role that matches your skills perfectly.\n\nLet's connect soon.` }
  ];

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
                <button 
                  onClick={() => handleContact(item.candidateId)}
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-sm font-bold border border-primary/20 transition-all"
                >
                  Initiate Contact <Mail className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleRemove(item)}
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

      {/* Green Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#0F172A] border border-success/30 rounded-[2rem] p-10 text-center shadow-2xl shadow-success/10 overflow-hidden"
            >
              <div className="neural-glow top-0 left-0 bg-success/20 opacity-30" />
              
              <div className="w-20 h-20 bg-success/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-success/20">
                <Trash2 className="w-10 h-10 text-success" />
              </div>

              <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Confirm <span className="text-success">Removal</span></h3>
              <p className="text-secondary font-medium leading-relaxed mb-10">
                Are you sure you want to remove <span className="text-white font-bold">{itemToDelete?.candidateId?.name}</span> from your talent pool?
              </p>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-5 bg-success hover:bg-success/80 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-success/20"
                >
                  Confirm Eviction
                </button>
                <button 
                  onClick={() => setIsConfirmOpen(false)}
                  className="w-full py-5 bg-white/5 hover:bg-white/10 text-secondary hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Retain Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Interaction Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSending && setIsContactOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-3xl bg-card border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl shadow-primary/10"
            >
              <div className="neural-glow top-0 right-0 opacity-10" />
              
              {/* Modal Header */}
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase mb-1">Neural <span className="text-primary italic">Dispatch</span></h3>
                  <p className="text-secondary text-sm font-medium">Securing communication channel with <span className="text-white font-bold">{contactCandidate?.name}</span></p>
                </div>
                {!isSending && !isSent && (
                  <button onClick={() => setIsContactOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-10 space-y-8 flex-grow overflow-y-auto max-h-[60vh] custom-scrollbar">
                {isSent ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center border border-success/30 shadow-2xl shadow-success/20 animate-bounce">
                      <Check className="w-12 h-12 text-success" />
                    </div>
                    <h4 className="text-3xl font-black uppercase tracking-widest italic">Signal Broad-cast Success</h4>
                    <p className="text-secondary font-medium tracking-wide">The interaction payload has been successfully dispatched to {contactCandidate?.email}.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60">Quick Intent Templates</label>
                      <div className="flex flex-wrap gap-3">
                        {templates.map(t => (
                          <button 
                            key={t.label}
                            onClick={() => setMailContent(t.text)}
                            className="px-4 py-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60">Message Payload</label>
                      <textarea 
                        value={mailContent}
                        onChange={(e) => setMailContent(e.target.value)}
                        placeholder="Compose your neural transmission here..."
                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 min-h-[300px] outline-none focus:border-primary/50 transition-all font-medium leading-relaxed resize-none text-lg"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              {!isSent && (
                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest italic">Arivon Connect Engine v4.2</span>
                  <button 
                    onClick={sendEmail}
                    disabled={!mailContent || isSending}
                    className={`glow-button !px-12 !py-4 flex items-center gap-3 ${isSending ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="font-black text-sm uppercase tracking-widest">Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-black text-sm uppercase tracking-widest text-black">Transmit Interaction</span>
                        <ArrowRight className="w-5 h-5 text-black" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShortlistCart;

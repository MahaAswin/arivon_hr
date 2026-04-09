import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Linkedin, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Upload, 
  X,
  Users
} from 'lucide-react';
import api from '../../api/axios';
import { useRecruiter } from '../../context/RecruiterContext';

const INDUSTRY_OPTIONS = [
  'Tech & Software', 'FinTech', 'HealthTech', 'E-commerce', 'EdTech', 
  'Cloud Services', 'Cybersecurity', 'AI & Robotics', 'Consulting', 'Marketing'
];

const SIZE_OPTIONS = [
  '1-10 Employees', '11-50 Employees', '51-200 Employees', '201-500 Employees', '500+ Employees'
];

const RecruiterOnboarding = () => {
  const navigate = useNavigate();
  const { setRecruiterProfile } = useRecruiter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    location: '',
    companySize: '',
    companyWebsite: '',
    linkedin: '',
    companyDescription: ''
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.industry && formData.location;
      case 2:
        return formData.companySize;
      case 3:
        return formData.companyDescription;
      default:
        return true;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setCompanyLogo(file);
    } else {
      alert('Logo size must be less than 2MB');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (companyLogo) {
        submitData.append('companyLogo', companyLogo);
      }

      const token = localStorage.getItem('recruiterToken');
      const res = await api.post('/recruiter/onboarding', submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setRecruiterProfile(res.data.profile);
      // Hard refresh or re-fetch would be better, but for now:
      window.location.href = '/recruiter/dashboard'; 
    } catch (error) {
      console.error('Recruiter Onionboarding failed:', error);
      alert('Failed to complete organizational profile.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer icon={Building2} title="Organization Identity" subtitle="Establish your company's core presence">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">Company Entity Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Arivon Corp"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary/50 outline-none text-xl font-bold transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">Target Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary/50 outline-none font-bold text-white transition-all"
                  >
                    <option value="" className="bg-[#0f172a]">Select Industry</option>
                    {INDUSTRY_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-[#0f172a]">{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">HQ Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 focus:border-primary/50 outline-none font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">Company Logo (Optional)</label>
                <div className="border-2 border-dashed border-white/5 hover:border-primary/30 rounded-2xl p-6 text-center transition-all cursor-pointer bg-white/2 relative">
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {companyLogo ? (
                    <div className="flex items-center justify-between bg-primary/10 p-3 rounded-xl">
                       <span className="text-sm font-bold text-primary italic">{companyLogo.name}</span>
                       <X className="w-4 h-4 text-primary" onClick={() => setCompanyLogo(null)} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       <Upload className="w-8 h-8 text-secondary/30" />
                       <span className="text-xs font-bold text-secondary uppercase tracking-widest">Upload SVG, PNG or JPG</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer icon={Globe} title="Digital Presence" subtitle="Where can candidates find more about you?">
            <div className="space-y-8">
               <div>
                  <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">Team Scale</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SIZE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData({ ...formData, companySize: opt })}
                        className={`p-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
                          formData.companySize === opt
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">Corporate Website</label>
                    <div className="relative">
                      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/50" />
                      <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                        placeholder="https://arivon.io"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 focus:border-primary/50 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">LinkedIn URL</label>
                    <div className="relative">
                      <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/50" />
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="linkedin.com/company/arivon"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 focus:border-primary/50 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>
            </div>
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer icon={Target} title="Mission Brief" subtitle="Tell candidates what you stand for">
            <div className="space-y-6">
               <div>
                 <label className="block text-sm font-black mb-3 text-secondary tracking-widest uppercase">Company Culture & Mission</label>
                 <textarea
                   rows={8}
                   value={formData.companyDescription}
                   onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                   placeholder="Describe your organization's mission, culture, and what kind of talent you're looking for..."
                   className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 focus:border-primary/50 outline-none font-medium leading-relaxed transition-all resize-none"
                 />
               </div>
               <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4 text-primary">
                  <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black">!</span>
                  <p className="text-xs font-bold leading-tight uppercase tracking-widest">This description will be displayed on all your job postings by default.</p>
               </div>
            </div>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6 pt-24 pb-12">
      <div className="neural-glow top-0 right-0 opacity-20" />
      <div className="neural-glow bottom-0 left-0 opacity-10" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Progress System */}
        <div className="flex items-center justify-between mb-16 px-12">
           {[...Array(totalSteps)].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                 <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black transition-all ${
                    idx + 1 < currentStep ? 'bg-success text-white' :
                    idx + 1 === currentStep ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' :
                    'bg-white/5 text-secondary border border-white/5'
                 }`}>
                    {idx + 1 < currentStep ? <Check className="w-6 h-6" /> : idx + 1}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${idx + 1 === currentStep ? 'text-primary' : 'text-secondary/40'}`}>
                    {idx === 0 ? 'Identity' : idx === 1 ? 'Presence' : 'Mission'}
                 </span>
              </div>
           ))}
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center justify-between mt-12 px-6">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-[2rem] transition-all font-black text-xs uppercase tracking-widest"
            >
              <ChevronLeft className="w-5 h-5 text-primary" /> Previous Brief
            </button>
          ) : <div />}
          
          <button
            onClick={currentStep === totalSteps ? handleSubmit : handleNext}
            disabled={!validateStep() || loading}
            className="glow-button !px-12 !py-5 flex items-center gap-3 disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="font-black text-sm uppercase tracking-widest">
                {loading ? 'Processing...' : currentStep === totalSteps ? 'Establish Identity' : 'Advance Stage'}
            </span>
            {!loading && currentStep < totalSteps && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const StepContainer = ({ icon: Icon, title, subtitle, children }) => (
  <div className="glass-card p-12 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
    <div className="flex items-center gap-8 mb-12">
      <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h2 className="text-4xl font-black tracking-tighter uppercase">{title}</h2>
        <p className="text-secondary font-medium tracking-wide">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export default RecruiterOnboarding;

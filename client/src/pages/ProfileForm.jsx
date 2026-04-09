import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Briefcase, Heart, Target, 
  Sparkles, ChevronRight, ChevronLeft, 
  Layers, Clock, Trophy, User 
} from 'lucide-react';
import { allSkillsList } from '../data/skills';
import { useAuth } from '../context/AuthContext';

const ProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: [],
    interests: [],
    goal: '',
    experience: 'Beginner',
    timeCommitment: '',
    projects: 'No'
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const { profile, loading: authLoading, refreshProfile } = useAuth();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 7;

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        ...profile,
        experience: profile.experience || 'Beginner'
      }));
    }
  }, [profile]);

  const filteredSkills = allSkillsList.filter(skill => 
    skill.toLowerCase().includes(skillInput.toLowerCase()) && 
    !formData.skills.includes(skill) &&
    skillInput.length > 0
  );

  const addTag = (type, val) => {
    const value = val.trim();
    if (!value) return;
    
    if (type === 'skills' && !formData.skills.includes(value)) {
      setFormData({ ...formData, skills: [...formData.skills, value] });
      setSkillInput('');
    } else if (type === 'interests' && !formData.interests.includes(value)) {
      setFormData({ ...formData, interests: [...formData.interests, value] });
      setInterestInput('');
    }
  };

  const removeTag = (type, val) => {
    setFormData({ 
      ...formData, 
      [type]: formData[type].filter(item => item !== val) 
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      await api.put('/profile/update', formData);
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      console.error('Update failed');
    } finally {
      setProcessing(false);
    }
  };

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="w-full bg-white/5 h-1.5 rounded-full mb-10 flex overflow-hidden">
    <motion.div 
      className="orange-gradient h-full"
      initial={{ width: 0 }}
      animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    />
  </div>
);

  const FloatingLabelInput = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
        <Icon className="text-primary w-5 h-5" />
        {label}
      </label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-secondary"
        />
        <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/20 pointer-events-none transition-colors" />
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-transparent py-4 px-6 relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-3xl relative">
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight line-clamp-1">Complete Your <span className="text-primary">Profile</span></h2>
            <p className="text-secondary text-sm font-medium">Evolution Milestone: Step {currentStep} of {totalSteps}</p>
          </motion.div>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="glass-card p-8 md:p-12 h-[620px] flex flex-col justify-between shadow-2xl relative overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <FloatingLabelInput 
                    label="Full Name" 
                    icon={User} 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
                      <GraduationCap className="text-primary w-5 h-5" />
                      Education Year
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 flex items-center justify-between focus:border-primary/50 outline-none transition-all"
                      >
                        <span className={formData.education ? 'text-white' : 'text-secondary'}>
                          {formData.education || 'Select Year'}
                        </span>
                        <ChevronRight className={`w-5 h-5 text-secondary transition-transform duration-300 ${isYearDropdownOpen ? 'rotate-90' : ''}`} />
                      </button>
                      {isYearDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                          {["Year 1", "Year 2", "Year 3", "Year 4", "Postgraduate", "Other"].map((y) => (
                            <button
                              key={y}
                              className="w-full text-left px-6 py-4 hover:bg-white/5 text-white transition-colors border-b border-white/5 last:border-none"
                              onClick={() => {
                                setFormData({ ...formData, education: y });
                                setIsYearDropdownOpen(false);
                              }}
                            >
                              {y}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Universal Skill Tags */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
                    <Briefcase className="text-primary w-5 h-5" />
                    Master Your Skills
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-white/5 border border-white/10 rounded-2xl">
                    {formData.skills.map(s => (
                      <span key={s} className="bg-primary/20 text-primary-light border border-primary/30 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                        {s}
                        <button onClick={() => removeTag('skills', s)}>&times;</button>
                      </span>
                    ))}
                    <input 
                      className="bg-transparent border-none outline-none text-white text-sm grow"
                      placeholder={formData.skills.length === 0 ? "Type e.g. HTML, Marketing, Finance..." : ""}
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); addTag('skills', skillInput); }
                        if (e.key === 'Backspace' && !skillInput && formData.skills.length > 0) removeTag('skills', formData.skills[formData.skills.length - 1]);
                      }}
                    />
                  </div>
                  {filteredSkills.length > 0 && (
                    <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-y-auto max-h-48 mt-2">
                      {filteredSkills.map(s => (
                        <button 
                          key={s} 
                          className="w-full text-left px-6 py-3 hover:bg-primary/20 transition-colors text-sm"
                          onClick={() => addTag('skills', s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Interests Tags */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
                    <Heart className="text-primary w-5 h-5" />
                    Explore Your Interests
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-white/5 border border-white/10 rounded-2xl">
                    {formData.interests.map(i => (
                      <span key={i} className="bg-primary/20 text-primary-light border border-primary/30 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                        {i}
                        <button onClick={() => removeTag('interests', i)}>&times;</button>
                      </span>
                    ))}
                    <input 
                      className="bg-transparent border-none outline-none text-white text-sm grow"
                      placeholder="Type e.g. AI, Music, Finance..."
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); addTag('interests', interestInput); }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Career Goal */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
                    <Target className="text-primary w-5 h-5" />
                    Career Strategy
                  </label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 focus:border-primary/50 outline-none text-white h-48 resize-none"
                    placeholder="Describe your career objective in detail (e.g. Become a Senior Full Stack Engineer at a top tech firm)"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  />
                </div>
              )}

              {/* Step 5: Experience Level */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
                    <Layers className="text-primary w-5 h-5" />
                    How experienced are you?
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {["Beginner", "Intermediate", "Advanced"].map(level => (
                      <button
                        key={level}
                        className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between ${
                          formData.experience === level ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setFormData({ ...formData, experience: level })}
                      >
                        <span className="font-bold text-lg">{level}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.experience === level ? 'border-primary' : 'border-white/20'}`}>
                          {formData.experience === level && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Time Commitment */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
                    <Clock className="text-primary w-5 h-5" />
                    Weekly commitment?
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 flex items-center justify-between focus:border-primary/50 outline-none transition-all"
                    >
                      <span className={formData.timeCommitment ? 'text-white' : 'text-secondary'}>
                        {formData.timeCommitment || 'Select Time Commitment'}
                      </span>
                      <ChevronRight className={`w-5 h-5 text-secondary transition-transform duration-300 ${isTimeDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {isTimeDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                        {["< 5 hrs/week", "5–10 hrs/week", "10+ hrs/week"].map((time) => (
                          <button
                            key={time}
                            className="w-full text-left px-6 py-4 hover:bg-white/5 text-white transition-colors border-b border-white/5 last:border-none"
                            onClick={() => {
                              setFormData({ ...formData, timeCommitment: time });
                              setIsTimeDropdownOpen(false);
                            }}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 7: Projects */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <label className="flex items-center gap-2 text-lg font-semibold text-white/90">
                    <Trophy className="text-primary w-5 h-5" />
                    Project Portfolio
                  </label>
                  <div className="flex gap-4 mb-6">
                    {["Yes", "No"].map(val => (
                      <button
                        key={val}
                        className={`px-8 py-3 rounded-xl border transition-all ${
                          formData.projects === val ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10'
                        }`}
                        onClick={() => setFormData({ ...formData, projects: val })}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  {formData.projects === 'Yes' && (
                    <motion.textarea 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 focus:border-primary/50 outline-none text-white h-32 resize-none"
                      placeholder="Give a brief summary of your key projects..."
                      value={formData.projects === 'Yes' ? (formData.projects_text || '') : ''}
                      onChange={(e) => setFormData({ ...formData, projects_text: e.target.value })}
                    />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 text-secondary hover:text-white transition-colors py-2 px-4 rounded-xl ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="glow-button flex items-center gap-2 group"
              >
                Continue
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={processing}
                className="glow-button flex items-center gap-2 group bg-success hover:bg-success/80 shadow-success/40"
              >
                {processing ? 'Analyzing...' : (
                  <>
                    Finish Profile
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;

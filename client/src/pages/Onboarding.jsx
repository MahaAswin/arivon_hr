import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Code, Heart, Briefcase, FileText, Target, 
  ChevronRight, ChevronLeft, Check, Upload, X 
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SKILLS_OPTIONS = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'MongoDB', 
  'SQL', 'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Cloud Computing',
  'DevOps', 'Cybersecurity', 'Mobile Development', 'Blockchain'
];

const INTERESTS_OPTIONS = [
  'Web Development', 'Mobile Apps', 'AI/ML', 'Data Science', 'Cybersecurity',
  'Cloud Computing', 'Game Development', 'IoT', 'Blockchain', 'DevOps',
  'UI/UX Design', 'Backend Systems', 'Frontend Development'
];

const PROJECT_TYPES = [
  'Web Application', 'Mobile App', 'Machine Learning', 'Data Analysis',
  'IoT Project', 'Game Development', 'Blockchain', 'API Development'
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    level: '',
    branch: '',
    cgpa: '',
    skills: [],
    interests: [],
    projects: {
      hasProjects: false,
      types: [],
      count: ''
    },
    careerGoal: '',
    readiness: '',
    learningStyle: '',
    learningTime: '',
    confidence: ''
  });

  const totalSteps = 5;

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
        return formData.level && formData.branch && formData.cgpa;
      case 2:
        return formData.skills.length > 0;
      case 3:
        return formData.interests.length > 0;
      case 4:
        return true; // Projects are optional
      case 5:
        return true; // Resume is optional
      default:
        return true;
    }
  };

  const toggleArrayItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const toggleProjectType = (type) => {
    setFormData(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        types: prev.projects.types.includes(type)
          ? prev.projects.types.filter(t => t !== type)
          : [...prev.projects.types, type]
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setResumeFile(file);
    } else {
      alert('File size must be less than 5MB');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('level', formData.level);
      submitData.append('branch', formData.branch);
      submitData.append('cgpa', formData.cgpa);
      submitData.append('skills', JSON.stringify(formData.skills));
      submitData.append('interests', JSON.stringify(formData.interests));
      submitData.append('projects', JSON.stringify(formData.projects));
      submitData.append('careerGoal', formData.careerGoal);
      submitData.append('readiness', formData.readiness);
      submitData.append('learningStyle', formData.learningStyle);
      submitData.append('learningTime', formData.learningTime);
      submitData.append('confidence', formData.confidence);
      
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      await api.post('/profile/complete', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await refreshProfile();
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContainer icon={GraduationCap} title="Basic Information" subtitle="Tell us about your academic background">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3">Current Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {['2nd Year', '3rd Year', 'Final Year', 'PG'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, level })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.level === level
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">Branch/Department</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g., Computer Science, Electronics"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">CGPA / Percentage</label>
                <input
                  type="text"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  placeholder="e.g., 8.5 or 85%"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none"
                />
              </div>
            </div>
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer icon={Code} title="Technical Skills" subtitle="Select your current skill set">
            <div className="flex flex-wrap gap-3">
              {SKILLS_OPTIONS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleArrayItem('skills', skill)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    formData.skills.includes(skill)
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer icon={Heart} title="Career Interests" subtitle="What domains excite you?">
            <div className="flex flex-wrap gap-3">
              {INTERESTS_OPTIONS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleArrayItem('interests', interest)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    formData.interests.includes(interest)
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer icon={Briefcase} title="Project Experience" subtitle="Have you worked on any projects?">
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setFormData({ ...formData, projects: { ...formData.projects, hasProjects: true } })}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.projects.hasProjects
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setFormData({ ...formData, projects: { hasProjects: false, types: [], count: '' } })}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    !formData.projects.hasProjects
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  No
                </button>
              </div>

              {formData.projects.hasProjects && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-3">Project Types</label>
                    <div className="flex flex-wrap gap-3">
                      {PROJECT_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => toggleProjectType(type)}
                          className={`px-4 py-2 rounded-full border-2 transition-all ${
                            formData.projects.types.includes(type)
                              ? 'border-primary bg-primary/20 text-primary'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3">Number of Projects</label>
                    <select
                      value={formData.projects.count}
                      onChange={(e) => setFormData({ ...formData, projects: { ...formData.projects, count: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-white"
                    >
                      <option value="" className="bg-[#1E293B] text-white">Select</option>
                      <option value="1-2" className="bg-[#1E293B] text-white">1-2 Projects</option>
                      <option value="3-5" className="bg-[#1E293B] text-white">3-5 Projects</option>
                      <option value="5+" className="bg-[#1E293B] text-white">5+ Projects</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer icon={FileText} title="Resume Upload" subtitle="Upload your resume (optional but recommended)">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <p className="text-sm font-bold mb-2">Click to upload resume</p>
                  <p className="text-xs text-secondary">PDF or DOC (Max 5MB)</p>
                </label>
              </div>

              {resumeFile && (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold">{resumeFile.name}</span>
                  </div>
                  <button onClick={() => setResumeFile(null)} className="text-red-400 hover:text-red-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[...Array(totalSteps)].map((_, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  idx + 1 < currentStep ? 'bg-primary text-white' :
                  idx + 1 === currentStep ? 'bg-primary text-white' :
                  'bg-white/5 text-secondary'
                }`}>
                  {idx + 1 < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < totalSteps - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    idx + 1 < currentStep ? 'bg-primary' : 'bg-white/5'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-secondary">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          
          <button
            onClick={currentStep === totalSteps ? handleSubmit : handleNext}
            disabled={!validateStep() || loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-white/5 disabled:text-secondary rounded-xl transition-all font-bold"
          >
            {loading ? 'Submitting...' : currentStep === totalSteps ? 'Complete Onboarding' : 'Next'}
            {!loading && currentStep < totalSteps && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const StepContainer = ({ icon: Icon, title, subtitle, children }) => (
  <div className="glass-card p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-secondary">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export default Onboarding;

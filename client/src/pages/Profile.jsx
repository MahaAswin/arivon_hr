import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, GraduationCap, Briefcase, Heart, Target, Sparkles, 
  Save, Edit3, Plus, X, FileText, Download, Clock, TrendingUp, BookOpen 
} from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { profile, loading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (profile) {
      // Parse skills and interests if they come as strings
      const parsedProfile = { ...profile };
      
      if (typeof parsedProfile.skills === 'string') {
        try {
          parsedProfile.skills = JSON.parse(parsedProfile.skills);
        } catch (e) {
          parsedProfile.skills = [];
        }
      }
      
      if (typeof parsedProfile.interests === 'string') {
        try {
          parsedProfile.interests = JSON.parse(parsedProfile.interests);
        } catch (e) {
          parsedProfile.interests = [];
        }
      }
      
      // Ensure they are arrays
      parsedProfile.skills = Array.isArray(parsedProfile.skills) ? parsedProfile.skills : [];
      parsedProfile.interests = Array.isArray(parsedProfile.interests) ? parsedProfile.interests : [];
      
      setFormData(parsedProfile);
    }
  }, [profile]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      // Format data before sending - ensure arrays are actual arrays, not strings
      const formattedData = {
        ...formData,
        skills: typeof formData.skills === 'string' 
          ? JSON.parse(formData.skills) 
          : Array.isArray(formData.skills) 
            ? formData.skills 
            : [],
        interests: typeof formData.interests === 'string' 
          ? JSON.parse(formData.interests) 
          : Array.isArray(formData.interests) 
            ? formData.interests 
            : []
      };
      
      console.log('Sending formatted data:', formattedData);
      
      await api.put('/profile/update', formattedData);
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to safely get array data
  const safeGetArray = (data) => {
    if (!data) return [];
    
    // If it's a string, try parsing it as JSON
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    
    // If it's an array, it might contain a single stringified array
    if (Array.isArray(data)) {
      if (data.length === 1 && typeof data[0] === 'string' && data[0].startsWith('[')) {
        try {
          const parsed = JSON.parse(data[0]);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
      return data;
    }
    
    return [];
  };

  if (loading) return <div className="p-20"><Loader text="Syncing user profile..." /></div>;

  if (!profile) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-black text-secondary">PROFILES NOT INITIALIZED</h2>
      <p className="text-secondary/60 mt-4 italic">Please complete your onboarding to view your professional records.</p>
    </div>
  );

  const safeName = profile.name || 'User';

  const DetailSection = ({ icon: Icon, label, value, field, isList = false }) => {
    // Safely get array data
    const arrayData = isList ? safeGetArray(profile[field]) : null;
    const formArrayData = isList ? safeGetArray(formData[field]) : null;
    
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60">
          <Icon className="w-4 h-4 text-primary/60" />
          {label}
        </label>
        {isEditing ? (
          isList ? (
            <div className="flex flex-wrap gap-2">
              {formArrayData?.map((item, idx) => (
                <span key={idx} className="bg-primary/20 text-primary-light border border-primary/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                  {item}
                  <button onClick={() => setFormData({ ...formData, [field]: formArrayData.filter(i => i !== item) })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button 
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 rounded-full transition-colors"
                onClick={() => {
                  const val = prompt(`Add new ${label.toLowerCase()}`);
                  if (val) setFormData({ ...formData, [field]: [...formArrayData, val] });
                }}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={formData[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none transition-all"
            />
          )
        ) : (
          <div className="text-sm font-bold text-white/90">
            {isList ? (
              <div className="flex flex-wrap gap-2">
                {arrayData?.length > 0 ? (
                  arrayData.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-secondary text-xs">No {label.toLowerCase()} added yet</span>
                )}
              </div>
            ) : (
              value || <span className="text-secondary text-xs">Not specified</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary text-4xl font-black shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            {safeName[0]}
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">{safeName}</h1>
            <p className="text-secondary font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
            {profile.level && (
              <p className="text-primary font-bold mt-1">{profile.level} • {profile.branch}</p>
            )}
          </div>
        </div>
        <button
          onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
          disabled={saving}
          className={`glow-button flex items-center gap-2 ${isEditing ? 'bg-success hover:bg-success/80' : ''}`}
        >
          {saving ? 'Saving...' : isEditing ? (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Details */}
        <div className="glass-card p-10 space-y-8">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Academic Profile</h3>
          {profile.level && (
            <>
              <DetailSection icon={GraduationCap} label="Current Level" value={profile.level} field="level" />
              <DetailSection icon={BookOpen} label="Branch/Department" value={profile.branch} field="branch" />
              <DetailSection icon={TrendingUp} label="CGPA/Percentage" value={profile.cgpa} field="cgpa" />
            </>
          )}
          {profile.education && (
            <DetailSection icon={GraduationCap} label="Education" value={profile.education} field="education" />
          )}
          {profile.experience && (
            <DetailSection icon={Briefcase} label="Experience Level" value={profile.experience} field="experience" />
          )}
        </div>

        {/* Technical Skills */}
        <div className="glass-card p-10 space-y-8">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Technical Profile</h3>
          <DetailSection icon={Sparkles} label="Skills" isList={true} field="skills" />
          <DetailSection icon={Heart} label="Interests" isList={true} field="interests" />
        </div>

        {/* Projects */}
        <div className="glass-card p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold uppercase tracking-tight">Project Experience</h3>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${(!profile.projects?.hasProjects && !isEditing) ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'}`}>
              {isEditing ? 'Configure Deployment' : profile.projects?.hasProjects ? 'Engaged' : 'Not Deployed'}
            </span>
          </div>
          
          <div className="space-y-8">
            {/* Project Existence Toggle */}
            {isEditing && (
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <input 
                  type="checkbox" 
                  checked={formData.projects?.hasProjects}
                  onChange={(e) => setFormData({
                    ...formData,
                    projects: { ...formData.projects, hasProjects: e.target.checked }
                  })}
                  className="w-5 h-5 accent-primary"
                />
                <span className="text-sm font-bold">Declare Project Portfolio</span>
              </div>
            )}

            {(isEditing || profile.projects?.hasProjects) ? (
              <>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60 ml-1">
                    <Briefcase className="w-4 h-4 text-primary/60" /> Project Domains / Types
                  </label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {safeGetArray(formData.projects?.types)?.map((type, idx) => (
                        <span key={idx} className="bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                          {type}
                          <button onClick={() => setFormData({ 
                            ...formData, 
                            projects: { ...formData.projects, types: safeGetArray(formData.projects.types).filter(t => t !== type) } 
                          })}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <button 
                        className="bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 rounded-full transition-colors"
                        onClick={() => {
                          const val = prompt("Enter project domain (e.g. Web Dev, AI, Blockchain)");
                          if (val) setFormData({ 
                            ...formData, 
                            projects: { ...formData.projects, types: [...safeGetArray(formData.projects?.types), val] } 
                          });
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {safeGetArray(profile.projects?.types)?.length > 0 ? (
                        safeGetArray(profile.projects.types).map((type, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold uppercase tracking-tight">
                            {type}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-secondary italic">No domains declared.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60 ml-1">
                    <Plus className="w-4 h-4 text-primary/60" /> Total Active Projects
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="e.g. 5 projects completed"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:border-primary/50 outline-none"
                      value={formData.projects?.count || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        projects: { ...formData.projects, count: e.target.value } 
                      })}
                    />
                  ) : (
                    <div className="text-sm font-black text-white/90 bg-white/5 px-5 py-3 rounded-xl border border-white/5 inline-block">
                      {profile.projects?.count || '0'}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-10 opacity-40 italic flex flex-col items-center gap-3">
                <Briefcase className="w-12 h-12 text-secondary/20" />
                <p className="text-sm font-medium">No project assets detected in your profile.</p>
              </div>
            )}
          </div>
        </div>

        {/* Resume */}
        {profile.resumeUrl && (
          <div className="glass-card p-10 space-y-8">
            <h3 className="text-xl font-bold border-b border-white/5 pb-4">Resume</h3>
            <a 
              href={`http://localhost:5000${profile.resumeUrl.startsWith('http') ? '' : profile.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4 hover:bg-primary/20 transition-all"
            >
              <FileText className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold">View Resume</p>
                <p className="text-xs text-secondary">Click to download</p>
              </div>
              <Download className="w-5 h-5 text-primary" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

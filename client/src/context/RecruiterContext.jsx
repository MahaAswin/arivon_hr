import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const RecruiterContext = createContext();

export const RecruiterProvider = ({ children }) => {
  const [recruiter, setRecruiter] = useState(null);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('recruiterToken');
    if (token) {
      loadRecruiter();
    } else {
      setLoading(false);
    }
  }, []);

  const loadRecruiter = async () => {
    try {
      // Use the specific recruiter profile endpoint
      const res = await api.get('/recruiter/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('recruiterToken')}` }
      });
      setRecruiterProfile(res.data);
      // Ensure the recruiter object has the completeness flag from the profile's owner
      setRecruiter(prev => ({ ...prev, ...res.data, isProfileComplete: res.data.recruiterId?.isProfileComplete || false })); 
    } catch (err) {
      console.error('Failed to load recruiter profile', err);
      localStorage.removeItem('recruiterToken');
      setRecruiter(null);
      setRecruiterProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const recruiterLogin = async (email, password) => {
    const res = await api.post('/recruiter/login', { email, password });
    localStorage.setItem('recruiterToken', res.data.token);
    setRecruiter(res.data.recruiter);
    await loadRecruiter();
    return res.data;
  };

  const recruiterRegister = async (recruiterName, email, password) => {
    const res = await api.post('/recruiter/register', { recruiterName, email, password });
    localStorage.setItem('recruiterToken', res.data.token);
    setRecruiter(res.data.recruiter);
    await loadRecruiter();
    return res.data;
  };

  const recruiterLogout = () => {
    localStorage.removeItem('recruiterToken');
    setRecruiter(null);
    setRecruiterProfile(null);
  };

  return (
    <RecruiterContext.Provider value={{ 
      recruiter, 
      recruiterProfile, 
      loading, 
      recruiterLogin, 
      recruiterRegister, 
      recruiterLogout,
      setRecruiterProfile
    }}>
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = () => useContext(RecruiterContext);

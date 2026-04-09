import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecruiter } from '../context/RecruiterContext';

export const ProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isProfileComplete = user?.isProfileComplete || profile?.isProfileComplete;
  const currentPath = window.location.pathname;

  // If profile is incomplete and not on onboarding page, redirect to onboarding
  if (!isProfileComplete && currentPath !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If profile is complete and on onboarding page, redirect to dashboard
  if (isProfileComplete && currentPath === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (user) {
    // Check if profile is complete
    const isProfileComplete = user?.isProfileComplete || profile?.isProfileComplete;
    
    if (!isProfileComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const RecruiterProtectedRoute = ({ children }) => {
  const { recruiter, loading } = useRecruiter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!recruiter) {
    return <Navigate to="/login" replace />;
  }

  const isProfileComplete = recruiter?.isProfileComplete;
  const currentPath = window.location.pathname;

  // If profile is incomplete and not on onboarding page, redirect to onboarding
  if (!isProfileComplete && currentPath !== '/recruiter/onboarding') {
    return <Navigate to="/recruiter/onboarding" replace />;
  }

  // If profile is complete and on onboarding page, redirect to dashboard
  if (isProfileComplete && currentPath === '/recruiter/onboarding') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  return children;
};

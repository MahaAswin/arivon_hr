import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu } from 'lucide-react';

import Home from './pages/Home';
import { Login, Register } from './pages/AuthPages';
import Onboarding from './pages/Onboarding';
import ProfileForm from './pages/ProfileForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ATS from './pages/ATS';
import BrowseJobs from './pages/BrowseJobs';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { RecruiterProvider, useRecruiter } from './context/RecruiterContext';
import RecruiterSidebar from './components/recruiter/RecruiterSidebar';
import { ProtectedRoute, PublicRoute, RecruiterProtectedRoute } from './components/RouteGuards';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CandidateSearch from './pages/recruiter/CandidateSearch';
import JobPostForm from './pages/recruiter/JobPostForm';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import RecruiterOnboarding from './pages/recruiter/RecruiterOnboarding';
import ApplicationInbox from './pages/recruiter/ApplicationInbox';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { recruiter } = useRecruiter();
  
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  const isRecruiterRoute = location.pathname.startsWith('/recruiter');
  const isOnboardingPage = location.pathname === '/onboarding';

  return (
    <div className="flex min-h-screen bg-background text-white">
      {!isPublicPage && !isOnboardingPage && (
        isRecruiterRoute ? (
          <RecruiterSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        ) : (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )
      )}
      
      <div className={`flex-grow flex flex-col transition-all duration-300 ${!isPublicPage && !isOnboardingPage ? 'lg:pl-72' : ''}`}>
        {isPublicPage ? (
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        ) : !isOnboardingPage ? (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-6 left-6 z-40 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all shadow-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
        ) : null}
        
        <main className={`flex-grow ${isPublicPage || isOnboardingPage ? '' : 'pt-12 pb-12'}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile-form" 
                element={
                  <ProtectedRoute>
                    <ProfileForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ats" 
                element={
                  <ProtectedRoute>
                    <ATS />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute>
                    <BrowseJobs />
                  </ProtectedRoute>
                } 
              />

              {/* Recruiter Routes */}
              <Route 
                path="/recruiter/dashboard" 
                element={
                  <RecruiterProtectedRoute>
                    <RecruiterDashboard />
                  </RecruiterProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/candidates" 
                element={
                  <RecruiterProtectedRoute>
                    <CandidateSearch />
                  </RecruiterProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/inbox" 
                element={
                  <RecruiterProtectedRoute>
                    <ApplicationInbox />
                  </RecruiterProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/post-job" 
                element={
                  <RecruiterProtectedRoute>
                    <JobPostForm />
                  </RecruiterProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/profile" 
                element={
                  <RecruiterProtectedRoute>
                    <RecruiterProfile />
                  </RecruiterProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/onboarding" 
                element={
                  <RecruiterProtectedRoute>
                    <RecruiterOnboarding />
                  </RecruiterProtectedRoute>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <RecruiterProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RecruiterProvider>
    </Router>
  );
}

export default App;

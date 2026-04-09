import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecruiter } from '../context/RecruiterContext';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { recruiter } = useRecruiter();
  const location = useLocation();

  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${isPublicPage ? 'bg-transparent' : 'lg:pl-72'}`}>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl"
      >
        <div className="flex items-center gap-4">
          {!isPublicPage && (
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}
          
          {isPublicPage && (
            <Link to="/" className="flex items-center gap-0 group">
              <img src={logo} alt="Arivon" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black tracking-tighter text-white">RIVON</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-6">
          {(user || recruiter) && isPublicPage ? (
            <Link to={recruiter ? "/recruiter/dashboard" : "/dashboard"} className="glow-button !py-2 !px-5 !text-xs flex items-center gap-2">
              Go to Console
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : !(user || recruiter) && isPublicPage && (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-5 py-2 text-sm font-bold text-white hover:text-primary transition-colors hidden sm:block">Sign In</Link>
              <Link to="/register" className="glow-button !py-2 !px-5 !text-sm">Start Free</Link>
            </div>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;

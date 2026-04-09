import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  Layers, 
  Map as MapIcon, 
  User as UserIcon, 
  LogOut, 
  ChevronLeft,
  Sparkles,
  Zap,
  FileSearch,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
    { icon: FileSearch, label: 'ATS Analyzer', path: '/ats' },
    { icon: Briefcase, label: 'Browse Jobs', path: '/jobs' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-card border-r border-white/5 z-50
        transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-0 group">
            <img src={logo} alt="Arivon" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black tracking-tighter text-white">RIVON</span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-secondary">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
                    : 'text-secondary hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <div className={`
                  p-2 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-primary/20' : 'group-hover:bg-white/10'}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                <span className="font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-error/10 hover:bg-error/20 text-error border border-error/20 hover:border-error/30 transition-all font-bold group shadow-lg shadow-error/5"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
          
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Arivon Intelligence v2.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

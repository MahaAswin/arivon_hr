import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Target, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Globe, 
  Trophy,
  ArrowRight,
  ShieldCheck,
  ZapIcon,
  Search
} from 'lucide-react';
import logo from '../assets/logo.png';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    { icon: Target, title: "Profile Builder", desc: "Create your comprehensive professional profile easily." },
    { icon: Brain, title: "Experience Tracking", desc: "Log your educational background and work history." },
    { icon: Zap, title: "Skill Repository", desc: "Centralize all your technical and soft skills." },
    { icon: Trophy, title: "Project Showcase", desc: "Highlight your best projects and achievements." }
  ];

  const steps = [
    { title: "Create Account", desc: "Sign up and join the platform." },
    { title: "Build Profile", desc: "Add your education, skills, and experience." },
    { title: "Upload Resume", desc: "Optionally add your CV to your profile." },
    { title: "Access Dashboard", desc: "View and manage your complete profile." }
  ];

  return (
    <div className="relative overflow-hidden pt-16">
      {/* Background Neural Glows */}
      <div className="neural-glow -top-40 -right-40 opacity-20" />
      <div className="neural-glow top-1/2 -left-40 opacity-10" />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 container mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md"
        >
          <ZapIcon className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-bold tracking-widest text-primary uppercase">The Future of Career Intelligence</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-primary italic">Professional Clarity</span>
        </motion.h1>

        <motion.p 
          className="max-w-3xl text-lg md:text-xl text-secondary mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Organize your skills, education, and projects with Arivon. Build your definitive professional profile today.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/register" className="glow-button w-full sm:w-auto flex items-center justify-center gap-3 text-lg group">
            Start Your AI Journey
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-lg font-bold flex items-center justify-center">
            Explore Features
          </a>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Core <span className="text-primary">Capabilities</span></h2>
          <p className="text-secondary">Everything you need to showcase your talent.</p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass-card p-10 flex flex-col items-center text-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-4 rounded-2xl bg-white/5 mb-8 border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
                <f.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-secondary leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Steps */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">The <span className="text-primary">Mastery</span> Loop</h2>
          <p className="text-secondary">Simple, automated, and effective.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-px bg-white/10 z-0" />
          
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-12 h-12 rounded-full bg-[#0F172A] border-4 border-white/10 flex items-center justify-center font-black text-white group-hover:border-primary group-hover:text-primary transition-all mb-6">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-secondary text-sm px-4">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-20 border-t border-white/5 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-0 group mb-4">
              <img src={logo} alt="Arivon" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black tracking-tighter text-white">RIVON</span>
            </Link>
            <p className="text-secondary text-sm font-medium">© 2026 Arivon Intelligence Platform</p>
          </div>

          <div className="flex gap-10 text-sm font-bold text-secondary">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Join Elite Community</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

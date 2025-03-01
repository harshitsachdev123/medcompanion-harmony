
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Calendar, 
  Bell, 
  User, 
  Menu, 
  X, 
  Home,
  UserCircle,
  LogIn
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();
  
  const links = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/medications', label: 'Medications', icon: <Pill size={20} /> },
    { path: '/reminders', label: 'Reminders', icon: <Bell size={20} /> },
    { path: '/caregiver', label: 'Caregiver', icon: <User size={20} /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  const handleAuthClick = () => {
    if (user.isLoggedIn) {
      logout();
    } else {
      navigate('/login');
    }
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-med-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-med-blue-600 mr-2"
              >
                <Pill size={28} />
              </motion.div>
              <span className="text-xl font-semibold text-med-gray-900">MedCompanion</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive(link.path) 
                    ? 'text-med-blue-600 bg-med-blue-50' 
                    : 'text-med-gray-700 hover:text-med-blue-600 hover:bg-med-gray-50'
                  }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 h-0.5 w-full bg-med-blue-500 left-0"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Login/Signup Button */}
          <div className="flex items-center">
            <Button 
              onClick={handleAuthClick}
              variant="ghost" 
              className="flex items-center gap-2 ml-4 text-med-gray-700 hover:text-med-blue-600"
            >
              {user.isLoggedIn ? (
                <>
                  <UserCircle size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span className="hidden sm:inline">Login / Signup</span>
                </>
              )}
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-med-gray-500 hover:text-med-blue-600 hover:bg-med-gray-100 focus:outline-none focus:ring-2 focus:ring-med-blue-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-med-gray-200">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium
                  ${isActive(link.path)
                    ? 'text-med-blue-600 bg-med-blue-50'
                    : 'text-med-gray-700 hover:text-med-blue-600 hover:bg-med-gray-50'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Login/Signup for mobile */}
            <div 
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-med-gray-700 hover:text-med-blue-600 hover:bg-med-gray-50 cursor-pointer"
              onClick={() => {
                setIsMenuOpen(false);
                handleAuthClick();
              }}
            >
              <span className="mr-3">
                {user.isLoggedIn ? <UserCircle size={20} /> : <LogIn size={20} />}
              </span>
              {user.isLoggedIn ? 'Logout' : 'Login / Signup'}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;

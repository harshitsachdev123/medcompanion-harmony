
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-med-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link 
              to="/" 
              className="text-med-gray-500 hover:text-med-blue-600 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/privacy" 
              className="text-med-gray-500 hover:text-med-blue-600 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-med-gray-500 hover:text-med-blue-600 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link 
              to="/contact" 
              className="text-med-gray-500 hover:text-med-blue-600 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
            <a 
              href="#" 
              className="text-med-gray-500 hover:text-med-blue-600 transition-colors duration-200"
              aria-label="Privacy"
            >
              <Shield size={20} />
            </a>
            <a 
              href="#" 
              className="text-med-gray-500 hover:text-med-blue-600 transition-colors duration-200"
              aria-label="Support"
            >
              <Mail size={20} />
            </a>
            <a 
              href="#" 
              className="text-med-gray-500 hover:text-med-blue-600 transition-colors duration-200"
              aria-label="Donate"
            >
              <Heart size={20} />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center md:text-left text-sm text-med-gray-500">
          <p>&copy; {new Date().getFullYear()} MedCompanion. All rights reserved.</p>
          <p className="mt-1">Designed with privacy and security in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

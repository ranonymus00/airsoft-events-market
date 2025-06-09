import React from 'react'; // Footer component
import { Link } from 'react-router-dom';
import { Calendar, Facebook, Instagram, Twitter } from 'lucide-react';

/**
 * Footer component with branding, navigation, resources, and contact info.
 * Social links include aria-labels for accessibility.
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold">AirsoftHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop platform for airsoft events and gear trading. Connect with teams, 
              join events, and find the perfect equipment for your next game.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                {/* TODO: Replace '#' with actual resource links */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Airsoft Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  How to Create an Event
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Selling Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Community Rules
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                Email: contact@airsofthub.com
              </li>
              <li className="text-gray-400">
                Support Hours: Mon-Fri, 9am-5pm
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Report a Problem
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Suggestions
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AirsoftHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
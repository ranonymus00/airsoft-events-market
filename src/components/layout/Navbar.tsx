import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  ShoppingBag,
  Calendar,
  Home,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">AirsoftHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Events
            </Link>
            <Link
              to="/marketplace"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Marketplace
            </Link>

            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none">
                    <span>Dashboard</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-150">
                    <Link
                      to="/dashboard?tab=profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard?tab=events"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Events
                    </Link>
                    <Link
                      to="/dashboard?tab=marketplace"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/dashboard?tab=team"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Team
                    </Link>
                    <Link
                      to="/dashboard?tab=settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-1 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-3 pb-3">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 py-2"
              onClick={toggleMenu}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/events"
              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 py-2"
              onClick={toggleMenu}
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link
              to="/marketplace"
              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 py-2"
              onClick={toggleMenu}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Marketplace</span>
            </Link>

            {authState.isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 py-2"
                  onClick={toggleMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 py-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors duration-200 inline-block"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

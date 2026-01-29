import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scrollToSection } from '../../utils/helpers';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = ['Home', 'Courses', 'About', 'Why Us', 'Reviews', 'Contact'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleMenuClick = (item: string) => {
    const sectionId = item === 'Home' ? 'home' : item.toLowerCase().replace(' ', '-');
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => scrollToSection('home')}>
              <h1 className="text-2xl font-bold text-primary-600 transition-transform duration-300 hover:scale-105 cursor-pointer">
                AY Digital Institute
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => handleMenuClick(item)}
                className={`font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-800 hover:text-primary-600'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-secondary text-sm flex items-center gap-2 py-2 px-4">
                  <FaUser /> {user?.name?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="btn-primary text-sm flex items-center gap-2 py-2 px-4">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-6">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white absolute left-0 right-0 shadow-lg px-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleMenuClick(item)}
                  className="text-left text-gray-700 hover:text-primary-600 font-medium py-2"
                >
                  {item}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-secondary text-sm w-full flex items-center justify-center gap-2"
                    >
                      <FaUser /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn-primary text-sm w-full flex items-center justify-center gap-2"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-secondary text-sm w-full flex items-center justify-center gap-2"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-primary text-sm w-full flex items-center justify-center gap-2"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

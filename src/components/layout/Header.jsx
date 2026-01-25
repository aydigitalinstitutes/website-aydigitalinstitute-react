import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { scrollToSection } from '../../utils/helpers';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ['Home', 'Courses', 'About', 'Why Us', 'Reviews', 'Contact'];

  const handleMenuClick = (item) => {
    const sectionId = item === 'Home' ? 'home' : item.toLowerCase().replace(' ', '-');
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-600 transition-transform duration-300 hover:scale-105 cursor-pointer">
              AY Digital Institute
            </h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => handleMenuClick(item)}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="btn-secondary text-sm">Get Brochure</button>
            <button className="btn-primary text-sm">Enroll Now</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
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
                <button className="btn-secondary text-sm w-full">Get Brochure</button>
                <button className="btn-primary text-sm w-full">Enroll Now</button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

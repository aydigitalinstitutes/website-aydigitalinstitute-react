import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { scrollToSection } from '../../utils/helpers';

const Footer: React.FC = () => {
  const quickLinks = ['Courses', 'About', 'Why Us', 'Contact'];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">AY Digital Institute</h3>
            <p className="text-gray-400 max-w-sm">
              Empowering the next generation with practical digital skills. Join us to master web development, design, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection(link === 'Why Us' ? 'why-us' : link.toLowerCase())}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
               <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
               <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {currentYear} AY Digital Institute. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

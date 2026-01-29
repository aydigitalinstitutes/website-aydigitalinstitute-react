import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  // Update this phone number with your actual WhatsApp number (include country code, no + or spaces)
  const phoneNumber = '919876543210'; // Example placeholder
  const message = 'Hello! I am interested in learning more about your courses.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 transform hover:scale-110 group float scale-in delay-500"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={32} className="group-hover:scale-110 transition-transform duration-300" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        <span className="text-[10px]">1</span>
      </span>
    </a>
  );
};

export default WhatsAppButton;

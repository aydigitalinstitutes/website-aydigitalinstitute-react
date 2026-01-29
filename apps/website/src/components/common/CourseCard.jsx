import React from 'react';
import { motion } from 'framer-motion';
import {
  FaLaptop,
  FaFileExcel,
  FaCode,
  FaPalette,
  FaCalculator,
  FaShieldAlt,
  FaGraduationCap,
  FaCertificate,
  FaNetworkWired,
  FaDesktop,
  FaTerminal,
  FaCog,
  FaWifi,
  FaBullhorn,
  FaUniversity,
} from 'react-icons/fa';

// Icon component mapper
export const getIconComponent = (iconName, className = 'text-4xl text-primary-600') => {
  const icons = {
    FaLaptop: <FaLaptop className={className} />,
    FaFileExcel: <FaFileExcel className={className} />,
    FaCode: <FaCode className={className} />,
    FaPalette: <FaPalette className={className} />,
    FaCalculator: <FaCalculator className={className} />,
    FaShieldAlt: <FaShieldAlt className={className} />,
    FaGraduationCap: <FaGraduationCap className={className} />,
    FaCertificate: <FaCertificate className={className} />,
    FaNetworkWired: <FaNetworkWired className={className} />,
    FaDesktop: <FaDesktop className={className} />,
    FaTerminal: <FaTerminal className={className} />,
    FaCog: <FaCog className={className} />,
    FaWifi: <FaWifi className={className} />,
    FaBullhorn: <FaBullhorn className={className} />,
    FaUniversity: <FaUniversity className={className} />,
  };

  return icons[iconName] || <FaLaptop className={className} />;
};

// Course Card Component
export const CourseCard = ({ course, getIcon, index = 0 }) => {
  return (
    <motion.div
      className="bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        borderColor: '#3b82f6',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <motion.div
        className="flex justify-center mb-4"
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {getIcon(course.icon)}
      </motion.div>
      <div className="mb-2">
        <motion.span
          className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded inline-block"
          whileHover={{ scale: 1.05 }}
        >
          {course.category}
        </motion.span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
      <div className="flex gap-4 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <FaGraduationCap className="text-primary-500" />
          {course.level}
        </span>
        <span className="flex items-center gap-1">
          <FaCertificate className="text-primary-500" />
          {course.duration}
        </span>
      </div>
      <ul className="space-y-2 flex-grow">
        {course.topics.map((topic, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-2 text-gray-600"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-sm">{topic}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

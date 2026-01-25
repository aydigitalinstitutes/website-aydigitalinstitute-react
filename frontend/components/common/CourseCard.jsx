import React from 'react';
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
export const CourseCard = ({ course, getIcon }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col group">
      <div className="flex justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
        {getIcon(course.icon)}
      </div>
      <div className="mb-2">
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
          {course.category}
        </span>
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
        {course.topics.map((topic, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-600">
            <span className="text-primary-600 mt-1">•</span>
            <span className="text-sm">{topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

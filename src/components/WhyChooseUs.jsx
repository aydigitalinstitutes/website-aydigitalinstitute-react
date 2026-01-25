import React from 'react';
import {
  FaLaptopCode,
  FaBriefcase,
  FaClock,
  FaRupeeSign,
  FaQuestionCircle,
} from 'react-icons/fa';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <FaLaptopCode className="text-4xl text-primary-600" />,
      title: 'Practical Learning',
      description: 'Work on real tasks and projects',
    },
    {
      icon: <FaBriefcase className="text-4xl text-primary-600" />,
      title: 'Career Support',
      description: 'CV/Resume + interview guidance',
    },
    {
      icon: <FaClock className="text-4xl text-primary-600" />,
      title: 'Flexible Timing',
      description: 'Weekday & weekend batches',
    },
    {
      icon: <FaRupeeSign className="text-4xl text-primary-600" />,
      title: 'Affordable Fees',
      description: 'Value-focused courses',
    },
    {
      icon: <FaQuestionCircle className="text-4xl text-primary-600" />,
      title: 'Doubt Clearing',
      description: 'Extra support when needed',
    },
  ];

  return (
    <section id="why-us" className="bg-white py-20">
      <div className="section-container">
        <h2 className="section-title">Why Students Choose Us</h2>
        <p className="section-subtitle">
          We're committed to your success with practical training and personalized support.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl border-2 border-primary-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">{reason.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-center">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

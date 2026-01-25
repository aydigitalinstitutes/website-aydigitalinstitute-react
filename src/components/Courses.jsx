import React from 'react';
import { FaLaptop, FaFileExcel, FaCode, FaPalette, FaCalculator, FaShieldAlt } from 'react-icons/fa';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: 'Computer Basics',
      icon: <FaLaptop className="text-4xl text-primary-600" />,
      topics: ['Windows, files, internet, email', 'Typing practice', 'Basic troubleshooting'],
    },
    {
      id: 2,
      title: 'MS Office (Word / Excel / PowerPoint)',
      icon: <FaFileExcel className="text-4xl text-primary-600" />,
      topics: [
        'Word formatting, letters, CV',
        'Excel formulas, tables, charts',
        'PowerPoint presentations',
      ],
    },
    {
      id: 3,
      title: 'Web Development (HTML, CSS, JavaScript, React)',
      icon: <FaCode className="text-4xl text-primary-600" />,
      topics: [
        'Website building from scratch',
        'React projects',
        'Portfolio + hosting',
      ],
    },
    {
      id: 4,
      title: 'Graphic Design',
      icon: <FaPalette className="text-4xl text-primary-600" />,
      topics: [
        'Design principles',
        'Photoshop / Illustrator basics',
        'Social media posts & flyers',
      ],
    },
    {
      id: 5,
      title: 'Tally / Accounting Basics',
      icon: <FaCalculator className="text-4xl text-primary-600" />,
      topics: ['Billing, inventory, GST basics', 'Practical business entries'],
    },
    {
      id: 6,
      title: 'Cybersecurity Basics',
      icon: <FaShieldAlt className="text-4xl text-primary-600" />,
      topics: ['Online safety, passwords, phishing', 'Basic networking concepts'],
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="courses" className="bg-white py-20">
      <div className="section-container">
        <h2 className="section-title">Our Courses</h2>
        <p className="section-subtitle">
          Choose a course that matches your goal — basics to advanced.
        </p>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">{course.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {course.title}
              </h3>
              <ul className="space-y-2">
                {course.topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-sm">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-primary-50 rounded-xl p-8 border-2 border-primary-200">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Not sure which course to choose?</strong>
          </p>
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary"
          >
            Get Free Counseling
          </button>
        </div>
      </div>
    </section>
  );
};

export default Courses;

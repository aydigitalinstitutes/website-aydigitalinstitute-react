import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Hero = () => {
  const highlights = ['Practical Training', 'Beginner Friendly', 'Portfolio Projects'];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 md:py-28">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Computer & Digital Skills —{' '}
            <span className="text-primary-600">Become Job Ready</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AY Digital Institute is a computer training center that helps students and professionals
            learn practical skills with projects, guidance, and career support.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-primary-100"
              >
                <FaCheckCircle className="text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => scrollToSection('courses')}
              className="btn-primary text-lg px-8 py-4"
            >
              Explore Courses
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-secondary text-lg px-8 py-4"
            >
              Talk to Us / Call Now
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-primary-100">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600 font-medium">Students Trained</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-primary-100">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">Projects / Assignments</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-primary-100">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                ✓
              </div>
              <div className="text-gray-600 font-medium">Weekday & Weekend Batches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

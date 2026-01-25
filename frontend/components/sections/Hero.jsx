import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { heroHighlights, heroStats } from '../../data/content';
import { scrollToSection } from '../../utils/helpers';
import { Section, Container } from '../common/Section';

const Hero = () => {
  return (
    <Section id="home" className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 md:py-28">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight fade-in-down">
            Learn Computer & Digital Skills —{' '}
            <span className="text-primary-600">Become Job Ready</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed fade-in delay-200">
            AY Digital Institute is a computer training center that helps students and professionals
            learn practical skills with projects, guidance, and career support.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {heroHighlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-primary-100 hover:shadow-lg transition-all duration-300 transform hover:scale-110 fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <FaCheckCircle className="text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 fade-in delay-400">
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
            {heroStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 scale-in"
                style={{ animationDelay: `${(index + 1) * 0.2}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;

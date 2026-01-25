import React from 'react';
import {
  FaUserFriends,
  FaHandsHelping,
  FaUsers,
  FaCertificate,
} from 'react-icons/fa';
import { aboutFeaturesData } from '../../data/content';
import { Section, SectionTitle, Container } from '../common/Section';

const iconMap = {
  FaUserFriends: FaUserFriends,
  FaHandsHelping: FaHandsHelping,
  FaUsers: FaUsers,
  FaCertificate: FaCertificate,
};

const About = () => {
  return (
    <Section id="about" className="bg-gray-50 py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionTitle className="fade-in-down">About AY Digital Institute</SectionTitle>
          <p className="text-lg text-gray-700 mb-6 text-center leading-relaxed fade-in delay-200">
            AY Digital Institute provides practical computer education for students, job seekers, and
            working professionals. We focus on step-by-step learning, real assignments, and personal
            support so you can confidently use skills in real life or at work.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-primary-600 fade-in delay-300 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              NIELIT Certified Courses
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              We offer <strong>NIELIT (National Institute of Electronics & Information Technology)</strong> courses
              — a Government of India organisation under the Ministry of Electronics & Information Technology (MeitY).
              Our courses range from basic digital literacy (ACC, BCC, CCC) to advanced professional certifications
              (O/A/B/C Level) and short-term skill boost programs. All certifications are <strong>government-recognized
              and nationally valid</strong>, making them valuable for job applications and career advancement.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutFeaturesData.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 scale-in"
                  style={{ animationDelay: `${(index + 1) * 0.15}s` }}
                >
                  <div className="flex justify-center mb-4">
                    {IconComponent && <IconComponent className="text-3xl text-primary-600" />}
                  </div>
                  <p className="text-gray-700 font-medium">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default About;

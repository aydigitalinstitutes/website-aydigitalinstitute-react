import React from 'react';
import { coursesData } from '../../data/courses';
import { scrollToSection } from '../../utils/helpers';
import { Section, SectionTitle, SectionSubtitle, Container } from '../common/Section';
import { CourseCard, getIconComponent } from '../common/CourseCard';

const Courses = () => {
  return (
    <Section id="courses" className="bg-white py-20">
      <Container>
        <SectionTitle className="fade-in-down">Our Courses</SectionTitle>
        <SectionSubtitle className="fade-in delay-200">
          Choose from basic to advanced courses — NIELIT certified courses (ACC, BCC, CCC, O/A/B/C Level),
          professional diplomas (DCA, ADCA), and modern skill courses (Python, AI, IoT, Digital Marketing).
          Perfect for beginners, job seekers, and professionals. All NIELIT certifications are
          government-recognized and nationally valid.
        </SectionSubtitle>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {coursesData.map((course, index) => (
            <div
              key={course.id}
              className="scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard course={course} getIcon={getIconComponent} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-primary-50 rounded-xl p-8 border-2 border-primary-200">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Not sure which course to choose?</strong>
          </p>
          <button onClick={() => scrollToSection('contact')} className="btn-primary">
            Get Free Counseling
          </button>
        </div>
      </Container>
    </Section>
  );
};

export default Courses;

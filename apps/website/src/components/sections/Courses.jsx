import React, { useState, useEffect } from "react";
import { coursesData as defaultCoursesData } from "../../data/courses";
import { scrollToSection } from "../../utils/helpers";
import {
  Section,
  SectionTitle,
  SectionSubtitle,
  Container,
} from "../common/Section";
import { CourseCard, getIconComponent } from "../common/CourseCard";
import { SkeletonCard } from "../common/SkeletonLoader";
import api from "../../lib/axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState(
    "Choose from basic to advanced courses — NIELIT certified courses (ACC, BCC, CCC, O/A/B/C Level), professional diplomas (DCA, ADCA), and modern skill courses (Python, AI, IoT, Digital Marketing). Perfect for beginners, job seekers, and professionals. All NIELIT certifications are government-recognized and nationally valid.",
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [coursesRes, contentRes] = await Promise.all([
          api.get("/website-content/courses"),
          api.get("/website-content/items?section=courses_content"),
        ]);

        if (coursesRes.data && coursesRes.data.length > 0) {
          setCourses(coursesRes.data);
        } else {
          setCourses(defaultCoursesData);
        }

        if (contentRes.data && contentRes.data.length > 0) {
          const descItem = contentRes.data.find(
            (item) =>
              item.key === "courses_description" ||
              item.title === "Description",
          );
          if (descItem) {
            setDescription(descItem.subtitle || descItem.title);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
        setCourses(defaultCoursesData);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Section id="courses" className="bg-white py-20">
      <Container>
        <SectionTitle className="fade-in-down">Our Courses</SectionTitle>
        <SectionSubtitle className="fade-in delay-200">
          {description}
        </SectionSubtitle>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : courses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  getIcon={getIconComponent}
                  index={index}
                />
              ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-primary-50 rounded-xl p-8 border-2 border-primary-200">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Not sure which course to choose?</strong>
          </p>
          <button
            onClick={() => scrollToSection("contact")}
            className="btn-primary"
          >
            Get Free Counseling
          </button>
        </div>
      </Container>
    </Section>
  );
};

export default Courses;

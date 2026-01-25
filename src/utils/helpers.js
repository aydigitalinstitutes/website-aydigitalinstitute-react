// Utility functions
export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Get course list for dropdown
export const getCourseList = (courses) => {
  return courses.map((course) => course.title);
};

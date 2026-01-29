import React from 'react';

// Reusable Section Container Component
export const Section = React.forwardRef(({ id, className = '', children }, ref) => {
  return (
    <section id={id} className={className} ref={ref}>
      {children}
    </section>
  );
});

// Reusable Section Title Component
export const SectionTitle = React.forwardRef(({ children, className = '' }, ref) => {
  return <h2 ref={ref} className={`section-title ${className}`}>{children}</h2>;
});

// Reusable Section Subtitle Component
export const SectionSubtitle = React.forwardRef(({ children, className = '' }, ref) => {
  return <p ref={ref} className={`section-subtitle ${className}`}>{children}</p>;
});

// Reusable Container Component
export const Container = React.forwardRef(({ children, className = '' }, ref) => {
  return <div ref={ref} className={`section-container ${className}`}>{children}</div>;
});

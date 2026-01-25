import React from 'react';

// Reusable Section Container Component
export const Section = ({ id, className = '', children }) => {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
};

// Reusable Section Title Component
export const SectionTitle = ({ children, className = '' }) => {
  return <h2 className={`section-title ${className}`}>{children}</h2>;
};

// Reusable Section Subtitle Component
export const SectionSubtitle = ({ children, className = '' }) => {
  return <p className={`section-subtitle ${className}`}>{children}</p>;
};

// Reusable Container Component
export const Container = ({ children, className = '' }) => {
  return <div className={`section-container ${className}`}>{children}</div>;
};

import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Courses from '../components/sections/Courses';
import About from '../components/sections/About';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Reviews from '../components/sections/Reviews';
import Contact from '../components/sections/Contact';

const Home = () => {
  return (
    <main>
      <Hero />
      <Courses />
      <About />
      <WhyChooseUs />
      <Reviews />
      <Contact />
    </main>
  );
};

export default Home;

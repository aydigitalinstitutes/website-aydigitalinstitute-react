import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Courses from './components/sections/Courses';
import About from './components/sections/About';
import WhyChooseUs from './components/sections/WhyChooseUs';
import Reviews from './components/sections/Reviews';
import Contact from './components/sections/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import { useScrollAnimation } from './utils/useScrollAnimation';

function App() {
  useScrollAnimation();

  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Courses />
        <About />
        <WhyChooseUs />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;

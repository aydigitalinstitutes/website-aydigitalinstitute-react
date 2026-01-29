import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaCheckCircle } from 'react-icons/fa';
import { heroHighlights, heroStats } from '../../data/content';
import { scrollToSection } from '../../utils/helpers';
import { Section, Container } from '../common/Section';
import AnimatedButton from '../common/AnimatedButton';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const highlightsRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out',
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      // Highlights stagger animation
      gsap.from(highlightsRef.current?.children || [], {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.6,
        ease: 'back.out(1.7)',
      });

      // Buttons animation
      gsap.from(buttonsRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        delay: 1,
        ease: 'power3.out',
      });

      // Stats animation with scroll trigger
      gsap.from(statsRef.current?.children || [], {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        ease: 'back.out(1.7)',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="home" className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 md:py-28" ref={heroRef}>
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Learn Computer & Digital Skills —{' '}
            <motion.span
              className="text-primary-600 inline-block"
              animate={{
                backgroundPosition: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Become Job Ready
            </motion.span>
          </h1>

          {/* Sub-headline */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            AY Digital Institute is a computer training center that helps students and professionals
            learn practical skills with projects, guidance, and career support.
          </p>

          {/* Highlights */}
          <div ref={highlightsRef} className="flex flex-wrap justify-center gap-4 mb-10">
            {heroHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-primary-100"
                whileHover={{ scale: 1.1, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <FaCheckCircle className="text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{highlight}</span>
              </motion.div>
            ))}
          </div>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <AnimatedButton
              onClick={() => scrollToSection('courses')}
              variant="primary"
              className="text-lg px-8 py-4"
            >
              Explore Courses
            </AnimatedButton>
            <AnimatedButton
              onClick={() => scrollToSection('contact')}
              variant="secondary"
              className="text-lg px-8 py-4"
            >
              Talk to Us / Call Now
            </AnimatedButton>
          </div>

          {/* Quick Stats */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {heroStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-primary-100"
                whileHover={{ y: -10, scale: 1.05, boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-primary-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 200,
                    damping: 10,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;

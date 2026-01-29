import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../utils/animations';

const AnimatedPage = React.forwardRef(({ children, className = '' }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default AnimatedPage;

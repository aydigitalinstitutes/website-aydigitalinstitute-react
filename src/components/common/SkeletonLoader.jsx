import { motion } from 'framer-motion';

const SkeletonLoader = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
        >
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
                'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="h-full w-full rounded-lg"
          />
        </motion.div>
      ))}
    </>
  );
};

export const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-primary-100">
    <SkeletonLoader className="h-48 mb-4" />
    <SkeletonLoader className="h-6 mb-2 w-3/4" />
    <SkeletonLoader className="h-4 w-1/2" />
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader
        key={index}
        className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export default SkeletonLoader;

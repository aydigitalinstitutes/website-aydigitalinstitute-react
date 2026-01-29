import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../../lib/zod-schemas';
import AnimatedButton from '../common/AnimatedButton';
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from '../../utils/animations';
import api from '../../lib/axios';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/auth/login', data);
      
      if (response.data.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect everyone to the portal
          window.location.href = 'http://localhost:5174';
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.response?.data?.message || 'Login failed. Please try again.';
      setError('root', { message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div
          className="bg-white p-8 rounded-xl shadow-xl border border-primary-100"
          variants={scaleIn}
          whileHover={{ scale: 1.01, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.div className="text-center mb-8" variants={staggerItem}>
            <motion.div 
              className="flex justify-center mb-4"
              variants={fadeInUp}
            >
              <div className="bg-primary-100 p-4 rounded-full">
                <FaUserCircle className="text-4xl text-primary-600" />
              </div>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-gray-900"
              variants={fadeInUp}
            >
              Welcome Back
            </motion.h2>
            <motion.p
              className="mt-2 text-gray-600"
              variants={fadeInUp}
            >
              Sign in to your account
            </motion.p>
          </motion.div>

          <AnimatePresence>
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <span>{errors.root.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-6" variants={staggerContainer}>
            <motion.div variants={staggerItem}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <motion.input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg outline-none transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  }`}
                  placeholder="Enter your email"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={staggerItem}>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <motion.input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg outline-none transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  }`}
                  placeholder="Enter your password"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={staggerItem}>
              <AnimatedButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full py-3 text-lg font-semibold shadow-md hover:shadow-lg"
              >
                Sign In
              </AnimatedButton>
            </motion.div>
          </motion.form>

          <motion.div className="mt-8 text-center" variants={staggerItem}>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { adminLoginSchema, type AdminLoginFormData } from '../../lib/zod-schemas';
import { useAuth } from '../../context/AuthContext';
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from '../../utils/animations';

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

const AdminLoginForm = ({ onSuccess }: AdminLoginFormProps) => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    const result = await login(data.email, data.password);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect if success
        window.location.href = '/dashboard';
      }
    } else {
      setError('root', { message: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <FaShieldAlt className="text-3xl text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure access for administrators only
          </p>
        </motion.div>

        <motion.form
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg border border-red-100"
          onSubmit={handleSubmit(onSubmit)}
          variants={staggerContainer}
        >
          <div className="space-y-4">
            <motion.div variants={staggerItem}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter admin email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={staggerItem}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </motion.div>
          </div>

          {errors.root && (
            <motion.div
              variants={scaleIn}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {errors.root.message}
            </motion.div>
          )}

          <motion.div variants={staggerItem}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <FaShieldAlt />
                  Access Admin Panel
                </>
              )}
            </button>
          </motion.div>

          <motion.div variants={staggerItem} className="text-center">
            <p className="text-sm text-gray-600">
              Restricted access. Unauthorized access is prohibited.
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdminLoginForm;
import { useNavigate } from 'react-router-dom';
import { FaUser, FaGraduationCap, FaBookOpen, FaCertificate } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../utils/animations';
import { useAuth } from '../../context/AuthContext';

const StudentOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            variants={staggerItem}
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FaUser className="opacity-80" /> Personal Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{user.role === 'USER' || user.role === 'STUDENT' ? 'Not provided' : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Course Progress / Interest */}
          <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            variants={staggerItem}
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FaGraduationCap className="opacity-80" /> Academic Journey
              </h2>
            </div>
            <div className="p-6">
              {/* Mock data for now, as user model might not have courseInterested yet in admin context */}
              <div className="text-center py-8">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBookOpen className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">No Active Courses</h3>
                <p className="text-gray-500 text-sm mb-6">Explore our catalog to find your next skill.</p>
                <button
                  onClick={() => navigate('/courses')} // This route needs to exist in admin or redirect to website?
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Browse Courses →
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-8">
          <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            variants={staggerItem}
          >
            <h3 className="font-bold text-gray-900 mb-4">Next Steps</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Account Created</p>
                  <p className="text-xs text-gray-500">You're all set up!</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary-100 p-1.5 rounded-full mt-0.5">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Enroll in a Course</p>
                  <p className="text-xs text-gray-500">Choose your learning path</p>
                </div>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <div className="bg-gray-100 p-1.5 rounded-full mt-0.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Start Learning</p>
                  <p className="text-xs text-gray-500">Access course materials</p>
                </div>
              </li>
            </ul>
            
            <button
              onClick={() => navigate('/courses')}
              className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Courses
            </button>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white"
            variants={staggerItem}
          >
            <FaCertificate className="text-3xl text-yellow-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Get Certified</h3>
            <p className="text-gray-300 text-sm mb-4">
              Complete courses to earn industry-recognized certificates for your portfolio.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentOverview;

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaGraduationCap, FaSignOutAlt, FaBookOpen, FaCertificate } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Header Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100"
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <FaUser className="text-2xl text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">Student Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </motion.div>

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
                    <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
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
                {user.courseInterested ? (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <FaBookOpen className="text-2xl text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{user.courseInterested}</h3>
                        <p className="text-purple-700 text-sm mb-4">Current Interest</p>
                        <div className="w-full bg-purple-200 rounded-full h-2.5 mb-2">
                          <div className="bg-purple-600 h-2.5 rounded-full w-[10%]"></div>
                        </div>
                        <p className="text-xs text-gray-500">Registration Complete • Awaiting Enrollment</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBookOpen className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-2">No Active Courses</h3>
                    <p className="text-gray-500 text-sm mb-6">Explore our catalog to find your next skill.</p>
                    <button
                      onClick={() => navigate('/courses')}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Browse Courses →
                    </button>
                  </div>
                )}
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
    </div>
  );
};

export default Dashboard;

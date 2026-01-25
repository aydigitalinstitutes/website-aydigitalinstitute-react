import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
              <div className="flex items-center gap-3 mb-3">
                <FaUser className="text-2xl text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
              </div>
            </div>

            {user.courseInterested && (
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
                <div className="flex items-center gap-3 mb-3">
                  <FaGraduationCap className="text-2xl text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Course Interest</h3>
                </div>
                <p className="text-gray-700">{user.courseInterested}</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome to AY Digital Institute!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for registering with us. You can now explore our courses and enroll in the program that
              interests you.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary"
            >
              Explore Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

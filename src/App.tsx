import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { useScrollAnimation } from './utils/useScrollAnimation';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/common/BackToTop';

// Page Components
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
// import AdminLogin from './components/auth/AdminLogin';
import Dashboard from './components/auth/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AnimatedPage from './components/common/AnimatedPage';

function AppContent() {
  useScrollAnimation();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="App font-sans text-gray-900">
      {!isAuthPage && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />
          <Route
            path="/login"
            element={
              <AnimatedPage>
                <Login />
              </AnimatedPage>
            }
          />
          <Route
            path="/register"
            element={
              <AnimatedPage>
                <Register />
              </AnimatedPage>
            }
          />
          {/* Removed separate admin-login route, using single login page */}
          <Route
            path="/dashboard"
            element={
              <AnimatedPage>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </AnimatedPage>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {!isAuthPage && <Footer />}
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

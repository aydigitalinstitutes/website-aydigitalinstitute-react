import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const Register = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return <RegisterForm onSuccess={handleSuccess} />;
};

export default Register;

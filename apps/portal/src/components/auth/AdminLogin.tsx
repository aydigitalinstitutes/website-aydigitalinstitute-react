import { useNavigate } from 'react-router-dom';
import AdminLoginForm from './AdminLoginForm';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return <AdminLoginForm onSuccess={handleSuccess} />;
};

export default AdminLogin;

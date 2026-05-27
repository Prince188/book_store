import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;

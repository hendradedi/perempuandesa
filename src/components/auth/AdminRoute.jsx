import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, canAccessAdminPanel }) => {
  if (!canAccessAdminPanel) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

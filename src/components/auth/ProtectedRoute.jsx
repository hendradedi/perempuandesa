import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, loading }) => {
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-slate-600 text-sm sm:text-base">Memuat data akun...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
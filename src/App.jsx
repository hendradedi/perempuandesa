import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

const LandingPage = lazy(() => import('./components/layout/LandingPage'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const ModuleDetail = lazy(() => import('./components/modules/ModuleDetail'));
const Quiz = lazy(() => import('./components/quiz/Quiz'));
const Profile = lazy(() => import('./components/profile/Profile'));

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center px-4">
    <p className="text-slate-600 text-sm sm:text-base">Memuat halaman...</p>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    canAccessAdminPanel,
    isSuperAdmin,
    loading
  } = useAuth();

  const PublicLayout = () => (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        canAccessAdminPanel={canAccessAdminPanel}
        onLogout={logout}
        user={user}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );

  const DashboardLayout = () => (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onRegister={register} />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                  <AdminRoute canAccessAdminPanel={canAccessAdminPanel}>
                    <AdminPanel isSuperAdmin={isSuperAdmin} />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/module/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                  <ModuleDetail user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:moduleId"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                  <Quiz user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                  <Profile user={user} />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard user={user} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
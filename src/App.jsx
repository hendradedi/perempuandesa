import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './components/layout/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ModuleDetail from './components/modules/ModuleDetail';
import Quiz from './components/quiz/Quiz';
import Profile from './components/profile/Profile';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppContent() {
  const { user, login, register, logout, isAuthenticated, loading } = useAuth();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onRegister={register} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                  <Dashboard user={user} />
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
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
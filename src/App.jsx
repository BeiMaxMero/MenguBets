import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate  } from 'react-router-dom';
import { LoadingSpinner } from './components/core/LoadingSpinner';
import { useAuth } from './context/AuthContext';

// Pages
import { Login } from './pages/auth/Login';
import { AuthCallback } from './pages/auth/Callback';
import { DashboardIndex } from './pages/dashboard/index';
import { ServerDashboard } from './pages/dashboard/[serverId]';
import { AdminPanel } from './pages/admin/index';
import { ServerPage } from './pages/ServerPage';

// Provider
import { AuthProvider } from './context/AuthContext';

// Core Components
import { Header } from './components/core/Header';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : null;
};

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-black-ebano">
    <Header />
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/callback" element={<AuthCallback />} />

          {/* Rutas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                    <DashboardIndex />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route path="/server/:serverId" element={
            <PrivateRoute>
              <AppLayout>
                <ServerPage />
              </AppLayout>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
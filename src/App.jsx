import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate  } from 'react-router-dom';
import { LoadingSpinner } from './components/core/LoadingSpinner';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';

// Pages
import { Login } from './pages/auth/Login';
import { AuthCallback } from './pages/auth/Callback';
import { DashboardIndex } from './pages/dashboard/index';
import { ServerDashboard } from './pages/dashboard/[serverId]';
import { AdminPanel } from './pages/admin/index';
import { ServerPage } from './pages/ServerPage';
import { ServerAdminPanel } from './pages/server/ServerAdminPanel';
import { NotFound } from './pages/NotFound';
import { ServerLayout } from './pages/server/layout/ServerLayout';

// Provider
import { AuthProvider } from './context/AuthContext';

// Core Components
import { Header } from './components/core/Header';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
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
          <Route 
            path="/login" 
            element={
              <Login />
            } 
          />
          <Route 
            path="/login/callback" 
            element={
              <AuthCallback />
            } 
          />

          {/* Rutas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardIndex />
              </PrivateRoute>
            }
          />

          {/* Rutas de servidor */}
          <Route
            path="/server/:serverId"
            element={
              <PrivateRoute>
                <ServerLayout />  {/* Cambiado de ServerPage a ServerLayout */}
              </PrivateRoute>
            }
          />

          {/* Rutas de administración de servidor */}
          <Route
            path="/server/:serverId/admin"
            element={
              <PrivateRoute>
                <ServerAdminPanel />
              </PrivateRoute>
            }
          />

          {/* Ruta 404 */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                <NotFound />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
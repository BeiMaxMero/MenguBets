// src/App.jsx con useEffect importado correctamente
import React, { useEffect } from 'react'; // Añadido useEffect aquí
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './components/core/LoadingSpinner';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/core/ErrorBoundary';
import { NotificationsManager } from './components/core/NotificationsManager';
import { AppStoreProvider } from './context/AppStore';
import { BetProvider } from './context/BetContext'; 

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
import { BetSearch } from './pages/BetSearch';
import { UserProfile } from './components/features/user/UserProfile';

// Provider
import { AuthProvider } from './context/AuthContext';

// Core Components
import { Header } from './components/core/Header';
import { LoadingState } from './components/core/LoadingState';

// Componente para rutas privadas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <LoadingState 
          isLoading={true} 
          loadingMessage="Verificando sesión..."
        />
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Componente para rutas públicas (accesibles solo sin sesión)
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-deep flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return children;
  }

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppStoreProvider>
          <BetProvider>
            <BrowserRouter>
              <Routes>
                {/* Rutas públicas */}
                <Route 
                  path="/login" 
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
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

                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/search"
                  element={
                    <PrivateRoute>
                      <BetSearch />
                    </PrivateRoute>
                  }
                />

                {/* Rutas de servidor */}
                <Route
                  path="/server/:serverId"
                  element={
                    <PrivateRoute>
                      <ServerLayout />
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
                
                {/* Panel de Administración General (solo para admins globales) */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminPanel />
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
              
              {/* Gestor de notificaciones global */}
              <NotificationsManager />
            </BrowserRouter>
          </BetProvider>
        </AppStoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
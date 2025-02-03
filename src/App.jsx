import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { DashboardIndex } from './pages/dashboard/index';
import { ServerDashboard } from './pages/dashboard/[serverId]';
import { AdminPanel } from './pages/admin/index';
import { ServerPage } from './pages/ServerPage';

// Provider
import { AuthProvider } from './context/AuthContext';

// Core Components
import { Header } from './components/core/Header';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
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
          <Route path="/register" element={<Register />} />

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
          <Route
            path="/server/:serverId"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ServerDashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AppLayout>
                  <AdminPanel />
                </AppLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
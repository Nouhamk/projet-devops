import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import UserReservations from './pages/dashboard/UserReservations';
import LockerSelection from './pages/lockers/LockerSelection';
import NotFound from './pages/NotFound';
import PricingPage from './pages/PricingPage';

// Layout d'administration
import AdminLayout from './layouts/AdminLayout';
// Pages d'administration
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminLockers from './pages/admin/AdminLockers';
import authService from './services/AuthService';
import AdminReservations from './pages/admin/AdminReservations';
import AdminUsers from './pages/admin/AdminUsers';

const App: React.FC = () => {
  // États pour l'authentification
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Vérifier l'authentification au chargement du composant
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await authService.isLoggedIn();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          setIsAdmin(await authService.isAdmin());
        }
        console.log('Authentification vérifiée:', loggedIn ? 'Connecté' : 'Déconnecté');
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!isLoggedIn ? <Login />: <Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/lockers" element={<LockerSelection />} />
        <Route path="/tarifs" element={<PricingPage />} />
        
        {/* Routes protégées utilisateur */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/reservations" element={isLoggedIn ? <UserReservations /> : <Navigate to="/login" />} />
        
        {/* Routes d'administration protégées */}
        <Route
          path="/admin"
          element={isLoggedIn && isAdmin ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="lockers" element={<AdminLockers />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        
        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
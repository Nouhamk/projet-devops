// src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Vérifier quelle page est active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    // Ici, vous implémenteriez la logique de déconnexion
    console.log('Déconnexion...');
    navigate('/login');
  };

  // Basculer le menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête d'administration */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-blue-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">
              <Link to="/admin">
                <span className="text-blue-600">TrapUr</span>
                <span className="text-gray-800">Crap</span>
                <span className="ml-2 text-sm font-medium text-gray-500">Administration</span>
              </Link>
            </h1>
          </div>
          
          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
          
          {/* Menu utilisateur (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center">
                <span className="inline-block h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <svg className="h-full w-full text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
            <Link 
              to="/" 
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Retour au site
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
        
        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-3 px-4">
              <div className="flex items-center mb-4">
                <span className="inline-block h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <svg className="h-full w-full text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
              </div>
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/admin/dashboard" 
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                <Link 
                  to="/admin/lockers" 
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gestion des casiers
                </Link>
                <Link 
                  to="/admin/reservations" 
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Réservations
                </Link>
                <Link 
                  to="/admin/users" 
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Utilisateurs
                </Link>
                
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Retour au site
                  </Link>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-blue-600"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Barre latérale d'administration (desktop) */}
        <aside className="hidden md:block w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-5 px-2">
            <Link
              to="/admin/dashboard"
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/admin/dashboard')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg 
                className={`mr-3 h-5 w-5 ${isActive('/admin/dashboard') ? 'text-blue-600' : 'text-gray-500'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Tableau de bord
            </Link>
            <Link
              to="/admin/lockers"
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/admin/lockers')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg 
                className={`mr-3 h-5 w-5 ${isActive('/admin/lockers') ? 'text-blue-600' : 'text-gray-500'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Gestion des casiers
            </Link>
            <Link
              to="/admin/reservations"
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/admin/reservations')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg 
                className={`mr-3 h-5 w-5 ${isActive('/admin/reservations') ? 'text-blue-600' : 'text-gray-500'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Réservations
            </Link>
            <Link
              to="/admin/users"
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/admin/users')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg 
                className={`mr-3 h-5 w-5 ${isActive('/admin/users') ? 'text-blue-600' : 'text-gray-500'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Utilisateurs
            </Link>
            
          </nav>
          
          {/* Footer du menu latéral */}
          <div className="mt-10 px-4 py-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p className="mb-1">Version 1.0</p>
              <p>© 2025 TrapUrCrap</p>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 bg-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
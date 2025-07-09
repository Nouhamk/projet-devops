import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/AuthService';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600">TrapUr</span>
              <span className="text-gray-800">Crap</span>
            </Link>
          </h1>
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Accueil</Link>
          <Link to="/lockers" className="text-gray-600 hover:text-blue-600">Nos Casiers</Link>
          <Link to="/tarifs" className="text-gray-600 hover:text-blue-600">Nos Tarifs</Link>
        </nav>

        {
          isLoggedIn ?
          <div className="flex space-x-4">
            <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:text-blue-600">
              Tableau de bord
            </Link>
            <button
              onClick={() => {
                authService.logout();
                window.location.href = '/login'; // Rediriger vers la page de connexion
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
          :
          <div className="flex space-x-4">
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">
              Connexion
            </Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Inscription
            </Link>
          </div>
        }
      </div>
    </header>
  );
};

export default Navbar;
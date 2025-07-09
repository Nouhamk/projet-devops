import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">TrapUrCrap</h3>
            <p className="text-gray-600 text-sm">
              La solution simple et sécurisée pour réserver vos casiers en ligne.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">Accueil</Link></li>
              <li><Link to="/lockers" className="text-gray-600 hover:text-blue-600 text-sm">Nos casiers</Link></li>
              <li><Link to="/tarifs" className="text-gray-600 hover:text-blue-600 text-sm">Nos Tarifs</Link></li>
              <li><Link to="/aide" className="text-gray-600 hover:text-blue-600 text-sm">Aide</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><Link to="/conditions" className="text-gray-600 hover:text-blue-600 text-sm">Conditions d'utilisation</Link></li>
              <li><Link to="/confidentialite" className="text-gray-600 hover:text-blue-600 text-sm">Politique de confidentialité</Link></li>
              <li><Link to="/cgv" className="text-gray-600 hover:text-blue-600 text-sm">CGV</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">contact@trapurcrap.example</li>
              <li className="text-gray-600 text-sm">+33 1 23 45 67 89</li>
              <li className="text-gray-600 text-sm">123 Avenue des Casiers<br />69008 Lyon, France</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} TrapUrCrap. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// src/pages/lockers/LockerSelection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReservationModal from '../../components/modals/ReservationModal';
import Footer from '../../components/shared/Footer';
import Navbar from '../../components/shared/Navbar';
import authService from '../../services/AuthService';
import { Locker } from '../../types/Locker';
import api from '../../services/api';

const LockerSelection: React.FC = (): JSX.Element => {
  // État pour les casiers
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour les filtres
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Statistiques
  const [availableCount, setAvailableCount] = useState<number>(0);
  
  // État pour le modal de réservation
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Récupération des casiers (simulée)
  useEffect(() => {
    const fetchLockers = async () => {
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 800));

        const lockersData: Locker[] = await api.get('/casier');

        setLockers(lockersData);
        setAvailableCount(lockersData.filter(locker => locker.status === 'available').length);
        setLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        console.error('Erreur lors du chargement des casiers:', err);
        setError(`Erreur lors du chargement des casiers: ${errorMessage}`);
        setLoading(false);
      }
    };
    
    fetchLockers();
  }, []);

  // Filtrer les casiers
  const filteredLockers = lockers.filter(locker => {
    const matchesSize = sizeFilter === 'all' || locker.taille === sizeFilter;
    const matchesSearch = locker.numero.toString().includes(searchQuery.toLowerCase());
    return matchesSize && matchesSearch;
  });

  // Obtenir la couleur de fond en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-blue-500';
      case 'reserved':
        return 'bg-teal-500';
      case 'occupied':
        return 'bg-gray-900';
      case 'maintenance':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  // État pour le statut de connexion
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loginStatus = await authService.isLoggedIn();
        setIsLoggedIn(loginStatus);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, []);
  
  // Gérer la sélection d'un casier
  const handleLockerSelect = (locker: Locker) => {
    if (!isLoggedIn) {
      alert('Veuillez vous connecter pour réserver un casier');
      return;
    }
    if (locker.status !== 'available') return;
    
    setSelectedLocker(locker);
    setShowModal(true);
  };
  
  // Gérer la confirmation de réservation
  const handleReservationConfirm = async (duration: number, price: number) => {
    // Ici vous intégreriez l'appel à votre API pour effectuer la réservation
    console.log('Réservation confirmée:', {
      casierId: selectedLocker?._id,
      dureeHeures: duration
    });

    try {
      await api.post('/reservation/reserver', {
        casierId: selectedLocker?._id,
        dureeHeures: duration
      });
      alert(`Casier ${selectedLocker?.numero} réservé pour ${duration} heures.`);
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert(`Erreur lors de la réservation du casier ${selectedLocker?.numero}.`);
      return;
    }

    // Mettre à jour la liste des casiers pour marquer celui-ci comme réservé
    const updatedLockers = lockers.map(locker =>
      locker._id === selectedLocker?._id
        ? { ...locker, status: 'reserved' as 'reserved' }
        : locker
    );
    
    setLockers(updatedLockers);
    setAvailableCount(prev => prev - 1);
    
    // Fermer le modal
    setShowModal(false);
    setSelectedLocker(null);
  };

  // Ajouter la fonction manquante handleCloseModal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLocker(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nos casiers</h1>
          <p className="mt-1 text-gray-600">Sélectionnez un casier disponible pour le réserver</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Filtrage par taille */}
          <div>
            <label htmlFor="size-filter" className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
            <select
              id="size-filter"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les tailles</option>
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>
          </div>

          {/* Recherche par numéro */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Recherche par numéro</label>
            <input
              type="text"
              id="search"
              placeholder="Numéro de casier"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Compteur de casiers disponibles */}
          <div className="flex items-end">
            {isLoggedIn ? (
              <span className="text-gray-700 font-medium">{availableCount} casiers disponibles</span>
            ) : (
              <span className="text-gray-700 font-medium">Connectez-vous pour voir les casiers disponibles</span>
            )}
          </div>
        </div>

        {/* Message pour se connecter */}
        {!isLoggedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
            <p className="text-blue-700">Pour réserver un casier, vous devez être connecté.</p>
            <div className="mt-2 flex">
              <Link to="/login" className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                Se connecter
              </Link>
              <span className="inline-flex items-center text-gray-500">ou</span>
              <Link to="/register" className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                S'inscrire
              </Link>
            </div>
          </div>
        )}

        {/* Grille de casiers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
          {filteredLockers.map((locker) => (
            <div key={locker._id} className="relative">
              <button
                onClick={() => handleLockerSelect(locker)}
                className={`w-full aspect-square ${getStatusColor(locker.status)} rounded-xl flex items-center justify-center text-white text-2xl font-bold hover:opacity-90 transition-opacity shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all ${locker.status !== 'available' ? 'cursor-not-allowed opacity-80' : ''}`}
                disabled={locker.status !== 'available' || !isLoggedIn}
              >
                {locker.numero}
              </button>
              <div className="text-center mt-2 text-sm text-gray-600 capitalize">
                {locker.taille === 'small' ? 'Petit' : locker.taille === 'medium' ? 'Moyen' : 'Grand'}
              </div>
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 mb-12">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-teal-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Réservé</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-900 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Occupé</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">En maintenance</span>
          </div>
        </div>

        {/* Grille tarifaire */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Grille tarifaire</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Petit casier */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Casier Petit</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">5€ <span className="text-lg font-normal text-gray-500">/ heure</span></div>
              <p className="text-gray-600">Idéal pour les petits objets personnels</p>
            </div>
            
            {/* Casier moyen */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Casier Moyen</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">10€ <span className="text-lg font-normal text-gray-500">/ heure</span></div>
              <p className="text-gray-600">Parfait pour les sacs et vêtements</p>
            </div>
            
            {/* Grand casier */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Casier Grand</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">15€ <span className="text-lg font-normal text-gray-500">/ heure</span></div>
              <p className="text-gray-600">Pour les valises et objets volumineux</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal de réservation */}
      {showModal && (
        <ReservationModal
          locker={selectedLocker}
          onClose={handleCloseModal}
          onConfirm={handleReservationConfirm}
        />
      )}
    </div>
  );
};

export default LockerSelection;
// src/pages/dashboard/UserReservations.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reservation } from '../../types/Reservation';

const UserReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération des réservations (simulée)
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // TODO : replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setReservations([]);
        setLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error 
          ? `Erreur lors du chargement des réservations: ${err.message}`
          : 'Erreur lors du chargement des réservations';
        
        console.error('Erreur de chargement des réservations:', err);
        setError(errorMessage);
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, []);

  // Calculer le temps restant avant expiration
  const calculateTimeRemaining = (endDate: string): string => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    
    if (now > end) return 'Expiré';
    
    const diffMs = end - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // Formater la date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Aucune réservation active</h3>
          <p className="mt-2 text-gray-600">Vous n'avez pas encore de réservation de casier.</p>
          <div className="mt-6">
            <Link 
              to="/lockers" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Réserver un casier
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mes réservations</h2>
        <Link 
          to="/lockers" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Nouvelle réservation
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <li key={reservation._id}>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                  <div className="sm:flex sm:items-center">
                    <div className="sm:flex-shrink-0">
                      <div className={`h-12 w-12 rounded-md flex items-center justify-center ${
                        reservation.statut === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : reservation.statut === 'expired' 
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        <span className="text-lg font-bold">{reservation.casierId.numero}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Casier {reservation.casierId.numero}
                      </h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Du {formatDate(reservation.dateDebut.toTimeString())}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Au {formatDate(reservation.dateExpiration.toTimeString())}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col items-end">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium 
                      ${reservation.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : reservation.status === 'expired' 
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }">
                      {reservation.statut === 'active' ? 'Active' : reservation.statut === 'expired' ? 'Expirée' : 'Annulée'}
                    </span>
                    {reservation.statut === 'active' && (
                      <span className="mt-2 text-sm text-gray-500">
                        Temps restant: {calculateTimeRemaining(reservation.dateExpiration.toTimeString())}
                      </span>
                    )}
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      {reservation.prixTotal}€
                    </span>
                  </div>
                </div>

                {reservation.statut === 'active' && (
                  <div className="mt-4 sm:mt-6 flex justify-end space-x-3">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Prolonger
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserReservations;
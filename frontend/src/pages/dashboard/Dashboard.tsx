// src/pages/dashboard/Dashboard.tsx
import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { User } from '../../types/User';
import { Reservation } from '../../types/Reservation';
import authService from '../../services/AuthService';
import api from '../../services/api';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User>();

  const [reservations, setReservations] = useState<Reservation[]>([]);

  // États pour les onglets
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Calculer les statistiques
  const activeReservations = reservations.filter(res => res.statut === 'active').length;
  const pastReservations = reservations.filter(res => res.statut === 'expired').length;
  const totalSpent = reservations.reduce((sum, res) => sum + res.prixTotal, 0);

  const reservationHandledRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const lockerId = params.get('lockerId');
    const dureeHeures = Number(params.get('duree')) || 2;

    if (sessionId && lockerId && !reservationHandledRef.current) {
      reservationHandledRef.current = true;

      api.post('/reservation/reserver', {
        casierId: lockerId,
        dureeHeures
      })
          .then(response => {
            console.log('Réservation confirmée :', response.data);

            // Nettoyage des paramètres d'URL
            const cleanedUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanedUrl);
          })
          .catch(error => {
            console.error('Erreur validation réservation :', error);
          });
    }

    const fetchUserData = async () => {
      const fetchedUser: User = await authService.getUser();
      if (!fetchedUser) {
        authService.logout();
        return;
      }
      setUser(fetchedUser);

      let fetchedReservations: Reservation[];
      try {
        fetchedReservations = await api.get(`/reservation/user/${fetchedUser._id}`);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        fetchedReservations = [];
      }
      setReservations(fetchedReservations);
    };

    fetchUserData();
  }, []);


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* En-tête de la page */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-gray-500">Bienvenue, {user?.name}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Réservations actives */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm font-medium text-gray-500">Réservations actives</div>
              <div className="mt-1 text-3xl font-semibold text-blue-600">{activeReservations}</div>
            </div>
          </div>

          {/* Réservations passées */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm font-medium text-gray-500">Réservations passées</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{pastReservations}</div>
            </div>
          </div>

          {/* Dépenses totales */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm font-medium text-gray-500">Dépenses totales</div>
              <div className="mt-1 text-3xl font-semibold text-green-600">{totalSpent}€</div>
            </div>
          </div>
        </div>

        {/* Bouton de réservation */}
        <div className="flex justify-end mb-6">
          <Link 
            to="/lockers" 
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réserver un casier
          </Link>
        </div>

        {/* Liste des réservations avec onglets */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Réservations actives
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Historique
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'active' && (
              <>
                {activeReservations > 0 ? (
                  <div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Casier
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de début
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date d'expiration
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prix
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.filter(res => res.statut === 'active').map((reservation) => (
                          <tr key={reservation._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{reservation.casierId?.numero}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(reservation.dateDebut).toLocaleDateString()} - {new Date(reservation.dateDebut).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false,
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(reservation.dateExpiration).toLocaleDateString()} - {new Date(reservation.dateExpiration).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false,
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Actif
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {reservation.prixTotal}€
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                      <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune réservation</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Vous n'avez pas encore de réservations actives.
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'history' && (
              <>
                {pastReservations > 0 ? (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Casier
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de début
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de fin
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prix
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.filter(res => res.statut === 'expired').map((reservation) => (
                          <tr key={reservation._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{reservation.casierId?.numero}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(reservation.dateDebut).toLocaleDateString()} - {new Date(reservation.dateDebut).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false,
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(reservation.dateExpiration).toLocaleDateString()} - {new Date(reservation.dateExpiration).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false,
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Terminée
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {reservation.prixTotal}€
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                      <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun historique</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Vous n'avez pas encore d'historique de réservations.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
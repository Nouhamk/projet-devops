import React, { useState, useEffect } from 'react';
import { User } from '../../types/User';
import authService from '../../services/AuthService';
import api from '../../services/api';

// Types
interface DashboardStats {
  totalLockers: number;
  availableLockers: number;
  reservedLockers: number;
  maintenanceLockers: number;
  activeReservations: number;
  totalUsers: number;
  revenueToday: number;
  revenueThisMonth: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLockers: 0,
    availableLockers: 0,
    reservedLockers: 0,
    maintenanceLockers: 0,
    activeReservations: 0,
    totalUsers: 0,
    revenueToday: 0,
    revenueThisMonth: 0
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User>();
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUser: User = await authService.getUser();
        if (!fetchedUser) {
          authService.logout();
          return;
        }
        setUser(fetchedUser);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        authService.logout();
      }
    };

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Récupération des statistiques admin...');
        
        // Récupérer toutes les données en parallèle
        const [casiers, reservations, userCountData] = await Promise.all([
          api.get('/casier'),
          api.get('/reservation/all'),
          api.get('/auth/count')
        ]);

        console.log('📦 Casiers récupérés:', casiers);
        console.log('📋 Réservations récupérées:', reservations);
        console.log('👥 Données utilisateurs récupérées:', userCountData);
        
        // Calculer les statistiques depuis les vraies données
        const totalLockers = Array.isArray(casiers) ? casiers.length : 0;
        const availableLockers = Array.isArray(casiers) ? casiers.filter((c: any) => c.status === 'available').length : 0;
        const reservedLockers = Array.isArray(casiers) ? casiers.filter((c: any) => c.status === 'reserved').length : 0;
        const maintenanceLockers = Array.isArray(casiers) ? casiers.filter((c: any) => c.status === 'maintenance').length : 0;
        
        const activeReservations = Array.isArray(reservations) ? reservations.filter((r: any) => r.statut === 'active').length : 0;
        
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        console.log('📅 Période aujourd\'hui:', {
          debut: todayStart.toISOString(),
          fin: todayEnd.toISOString()
        });

        const todayReservations = Array.isArray(reservations) ? reservations.filter((r: any) => {
          const resDate = new Date(r.dateDebut);
          const isToday = resDate >= todayStart && resDate <= todayEnd;
          
          if (isToday) {
            console.log('💰 Réservation aujourd\'hui:', {
              user: r.userId?.name,
              casier: r.casierId?.numero,
              prix: r.prixTotal,
              date: resDate.toISOString()
            });
          }
          
          return isToday;
        }) : [];

        const revenueToday = todayReservations.reduce((sum: number, res: any) => sum + (res.prixTotal || 0), 0);

        console.log('📊 Revenus aujourd\'hui:', {
          nombreReservations: todayReservations.length,
          revenueTotal: revenueToday,
          reservations: todayReservations.map(r => ({
            user: r.userId?.name,
            prix: r.prixTotal
          }))
        });
        
        // Revenus de ce mois
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const thisMonthReservations = Array.isArray(reservations) ? reservations.filter((r: any) => {
          const resDate = new Date(r.dateDebut);
          return resDate.getMonth() === currentMonth && resDate.getFullYear() === currentYear;
        }) : [];
        const revenueThisMonth = thisMonthReservations.reduce((sum: number, res: any) => sum + (res.prixTotal || 0), 0);
        
        const calculatedStats: DashboardStats = {
          totalLockers,
          availableLockers,
          reservedLockers,
          maintenanceLockers,
          activeReservations,
          totalUsers: userCountData?.totalUsers || 0,
          revenueToday,
          revenueThisMonth
        };
        
        console.log('📊 Statistiques calculées:', calculatedStats);
        setStats(calculatedStats);
        
        // ACTIVITÉS RÉCENTES AVEC TRI CORRIGÉ
        if (Array.isArray(reservations) && reservations.length > 0) {
          console.log('🔄 Toutes les réservations avant tri:', reservations);
          
          // Trier les réservations par date de création (plus récent en premier)
          const sortedReservations = [...reservations].sort((a: any, b: any) => {
            const dateA = new Date(a.dateDebut).getTime();
            const dateB = new Date(b.dateDebut).getTime();
            return dateB - dateA; // Tri décroissant (plus récent en premier)
          });
          
          console.log('📋 Réservations triées:', sortedReservations);
          
          const activities = sortedReservations.slice(0, 5).map((res: any, index: number) => {
            console.log(`📝 Activité ${index + 1}:`, {
              user: res.userId?.name,
              userId: res.userId,
              casier: res.casierId?.numero,
              casierId: res.casierId,
              dateDebut: res.dateDebut
            });
            
            return {
              id: index + 1,
              type: 'reservation',
              user: res.userId?.name || 'Utilisateur inconnu',
              locker: res.casierId?.numero || 'N/A',
              time: new Date(res.dateDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date(res.dateDebut).toDateString() === new Date().toDateString() ? 'Aujourd\'hui' : 'Récemment'
            };
          });
          
          console.log('✅ Activités finales à afficher:', activities);
          setRecentActivities(activities);
        }
        
      } catch (err: unknown) {
        console.error('❌ Erreur lors du chargement des statistiques:', err);
        let errorMessage = 'Erreur lors du chargement des statistiques';
        
        if (err instanceof Error) {
          errorMessage += `: ${err.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      await fetchUserData();
      await fetchStats();
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tableau de bord</h1>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Casiers totaux */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Casiers totaux</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalLockers}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-green-600 font-semibold">{stats.availableLockers} disponibles</span>
              </div>
              <div>
                <span className="text-xs text-blue-600 font-semibold">{stats.reservedLockers} réservés</span>
              </div>
              <div>
                <span className="text-xs text-gray-600 font-semibold">{stats.maintenanceLockers} en maintenance</span>
              </div>
            </div>
            <div className="mt-2 flex h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500" 
                style={{ width: `${stats.totalLockers > 0 ? (stats.availableLockers / stats.totalLockers) * 100 : 0}%` }}
              ></div>
              <div 
                className="bg-blue-500" 
                style={{ width: `${stats.totalLockers > 0 ? (stats.reservedLockers / stats.totalLockers) * 100 : 0}%` }}
              ></div>
              <div 
                className="bg-gray-400" 
                style={{ width: `${stats.totalLockers > 0 ? (stats.maintenanceLockers / stats.totalLockers) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Réservations actives */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Réservations actives</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeReservations}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-gray-500">Taux d'utilisation:</span>
            <div className="mt-1 flex items-center">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${stats.totalLockers > 0 ? (stats.reservedLockers / stats.totalLockers) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs font-semibold text-gray-700">
                {stats.totalLockers > 0 ? Math.round((stats.reservedLockers / stats.totalLockers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Utilisateurs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilisateurs totaux</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500">Croissance constante</span>
            <div className="mt-1 flex items-center">
              <span className="text-sm font-semibold text-green-600">+7%</span>
              <span className="ml-1 text-xs text-gray-500">ce mois-ci</span>
            </div>
          </div>
        </div>

        {/* Revenus */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenus (ce mois)</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.revenueThisMonth.toFixed(2)}€</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500">Aujourd'hui:</span>
              <span className="ml-2 text-sm font-semibold text-gray-900">{stats.revenueToday.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Activités récentes</h2>
        </div>
        {recentActivities.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user} a réservé le casier {activity.locker}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.date} à {activity.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            Aucune activité récente
          </div>
        )}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Voir toutes les activités
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
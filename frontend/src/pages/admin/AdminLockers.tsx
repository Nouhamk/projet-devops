import React, { useState, useEffect } from 'react';
import { Locker } from '../../types/Locker'; // Assurez-vous que le type Locker est correctement défini
import api from '../../services/api';
interface LockerFormData {
  numero: number;
  taille: 'small' | 'medium' | 'large';
  prix: number;
}

const AdminLockers: React.FC = () => {
  // États pour la liste des casiers
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le formulaire
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<LockerFormData>({
    numero: 0,
    taille: 'medium',
    prix: 0
  });
  const [editId, setEditId] = useState<number | null>(null);
  
  // État pour la recherche et le filtre
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Récupération des casiers (simulée)
  useEffect(() => {
    const fetchLockers = async () => {
      try {
        const response = await api.get('/casier');
        setLockers(response);
        console.log("lockers", lockers);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des casiers:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des casiers');
        setLoading(false);
      }
    };
    
    fetchLockers();
  }, []);

  // Filtrer les casiers
  const filteredLockers = lockers.filter(locker => {
    const matchesSearch = locker.numero.toString().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || locker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Gérer les changements de formulaire
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numero' ? parseInt(value) : name === 'prix' ? parseFloat(value) : value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formMode === 'add') {
        // Appel API pour ajouter un casier
        const newLocker = await api.post('/casier', formData);
        setLockers([...lockers, newLocker]);
      } else {
        // Appel API pour mettre à jour un casier
        const updatedLocker = await api.put(`/casier/${editId}`, formData);
        const updatedLockers = lockers.map(locker =>
          locker._id === editId ? updatedLocker : locker
        );
        setLockers(updatedLockers);
      }
      
      // Réinitialiser le formulaire
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError('Erreur lors de la sauvegarde du casier');
    }
  };

  // Ouvrir le formulaire en mode édition
  const handleEdit = (locker: Locker) => {
    setFormMode('edit');
    setEditId(locker._id);
    setFormData({
      numero: locker.numero,
      taille: locker.taille,
      prix: locker.prix
    });
    setShowForm(true);
  };

  // Supprimer un casier
  const handleDelete = async (id: number) => {
    // Demander confirmation
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce casier ?')) {
      try {
        await api.delete(`/casier/${id}`);
        setLockers(lockers.filter(locker => locker._id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression du casier');
      }
    }
  };

  // Changer le statut d'un casier
  const handleStatusChange = async (id: number, newStatus: 'available' | 'maintenance') => {
    try {
      let lockerUpdated = lockers.find(locker => locker._id === id);
      if (!lockerUpdated) {
        throw new Error('Casier non trouvé');
      }

      lockerUpdated.status = newStatus;
      await api.put(`/casier/${id}`, lockerUpdated);
      
      const updatedLockers = lockers.map(locker =>
        locker._id === id
          ? { ...locker, status: newStatus }
          : locker
      );
      
      setLockers(updatedLockers);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      setError('Erreur lors du changement de statut du casier');
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      numero: 0,
      taille: 'medium',
      prix: 0
    });
    setFormMode('add');
    setEditId(null);
    setShowForm(false);
  };

  // Obtenir la couleur de badge en fonction du statut
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'reserved':
        return 'Réservé';
      case 'expired':
        return 'Expiré';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des casiers</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ajouter un casier
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher par numéro
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Numéro de casier"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrer par statut
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="reserved">Réservé</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout/édition */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {formMode === 'add' ? 'Ajouter un casier' : 'Modifier le casier'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro
                  </label>
                  <input
                    type="number"
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleFormChange}
                    required
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="taille" className="block text-sm font-medium text-gray-700 mb-1">
                    Taille
                  </label>
                  <select
                    id="taille"
                    name="taille"
                    value={formData.taille}
                    onChange={handleFormChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="small">Petit</option>
                    <option value="medium">Moyen</option>
                    <option value="large">Grand</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (€/heure)
                  </label>
                  <input
                    type="number"
                    id="prix"
                    name="prix"
                    value={formData.prix}
                    onChange={handleFormChange}
                    min="0"
                    step="0.5"
                    required
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  {formMode === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tableau des casiers */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix (€/h)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLockers.map((locker) => (
                <tr key={locker._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{locker.numero}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {locker.taille === 'small' ? 'Petit' : locker.taille === 'medium' ? 'Moyen' : 'Grand'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(locker.status)}`}>
                      {getStatusLabel(locker.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {locker.prix}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {locker.status !== 'available' && (
                        <button
                          onClick={() => handleStatusChange(locker._id, 'available')}
                          className="text-green-600 hover:text-green-900"
                          title="Marquer comme disponible"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      {locker.status !== 'maintenance' && (
                        <button
                          onClick={() => handleStatusChange(locker._id, 'maintenance')}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Marquer en maintenance"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(locker)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(locker._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun résultat */}
        {filteredLockers.length === 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-500">Aucun casier ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLockers;
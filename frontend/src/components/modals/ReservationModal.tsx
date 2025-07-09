// src/components/modals/ReservationModal.tsx
import React, { useState } from 'react';
import { Locker } from '../../types/Locker';
import api from "../../services/api.ts";

interface ReservationModalProps {
  locker: Locker | null;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ locker, onClose }) => {
  const [duration, setDuration] = useState<number>(2);

  if (!locker) return null;

  const handleConfirm = async () => {
    try {
      const totalPrice = Number(locker.prix) * duration;

      const response = await api.post('/payment/create-checkout-session', {
        price: totalPrice * 100,
        lockerId: locker._id,
        duration
      });

      const url = response.url;
      console.log(response);
      if (url) {
        window.location.href = url;
      } else {
        console.error('Erreur: URL Stripe manquante');
      }
    } catch (err) {
      console.error('Erreur lors de la création de la session Stripe:', err);
    }
  };

  const getSizeLabel = (size: string): string => {
    switch (size) {
      case 'small': return 'Petit';
      case 'medium': return 'Moyen';
      case 'large': return 'Grand';
      default: return 'Inconnu';
    }
  };

  const totalPrice = locker.prix * duration;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* En-tête du modal */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Réserver un casier</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Corps du modal */}
        <div className="px-6 py-4">
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${locker.taille === 'small' ? 'bg-blue-100' : locker.taille === 'medium' ? 'bg-blue-200' : 'bg-blue-300'} rounded-lg flex items-center justify-center mr-4`}>
                <span className="text-xl font-bold text-blue-700">{locker.numero}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Casier {getSizeLabel(locker.taille)}</p>
                <p className="text-sm text-gray-500">{locker.prix}€/heure</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Durée de réservation
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">1 heure</option>
              <option value="2">2 heures</option>
              <option value="4">4 heures</option>
              <option value="8">8 heures</option>
              <option value="12">12 heures</option>
              <option value="24">24 heures</option>
            </select>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Prix unitaire:</span>
              <span className="font-medium">{locker.prix}€/heure</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Durée:</span>
              <span className="font-medium">{duration} heure{duration > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-800 font-medium">Total:</span>
              <span className="text-blue-600 font-bold">{totalPrice}€</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
            <p>Votre casier sera automatiquement libéré à la fin de la période de réservation. Vous recevrez un email de confirmation avec tous les détails.</p>
          </div>
        </div>
        
        {/* Pied du modal */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Confirmer la réservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
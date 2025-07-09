import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/shared/Footer';
import Navbar from '../components/shared/Navbar';
import authService from '../services/AuthService';

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Bannière */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Réservez un casier en quelques clics !</h2>
              <p className="text-lg md:text-xl mb-6">
                Simple, rapide et sécurisé, réservez votre casier quand vous le souhaitez.
              </p>
              <Link to="/login" className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50">
                Réserver maintenant
              </Link>
            </div>
            <div className="hidden md:block md:w-1/2">
                <div className="lg:w-1/2 mt-10 lg:mt-0">
                    <div className="bg-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="grid grid-cols-4 gap-4">
                        {[...Array(16)].map((_, i) => (
                            <div
                            key={i}
                            className={`
                                w-16 h-16 rounded-md flex items-center justify-center text-white font-medium
                                ${i % 5 === 0 ? 'bg-locker-blue' : 
                                i % 7 === 0 ? 'bg-locker-dark' : 
                                i % 3 === 0 ? 'bg-locker-turquoise' : 
                                'bg-locker-blue/70'}
                            `}
                            >
                            {i + 1}
                            </div>
                        ))}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-28 h-28 bg-locker-blue/10 rounded-full"></div>
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-locker-turquoise/10 rounded-full"></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Choisissez un casier</h3>
              <p className="text-gray-600">Parcourez notre carte de casiers et sélectionnez celui qui vous convient.</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Réservez pour la durée souhaitée</h3>
              <p className="text-gray-600">Indiquez combien de temps vous avez besoin du casier.</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Recevez votre confirmation</h3>
              <p className="text-gray-600">Un email avec les détails de votre réservation vous sera envoyé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {
        !authService.isLoggedIn &&
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à réserver votre casier ?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Rejoignez-nous dès aujourd'hui et bénéficiez d'un accès simplifié à nos casiers.
            </p>
            <Link to="/register" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
              Créer un compte
            </Link>
          </div>
        </section>
      }
      

      <Footer />
    </div>
  );
};

export default Homepage;
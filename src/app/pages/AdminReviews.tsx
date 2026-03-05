'use client';

import { Search, Eye, Trash2, Star } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminReviews() {
  const reviews = [
    {
      id: 1,
      reviewer: 'Jean Dupont',
      avatar: 'JD',
      chalet: 'Chalet Alpes',
      rating: 5,
      comment: 'Magnifique chalet avec une vue imprenable sur les montagnes. Tout etait parfait.',
      date: '15/02/2025',
      status: 'PUBLIE'
    },
    {
      id: 2,
      reviewer: 'Marie Simon',
      avatar: 'MS',
      chalet: 'Villa Toscane',
      rating: 4,
      comment: 'Tres bon sejour, logement propre et bien equipe. Un peu bruyant le soir.',
      date: '12/02/2025',
      status: 'PUBLIE'
    },
    {
      id: 3,
      reviewer: 'Pierre Laurent',
      avatar: 'PL',
      chalet: 'Appartement Paris',
      rating: 2,
      comment: 'Logement pas conforme aux photos. Equipements manquants et problemes de proprete.',
      date: '10/02/2025',
      status: 'SIGNALE'
    },
    {
      id: 4,
      reviewer: 'Sophie Martin',
      avatar: 'SM',
      chalet: 'Studio Moderne',
      rating: 5,
      comment: 'Excellent rapport qualite-prix. Hote tres accueillant et reactif.',
      date: '08/02/2025',
      status: 'PUBLIE'
    },
    {
      id: 5,
      reviewer: 'Thomas Dubois',
      avatar: 'TD',
      chalet: 'Maison Bord de Mer',
      rating: 1,
      comment: 'Tres decu. Contenu inapproprie dans le commentaire...',
      date: '05/02/2025',
      status: 'SIGNALE'
    },
    {
      id: 6,
      reviewer: 'Lucie Bernard',
      avatar: 'LB',
      chalet: 'Chalet Montagne',
      rating: 4,
      comment: 'Superbe endroit pour un week-end en famille. On reviendra.',
      date: '01/02/2025',
      status: 'PUBLIE'
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'PUBLIE') return 'bg-green-100 text-green-700';
    if (status === 'SIGNALE') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Moderation des avis</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">TOTAL AVIS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>842</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">NOTE MOYENNE</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>4.2</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">PUBLIES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>810</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">SIGNALES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>32</div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Liste des avis</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un avis..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option>Toutes les notes</option>
                  <option>5 etoiles</option>
                  <option>4 etoiles</option>
                  <option>3 etoiles</option>
                  <option>2 etoiles</option>
                  <option>1 etoile</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option>Tous les statuts</option>
                  <option>Publie</option>
                  <option>Signale</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>AUTEUR</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>CHALET</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>NOTE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>COMMENTAIRE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {review.avatar}
                        </div>
                        <span className="text-sm" style={{ fontWeight: 600 }}>{review.reviewer}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">{review.chalet}</td>
                    <td className="py-4 px-6">{renderStars(review.rating)}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">{review.comment}</td>
                    <td className="py-4 px-6 text-sm">{review.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(review.status)}`} style={{ fontWeight: 600 }}>
                        {review.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                      {review.avatar}
                    </div>
                    <div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{review.reviewer}</div>
                      <div className="text-xs text-gray-500">{review.chalet}</div>
                    </div>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(review.status)}`} style={{ fontWeight: 600 }}>
                    {review.status}
                  </span>
                </div>
                <div className="mb-2">{renderStars(review.rating)}</div>
                <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{review.date}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-6 flex items-center justify-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg" style={{ fontWeight: 600 }}>1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

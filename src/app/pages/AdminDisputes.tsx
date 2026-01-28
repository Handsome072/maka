'use client';

import { Search, Send, FileDown } from 'lucide-react';
import { useState } from 'react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminDisputes() {
  const [selectedDispute, setSelectedDispute] = useState(0);
  const [message, setMessage] = useState('');

  const disputes = [
    {
      id: 1,
      title: 'Problème avec le logement - Villa Toscane',
      description: 'Bonjour, j\'ai un problème avec la villa qui...',
      client: 'Jean Dupont',
      clientAvatar: 'JD',
      host: 'Marie Simon',
      hostAvatar: 'MS',
      date: 'Aujourd\'hui 16:43',
      status: 'URGENT',
      statusLabel: 'EN COURS',
      messages: [
        {
          sender: 'Jean Dupont',
          avatar: 'JD',
          text: 'Bonjour, j\'ai réservé votre villa pour le week-end prochain mais j\'ai remarqué dans l\'annonce que la wifi ne fonctionne pas correctement, et la piscine n\'est pas chauffée comme indiqué. Je vous ai contacté mais je n\'ai pas eu de réponse. Pouvez-vous clarifier la situation ?',
          time: '14:30',
          isClient: true
        },
        {
          sender: 'Admin Support',
          avatar: 'AS',
          text: 'Bonjour M. Dupont, nous avons bien reçu votre réclamation. Nous allons examiner votre dossier et vous recontacterons dans les plus brefs délais.',
          time: '14:35',
          isAdmin: true
        }
      ]
    },
    {
      id: 2,
      title: 'Demande de remboursement - Appartement Paris',
      description: 'Je souhaite demander un remboursement...',
      client: 'Pierre Laurent',
      clientAvatar: 'PL',
      host: 'Marie Simon',
      hostAvatar: 'MS',
      date: 'Hier, 10:43',
      status: 'MOYEN',
      statusLabel: 'RÉSOLU',
      messages: []
    },
    {
      id: 3,
      title: 'Litige sur les frais de nettoyage',
      description: 'Je conteste les frais de nettoyage car...',
      client: 'Olivier Richard',
      clientAvatar: 'OR',
      host: 'Jean Dupont',
      hostAvatar: 'JD',
      date: 'Il y a 2 jours, 10:30',
      status: 'BASÉE',
      statusLabel: 'EN COURS',
      messages: []
    },
    {
      id: 4,
      title: 'Problème de sécurité - Chalet Alpes',
      description: 'Il y a un problème de sécurité dans le chal...',
      client: 'Antoine Moreau',
      clientAvatar: 'AM',
      host: 'Camille Leroy',
      hostAvatar: 'CL',
      date: 'Il y a 3 jours, 09:15',
      status: 'URGENT',
      statusLabel: 'EN COURS',
      messages: []
    },
    {
      id: 5,
      title: 'Réclamation sur les équipements manquants',
      description: 'Plusieurs équipements mentionnés dans...',
      client: 'Sophie Blanc',
      clientAvatar: 'SB',
      host: 'Romain Girard',
      hostAvatar: 'RG',
      date: 'Il y a 5 jours',
      status: 'MOYEN',
      statusLabel: 'RÉSOLU',
      messages: []
    }
  ];

  const getPriorityColor = (status: string) => {
    if (status === 'URGENT') return 'bg-red-100 text-red-600';
    if (status === 'MOYEN') return 'bg-orange-100 text-orange-600';
    if (status === 'BASÉE') return 'bg-blue-100 text-blue-600';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusLabelColor = (status: string) => {
    if (status === 'EN COURS') return 'bg-orange-100 text-orange-600';
    if (status === 'RÉSOLU') return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des litiges</h1>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
            <FileDown className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 500 }}>Exporter</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500, letterSpacing: '0.05em' }}>RÉCLAMATIONS ACTIVES</div>
            <div className="text-3xl" style={{ fontWeight: 700 }}>23</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500, letterSpacing: '0.05em' }}>EN COURS</div>
            <div className="text-3xl" style={{ fontWeight: 700 }}>15</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500, letterSpacing: '0.05em' }}>RÉSOLUES</div>
            <div className="text-3xl" style={{ fontWeight: 700 }}>8</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500, letterSpacing: '0.05em' }}>EN ATTENTE</div>
            <div className="text-3xl" style={{ fontWeight: 700 }}>0</div>
          </div>
        </div>

        {/* Disputes Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row" style={{ height: 'auto', minHeight: '600px' }}>
          {/* Left Panel - Disputes List */}
          <div className="w-full lg:w-[400px] border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col max-h-[400px] lg:max-h-none">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-base md:text-lg mb-4" style={{ fontWeight: 600 }}>Réclamations</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une réclamation..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8] text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {disputes.map((dispute, index) => (
                <button
                  key={dispute.id}
                  onClick={() => setSelectedDispute(index)}
                  className={`w-full p-5 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                    selectedDispute === index ? 'bg-[#5EC6D8]/10 border-l-4 border-l-[#5EC6D8]' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                      {dispute.clientAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{dispute.title}</div>
                      <div className="text-xs text-gray-500 truncate">{dispute.description}</div>
                      <div className="text-xs text-gray-400 mt-1">{dispute.client} - {dispute.date.split(',')[0]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-13">
                    <span className={`inline-block px-2.5 py-1 rounded text-xs ${getPriorityColor(dispute.status)}`} style={{ fontWeight: 600 }}>
                      {dispute.status}
                    </span>
                    <span className={`inline-block px-2.5 py-1 rounded text-xs ${getStatusLabelColor(dispute.statusLabel)}`} style={{ fontWeight: 600 }}>
                      {dispute.statusLabel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Dispute Details */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl flex-1" style={{ fontWeight: 600 }}>{disputes[selectedDispute].title}</h2>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`inline-block px-3 py-1.5 rounded text-xs ${getPriorityColor(disputes[selectedDispute].status)}`} style={{ fontWeight: 600 }}>
                    {disputes[selectedDispute].status}
                  </span>
                  <span className={`inline-block px-3 py-1.5 rounded text-xs ${getStatusLabelColor(disputes[selectedDispute].statusLabel)}`} style={{ fontWeight: 600 }}>
                    {disputes[selectedDispute].statusLabel}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                    {disputes[selectedDispute].clientAvatar}
                  </div>
                  <span className="text-xs text-gray-500" style={{ fontWeight: 500 }}>CLIENT</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{disputes[selectedDispute].client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                    {disputes[selectedDispute].hostAvatar}
                  </div>
                  <span className="text-xs text-gray-500" style={{ fontWeight: 500 }}>HÔTE</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{disputes[selectedDispute].host}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400">{disputes[selectedDispute].date}</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {disputes[selectedDispute].messages.length > 0 ? (
                <div className="space-y-4">
                  {disputes[selectedDispute].messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.isAdmin ? 'justify-end' : ''}`}>
                      {!msg.isAdmin && (
                        <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                          {msg.avatar}
                        </div>
                      )}
                      <div className={`flex-1 max-w-2xl ${msg.isAdmin ? 'text-right' : ''}`}>
                        <div className={`inline-block p-4 rounded-xl ${msg.isAdmin ? 'bg-[#5EC6D8] text-white' : 'bg-white text-gray-900 shadow-sm border border-gray-100'}`}>
                          <div className="text-sm leading-relaxed">{msg.text}</div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1.5 px-1">{msg.time}</div>
                      </div>
                      {msg.isAdmin && (
                        <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                          {msg.avatar}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Aucun message pour cette réclamation
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8] text-sm"
                />
                <button className="px-6 py-3 bg-[#5EC6D8] text-white rounded-lg hover:bg-[#4db5c7] transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>Envoyer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
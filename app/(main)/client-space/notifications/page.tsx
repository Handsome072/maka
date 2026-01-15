'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, CreditCard, Tag, Calendar } from 'lucide-react';

interface NotificationSetting {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
}

/**
 * Page Notifications
 */
export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'reservations',
      icon: <Calendar className="w-5 h-5" />,
      title: 'Réservations',
      description: 'Confirmations, rappels et mises à jour de réservation',
      email: true,
      push: true
    },
    {
      id: 'messages',
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Messages',
      description: 'Nouveaux messages des hôtes et voyageurs',
      email: true,
      push: true
    },
    {
      id: 'payments',
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Paiements',
      description: 'Confirmations de paiement et factures',
      email: true,
      push: false
    },
    {
      id: 'promotions',
      icon: <Tag className="w-5 h-5" />,
      title: 'Promotions',
      description: 'Offres spéciales et réductions',
      email: false,
      push: false
    },
    {
      id: 'newsletter',
      icon: <Mail className="w-5 h-5" />,
      title: 'Newsletter',
      description: 'Actualités et nouveautés HOMIQIO',
      email: true,
      push: false
    }
  ]);

  const toggleSetting = (id: string, type: 'email' | 'push') => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, [type]: !s[type] } : s
    ));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Notifications</h1>
      <p className="text-gray-600 mb-8">
        Choisissez comment vous souhaitez être notifié
      </p>

      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-start justify-between py-4 border-b last:border-0">
            <div className="flex gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                {setting.icon}
              </div>
              <div>
                <h3 className="font-medium">{setting.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
              </div>
            </div>
            <div className="flex gap-6">
              {/* Email toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-600">Email</span>
                <button
                  onClick={() => toggleSetting(setting.id, 'email')}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    setting.email ? 'bg-[#00A99D]' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.email ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </label>
              
              {/* Push toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-600">Push</span>
                <button
                  onClick={() => toggleSetting(setting.id, 'push')}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    setting.push ? 'bg-[#00A99D]' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.push ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button className="px-6 py-3 bg-[#00A99D] text-white rounded-lg hover:bg-[#008B82]">
          Enregistrer les préférences
        </button>
      </div>
    </div>
  );
}


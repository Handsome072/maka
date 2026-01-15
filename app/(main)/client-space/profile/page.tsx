'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Camera, Mail, Phone, MapPin, Calendar } from 'lucide-react';

/**
 * Page Profil
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Jean',
    lastName: user?.name?.split(' ')[1] || 'Dupont',
    email: user?.email || 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    address: 'Paris, France',
    birthDate: '15/03/1990'
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to API
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Informations personnelles</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="text-sm text-[#00A99D] hover:underline"
        >
          {isEditing ? 'Enregistrer' : 'Modifier'}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <div>
          <h2 className="text-lg font-medium">{formData.firstName} {formData.lastName}</h2>
          <p className="text-sm text-gray-500">Membre depuis janvier 2024</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{formData.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{formData.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg">{formData.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline mr-2" />
            Téléphone
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg">{formData.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-2" />
            Adresse
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg">{formData.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date de naissance
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg">{formData.birthDate}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-[#00A99D] text-white rounded-lg hover:bg-[#008B82]"
          >
            Enregistrer les modifications
          </button>
        </div>
      )}
    </div>
  );
}


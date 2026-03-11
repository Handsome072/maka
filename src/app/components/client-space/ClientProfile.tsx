'use client';

import { useState, useEffect, useRef } from 'react';
import { userProfileApi, User } from '@/app/services/api';
import { useAuth } from '@/app/context/AuthContext';
import { Camera } from 'lucide-react';

export function ClientProfile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Editing states
  const [editingOfficialName, setEditingOfficialName] = useState(false);
  const [editingPreferredName, setEditingPreferredName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [addressCountry, setAddressCountry] = useState('');

  const isAnyEditing = editingOfficialName || editingPreferredName || editingEmail || editingPhone || editingAddress;

  useEffect(() => {
    loadProfile();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadProfile = async () => {
    try {
      const res = await userProfileApi.getProfile();
      setProfile(res.user);
      populateFields(res.user);
    } catch {
      showToast('error', 'Impossible de charger le profil.');
    } finally {
      setLoading(false);
    }
  };

  const populateFields = (user: User) => {
    setFirstName(user.first_name || '');
    setLastName(user.last_name || '');
    setPreferredName('');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setPhoneCountryCode(user.phone_country_code || '+1');
    setAddressStreet(user.address_street || '');
    setAddressCity(user.address_city || '');
    setAddressPostalCode(user.address_postal_code || '');
    setAddressCountry(user.address_country || '');
  };

  const handleSave = async (data: Parameters<typeof userProfileApi.updatePersonalInfo>[0]) => {
    setSaving(true);
    try {
      const res = await userProfileApi.updatePersonalInfo(data);
      setProfile(res.user);
      populateFields(res.user);
      showToast('success', 'Informations mises à jour.');
      // Close all editing states
      setEditingOfficialName(false);
      setEditingPreferredName(false);
      setEditingEmail(false);
      setEditingPhone(false);
      setEditingAddress(false);
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    if (profile) populateFields(profile);
    setEditingOfficialName(false);
    setEditingPreferredName(false);
    setEditingEmail(false);
    setEditingPhone(false);
    setEditingAddress(false);
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    return `${local.charAt(0)}${'*'.repeat(Math.max(local.length - 2, 1))}${local.charAt(local.length - 1)}@${domain}`;
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 w-full">
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 w-full">
      <div>
        <div className="mb-8">
          <h2 className="text-lg md:text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
            Informations personnelles
          </h2>
        </div>

        {/* Photo de profil */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-200">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {(profile?.profile_photo_url || user?.profile_photo_url) ? (
                <img
                  src={profile?.profile_photo_url || user?.profile_photo_url}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-gray-500">
                  {(profile?.first_name || user?.first_name)?.[0]?.toUpperCase()}{(profile?.last_name || user?.last_name)?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              {uploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  showToast('error', 'La photo ne doit pas dépasser 5 Mo.');
                  return;
                }
                setUploadingAvatar(true);
                try {
                  const res = await userProfileApi.uploadPhoto(file);
                  setProfile(prev => prev ? { ...prev, profile_photo_url: res.profile_photo_url } : null);
                  await refreshUser();
                  showToast('success', 'Photo de profil mise à jour.');
                } catch {
                  showToast('error', 'Erreur lors de la mise à jour de la photo.');
                } finally {
                  setUploadingAvatar(false);
                  e.target.value = '';
                }
              }}
            />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: '#222222' }}>Photo de profil</h3>
            <p className="text-sm text-gray-500 mt-0.5">Cliquez sur l&apos;icône pour changer votre photo</p>
          </div>
        </div>

        <div className="space-y-0">
          {/* Nom officiel */}
          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm md:text-base mb-1" style={{ fontWeight: 600, color: isAnyEditing && !editingOfficialName ? '#D3D3D3' : '#222222' }}>
                  Nom officiel
                </h4>
                <p className={`text-sm ${isAnyEditing && !editingOfficialName ? 'text-gray-400' : 'text-gray-600'}`}>
                  {profile?.first_name} {profile?.last_name}
                </p>
              </div>
              {!isAnyEditing && (
                <button
                  onClick={() => setEditingOfficialName(true)}
                  className="text-sm underline"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  Modifier
                </button>
              )}
              {isAnyEditing && !editingOfficialName && (
                <button className="text-sm underline text-gray-400" style={{ fontWeight: 600 }} disabled>
                  Modifier
                </button>
              )}
            </div>

            {editingOfficialName && (
              <div className="mt-6">
                <p className="text-sm mb-4" style={{ color: '#717171' }}>
                  Assurez-vous que le nom correspond à celui qui figure sur votre pièce d'identité.
                </p>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Prénom sur la pièce d'identité"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="Nom sur la pièce d'identité"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSave({ first_name: firstName, last_name: lastName })}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800 disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-base underline"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Adresse e-mail */}
          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm md:text-base mb-1" style={{ fontWeight: 600, color: isAnyEditing && !editingEmail ? '#D3D3D3' : '#222222' }}>
                  Adresse e-mail
                </h4>
                <p className={`text-sm ${isAnyEditing && !editingEmail ? 'text-gray-400' : 'text-gray-600'}`}>
                  {profile?.email ? maskEmail(profile.email) : 'Information non fournie'}
                </p>
              </div>
              {!isAnyEditing && (
                <button
                  onClick={() => setEditingEmail(true)}
                  className="text-sm underline"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  Modifier
                </button>
              )}
              {isAnyEditing && !editingEmail && (
                <button className="text-sm underline text-gray-400" style={{ fontWeight: 600 }} disabled>
                  Modifier
                </button>
              )}
            </div>

            {editingEmail && (
              <div className="mt-6">
                <p className="text-sm mb-4" style={{ color: '#717171' }}>
                  Utilisez une adresse sur laquelle vous pouvez toujours recevoir des e-mails.
                </p>
                <div className="space-y-4 mb-6">
                  <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSave({ email })}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800 disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-base underline"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Numéro de téléphone */}
          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm md:text-base mb-1" style={{ fontWeight: 600, color: isAnyEditing && !editingPhone ? '#D3D3D3' : '#222222' }}>
                  Numéro de téléphone
                </h4>
                <p className={`text-sm ${isAnyEditing && !editingPhone ? 'text-gray-400' : profile?.phone ? 'text-gray-600' : 'text-blue-600'}`}>
                  {profile?.phone ? `${profile.phone_country_code || ''} ${profile.phone}` : 'Information non fournie'}
                </p>
              </div>
              {!isAnyEditing && (
                <button
                  onClick={() => setEditingPhone(true)}
                  className="text-sm underline"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  {profile?.phone ? 'Modifier' : 'Ajouter'}
                </button>
              )}
              {isAnyEditing && !editingPhone && (
                <button className="text-sm underline text-gray-400" style={{ fontWeight: 600 }} disabled>
                  {profile?.phone ? 'Modifier' : 'Ajouter'}
                </button>
              )}
            </div>

            {editingPhone && (
              <div className="mt-6">
                <p className="text-sm mb-4" style={{ color: '#717171' }}>
                  Ajoutez un numéro de téléphone pour que les hôtes et voyageurs puissent vous contacter.
                </p>
                <div className="flex gap-3 mb-6">
                  <select
                    value={phoneCountryCode}
                    onChange={e => setPhoneCountryCode(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="+1">+1 (CA/US)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+261">+261 (MG)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Numéro de téléphone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSave({ phone, phone_country_code: phoneCountryCode })}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800 disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-base underline"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Adresse */}
          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm md:text-base mb-1" style={{ fontWeight: 600, color: isAnyEditing && !editingAddress ? '#D3D3D3' : '#222222' }}>
                  Adresse
                </h4>
                <p className={`text-sm ${isAnyEditing && !editingAddress ? 'text-gray-400' : profile?.address_street ? 'text-gray-600' : 'text-blue-600'}`}>
                  {profile?.address_street
                    ? `${profile.address_street}, ${profile.address_city || ''} ${profile.address_postal_code || ''}, ${profile.address_country || ''}`
                    : 'Information non fournie'}
                </p>
              </div>
              {!isAnyEditing && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="text-sm underline"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  {profile?.address_street ? 'Modifier' : 'Ajouter'}
                </button>
              )}
              {isAnyEditing && !editingAddress && (
                <button className="text-sm underline text-gray-400" style={{ fontWeight: 600 }} disabled>
                  {profile?.address_street ? 'Modifier' : 'Ajouter'}
                </button>
              )}
            </div>

            {editingAddress && (
              <div className="mt-6">
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Rue"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Ville"
                      value={addressCity}
                      onChange={e => setAddressCity(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Code postal"
                      value={addressPostalCode}
                      onChange={e => setAddressPostalCode(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pays"
                    value={addressCountry}
                    onChange={e => setAddressCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSave({
                      address_street: addressStreet,
                      address_city: addressCity,
                      address_postal_code: addressPostalCode,
                      address_country: addressCountry,
                    })}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800 disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-base underline"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-sm text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`} style={{ fontWeight: 600 }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

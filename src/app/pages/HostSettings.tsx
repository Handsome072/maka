'use client';

import { useState, useEffect } from 'react';
import { HostSidebar } from '@/app/components/HostSidebar';
import { userProfileApi, User, NotificationPreferences } from '@/app/services/api';
import { useAuth } from '@/app/context/AuthContext';
import { Search, Bell, Eye, EyeOff } from 'lucide-react';

type SettingsSection = 'personal' | 'security' | 'notifications' | 'preferences';

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  reservations_email: true,
  reservations_sms: false,
  messages_email: true,
  messages_sms: false,
  reminders_email: true,
  reminders_sms: false,
  promotions_email: false,
  promotions_sms: false,
};

export function HostSettings() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SettingsSection>('personal');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Personal info form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+33');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [addressCountry, setAddressCountry] = useState('');
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Security form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationPreferences>(DEFAULT_NOTIFICATIONS);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Preferences
  const [prefLanguage, setPrefLanguage] = useState('fr');
  const [prefCurrency, setPrefCurrency] = useState('CAD');
  const [prefTimezone, setPrefTimezone] = useState('America/Montreal');
  const [savingPreferences, setSavingPreferences] = useState(false);

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
      setFirstName(res.user.first_name || '');
      setLastName(res.user.last_name || '');
      setEmail(res.user.email || '');
      setPhone(res.user.phone || '');
      setPhoneCountryCode(res.user.phone_country_code || '+33');
      setAddressStreet(res.user.address_street || '');
      setAddressCity(res.user.address_city || '');
      setAddressPostalCode(res.user.address_postal_code || '');
      setAddressCountry(res.user.address_country || '');
      setNotifications(res.user.notification_preferences || DEFAULT_NOTIFICATIONS);
      setPrefLanguage(res.user.preferred_language || 'fr');
      setPrefCurrency(res.user.preferred_currency || 'CAD');
      setPrefTimezone(res.user.timezone || 'America/Montreal');
    } catch {
      showToast('error', 'Impossible de charger le profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    setSavingPersonal(true);
    try {
      const res = await userProfileApi.updatePersonalInfo({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        phone_country_code: phoneCountryCode,
        address_street: addressStreet,
        address_city: addressCity,
        address_postal_code: addressPostalCode,
        address_country: addressCountry,
      });
      setProfile(res.user);
      showToast('success', 'Informations mises à jour.');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      showToast('error', 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Les mots de passe ne correspondent pas.');
      return;
    }
    setSavingPassword(true);
    try {
      await userProfileApi.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('success', 'Mot de passe mis à jour.');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await userProfileApi.updateNotifications(notifications);
      showToast('success', 'Préférences de notifications mises à jour.');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur.');
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    try {
      await userProfileApi.updatePreferences({
        preferred_language: prefLanguage,
        preferred_currency: prefCurrency,
        timezone: prefTimezone,
      });
      showToast('success', 'Préférences mises à jour.');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur.');
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await userProfileApi.deactivateAccount(deactivatePassword, deactivateReason);
      window.location.href = '/';
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la désactivation.');
    }
  };

  const sectionTabs: { key: SettingsSection; label: string }[] = [
    { key: 'personal', label: 'Informations personnelles' },
    { key: 'security', label: 'Connexion et sécurité' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'preferences', label: 'Préférences' },
  ];

  const toggleNotif = (key: keyof NotificationPreferences) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Paramètres</h1>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {sectionTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className="px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors"
              style={{
                fontWeight: 600,
                backgroundColor: activeSection === tab.key ? '#222222' : 'white',
                color: activeSection === tab.key ? 'white' : '#222222',
                borderColor: activeSection === tab.key ? '#222222' : '#DDDDDD',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Personal Info */}
            {activeSection === 'personal' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg mb-6" style={{ fontWeight: 600 }}>Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Prénom</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Nom</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Téléphone</label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={e => setPhoneCountryCode(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] w-24"
                    >
                      <option value="+33">+33</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+49">+49</option>
                      <option value="+34">+34</option>
                      <option value="+39">+39</option>
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="6 12 34 56 78"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                </div>

                <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#374151' }}>Adresse</h3>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    placeholder="Rue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={addressCity}
                      onChange={e => setAddressCity(e.target.value)}
                      placeholder="Ville"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                    <input
                      type="text"
                      value={addressPostalCode}
                      onChange={e => setAddressPostalCode(e.target.value)}
                      placeholder="Code postal"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                    <input
                      type="text"
                      value={addressCountry}
                      onChange={e => setAddressCountry(e.target.value)}
                      placeholder="Pays"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSavePersonalInfo}
                  disabled={savingPersonal}
                  className="px-6 py-3 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ fontWeight: 600, backgroundColor: '#222222' }}
                >
                  {savingPersonal ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg mb-6" style={{ fontWeight: 600 }}>Modifier le mot de passe</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Mot de passe actuel</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Nouveau mot de passe</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                          placeholder="8 caractères minimum"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Confirmer le mot de passe</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={savingPassword || !currentPassword || !newPassword}
                      className="px-6 py-3 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                      style={{ fontWeight: 600, backgroundColor: '#222222' }}
                    >
                      {savingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg mb-2" style={{ fontWeight: 600 }}>Désactivation du compte</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    La désactivation de votre compte est irréversible. Toutes vos annonces seront retirées.
                  </p>
                  <button
                    onClick={() => setShowDeactivateModal(true)}
                    className="px-6 py-3 rounded-lg border-2 border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Désactiver mon compte
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg mb-6" style={{ fontWeight: 600 }}>Préférences de notifications</h2>
                <div className="space-y-6">
                  {([
                    { category: 'Réservations', emailKey: 'reservations_email' as const, smsKey: 'reservations_sms' as const, desc: 'Nouvelles réservations, modifications, annulations' },
                    { category: 'Messages voyageurs', emailKey: 'messages_email' as const, smsKey: 'messages_sms' as const, desc: 'Messages reçus de vos voyageurs' },
                    { category: 'Rappels', emailKey: 'reminders_email' as const, smsKey: 'reminders_sms' as const, desc: "Rappels d'arrivée, départ, tâches" },
                    { category: 'Promotions', emailKey: 'promotions_email' as const, smsKey: 'promotions_sms' as const, desc: 'Offres, conseils et mises à jour' },
                  ]).map(item => (
                    <div key={item.category} className="border-b border-gray-100 pb-5 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm" style={{ fontWeight: 600 }}>{item.category}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-6 ml-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.emailKey]}
                              onChange={() => toggleNotif(item.emailKey)}
                              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            />
                            <span className="text-xs text-gray-600">Email</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.smsKey]}
                              onChange={() => toggleNotif(item.smsKey)}
                              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            />
                            <span className="text-xs text-gray-600">SMS</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSaveNotifications}
                  disabled={savingNotifications}
                  className="mt-6 px-6 py-3 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ fontWeight: 600, backgroundColor: '#222222' }}
                >
                  {savingNotifications ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}

            {/* Preferences */}
            {activeSection === 'preferences' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg mb-6" style={{ fontWeight: 600 }}>Préférences</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Langue</label>
                    <select
                      value={prefLanguage}
                      onChange={e => setPrefLanguage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Devise</label>
                    <select
                      value={prefCurrency}
                      onChange={e => setPrefCurrency(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    >
                      <option value="CAD">CAD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Fuseau horaire</label>
                    <select
                      value={prefTimezone}
                      onChange={e => setPrefTimezone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    >
                      <option value="America/Montreal">Montréal (EST)</option>
                      <option value="America/Toronto">Toronto (EST)</option>
                      <option value="America/Vancouver">Vancouver (PST)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Europe/London">Londres (GMT)</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSavePreferences}
                    disabled={savingPreferences}
                    className="px-6 py-3 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ fontWeight: 600, backgroundColor: '#222222' }}
                  >
                    {savingPreferences ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setShowDeactivateModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-xl mb-2" style={{ fontWeight: 600 }}>Désactiver votre compte ?</h2>
            <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-1" style={{ fontWeight: 500 }}>Raison (optionnel)</label>
                <textarea
                  value={deactivateReason}
                  onChange={e => setDeactivateReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ fontWeight: 500 }}>Mot de passe pour confirmer</label>
                <input
                  type="password"
                  value={deactivatePassword}
                  onChange={e => setDeactivatePassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <button
              onClick={handleDeactivate}
              disabled={!deactivatePassword}
              className="w-full px-6 py-3 rounded-lg text-white text-sm mb-3 hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ fontWeight: 600, backgroundColor: '#EF4444' }}
            >
              Désactiver mon compte
            </button>
            <button
              onClick={() => setShowDeactivateModal(false)}
              className="w-full px-6 py-3 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-sm text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`} style={{ fontWeight: 600 }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

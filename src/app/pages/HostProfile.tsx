'use client';

import { useState, useEffect, useRef } from 'react';
import { HostSidebar } from '@/app/components/HostSidebar';
import { userProfileApi, User, listingsApi, Listing } from '@/app/services/api';
import { Camera, Check, X } from 'lucide-react';

const AVAILABLE_INTERESTS = [
  'Voyages', 'Cuisine', 'Sport', 'Musique', 'Nature',
  'Art', 'Tech', 'Lecture', 'Photographie', 'Cinéma',
  'Randonnée', 'Yoga', 'Jardinage', 'Animaux', 'Design',
];

const AVAILABLE_LANGUAGES = [
  'Français', 'English', 'Español', 'Deutsch', 'Italiano',
  'Português', 'العربية', '中文', '日本語', 'Русский',
];

export function HostProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bio form
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [savingBio, setSavingBio] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    try {
      const [profileRes, listingsRes] = await Promise.all([
        userProfileApi.getProfile(),
        listingsApi.getMyListings(),
      ]);
      setProfile(profileRes.user);
      setBio(profileRes.user.bio || '');
      setCity(profileRes.user.city || '');
      setProfession(profileRes.user.profession || '');
      setLanguagesSpoken(profileRes.user.languages_spoken || []);
      setInterests(profileRes.user.interests || []);
      setListings(listingsRes.listings);
    } catch {
      showToast('error', 'Impossible de charger le profil.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'La photo ne doit pas dépasser 5 Mo.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await userProfileApi.uploadPhoto(file);
      setProfile(prev => prev ? { ...prev, profile_photo_url: res.profile_photo_url } : null);
      showToast('success', 'Photo mise à jour.');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de l\'upload.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveBio = async () => {
    setSavingBio(true);
    try {
      const res = await userProfileApi.updateBioProfile({
        bio,
        city,
        profession,
        languages_spoken: languagesSpoken,
        interests,
      });
      setProfile(res.user);
      showToast('success', 'Profil mis à jour.');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSavingBio(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    setLanguagesSpoken(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const getPhotoUrl = (listing: Listing): string => {
    if (listing.photos && listing.photos.length > 0) return listing.photos[0].url;
    return 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Profil</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Photo + Badges */}
            <div className="space-y-6">
              {/* Photo */}
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
                    {profile?.profile_photo_url ? (
                      <img
                        src={profile.profile_photo_url}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-4xl" style={{ fontWeight: 600 }}>
                        {profile?.first_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {uploadingPhoto ? (
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <h2 className="text-lg" style={{ fontWeight: 600 }}>{profile?.first_name} {profile?.last_name}</h2>
                {profile?.member_since && (
                  <p className="text-xs text-gray-500 mt-1">Membre depuis {profile.member_since}</p>
                )}
              </div>

              {/* Badges */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base mb-4" style={{ fontWeight: 600 }}>Vérifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${profile?.email_verified ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {profile?.email_verified ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-400" />}
                    </div>
                    <span className="text-sm" style={{ color: profile?.email_verified ? '#065F46' : '#6B7280' }}>Email vérifié</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${profile?.phone_verified ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {profile?.phone_verified ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-400" />}
                    </div>
                    <span className="text-sm" style={{ color: profile?.phone_verified ? '#065F46' : '#6B7280' }}>Téléphone vérifié</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${profile?.identity_verified ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {profile?.identity_verified ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-400" />}
                    </div>
                    <span className="text-sm" style={{ color: profile?.identity_verified ? '#065F46' : '#6B7280' }}>Identité vérifiée</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Bio + Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base mb-4" style={{ fontWeight: 600 }}>À propos</h3>
                <div className="relative">
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value.slice(0, 500))}
                    placeholder="Parlez de vous aux voyageurs..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] resize-none"
                    rows={4}
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-gray-400">{bio.length}/500</span>
                </div>
              </div>

              {/* Public Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base mb-4" style={{ fontWeight: 600 }}>Informations publiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Ville</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Ex: Montréal"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ fontWeight: 500, color: '#374151' }}>Profession</label>
                    <input
                      type="text"
                      value={profession}
                      onChange={e => setProfession(e.target.value)}
                      placeholder="Ex: Architecte"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base mb-4" style={{ fontWeight: 600 }}>Langues parlées</h3>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const selected = languagesSpoken.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className="px-4 py-2 rounded-full text-sm border transition-colors"
                        style={{
                          fontWeight: 500,
                          backgroundColor: selected ? '#222222' : 'white',
                          color: selected ? 'white' : '#374151',
                          borderColor: selected ? '#222222' : '#D1D5DB',
                        }}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interests */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base mb-4" style={{ fontWeight: 600 }}>Centres d'intérêt</h3>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map(interest => {
                    const selected = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className="px-4 py-2 rounded-full text-sm border transition-colors"
                        style={{
                          fontWeight: 500,
                          backgroundColor: selected ? '#222222' : 'white',
                          color: selected ? 'white' : '#374151',
                          borderColor: selected ? '#222222' : '#D1D5DB',
                        }}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveBio}
                disabled={savingBio}
                className="px-6 py-3 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ fontWeight: 600, backgroundColor: '#222222' }}
              >
                {savingBio ? 'Enregistrement...' : 'Enregistrer le profil'}
              </button>

              {/* My Listings */}
              {listings.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-base mb-4" style={{ fontWeight: 600 }}>Mes annonces ({listings.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listings.map(listing => (
                      <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <img
                          src={getPhotoUrl(listing)}
                          alt={listing.title || ''}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop';
                          }}
                        />
                        <div className="p-3">
                          <p className="text-sm truncate" style={{ fontWeight: 600 }}>
                            {listing.title || 'Annonce sans titre'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {listing.city ?? '—'}{listing.province ? `, ${listing.province}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-sm text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`} style={{ fontWeight: 600 }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

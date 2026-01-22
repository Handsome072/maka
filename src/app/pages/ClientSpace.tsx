import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, Share, Star, ChevronRight, ArrowLeft } from 'lucide-react';
import { ReservationDetail } from '../components/ReservationDetail';
import { HeaderRightMenu } from '../components/HeaderRightMenu';
import { LanguageModal } from '../components/LanguageModal';
import { BecomeHostModal } from '../components/BecomeHostModal';
import { Logo } from '../components/Logo';
import Link from 'next/link';

// Property images from logements section for reservations
const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1595848463742-764e6b5c11d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1646662521253-5b9253b1a207?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1680601531588-1944422d1bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1536494126589-29fadf0d7e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1719849448528-bf30db61d3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1693478075635-bf2742c3ea09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1549387025-c6b3d88e0ccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

interface ClientSpaceProps {
  onNavigate?: (page: 'logements' | 'messages' | 'annonces' | 'host-onboarding') => void;
  initialSection?: 'reservations' | 'profile' | 'security' | 'notifications' | 'payments' | 'languages';
}

export function ClientSpace({ onNavigate, initialSection = 'reservations' }: ClientSpaceProps = {}) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'reservations' | 'profile' | 'security' | 'notifications' | 'payments' | 'languages'>(initialSection);
  const [showReservationDetail, setShowReservationDetail] = useState(false);
  const [paymentsTab, setPaymentsTab] = useState<'paiements' | 'versements' | 'frais'>('paiements');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'none' | 'intro' | 'choice' | 'form'>('none');
  const [verificationType, setVerificationType] = useState<'official' | 'id'>('official');
  const [payoutStep, setPayoutStep] = useState<'none' | 'method' | 'owner' | 'details'>('none');
  const [payoutMethod, setPayoutMethod] = useState<'international' | 'payoneer'>('international');
  const [notificationsTab, setNotificationsTab] = useState<'offres' | 'compte'>('offres');
  const [editingOfficialName, setEditingOfficialName] = useState(false);
  const [editingPreferredName, setEditingPreferredName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [addingResidentialAddress, setAddingResidentialAddress] = useState(false);
  const [addingPostalAddress, setAddingPostalAddress] = useState(false);
  const [addingEmergencyContact, setAddingEmergencyContact] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Mobile view state - true shows content, false shows sidebar
  const [showMobileContent, setShowMobileContent] = useState(false);

  // Header menu state
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);

  // Si on affiche le détail de la réservation
  if (showReservationDetail) {
    return <ReservationDetail onClose={() => setShowReservationDetail(false)} />;
  }

  // Si on affiche le processus de vérification d'identité
  if (verificationStep !== 'none') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 px-6 lg:px-20 py-4 flex items-center justify-between">
          <button
            onClick={() => setVerificationStep('none')}
            className="flex items-center gap-1 flex-shrink-0 border-0 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="HOMIQIO Logo"
              className="w-[150px] h-auto border-0"
            />
          </button>
        </header>

        {/* Étape 1: Introduction */}
        {verificationStep === 'intro' && (
          <div className="max-w-lg mx-auto px-6 py-16">
            <h1 className="text-2xl text-center mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Faites vérifier votre identité pour effectuer une réservation ou accueillir des voyageurs
            </h1>
            <p className="text-center text-sm text-gray-600 mb-8">
              Nous demandons aux utilisateurs de faire vérifier leur identité pour assurer la sécurité de la communauté HOMIQIO.
            </p>

            {/* Icône de profil */}
            <div className="flex justify-center mb-8">
              <div className="relative bg-gray-100 rounded-2xl p-12 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                      1
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-12 h-3 bg-gray-300 rounded"></div>
                    <div className="w-12 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setVerificationStep('choice')}
              className="w-full py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800 mb-4"
              style={{ fontWeight: 600 }}
            >
              Continuer
            </button>

            <button className="text-sm underline mx-auto block" style={{ fontWeight: 600, color: '#222222' }}>
              Comment fonctionne la vérification d'identité ?
            </button>
          </div>
        )}

        {/* Étape 2: Choix du type */}
        {verificationStep === 'choice' && (
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="flex gap-12">
              {/* Colonne gauche */}
              <div className="flex-1">
                <h1 className="text-2xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
                  Quel type d'informations souhaitez-vous fournir ?
                </h1>

                {/* Option 1: Nom officiel et adresse */}
                <div
                  onClick={() => setVerificationType('official')}
                  className="border-2 rounded-xl p-6 mb-4 cursor-pointer transition-colors"
                  style={{ borderColor: verificationType === 'official' ? '#222222' : '#DDDDDD' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                      Nom officiel et adresse
                    </h3>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: verificationType === 'official' ? '#222222' : '#DDDDDD' }}>
                      {verificationType === 'official' && (
                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Vos informations seront vérifiées par nos partenaires de confiance.
                  </p>
                </div>

                {/* Option 2: Pièce d'identité */}
                <div
                  onClick={() => setVerificationType('id')}
                  className="border-2 rounded-xl p-6 mb-6 cursor-pointer transition-colors"
                  style={{ borderColor: verificationType === 'id' ? '#222222' : '#DDDDDD' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                      Pièce d'identité
                    </h3>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: verificationType === 'id' ? '#222222' : '#DDDDDD' }}>
                      {verificationType === 'id' && (
                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Vous prendrez des photos que notre équipe vérifiera.
                  </p>
                  <p className="text-sm text-gray-600">
                    Vos informations sont traitées conformément à notre{' '}
                    <a href="#" className="underline">Politique de confidentialité</a>.{' '}
                    <a href="#" className="underline">En savoir plus sur la vérification d'identité</a>
                  </p>
                </div>

                {/* Boutons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setVerificationStep('none')}
                    className="text-base underline"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    Terminer plus tard
                  </button>
                  <button
                    onClick={() => setVerificationStep('form')}
                    className="px-8 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800"
                    style={{ fontWeight: 600 }}
                  >
                    Continuer
                  </button>
                </div>
              </div>

              {/* Colonne droite: Votre confidentialité */}
              <div className="w-80 bg-gray-50 rounded-xl p-6 self-start">
                <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  Votre confidentialité
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Nous veillons à assurer la confidentialité et la protection des données que vous nous transmettez dans le cadre de ce processus. Pour en savoir plus, consultez notre{' '}
                  <a href="#" className="underline" style={{ fontWeight: 600 }}>Politique de confidentialité</a>.
                </p>
                <a href="#" className="text-sm underline" style={{ fontWeight: 600, color: '#222222' }}>
                  Découvrir le fonctionnement
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Formulaire */}
        {verificationStep === 'form' && (
          <div className="max-w-xl mx-auto px-6 py-16">
            <h1 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Fournissez vos informations légales
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Nous utiliserons ces informations pour vérifier votre identité par l'intermédiaire de nos partenaires de confiance.
            </p>

            <div className="space-y-6">
              {/* Nom officiel */}
              <div>
                <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  Vérifiez votre nom officiel
                </h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Prénom"
                      defaultValue="Andson"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Nom"
                      defaultValue="Rajsona"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Assurez-vous que le nom correspond à celui qui figure sur votre pièce d'identité.
                </p>
              </div>

              {/* Adresse */}
              <div>
                <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  Ajoutez votre adresse
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Il s'agit de l'adresse où vous recevez des documents bancaires ou des factures de type électricité ou eau.
                </p>
                <div className="space-y-3">
                  <div>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                      defaultValue="Brésil"
                    >
                      <option>Pays/région</option>
                      <option>Brésil</option>
                      <option>France</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Adresse postale"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">ex. Rua Bossoroca, 1</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Appartement, bâtiment (facultatif)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">ex. apt 50</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Quartier (le cas échéant)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">ex. Vila Madalena</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Ville"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">ex. Campinas</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="État"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">ex. SP</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Code postal"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">ex. 4377190</p>
                  </div>
                </div>
              </div>

              {/* Note légale */}
              <p className="text-xs text-gray-500">
                Vos informations sont traitées conformément à notre{' '}
                <a href="#" className="underline">Politique de confidentialité</a>.{' '}
                <a href="#" className="underline">En savoir plus sur la vérification d'identité</a>
              </p>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
              <button
                onClick={() => setVerificationStep('choice')}
                className="flex items-center gap-2 text-base"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              <button
                onClick={() => setVerificationStep('none')}
                className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg text-base cursor-not-allowed"
                style={{ fontWeight: 600 }}
                disabled
              >
                Envoyer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Si on affiche le processus de configuration des versements
  if (payoutStep !== 'none') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 px-6 lg:px-20 py-5 flex items-center justify-between">
          <button
            onClick={() => setPayoutStep('none')}
            className="text-sm underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Quitter
          </button>
        </header>

        {/* Étape 1: Choix du mode de versement */}
        {payoutStep === 'method' && (
          <div className="max-w-xl mx-auto px-6 py-16">
            <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222' }}>
              Ajoutez un mode de versement
            </h1>
            <p className="text-sm text-gray-600 mb-12 text-center">
              Pour commencer, indiquez-nous où vous souhaitez recevoir vos gains.
            </p>

            <div className="mb-8">
              <label htmlFor="country" className="text-sm block mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Pays/région de facturation
              </label>
              <select
                id="country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                style={{ fontWeight: 400, color: '#222222' }}
              >
                <option>Madagascar</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                <a href="#" className="underline">Pourquoi nous avons besoin de vos informations</a>
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Comment souhaitez-vous recevoir vos paiements ?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                La disponibilité des paiements peut varier selon le mode de versement choisi.
              </p>

              {/* Virement international */}
              <div
                onClick={() => setPayoutMethod('international')}
                className={`border-2 rounded-xl p-6 mb-4 cursor-pointer transition-colors ${payoutMethod === 'international' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: payoutMethod === 'international' ? '#222222' : '#DDDDDD' }}>
                    {payoutMethod === 'international' && (
                      <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                        Virement international
                      </h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      <li>2 à 7 jours ouvrés</li>
                      <li>Des frais peuvent s'appliquer</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payoneer */}
              <div
                onClick={() => setPayoutMethod('payoneer')}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-colors ${payoutMethod === 'payoneer' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: payoutMethod === 'payoneer' ? '#222222' : '#DDDDDD' }}>
                    {payoutMethod === 'payoneer' && (
                      <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                        Payoneer
                      </h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      <li>Carte de débit prépayée Mastercard</li>
                      <li>Envoi par courrier standard (7 à 10 jours ouvrés)</li>
                      <li>Des frais Payoneer peuvent s'appliquer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-8">
              À l'étape des versements, les paiements feront l'objet de vérifications. Nous pourrons exiger des suppressions et annuler des réservations si nous détectons un lien avec un pays sous sanctions. En savoir plus
            </p>

            <button
              onClick={() => setPayoutStep('owner')}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
              style={{ fontWeight: 600 }}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Étape 2: Titulaire du compte */}
        {payoutStep === 'owner' && (
          <div className="max-w-xl mx-auto px-6 py-16">
            <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222' }}>
              Ajoutez le titulaire du compte bancaire
            </h1>

            <div className="mt-12 mb-8">
              <label htmlFor="owner-country" className="text-sm block mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                À qui appartient le compte bancaire ?
              </label>
              <select
                id="owner-country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                style={{ fontWeight: 400, color: '#222222' }}
              >
                <option>Andson Rajsona</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Choisissez parmi les personnes que vous avez ajoutées sur votre compte HOMIQIO.{' '}
                <a href="#" className="underline">En savoir plus</a>
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setPayoutStep('method')}
                className="flex-1 py-2.5 border border-gray-900 rounded-lg text-sm transition-colors hover:bg-gray-50"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Retour
              </button>
              <button
                onClick={() => setPayoutStep('details')}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                style={{ fontWeight: 600 }}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 3: Coordonnées bancaires */}
        {payoutStep === 'details' && (
          <div className="max-w-xl mx-auto px-6 py-16">
            <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222' }}>
              Saisissez vos coordonnées bancaires
            </h1>

            <div className="mt-12 space-y-6 mb-8">
              {/* Code SWIFT/BIC */}
              <div>
                <label htmlFor="swift" className="text-sm block mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Code SWIFT/BIC
                </label>
                <input
                  type="text"
                  id="swift"
                  placeholder="Code swift / bic"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Le code SWIFT ou BIC est généralement composé de 8 ou 11 caractères, et se termine souvent par le code du compte ou de l'agence (p. ex. BNPAFRPPXXX ou BNPAFRPP). Si vous le connaissez, vous pourrez nous fournir le code du compte ou de l'agence lors de l'étape suivante.
                </p>
              </div>

              {/* IBAN */}
              <div>
                <label htmlFor="iban" className="text-sm block mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  IBAN
                </label>
                <input
                  type="text"
                  id="iban"
                  placeholder="IBAN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Le numéro IBAN (numéro de compte bancaire international) se compose de 14 ou 27 lettres et chiffres. Pour trouver le vôtre, vérifiez votre relevé bancaire ou sur une coordonnée bancaire.
                </p>
              </div>

              {/* Confirmation IBAN */}
              <div>
                <label htmlFor="iban-confirm" className="text-sm block mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Confirmez le numéro IBAN
                </label>
                <input
                  type="text"
                  id="iban-confirm"
                  placeholder="Confirmez le numéro IBAN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Vous manquez déjà d'idées ? Pour éviter tout retard, assurez-vous que tous les détails sont corrects.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setPayoutStep('owner')}
                className="flex-1 py-2.5 border border-gray-900 rounded-lg text-sm transition-colors hover:bg-gray-50"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Retour
              </button>
              <button
                onClick={() => setPayoutStep('none')}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                style={{ fontWeight: 600 }}
              >
                Envoyer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-12 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="cursor-pointer"
                >
                  <Logo className="h-10 md:h-12 w-auto" />
                </Link>
              </div>

              <HeaderRightMenu
                showMenuDropdown={showMenuDropdown}
                setShowMenuDropdown={setShowMenuDropdown}
                setShowLanguageModal={setShowLanguageModal}
                setShowBecomeHostModal={setShowBecomeHostModal}
                onAuthClick={() => onNavigate?.('login')}
                onClientSpaceClick={() => { }}
                onMessagesClick={() => onNavigate?.('messages')}
                isHost={false}
                onAnnoncesClick={() => onNavigate?.('annonces')}
              />
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar - Conditionally visible on mobile, always visible on desktop */}
          <aside className={`w-full md:w-[380px] border-r border-gray-200 min-h-[calc(100vh-73px)] ${showMobileContent ? 'hidden md:flex' : 'flex'} flex-col bg-white`}>
            <div className="px-6 pt-6 pb-4">
              <h1 className="text-xl md:text-2xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
                Espace client
              </h1>

            <nav className="space-y-5">
              <button
                onClick={() => {
                  setActiveSection('reservations');
                  setShowMobileContent(true);
                }}
                className={`w-full flex items-center gap-4 text-left transition-colors ${activeSection === 'reservations'
                  ? ''
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <svg className="w-9 h-9 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-sm" style={{ fontWeight: activeSection === 'reservations' ? 600 : 400, color: '#222222' }}>
                  Mes réservations
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('profile');
                  setShowMobileContent(true);
                }}
                className={`w-full flex items-center gap-4 text-left transition-colors ${activeSection === 'profile'
                  ? ''
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-base flex-shrink-0" style={{ fontWeight: 600 }}>
                  {user?.name.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-sm" style={{ fontWeight: activeSection === 'profile' ? 600 : 400, color: '#222222' }}>
                  Informations personnelles
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('security');
                  setShowMobileContent(true);
                }}
                className={`w-full flex items-center gap-4 text-left transition-colors ${activeSection === 'security'
                  ? ''
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <svg className="w-9 h-9 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm" style={{ fontWeight: activeSection === 'security' ? 600 : 400, color: '#222222' }}>
                  Connexion et sécurité
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('notifications');
                  setShowMobileContent(true);
                }}
                className={`w-full flex items-center gap-4 text-left transition-colors ${activeSection === 'notifications'
                  ? ''
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <svg className="w-9 h-9 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm" style={{ fontWeight: activeSection === 'notifications' ? 600 : 400, color: '#222222' }}>
                  Notifications
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('payments');
                  setShowMobileContent(true);
                }}
                className={`w-full flex items-center gap-4 text-left transition-colors ${activeSection === 'payments'
                  ? ''
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <svg className="w-9 h-9 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm" style={{ fontWeight: activeSection === 'payments' ? 600 : 400, color: '#222222' }}>
                  Paiements
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('languages');
                  setShowMobileContent(true);
                }}
                className={`w-full flex items-center gap-4 text-left transition-colors ${activeSection === 'languages'
                  ? ''
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <svg className="w-9 h-9 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm" style={{ fontWeight: activeSection === 'languages' ? 600 : 400, color: '#222222' }}>
                  Langues et devise
                </span>
              </button>
            </nav>
            </div>
          </aside>

          {/* Main Content - Conditionally visible on mobile, always visible on desktop */}
          <main className={`flex-1 flex-col bg-white ${!showMobileContent ? 'hidden md:flex' : 'flex'}`}>
            {activeSection === 'reservations' && (
              <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8">
                <div className="flex items-center gap-3 mb-8">
                  <button
                    onClick={() => setShowMobileContent(false)}
                    className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                  </button>
                  <h2 className="text-xl md:text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
                    Mes réservations
                  </h2>
                </div>

                {/* RÉSERVATION(S) FUTURE(S) */}
                <div className="mb-8">
                  <h3 className="text-xs mb-4" style={{ fontWeight: 700, color: '#4A5B8C', letterSpacing: '0.5px' }}>
                    RÉSERVATION(S) FUTURE(S)
                  </h3>

                  <div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setShowReservationDetail(true)}
                  >
                    <img
                      src={PROPERTY_IMAGES[4]}
                      alt="Appartement"
                      className="w-full md:w-48 h-40 md:h-32 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-base font-medium mb-1.5" style={{ color: '#4A5B8C' }}>
                        Appartement T2
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Date d'arrivée : <span className="font-semibold">03/09/2024</span> | <span className="font-semibold">1 occupant</span>
                      </p>

                      <div className="flex items-center gap-3 md:gap-4 flex-wrap mt-auto">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Croix Verte</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                          </svg>
                          <span>2</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          <span>1</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-16 0h16m-16 0v10a2 2 0 002 2h12a2 2 0 002-2V8m-16 0h16" />
                          </svg>
                          <span>42m2</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>T2</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>3 à 4</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-end gap-3 min-w-[140px]">
                      <div
                        className="rounded-md px-3 py-2 flex flex-col items-center justify-center w-full"
                        style={{ backgroundColor: '#222222' }}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                          <span className="text-[10px] text-white opacity-90 whitespace-nowrap font-medium">TOTAL / MOIS</span>
                        </div>
                        <span className="text-lg text-white font-bold">700 €</span>
                      </div>

                      <button
                        className="px-4 py-2 border border-gray-300 rounded-md text-[11px] font-semibold hover:bg-gray-50 transition-colors bg-white w-full uppercase"
                        style={{ color: '#222222' }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>

                {/* DERNIÈRES RÉSERVATIONS */}
                <div className="mb-8">
                  <h3 className="text-xs mb-4" style={{ fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px' }}>
                    DERNIÈRES RÉSERVATIONS
                  </h3>

                  <div className="space-y-4">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 cursor-pointer hover:shadow-md transition-shadow">
                        <img
                          src={PROPERTY_IMAGES[index % PROPERTY_IMAGES.length]}
                          alt="Appartement"
                          className="w-full md:w-48 h-40 md:h-32 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="text-base font-medium mb-1.5" style={{ color: '#9CA3AF' }}>
                            Appartement T2
                          </h4>
                          <p className="text-xs text-gray-400 mb-2">
                            Date d'arrivée : <span className="font-semibold">03/09/2024</span> | <span className="font-semibold">1 occupant</span>
                          </p>

                          <div className="flex items-center gap-3 md:gap-4 flex-wrap mt-auto">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>Croix Verte</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                              </svg>
                              <span>2</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                              </svg>
                              <span>1</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-16 0h16m-16 0v10a2 2 0 002 2h12a2 2 0 002-2V8m-16 0h16" />
                              </svg>
                              <span>42m2</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>T2</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>3 à 4</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-end gap-3 min-w-[140px]">
                          <div
                            className="rounded-md px-3 py-2 flex flex-col items-center justify-center w-full"
                            style={{ backgroundColor: '#9CA3AF' }}
                          >
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                              </svg>
                              <span className="text-[10px] text-white opacity-90 whitespace-nowrap font-medium">TOTAL / MOIS</span>
                            </div>
                            <span className="text-lg text-white font-bold">700 €</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RÉSERVATIONS ANNULÉES */}
                <div>
                  <h3 className="text-xs mb-4" style={{ fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px' }}>
                    RÉSERVATIONS ANNULÉES
                  </h3>

                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
                    <img
                      src={PROPERTY_IMAGES[3]}
                      alt="Appartement"
                      className="w-full md:w-48 h-40 md:h-32 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-base font-medium mb-1.5" style={{ color: '#9CA3AF' }}>
                        Appartement T2
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">
                        Date d'arrivée : <span className="font-semibold">03/09/2024</span> | <span className="font-semibold">1 occupant</span>
                      </p>

                      <div className="flex items-center gap-3 md:gap-4 flex-wrap mt-auto">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Croix Verte</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                          </svg>
                          <span>2</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          <span>1</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-16 0h16m-16 0v10a2 2 0 002 2h12a2 2 0 002-2V8m-16 0h16" />
                          </svg>
                          <span>42m2</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>T2</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>3 à 4</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-end gap-3 min-w-[140px]">
                      <div
                        className="rounded-md px-3 py-2 flex flex-col items-center justify-center w-full"
                        style={{ backgroundColor: '#9CA3AF' }}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                          <span className="text-[10px] text-white opacity-90 whitespace-nowrap font-medium">TOTAL / MOIS</span>
                        </div>
                        <span className="text-lg text-white font-bold">700 €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8">
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <button
                      onClick={() => setShowMobileContent(false)}
                      className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                    </button>
                    <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
                      Informations personnelles
                    </h2>
                  </div>

                {/* Liste des informations */}
                <div className="space-y-0">
                  {(() => {
                    const isAnyEditing = editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact;
                    return null;
                  })()}
                  {/* Nom officiel */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm md:text-base mb-1 ${editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? '#D3D3D3' : '#222222' }}>
                          Nom officiel
                        </h4>
                        <p className={`text-sm ${editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : 'text-gray-600'}`}>
                          {editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? 'Andson Rajsona' : 'Anderson Rajliona'}
                        </p>
                      </div>
                      {!editingPreferredName && !editingEmail && !addingResidentialAddress && !addingPostalAddress && !addingEmergencyContact && (
                        <button
                          onClick={() => {
                            setEditingOfficialName(true);
                            setActiveSection('profile');
                          }}
                          className="text-sm underline"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          Modifier
                        </button>
                      )}
                      {(editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact) && (
                        <button
                          className="text-sm underline text-gray-400"
                          style={{ fontWeight: 600 }}
                          disabled
                        >
                          Modifier
                        </button>
                      )}
                    </div>

                    {/* Formulaire d'édition du nom officiel */}
                    {editingOfficialName && !editingPreferredName && !editingEmail && !addingResidentialAddress && !addingPostalAddress && !addingEmergencyContact && (
                      <div className="mt-6">
                        <p className="text-sm mb-4" style={{ color: '#717171' }}>
                          Assurez-vous que le nom correspond à celui qui figure sur votre pièce d'identité.
                        </p>
                        <div className="space-y-4 mb-6">
                          <input
                            type="text"
                            placeholder="Prénom sur la pièce d'identité"
                            defaultValue="Andson"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Nom sur la pièce d'identité"
                            defaultValue="Rajsona"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditingOfficialName(false)}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                            style={{ fontWeight: 600 }}
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={() => setEditingOfficialName(false)}
                            className="text-base underline"
                            style={{ fontWeight: 600, color: '#222222' }}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prénom d'usage */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm md:text-base mb-1 ${editingOfficialName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingOfficialName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? '#D3D3D3' : '#222222' }}>
                          Prénom d'usage
                        </h4>
                        {!editingPreferredName ? (
                          <p className={`text-sm ${editingOfficialName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ color: editingOfficialName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? '#D3D3D3' : '#0071E3' }}>
                            Information non fournie
                          </p>
                        ) : (
                          <p className="text-sm" style={{ color: '#717171' }}>
                            Voici comment votre prénom s'affichera pour les hôtes et les voyageurs.{' '}
                            <a href="#" className="underline">En savoir plus</a>
                          </p>
                        )}
                      </div>
                      {!editingOfficialName && !editingEmail && !addingResidentialAddress && !addingPostalAddress && !addingEmergencyContact && (
                        <button
                          onClick={() => setEditingPreferredName(true)}
                          className="text-sm underline"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          {editingPreferredName ? 'Annuler' : 'Ajouter'}
                        </button>
                      )}
                      {(editingOfficialName || editingEmail || addingResidentialAddress || addingPostalAddress || addingEmergencyContact) && (
                        <button
                          className="text-sm underline text-gray-400"
                          style={{ fontWeight: 600 }}
                          disabled
                        >
                          Ajouter
                        </button>
                      )}
                    </div>

                    {/* Formulaire d'ajout du prénom d'usage */}
                    {editingPreferredName && !editingOfficialName && !editingEmail && !addingResidentialAddress && !addingPostalAddress && !addingEmergencyContact && (
                      <div className="mt-6">
                        <div className="mb-6">
                          <input
                            type="text"
                            placeholder="Prénom d'usage (facultatif)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditingPreferredName(false)}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                            style={{ fontWeight: 600 }}
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={() => setEditingPreferredName(false)}
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
                        <h4 className={`text-sm md:text-base mb-1 ${editingOfficialName || editingPreferredName || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? '#D3D3D3' : '#222222' }}>
                          Adresse e-mail
                        </h4>
                        <p className={`text-sm ${editingOfficialName || editingPreferredName || addingResidentialAddress || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : 'text-gray-600'}`}>
                          a***y@gmail.com
                        </p>
                      </div>
                      {!editingOfficialName && !editingPreferredName && !addingResidentialAddress && !addingPostalAddress && !addingEmergencyContact && (
                        <button
                          onClick={() => setEditingEmail(true)}
                          className="text-sm underline"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          Modifier
                        </button>
                      )}
                      {(editingOfficialName || editingPreferredName || addingResidentialAddress || addingPostalAddress || addingEmergencyContact) && (
                        <button
                          className="text-sm underline text-gray-400"
                          style={{ fontWeight: 600 }}
                          disabled
                        >
                          Modifier
                        </button>
                      )}
                    </div>

                    {/* Formulaire d'édition de l'email */}
                    {editingEmail && !editingOfficialName && !editingPreferredName && !addingResidentialAddress && !addingPostalAddress && !addingEmergencyContact && (
                      <div className="mt-6">
                        <p className="text-sm mb-4" style={{ color: '#717171' }}>
                          Utilisez une adresse à laquelle vous aurez toujours accès.
                        </p>
                        <div className="mb-6">
                          <input
                            type="email"
                            placeholder="Adresse e-mail"
                            defaultValue="a***y@gmail.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditingEmail(false)}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                            style={{ fontWeight: 600 }}
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={() => setEditingEmail(false)}
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
                        <h4 className={`text-sm md:text-base mb-1 ${editingOfficialName || editingPreferredName || editingEmail ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || editingEmail ? '#D3D3D3' : '#222222' }}>
                          Numéro de téléphone
                        </h4>
                        <p className={`text-sm ${editingOfficialName || editingPreferredName || editingEmail ? 'text-gray-400' : 'text-gray-600'}`}>
                          Ajoutez un numéro pour que les voyageurs confirmés et HOMIQIO puissent vous joindre. Vous pouvez ajouter d'autres numéros et choisir leur utilisation.
                        </p>
                      </div>
                      <button
                        className={`text-sm underline flex-shrink-0 ml-4 ${editingOfficialName || editingPreferredName || editingEmail ? 'text-gray-400' : ''}`}
                        style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || editingEmail ? '#D3D3D3' : '#222222' }}
                        disabled={editingOfficialName || editingPreferredName || editingEmail}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Vérification d'identité */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm md:text-base mb-1 ${editingOfficialName || editingPreferredName || editingEmail ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || editingEmail ? '#D3D3D3' : '#222222' }}>
                          Vérification d'identité
                        </h4>
                        <p className={`text-sm ${editingOfficialName || editingPreferredName || editingEmail ? 'text-gray-400' : 'text-gray-600'}`}>
                          Procédure non commencée
                        </p>
                      </div>
                      <button
                        onClick={() => !editingOfficialName && !editingPreferredName && !editingEmail && setVerificationStep('intro')}
                        className={`text-sm underline flex-shrink-0 ml-4 ${editingOfficialName || editingPreferredName || editingEmail ? 'text-gray-400' : ''}`}
                        style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || editingEmail ? '#D3D3D3' : '#222222' }}
                        disabled={editingOfficialName || editingPreferredName || editingEmail}
                      >
                        Commencer
                      </button>
                    </div>
                  </div>

                  {/* Adresse résidentielle */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm md:text-base mb-1 ${editingOfficialName || editingPreferredName || editingEmail || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || editingEmail || addingPostalAddress || addingEmergencyContact ? '#D3D3D3' : '#222222' }}>
                          Adresse résidentielle
                        </h4>
                        <p className={`text-sm ${editingOfficialName || editingPreferredName || editingEmail || addingPostalAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ color: editingOfficialName || editingPreferredName || editingEmail || addingPostalAddress || addingEmergencyContact ? '#D3D3D3' : '#0071E3' }}>
                          Information non fournie
                        </p>
                      </div>
                      {!editingOfficialName && !editingPreferredName && !editingEmail && !addingPostalAddress && !addingEmergencyContact && (
                        <button
                          onClick={() => setAddingResidentialAddress(true)}
                          className="text-sm underline flex-shrink-0 ml-4"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          Ajouter
                        </button>
                      )}
                      {(editingOfficialName || editingPreferredName || editingEmail || addingPostalAddress || addingEmergencyContact) && (
                        <button
                          className="text-sm underline flex-shrink-0 ml-4 text-gray-400"
                          style={{ fontWeight: 600 }}
                          disabled
                        >
                          Ajouter
                        </button>
                      )}
                    </div>

                    {/* Formulaire d'ajout d'adresse résidentielle */}
                    {addingResidentialAddress && !editingOfficialName && !editingPreferredName && !editingEmail && !addingPostalAddress && !addingEmergencyContact && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                            Adresse résidentielle
                          </h4>
                          <button
                            onClick={() => setAddingResidentialAddress(false)}
                            className="text-base underline"
                            style={{ fontWeight: 600, color: '#222222' }}
                          >
                            Annuler
                          </button>
                        </div>
                        <div className="space-y-4 mb-6">
                          <div>
                            <select
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                              defaultValue="Madagascar"
                            >
                              <option value="" disabled>Pays/région</option>
                              <option value="Madagascar">Madagascar</option>
                              <option value="France">France</option>
                              <option value="USA">États-Unis</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            placeholder="Numéro et libellé de voie"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Appartement, étage, immeuble (si applicable)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Commune"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Province/État/territoire (si applicable)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Code postal (si applicable)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <button
                          className="px-6 py-2.5 rounded-lg text-sm cursor-not-allowed"
                          style={{
                            fontWeight: 600,
                            backgroundColor: '#EBEBEB',
                            color: '#B0B0B0'
                          }}
                          disabled
                        >
                          Enregistrer
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Adresse postale */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm md:text-base mb-1 ${editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingEmergencyContact ? '#D3D3D3' : '#222222' }}>
                          Adresse postale
                        </h4>
                        <p className={`text-sm ${editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingEmergencyContact ? 'text-gray-400' : ''}`} style={{ color: editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingEmergencyContact ? '#D3D3D3' : '#0071E3' }}>
                          Information non fournie
                        </p>
                      </div>
                      {!editingOfficialName && !editingPreferredName && !editingEmail && !addingResidentialAddress && !addingEmergencyContact && (
                        <button
                          onClick={() => setAddingPostalAddress(true)}
                          className="text-sm underline flex-shrink-0 ml-4"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          Ajouter
                        </button>
                      )}
                      {(editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingEmergencyContact) && (
                        <button
                          className="text-sm underline flex-shrink-0 ml-4 text-gray-400"
                          style={{ fontWeight: 600 }}
                          disabled
                        >
                          Ajouter
                        </button>
                      )}
                    </div>

                    {/* Formulaire d'ajout d'adresse postale */}
                    {addingPostalAddress && !editingOfficialName && !editingPreferredName && !editingEmail && !addingResidentialAddress && !addingEmergencyContact && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                            Adresse postale
                          </h4>
                          <button
                            onClick={() => setAddingPostalAddress(false)}
                            className="text-base underline"
                            style={{ fontWeight: 600, color: '#222222' }}
                          >
                            Annuler
                          </button>
                        </div>
                        <div className="space-y-4 mb-6">
                          <div>
                            <select
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                              defaultValue="France"
                            >
                              <option value="" disabled>Pays/région</option>
                              <option value="Madagascar">Madagascar</option>
                              <option value="France">France</option>
                              <option value="USA">États-Unis</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            placeholder="Adresse postale"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Appartement, bâtiment (facultatif)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Code postal"
                              className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <input
                              type="text"
                              placeholder="Ville"
                              className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                        <button
                          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                          style={{ fontWeight: 600 }}
                          onClick={() => setAddingPostalAddress(false)}
                        >
                          Enregistrer
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Numéros d'urgence */}
                  <div className="py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm md:text-base mb-1 ${editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress ? 'text-gray-400' : ''}`} style={{ fontWeight: 600, color: editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress ? '#D3D3D3' : '#222222' }}>
                          Numéros d'urgence
                        </h4>
                        {!addingEmergencyContact ? (
                          <p className={`text-sm ${editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress ? 'text-gray-400' : ''}`} style={{ color: editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress ? '#D3D3D3' : '#0071E3' }}>
                            Information non fournie
                          </p>
                        ) : (
                          <p className="text-sm" style={{ color: '#717171' }}>
                            Un contact de confiance que nous pourrons appeler en cas d'urgence.
                          </p>
                        )}
                      </div>
                      {!editingOfficialName && !editingPreferredName && !editingEmail && !addingResidentialAddress && !addingPostalAddress && (
                        <button
                          onClick={() => setAddingEmergencyContact(true)}
                          className="text-sm underline flex-shrink-0 ml-4"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          {addingEmergencyContact ? 'Annuler' : 'Ajouter'}
                        </button>
                      )}
                      {(editingOfficialName || editingPreferredName || editingEmail || addingResidentialAddress || addingPostalAddress) && (
                        <button
                          className="text-sm underline flex-shrink-0 ml-4 text-gray-400"
                          style={{ fontWeight: 600 }}
                          disabled
                        >
                          Ajouter
                        </button>
                      )}
                    </div>

                    {/* Formulaire d'ajout de numéro d'urgence */}
                    {addingEmergencyContact && !editingOfficialName && !editingPreferredName && !editingEmail && !addingResidentialAddress && !addingPostalAddress && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                            Numéros d'urgence
                          </h4>
                          <button
                            onClick={() => setAddingEmergencyContact(false)}
                            className="text-base underline"
                            style={{ fontWeight: 600, color: '#222222' }}
                          >
                            Annuler
                          </button>
                        </div>
                        <div className="space-y-4 mb-6">
                          <input
                            type="text"
                            placeholder="Nom"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Relation"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <div>
                            <select
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                              defaultValue=""
                            >
                              <option value="" disabled>Langue préférée</option>
                              <option value="fr">Français</option>
                              <option value="en">Anglais</option>
                              <option value="es">Espagnol</option>
                            </select>
                          </div>
                          <input
                            type="email"
                            placeholder="Adresse e-mail"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <div className="grid grid-cols-[180px_1fr] gap-4">
                            <select
                              className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                              defaultValue=""
                            >
                              <option value="" disabled>Indicatif téléphonique...</option>
                              <option value="+33">+33 (France)</option>
                              <option value="+1">+1 (USA)</option>
                              <option value="+261">+261 (Madagascar)</option>
                            </select>
                            <input
                              type="tel"
                              placeholder="Numéro de téléphone"
                              className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                        <button
                          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                          style={{ fontWeight: 600 }}
                          onClick={() => setAddingEmergencyContact(false)}
                        >
                          Enregistrer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8">
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <button
                      onClick={() => setShowMobileContent(false)}
                      className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                    </button>
                    <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
                      Connexion et sécurité
                    </h2>
                  </div>

                {/* Connexion Section */}
                <div className="mb-12">
                  <h3 className="text-lg md:text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                    Connexion
                  </h3>

                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                          Mot de passe
                        </h4>
                        {!updatingPassword && (
                          <p className="text-sm" style={{ color: '#C13515' }}>
                            Dernière mise à jour le il y a 4 heures
                          </p>
                        )}
                      </div>
                      {!updatingPassword && (
                        <button
                          onClick={() => setUpdatingPassword(true)}
                          className="text-base underline"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          Mettre à jour
                        </button>
                      )}
                      {updatingPassword && (
                        <button
                          onClick={() => setUpdatingPassword(false)}
                          className="text-base underline"
                          style={{ fontWeight: 600, color: '#222222' }}
                        >
                          Annuler
                        </button>
                      )}
                    </div>

                    {/* Formulaire de mise à jour du mot de passe */}
                    {updatingPassword && (
                      <div className="mt-6">
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm mb-2" style={{ color: '#222222' }}>
                              Nouveau mot de passe
                            </label>
                            <input
                              type="password"
                              placeholder=""
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-2" style={{ color: '#222222' }}>
                              Confirmer le mot de passe
                            </label>
                            <input
                              type="password"
                              placeholder=""
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                        <button
                          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                          style={{ fontWeight: 600 }}
                          onClick={() => setUpdatingPassword(false)}
                        >
                          Mettre à jour le mot de passe
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compte Section */}
                <div className="mb-12">
                  <h3 className="text-lg md:text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                    Compte
                  </h3>

                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                          Désactivation de votre compte
                        </h4>
                        <p className="text-sm text-gray-600">
                          Cette action est définitive
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeactivateModal(true)}
                        className="text-base underline"
                        style={{ fontWeight: 600, color: '#222222' }}
                      >
                        Désactiver
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8">
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <button
                      onClick={() => setShowMobileContent(false)}
                      className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                    </button>
                    <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
                      Notifications
                    </h2>
                  </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-gray-300">
                  <button
                    onClick={() => setNotificationsTab('offres')}
                    className={`pb-3 text-base ${notificationsTab === 'offres' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    style={{ fontWeight: notificationsTab === 'offres' ? 600 : 400, color: notificationsTab === 'offres' ? '#222222' : '#6B7280' }}
                  >
                    Offres et mises à jour
                  </button>
                  <button
                    onClick={() => setNotificationsTab('compte')}
                    className={`pb-3 text-base ${notificationsTab === 'compte' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    style={{ fontWeight: notificationsTab === 'compte' ? 600 : 400, color: notificationsTab === 'compte' ? '#222222' : '#6B7280' }}
                  >
                    Compte
                  </button>
                </div>

                {/* Tab: Compte */}
                {notificationsTab === 'compte' && (
                  <>
                    {/* Activité du compte et politiques */}
                    <div className="mb-10">
                      <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                        Activité du compte et politiques
                      </h3>
                      <p className="text-sm mb-6" style={{ color: '#C13515' }}>
                        Confirmez votre réservation, vérifiez l'activité de votre compte et découvrez les politiques importantes de HOMIQIO.
                      </p>

                      <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                            Activité du compte
                          </h4>
                          <p className="text-sm mb-3" style={{ color: '#717171' }}>
                            Activé : E-mail
                          </p>
                          <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier
                          </button>
                        </div>

                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                            Politiques pour les voyageurs
                          </h4>
                          <p className="text-sm mb-3" style={{ color: '#717171' }}>
                            Activé : E-mail
                          </p>
                          <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Rappels */}
                    <div className="mb-10">
                      <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                        Rappels
                      </h3>
                      <p className="text-sm mb-6" style={{ color: '#717171' }}>
                        Recevez des rappels importants sur vos réservations, vos annonces et l'activité de votre compte.
                      </p>

                      <div className="border-b border-gray-200 pb-6">
                        <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Rappels
                        </h4>
                        <p className="text-sm mb-3" style={{ color: '#717171' }}>
                          Activé : E-mail
                        </p>
                        <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                          Modifier
                        </button>
                      </div>
                    </div>

                    {/* Messages entre les hôtes et les voyageurs */}
                    <div className="mb-10">
                      <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                        Messages entre les hôtes et les voyageurs
                      </h3>
                      <p className="text-sm mb-6" style={{ color: '#717171' }}>
                        Restez en contact avec les hôtes et les voyageurs avant, pendant et après votre réservation.
                      </p>

                      <div className="border-b border-gray-200 pb-6">
                        <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Messages
                        </h4>
                        <p className="text-sm mb-3" style={{ color: '#717171' }}>
                          Activé : E-mail
                        </p>
                        <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                          Modifier
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Tab: Offres et mises à jour */}
                {notificationsTab === 'offres' && (
                  <>
                    {/* Conseils et offres de voyage */}
                    <div className="mb-12">
                      <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                        Conseils et offres de voyage
                      </h3>
                      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                        Trouvez l'inspiration pour votre prochain voyage en recevant des recommandations personnalisées et des offres spéciales.
                      </p>

                      <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                            Inspiration et offres
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Activé : E-mail
                          </p>
                          <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier
                          </button>
                        </div>

                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                            Planification du voyage
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Activé : E-mail
                          </p>
                          <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Actualités de HOMIQIO */}
                    <div className="mb-12">
                      <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                        Actualités de HOMIQIO
                      </h3>
                      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                        Recevez les dernières actualités de HOMIQIO et dites-nous comment nous pouvons nous améliorer.
                      </p>

                      <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                            Actualités et programmes
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Activé : E-mail
                          </p>
                          <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier
                          </button>
                        </div>

                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                            Remarques
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Activé : E-mail
                          </p>
                          <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier
                          </button>
                        </div>

                        <div className="border-b border-gray-200 pb-6">
                          <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                            Réglementation en matière de voyage
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Activé : E-mail
                          </p>
                          <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="unsubscribe"
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 cursor-pointer"
                      />
                      <label htmlFor="unsubscribe" className="text-base text-gray-700 cursor-pointer">
                        Je souhaite me désabonner de tous les e-mails marketing
                      </label>
                    </div>
                  </>
                )}
                </div>
              </div>
            )}

            {activeSection === 'payments' && (
              <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8">
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <button
                      onClick={() => setShowMobileContent(false)}
                      className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                    </button>
                    <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
                      Paiements
                    </h2>
                  </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-gray-300">
                  <button
                    onClick={() => setPaymentsTab('paiements')}
                    className={`pb-3 text-base ${paymentsTab === 'paiements' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    style={{ fontWeight: paymentsTab === 'paiements' ? 600 : 400, color: paymentsTab === 'paiements' ? '#222222' : '#6B7280' }}
                  >
                    Paiements
                  </button>
                  <button
                    onClick={() => setPaymentsTab('versements')}
                    className={`pb-3 text-base ${paymentsTab === 'versements' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    style={{ fontWeight: paymentsTab === 'versements' ? 600 : 400, color: paymentsTab === 'versements' ? '#222222' : '#6B7280' }}
                  >
                    Versements
                  </button>
                  <button
                    onClick={() => setPaymentsTab('frais')}
                    className={`pb-3 text-base ${paymentsTab === 'frais' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    style={{ fontWeight: paymentsTab === 'frais' ? 600 : 400, color: paymentsTab === 'frais' ? '#222222' : '#6B7280' }}
                  >
                    Frais de service
                  </button>
                </div>

                {/* Tab: Paiements */}
                {paymentsTab === 'paiements' && (
                  <>
                    {/* Vos paiements */}
                    <div className="mb-12">
                      <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                        Vos paiements
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Faites le suivi de tous vos paiements et remboursements.
                      </p>
                      <button className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800" style={{ fontWeight: 600 }}>
                        Gérer les paiements
                      </button>
                    </div>

                    {/* Modes de paiement */}
                    <div className="mb-12">
                      <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                        Modes de paiement
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Ajoutez un mode de paiement à l'aide de notre système de paiement sécurisé, puis commencez à organiser votre prochain voyage.
                      </p>
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800"
                        style={{ fontWeight: 600 }}
                      >
                        Ajouter un mode de paiement
                      </button>
                    </div>

                    {/* Crédit cadeau HOMIQIO */}
                    <div>
                      <h3 className="text-lg md:text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                        Crédit cadeau HOMIQIO
                      </h3>
                      <button className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800" style={{ fontWeight: 600 }}>
                        Ajouter une carte cadeau
                      </button>
                    </div>
                  </>
                )}

                {/* Tab: Versements */}
                {paymentsTab === 'versements' && (
                  <>
                    {/* Votre mode de versement */}
                    <div className="mb-12">
                      <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                        Votre mode de versement
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Ajoutez au moins un mode de versement pour nous indiquer où envoyer votre argent.
                      </p>
                      <button
                        onClick={() => setPayoutStep('method')}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800"
                        style={{ fontWeight: 600 }}
                      >
                        Configurer les versements
                      </button>
                    </div>

                    {/* Besoin d'aide ? */}
                    <div className="border border-gray-300 rounded-xl p-6">
                      <h3 className="text-lg mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                        Besoin d'aide ?
                      </h3>

                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between py-3 border-b border-gray-200 text-left">
                          <span className="text-base underline" style={{ fontWeight: 400, color: '#222222' }}>
                            Quand vais-je recevoir mes versements ?
                          </span>
                          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <button className="w-full flex items-center justify-between py-3 border-b border-gray-200 text-left">
                          <span className="text-base underline" style={{ fontWeight: 400, color: '#222222' }}>
                            Fonctionnement des versements
                          </span>
                          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <button className="w-full flex items-center justify-between py-3 text-left">
                          <span className="text-base underline" style={{ fontWeight: 400, color: '#222222' }}>
                            Accéder à mon historique des transactions
                          </span>
                          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Tab: Frais de service */}
                {paymentsTab === 'frais' && (
                  <>
                    {/* Paramètres des frais de service */}
                    <div className="mb-8">
                      <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                        Paramètres des frais de service
                      </h3>
                      <p className="text-sm mb-6" style={{ color: '#C13515' }}>
                        Choisissez une option de tarification des frais de service pour toutes vos annonces.
                      </p>

                      <div className="space-y-4 mb-6">
                        {/* Frais uniques */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center group-hover:border-gray-900 transition-colors">
                              <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base" style={{ fontWeight: 400, color: '#222222' }}>
                                Frais uniques
                              </span>
                              <span className="px-2 py-0.5 text-xs" style={{ fontWeight: 600, color: '#222222', backgroundColor: '#F7F7F7', borderRadius: '4px' }}>
                                RECOMMANDÉ
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#717171' }}>
                              HOMIQIO déduit 15,5 % de chaque versement. Les frais de service ne sont jamais facturés aux voyageurs : le prix que vous fixez correspond au prix payé par les voyageurs.
                            </p>
                          </div>
                        </label>

                        {/* Frais partagés */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base" style={{ fontWeight: 400, color: '#222222' }}>
                                Frais partagés
                              </span>
                              <span className="text-sm" style={{ fontWeight: 400, color: '#717171' }}>
                                (PARAMÈTRE ACTUEL)
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#717171' }}>
                              HOMIQIO déduit 3 % de vos revenus. Les voyageurs paient des frais de service de 14,1 à 16,5 %, en plus de tout montant facturé par les hôtes, dont le prix par nuit, les frais de ménage et les frais pour les animaux.
                            </p>
                          </div>
                        </label>
                      </div>

                      <p className="text-sm mb-6" style={{ color: '#C13515' }}>
                        Pour les logements situés au Brésil, HOMIQIO déduit 16 % de frais d'hôte pour les frais uniques et 4 % pour les frais partagés.
                      </p>

                      {/* Encart avec icône */}
                      <div className="border border-gray-300 rounded-xl p-6 mb-8" style={{ backgroundColor: '#FFFFFF' }}>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                              <rect x="8" y="12" width="32" height="24" rx="2" stroke="#E91E63" strokeWidth="2" fill="none" />
                              <path d="M16 12V8C16 6.89543 16.8954 6 18 6H30C31.1046 6 32 6.89543 32 8V12" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" />
                              <circle cx="24" cy="24" r="3" fill="#E91E63" />
                              <path d="M20 30H28" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                              Un versement inchangé, un tarif simplifié
                            </h4>
                            <p className="text-sm mb-2 leading-relaxed" style={{ color: '#717171' }}>
                              Vous pouvez gagner le même montant, sans que vos voyageurs ne paient davantage. Choisissez simplement des frais uniques et ajustez vos prix en conséquence.
                            </p>
                            <button className="text-sm underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                              Voir un exemple
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Boutons */}
                      <div className="flex items-center gap-4">
                        <button
                          className="px-6 py-3 rounded-lg text-base cursor-not-allowed"
                          style={{
                            fontWeight: 600,
                            backgroundColor: '#EBEBEB',
                            color: '#B0B0B0'
                          }}
                          disabled
                        >
                          Enregistrer
                        </button>
                        <button
                          className="px-6 py-3 border-2 rounded-lg text-base transition-colors hover:bg-gray-50"
                          style={{
                            fontWeight: 600,
                            color: '#222222',
                            borderColor: '#222222'
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </>
                )}
                </div>
              </div>
            )}

            {activeSection === 'languages' && (
              <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8">
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <button
                      onClick={() => setShowMobileContent(false)}
                      className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                    </button>
                    <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
                      Langues et devise
                    </h2>
                  </div>

                <div className="space-y-6">
                  {/* Langue préférée */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Langue préférée
                        </h3>
                        <p className="text-sm text-gray-600">
                          Français
                        </p>
                      </div>
                      <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                        Modifier
                      </button>
                    </div>
                  </div>

                  {/* Devise préférée */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Devise préférée
                        </h3>
                        <p className="text-sm text-gray-600">
                          Euro
                        </p>
                      </div>
                      <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                        Modifier
                      </button>
                    </div>
                  </div>

                  {/* Fuseau horaire */}
                  <div className="border-b border-gray-200 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Fuseau horaire
                        </h3>
                      </div>
                      <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}


          </main>
        </div>

        {/* Modal Ajouter un mode de paiement */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
              {/* Bouton fermer */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Titre */}
              <h2 className="text-base text-center mb-6 mt-2" style={{ fontWeight: 600, color: '#222222' }}>
                Indiquez les informations de votre carte
              </h2>

              {/* Logos cartes */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-xs px-2 py-0.5 border border-blue-600 text-blue-600" style={{ fontWeight: 600 }}>VISA</span>
                  <div className="flex gap-0.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                    <div className="w-3 h-3 rounded-full bg-orange-400 opacity-80" style={{ marginLeft: '-6px' }}></div>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 bg-blue-600 text-white" style={{ fontWeight: 600 }}>AMERICAN EXPRESS</span>
                </div>
              </div>

              {/* Formulaire */}
              <div className="space-y-4">
                {/* Numéro de carte */}
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700">
                    Numéro de carte
                    <span className="ml-1">🔒</span>
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                {/* Expiration et Cryptogramme */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700">
                      Expiration
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700">
                      Cryptogramme
                    </label>
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>

                {/* Code postal */}
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700">
                    Code postal
                  </label>
                  <input
                    type="text"
                    placeholder="75001"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                {/* Pays/région */}
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700">
                    Pays/région
                  </label>
                  <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option>France</option>
                    <option>Belgique</option>
                    <option>Suisse</option>
                    <option>Canada</option>
                  </select>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-sm underline"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  Annuler
                </button>
                <button
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                  style={{ fontWeight: 600 }}
                >
                  Terminé
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de désactivation du compte */}
        {showDeactivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
              {/* Bouton Quitter */}
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="absolute top-4 right-4 text-sm underline"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Quitter
              </button>

              <h3 className="text-2xl mb-6 pr-16" style={{ fontWeight: 600, color: '#222222' }}>
                Pourquoi choisissez-vous de désactiver votre compte ?
              </h3>

              <div className="space-y-4 mb-6">
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deactivation-reason"
                    className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900"
                  />
                  <span className="text-base" style={{ color: '#222222' }}>
                    Je n'utilise plus HOMIQIO.
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deactivation-reason"
                    className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900"
                  />
                  <span className="text-base" style={{ color: '#222222' }}>
                    J'utilise un autre compte HOMIQIO.
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="deactivation-reason"
                    className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900"
                  />
                  <span className="text-base" style={{ color: '#222222' }}>
                    Autre
                  </span>
                </label>
              </div>

              <button
                className="w-full px-6 py-3 rounded-lg text-base cursor-not-allowed"
                style={{
                  fontWeight: 600,
                  backgroundColor: '#EBEBEB',
                  color: '#B0B0B0'
                }}
                disabled
              >
                Continuer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <LanguageModal
          isOpen={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Become Host Modal */}
      {showBecomeHostModal && (
        <BecomeHostModal
          isOpen={showBecomeHostModal}
          onClose={() => setShowBecomeHostModal(false)}
          onSelectOption={(option) => {
            if (option === 'logement') {
              onNavigate?.('host-onboarding');
            }
            setShowBecomeHostModal(false);
          }}
        />
      )}


    </>
  );
}
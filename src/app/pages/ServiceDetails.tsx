import { Share, Heart } from 'lucide-react';
import { useState } from 'react';
import { Header } from '../components/Header';
import hostImage from '@/assets/e3976b1bc92d8f8d8ca826b101f4aad1cab84db6.png';

interface ServiceDetailsProps {
  onBack: () => void;
}

export function ServiceDetails({ onBack }: ServiceDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const serviceOptions = [
    {
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwZm9vZCUyMHBhc3RhfGVufDF8fHx8MTc2Nzg4NjQzNHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Expérience autour de la cuisine romaine',
      price: '35 €',
      description: 'Vous souhaitez profiter de l\'expérience d\'un chef privé à domicile sans dépenser beaucoup ? Cette option vous permet de choisir un plat parmi mes classiques romains, comme les spaghettis à la carbonara ou mon tiramisù...'
    },
    {
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwY2hlZiUyMGNvb2tpbmd8ZW58MXx8fHwxNzY3ODg2NDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Menu de base : saveurs de Rome',
      price: '65 €',
      description: 'Chef privé romain qui apporte les saveurs traditionnelles dans les maisons et les BnB de Rome. Mon menu de base comprend quatre plats : bruschetta à la tomate, spaghetti à la carbonara, saltimbocca alla romana et tiramisù. Si...'
    },
    {
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwcGFzdHJ5fGVufDF8fHx8MTc2Nzg4NjQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Pâtes et dessert faits maison',
      price: '65 €',
      description: 'Apprenez l\'art des pâtes fraîches et d\'un dessert traditionnel fait maison, directement chez vous. Au lieu d\'aller dans des endroits bondés, de prendre des taxis et d\'attendre les autres, vous pouvez profiter de cette expérience...'
    },
    {
      image: 'https://images.unsplash.com/photo-1599974862459-7d7d536c7e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxsb3dlZW4lMjBwdW1wa2luJTIwZm9vZHxlbnwxfHx8fDE3Njc4ODY0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Halloween à Rome',
      price: '85 €',
      description: 'Passez un merveilleux Halloween à Rome en famille ou entre amis, en dégustant des plats romains ou des plats de votre choix. Pendant que vous êtes à la maison, je viendrai vous préparer un délicieux dîner ou dîner'
    },
    {
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MXx8fHwxNzY3ODg2NDM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Menu de fruits de mer à la romaine',
      price: '100 €',
      description: 'Un voyage en quatre services dédié aux fruits de mer pour ceux qui veulent une expérience complète et raffinée. Du l\'entrée au dessert, chaque plat est préparé avec des ingrédients frais de saison inspirés de la tradition...'
    },
    {
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBkaW5uZXIlMjBob2xpZGF5fGVufDF8fHx8MTc2Nzg4NjQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Noël à Rome',
      price: '100 €',
      description: 'Célébrez Noël à Rome avec style et sans stress. Un chef privé préparera un déjeuner ou un dîner mémorable pour vous et vos proches. Choisissez parmi mes plats romains traditionnels, mes recettes de vacances classiques ou un...'
    }
  ];

  const qualifications = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: '5 ans d\'expérience',
      description: 'J\'ai préparé mon premier plat à 6 ans, ce qui a déclenché une passion pour la cuisine romaine.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      title: 'Apprenez à cuisiner des plats romains classiques',
      description: 'J\'ai maîtrisé la carbonara à 8 ans et le saltimbocca alla romana à 10 ans.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
      title: 'Entraînement pratique',
      description: 'J\'ai perfectionné mes compétences en cuisine.'
    }
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-white">
        <Header currentPage="services" onNavigate={onBack} isScrolled={true} />

        {/* Main Content */}
        <div className="max-w-[1120px] mx-auto px-6 md:px-10 lg:px-20 pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Column - Main Info */}
            <div className="mb-6 lg:col-span-2">
              {/* Main Image with Avatar */}
              <div className="sticky top-12 mb-6">
                <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={hostImage}
                    alt="Repas romain authentique"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Avatar */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3Njc4ODY0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Carlo"
                    className="w-20 h-20 rounded-full border-4 border-white object-cover"
                  />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-[26px] text-center mt-10 mb-4" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                Repas romain authentique
              </h1>

              {/* Description */}
              <p className="text-[15px] text-gray-700 text-center mb-4 leading-relaxed">
                Je propose une cuisine romaine authentique et traditionnelle, avec des ingrédients frais et beaucoup de saveur.
              </p>

              {/* Traduit automatiquement badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>Traduit automatiquement</span>
                </div>
              </div>

              {/* Rating and Location */}
              <div className="flex items-center justify-center gap-1 mb-2 text-sm">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 0L8.854 4.146L13 4.854L9.708 7.708L10.708 13L7 10.708L3.292 13L4.292 7.708L1 4.854L5.146 4.146L7 0Z"/>
                </svg>
                <span style={{ fontWeight: 600 }}>4,97</span>
                <span className="text-gray-600">· 243 évaluations</span>
              </div>

              {/* Location and Service Type */}
              <div className="text-center text-sm text-gray-600 mb-6">
                Rome · Chef privé · Service proposé dans votre logement
              </div>

              {/* Share and Favorite Buttons */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <button className="flex items-center gap-2 text-sm hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                  <Share className="w-4 h-4" />
                  <span className="underline" style={{ fontWeight: 600 }}>Partager</span>
                </button>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center gap-2 text-sm hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="underline" style={{ fontWeight: 600 }}>Enregistrer</span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between text-center fixed bottom-0 w-[350px] bg-white shadow-lg rounded-tl-3xl rounded-tr-3xl pt-4 px-4">
                <div className="mb-4 flex flex-col items-start">
                  <div className="text-lg mb-1">
                    <span style={{ fontWeight: 600 }}>À partir de 65 €</span>
                  </div>
                  <div className="text-sm text-gray-600">par voyageur</div>
                  <div className="text-sm text-gray-600">Annulation gratuite</div>
                </div>
                <button
                  className="px-6 py-3 rounded-full text-white text-base hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#000000', fontWeight: 600 }}
                >
                  Voir les dates
                </button>
              </div>
            </div>

            {/* Right Column - Service Options */}
            <div className="lg:col-span-3">
              {/* Service Options List */}
              <div className="space-y-4 mb-4">
                {serviceOptions.map((option, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <img
                      src={option.image}
                      alt={option.title}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>{option.title}</h3>
                      <div className="text-sm mb-2" style={{ fontWeight: 600 }}>
                        {option.price} <span className="text-gray-600 font-normal">/ personne</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show All Button */}
              <div className="text-center mb-12 w-full">
                <button className="w-full py-3 text-base bg-gray-100 transition-colors rounded-xl" style={{ fontWeight: 600 }}>
                  Tout afficher (8)
                </button>
              </div>

              {/* Message Note */}
              <div className="text-start text-xs text-gray-600 mb-12">
                Vous pouvez envoyer un message à Carlo pour personnaliser ou modifier votre réservation.
              </div>

              {/* Mes spécialités Section */}
              <div className="mb-12">
                <h2 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>Mes spécialités</h2>
                <div className="grid grid-cols-2 gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwZm9vZCUyMHBhc3RhfGVufDF8fHx8MTc2Nzg4NjQzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Spécialité 1"
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                  <div className="space-y-3">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwcGFzdHJ5fGVufDF8fHx8MTc2Nzg4NjQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Spécialité 2"
                      className="w-full aspect-[2/1] object-cover rounded-2xl"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwY2hlZiUyMGNvb2tpbmd8ZW58MXx8fHwxNzY3ODg2NDM0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Spécialité 3"
                      className="w-full aspect-[2/1] object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mb-12 border-t border-gray-200 pt-12">
                <div className="flex items-center gap-2 mb-8">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0L10.122 5.244L16 6.122L11.708 9.708L12.708 16L8 12.708L3.292 16L4.292 9.708L0 6.122L5.878 5.244L8 0Z"/>
                  </svg>
                  <h2 className="text-[22px]" style={{ fontWeight: 600 }}>4,97 · 243 commentaires</h2>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Review 1 */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc4ODk4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Angie"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Angie</h3>
                        <p className="text-sm text-gray-600">Pontiac, Michigan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 0L7.326 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.674 4.146L6 0Z"/>
                        </svg>
                      ))}
                      <span className="text-xs text-gray-600 ml-2">· Il y a 2 semaines</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Carlo a été très sympathique et professionnel, il a compris la mission et il s'est surpassé. Il savait certainement ce qu'il faisait. Ce fut un plaisir et une joie de rencontrer Carlo. Bien à vous, Angelina et ses amis
                    </p>
                  </div>

                  {/* Review 2 */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3Njc4ODk4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Patrick"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Patrick</h3>
                        <p className="text-sm text-gray-600">Lucerne, Suisse</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 0L7.326 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.674 4.146L6 0Z"/>
                        </svg>
                      ))}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 0L7.326 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.674 4.146L6 0Z" stroke="currentColor" strokeWidth="1"/>
                      </svg>
                      <span className="text-xs text-gray-600 ml-2">· Il y a 3 semaines</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Marco a été parfait et très flexible. Repas succulent. Le Tiramisu est l'un des meilleurs jamais mangé Je le recommande vivement.
                    </p>
                  </div>

                  {/* Review 3 */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3ODg5ODY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Kevin"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Kevin</h3>
                        <p className="text-sm text-gray-600">Rome, Italie</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 0L7.326 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.674 4.146L6 0Z"/>
                        </svg>
                      ))}
                      <span className="text-xs text-gray-600 ml-2">· Il y a 3 semaines</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Qui m'a pas essayé l'expérience, et vient à Rome, vous ne pouvez pas partir sans rencontrer Carlo et sa nourriture, excellente personne, la nourriture, l'une des meilleures que j'ai goûté dans ma vie, super attentionné, très très gentil... <button className="text-sm underline" style={{ fontWeight: 600 }}>Afficher plus</button>
                    </p>
                  </div>

                  {/* Review 4 */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwb3J0cmFpdCUyMHNtaWxlfGVufDF8fHx8MTc2Nzg4OTg2OHww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Alaitz"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Alaitz</h3>
                        <p className="text-sm text-gray-600">Barcelone, Espagne</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 0L7.326 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.674 4.146L6 0Z"/>
                        </svg>
                      ))}
                      <span className="text-xs text-gray-600 ml-2">· décembre 2025</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Ce fut une expérience parfaite. La nourriture était spectaculaire et l'accueil était impeccable. Carlo a eu la gentillesse de faire des « mini plats » pour mon bébé de 20 mois. Nous le recommandons vivement et si nous retournon... <button className="text-sm underline" style={{ fontWeight: 600 }}>Afficher plus</button>
                    </p>
                  </div>

                  {/* Review 5 */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXQlMjBjYXN1YWx8ZW58MXx8fHwxNzY3ODg5ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Aileen"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Aileen</h3>
                        <p className="text-sm text-gray-600">Singapore</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 0L7.326 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.674 4.146L6 0Z"/>
                        </svg>
                      ))}
                      <span className="text-xs text-gray-600 ml-2">· novembre 2025</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      J'ai adoré Carlo et sa cuisine. J'ai passé un agréable moment à déguster toutes les saveurs de l'Italie
                    </p>
                  </div>

                  {/* Review 6 */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwb3J0cmFpdCUyMGNhc3VhbHxlbnwxfHx8fDE3Njc4ODk4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Chelsea"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Chelsea</h3>
                        <p className="text-sm text-gray-600">États-Unis</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 0L7.326 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.674 4.146L6 0Z"/>
                        </svg>
                      ))}
                      <span className="text-xs text-gray-600 ml-2">· novembre 2025</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Je le recommande vivement car il était si gentil et aimable. Il y avait une barrière linguistique car nous ne parlons pas italien mais il était très agréable et Google Translate a pu nous aider grandement. Je recommande vivement... <button className="text-sm underline" style={{ fontWeight: 600 }}>Afficher plus</button>
                    </p>
                  </div>
                </div>

                {/* Show All Reviews Button */}
                <div className="mt-10">
                  <button className="w-full md:w-auto px-6 py-3 border-2 border-gray-900 rounded-lg text-base hover:bg-gray-50 transition-colors" style={{ fontWeight: 600 }}>
                    Afficher tous les commentaires
                  </button>
                </div>
              </div>

              {/* Je viendrai à votre rencontre Section */}
              <div className="mb-12 border-t border-gray-200 pt-12">
                <h2 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>Je viendrai à votre rencontre</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  Je me déplace à la rencontre des voyageurs dans cette zone : Rome. Pour bénéficier du service dans un autre lieu, envoyez-moi un message.
                </p>
                
                {/* Map Container */}
                <div className="w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d12.4423501!3d41.9027835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6196f9928ebb%3A0xb90f770693656e38!2sRome%2C%20Italie!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <button className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* À savoir Section */}
              <div className="mb-12 border-t border-gray-200 pt-12">
                <h2 className="text-[22px] mb-8" style={{ fontWeight: 600 }}>À savoir</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Age minimum */}
                  <div className="flex gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>Âge minimum pour les voyageurs</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Les voyageurs âgés de 2 ans et plus peuvent participer.
                      </p>
                    </div>
                  </div>

                  {/* Accessibilité */}
                  <div className="flex gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>Accessibilité</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Envoyez un message à l'hôte pour obtenir plus d'informations à ce sujet.{' '}
                        <button className="underline" style={{ fontWeight: 600 }}>En savoir plus</button>
                      </p>
                    </div>
                  </div>

                  {/* Conditions d'annulation */}
                  <div className="flex gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>Conditions d'annulation</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Annulez au moins 1 jour avant le début pour obtenir un remboursement intégral.
                      </p>
                    </div>
                  </div>

                  {/* Carlo accueille */}
                  <div className="flex gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>Carlo accueille des voyageurs en tant que particulier</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        L'hôte est responsable de ce service.{' '}
                        <button className="underline" style={{ fontWeight: 600 }}>En savoir plus</button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chefs privés Section */}
              <div className="mb-12 border-t border-gray-200 pt-12">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl px-12 py-16 text-center">
                  {/* Gold Badge Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C9.878 0 7.89.925 6.465 2.466c-1.426 1.54-2.22 3.614-2.22 5.774 0 2.16.794 4.234 2.22 5.774.725.782 1.578 1.404 2.535 1.847v7.595c0 .272.13.528.35.686.22.158.503.2.76.112l3.89-1.335 3.89 1.335c.123.042.252.063.382.063.145 0 .29-.034.423-.102.22-.11.35-.336.35-.588v-7.595c.957-.443 1.81-1.065 2.535-1.847 1.426-1.54 2.22-3.614 2.22-5.774 0-2.16-.794-4.234-2.22-5.774C16.11.925 14.122 0 12 0zm0 2c3.308 0 6 2.916 6 6.5S15.308 15 12 15s-6-2.916-6-6.5S8.692 2 12 2zm0 2c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <h2 className="text-[28px] mb-4 leading-tight" style={{ fontWeight: 600 }}>
                    Chefs privés : des hôtes sélectionnés pour la qualité de leurs services
                  </h2>
                  
                  <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                    Les chefs privés sont sélectionnés en fonction de leur expérience professionnelle, de la gamme de menus qu'ils proposent et de leur renommée.{' '}
                    <button className="underline" style={{ fontWeight: 600 }}>En savoir plus</button>
                  </p>

                  <p className="text-sm text-gray-500">
                    Vous avez rencontré un problème ?{' '}
                    <button className="underline text-gray-700" style={{ fontWeight: 600 }}>Signaler cette annonce</button>
                  </p>
                </div>
              </div>

              {/* Send Message Section */}
              <div className="bg-gray-50 rounded-2xl px-8 py-6 mb-8">
                <h3 className="text-[17px] mb-4 text-center" style={{ fontWeight: 600 }}>Envoyer un message à Carlo</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Afin de protéger votre paiement, utilisez toujours Airbnb pour envoyer de l'argent et communiquer avec les hôtes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
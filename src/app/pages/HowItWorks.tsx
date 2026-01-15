import { Search, ChevronRight, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

export function HowItWorks({ onNavigate }: HowItWorksProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate('logements')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                  fill="#10B981"
                />
              </svg>
              <span className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                homiqio
              </span>
            </button>

            {/* Search bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="N'importe où"
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#000000] rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <button className="text-sm hover:bg-gray-50 px-3 py-2 rounded-full" style={{ fontWeight: 600, color: '#222222' }}>
                Devenir hôte
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#222222" strokeWidth="1.5" />
                  <path d="M3 8H13M8 3C6.5 4.5 6 6 6 8C6 10 6.5 11.5 8 13M8 3C9.5 4.5 10 6 10 8C10 10 9.5 11.5 8 13" stroke="#222222" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M2 8H14M2 12H14" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="#717171" />
                  <path d="M12 2C14.21 2 16 3.79 16 6C16 8.21 14.21 10 12 10C9.79 10 8 8.21 8 6C8 3.79 9.79 2 12 2ZM12 22C7.03 22 3 19.42 3 16.25C3 13.08 7.03 10.5 12 10.5C16.97 10.5 21 13.08 21 16.25C21 19.42 16.97 22 12 22Z" fill="#FFF" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="px-6 lg:px-20 py-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-[28px] mb-10" style={{ fontWeight: 400, color: '#484848', lineHeight: '1.3' }}>
            Fonctionnement du site et classement des annonces
          </h1>

          {/* Content sections */}
          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                QU'EST-CE QU'HOMIQIO ?
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  La Plateforme HOMIQIO est une place de marché en ligne qui permet aux utilisateurs enregistrés (les <strong>« Membres »</strong>) et à certains tiers qui proposent des services (les Membres et tiers qui proposent des services sont des <strong>« Hôtes »</strong> et les services qu'ils proposent sont des <strong>« Services d'Hôte »</strong>) de publier ces Services d'Hôte sur la Plateforme HOMIQIO (les <strong>« Annonces »</strong>) et de communiquer et traiter directement avec des Membres qui souhaitent réserver ces Services d'Hôte (les Membres qui utilisent des Services d'Hôte sont des <strong>« Voyageurs »</strong>). Les Services d'Hôte peuvent comprendre la location de logements pour des vacances ou autre usage (les <strong>« Hébergements »</strong>), des activités sur une ou plusieurs journées dans différentes catégories (les <strong>« Expériences »</strong>), un accès à des événements et lieux uniques (les <strong>« Événements »</strong>), ainsi que d'autres services variés, en lien ou non avec les voyages.
                </p>
                <p>Vous devez créer un compte pour pouvoir publier une Annonce.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                QUI PEUT DEVENIR HÔTE SUR HOMIQIO (LOGEMENTS) ?
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Pratiquement tout le monde peut devenir hôte, que vous soyez un professionnel ou un non-professionnel. Votre inscription et la mise en ligne de votre logement sont gratuites. Les logements disponibles sur le site sont aussi variés que les hôtes qui les publient.
                </p>
                <p>
                  Vous pouvez publier une annonce pour votre logement dans presque tous les pays du monde. Bien que nous souhaiterions faire d'HOMIQIO un lieu d'échange mondial, nous sommes soumis aux lois internationales qui limitent l'utilisation de notre site aux résidents de certains pays. Par conséquent, nos services ne sont donc pas accessibles en Crimée, en Iran, en Syrie et en Corée du Nord.
                </p>
                <p>Pour proposer des séjours agréables et adaptés aux voyageurs, nous demandons à tous les hôtes de respecter 4 critères de base :</p>
                <ul className="space-y-3 pl-6">
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Faire preuve de réactivité</strong> : maintenez un taux de réponse élevé en répondant aux demandes d'information et de réservation dans les 24 heures.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Accepter les demandes de réservation</strong> : montrez aux voyageurs qu'ils sont les bienvenus en acceptant les demandes de réservation lorsque votre logement est disponible.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Éviter les annulations</strong> : les annulations ne sont pas anodines et nous demandons à tous les hôtes d'éviter d'annuler les réservations des voyageurs pour ne pas compromettre leurs projets de voyage.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Maintenir une bonne évaluation globale</strong> : les voyageurs aiment pouvoir s'attendre à un niveau de qualité constant, quelle que soit leur destination.
                  </li>
                </ul>
                <p>
                  Par ailleurs nous encourageons fortement les hôtes à fournir les <strong>équipements essentiels</strong> : papier toilette, savon, linge de maison, draps, et au moins une serviette et un oreiller par voyageur.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                QUI PEUT PUBLIER UNE EXPÉRIENCE SUR HOMIQIO ?
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Les expériences HOMIQIO sont des activités créées et animées par des passionnés. Les expériences durent quelques heures en moyenne. Il peut s'agir d'un simple atelier ou d'une longue randonnée en montagne. Elles s'adressent à tout le monde, quels que soient vos centres d'intérêt ou votre niveau.
                </p>
                <p>
                  <strong>Pour les hôtes :</strong> Il n'est pas nécessaire de partager votre logement sur HOMIQIO pour pouvoir organiser une expérience.
                </p>
                <p>
                  <strong>Pour les voyageurs :</strong> Il n'est pas nécessaire de séjourner dans un logement HOMIQIO pour pouvoir réserver une expérience.
                </p>
                <p>
                  Chaque expérience proposée à HOMIQIO est examinée pour s'assurer qu'elle respecte trois critères de qualité : l'expertise, l'accès privilégié et la relation. Ces critères nous aident à garantir que les attentes des voyageurs sont satisfaites.
                </p>
                <ul className="space-y-3 pl-6">
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Expertise</strong> : les hôtes sont bien informés et extrêmement passionnés par ce qu'ils font. Ils enrichissent et animent l'expérience grâce à des histoires personnelles et au contexte local.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Accès privilégié</strong> : les hôtes peuvent accéder à des lieux ou des activités que le voyageur ordinaire ne pourrait pas découvrir par lui-même. Ils invitent les voyageurs à participer activement à l'activité, à découvrir une communauté ou une culture.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Relation</strong> : les hôtes s'efforcent d'établir des relations humaines enrichissantes. Ils font de leur mieux pour que les voyageurs se sentent bienvenus et appréciés.
                  </li>
                </ul>
                <p>
                  Pour en savoir plus sur ces critères de qualité, veuillez lire notre article de blog concernant les trois piliers d'une expérience de qualité. Les expériences ne satisfaisant pas aux critères ci-dessus peuvent être supprimées d'HOMIQIO.
                </p>
                <p>
                  Toutes les expériences et les hôtes qui les proposent doivent se conformer à nos Conditions générales et Conditions supplémentaires applicables aux hôtes proposant des expériences. Voici quelques-unes de ces exigences supplémentaires :
                </p>
                <ul className="space-y-3 pl-6">
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Précision</strong> : les hôtes doivent décrire leur expérience de manière exhaustive et précise, en y incluant le récapitulatif, la date et l'heure, le lieu de rendez-vous, les éléments fournis aux voyageurs, etc.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Périodes d'exclusivité</strong> : dès qu'un hôte propose une expérience sur HOMIQIO pour une heure et une date précise, seuls les voyageurs d'HOMIQIO peuvent y participer.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Engagement relatif aux réservations</strong> : les hôtes doivent honorer toutes leurs réservations, même si elles ne concernent qu'une seule personne, sauf en cas d'annulation consécutive à un cas de force majeure. Un nombre trop faible de participants n'est pas une circonstance valable actuellement pour annuler.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Note minimum des voyageurs</strong> : les expériences ayant reçu trop de mauvaises évaluations (1, 2 ou 3 étoiles) dans les commentaires ou avec une évaluation moyenne inférieure ou égale à 4,7 peuvent être supprimées d'HOMIQIO. En savoir plus sur les évaluations et commentaires sur les expériences.
                  </li>
                </ul>
                <p>
                  Si vous souhaitez organiser une expérience, proposez votre idée ici. Nous vérifierons qu'elle respecte nos critères de qualité pour être publiée.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                EST-CE QU'HOMIQIO PEUT DÉSACTIVER MON ANNONCE OU MON COMPTE ?
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  HOMIQIO peut limiter, suspendre ou désactiver votre compte, conformément à ses Conditions générales, notamment les articles 5 relatif au contenu et 15 relatif à la Durée et Résiliation, Suspension et autres Mesures.
                </p>
                <p>
                  HOMIQIO peut supprimer ou désactiver l'accès à tout Contenu des Membres qui est contraire au droit applicable, aux présentes Conditions ou aux Politiques ou Normes en vigueur d'HOMIQIO, ou potentiellement nuisibles ou inacceptables pour HOMIQIO, ses Membres, des tiers ou des biens. Pour plus d'informations, nous vous recommandons de visiter la page Pourquoi mon annonce a été désactivée de notre centre d'aide.
                </p>
                <p>
                  Votre compte peut être désactivé lors d'un examen des comptes HOMIQIO. Ces examens s'inscrivent dans le cadre d'efforts visant à faire respecter les Valeurs de la communauté HOMIQIO (tranquillité d'esprit, sécurité, respect, authenticité, fiabilité), ses Conditions générales, les lois et règlements applicables et à instaurer un climat de confiance mutuelle. Votre compte peut également être désactivé ou suspendu à la suite d'un problème signalé à notre équipe d'assistance utilisateurs. La sécurité est prise très au sérieux chez HOMIQIO, et si une violation des Valeurs de la communauté est signalée, nous mènerons une enquête sur ce signalement et prendrons les mesures appropriées.
                </p>
                <p>
                  Votre compte peut être provisoirement désactivé en raison de votre taux de réponse ou de votre taux d'acceptation. Pour réactiver votre compte dans ce cas, suivez les étapes indiquées dans l'e-mail que vous avez reçu.
                </p>
                <p>
                  Si votre compte est désactivé ou suspendu, toute réservation future, en attente de réponse ou acceptée, que ce soit en tant qu'hôte ou voyageur, peut être annulée.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                QU'EST-CE QUI INFLUENCE LE CLASSEMENT DE MON ANNONCE DANS LES RÉSULTATS DE RECHERCHE ?
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Le but de l'algorithme du classement des annonces sur HOMIQIO est simple : aider les voyageurs à trouver le logement parfait pour leur séjour, et les hôtes à trouver les voyageurs qui conviennent à leur logement. Nous tenons compte de près de 100 facteurs différents pour chaque recherche d'annonce.
                </p>
                <p>
                  La liste exacte des facteurs pris en compte reste confidentielle, mais voici les grandes catégories de facteurs qui affectent le classement :
                </p>
                <ul className="space-y-3 pl-6">
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Besoins des voyageurs:</strong> Nous tenons compte de facteurs liés aux voyageurs, notamment le lieu d'où ils effectuent la recherche, l'historique de leurs voyages, les annonces ajoutées dans leur Wish List ou sur lesquelles ils ont cliqué, et bien plus encore.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Détails de l'annonce:</strong> Nous prenons en considération des informations comme le nombre de commentaires 5 étoiles, le prix, l'emplacement du logement, l'activation ou non de la réservation instantanée, la rapidité avec laquelle l'hôte répond aux demandes, et de nombreux autres facteurs.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Détails du voyage:</strong> Nous prenons en compte le nombre de voyageurs, la durée du voyage, l'imminence du voyage, la configuration ou non d'un prix minimum ou maximum, et divers autres facteurs.
                  </li>
                </ul>
                <p>
                  Nous améliorons notre système constamment afin de permettre aux hôtes et voyageurs d'obtenir les meilleurs résultats possibles sur notre plateforme ; ces facteurs peuvent donc faire l'objet de modifications et de tests. Si vous souhaitez en savoir plus, nous vous recommandons de prendre connaissance de la page dédiée de notre centre d'aide.
                </p>
                <p>
                  A l'heure actuelle, il n'est pas possible pour un Hôte de rémunérer HOMIQIO pour que son Annonce soit mieux classée dans les résultats de recherche.
                </p>
                <p>
                  Certaines Annonces sont gérées par des filiales d'HOMIQIO, telles que Luckey dédiée aux services de conciergerie dans certaines régions), Luxury Retreats (dédiée aux prestations haut de gamme) ou HotelTonight qui propose des réservations de chambres d'hôtels notamment en dernière minute.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                FRAIS DE SERVICE
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>Votre inscription et la mise en ligne de votre logement sont gratuites.</p>
                <p>
                  Pour vous aider à utiliser au mieux la plateforme HOMIQIO, y compris des services tels que l'assistance client 24h/24 et le traitement des cartes de crédit, nous facturons des frais de service lorsqu'une réservation est confirmée. Les frais de service applicables sont communiqués à l'Hôte avant qu'il ne publie une Annonce ou au Voyageur avant qu'il ne réserve.
                </p>
                <p>
                  HOMIQIO applique des frais de service aux voyageurs et/ou aux hôtes. Pour davantage d'informations sur nos frais de service, nous vous invitons à consulter la page dédiée de notre centre d'aide.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                MODE DE PAIEMENT
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Tous les services de paiement liés à votre utilisation de la Plateforme HOMIQIO vous sont fournis par une ou plusieurs entités HOMIQIO Payments, comme le prévoient les Conditions de Service relatives aux paiements.
                </p>
                <h3 style={{ fontWeight: 600, color: '#484848' }}>
                  Quels sont les modes de paiement acceptés par HOMIQIO ?
                </h3>
                <p>
                  Nous acceptons différents modes de paiement en fonction du pays dans lequel se trouve votre compte. Ainsi, en plus des principales cartes de crédit et de débit, certaines options de paiement sont disponibles dans certains pays ou sur des plateformes spécifiques (comme sur application sous iOS ou Android).
                </p>
                <p>
                  Tous les modes de paiement disponibles s'affichent sur la page de réservation, avant l'envoi de votre demande de réservation. Une fois votre pays sélectionné, toutes vos informations de paiement seront affichées. Pour plus d'informations, nous vous invitons à visiter la page Quels sont les modes de paiement acceptés de notre centre d'aide.
                </p>
                <h3 style={{ fontWeight: 600, color: '#484848' }}>
                  Quand suis-je débité de ma réservation ?
                </h3>
                <p>
                  Nous recueillons vos informations de paiement au moment où vous envoyez votre demande de réservation. Votre mode de paiement sera débité de la totalité du montant lorsque l'hôte acceptera votre demande, ou au moment de la réservation si vous réservez avec la fonction de réservation instantanée. Pour certaines réservations, vous pouvez choisir de répartir le coût d'une réservation sur plusieurs paiements. En savoir plus sur les paiements en plusieurs fois.
                </p>
                <p>
                  Que votre séjour démarre dans deux jours ou dans deux mois, nous bloquons le paiement jusqu'à 24 heures après votre entrée dans les lieux avant de le transférer à votre hôte. Cette retenue donne aux deux parties le temps de s'assurer que tout se passe comme prévu.
                </p>
                <p>
                  Pour plus d'informations, nous vous invitons à visiter les pages Quand suis-je débité de ma réservation et Puis-je payer dans la devise de mon choix de notre centre d'aide.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                GARANTIE HÔTE ET ASSURANCE HÔTE
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Notre Garantie Hôte est conçue pour protéger les hôtes contre les dommages causés sur leurs propres biens ou dans les rares cas de dommages matériels provoqués par les voyageurs dans leurs logements. Pour en savoir plus, rendez-vous sur la page Garantie Hôte.
                </p>
                <p>
                  Notre Assurance Hôte, d'autre part, est conçue pour protéger les hôtes contre des réclamations de tiers en cas de blessures physiques ou de sinistre dans le logement et protège contre les dommages survenant dans les espaces communs hors du logement. Pour en savoir plus, rendez-vous sur la page Assurance Hôte.
                </p>
                <p>
                  La Garantie Hôte HOMIQIO et l'Assurance Hôte HOMIQIO vous fournissent une protection de base pour les dommages et les responsabilités désignés. Cependant, elles ne remplacent ni l'assurance habitation (locataire ou propriétaire), ni votre assurance responsabilité civile. Vous devrez peut-être satisfaire à d'autres obligations en matière d'assurance.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                CENTRE DE RÉSOLUTION ET ASSISTANCE
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <h3 style={{ fontWeight: 600, color: '#484848' }}>
                  Qu'est-ce que le centre de résolution ?
                </h3>
                <p>
                  Le Centre de résolution vous permet de demander ou d'envoyer de l'argent dans le cadre de votre voyage HOMIQIO. Pour ouvrir une demande de remboursement ou de paiement, allez sur www.homiqio.fr/resolutions.
                </p>
                <p>
                  En tant que voyageur, vous disposez de 60 jours après la date de votre départ du logement pour soumettre une demande dans le Centre de résolution.
                </p>
                <p>
                  En tant qu'hôte, si vous souhaitez demander une retenue sur la caution, vous devez envoyer votre demande via le Centre de résolution dans un délai de 14 jours après le départ du voyageur ou avant la date d'arrivée de vos prochains voyageurs, si celle-ci a lieu dans les 14 jours.
                </p>
                <h3 style={{ fontWeight: 600, color: '#484848' }}>
                  Demande d'assistance à HOMIQIO
                </h3>
                <p>
                  Si vous ne parvenez pas à trouver un accord, vous pouvez solliciter HOMIQIO pour prendre une décision finale 72 heures après ouverture de votre demande. Pour faire intervenir HOMIQIO :
                </p>
                <ol className="space-y-2 pl-6">
                  <li style={{ listStyleType: 'decimal' }}>
                    Laissez passer le délai de 72 heures après ouverture de votre demande.
                  </li>
                  <li style={{ listStyleType: 'decimal' }}>
                    Allez sur www.homiqio.fr/resolutions
                  </li>
                  <li style={{ listStyleType: 'decimal' }}>
                    Sélectionnez la bonne réservation.
                  </li>
                  <li style={{ listStyleType: 'decimal' }}>
                    Cliquez sur Faire intervenir HOMIQIO.
                  </li>
                </ol>
                <p>
                  Lorsque vous faites intervenir HOMIQIO, notre équipe est prévenue et un membre dédié prend en charge votre dossier. Il examine les informations que vous aurez fournies, vous et votre hôte ou voyageur, avant de prendre sa décision finale. Dans certains cas, il se peut que nous devions vous contacter pour rassembler des informations supplémentaires avant de pouvoir prendre notre décision.
                </p>
                <p>
                  <strong>Remarque :</strong> dans certains cas, vous devez ajouter un mode de paiement avant d'envoyer de l'argent ou de faire une demande via le Centre de résolution.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="px-6 lg:px-20 py-6">
          <div className="flex items-center justify-center gap-6 text-sm" style={{ color: '#484848' }}>
            <span>© 2026 HOMIQIO, Inc.</span>
            <span>·</span>
            <button onClick={() => onNavigate('privacy')} className="hover:underline">
              Confidentialité
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('terms')} className="hover:underline">
              Conditions générales
            </button>
            <span>·</span>
            <button className="hover:underline">
              Fonctionnement du site
            </button>
            <span>·</span>
            <a href="#" className="hover:underline">
              Infos sur l'entreprise
            </a>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 px-5 py-3 bg-gray-900 text-white rounded-lg text-sm shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 z-50"
          style={{ fontWeight: 600 }}
        >
          <ArrowUp className="w-4 h-4" />
          Retour en haut de la page
        </button>
      )}
    </div>
  );
}

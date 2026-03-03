import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Globe,
  Menu,
  ChevronUp,
  Bookmark,
  FileText,
} from "lucide-react";
import { Footer } from "@/app/components/Footer";

interface CancellationPolicyProps {
  onNavigate: (page: string) => void;
}

export function CancellationPolicy({ onNavigate }: CancellationPolicyProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-20 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("logements")}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
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
              <span className="text-base font-medium ml-1">
                Centre d'aide
              </span>
            </button>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setShowSearchSuggestions(true);
                  setIsSearchFocused(true);
                }}
                onBlur={() =>
                  setTimeout(() => {
                    setShowSearchSuggestions(false);
                    setIsSearchFocused(false);
                  }, 200)
                }
                placeholder="Rechercher des guides pratiques"
                className="w-full pl-6 pr-14 py-3.5 rounded-full placeholder:text-[#222222] border-2 border-gray-900 focus:outline-none text-base transition-all"
              />
              <button
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-[#10B981] hover:bg-[#059669] transition-all flex items-center justify-center gap-2 ${
                  isSearchFocused
                    ? "rounded-full px-4 h-10"
                    : "rounded-full w-10 h-10"
                }`}
              >
                <Search className="w-5 h-5 text-white flex-shrink-0" />
                {isSearchFocused && (
                  <span className="text-white font-semibold text-sm whitespace-nowrap">
                    Rechercher
                  </span>
                )}
              </button>

              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50">
                  <h3 className="text-base font-semibold mb-4">
                    Articles principaux
                  </h3>
                  <div className="space-y-1">
                    <button className="w-full flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                          Annuler votre réservation de logement en tant que voyageur
                        </p>
                      </div>
                    </button>
                    <button className="w-full flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                          Modifier la date ou l'heure de votre réservation de service ou d'expérience
                        </p>
                      </div>
                    </button>
                    <button className="w-full flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                          Si votre hôte annule votre réservation de logement
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-20 py-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => onNavigate("logements")}
            className="hover:underline text-xs"
          >
            Accueil
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button className="hover:underline text-xs">All topics</button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button className="hover:underline text-xs">
            Vos réservations en tant qu'hôte de logement
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button className="hover:underline text-xs">Annulations</button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 text-xs">
            Politique relative aux circonstances extraordinaires
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-8">
              {/* Category Badge */}
              <p className="text-sm text-gray-600 mb-3">
                Politique relative à la communauté Airbnb
              </p>

              {/* Main Title */}
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl mb-8"
                style={{ fontWeight: 600 }}
              >
                Politique relative aux circonstances extraordinaires
              </h1>

              {/* Table of Contents */}
              <div className="mb-12">
                <h2 className="text-base font-semibold mb-4">
                  Dans cet article
                </h2>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => scrollToSection("informations-generales")}
                      className="flex items-start gap-2 text-left group"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current mt-1" />
                      <span className="font-semibold underline">
                        Informations générales
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("evenements-couverts")}
                      className="flex items-start gap-2 text-left group"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current mt-1" />
                      <span className="font-semibold underline">
                        Quels événements sont couverts ?
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        scrollToSection("reservation-touchee")
                      }
                      className="flex items-start gap-2 text-left group"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current mt-1" />
                      <span className="font-semibold underline">
                        Que se passe-t-il si une réservation est touchée par un
                        Événement couvert ?
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("non-couvert")}
                      className="flex items-start gap-2 text-left group"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current mt-1" />
                      <span className="font-semibold underline">
                        Ce qui n'est pas couvert
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("consequences-hotes")}
                      className="flex items-start gap-2 text-left group"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current mt-1" />
                      <span className="font-semibold underline">
                        Conséquences de la présente politique pour les hôtes
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("autres-elements")}
                      className="flex items-start gap-2 text-left group"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current mt-1" />
                      <span className="font-semibold underline">
                        Autres éléments à prendre en compte
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Content Sections */}
              <div className="space-y-12">
                {/* Section 1: Informations générales */}
                <section id="informations-generales">
                  <h2
                    className="text-2xl sm:text-3xl mb-6"
                    style={{ fontWeight: 600 }}
                  >
                    Informations générales
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      En général, les annulations et les remboursements de réservations Airbnb sont soumis
                      aux{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        conditions d'annulation
                      </a>{" "}
                      de l'annonce. Dans les rares cas où des événements de
                      grande ampleur empêchent ou interdisent légalement la réalisation d'une réservation,
                      la Politique relative aux circonstances extraordinaires (la « Politique ») peut s'appliquer.
                      Lorsque cette politique s'applique, les voyageurs peuvent annuler leur réservation et
                      recevoir un remboursement, un crédit voyage ou une autre contrepartie, quelles que
                      soient les{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        conditions d'annulation
                      </a>{" "}
                      de la réservation, et les hôtes peuvent annuler{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        sans frais ni autres conséquences négatives
                      </a>
                      . Toutefois, le calendrier de l'annonce sera
                      bloqué pour les dates annulées.
                    </p>
                    <p>
                      Cette Politique s'applique aux réservations de logements, de services et
                      d'expériences, ainsi qu'aux réservations en cours ou dont l'arrivée est prévue à partir
                      de la date d'entrée en vigueur, sauf indication contraire d'Airbnb aux utilisateurs. La
                      Politique relative aux circonstances extraordinaires n'est pas une police d'assurance.
                    </p>
                  </div>
                </section>

                {/* Section 2: Quels événements sont couverts ? */}
                <section id="evenements-couverts">
                  <h2
                    className="text-2xl sm:text-3xl mb-6"
                    style={{ fontWeight: 600 }}
                  >
                    Quels événements sont couverts ?
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Les événements suivants (désignés dans la présente Politique par le terme
                      « Événements ») sont couverts par la présente Politique s'ils ont un impact sur la zone
                      géographique de votre réservation, se produisent après le moment de la réservation
                      et empêchent ou interdisent légalement sa réalisation future ou en cours :
                    </p>

                    <div className="space-y-6 mt-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Urgences de santé publique et épidémies déclarées.
                        </h3>
                        <p>
                          Les épidémies, les pandémies
                          et les urgences de santé publique déclarées par les autorités. Sont exclues les
                          maladies endémiques (par exemple, la grippe) ou communément associées à une
                          zone géographique (par exemple, le paludisme en Thaïlande). Le Covid-19 n'est pas
                          couvert par cette Politique relative aux circonstances extraordinaires.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Restrictions administratives en matière de voyages.
                        </h3>
                        <p>
                          Les restrictions de voyage
                          obligatoires imposées par un organisme gouvernemental, comme un ordre
                          d'évacuation ou de confinement. Sont exclues les recommandations de voyage non
                          obligatoires et les consignes gouvernementales de même type.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Opérations militaires et autres conflits.
                        </h3>
                        <p>
                          Les actes de guerre, les conflits, les
                          invasions, les guerres civiles, le terrorisme, les explosions, les bombardements, les
                          rébellions, les émeutes et les insurrections.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Pannes à grande échelle des services essentiels.
                        </h3>
                        <p>
                          Les pannes prolongées de services
                          essentiels, tels que le chauffage, l'eau et l'électricité, qui ont un impact sur la grande
                          majorité des logements d'une zone géographique donnée.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Catastrophes naturelles imprévisibles et phénomènes météorologiques violents.
                        </h3>
                        <p>
                          Les catastrophes naturelles imprévisibles, comme les tremblements de terre et les
                          tsunamis, et les phénomènes météorologiques violents imprévisibles, comme les
                          tornades. Sont exclus les événements prévisibles pour un lieu donné, comme décrit
                          plus loin.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Que se passe-t-il */}
                <section id="reservation-touchee">
                  <h2
                    className="text-2xl sm:text-3xl mb-6"
                    style={{ fontWeight: 600 }}
                  >
                    Que se passe-t-il si une réservation est touchée par un
                    Événement couvert ?
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Lorsqu'un événement de grande ampleur se produit, nous évaluons la situation pour
                      déterminer si elle relève de la Politique relative aux circonstances extraordinaires. Si
                      c'est le cas, nous appliquons la Politique pour la zone touchée et la période où nous
                      prévoyons que l'Événement empêchera les réservations d'avoir lieu ou les interdira
                      légalement. Les réservations en dehors de la zone et de la période définies peuvent
                      ne pas être éligibles, mais il se peut que les{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        hôtes puissent quand même annuler sans conséquences négatives s'ils ne sont pas en mesure d'accueillir des voyageurs
                      </a>
                      . Nous surveillons en permanence ces situations et ajustons la couverture au besoin pour
                      tenir compte de l'évolution des conditions. Si vous pensez que cette politique
                      s'applique à votre réservation, veuillez{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        nous contacter
                      </a>{" "}
                      pour en savoir plus sur les conditions requises.
                    </p>
                  </div>
                </section>

                {/* Section 4: Ce qui n'est pas couvert */}
                <section id="non-couvert">
                  <h2
                    className="text-2xl sm:text-3xl mb-6"
                    style={{ fontWeight: 600 }}
                  >
                    Ce qui n'est pas couvert
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Nous comprenons que d'autres circonstances indépendantes de votre volonté
                      peuvent perturber vos projets. Dans les situations non énumérées ci-dessus, votre
                      réservation reste soumise aux{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        conditions d'annulation
                      </a>{" "}
                      de l'hôte qui s'appliquent à l'annonce.
                    </p>

                    <p className="mt-4">
                      Exemples d'événements courants non couverts par cette politique :
                    </p>

                    <ul className="space-y-3 ml-6">
                      <li className="flex gap-3">
                        <span className="mt-1.5">•</span>
                        <span>
                          Événements qui ont une incidence sur un voyageur ou sur sa capacité à voyager,
                          mais pas sur l'emplacement de la réservation.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5">•</span>
                        <span>Blessure ou maladie imprévue.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5">•</span>
                        <span>
                          Obligations administratives telles que la participation à un jury ou les
                          comparutions devant un tribunal.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5">•</span>
                        <span>
                          Recommandations de voyage non obligatoires ou autres consignes
                          gouvernementales qui ne constituent pas une interdiction de voyager.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5">•</span>
                        <span>
                          Annulation ou reprogrammation d'un événement pour lequel la réservation a été
                          faite.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5">•</span>
                        <span>
                          Perturbations des transports telles que l'indisponibilité d'une compagnie aérienne,
                          les annulations de vols, les grèves des transports et les fermetures de routes
                          pour cause d'entretien.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5">•</span>
                        <span>
                          <a href="#" className="underline font-semibold text-gray-900">
                            Conditions météorologiques ou naturelles assez fréquentes pour être
                            prévisibles dans une zone géographique donnée
                          </a>
                          , telles que les ouragans en
                          Floride pendant la saison cyclonique ou les intempéries hivernales dans
                          l'hémisphère nord pendant les mois d'hiver, à moins que les circonstances ne
                          déclenchent un Événement couvert qui empêche la réalisation de la réservation,
                          tel que des restrictions de voyage obligatoires émises par le gouvernement.
                        </span>
                      </li>
                    </ul>

                    <p className="mt-6">
                      Pour les réservations non couvertes par cette politique, nous encourageons les
                      voyageurs et les hôtes à trouver un accord acceptable pour les deux parties, tel qu'un
                      remboursement intégral ou partiel, ou une modification des dates de réservation.
                      Notez que tout remboursement en dehors des conditions d'annulation de la
                      réservation est à la discrétion de l'hôte. Airbnb ne participe pas à ces
                      remboursements et ne les garantit pas.
                    </p>
                  </div>
                </section>

                {/* Section 5: Conséquences pour les hôtes */}
                <section id="consequences-hotes">
                  <h2
                    className="text-2xl sm:text-3xl mb-6"
                    style={{ fontWeight: 600 }}
                  >
                    Conséquences de la présente politique pour les hôtes
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Si une réservation est couverte par la Politique relative aux circonstances
                      extraordinaires, les hôtes peuvent l'annuler sans frais ni autres pénalités. Si un hôte
                      annule en vertu de cette politique, le calendrier de son annonce sera bloqué pour les
                      dates annulées. Si une réservation est annulée en vertu de la présente politique, l'hôte
                      ne reçoit pas de versement pour les dates concernées. Si le versement a déjà été
                      effectué, le montant remboursé sera retenu sur le ou les versements suivants.
                    </p>
                    <p>
                      Qu'une réservation soit couverte ou non par la présente politique, les hôtes peuvent
                      l'annuler pour certains{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        motifs valables
                      </a>
                      , tels que des dommages majeurs à un
                      logement, sans frais ni autres pénalités. Les hôtes sont tenus d'annuler une
                      réservation si leur logement est inhabitable ou non conforme à ce que le voyageur a
                      réservé. Le non-respect de cette obligation peut entraîner la suspension de l'annonce,
                      l'annulation des réservations existantes et le remboursement des voyageurs jusqu'à
                      ce que le logement soit habitable et conforme à la description de l'annonce. Cela
                      constitue également une infraction à nos{" "}
                      <a href="#" className="underline font-semibold text-gray-900">
                        règles de base pour les hôtes
                      </a>{" "}
                      et peut
                      entraîner des conséquences pouvant aller jusqu'à la suppression du compte.
                    </p>
                  </div>
                </section>

                {/* Section 6: Autres éléments */}
                <section id="autres-elements">
                  <h2
                    className="text-2xl sm:text-3xl mb-6"
                    style={{ fontWeight: 600 }}
                  >
                    Autres éléments à prendre en compte
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Cette politique ne limite pas vos droits en vertu de la réglementation locale, et toute
                      décision prise par Airbnb en vertu de cette politique n'affecte pas vos droits légaux.
                    </p>
                  </div>
                </section>

                {/* Section 7: Sur le même sujet */}
                <section className="mt-16 pt-12 border-t border-gray-200">
                  <h2
                    className="text-2xl sm:text-3xl mb-8"
                    style={{ fontWeight: 600 }}
                  >
                    Sur le même sujet
                  </h2>
                  <div className="space-y-8">
                    {/* Article 1 */}
                    <div className="border-b border-gray-200 pb-8">
                      <p className="text-sm text-gray-600 mb-2">
                        Guide pratique • Voyageur
                      </p>
                      <h3 className="text-lg font-semibold mb-2">
                        <a href="#" className="underline">
                          Annuler un séjour en raison de circonstances extraordinaires
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Si vous devez annuler car un événement majeur sur votre lieu de destination vous empêche de
                        bénéficier de votre réservation, nous pouvons vous aider.
                      </p>
                    </div>

                    {/* Article 2 */}
                    <div className="border-b border-gray-200 pb-8">
                      <p className="text-sm text-gray-600 mb-2">
                        Politique relative à la communauté Airbnb
                      </p>
                      <h3 className="text-lg font-semibold mb-2">
                        <a href="#" className="underline">
                          Règles de base pour les hôtes proposant un logement
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Veuillez consulter nos règles de base pour les hôtes proposant un logement.
                      </p>
                    </div>

                    {/* Article 3 */}
                    <div className="pb-8">
                      <p className="text-sm text-gray-600 mb-2">
                        Guide pratique • Voyageur
                      </p>
                      <h3 className="text-lg font-semibold mb-2">
                        <a href="#" className="underline">
                          Délais de remboursement
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Bien qu'ils soient émis presque immédiatement, la plupart des remboursements sont crédités
                        dans les 15 jours. Toutefois, la procédure peut prendre plus de temps selon le mode de paiement...
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div className="rounded-xl p-6">
                  <h3
                    className="text-xl mb-3"
                    style={{ fontWeight: 600 }}
                  >
                    Besoin de nous joindre ?
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Commençons par quelques questions afin de mieux vous
                    orienter.
                  </p>
                  <button className="w-full px-6 py-3 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Contactez-nous
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    Vous pouvez également nous{" "}
                    <a href="#" className="underline font-semibold text-gray-900">
                      envoyer vos remarques
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 z-40"
          style={{ fontWeight: 600 }}
        >
          <ChevronUp className="w-5 h-5" />
          <span className="text-sm">Retour en haut de la page</span>
        </button>
      )}

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
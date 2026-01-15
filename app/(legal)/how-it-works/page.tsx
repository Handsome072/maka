import type { Metadata } from 'next';
import { LegalFooter } from '@/app/components/LegalFooter';

export const metadata: Metadata = {
  title: 'Fonctionnement du site | Homiqio',
  description: 'Comprendre le fonctionnement de la plateforme HOMIQIO et le classement des annonces',
};

export default function HowItWorksPage() {
  return (
    <>
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
                  Pratiquement tout le monde peut devenir hôte, que vous soyez un professionnel ou un non-professionnel. Votre inscription et la mise en ligne de votre logement sont gratuites.
                </p>
                <p>Pour proposer des séjours agréables et adaptés aux voyageurs, nous demandons à tous les hôtes de respecter 4 critères de base :</p>
                <ul className="space-y-3 pl-6">
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Faire preuve de réactivité</strong> : maintenez un taux de réponse élevé en répondant aux demandes dans les 24 heures.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Accepter les demandes de réservation</strong> : montrez aux voyageurs qu'ils sont les bienvenus.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Éviter les annulations</strong> : les annulations ne sont pas anodines.
                  </li>
                  <li style={{ listStyleType: 'disc' }}>
                    <strong>Maintenir une bonne évaluation globale</strong> : les voyageurs aiment un niveau de qualité constant.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                QUI PEUT PUBLIER UNE EXPÉRIENCE SUR HOMIQIO ?
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Les expériences HOMIQIO sont des activités créées et animées par des passionnés. Chaque expérience est examinée pour s'assurer qu'elle respecte trois critères de qualité :
                </p>
                <ul className="space-y-3 pl-6">
                  <li style={{ listStyleType: 'disc' }}><strong>Expertise</strong> : les hôtes sont bien informés et passionnés.</li>
                  <li style={{ listStyleType: 'disc' }}><strong>Accès privilégié</strong> : découvrir des lieux uniques.</li>
                  <li style={{ listStyleType: 'disc' }}><strong>Relation</strong> : établir des relations humaines enrichissantes.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                FRAIS DE SERVICE
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>Votre inscription et la mise en ligne de votre logement sont gratuites.</p>
                <p>
                  Pour vous aider à utiliser au mieux la plateforme HOMIQIO, y compris des services tels que l'assistance client 24h/24 et le traitement des cartes de crédit, nous facturons des frais de service lorsqu'une réservation est confirmée.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                MODE DE PAIEMENT
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Tous les services de paiement liés à votre utilisation de la Plateforme HOMIQIO vous sont fournis par une ou plusieurs entités HOMIQIO Payments, comme le prévoient les Conditions de Service relatives aux paiements.
                </p>
                <p>
                  Nous acceptons différents modes de paiement en fonction du pays dans lequel se trouve votre compte.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                GARANTIE HÔTE ET ASSURANCE HÔTE
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Notre Garantie Hôte est conçue pour protéger les hôtes contre les dommages causés sur leurs propres biens. Notre Assurance Hôte protège contre des réclamations de tiers.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-base mb-4" style={{ fontWeight: 700, color: '#484848' }}>
                CENTRE DE RÉSOLUTION ET ASSISTANCE
              </h2>
              <div className="space-y-4 text-base" style={{ color: '#484848', lineHeight: '1.6' }}>
                <p>
                  Le Centre de résolution vous permet de demander ou d'envoyer de l'argent dans le cadre de votre voyage HOMIQIO.
                </p>
                <p>
                  En tant que voyageur, vous disposez de 60 jours après la date de votre départ du logement pour soumettre une demande dans le Centre de résolution.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <LegalFooter activePage="how-it-works" />
    </>
  );
}


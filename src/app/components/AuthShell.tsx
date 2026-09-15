import Link from "next/link";
import { ROUTES } from "../config/routes";

interface AuthShellProps {
  children: React.ReactNode;
}

/**
 * Mise en page des écrans d'authentification : visuel de marque à gauche
 * (écrans larges uniquement) et formulaire centré à droite.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* Visuel de marque */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10 xl:p-14 text-white">
        <img
          src="/assets/search-background.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06222b]/90 via-[#06222b]/35 to-[#06222b]/10" />

        <Link
          href={ROUTES.HOME}
          className="relative inline-flex self-start items-center rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur"
        >
          <img src="/sejoura_logo.png" alt="Séjoura" className="h-8 w-auto" />
        </Link>

        <div className="relative max-w-xl">
          <p className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
            Trouvez votre logement idéal
          </p>
          <p className="mt-4 text-lg xl:text-xl text-white/85 leading-relaxed">
            Logements, expériences et services : réservez votre prochain séjour en quelques clics avec Séjoura.
          </p>
        </div>
      </aside>

      {/* Formulaire */}
      <main className="flex min-h-screen flex-col px-5 py-4 sm:px-10 sm:py-6 xl:px-16 [@media(max-height:700px)]:py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href={ROUTES.HOME} className="lg:invisible">
            <img src="/sejoura_logo.png" alt="Séjoura" className="h-8 sm:h-9 w-auto" />
          </Link>
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="hidden sm:inline">Retour à l'accueil</span>
            <span className="sm:hidden">Accueil</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-4 sm:py-8 [@media(max-height:700px)]:py-3">
          <div className="w-full max-w-[460px] 2xl:max-w-[500px]">{children}</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
          <span>© Séjoura</span>
          <Link href={ROUTES.PRIVACY} className="hover:text-gray-700 transition-colors">
            Confidentialité
          </Link>
          <Link href={ROUTES.TERMS} className="hover:text-gray-700 transition-colors">
            Conditions générales
          </Link>
        </div>
      </main>
    </div>
  );
}

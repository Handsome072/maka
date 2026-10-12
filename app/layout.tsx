import type { Metadata } from 'next';
import '@/styles/index.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { FavoritesProvider } from '@/app/context/FavoritesContext';

export const metadata: Metadata = {
  title: 'Séjoura',
  description: 'Trouvez votre logement idéal avec Séjoura',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


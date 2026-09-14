import type { Metadata } from 'next';
import '@/styles/index.css';
import { AuthProvider } from '@/app/context/AuthContext';

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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


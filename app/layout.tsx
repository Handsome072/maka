import type { Metadata } from 'next';
import '@/styles/index.css';
import { AuthProvider } from '@/app/context/AuthContext';

export const metadata: Metadata = {
  title: 'HOMIQIO',
  description: 'Trouvez votre logement idéal avec HOMIQIO',
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


'use client';

import { AdminSidebar } from '@/app/components/AdminSidebar';

interface AdminPlaceholderProps {
  title: string;
}

export function AdminPlaceholder({ title }: AdminPlaceholderProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <div className="mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl mb-8" style={{ fontWeight: 600 }}>{title}</h1>
          
          <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-500 text-center">Contenu à venir</p>
          </div>
        </div>
      </main>
    </div>
  );
}

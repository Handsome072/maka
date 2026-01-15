'use client';

import { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'paypal';
  last4?: string;
  expiry?: string;
  email?: string;
  isDefault: boolean;
}

/**
 * Page Paiements
 */
export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '8888',
      expiry: '09/25',
      isDefault: false
    },
    {
      id: '3',
      type: 'paypal',
      email: 'jean.dupont@example.com',
      isDefault: false
    }
  ]);

  const setDefaultMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
  };

  const removeMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <span className="text-blue-600 font-bold">VISA</span>;
      case 'mastercard':
        return <span className="text-orange-500 font-bold">MC</span>;
      case 'paypal':
        return <span className="text-blue-500 font-bold">PayPal</span>;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Moyens de paiement</h1>
      <p className="text-gray-600 mb-8">
        Gérez vos modes de paiement pour vos réservations
      </p>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            className={`flex items-center justify-between p-4 border rounded-xl ${
              method.isDefault ? 'border-[#00A99D] bg-teal-50' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-10 border rounded flex items-center justify-center bg-white">
                {getCardIcon(method.type)}
              </div>
              <div>
                {method.type === 'paypal' ? (
                  <p className="font-medium">{method.email}</p>
                ) : (
                  <>
                    <p className="font-medium">•••• •••• •••• {method.last4}</p>
                    <p className="text-sm text-gray-500">Expire {method.expiry}</p>
                  </>
                )}
              </div>
              {method.isDefault && (
                <span className="px-2 py-1 bg-[#00A99D] text-white text-xs rounded-full">
                  Par défaut
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!method.isDefault && (
                <button 
                  onClick={() => setDefaultMethod(method.id)}
                  className="text-sm text-[#00A99D] hover:underline"
                >
                  Définir par défaut
                </button>
              )}
              <button 
                onClick={() => removeMethod(method.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-2 px-6 py-3 border-2 border-dashed rounded-xl hover:border-[#00A99D] hover:text-[#00A99D] transition-colors">
        <Plus className="w-5 h-5" />
        Ajouter un moyen de paiement
      </button>

      {/* Transaction History */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Historique des transactions</h2>
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 text-sm">15 janv. 2025</td>
                <td className="px-4 py-3 text-sm">Réservation - Appartement Paris</td>
                <td className="px-4 py-3 text-sm text-right font-medium">-262,68 €</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">5 déc. 2024</td>
                <td className="px-4 py-3 text-sm">Réservation - Studio Lyon</td>
                <td className="px-4 py-3 text-sm text-right font-medium">-189,50 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


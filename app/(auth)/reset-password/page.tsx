'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { authApi } from '@/app/services/api';
import { useAuth } from '@/app/context/AuthContext';

function ResetPasswordContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const { loginWithUser } = useAuth();

  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState(false);

  const passwordRules = [
    { valid: password.length >= 8,           text: 'Au moins 8 caractères' },
    { valid: /[A-Z]/.test(password),         text: 'Une lettre majuscule' },
    { valid: /[0-9]/.test(password),         text: 'Un chiffre' },
    { valid: /[^a-zA-Z0-9]/.test(password),  text: 'Un caractère spécial' },
  ];
  const isPasswordValid = passwordRules.every(r => r.valid);
  const passwordsMatch  = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid     = isPasswordValid && passwordsMatch && !!token && !!email;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await authApi.resetPassword(email, token, password, confirmPassword);
      // Log the user in with the returned data
      loginWithUser({
        id:         response.user.id,
        name:       `${response.user.first_name} ${response.user.last_name}`.trim(),
        first_name: response.user.first_name,
        last_name:  response.user.last_name,
        email:      response.user.email,
      });
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid link
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center">
            <Lock className="w-16 h-16 mx-auto text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lien invalide</h1>
            <p className="text-gray-500 mb-8">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mot de passe réinitialisé !
            </h1>
            <p className="text-gray-500">Vous êtes connecté. Redirection en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl p-10 md:p-12 shadow-lg border border-gray-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
            <p className="text-gray-500 text-sm mt-1">Pour le compte : {email}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Password */}
          <div className="mb-4">
            <label className="block text-base font-semibold mb-2">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Entrez votre nouveau mot de passe"
                className="w-full h-14 rounded-xl border border-gray-300 px-4 pr-12 text-base focus:outline-none focus:border-gray-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Rules */}
          {password && (
            <div className="mb-6 space-y-2">
              {passwordRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`text-sm ${rule.valid ? 'text-green-600' : 'text-gray-400'}`}>
                    {rule.valid ? '✓' : '○'}
                  </span>
                  <span className={`text-sm ${rule.valid ? 'text-green-600' : 'text-gray-500'}`}>
                    {rule.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Confirm */}
          <div className="mb-8">
            <label className="block text-base font-semibold mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                className={`w-full h-14 rounded-xl border px-4 pr-12 text-base focus:outline-none transition-colors ${
                  confirmPassword && !passwordsMatch
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-gray-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-2">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="w-full bg-black text-white h-14 rounded-xl font-semibold text-base hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>

          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-black font-semibold hover:underline"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

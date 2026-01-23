'use client';

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setPassword, isLoading, error } = useAuth();

  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const passwordErrors = [
    { valid: password.length >= 8, text: "Au moins 8 caractères" },
    { valid: /[A-Z]/.test(password), text: "Une lettre majuscule" },
    { valid: /[0-9]/.test(password), text: "Un chiffre" },
    { valid: /[^a-zA-Z0-9]/.test(password), text: "Un caractère spécial" },
  ];

  const isPasswordValid = passwordErrors.every(e => e.valid);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && passwordsMatch && token;

  const handleSubmit = async () => {
    if (!isFormValid || !token) return;

    try {
      await setPassword(token, password, confirmPassword);
      router.push("/");
    } catch {
      // Error is handled by context
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-10 md:p-12 shadow-lg border border-gray-100 text-center">
            <Lock className="w-16 h-16 mx-auto text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Lien invalide
            </h1>
            <p className="text-gray-500 mb-8">
              Ce lien de définition de mot de passe est invalide ou a expiré.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all"
            >
              S'inscrire à nouveau
            </button>
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
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Créez votre mot de passe</h1>
              <p className="text-gray-500 text-sm">Dernière étape pour terminer votre inscription</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-base font-semibold mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full h-14 rounded-xl border border-gray-300 px-4 pr-24 text-base focus:outline-none focus:border-gray-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Validation */}
          {password && (
            <div className="mb-6 space-y-2">
              {passwordErrors.map((err, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`text-sm ${err.valid ? 'text-green-600' : 'text-gray-400'}`}>
                    {err.valid ? '✓' : '○'}
                  </span>
                  <span className={`text-sm ${err.valid ? 'text-green-600' : 'text-gray-500'}`}>
                    {err.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label className="block text-base font-semibold mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                className={`w-full h-14 rounded-xl border px-4 pr-24 text-base focus:outline-none transition-colors ${
                  confirmPassword && !passwordsMatch 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-gray-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-2">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="w-full bg-black text-white h-14 rounded-xl font-semibold text-base hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création en cours..." : "Terminer l'inscription"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}


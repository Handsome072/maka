'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { StandardLoginView } from "@/app/components/StandardLoginView";
import { authApi } from "@/app/services/api";

type AuthView = "login" | "forgot-password";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithUser, error, clearError, isLoading } = useAuth();

  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const handleLogin = async (userEmail: string, password: string) => {
    try {
      clearError();
      await login(userEmail, password);
      router.push("/");
    } catch {
      // Error is handled by context
    }
  };

  const handleGoogleLogin = () => {
    // For now, use mock data for social login
    // TODO: Implement real OAuth flow
    loginWithUser({
      name: "Google User",
      email: "user@gmail.com",
      avatar: undefined,
    });
    router.push("/");
  };

  const handleForgotPassword = async () => {
    if (!email) return;

    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");

    try {
      const response = await authApi.forgotPassword(email);
      setForgotPasswordMessage(response.message);
    } catch (err: any) {
      setForgotPasswordMessage(err.message || "Une erreur est survenue");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "login":
        return "Connexion";
      case "forgot-password":
        return "Mot de passe oublié";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl p-10 md:p-12 shadow-lg border border-gray-100">
          {currentView === "login" ? (
            <StandardLoginView
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onSignupClick={() => router.push("/signup")}
              onForgotPasswordClick={() => setCurrentView("forgot-password")}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <>
              <div className="flex items-center mb-8">
                <button
                  onClick={() => {
                    setCurrentView("login");
                    setForgotPasswordMessage("");
                  }}
                  className="mr-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Retour"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-900"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
              </div>

              {currentView === "forgot-password" && (
                <div className="flex flex-col">
                  <p className="text-gray-500 text-base mb-8">
                    Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                  </p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {forgotPasswordMessage && (
                    <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                      {forgotPasswordMessage}
                    </div>
                  )}

                  <button
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordLoading || !email}
                    className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all transform active:scale-[0.98] mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordLoading ? "Envoi en cours..." : "Envoyer le lien"}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setCurrentView("login");
                        setForgotPasswordMessage("");
                      }}
                      className="text-sm text-black font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

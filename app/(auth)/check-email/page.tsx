'use client';

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { authApi } from "@/app/services/api";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResendEmail = async () => {
    if (isResending) return;
    
    setIsResending(true);
    setResendMessage("");
    
    try {
      await authApi.resendVerification();
      setResendMessage("E-mail de vérification renvoyé !");
    } catch {
      setResendMessage("Impossible de renvoyer l'e-mail. Veuillez réessayer.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl p-10 md:p-12 shadow-lg border border-gray-100">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.push("/signup")}
              className="mr-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Vérifiez votre e-mail</h1>
          </div>

          {/* Email Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-gray-700 mb-4">
              Nous avons envoyé un e-mail de vérification à :
            </p>
            <p className="font-semibold text-gray-900 text-lg mb-4">
              {email || "votre adresse e-mail"}
            </p>
            <p className="text-gray-600 text-sm">
              Cliquez sur le lien dans l'e-mail pour vérifier votre compte et définir votre mot de passe.
            </p>
          </div>

          {/* Resend Section */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 text-sm mb-4">
              Vous n'avez pas reçu l'e-mail ?
            </p>
            
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 text-gray-900 text-base py-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? "Envoi en cours..." : "Renvoyer l'e-mail"}
            </button>
            
            {resendMessage && (
              <p className={`text-center text-sm mt-3 ${resendMessage.includes("renvoyé") ? "text-green-600" : "text-red-600"}`}>
                {resendMessage}
              </p>
            )}
          </div>

          {/* Helper Text */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Conseil :</strong> Vérifiez également votre dossier spam ou courrier indésirable si vous ne trouvez pas l'e-mail.
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-500">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-black font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
              >
                Se connecter
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}


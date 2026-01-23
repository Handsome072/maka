'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { authApi } from "@/app/services/api";

type VerificationState = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [state, setState] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setState("error");
        setMessage("Token de vérification manquant.");
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setState("success");
        setMessage(response.message || "Votre e-mail a été vérifié avec succès !");
      } catch (error) {
        setState("error");
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("Une erreur est survenue lors de la vérification de votre e-mail.");
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-10 md:p-12 shadow-lg border border-gray-100 text-center">
          {state === "loading" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto text-gray-400 animate-spin mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Vérification en cours...
              </h1>
              <p className="text-gray-500">
                Veuillez patienter pendant que nous vérifions votre adresse e-mail.
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                E-mail vérifié !
              </h1>
              <p className="text-gray-500 mb-8">
                {message}
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all"
              >
                Se connecter
              </button>
            </>
          )}

          {state === "error" && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Échec de la vérification
              </h1>
              <p className="text-gray-500 mb-8">
                {message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all"
                >
                  S'inscrire à nouveau
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-gray-100 text-gray-900 h-12 rounded-xl font-medium text-base hover:bg-gray-200 transition-all"
                >
                  Retour à l'accueil
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


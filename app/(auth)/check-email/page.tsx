'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { AuthShell } from "@/app/components/AuthShell";
import { authApi } from "@/app/services/api";

// Un e-mail vient de partir : le renvoi n'est proposé qu'après ce délai, pour éviter les envois en rafale
const RESEND_COOLDOWN_SECONDS = 30;

function CheckEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get("email") || "").trim();

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || isResending || cooldown > 0) return;
    setIsResending(true);
    setFeedback(null);
    try {
      await authApi.requestSignup(email);
      setFeedback({ kind: "success", text: "Un nouvel e-mail vient d'être envoyé." });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setFeedback({
        kind: "error",
        text: "Impossible de renvoyer l'e-mail pour le moment. Réessayez dans quelques instants.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const resendLabel = isResending
    ? "Envoi en cours…"
    : cooldown > 0
      ? `Renvoyer le lien (${cooldown} s)`
      : "Renvoyer le lien";

  return (
    <AuthShell>
      <div className="w-14 h-14 rounded-2xl bg-[#E1F2F4] text-[#0A6B78] flex items-center justify-center mb-5">
        <Mail className="w-7 h-7" aria-hidden="true" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Consultez votre boîte mail</h1>

      {email ? (
        <>
          <p className="text-gray-500 text-base mb-3">Si cette adresse existe, un e-mail vient de lui être envoyé&nbsp;:</p>
          <p className="rounded-xl border border-[#E1EAEC] bg-[#F5F9F9] px-3.5 py-3 font-semibold text-gray-900 break-all">
            {email}
          </p>
        </>
      ) : (
        <p className="text-gray-500 text-base">Si cette adresse existe, un e-mail vient de lui être envoyé.</p>
      )}

      <ul className="mt-4 mb-6 list-disc pl-5 space-y-1 text-sm text-gray-600">
        <li>Ouvrez-le et cliquez sur le lien pour continuer. Il est valable 24&nbsp;heures.</li>
        <li>Rien reçu d'ici quelques minutes&nbsp;? Regardez dans le dossier courrier indésirable.</li>
      </ul>

      {email && (
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
          className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} aria-hidden="true" />
          {resendLabel}
        </button>
      )}

      {feedback && (
        <p
          role="status"
          className={`text-sm mt-3 text-center ${feedback.kind === "success" ? "text-green-700" : "text-red-600"}`}
        >
          {feedback.text}
        </p>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        <button
          type="button"
          onClick={() => router.push(email ? `/signup?email=${encodeURIComponent(email)}` : "/signup")}
          className="text-sm underline underline-offset-2 text-gray-700 hover:text-black transition-colors"
        >
          Modifier l'adresse e-mail
        </button>
        <span className="mx-2" aria-hidden="true">·</span>
        Déjà un compte ?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-sm text-black font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
        >
          Se connecter
        </button>
      </p>
    </AuthShell>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" aria-label="Chargement" />
          </div>
        </AuthShell>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { AuthShell } from "@/app/components/AuthShell";
import { CompleteSignupForm } from "@/app/components/CompleteSignupForm";
import { authApi } from "@/app/services/api";

type LinkState =
  | { kind: "checking" }
  | { kind: "valid"; email: string }
  | { kind: "expired"; email: string }
  | { kind: "used"; email: string }
  | { kind: "invalid" }
  | { kind: "unreachable" };

const primaryButton =
  "w-full h-12 bg-black text-white rounded-xl font-medium text-base hover:bg-gray-800 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed";
const secondaryButton =
  "w-full h-12 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center";

function StatusIcon({ tone, children }: { tone: "warn" | "info" | "error"; children: React.ReactNode }) {
  const colors = {
    warn: "bg-[#FFF4DA] text-[#8A5A00]",
    info: "bg-[#E1F2F4] text-[#0A6B78]",
    error: "bg-red-50 text-red-600",
  }[tone];
  return <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colors}`}>{children}</div>;
}

function CompleteSignupContent() {
  const router = useRouter();
  const token = (useSearchParams().get("token") ?? "").trim();

  const [state, setState] = useState<LinkState>({ kind: "checking" });
  const [attempt, setAttempt] = useState(0);
  const [resend, setResend] = useState<"idle" | "sending" | "error">("idle");

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setState({ kind: "invalid" });
      return;
    }

    setState({ kind: "checking" });
    authApi
      .checkSignupToken(token)
      .then((response) => {
        if (!cancelled) setState({ kind: "valid", email: response.email });
      })
      .catch((err: any) => {
        if (cancelled) return;
        const data = err?.data ?? {};
        if (data.status === "expired" && data.email) setState({ kind: "expired", email: data.email });
        else if (data.status === "used" && data.email) setState({ kind: "used", email: data.email });
        else if (data.status === "invalid" || err?.status === 400 || err?.status === 422) setState({ kind: "invalid" });
        else setState({ kind: "unreachable" });
      });

    return () => {
      cancelled = true;
    };
  }, [token, attempt]);

  const requestNewLink = async (email: string) => {
    setResend("sending");
    try {
      const response = await authApi.requestSignup(email);
      router.push(`/check-email?email=${encodeURIComponent(response.email)}`);
    } catch {
      setResend("error");
    }
  };

  const loginForgotUrl = (email: string) => `/login?forgot=1&email=${encodeURIComponent(email)}`;

  if (state.kind === "checking") {
    return (
      <AuthShell>
        <div className="flex flex-col items-center text-center py-10" role="status">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-4" aria-hidden="true" />
          <p className="text-gray-500">Vérification du lien…</p>
        </div>
      </AuthShell>
    );
  }

  if (state.kind === "valid") {
    return (
      <AuthShell wide>
        <CompleteSignupForm
          token={token}
          email={state.email}
          onCompleted={() => router.push("/")}
          onLinkProblem={(problem, email) => {
            const address = email || state.email;
            if (problem === "expired") setState({ kind: "expired", email: address });
            else if (problem === "used") setState({ kind: "used", email: address });
            else setState({ kind: "invalid" });
          }}
        />
      </AuthShell>
    );
  }

  if (state.kind === "expired") {
    return (
      <AuthShell>
        <StatusIcon tone="warn">
          <Clock className="w-7 h-7" aria-hidden="true" />
        </StatusIcon>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Ce lien n'est plus valable</h1>
        <p className="text-gray-500 text-base mb-6">Il a expiré&nbsp;: les liens d'inscription sont valables 24&nbsp;heures.</p>
        <div className="grid gap-3">
          <button
            type="button"
            className={primaryButton}
            disabled={resend === "sending"}
            onClick={() => requestNewLink(state.email)}
          >
            {resend === "sending" ? "Envoi en cours…" : "Recevoir un nouveau lien"}
          </button>
          <button type="button" className={secondaryButton} onClick={() => router.push("/login")}>
            Se connecter
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3.5 break-all">
          Le nouveau lien sera envoyé à {state.email}.
        </p>
        {resend === "error" && (
          <p role="alert" className="text-sm text-red-600 text-center mt-3">
            Impossible d'envoyer l'e-mail pour le moment. Réessayez dans quelques instants.
          </p>
        )}
      </AuthShell>
    );
  }

  if (state.kind === "used") {
    return (
      <AuthShell>
        <StatusIcon tone="info">
          <ShieldCheck className="w-7 h-7" aria-hidden="true" />
        </StatusIcon>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Votre compte existe déjà</h1>
        <p className="text-gray-500 text-base mb-6">
          Un compte a déjà été créé pour <span className="font-semibold text-gray-900 break-all">{state.email}</span>. Connectez-vous pour continuer.
        </p>
        <div className="grid gap-3">
          <button type="button" className={primaryButton} onClick={() => router.push("/login")}>
            Se connecter
          </button>
          <button type="button" className={secondaryButton} onClick={() => router.push(loginForgotUrl(state.email))}>
            Mot de passe oublié
          </button>
        </div>
      </AuthShell>
    );
  }

  if (state.kind === "unreachable") {
    return (
      <AuthShell>
        <StatusIcon tone="error">
          <XCircle className="w-7 h-7" aria-hidden="true" />
        </StatusIcon>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Vérification impossible</h1>
        <p className="text-gray-500 text-base mb-6">Le lien n'a pas pu être vérifié pour le moment. Vérifiez votre connexion puis réessayez.</p>
        <div className="grid gap-3">
          <button type="button" className={primaryButton} onClick={() => setAttempt((n) => n + 1)}>
            Réessayer
          </button>
          <button type="button" className={secondaryButton} onClick={() => router.push("/signup")}>
            Recommencer l'inscription
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <StatusIcon tone="error">
        <XCircle className="w-7 h-7" aria-hidden="true" />
      </StatusIcon>
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Lien d'inscription invalide</h1>
      <p className="text-gray-500 text-base mb-6">
        Il est incomplet ou a été modifié. Vérifiez que vous avez copié le lien en entier, ou recommencez l'inscription.
      </p>
      <button type="button" className={primaryButton} onClick={() => router.push("/signup")}>
        Recommencer l'inscription
      </button>
    </AuthShell>
  );
}

export default function CompleteSignupPage() {
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
      <CompleteSignupContent />
    </Suspense>
  );
}

import nodemailer, { type Transporter } from 'nodemailer';
import type { NextRequest } from 'next/server';

/** Envoi des emails via le SMTP Gmail déjà utilisé par Laravel (MAIL_* → SMTP_*). */

let transporter: Transporter | undefined;

function smtp(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  await smtp().sendMail({
    from: {
      // Adresse affichée aux destinataires : la boîte de marque, pas le compte SMTP.
      // MAIL_FROM permet de la changer ; SMTP_FROM n'est plus utilisé pour l'affichage.
      name: process.env.MAIL_FROM_NAME ?? 'Séjoura',
      address: process.env.MAIL_FROM ?? 'contact@sejoura.com',
    },
    replyTo: process.env.MAIL_REPLY_TO ?? process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

/** URL du site pour les liens des emails (FRONTEND_URL, sinon l'origine de la requête). */
export function frontendUrl(req: NextRequest): string {
  return (process.env.FRONTEND_URL || req.nextUrl.origin).replace(/\/$/, '');
}

/** Modèles d'email repris des vues Blade resources/views/emails de Laravel. */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const baseStyles = `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #000; font-size: 28px; font-weight: 700; margin: 0; }
        h2 { color: #000; font-size: 24px; margin-bottom: 20px; }
        p { color: #555; font-size: 16px; margin-bottom: 20px; }
        .button {
            display: inline-block;
            background-color: #000;
            color: #fff !important;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
        }
        .button:hover { background-color: #333; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #888;
            text-align: center;
        }
        .link-fallback { font-size: 12px; color: #888; word-break: break-all; }
        .warning { background: #fff8e1; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 14px; color: #92400e; }`;

function layout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>${baseStyles}
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>Séjoura</h1>
        </div>
${content}
        <div class="footer">
            <p>
                © ${new Date().getFullYear()} Séjoura. Tous droits réservés.<br>
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>`;
}

export function verifyEmailMail(firstName: string, verificationUrl: string): { subject: string; html: string } {
  const url = escapeHtml(verificationUrl);
  return {
    subject: 'Vérifiez votre adresse email - Séjoura',
    html: layout(
      'Vérifiez votre email - Séjoura',
      `
        <h2>Bonjour ${escapeHtml(firstName)},</h2>

        <p>
            Merci de vous être inscrit sur Séjoura ! Pour finaliser votre inscription
            et accéder à toutes les fonctionnalités, veuillez vérifier votre adresse email.
        </p>

        <p style="text-align: center;">
            <a href="${url}" class="button">
                Vérifier mon email
            </a>
        </p>

        <p>
            Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
        </p>
        <p class="link-fallback">
            ${url}
        </p>

        <p>
            Ce lien expirera dans 24 heures. Si vous n'avez pas créé de compte sur Séjoura,
            vous pouvez ignorer cet email.
        </p>
`,
    ),
  };
}

export function resetPasswordMail(firstName: string, resetUrl: string): { subject: string; html: string } {
  const url = escapeHtml(resetUrl);
  return {
    subject: 'Réinitialisation de votre mot de passe - Séjoura',
    html: layout(
      'Réinitialisation de mot de passe - Séjoura',
      `
        <h2>Bonjour ${escapeHtml(firstName)},</h2>

        <p>
            Vous avez demandé la réinitialisation de votre mot de passe Séjoura.
            Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
        </p>

        <p style="text-align: center;">
            <a href="${url}" class="button">
                Réinitialiser mon mot de passe
            </a>
        </p>

        <p>
            Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
        </p>
        <p class="link-fallback">${url}</p>

        <div class="warning">
            ⚠️ Ce lien est valable pendant <strong>60 minutes</strong>.
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email — votre mot de passe ne sera pas modifié.
        </div>
`,
    ),
  };
}

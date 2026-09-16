/** Modèles d'email Séjoura : HTML en tableaux et styles en ligne, pour les logiciels de messagerie. */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Origine du site, déduite du lien d'action, pour les images et les liens du pied de page. */
function siteOrigin(actionUrl: string): string {
  try {
    return new URL(actionUrl).origin;
  } catch {
    return (process.env.FRONTEND_URL ?? '').replace(/\/$/, '');
  }
}

const FONT = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const TITLE_FONT = "Poppins,'Segoe UI',Arial,sans-serif";
const CONTACT_EMAIL = process.env.MAIL_REPLY_TO ?? 'contact@sejoura.com';

/** Bouton d'action : cellule colorée + lien, pour rester cliquable partout. */
function button(url: string, label: string): string {
  return `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
                    <tr>
                      <td class="btn-cell" align="center" style="background:#0A6B78;border-radius:12px;">
                        <a class="btn-link" href="${url}" style="display:inline-block;padding:16px 30px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:12px;">${label}</a>
                      </td>
                    </tr>
                  </table>`;
}

/** Lien de secours, à copier-coller si le bouton ne fonctionne pas. */
function fallbackLink(url: string): string {
  return `
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background:#F5F9F9;border-radius:12px;padding:16px 18px;font-family:${FONT};font-size:13px;line-height:20px;color:#5A6B71;">
                        Le bouton ne fonctionne pas&nbsp;? Copiez ce lien dans votre navigateur&nbsp;:<br>
                        <a href="${url}" style="color:#0A6B78;word-break:break-all;">${url}</a>
                      </td>
                    </tr>
                  </table>`;
}

/** Encadré « Adresse à confirmer ». */
function addressBlock(email: string): string {
  return `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background:#EAF6F7;border-radius:10px;padding:12px 16px;font-family:${FONT};font-size:13px;line-height:20px;color:#5A6B71;">
                        Adresse à confirmer<br>
                        <span style="font-size:15px;font-weight:600;color:#17252A;">${email}</span>
                      </td>
                    </tr>
                  </table>`;
}

/** Une étape numérotée du parcours d'inscription. */
function stepRow(number: string, title: string, detail: string, current: boolean, last = false): string {
  const size = current ? '30px' : '28px';
  const pad = last ? '0' : '18px';
  const badge = current
    ? 'background:#0A6B78;color:#FFFFFF;'
    : 'border:1px solid #BFDDE2;background:#EAF6F7;color:#0A6B78;';
  return `
                    <tr>
                      <td width="44" valign="top" style="padding:0 0 ${pad};">
                        <div style="width:${size};height:${size};border-radius:15px;${badge}text-align:center;font-family:${TITLE_FONT};font-size:14px;line-height:${size};font-weight:600;">${number}</div>
                      </td>
                      <td valign="top" style="padding:3px 0 ${pad};font-family:${FONT};">
                        <div style="font-size:15px;line-height:22px;font-weight:600;color:#17252A;">${title}</div>
                        <div style="font-size:14px;line-height:21px;color:#5A6B71;">${detail}</div>
                      </td>
                    </tr>`;
}

/** Bloc « Votre inscription en 3 étapes ». */
function stepsBlock(rows: string): string {
  return `
              <tr>
                <td class="px" style="padding:36px 48px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="border-top:1px solid #E1EAEC;padding-top:28px;font-family:${FONT};font-size:11px;line-height:16px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#0A6B78;">Votre inscription en 3 étapes</td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">${rows}
                  </table>
                </td>
              </tr>`;
}

function layout(options: {
  origin: string;
  title: string;
  preheader: string;
  tag: string;
  hero?: boolean;
  content: string;
  footerNote: string;
}): string {
  const { origin, title, preheader, tag, hero = false, content, footerNote } = options;

  const heroRow = hero
    ? `
              <tr>
                <td style="padding:0;"><img src="${origin}/email/welcome-hero.jpg" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:18px 18px 0 0;background:#5EC6D8;"></td>
              </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background: #EEF4F5; -webkit-text-size-adjust: 100%; }
  a { color: #0A6B78; }
  @media (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .h1 { font-size: 25px !important; line-height: 33px !important; }
    .btn-cell, .btn-link { display: block !important; width: 100% !important; text-align: center !important; }
    .tag { display: none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#EEF4F5;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EEF4F5;">${preheader}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EEF4F5;">
  <tr>
    <td align="center" style="padding:32px 12px 40px;">
      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

        <tr>
          <td class="px" style="padding:0 8px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" valign="middle"><img src="${origin}/email/logo.png" width="128" alt="Séjoura" style="display:block;width:128px;height:auto;border:0;"></td>
                <td class="tag" align="right" valign="middle" style="font-family:${FONT};font-size:11px;line-height:16px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#5A6B71;">${tag}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#FFFFFF;border-radius:18px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${heroRow}
${content}
            </table>
          </td>
        </tr>

        <tr>
          <td class="px" style="padding:28px 48px 0;font-family:${FONT};font-size:14px;line-height:22px;color:#46575D;">
            Une question&nbsp;? Répondez simplement à cet e-mail ou écrivez-nous à <a href="mailto:${CONTACT_EMAIL}" style="color:#0A6B78;font-weight:600;text-decoration:none;">${CONTACT_EMAIL}</a>.
          </td>
        </tr>

        <tr>
          <td class="px" style="padding:24px 48px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-top:1px solid #D6E2E4;padding-top:22px;font-family:${FONT};font-size:12px;line-height:19px;color:#7A898E;">
                  <img src="${origin}/email/icon.png" width="24" height="24" alt="" style="display:block;width:24px;height:24px;border:0;margin:0 0 10px;">
                  <span style="font-weight:600;color:#46575D;">Séjoura</span> · Logements, expériences et services<br>
                  <a href="${origin}/privacy/" style="color:#7A898E;">Confidentialité</a> &nbsp;·&nbsp; <a href="${origin}/terms/" style="color:#7A898E;">Conditions générales</a><br>
                  ${footerNote}<br>
                  © ${new Date().getFullYear()} Séjoura
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Inscription, étape 1 : lien vers le formulaire final (adresse encore libre). */
export function signupLinkMail(recipientEmail: string, completeUrl: string): { subject: string; html: string } {
  const url = escapeHtml(completeUrl);
  const origin = siteOrigin(completeUrl);
  const email = escapeHtml(recipientEmail);

  return {
    subject: 'Continuez votre inscription sur Séjoura',
    html: layout({
      origin,
      title: 'Continuez votre inscription sur Séjoura',
      preheader: 'Confirmez votre adresse pour créer votre compte. Lien valable 24 heures.',
      tag: 'Inscription',
      hero: true,
      footerNote: `Vous recevez cet e-mail car une inscription a été demandée avec l'adresse ${email}.`,
      content: `
              <tr>
                <td class="px" style="padding:36px 48px 0;">
                  <h1 class="h1" style="margin:0 0 14px;font-family:${TITLE_FONT};font-size:30px;line-height:38px;font-weight:700;color:#17252A;">Confirmez votre adresse e-mail</h1>
                  <p style="margin:0 0 24px;font-family:${FONT};font-size:16px;line-height:26px;color:#46575D;">Vous avez demandé à créer un compte Séjoura avec cette adresse. Confirmez-la en cliquant sur le bouton&nbsp;: vous pourrez ensuite indiquer votre nom, votre date de naissance et choisir votre mot de passe.</p>
${addressBlock(email)}
${button(url, 'Continuer mon inscription')}
                </td>
              </tr>
${stepsBlock(
  stepRow('1', 'Confirmer votre adresse e-mail', 'Un clic sur le bouton ci-dessus suffit.', true) +
    stepRow('2', 'Compléter votre profil', 'Prénom, nom, date de naissance et mot de passe.', false) +
    stepRow('3', 'Réserver votre premier séjour', 'Parcourez les logements, expériences et services proposés par nos hôtes.', false, true),
)}

              <tr>
                <td class="px" style="padding:32px 48px 40px;">
${fallbackLink(url)}
                  <p style="margin:16px 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:#5A6B71;">Ce lien est valable 24&nbsp;heures et ne sert qu'une seule fois. Vous n'êtes pas à l'origine de cette demande&nbsp;? Ignorez ce message&nbsp;: aucun compte ne sera créé.</p>
                </td>
              </tr>`,
    }),
  };
}

/** Inscription demandée avec l'adresse d'un compte déjà actif. */
export function existingAccountMail(
  recipientEmail: string,
  loginUrl: string,
  forgotPasswordUrl: string,
): { subject: string; html: string } {
  const login = escapeHtml(loginUrl);
  const forgot = escapeHtml(forgotPasswordUrl);
  const origin = siteOrigin(loginUrl);
  const email = escapeHtml(recipientEmail);

  return {
    subject: 'Vous avez déjà un compte Séjoura',
    html: layout({
      origin,
      title: 'Vous avez déjà un compte Séjoura',
      preheader: 'Connectez-vous avec cette adresse, ou choisissez un nouveau mot de passe.',
      tag: 'Votre compte',
      footerNote: `Vous recevez cet e-mail car une inscription a été demandée avec l'adresse ${email}.`,
      content: `
              <tr>
                <td class="px" style="padding:40px 48px 0;">
                  <h1 class="h1" style="margin:0 0 14px;font-family:${TITLE_FONT};font-size:30px;line-height:38px;font-weight:700;color:#17252A;">Vous avez déjà un compte Séjoura</h1>
                  <p style="margin:0;font-family:${FONT};font-size:16px;line-height:26px;color:#46575D;">Une inscription vient d'être demandée avec <strong style="color:#17252A;">${email}</strong>, mais un compte existe déjà pour cette adresse. Il vous suffit de vous connecter.</p>
${button(login, 'Se connecter')}
                  <p style="margin:20px 0 0;font-family:${FONT};font-size:14px;line-height:22px;color:#46575D;">Mot de passe oublié&nbsp;? <a href="${forgot}" style="color:#0A6B78;font-weight:600;">Choisissez-en un nouveau</a>.</p>
                </td>
              </tr>

              <tr>
                <td class="px" style="padding:28px 48px 40px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background:#F5F9F9;border-radius:12px;padding:14px 16px;font-family:${FONT};font-size:13px;line-height:20px;color:#5A6B71;">
                        Vous n'êtes pas à l'origine de cette demande&nbsp;? Ignorez ce message&nbsp;: votre compte n'a pas été modifié.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`,
    }),
  };
}

/**
 * Ancien parcours : lien de vérification d'une inscription créée avant l'inscription par e-mail seul
 * (utilisé par le renvoi du lien pour ces comptes).
 */
export function verifyEmailMail(
  firstName: string,
  verificationUrl: string,
  recipientEmail = '',
): { subject: string; html: string } {
  const url = escapeHtml(verificationUrl);
  const origin = siteOrigin(verificationUrl);
  const name = escapeHtml(firstName);
  const email = escapeHtml(recipientEmail);

  return {
    subject: 'Bienvenue sur Séjoura, confirmez votre adresse e-mail',
    html: layout({
      origin,
      title: 'Bienvenue sur Séjoura',
      preheader: "Plus qu'une étape pour activer votre compte et réserver votre premier séjour.",
      tag: "Confirmation d'inscription",
      hero: true,
      footerNote: email
        ? `Vous recevez cet e-mail car un compte Séjoura vient d'être créé avec l'adresse ${email}.`
        : "Vous recevez cet e-mail car un compte Séjoura vient d'être créé avec cette adresse.",
      content: `
              <tr>
                <td class="px" style="padding:36px 48px 0;">
                  <h1 class="h1" style="margin:0 0 14px;font-family:${TITLE_FONT};font-size:30px;line-height:38px;font-weight:700;color:#17252A;">Bienvenue sur Séjoura, ${name}</h1>
                  <p style="margin:0 0 24px;font-family:${FONT};font-size:16px;line-height:26px;color:#46575D;">Merci d'avoir créé votre compte. Confirmez votre adresse e-mail pour l'activer&nbsp;: vous choisirez ensuite votre mot de passe, puis vous pourrez réserver logements, expériences et services.</p>
${email ? addressBlock(email) : ''}
${button(url, 'Confirmer mon adresse e-mail')}
                </td>
              </tr>
${stepsBlock(
  stepRow('1', 'Confirmer votre adresse e-mail', 'Un clic sur le bouton ci-dessus suffit.', true) +
    stepRow('2', 'Créer votre mot de passe', "La page s'ouvre automatiquement après la confirmation.", false) +
    stepRow('3', 'Réserver votre premier séjour', 'Parcourez les logements, expériences et services proposés par nos hôtes.', false, true),
)}

              <tr>
                <td class="px" style="padding:32px 48px 40px;">
${fallbackLink(url)}
                  <p style="margin:16px 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:#5A6B71;">Ce lien est personnel et ne sert qu'une seule fois. Vous n'êtes pas à l'origine de cette inscription&nbsp;? Ignorez ce message&nbsp;: l'adresse ne sera pas confirmée.</p>
                </td>
              </tr>`,
    }),
  };
}

/** Email de réinitialisation du mot de passe (lien valable 60 minutes, voir reset-password). */
export function resetPasswordMail(firstName: string, resetUrl: string): { subject: string; html: string } {
  const url = escapeHtml(resetUrl);
  const origin = siteOrigin(resetUrl);
  const name = escapeHtml(firstName);

  return {
    subject: 'Réinitialisation de votre mot de passe - Séjoura',
    html: layout({
      origin,
      title: 'Réinitialisation de mot de passe - Séjoura',
      preheader: 'Choisissez un nouveau mot de passe : le lien est valable 60 minutes.',
      tag: 'Sécurité du compte',
      footerNote: 'Vous recevez cet e-mail car une réinitialisation a été demandée pour ce compte Séjoura.',
      content: `
              <tr>
                <td class="px" style="padding:40px 48px 0;">
                  <h1 class="h1" style="margin:0 0 14px;font-family:${TITLE_FONT};font-size:30px;line-height:38px;font-weight:700;color:#17252A;">Bonjour ${name},</h1>
                  <p style="margin:0 0 24px;font-family:${FONT};font-size:16px;line-height:26px;color:#46575D;">Vous avez demandé la réinitialisation de votre mot de passe Séjoura. Choisissez-en un nouveau avec le bouton ci-dessous.</p>
${button(url, 'Choisir un nouveau mot de passe')}
                </td>
              </tr>

              <tr>
                <td class="px" style="padding:32px 48px 40px;">
${fallbackLink(url)}
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
                    <tr>
                      <td style="background:#FFF6E5;border-left:4px solid #E5A82E;border-radius:8px;padding:14px 16px;font-family:${FONT};font-size:13px;line-height:20px;color:#6E4500;">
                        Ce lien est valable <strong>60 minutes</strong>. Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail&nbsp;: votre mot de passe restera inchangé.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`,
    }),
  };
}

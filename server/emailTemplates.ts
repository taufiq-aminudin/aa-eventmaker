/**
 * AA EVENT MAKER — Reusable Responsive Email Template Generator
 * Clean, mobile-friendly, brand-consistent HTML emails with AALogo, header, card container, CTA, and footer.
 */

export interface EmailTemplateOptions {
  title: string;
  preheader?: string;
  recipientName?: string;
  headline: string;
  bodyParagraphs: string[];
  keyDetails?: { label: string; value: string; highlight?: boolean }[];
  ctaButton?: {
    label: string;
    url: string;
    style?: 'primary' | 'success' | 'danger';
  };
  secondaryText?: string;
  securityNotice?: string;
  unsubscribeUrl?: string;
}

export function generateBrandEmailHtml(options: EmailTemplateOptions): string {
  const {
    title,
    preheader = 'Pemberitahuan Resmi AA Event Maker',
    recipientName,
    headline,
    bodyParagraphs,
    keyDetails = [],
    ctaButton,
    secondaryText,
    securityNotice,
    unsubscribeUrl = 'https://aa-eventmaker.my.id/settings',
  } = options;

  const currentYear = new Date().getFullYear();

  const buttonColor =
    ctaButton?.style === 'success'
      ? '#059669'
      : ctaButton?.style === 'danger'
      ? '#dc2626'
      : '#2563eb';

  const detailsRows = keyDetails
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 14px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9; width: 38%;">
          ${escapeHtml(item.label)}
        </td>
        <td style="padding: 10px 14px; font-size: 13px; font-weight: ${
          item.highlight ? '700' : '600'
        }; color: ${
        item.highlight ? '#0f172a' : '#1e293b'
      }; border-bottom: 1px solid #f1f5f9;">
          ${escapeHtml(item.value)}
        </td>
      </tr>
    `
    )
    .join('');

  const paragraphsHtml = bodyParagraphs
    .map(
      (p) =>
        `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #334155;">${escapeHtml(
          p
        )}</p>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text for inbox preview -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all;">
    ${escapeHtml(preheader)} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Top Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 36px; text-align: left;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      <span style="color: #60a5fa;">AA</span> <span style="font-weight: 300; opacity: 0.85;">:</span> EVENT MAKER
                    </div>
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-top: 4px; font-weight: 700;">
                      Platform Undangan Digital & Manajemen Acara
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 6px 12px; background-color: rgba(255, 255, 255, 0.1); border-radius: 9999px; font-size: 11px; font-weight: 700; color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.2);">
                      Pemberitahuan Resmi
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              ${
                recipientName
                  ? `<div style="font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 8px;">Halo, ${escapeHtml(
                      recipientName
                    )}</div>`
                  : ''
              }
              <h1 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.35; letter-spacing: -0.3px;">
                ${escapeHtml(headline)}
              </h1>

              ${paragraphsHtml}

              <!-- Details Table (if any) -->
              ${
                keyDetails.length > 0
                  ? `
                <div style="margin: 24px 0 28px 0; background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${detailsRows}
                  </table>
                </div>
              `
                  : ''
              }

              <!-- Primary CTA Button -->
              ${
                ctaButton
                  ? `
                <div style="margin: 30px 0 24px 0; text-align: center;">
                  <a href="${escapeHtml(ctaButton.url)}" target="_blank" style="display: inline-block; background-color: ${buttonColor}; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); text-align: center;">
                    ${escapeHtml(ctaButton.label)} &rarr;
                  </a>
                </div>
              `
                  : ''
              }

              ${
                secondaryText
                  ? `
                <div style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 20px; padding-top: 16px; border-top: 1px dashed #e2e8f0;">
                  ${escapeHtml(secondaryText)}
                </div>
              `
                  : ''
              }

              <!-- Security Notice -->
              ${
                securityNotice
                  ? `
                <div style="margin-top: 24px; padding: 12px 16px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0; font-size: 12px; color: #1e40af; line-height: 1.5;">
                  <strong>Catatan Keamanan:</strong> ${escapeHtml(securityNotice)}
                </div>
              `
                  : ''
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px 32px 36px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6; text-align: center;">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #334155;">
                AA Event Maker — Platform Solusi Acara & Undangan Digital Indonesia
              </p>
              <p style="margin: 0 0 12px 0;">
                Website: <a href="https://aa-eventmaker.my.id/" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 600;">https://aa-eventmaker.my.id/</a> &bull;
                Layanan Pelanggan WhatsApp: <a href="https://wa.me/6281382000412" target="_blank" style="color: #059669; text-decoration: none; font-weight: 600;">+62 813-8200-0412</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Email ini dikirim secara otomatis oleh sistem AA Event Maker. Jangan membagikan kata sandi atau kode verifikasi kepada siapa pun.<br>
                <a href="${escapeHtml(unsubscribeUrl)}" target="_blank" style="color: #64748b; text-decoration: underline;">Kelola Preferensi Notifikasi</a> &bull; 
                <a href="https://aa-eventmaker.my.id/privacy" target="_blank" style="color: #64748b; text-decoration: underline;">Kebijakan Privasi</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8;">
                &copy; ${currentYear} AA Event Maker. Hak cipta dilindungi undang-undang.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

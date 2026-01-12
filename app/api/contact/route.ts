import { NextResponse } from "next/server";
import { Resend } from "resend";

/** Contact form submission data */
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/** Email validation regex (RFC 5322 simplified) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Maximum field lengths to prevent abuse */
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  message: 5000,
} as const;

/**
 * Validates contact form data
 * @returns Error message or null if valid
 */
function validateFormData(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return "Neveljavni podatki";
  }

  const { name, email, message } = data as ContactFormData;

  if (!name?.trim()) return "Ime je obvezno";
  if (!email?.trim()) return "Email je obvezen";
  if (!message?.trim()) return "Sporočilo je obvezno";

  if (name.length > MAX_LENGTHS.name) return "Ime je predolgo";
  if (email.length > MAX_LENGTHS.email) return "Email je predolg";
  if (message.length > MAX_LENGTHS.message) return "Sporočilo je predolgo";

  if (!EMAIL_REGEX.test(email)) return "Neveljaven email naslov";

  return null;
}

/**
 * Escapes HTML special characters to prevent XSS in emails
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * POST /api/contact
 * Handles contact form submissions
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email storitev ni konfigurirana" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validationError = validateFormData(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { name, email, message } = body as ContactFormData;
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Nordia Kontakt <kontakt@nordia.si>",
      to: ["info@nordia.si"],
      replyTo: email.trim(),
      subject: `Nova poizvedba od ${escapeHtml(name.trim())}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #2563eb; margin-bottom: 24px; font-weight: 600;">Nova poizvedba s spletne strani</h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #2563eb;">
            <p style="margin: 0 0 12px 0;"><strong>Ime:</strong> ${escapeHtml(name.trim())}</p>
            <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email.trim())}" style="color: #2563eb;">${escapeHtml(email.trim())}</a></p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; font-weight: 600;">Sporočilo:</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message.trim())}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />

          <p style="color: #64748b; font-size: 13px; margin: 0;">
            Poslano preko kontaktnega obrazca na nordia.si
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Napaka pri pošiljanju sporočila" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Prišlo je do napake" },
      { status: 500 }
    );
  }
}

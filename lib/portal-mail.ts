import { Resend } from "resend";

/**
 * Shared mailer for the two intake portals (/api/apply, /api/submit).
 *
 * Env:
 *  - RESEND_API_KEY   — required in production. Without it, dev builds log the
 *                       payload and report success so the UI flow can be tested.
 *  - PORTAL_TO_EMAIL  — destination inbox. Until a domain is verified with
 *                       Resend, this must be the email of the Resend account.
 *  - PORTAL_FROM_EMAIL — optional; defaults to Resend's shared onboarding
 *                       sender, which works without domain verification.
 */

export type SubmissionRow = { label: string; value: string };

export type SubmissionAttachment = {
  filename: string;
  content: Buffer;
};

export type SendResult =
  | { ok: true; dev?: boolean }
  | { ok: false; error: string };

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendPortalEmail({
  subject,
  replyTo,
  rows,
  attachment,
}: {
  subject: string;
  replyTo?: string;
  rows: SubmissionRow[];
  attachment?: SubmissionAttachment;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.PORTAL_TO_EMAIL;

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[portal-mail] DEV MODE — email not sent (missing RESEND_API_KEY / PORTAL_TO_EMAIL).");
      console.log(`[portal-mail] subject: ${subject}`);
      for (const r of rows) console.log(`[portal-mail]   ${r.label}: ${r.value}`);
      if (attachment) console.log(`[portal-mail]   attachment: ${attachment.filename} (${attachment.content.length} bytes)`);
      return { ok: true, dev: true };
    }
    return { ok: false, error: "Submissions are not configured yet. Please email us directly." };
  }

  const text = rows.map((r) => `${r.label}: ${r.value}`).join("\n");
  const html = `
    <div style="font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #111;">
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        ${rows
          .map(
            (r) => `
          <tr>
            <td style="border: 1px solid #ddd; color: #777; text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px;">${escapeHtml(r.label)}</td>
            <td style="border: 1px solid #ddd; white-space: pre-wrap;">${escapeHtml(r.value)}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.PORTAL_FROM_EMAIL ?? "Lopes Capital <onboarding@resend.dev>",
    to,
    subject,
    text,
    html,
    replyTo,
    attachments: attachment
      ? [{ filename: attachment.filename, content: attachment.content }]
      : undefined,
  });

  if (error) {
    console.error("[portal-mail] resend error:", error);
    return { ok: false, error: "We couldn't record the submission. Please try again." };
  }
  return { ok: true };
}

/** Strip a browser-supplied filename down to something safe for an attachment. */
export function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "attachment";
  return base.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "attachment";
}

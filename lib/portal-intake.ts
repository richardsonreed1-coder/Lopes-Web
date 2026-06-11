import {
  sendPortalEmail,
  safeFilename,
  type SubmissionRow,
} from "@/lib/portal-mail";

/**
 * Shared POST handler for the intake portals. Each route declares its expected
 * fields; this parses the multipart body, validates, and emails the result
 * (attachment included) via Resend.
 */

export type IntakeFieldSpec = {
  name: string;
  label: string;
  required?: boolean;
  maxLen?: number;
};

export type IntakeFileSpec = {
  name: string;
  label: string;
  required?: boolean;
  /** lowercase extensions, e.g. [".pdf"] */
  accept: string[];
  maxMB: number;
};

export type IntakeSpec = {
  fields: IntakeFieldSpec[];
  file?: IntakeFileSpec;
  subject: (fields: Record<string, string>) => string;
};

function bad(status: number, error: string): Response {
  return Response.json({ ok: false, error }, { status });
}

export async function handlePortalPost(
  request: Request,
  spec: IntakeSpec
): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad(400, "Malformed submission.");
  }

  // Honeypot: bots fill the hidden "website" field — accept silently, send nothing.
  const honeypot = form.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return Response.json({ ok: true });
  }

  const fields: Record<string, string> = {};
  for (const f of spec.fields) {
    const raw = form.get(f.name);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (f.required && !value) return bad(400, `Missing required field: ${f.label}.`);
    if (value.length > (f.maxLen ?? 4000)) return bad(400, `${f.label} is too long.`);
    fields[f.name] = value;
  }

  const email = fields.email ?? "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad(400, "Please enter a valid email address.");
  }

  let attachment: { filename: string; content: Buffer } | undefined;
  if (spec.file) {
    const f = form.get(spec.file.name);
    const hasFile = f instanceof File && f.size > 0;
    if (spec.file.required && !hasFile) {
      return bad(400, `Missing required file: ${spec.file.label}.`);
    }
    if (hasFile) {
      const file = f as File;
      const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
      if (!spec.file.accept.includes(ext)) {
        return bad(400, `${spec.file.label}: allowed types are ${spec.file.accept.join(", ")}.`);
      }
      if (file.size > spec.file.maxMB * 1024 * 1024) {
        return bad(400, `${spec.file.label}: file must be under ${spec.file.maxMB}MB.`);
      }
      attachment = {
        filename: safeFilename(file.name),
        content: Buffer.from(await file.arrayBuffer()),
      };
    }
  }

  const rows: SubmissionRow[] = spec.fields
    .filter((f) => fields[f.name])
    .map((f) => ({ label: f.label, value: fields[f.name] }));
  if (attachment) {
    rows.push({ label: spec.file!.label, value: `${attachment.filename} (attached)` });
  }

  const result = await sendPortalEmail({
    subject: spec.subject(fields),
    replyTo: email || undefined,
    rows,
    attachment,
  });

  if (!result.ok) return bad(502, result.error);
  return Response.json({ ok: true });
}

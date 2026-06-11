"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CurtainLink } from "@/components/curtain-link";

/**
 * PortalForm — shared intake form for the two portals (/apply, /submit).
 * Config-driven so each page declares its fields as data, matching the
 * data-driven convention used across the site. Posts multipart FormData to
 * `endpoint`; renders idle → submitting → received states.
 */

export type PortalField =
  | {
      kind: "text" | "email" | "tel" | "url";
      name: string;
      label: string;
      placeholder?: string;
      required?: boolean;
      half?: boolean;
    }
  | {
      kind: "select";
      name: string;
      label: string;
      options: string[];
      required?: boolean;
      half?: boolean;
    }
  | {
      kind: "textarea";
      name: string;
      label: string;
      placeholder?: string;
      required?: boolean;
      rows?: number;
    }
  | {
      kind: "file";
      name: string;
      label: string;
      required?: boolean;
      /** lowercase extensions, e.g. [".pdf", ".docx"] */
      accept: string[];
      maxMB: number;
      hint?: string;
    };

const INPUT_CLASS =
  "w-full rounded-sm border border-rule bg-ink px-4 py-3 font-sans text-[15px] text-paper placeholder:text-paper/30 transition-colors focus:border-purple-2 focus:outline-none focus:ring-1 focus:ring-purple-2";

const LABEL_CLASS =
  "mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute";

function FieldLabel({ field }: { field: { label: string; required?: boolean; name: string } }) {
  return (
    <label htmlFor={field.name} className={LABEL_CLASS}>
      {field.label}
      {field.required ? <span className="text-purple-2"> *</span> : null}
    </label>
  );
}

export function PortalForm({
  endpoint,
  fields,
  submitLabel,
  receivedNote,
}: {
  endpoint: string;
  fields: PortalField[];
  submitLabel: string;
  receivedNote: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "received">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Client-side file validation (server re-validates).
    for (const f of fields) {
      if (f.kind !== "file") continue;
      const file = data.get(f.name);
      if (file instanceof File && file.size > 0) {
        const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
        if (!f.accept.includes(ext)) {
          setError(`${f.label}: please use ${f.accept.join(", ")}`);
          return;
        }
        if (file.size > f.maxMB * 1024 * 1024) {
          setError(`${f.label}: file must be under ${f.maxMB}MB`);
          return;
        }
      }
    }

    setStatus("submitting");
    try {
      const res = await fetch(endpoint, { method: "POST", body: data });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && json?.ok) {
        setStatus("received");
      } else {
        setStatus("idle");
        setError(json?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("idle");
      setError("Network error. Please try again.");
    }
  }

  if (status === "received") {
    return (
      <div className="rounded-sm border border-rule bg-ink-2 px-8 py-16 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-purple-2">
          Transmission received
        </div>
        <div className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-medium italic leading-none text-paper">
          On the ledger.
        </div>
        <p className="mx-auto mt-5 max-w-[44ch] font-sans text-[15px] leading-[1.65] text-paper-dim">
          {receivedNote}
        </p>
        <div className="mt-9">
          <CurtainLink
            href="/"
            accent="#7A4FD9"
            label="Returning to hub"
            className="inline-flex items-center gap-3 rounded-sm border border-rule px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute transition-colors hover:border-paper/30 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-2"
          >
            ← Back to the hub
          </CurtainLink>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate={false} className="rounded-sm border border-rule bg-ink-2 p-6 md:p-10">
      {/* Honeypot — hidden from humans; bots that fill it get silently dropped. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((f) => {
          if (f.kind === "textarea") {
            return (
              <div key={f.name} className="md:col-span-2">
                <FieldLabel field={f} />
                <textarea
                  id={f.name}
                  name={f.name}
                  required={f.required}
                  placeholder={f.placeholder}
                  rows={f.rows ?? 5}
                  maxLength={4000}
                  className={`${INPUT_CLASS} resize-y`}
                />
              </div>
            );
          }
          if (f.kind === "select") {
            return (
              <div key={f.name} className={f.half ? "" : "md:col-span-2"}>
                <FieldLabel field={f} />
                <select id={f.name} name={f.name} required={f.required} defaultValue="" className={INPUT_CLASS}>
                  <option value="" disabled>
                    Select…
                  </option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (f.kind === "file") {
            const chosen = fileNames[f.name];
            return (
              <div key={f.name} className="md:col-span-2">
                <FieldLabel field={f} />
                <label
                  htmlFor={f.name}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-dashed border-rule bg-ink px-4 py-4 transition-colors hover:border-paper/30 has-[:focus-visible]:border-purple-2 has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-purple-2"
                >
                  <span className={`truncate font-sans text-[14px] ${chosen ? "text-paper" : "text-paper/40"}`}>
                    {chosen ?? `Choose a file (${f.accept.join(", ")} · max ${f.maxMB}MB)`}
                  </span>
                  <span className="shrink-0 rounded-sm border border-rule px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-paper-mute">
                    Browse
                  </span>
                  <input
                    id={f.name}
                    name={f.name}
                    type="file"
                    required={f.required}
                    accept={f.accept.join(",")}
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      setFileNames((prev) => ({ ...prev, [f.name]: file ? file.name : undefined as unknown as string }));
                    }}
                  />
                </label>
                {f.hint ? (
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35">{f.hint}</p>
                ) : null}
              </div>
            );
          }
          return (
            <div key={f.name} className={f.half ? "" : "md:col-span-2"}>
              <FieldLabel field={f} />
              <input
                id={f.name}
                name={f.name}
                type={f.kind}
                required={f.required}
                placeholder={f.placeholder}
                maxLength={300}
                className={INPUT_CLASS}
              />
            </div>
          );
        })}
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-sm border border-[#E64A58]/40 bg-[#E64A58]/10 px-4 py-3 font-sans text-[14px] text-[#F4A6AD]"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35">
          Read by a person · no auto-replies · nothing shared
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-3 rounded-sm bg-paper px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Transmitting…" : submitLabel}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

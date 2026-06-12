import { PortalPage } from "@/components/portal-page";
import type { PortalField } from "@/components/portal-form";

export const metadata = {
  title: "Applications — Lopes Capital",
  description:
    "Internships and roles at Lopes Capital, a Scottsdale multi-family office. Operator-built, capital-deployed.",
};

const FIELDS: PortalField[] = [
  { kind: "text", name: "name", label: "Full name", placeholder: "Jane Rivera", required: true, half: true },
  { kind: "email", name: "email", label: "Email", placeholder: "jane@example.com", required: true, half: true },
  { kind: "tel", name: "phone", label: "Phone", placeholder: "(480) 555-0142", half: true },
  {
    kind: "select",
    name: "position",
    label: "Applying for",
    options: ["Internship", "Full-time role", "Either — best fit"],
    required: true,
    half: true,
  },
  {
    kind: "info",
    name: "internNote",
    text: "Internships are fully remote. Compensation depends on the track — some are paid, some are structured around the project and outcome. We'll cover specifics early in the process.",
    showWhen: { field: "position", equals: ["Internship", "Either — best fit"] },
  },
  {
    kind: "text",
    name: "school",
    label: "School / program",
    placeholder: "ASU · W. P. Carey · Finance '27",
    showWhen: { field: "position", equals: ["Internship", "Either — best fit"] },
  },
  {
    kind: "select",
    name: "area",
    label: "Area of interest",
    options: [
      "Capital Markets",
      "Real Estate",
      "Education",
      "Healthcare",
      "Media & Consumer",
      "Operations",
      "Generalist — put me where it matters",
    ],
    required: true,
  },
  { kind: "url", name: "link", label: "LinkedIn / portfolio", placeholder: "https://linkedin.com/in/…" },
  {
    kind: "textarea",
    name: "note",
    label: "The note",
    placeholder:
      "Skip the cover letter. Tell us the most impressive thing you've built, run, or figured out — and why you want to do it here.",
    required: true,
    rows: 6,
  },
  {
    kind: "file",
    name: "resume",
    label: "Résumé",
    required: true,
    accept: [".pdf", ".doc", ".docx"],
    maxMB: 4,
    hint: "PDF preferred",
  },
];

export default function ApplyPage() {
  return (
    <PortalPage
      eyebrow="Portal · Talent"
      title={
        <>
          Join the <em className="italic font-medium text-purple-2">operation</em>.
        </>
      }
      emphasis="internships & roles"
      body="We hire operators, not résumés — people who'd rather run the thing than model it. Five domains, small team, real responsibility from week one. Tell us what you've actually done."
      watermark="Lopes · Portal · Applications"
      endpoint="/api/apply"
      fields={FIELDS}
      submitLabel="Submit application"
      receivedNote="Your application is in. Every submission is read by a person — if there's a fit, you'll hear from us directly."
      aside={[
        { label: "Who we look for", value: "Builders and owners. Evidence of finished work beats credentials." },
        { label: "Internships", value: "Fully remote, scoped to a real project with a real outcome. Paid for select tracks — terms covered early in the process." },
        { label: "Process", value: "One application, one conversation, one working session. No gauntlets." },
        { label: "Response", value: "If there's a fit, we reply within two weeks." },
      ]}
    />
  );
}

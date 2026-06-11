import { PortalPage } from "@/components/portal-page";
import type { PortalField } from "@/components/portal-form";

export const metadata = {
  title: "Deal Submission — Lopes Capital",
  description:
    "Bring Lopes Capital an opportunity — direct investments, acquisitions, real estate, and co-invests across our five domains.",
};

const FIELDS: PortalField[] = [
  { kind: "text", name: "name", label: "Full name", placeholder: "Sam Okafor", required: true, half: true },
  { kind: "text", name: "firm", label: "Firm / company", placeholder: "Okafor Partners", required: true, half: true },
  { kind: "email", name: "email", label: "Email", placeholder: "sam@example.com", required: true, half: true },
  { kind: "tel", name: "phone", label: "Phone", placeholder: "(602) 555-0107", half: true },
  {
    kind: "select",
    name: "sector",
    label: "Sector",
    options: [
      "Capital Markets",
      "Real Estate",
      "Education",
      "Healthcare",
      "Media & Consumer",
      "Other / cross-sector",
    ],
    required: true,
    half: true,
  },
  {
    kind: "select",
    name: "dealType",
    label: "Deal type",
    options: [
      "Direct investment",
      "Acquisition",
      "Real estate asset",
      "Co-invest",
      "Operating partnership",
      "Other",
    ],
    required: true,
    half: true,
  },
  { kind: "text", name: "size", label: "Size / raise", placeholder: "e.g. $2–5M" },
  {
    kind: "textarea",
    name: "summary",
    label: "The pitch",
    placeholder:
      "Three things: what it is, why the economics work, and why us. Numbers over adjectives.",
    required: true,
    rows: 6,
  },
  {
    kind: "file",
    name: "deck",
    label: "Deck / one-pager",
    accept: [".pdf", ".ppt", ".pptx"],
    maxMB: 4,
    hint: "Optional — a link below works too",
  },
  { kind: "url", name: "dataroom", label: "Deck / data room link", placeholder: "https://…" },
];

export default function SubmitPage() {
  return (
    <PortalPage
      eyebrow="Portal · Deal flow"
      title={
        <>
          Bring us the <em className="italic font-medium text-purple-2">deal</em>.
        </>
      }
      emphasis="direct positions & operational weight"
      body="We write checks and roll up sleeves — direct investments, acquisitions, and operating partnerships across our five volumes. If the economics are real, we move fast. Make the case."
      watermark="Lopes · Portal · Deal Flow"
      endpoint="/api/submit"
      fields={FIELDS}
      submitLabel="Submit the deal"
      receivedNote="The deal is on the ledger. Every submission is read by a principal — if it clears the bar, we'll be in touch to go deeper."
      aside={[
        { label: "What fits", value: "Cash-flowing or near-it. Operator-led. The five volumes first; exceptional anything second." },
        { label: "Check size", value: "Flexible by structure — minority positions to full acquisitions." },
        { label: "Speed", value: "First read within days, not quarters. A fast no is our default courtesy." },
        { label: "Discretion", value: "Materials stay inside the office. NDAs honored on request." },
      ]}
    />
  );
}

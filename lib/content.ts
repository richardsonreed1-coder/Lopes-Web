export type LedgerColor = "purple" | "gold" | "burgundy" | "teal" | "olive" | "paper";

export type Ledger = {
  vol: string;
  slug: string;
  href: string;
  title: string;
  emphasis: string;
  meta: string;
  body: string;
  positions: string[];
  color: LedgerColor;
};

export const CATEGORY_SLUGS = [
  "capital-markets",
  "real-estate",
  "education",
  "healthcare",
  "media-consumer",
] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export function isCategorySlug(s: string): s is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(s);
}

export const ledgers: Ledger[] = [
  {
    vol: "VOL.01",
    slug: "capital-markets",
    href: "/capital-markets",
    title: "Capital Markets",
    emphasis: "signals, not noise",
    meta: "DISCRETIONARY",
    body:
      "A discretionary platform pairing private-markets activity with a public-markets and event-driven strategy. A proprietary research stack runs every signal we trade — built by the same people who run it.",
    positions: ["Private", "Public", "Event-driven", "Signals"],
    color: "purple",
  },
  {
    vol: "VOL.02",
    slug: "real-estate",
    href: "/real-estate",
    title: "Real Estate",
    emphasis: "hard assets, harder underwriting",
    meta: "STORAGE · DATACENTER · LAND",
    body:
      "A self-storage portfolio anchors the hard-assets sleeve, with datacenter exposure via the Martone partnership and selective land plays in growth corridors. We pencil deals like operators because we are.",
    positions: ["Storage", "Datacenter", "Landco", "Martone"],
    color: "gold",
  },
  {
    vol: "VOL.03",
    slug: "education",
    href: "/education",
    title: "Education",
    emphasis: "where it started",
    meta: "K–12 · BRAND · ADVISORY",
    body:
      "A multi-property platform spanning movement-level brand work, K–12 platform technology, consumer-facing family advisory, and selective client engagements with adjacent operators. The lane we know cold.",
    positions: ["GCU lineage", "K–12", "Brand", "Family advisory"],
    color: "burgundy",
  },
  {
    vol: "VOL.04",
    slug: "healthcare",
    href: "/healthcare",
    title: "Healthcare",
    emphasis: "neuro hub, DTC spokes",
    meta: "NEURODEVELOPMENTAL",
    body:
      "A specialist-led brand ecosystem in the neurodevelopmental space — a hub with multiple consumer and clinical sub-properties and a direct-to-consumer acquisition funnel feeding it.",
    positions: ["Neuro hub", "Clinical", "DTC funnel"],
    color: "teal",
  },
  {
    vol: "VOL.05",
    slug: "media-consumer",
    href: "/media-consumer",
    title: "Media & Consumer",
    emphasis: "creators, owned infrastructure",
    meta: "DTC PORTFOLIO",
    body:
      "A small portfolio of creator-led DTC properties operated under the holding company, with shared e-commerce and content infrastructure built once, reused everywhere.",
    positions: ["Creator", "E-commerce", "Content"],
    color: "olive",
  },
  {
    vol: "VOL.06",
    slug: "letters",
    href: "/#letters",
    title: "Letters",
    emphasis: "annual notes, on the record",
    meta: "2018 — 2025",
    body:
      "Every year, one letter, signed. Theses, mistakes, and what we did about both. The archive lives below.",
    positions: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
    color: "paper",
  },
];

export function ledgerBySlug(slug: string): Ledger | undefined {
  return ledgers.find((l) => l.slug === slug);
}

const CATEGORY_TITLE_TO_SLUG: Record<string, CategorySlug> = {
  "Capital Markets": "capital-markets",
  "Real Estate": "real-estate",
  Education: "education",
  Healthcare: "healthcare",
  "Media & Consumer": "media-consumer",
};

export function operatorsForCategory(slug: CategorySlug): Operator[] {
  return operators.filter((op) => CATEGORY_TITLE_TO_SLUG[op.category] === slug);
}

export type Letter = {
  year: string;
  title: string;
  emphasis?: string;
  length: string;
};

export const letters: Letter[] = [
  {
    year: "2025",
    title: "Storage at scale:",
    emphasis: "what the consolidators got right, and where they're still vulnerable",
    length: "14 MIN",
  },
  {
    year: "2024",
    title: "Operator economics:",
    emphasis: "why we're underwriting management teams, not assets",
    length: "11 MIN",
  },
  {
    year: "2023",
    title: "The neuro thesis:",
    emphasis: "a DTC funnel, a clinical spine, and the patience to wait",
    length: "19 MIN",
  },
  {
    year: "2022",
    title: "A datacenter is a real-estate trade with a power-grid covenant",
    length: "9 MIN",
  },
  {
    year: "2021",
    title: "Three things we got wrong in 2020 —",
    emphasis: "and the call that paid for all of them",
    length: "12 MIN",
  },
  {
    year: "2020",
    title: "Recession-resistant cash flow:",
    emphasis: "self-storage as a defensive growth asset",
    length: "16 MIN",
  },
  {
    year: "2019",
    title: "Year one:",
    emphasis: "what a family office actually does when nobody's watching",
    length: "8 MIN",
  },
  {
    year: "2018",
    title: "After the exit",
    length: "6 MIN",
  },
];

export const epochs = [
  { year: "2003", label: "Grand Canyon University acquired" },
  { year: "2018", label: "Exit as #1 private Christian university" },
  { year: "2017", label: "Lopes Capital founded" },
  { year: "5", label: "Operating categories today" },
];

export type Operator = {
  num: string;
  name: string;
  category: string;
  era: string;
};

export const operators: Operator[] = [
  { num: "#001", name: "Grand Canyon University", category: "Education", era: "2003 — 2018" },
  { num: "#017", name: "Storage Portfolio", category: "Real Estate", era: "2019 —" },
  { num: "#021", name: "Martone Datacenter", category: "Real Estate", era: "2021 —" },
  { num: "#023", name: "Neuro Brand Hub", category: "Healthcare", era: "2022 —" },
  { num: "#028", name: "K–12 Platform", category: "Education", era: "2023 —" },
  { num: "#031", name: "Family Advisory", category: "Education", era: "2024 —" },
  { num: "#034", name: "Creator DTC Holdco", category: "Media & Consumer", era: "2024 —" },
  { num: "#037", name: "Signals Engine", category: "Capital Markets", era: "2025 —" },
];

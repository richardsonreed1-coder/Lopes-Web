export type LedgerColor = "purple" | "gold" | "burgundy" | "teal" | "olive" | "paper";

export type TimelineEntry = { year: string; note: string };

export type Position = { label: string; description?: string };

export type Stat = { label: string; value: string };

/** WebGL fog palette for the per-sector backdrop. Mirrors components/mist-background FogPalette. */
export type SectorFog = {
  base: [number, number, number];
  mist: [number, number, number];
  accent: [number, number, number];
  glow: [number, number, number];
  speed?: number;
  turbulence?: number;
  brightness?: number;
};

export type Ledger = {
  vol: string;
  slug: string;
  href: string;
  title: string;
  emphasis: string;
  meta: string;
  body: string;
  thesis?: string;
  strategy?: string;
  investments?: string;
  positions: Position[];
  color: LedgerColor;
  /** CSS color for the italic accent word in the headline + small-cap eyebrows */
  accent?: string;
  /** WebGL fog palette for this sector's page */
  fog?: SectorFog;
  /** Quick stats grid below the hero */
  stats?: Stat[];
  timeline?: TimelineEntry[];
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
    emphasis: "pricing the distortion",
    meta: "QUANT · FUNDAMENTAL · ALT-DATA",
    body:
      "Alpha now lives at the edges where passive flows and algorithms have not yet commoditized intelligence. We trade the distortion with proprietary data and signal extraction.",
    thesis:
      "The proliferation of passive capital and algorithmic trading has fundamentally distorted asset pricing. True alpha now exists only at the edges of the market, where proprietary data networks and asymmetric intelligence have not yet been commoditized.",
    strategy:
      "We deploy capital through quantitative and fundamental strategies designed specifically to exploit these structural dislocations. We prioritize building unconventional data pipelines and signal extraction frameworks to capture pricing inefficiencies before they reach the broader market.",
    investments:
      "Algorithmic trading desks, alternative data architecture, and specialized liquidity providers.",
    positions: [
      {
        label: "Algo desks",
        description:
          "Discretionary mandate + event-driven desk. Pencil-down on every position; nothing handed off.",
      },
      {
        label: "Alt-data",
        description:
          "Proprietary pipelines — credit-card panels, satellite, hiring, footfall — feeding the signal extraction layer.",
      },
      {
        label: "Liquidity",
        description:
          "Specialized liquidity providers in markets where size moves price. Patient sizing, not blasting.",
      },
      {
        label: "Signal extraction",
        description:
          "The signals engine, live 2025. Where the alt-data, the macro read, and the desk meet.",
      },
    ],
    color: "purple",
    accent: "#A988F5",
    fog: {
      base: [0.055, 0.058, 0.071],
      mist: [0.165, 0.14, 0.255],
      accent: [0.31, 0.23, 0.485],
      glow: [0.62, 0.5, 0.95],
      speed: 1.0,
      turbulence: 1.0,
      brightness: 1.35,
    },
    stats: [
      { label: "Sleeves", value: "04" },
      { label: "Year live", value: "2017" },
      { label: "Public sleeve", value: "2019" },
      { label: "Signals engine", value: "2025" },
    ],
    timeline: [
      { year: "2017", note: "Discretionary mandate opened" },
      { year: "2019", note: "Public sleeve activated" },
      { year: "2022", note: "Event-driven desk staffed" },
      { year: "2025", note: "Signals engine live" },
    ],
  },
  {
    vol: "VOL.02",
    slug: "real-estate",
    href: "/real-estate",
    title: "Real Estate",
    emphasis: "infrastructure for the overflow",
    meta: "ADAPTIVE-REUSE · STORAGE",
    body:
      "We buy functionally obsolete commercial buildings well below replacement cost and convert them into climate-controlled self-storage — held indefinitely, refinanced into permanent debt.",
    thesis:
      "As housing affordability worsens and residential square footage shrinks, the consumer addiction to accumulation remains absolute. This creates a permanent, structural overflow. Exceptional real estate returns no longer reside in generic multifamily yields, but in the resilient, high-margin infrastructure required to warehouse what people cannot afford to house but refuse to part with.",
    strategy:
      "We acquire functionally obsolete retail and commercial buildings well below replacement cost, converting them into climate-controlled self-storage operated by CubeSmart. Our edge is structural: an unrecreatable cost basis, faster stabilization than ground-up development, and regulatory moats in zoning-restricted submarkets. We hold indefinitely, refinancing into permanent debt to compound the playbook across the Sunbelt.",
    investments:
      "Adaptive-reuse self-storage, obsolete commercial conversions, and inflation-resilient, low-operational-drag hard assets.",
    positions: [
      {
        label: "Adaptive-reuse",
        description:
          "Functionally obsolete commercial buildings, acquired below replacement cost, converted to climate-controlled storage.",
      },
      {
        label: "Self-storage",
        description:
          "CubeSmart-operated, climate-controlled. Faster stabilization than ground-up; regulatory moats in zoning-restricted submarkets.",
      },
      {
        label: "Conversions",
        description:
          "Retail and commercial structures retrofitted. The cost basis isn't recreatable.",
      },
      {
        label: "Sunbelt",
        description:
          "Permanent debt, indefinite hold, compounding playbook across high-migration corridors.",
      },
    ],
    color: "gold",
    accent: "#E5A52B",
    fog: {
      base: [0.07, 0.04, 0.035],
      mist: [0.22, 0.12, 0.08],
      accent: [0.55, 0.32, 0.12],
      glow: [0.95, 0.7, 0.35],
      speed: 0.85,
      turbulence: 1.1,
      brightness: 1.3,
    },
    stats: [
      { label: "Sleeves", value: "04" },
      { label: "First deal", value: "2019" },
      { label: "Sunbelt expansion", value: "2023" },
      { label: "Portfolio status", value: "Live" },
    ],
    timeline: [
      { year: "2019", note: "First storage acquisition" },
      { year: "2021", note: "Martone datacenter partnership" },
      { year: "2023", note: "Land portfolio assembled" },
      { year: "2025", note: "Operator-led roll-up underway" },
    ],
  },
  {
    vol: "VOL.03",
    slug: "education",
    href: "/education",
    title: "Education",
    emphasis: "the new architecture of learning",
    meta: "K-20 · DECENTRALIZED",
    body:
      "The next chapter of learning is decentralized — microschools, private K-20, homeschool, personalized at scale. We build the platform infrastructure that ties it together.",
    thesis:
      "Timing dictates generational success in education. Our lineage at GCU pioneered the initial migration to online learning, capturing the first major digital shift. The next chapter is a massive decentralization toward select brick-and-mortar private schools, microschool networks, and homeschooling — unified by personalized learning at scale that adapts continuously as the student matures.",
    strategy:
      "We are building and investing in the definitive K-20 infrastructure required to support this new, decentralized ecosystem. By deploying the platform technology, family advisory frameworks, and operational backbone, we are actively structuring the foundation that will drive outcomes for the next generation of Americans.",
    investments:
      "K-20 adaptive learning infrastructure, localized microschool networks, specialized private operators, and family advisory platforms.",
    positions: [
      {
        label: "K-20 platform",
        description:
          "Adaptive learning infrastructure for the decentralized future. Personalized at scale, mature with the student.",
      },
      {
        label: "Microschools",
        description:
          "Localized networks of small private schools. Brick-and-mortar with platform-level operations underneath.",
      },
      {
        label: "Private operators",
        description:
          "Specialized providers in select brick-and-mortar formats. Selective stake or full operating role.",
      },
      {
        label: "Family advisory",
        description:
          "Direct consumer-facing layer. Tools, frameworks, and concierge for families navigating the new ecosystem.",
      },
    ],
    color: "burgundy",
    accent: "#E64A58",
    fog: {
      base: [0.08, 0.04, 0.05],
      mist: [0.22, 0.1, 0.13],
      accent: [0.55, 0.2, 0.27],
      glow: [0.95, 0.45, 0.55],
      speed: 0.9,
      turbulence: 1.0,
      brightness: 1.32,
    },
    stats: [
      { label: "Sleeves", value: "04" },
      { label: "Founded (GCU)", value: "2003" },
      { label: "GCU exit", value: "2018" },
      { label: "K-20 live", value: "2023" },
    ],
    timeline: [
      { year: "2003", note: "Grand Canyon University acquired" },
      { year: "2018", note: "Exit as #1 private Christian university" },
      { year: "2023", note: "K–12 platform launched" },
      { year: "2024", note: "Family advisory practice opened" },
    ],
  },
  {
    vol: "VOL.04",
    slug: "healthcare",
    href: "/healthcare",
    title: "Healthcare",
    emphasis: "the parallel health economy",
    meta: "NEURO · FUNCTIONAL · DTC",
    body:
      "Specialist-led platforms in neurodevelopmental and functional health that own the protocol, the practitioner network, and the patient relationship — a parallel system to the pharma-insurance complex.",
    thesis:
      "The most durable specialty healthcare businesses of the next decade won't sit inside the pharma-insurance complex — they'll route around it. The advantage compounds for platforms that own the clinical protocol, the practitioner network, and the patient relationship simultaneously, in categories where conventional medicine has under-delivered for a generation.",
    strategy:
      "We back specialist-led platforms in neurodevelopmental and functional health where clinical authority, consumer acquisition, and operating infrastructure are designed to compound into a single moat. The hub holds the IP and the protocol; the spokes deliver care, train practitioners, and acquire the families who become the evidence base. Capital is patient and operationally engaged — these are systems built to last decades, not exits to engineer.",
    investments:
      "Specialist-anchored clinical platforms; direct-to-patient brands that feed into clinical infrastructure; practitioner certification and protocol-delivery software layers; selective positioning in adjacent verticals where the same architecture extends.",
    positions: [
      {
        label: "Clinical platforms",
        description:
          "Specialist-led platforms in neuro and functional health. Clinical authority compounds into a single moat.",
      },
      {
        label: "DTC funnel",
        description:
          "Direct-to-patient brands feeding the clinical infrastructure. Acquisition is the patient relationship.",
      },
      {
        label: "Protocol IP",
        description:
          "The intellectual property layer. Protocols and certification owned at the hub, not licensed.",
      },
      {
        label: "Practitioner network",
        description:
          "The spokes that deliver care, train other practitioners, and grow the evidence base.",
      },
    ],
    color: "teal",
    accent: "#5BB8C0",
    fog: {
      base: [0.04, 0.07, 0.08],
      mist: [0.1, 0.18, 0.2],
      accent: [0.18, 0.45, 0.5],
      glow: [0.45, 0.85, 0.9],
      speed: 0.95,
      turbulence: 0.95,
      brightness: 1.38,
    },
    stats: [
      { label: "Sleeves", value: "04" },
      { label: "Hub formed", value: "2022" },
      { label: "First clinical", value: "2023" },
      { label: "At scale", value: "2025" },
    ],
    timeline: [
      { year: "2022", note: "Neuro brand hub formed" },
      { year: "2023", note: "First clinical sub-property launched" },
      { year: "2024", note: "DTC acquisition funnel live" },
      { year: "2025", note: "Hub and spokes at scale" },
    ],
  },
  {
    vol: "VOL.05",
    slug: "media-consumer",
    href: "/media-consumer",
    title: "Media & Consumer",
    emphasis: "the infrastructure of influence",
    meta: "CREATOR · COMMERCE · OWNED",
    body:
      "We partner with high-leverage creators to convert rented influence into owned infrastructure — IP, direct distribution, and the physical backend behind it.",
    thesis:
      "Attention is the most valuable commodity of the decade, yet modern creators remain highly vulnerable to rented distribution channels and platform risk. Enduring equity value is only created when raw influence is systematically converted into owned infrastructure and proprietary product ecosystems.",
    strategy:
      "We partner with high-leverage creators and media figures to build vertically integrated businesses. We transition them from algorithmic dependence to sovereign operations — owning the IP, the direct distribution layer, and the physical backend fulfillment.",
    investments:
      "Creator-led commerce platforms, independent media syndicates, and dedicated fulfillment and supply chain infrastructure.",
    positions: [
      {
        label: "Creator commerce",
        description:
          "High-leverage creators with vertically integrated commerce. Owned IP, owned product, owned distribution.",
      },
      {
        label: "Media syndicates",
        description:
          "Independent media operations no longer dependent on rented platforms. Cross-property reach.",
      },
      {
        label: "Owned IP",
        description:
          "The product, the brand, the audience relationship — held under the holding company, not licensed out.",
      },
      {
        label: "Fulfillment",
        description:
          "Dedicated fulfillment and supply-chain infrastructure. The physical backend behind the creators.",
      },
    ],
    color: "olive",
    accent: "#B7C474",
    fog: {
      base: [0.05, 0.07, 0.04],
      mist: [0.12, 0.18, 0.1],
      accent: [0.3, 0.45, 0.18],
      glow: [0.65, 0.9, 0.4],
      speed: 1.05,
      turbulence: 1.15,
      brightness: 1.36,
    },
    stats: [
      { label: "Sleeves", value: "04" },
      { label: "Holdco formed", value: "2024" },
      { label: "Stack built", value: "2024" },
      { label: "Reusable", value: "2026" },
    ],
    timeline: [
      { year: "2024", note: "Creator DTC holdco formed" },
      { year: "2024", note: "Shared e-commerce stack built" },
      { year: "2025", note: "First three properties operating" },
      { year: "2026", note: "Content infrastructure reusable" },
    ],
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
    positions: [
      { label: "2018" }, { label: "2019" }, { label: "2020" }, { label: "2021" },
      { label: "2022" }, { label: "2023" }, { label: "2024" }, { label: "2025" },
    ],
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
  { year: "2017", label: "Lopes Capital founded" },
  { year: "2018", label: "Exit as #1 private Christian university" },
  { year: "2026", label: "Five operating categories" },
];

export type Operator = {
  num: string;
  name: string;
  category: string;
  era: string;
};

export type PillarSlug = "discover" | "develop" | "deliver" | "disrupt";

export type Pillar = {
  slug: PillarSlug;
  numeral: string;
  word: string;
  emphasis: string;
  body: string;
  principles: { label: string; title: string; body: string }[];
};

export const pillars: Pillar[] = [
  {
    slug: "discover",
    numeral: "I",
    word: "Discover",
    emphasis: "Where signal becomes thesis.",
    body:
      "We don't chase deals. We develop convictions in public — letters, theses, signals — and let the deals find us. Research isn't a department here; it's the posture we operate from.",
    principles: [
      {
        label: "01",
        title: "Research as posture",
        body:
          "Every letter, every position, every conversation is a read on the world we're trying to act in. We don't outsource the thinking that drives our capital.",
      },
      {
        label: "02",
        title: "Theses in public",
        body:
          "We publish what we believe, what we've changed our mind on, and why. The 2018–2025 letter archive is the audit trail — and the filter.",
      },
      {
        label: "03",
        title: "Inbound, not outbound",
        body:
          "The best deals find us. We've built the brand to be a magnet for operators who want to work with us — not a pitch deck looking for capital.",
      },
    ],
  },
  {
    slug: "develop",
    numeral: "II",
    word: "Develop",
    emphasis: "Where capital becomes operation.",
    body:
      "The wire clears, the work begins. Pencil-down underwriting, hands-on operator support, and the kind of capital that walks the floor before it asks for a board seat.",
    principles: [
      {
        label: "01",
        title: "Pencil-down underwriting",
        body:
          "The model is run by the people who have to live with the call. No hand-offs between investment and asset management.",
      },
      {
        label: "02",
        title: "Hands-on, when invited",
        body:
          "We bring more than a check. Operating playbooks, talent networks, and the kind of cap-table presence that helps, not hassles.",
      },
      {
        label: "03",
        title: "Patient, on a schedule",
        body:
          "Long-duration capital with explicit decision gates. Patience without drift — we know what we're waiting for and we know when to stop waiting.",
      },
    ],
  },
  {
    slug: "deliver",
    numeral: "III",
    word: "Deliver",
    emphasis: "Where work becomes outcome.",
    body:
      "The chart is the proof. Distributions, exits, realized returns — and the boring distribution waterfalls that get them there. We mark the book to results, not narrative.",
    principles: [
      {
        label: "01",
        title: "Mark to results",
        body:
          "DPI before TVPI. Returned capital is the only number that compounds, and the only number we lead with.",
      },
      {
        label: "02",
        title: "Waterfalls in plain English",
        body:
          "Distributions and reporting written for a human, not a footnote. If the structure can't be explained on a phone call, the structure is wrong.",
      },
      {
        label: "03",
        title: "The letter at the end",
        body:
          "Every realized position gets a write-up: what worked, what didn't, what we'd do differently. The archive grows. So does the discipline.",
      },
    ],
  },
  {
    slug: "disrupt",
    numeral: "IV",
    word: "Disrupt",
    emphasis: "Where comfortable becomes contested.",
    body:
      "When the consensus is wrong, the spread is in being early and loud. We size up where the room is small and lever down when the room gets crowded.",
    principles: [
      {
        label: "01",
        title: "Where the room is small",
        body:
          "We size up where the consensus is thin. Self-storage in 2017. Datacenter real estate in 2021. Neurodevelopmental care in 2022.",
      },
      {
        label: "02",
        title: "Where the room is crowded",
        body:
          "When the trade gets popular, we get smaller. Conviction is sized inversely to confidence.",
      },
      {
        label: "03",
        title: "What we're wrong about",
        body:
          "We say it out loud. The annual letter has a section for it, and most of the lessons we trade on came from there.",
      },
    ],
  },
];

export const PILLAR_SLUGS: PillarSlug[] = pillars.map((p) => p.slug);

export function pillarBySlug(slug: string): Pillar | undefined {
  return pillars.find((p) => p.slug === slug);
}

export const operators: Operator[] = [
  { num: "#001", name: "Grand Canyon University", category: "Education", era: "2003 — 2018" },
  { num: "#017", name: "Self-Storage Portfolio", category: "Real Estate", era: "2019 —" },
  { num: "#023", name: "Neuro Brand Hub", category: "Healthcare", era: "2022 —" },
  { num: "#028", name: "K-20 Platform", category: "Education", era: "2023 —" },
  { num: "#031", name: "Family Advisory", category: "Education", era: "2024 —" },
  { num: "#034", name: "Creator DTC Holdco", category: "Media & Consumer", era: "2024 —" },
  { num: "#037", name: "Signals Engine", category: "Capital Markets", era: "2025 —" },
];

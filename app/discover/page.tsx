import { PillarPage } from "@/components/pillar-page";
import { pillarBySlug } from "@/lib/content";

const pillar = pillarBySlug("discover")!;

export const metadata = {
  title: `${pillar.word} — Lopes Capital`,
  description: pillar.body,
};

export default function DiscoverPage() {
  return <PillarPage pillar={pillar} />;
}

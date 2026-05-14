import { PillarPage } from "@/components/pillar-page";
import { pillarBySlug } from "@/lib/content";

const pillar = pillarBySlug("develop")!;

export const metadata = {
  title: `${pillar.word} — Lopes Capital`,
  description: pillar.body,
};

export default function DevelopPage() {
  return <PillarPage pillar={pillar} />;
}

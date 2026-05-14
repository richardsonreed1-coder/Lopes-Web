import { PillarPage } from "@/components/pillar-page";
import { pillarBySlug } from "@/lib/content";

const pillar = pillarBySlug("deliver")!;

export const metadata = {
  title: `${pillar.word} — Lopes Capital`,
  description: pillar.body,
};

export default function DeliverPage() {
  return <PillarPage pillar={pillar} />;
}

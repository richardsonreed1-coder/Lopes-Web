import { PillarPage } from "@/components/pillar-page";
import { pillarBySlug } from "@/lib/content";

const pillar = pillarBySlug("disrupt")!;

export const metadata = {
  title: `${pillar.word} — Lopes Capital`,
  description: pillar.body,
};

export default function DisruptPage() {
  return <PillarPage pillar={pillar} />;
}

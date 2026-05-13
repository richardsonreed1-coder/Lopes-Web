import { TopNav } from "@/components/top-nav";
import { SideRail } from "@/components/side-rail";
import { SiteFooter } from "@/components/site-footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <SideRail />
      <div className="hidden md:block fixed bottom-6 left-6 z-40 font-mono text-[11px] text-paper-faint">
        SCOTTSDALE · AZ
      </div>
      {children}
      <SiteFooter />
    </>
  );
}

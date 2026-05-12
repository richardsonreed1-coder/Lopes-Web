import Image from "next/image";
import Link from "next/link";

export function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center backdrop-blur-md bg-gradient-to-b from-ink/90 to-transparent">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-7 h-7 flex items-center justify-center">
          <Image
            src="/brand/antelope-mark.png"
            alt="Lopes Capital"
            width={28}
            height={28}
            className="object-contain"
            priority
          />
        </div>
        <div className="leading-tight">
          <div className="font-display font-medium text-[15px] tracking-tight">
            Lopes Capital
          </div>
          <div className="font-sans italic text-[10px] text-paper-mute">
            Operating notes since 2017
          </div>
        </div>
      </Link>
      <div className="hidden md:flex gap-7 font-sans text-[13px] text-paper-dim">
        <Link href="/#categories" className="hover:text-paper transition-colors">
          Categories
        </Link>
        <Link href="/#thesis" className="hover:text-paper transition-colors">
          Thesis
        </Link>
        <Link href="/#operators" className="hover:text-paper transition-colors">
          Operators
        </Link>
        <Link href="/#letters" className="hover:text-paper transition-colors">
          Letters
        </Link>
        <a href="#contact" className="hover:text-paper transition-colors">
          Contact
        </a>
      </div>
    </nav>
  );
}

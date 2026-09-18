import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | CoachChain",
  description: "How CoachChain uses cookies on this website.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-16 font-montserrat text-[#171717]">
      <Link href="/" className="text-sm text-[#514BFF]">
        Back to home
      </Link>
      <h1 className="mt-6 text-[32px] font-semibold">Cookie Policy</h1>
      <p className="mt-4 text-[16px] leading-relaxed">
        This site uses essential cookies required to run the website. We do not
        use advertising cookies.
      </p>
    </main>
  );
}

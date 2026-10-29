import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | CoachChain",
  description: "Terms for using the CoachChain website and services.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-16 font-montserrat text-[#171717]">
      <Link href="/" className="text-sm text-[#514BFF]">
        Back to home
      </Link>
      <h1 className="mt-6 text-[32px] font-semibold">Terms & Conditions</h1>
      <p className="mt-4 text-[16px] leading-relaxed">
        By using this website you agree to use the site for lawful enquiries
        and collaboration. Programme details are confirmed in writing before any
        engagement begins.
      </p>
    </main>
  );
}

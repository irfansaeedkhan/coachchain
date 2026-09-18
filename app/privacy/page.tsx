import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CoachChain",
  description: "How CoachChain collects, uses, and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-16 font-montserrat text-[#171717]">
      <Link href="/" className="text-sm text-[#514BFF]">
        Back to home
      </Link>
      <h1 className="mt-6 text-[32px] font-semibold">Privacy Policy</h1>
      <p className="mt-4 text-[16px] leading-relaxed">
        CoachChain uses contact details you submit on this site only to respond
        to your enquiry. We do not sell personal information.
      </p>
    </main>
  );
}

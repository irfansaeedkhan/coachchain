"use client";

import dynamic from "next/dynamic";

const OurApproach = dynamic(() => import("@/components/landing/OurApproach"), {
  ssr: true,
});

const LazyOurApproach = () => <OurApproach />;

export default LazyOurApproach;

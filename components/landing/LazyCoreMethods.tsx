"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const CoreMethodsAndTools = dynamic(
  () => import("@/components/landing/CoreMethodsAndTools"),
  { ssr: false }
);

const LazyCoreMethods = () => {
  useEffect(() => {
    void import("@/components/landing/CoreMethodsAndTools");
  }, []);

  return <CoreMethodsAndTools />;
};

export default LazyCoreMethods;

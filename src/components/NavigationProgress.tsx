"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Start the bar on pathname change
  useEffect(() => {
    setLoading(true);
    setProgress(15);

    const t1 = setTimeout(() => setProgress(45), 80);
    const t2 = setTimeout(() => setProgress(75), 200);
    const t3 = setTimeout(() => setProgress(95), 500);
    const t4 = setTimeout(() => {
      setProgress(100);
      setLoading(false);
      setTimeout(() => setProgress(0), 250);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 shadow-[0_0_10px_rgba(22,163,74,0.6)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: "width, opacity",
        }}
      />
    </div>
  );
}
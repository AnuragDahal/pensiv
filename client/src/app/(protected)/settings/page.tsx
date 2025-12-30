"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileSettingsMenu } from "./_components/MobileSettingsMenu";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect on desktop (lg breakpoint and above)
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        router.replace("/settings/profile");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  return (
    <div className="lg:hidden">
      <MobileSettingsMenu />
    </div>
  );
}

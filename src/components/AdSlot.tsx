"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

// Google AdSense ad component
// Set NEXT_PUBLIC_ADSENSE_ID in .env.local once approved
export default function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!clientId) return;
    try {
      // @ts-expect-error adsbygoogle is injected by the script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blocked or not loaded
    }
  }, [clientId]);

  // Don't render anything if no AdSense ID configured
  if (!clientId) return null;

  return (
    <div className={`ad-container my-6 text-center ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

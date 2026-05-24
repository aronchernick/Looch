"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { ADS } from "@/lib/ads";

const AD_ROTATE_MS = 12_000;  // switch advertiser every 12 s
const IMG_ROTATE_MS = 4_000;  // cycle images within an ad every 4 s

export default function AdBanner() {
  const { settings, adDismissed, setAdDismissed } = useStore();
  const [adIdx, setAdIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const impressionFired = useRef<Set<string>>(new Set());

  // Slide in after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Rotate advertisers
  useEffect(() => {
    if (ADS.length <= 1) return;
    const t = setInterval(() => {
      setAdIdx((i) => (i + 1) % ADS.length);
      setImgIdx(0);
      setImgVisible(true);
    }, AD_ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const ad = ADS[adIdx];

  // Cycle images within the current ad with a crossfade
  useEffect(() => {
    if (!ad || ad.images.length <= 1) return;
    const t = setInterval(() => {
      setImgVisible(false);
      setTimeout(() => {
        setImgIdx((i) => (i + 1) % ad.images.length);
        setImgVisible(true);
      }, 350);
    }, IMG_ROTATE_MS);
    return () => clearInterval(t);
  }, [ad]);

  // Fire impression once per ad per session
  useEffect(() => {
    if (!ad || impressionFired.current.has(ad.id)) return;
    impressionFired.current.add(ad.id);
    fetch("/api/ad-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id, event: "impression" }),
    }).catch(() => {});
  }, [ad]);

  if (settings.premium || adDismissed || !ad) return null;

  const safeImgIdx = ad.images.length > 0 ? imgIdx % ad.images.length : 0;
  const img = ad.images[safeImgIdx];
  if (!img) return null;

  function handleClick() {
    fetch("/api/ad-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id, event: "click" }),
    }).catch(() => {});
    window.open(ad.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="fixed bottom-[58px] left-0 right-0 z-20 transition-transform duration-500"
      style={{ transform: visible ? "translateY(0)" : "translateY(110%)" }}
    >
      <div className="max-w-lg mx-auto relative overflow-hidden" style={{ height: "88px" }}>
        {/* Background image with fade transition */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transition: "opacity 350ms ease",
            opacity: imgVisible ? 1 : 0,
          }}
        />

        {/* Dark gradient overlay — heavier on the right for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* Tappable content area */}
        <button
          onClick={handleClick}
          className="absolute inset-0 w-full flex items-center justify-end px-4 gap-3"
          aria-label={`Open ${ad.advertiserName}`}
        >
          <div className="text-right min-w-0">
            <div className="text-white font-extrabold text-sm leading-tight drop-shadow">
              {ad.advertiserName}
            </div>
            <div
              className="text-[11px] leading-tight mt-0.5 drop-shadow"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              {ad.tagline}
            </div>
          </div>
          <div
            className="shrink-0 text-[11px] font-extrabold px-3 py-2 rounded-lg whitespace-nowrap shadow"
            style={{ backgroundColor: "white", color: "#1C1C1E" }}
          >
            {ad.ctaLabel}
          </div>
        </button>

        {/* Sponsored label */}
        <div className="absolute top-2 left-3 pointer-events-none">
          <span
            className="text-[9px] font-semibold uppercase tracking-wide"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Sponsored
          </span>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setAdDismissed(true)}
          aria-label="Dismiss ad"
          className="absolute top-1.5 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        >
          <X size={10} color="white" />
        </button>

        {/* Remove ads link */}
        <a
          href="/settings#premium"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 left-3 text-[9px] underline pointer-events-auto"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Remove ads
        </a>
      </div>
    </div>
  );
}

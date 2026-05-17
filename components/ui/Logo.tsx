// SVG logo: organic light-blue blob with hand-drawn bubble "Looch" in burgundy
export default function Logo({ size = 40 }: { size?: number }) {
  const scale = size / 52;
  const w = 208 * scale;
  const h = 72 * scale;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 208 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Looch"
    >
      {/* Organic blob background — larger, rounder, more prominent */}
      <path
        d="M10 18 C5 7 18 2 34 2 C58 2 94 0 126 3 C156 6 182 2 194 10 C204 18 206 32 201 46 C196 58 180 68 154 68 C126 68 88 70 56 68 C30 66 8 60 5 48 C2 36 15 28 10 18Z"
        fill="#B8D9E8"
      />
      {/* Inner highlight for depth */}
      <path
        d="M20 16 C16 9 26 6 40 6 C62 6 94 4 122 7 C148 10 170 6 180 13 C188 18 188 26 185 34"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.35"
        fill="none"
        strokeLinecap="round"
      />
      {/* L */}
      <text
        x="16"
        y="50"
        fontFamily="Nunito, sans-serif"
        fontSize="46"
        fontWeight="800"
        fill="#6B1A1A"
        letterSpacing="-1"
      >
        L
      </text>
      {/* clock-O: circle with clock hands */}
      <circle cx="68" cy="35" r="17" stroke="#6B1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* hour hand ~10 */}
      <line x1="68" y1="35" x2="62" y2="25" stroke="#6B1A1A" strokeWidth="3" strokeLinecap="round" />
      {/* minute hand ~2 */}
      <line x1="68" y1="35" x2="76" y2="26" stroke="#6B1A1A" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="68" cy="35" r="2.2" fill="#6B1A1A" />
      {/* plain o */}
      <circle cx="104" cy="35" r="16" stroke="#6B1A1A" strokeWidth="4" fill="none" />
      {/* crescent C */}
      <path
        d="M138 17 Q126 35 138 53 Q120 53 114 35 Q114 17 138 17Z"
        fill="#6B1A1A"
      />
      {/* h */}
      <text
        x="140"
        y="50"
        fontFamily="Nunito, sans-serif"
        fontSize="46"
        fontWeight="800"
        fill="#6B1A1A"
        letterSpacing="-1"
      >
        h
      </text>
    </svg>
  );
}

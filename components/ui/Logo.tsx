// SVG logo: organic light-blue blob with hand-drawn bubble "Looch" in burgundy
export default function Logo({ size = 40 }: { size?: number }) {
  const scale = size / 40;
  return (
    <svg
      width={160 * scale}
      height={54 * scale}
      viewBox="0 0 160 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Looch"
    >
      {/* Organic blob background */}
      <path
        d="M8 14 C4 6 14 2 26 2 C44 2 72 0 96 3 C118 6 140 2 148 8 C156 14 158 24 154 34 C150 44 138 52 118 52 C98 52 68 54 44 52 C24 50 6 46 4 36 C2 28 12 22 8 14Z"
        fill="#B8D9E8"
      />
      {/* L */}
      <text
        x="14"
        y="38"
        fontFamily="Nunito, sans-serif"
        fontSize="36"
        fontWeight="800"
        fill="#6B1A1A"
        letterSpacing="-1"
      >
        L
      </text>
      {/* clock-O: circle with clock hands */}
      <circle cx="52" cy="26" r="13" stroke="#6B1A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* hour hand ~10 */}
      <line x1="52" y1="26" x2="47" y2="19" stroke="#6B1A1A" strokeWidth="2.5" strokeLinecap="round" />
      {/* minute hand ~2 */}
      <line x1="52" y1="26" x2="58" y2="20" stroke="#6B1A1A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="52" cy="26" r="1.8" fill="#6B1A1A" />
      {/* plain o */}
      <circle cx="80" cy="26" r="12" stroke="#6B1A1A" strokeWidth="3.5" fill="none" />
      {/* crescent C */}
      <path
        d="M106 13 Q96 26 106 40 Q92 40 88 26 Q88 12 106 13Z"
        fill="#6B1A1A"
      />
      {/* h */}
      <text
        x="108"
        y="38"
        fontFamily="Nunito, sans-serif"
        fontSize="36"
        fontWeight="800"
        fill="#6B1A1A"
        letterSpacing="-1"
      >
        h
      </text>
    </svg>
  );
}

export default function MarqueeBanner() {
  const lines1 = [
    'ਤੁਸੀਂ ਮੰਗੋਗੇ ਜੋ, ਖੁਆਵਾਂਗੇ ਉਹ',
    'ਹਰ ਖ਼ੁਸ਼ੀ, ਹਰ ਮੌਕੇ ਲਈ ਸਜਾਵਟ ਤੇ ਖਾਣਾ',
    'ਤੁਸੀਂ ਬੱਸ ਤਾਰੀਖ਼ ਦੱਸੋ, ਬਾਕੀ ਸਾਡਾ ਕੰਮ',
    'ਲੁਧਿਆਣਾ ਦਾ ਸਭ ਤੋਂ ਭਰੋਸੇਮੰਦ ਨਾਮ',
  ];

  const lines2 = [
    'Royal Wedding Stages & Mandaps',
    'Authentic Punjabi Flavours & Live Counters',
    'Waterproof German Hangars & Fairy Lights',
    'Flawless Hospitality Since Decades',
  ];

  // Quadruple lines so each half fills widescreen displays completely
  const sequence1 = [...lines1, ...lines1, ...lines1, ...lines1];
  const sequence2 = [...lines2, ...lines2, ...lines2, ...lines2];

  return (
    <div
      className="overflow-hidden bg-sdc-teal border-y-2 border-sdc-coral/30 py-3 sm:py-4 select-none"
      aria-label="Scrolling tagline banner"
    >
      {/* ── Lane 1 (Floating in Horizontal Direction: Left) ───────── */}
      <div className="relative overflow-hidden mb-1.5 sm:mb-2">
        <div className="animate-marquee-left">
          {sequence1.map((line, i) => (
            <span
              key={`r1-a-${i}`}
              className="inline-flex items-center font-gurmukhi text-sdc-coral2 text-[0.78rem] sm:text-sm font-semibold tracking-wide mx-4 sm:mx-8 whitespace-nowrap"
            >
              <span className="text-sdc-coral mr-2 sm:mr-3 text-xs opacity-80">✦</span>
              {line}
            </span>
          ))}
          {sequence1.map((line, i) => (
            <span
              key={`r1-b-${i}`}
              className="inline-flex items-center font-gurmukhi text-sdc-coral2 text-[0.78rem] sm:text-sm font-semibold tracking-wide mx-4 sm:mx-8 whitespace-nowrap"
            >
              <span className="text-sdc-coral mr-2 sm:mr-3 text-xs opacity-80">✦</span>
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* ── Lane 2 (Floating in Horizontal Direction: Right) ──────── */}
      <div className="relative overflow-hidden">
        <div className="animate-marquee-right opacity-90">
          {sequence2.map((line, i) => (
            <span
              key={`r2-a-${i}`}
              className="inline-flex items-center font-cinzel text-white/90 text-[0.68rem] sm:text-xs tracking-[0.2em] uppercase mx-4 sm:mx-8 whitespace-nowrap"
            >
              <span className="text-sdc-coral mr-2 sm:mr-3 text-[10px]">◆</span>
              {line}
            </span>
          ))}
          {sequence2.map((line, i) => (
            <span
              key={`r2-b-${i}`}
              className="inline-flex items-center font-cinzel text-white/90 text-[0.68rem] sm:text-xs tracking-[0.2em] uppercase mx-4 sm:mx-8 whitespace-nowrap"
            >
              <span className="text-sdc-coral mr-2 sm:mr-3 text-[10px]">◆</span>
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

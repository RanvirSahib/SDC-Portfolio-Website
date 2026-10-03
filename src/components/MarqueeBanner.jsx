import { useEffect, useRef } from 'react';

export default function MarqueeBanner() {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const containerRef = useRef(null);
  const pos1Ref = useRef(0);
  const pos2Ref = useRef(0);
  const isHoveredRef = useRef(false);

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

  // Quadruple lines for continuous loop
  const sequence1 = [...lines1, ...lines1, ...lines1, ...lines1];
  const sequence2 = [...lines2, ...lines2, ...lines2, ...lines2];

  /* ── Continuous Horizontal Motion (Guaranteed 60fps Loop) ── */
  useEffect(() => {
    let animId;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;

    // Initialize row2 starting position so it flows smoothly rightward
    if (row2) {
      const halfWidth2 = row2.scrollWidth / 2;
      if (halfWidth2 > 0) {
        pos2Ref.current = -halfWidth2;
        row2.style.transform = `translate3d(${pos2Ref.current}px, 0, 0)`;
      }
    }

    const step = () => {
      if (!isHoveredRef.current) {
        // Lane 1 moves to the left (slower, elegant glide)
        pos1Ref.current -= 0.45;
        if (row1) {
          const halfWidth1 = row1.scrollWidth / 2;
          if (halfWidth1 > 0 && Math.abs(pos1Ref.current) >= halfWidth1) {
            pos1Ref.current += halfWidth1;
          }
          row1.style.transform = `translate3d(${pos1Ref.current}px, 0, 0)`;
        }

        // Lane 2 moves to the right (slower, elegant glide)
        pos2Ref.current += 0.42;
        if (row2) {
          const halfWidth2 = row2.scrollWidth / 2;
          if (halfWidth2 > 0 && pos2Ref.current >= 0) {
            pos2Ref.current -= halfWidth2;
          }
          row2.style.transform = `translate3d(${pos2Ref.current}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
      className="overflow-hidden bg-sdc-teal border-y-2 border-sdc-coral/30 py-3 sm:py-4 select-none"
      aria-label="Scrolling tagline banner"
    >
      {/* ── Lane 1 (Floating in Horizontal Direction: Left) ───────── */}
      <div className="relative overflow-hidden mb-1.5 sm:mb-2">
        <div
          ref={row1Ref}
          className="flex whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
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
        <div
          ref={row2Ref}
          className="flex whitespace-nowrap will-change-transform opacity-90"
          style={{ width: 'max-content' }}
        >
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

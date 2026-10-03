import { useEffect, useRef } from 'react';

export default function MarqueeBanner() {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const bannerRef = useRef(null);

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

  // Quadruple for smooth continuous looping
  const stream1 = [...lines1, ...lines1, ...lines1, ...lines1];
  const stream2 = [...lines2, ...lines2, ...lines2, ...lines2];

  /* ── Horizontal Scroll Parallax ───────────────────────────── */
  useEffect(() => {
    let rafId;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (inView) {
        const scrollDelta = window.scrollY;
        // Top lane shifts to the left with scroll
        if (row1Ref.current) {
          const offset1 = -(scrollDelta * 0.35) % 800;
          row1Ref.current.style.transform = `translate3d(${offset1}px, 0, 0)`;
        }
        // Bottom lane shifts to the right with scroll
        if (row2Ref.current) {
          const offset2 = (scrollDelta * 0.35) % 800;
          row2Ref.current.style.transform = `translate3d(${offset2}px, 0, 0)`;
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      className="overflow-hidden bg-sdc-teal border-y-2 border-sdc-coral/30 py-3 sm:py-4 select-none"
      aria-label="Scrolling tagline banner"
    >
      {/* ── Lane 1 (Horizontal Parallax: Drifts Left) ───────── */}
      <div className="relative overflow-hidden mb-1.5 sm:mb-2">
        <div
          ref={row1Ref}
          className="flex whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {stream1.map((line, i) => (
            <span
              key={`r1-${i}`}
              className="inline-flex items-center font-gurmukhi text-sdc-coral2 text-[0.78rem] sm:text-sm font-semibold tracking-wide mx-4 sm:mx-8"
            >
              <span className="text-sdc-coral mr-2 sm:mr-3 text-xs opacity-80">✦</span>
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* ── Lane 2 (Horizontal Parallax: Drifts Right) ──────── */}
      <div className="relative overflow-hidden">
        <div
          ref={row2Ref}
          className="flex whitespace-nowrap will-change-transform opacity-85"
          style={{ width: 'max-content' }}
        >
          {stream2.map((line, i) => (
            <span
              key={`r2-${i}`}
              className="inline-flex items-center font-cinzel text-white/90 text-[0.68rem] sm:text-xs tracking-[0.2em] uppercase mx-4 sm:mx-8"
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

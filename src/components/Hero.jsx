import { useEffect, useRef, useState, useCallback } from 'react';
import logoSrc from '../assets/images/SDC.png';
import Text3DFlip from './ui/text-3d-flip';

/* ── Vertical swiper slides ───────────────────────────────────────── */
const SLIDES = [
  { emoji: '💍', label: 'Weddings & Receptions' },
  { emoji: '🌸', label: 'Mehndi, Haldi & Sangeet' },
  { emoji: '🎂', label: 'Birthdays & Baby Showers' },
  { emoji: '🪔', label: 'Religious & Festive Events' },
  { emoji: '⛺', label: 'Tentage & Grand Hangars' },
  { emoji: '🍽️', label: 'Food of Your Choice' },
];

/* ── Vertical Swiper ──────────────────────────────────────────────── */
function OccasionSwiper() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const [phase, setPhase] = useState('idle'); // 'idle' | 'leave' | 'enter'
  const timerRef = useRef(null);
  const touchStartY = useRef(null);
  const isHovered = useRef(false);

  const advance = useCallback((nextIdx, dir = 'next') => {
    setDirection(dir);
    setPhase('leave');
    setTimeout(() => {
      setIdx(nextIdx);
      setPhase('enter');
      setTimeout(() => setPhase('idle'), 450);
    }, 280);
  }, []);

  const nextSlide = useCallback(() => {
    setIdx((curr) => {
      const next = (curr + 1) % SLIDES.length;
      advance(next, 'next');
      return curr;
    });
  }, [advance]);

  const prevSlide = useCallback(() => {
    setIdx((curr) => {
      const prev = (curr - 1 + SLIDES.length) % SLIDES.length;
      advance(prev, 'prev');
      return curr;
    });
  }, [advance]);

  /* Auto-play timer */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isHovered.current) {
        nextSlide();
      }
    }, 3600);
    return () => clearInterval(timerRef.current);
  }, [nextSlide]);

  const goTo = (i) => {
    if (i === idx) return;
    clearInterval(timerRef.current);
    advance(i, i > idx ? 'next' : 'prev');
  };

  /* Touch support for mobile */
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 35) {
      clearInterval(timerRef.current);
      if (diff > 0) {
        // Swiped UP -> show next
        nextSlide();
      } else {
        // Swiped DOWN -> show prev
        prevSlide();
      }
    }
    touchStartY.current = null;
  };

  const phaseClass =
    phase === 'leave'
      ? direction === 'next' ? 'swiper-leave' : 'swiper-leave-reverse'
      : phase === 'enter'
      ? direction === 'next' ? 'swiper-enter' : 'swiper-enter-reverse'
      : '';

  return (
    <div
      className="w-full select-none cursor-pointer"
      aria-label={`Current occasion: ${SLIDES[idx].label}`}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={nextSlide}
    >
      {/* Slide container — clips overflow */}
      <div
        className="relative overflow-hidden"
        style={{ height: '2.8rem' }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={`swiper-slide ${phaseClass} flex items-center justify-center gap-2`}>
          <span className="text-[1.4rem]" aria-hidden="true">{SLIDES[idx].emoji}</span>
          <span
            className="font-cinzel font-semibold text-sdc-teal tracking-wide uppercase"
            style={{ fontSize: 'clamp(0.95rem, 3.2vw, 1.3rem)' }}
          >
            {SLIDES[idx].label}
          </span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-3" role="tablist">
        {SLIDES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Show ${s.label}`}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300
              ${i === idx
                ? 'w-5 h-2 bg-sdc-coral'
                : 'w-2 h-2 bg-sdc-coral/30 hover:bg-sdc-coral/60'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Hero Section ─────────────────────────────────────────────────── */
export default function Hero({ ready }) {
  const heroRef    = useRef(null);
  const blob1Ref   = useRef(null);
  const blob2Ref   = useRef(null);
  const parallaxRef = useRef(null);

  /* Mouse parallax — blobs + subtle content shift (desktop only) */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia('(hover: none)').matches) return;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = hero.getBoundingClientRect();
      const nx = (clientX - left) / width  - 0.5; // -0.5 to 0.5
      const ny = (clientY - top)  / height - 0.5;

      // Blobs move in opposite directions for depth
      if (blob1Ref.current)
        blob1Ref.current.style.transform = `translate(${nx * 40}px, ${ny * 30}px)`;
      if (blob2Ref.current)
        blob2Ref.current.style.transform = `translate(${-nx * 35}px, ${-ny * 25}px)`;

      // Content parallax — subtle horizontal shift
      if (parallaxRef.current)
        parallaxRef.current.style.transform = `translate(${nx * 8}px, ${ny * 4}px)`;
    };

    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => hero.removeEventListener('mousemove', onMouseMove);
  }, []);

  /* Stagger entrance for hero children */
  const stagger = (i) => ({
    opacity:         ready ? 1 : 0,
    transform:       ready ? 'translateY(0)' : 'translateY(36px)',
    transition:      `opacity 0.9s cubic-bezier(0.2,0.7,0.2,1) ${0.2 + i * 0.1}s,
                      transform 0.9s cubic-bezier(0.2,0.7,0.2,1) ${0.2 + i * 0.1}s`,
  });

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex flex-col items-center text-center overflow-hidden px-4 sm:px-6"
      style={{
        minHeight: '100svh',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 82px)',
        paddingBottom: '56px',
        background: 'radial-gradient(circle at 50% 40%, #ffffff, #f6ead2 80%)',
      }}
      aria-label="Hero section"
    >
      {/* ── Parallax blobs ─────────────────────────── */}
      <div
        ref={blob1Ref}
        className="hero-blob absolute w-[45vmin] h-[45vmin] rounded-full
          left-[-5%] top-[8%] opacity-25 pointer-events-none hidden sm:block"
        style={{
          background: '#fb6b6e',
          filter: 'blur(70px)',
          transition: 'transform 0.6s cubic-bezier(0.2,0.7,0.2,1)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      <div
        ref={blob2Ref}
        className="hero-blob absolute w-[38vmin] h-[38vmin] rounded-full
          right-[-4%] bottom-[8%] opacity-25 pointer-events-none hidden sm:block"
        style={{
          background: '#8fc5bd',
          filter: 'blur(65px)',
          transition: 'transform 0.6s cubic-bezier(0.2,0.7,0.2,1)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* ── Main content (parallax wrapper) ────────── */}
      <div
        ref={parallaxRef}
        className="relative z-10 w-full max-w-3xl mx-auto my-auto"
        style={{ transition: 'transform 0.35s cubic-bezier(0.2,0.7,0.2,1)', willChange: 'transform' }}
      >
        {/* Logo */}
        <div style={stagger(0)} className="mt-1 sm:mt-2.5 mb-5 sm:mb-6">
          <img
            src={logoSrc}
            alt="Sahib Decorators & Caterers"
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-[22px] sm:rounded-[28px]
              object-contain bg-sdc-teal shadow-2xl shadow-sdc-teal/30 mx-auto animate-float
              hover:rotate-[-10deg] hover:scale-110 transition-transform duration-500 ease-bounce-out"
          />
        </div>

        {/* Badge with 3D Flip */}
        <div style={stagger(1)} className="mb-3 sm:mb-4">
          <span
            className="group inline-flex items-center gap-2 border border-sdc-coral/45 text-sdc-teal
            px-4 sm:px-5 py-1.5 rounded-full
            text-[0.72rem] sm:text-[0.82rem] tracking-[0.16em]
            uppercase font-times font-bold bg-white/80 shadow-sm hover:border-sdc-coral hover:shadow-md transition-all"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <span className="text-sdc-coral text-xs">✦</span>
            <Text3DFlip
              text="Decades of Trust in Punjab"
              className="text-sdc-teal font-times font-bold"
              staggerDelay={22}
              autoFlipInterval={6000}
            />
            <span className="text-sdc-coral text-xs">✦</span>
          </span>
        </div>

        {/* Title */}
        <div style={stagger(2)} className="mb-3 sm:mb-4">
          <h1
            className="font-cinzel font-black text-shimmer leading-[1.1] sm:leading-[1.15]"
            style={{ fontSize: 'clamp(1.45rem, 6.2vw, 4rem)' }}
          >
            SAHIB DECORATORS &amp; CATERERS
          </h1>
          <p className="mt-2 text-[0.72rem] sm:text-[0.8rem] tracking-[0.2em] sm:tracking-[0.24em] uppercase font-montserrat font-bold text-sdc-teal/85">
            Sahib Tent House Ludhiana &bull; Luxury Wedding Decor &bull; Royal Catering
          </p>
        </div>

        {/* Punjabi tagline */}
        <div style={stagger(3)} className="mb-5 sm:mb-6 px-2">
          <p
            className="font-gurmukhi text-sdc-ink font-medium leading-snug"
            style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.4rem)' }}
          >
            ਰੌਣਕ ਤੁਹਾਡੀ, ਜ਼ਿੰਮੇਵਾਰੀ ਸਾਡੀ – ਹਰ ਖ਼ੁਸ਼ੀ ਲਈ ਸਜਾਵਟ ਤੇ ਬੇਮਿਸਾਲ ਸਵਾਦ!
          </p>
        </div>

        {/* ── Vertical occasion swiper ─────────────── */}
        <div style={stagger(4)} className="mb-6 sm:mb-8">
          <OccasionSwiper />
        </div>

        {/* CTA Buttons */}
        <div
          style={stagger(5)}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
        >
          <a
            href="#plan"
            id="hero-plan-btn"
            className="btn-shine w-full sm:w-auto px-7 sm:px-8 py-4 sm:py-3.5 rounded-full
              font-montserrat font-bold text-sdc-teal text-[0.85rem] sm:text-[0.92rem] tracking-wider uppercase
              hover:-translate-y-1 hover:shadow-xl active:scale-95
              transition-all duration-300 text-center leading-none"
            style={{
              background: 'linear-gradient(135deg, #fb6b6e, #e0575c)',
              boxShadow: '0 8px 25px rgba(224,87,92,0.35)',
            }}
          >
            Plan Your Celebration
          </a>
          <a
            href="https://wa.me/919888129647"
            id="hero-whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 sm:px-8 py-4 sm:py-3.5 rounded-full
              font-montserrat font-bold text-sdc-coral text-[0.85rem] sm:text-[0.92rem] tracking-wider uppercase
              border border-sdc-coral bg-transparent
              hover:bg-sdc-coral hover:text-sdc-teal hover:-translate-y-1
              active:scale-95 transition-all duration-300 text-center leading-none"
          >
            WhatsApp Us
          </a>
        </div>

        {/* Decorative line */}
        <div style={stagger(6)} className="mt-8 sm:mt-10">
          <div
            className="w-20 h-[2px] mx-auto rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #e0575c, transparent)' }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

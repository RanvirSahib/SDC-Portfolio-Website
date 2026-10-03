import { useEffect, useRef } from 'react';
import Text3DFlip from './ui/text-3d-flip';

const SERVICES = [
  {
    emoji: '💍',
    title: 'Weddings & Receptions',
    desc: 'Stage, mandap, Anand Karaj setups, floral entries, LED walls and full wedding catering.',
  },
  {
    emoji: '🌸',
    title: 'Mehndi, Haldi & Sangeet',
    desc: 'Colourful drapes, phulkari motifs, jhoola decor, dhol stage and lighting.',
  },
  {
    emoji: '🎂',
    title: 'Birthdays & Baby Showers',
    desc: 'Themed balloon and floral decor, cake tables and food for every age.',
  },
  {
    emoji: '🪔',
    title: 'Religious & Festive Events',
    desc: 'Traditional setups, grand pandals and pure, wholesome food for religious functions and festivals.',
  },
  {
    emoji: '⛺',
    title: 'Tentage & German Hangars',
    desc: 'All-weather pandals, carpeted walkways and fairy light entrances.',
  },
  {
    emoji: '🍽️',
    title: 'Food of Your Choice',
    desc: 'Veg or Non-Veg, Punjabi to Pan-Asian, live counters and mithai, made your way.',
  },
  {
    emoji: '✨',
    title: 'And Much More',
    desc: 'Anything you imagine for your occasion, just tell us and we will make it happen.',
    highlight: true,
  },
];

function ServiceCard({ service, index, isLast }) {
  const cardRef = useRef(null);

  // 3D tilt — only on non-touch devices
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(hover: none)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -10;
    const rotY = ((x - cx) / cx) *  10;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`rv card-3d card-spotlight relative rounded-2xl p-5 sm:p-7 cursor-default
        transition-all duration-300 group
        ${isLast
          ? 'sm:col-span-2 xl:col-span-1 border-2 border-sdc-coral bg-gradient-to-br from-sdc-coral/5 to-sdc-coral/10 hover:shadow-xl hover:shadow-sdc-coral/20'
          : 'border border-sdc-coral/25 bg-gradient-to-br from-white to-[#fbf1dd] hover:border-sdc-coral hover:shadow-xl hover:shadow-sdc-teal/10'
        }`}
      style={{
        transformStyle: 'preserve-3d',
        transitionDelay: `${(index % 4) * 0.09}s`,
      }}
    >
      {/* Emoji icon */}
      <span
        className="block text-[2rem] sm:text-[2.2rem] mb-2.5 w-fit
          transition-transform duration-[450ms] ease-bounce-out
          group-hover:scale-125 group-hover:rotate-[-8deg]"
        style={{ transform: 'translateZ(40px)' }}
        aria-hidden="true"
      >
        {service.emoji}
      </span>

      {/* Title */}
      <h3
        className={`font-playfair font-bold text-[1.05rem] sm:text-[1.18rem] mb-2 transition-colors duration-300 leading-snug
          ${service.highlight
            ? 'text-sdc-coral'
            : 'text-sdc-teal group-hover:text-sdc-coral'
          }`}
        style={{ transform: 'translateZ(30px)' }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        className="font-poppins text-sdc-mute text-[0.875rem] sm:text-[0.9rem] leading-[1.65] m-0"
        style={{ transform: 'translateZ(18px)' }}
      >
        {service.desc}
      </p>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef(null);
  const watermarkRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('#services .rv').forEach((el) => observer.observe(el));

    /* ── Horizontal Scroll Parallax ───────────────────────────── */
    let rafId;
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        // As user scrolls through the section, translate watermark horizontally
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const xOffset = (progress - 0.5) * -160; // moves horizontally by 160px
        if (watermarkRef.current) {
          watermarkRef.current.style.transform = `translate3d(${xOffset}px, 0, 0)`;
        }
        if (headerRef.current) {
          headerRef.current.style.transform = `translate3d(${-xOffset * 0.15}px, 0, 0)`;
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
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[5vw] max-w-[1200px] mx-auto overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* ── Background Floating Parallax Watermark ─────────── */}
      <div
        className="absolute top-10 sm:top-14 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.06] -z-10 watermark-float"
        aria-hidden="true"
      >
        <div
          ref={watermarkRef}
          className="watermark-parallax font-cinzel font-black whitespace-nowrap text-[5rem] sm:text-[8rem] lg:text-[10rem] text-sdc-teal leading-none will-change-transform"
          style={{ width: 'max-content' }}
        >
          SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS •
        </div>
      </div>

      {/* Section header with subtle parallax */}
      <div
        ref={headerRef}
        className="rv text-center mb-8 sm:mb-12 will-change-transform"
      >
        <span
          className="inline-block border border-sdc-coral/40 text-sdc-teal px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase font-times font-bold mb-3 bg-sdc-coral/5 shadow-sm"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          What We Offer
        </span>
        <h2
          id="services-heading"
          className="group font-playfair font-bold text-sdc-coral mb-3 leading-tight cursor-pointer"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2.6rem)' }}
        >
          <Text3DFlip
            text="Decor & Catering for Every Occasion"
            className="text-sdc-coral"
            staggerDelay={20}
            autoFlipInterval={7000}
          />
        </h2>
        <p className="font-poppins text-sdc-mute max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
          Whatever the occasion, we decorate it and cook it your way. Food of your own choice,
          Veg or Non-Veg, cooked to perfection.
        </p>
      </div>

      {/*
        Grid: 1 col (mobile) → 2 col (sm) → 4 col (xl)
        "And Much More" (last card) spans 2 cols on sm so it fills
        the row nicely instead of sitting alone at half-width.
        On xl (4-col), it reverts to 1 col normally (row has 5,6,7).
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 relative z-10">
        {SERVICES.map((service, i) => (
          <ServiceCard
            key={service.title}
            service={service}
            index={i}
            isLast={i === SERVICES.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

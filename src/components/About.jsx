import { useEffect } from 'react';
import Text3DFlip from './ui/text-3d-flip';
import realMandapSrc from '../../assets/images/real-mandap-ceremony.jpg';
import realCateringSrc from '../../assets/images/real-catering-buffet.jpg';
import realEntranceSrc from '../../assets/images/real-grand-entrance.jpg';
import realHaldiSrc from '../../assets/images/real-haldi-mehndi.jpg';

const STATS = [
  { value: 'Decades', label: 'of trust' },
  { value: '1000s',   label: 'of celebrations' },
  { value: '100%',    label: 'customized' },
  { value: '8+',      label: 'cities served' },
];

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('#about .rv').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="relative py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[5vw] max-w-[1200px] mx-auto overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* ── Background Floating Horizontal Watermark ──────────────────────── */}
      <div
        className="absolute top-10 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.06] -z-10"
        aria-hidden="true"
      >
        <div
          className="watermark-glide-left font-cinzel font-black whitespace-nowrap text-[5rem] sm:text-[8rem] lg:text-[10rem] text-sdc-teal leading-none"
        >
          <span>SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS •&nbsp;</span>
          <span>SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS •&nbsp;</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

        {/* Text column — slides in from the left on scroll */}
        <div className="rv-left text-center md:text-left max-w-xl">
          <span
            className="inline-block border border-sdc-coral/40 text-sdc-teal px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase font-times font-bold mb-3 bg-sdc-coral/5 shadow-sm"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Our Legacy
          </span>
          <h2
            id="about-heading"
            className="group font-playfair font-bold text-sdc-coral mb-4 sm:mb-5 leading-tight cursor-pointer"
            style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.3rem)' }}
          >
            <Text3DFlip
              text="Ludhiana's Heritage Vendor"
              className="text-sdc-coral justify-center md:justify-start"
              staggerDelay={22}
              autoFlipInterval={8000}
            />
          </h2>
          <p className="font-poppins text-sdc-mute leading-[1.85] text-[0.93rem] sm:text-[0.97rem]">
            Led by founder{' '}
            <strong className="text-sdc-ink font-semibold">
              Jatinderpal Singh (Sunny Singh)
            </strong>
            , Sahib Decor &amp; Catters has been the name families across Punjab trust for
            weddings, mehndi, birthdays, baby showers, religious and festive events and
            every occasion in between. From Ludhiana to Chandigarh and Amritsar to
            destination venues, every event is executed 100% to your vision.
          </p>
        </div>

        {/* Stats grid — slides in from the right on scroll */}
        <div
          className="rv-right grid grid-cols-2 gap-3 sm:gap-4 w-full"
          aria-label="Key statistics"
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              id={`stat-${i}`}
              className="p-4 sm:p-5 rounded-2xl bg-white/70 border border-sdc-coral/20
                text-center hover:border-sdc-coral/50
                hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 cursor-pointer group shadow-sm"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <strong
                className="block font-playfair leading-none mb-1.5"
                style={{ fontSize: 'clamp(1.2rem, 3.8vw, 1.8rem)' }}
              >
                <Text3DFlip
                  text={value}
                  className="text-sdc-coral font-bold"
                  staggerDelay={35}
                />
              </strong>
              <span className="font-montserrat font-semibold text-sdc-mute text-xs sm:text-sm group-hover:text-sdc-ink transition-colors tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Real Event Moments Showcase ─────────────────── */}
      <div className="rv-scale mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-sdc-coral/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-montserrat text-xs font-bold text-sdc-coral tracking-widest uppercase">
              Real Work &amp; Celebrations
            </span>
            <h3 className="text-sdc-teal text-xl sm:text-2xl mt-1">
              <span className="font-playfair font-bold">Moments Crafted by </span>
              <span className="font-cinzel font-bold text-sdc-coral">Sahib Decor &amp; Catters</span>
            </h3>
          </div>
          <span className="hidden sm:inline-block font-gurmukhi text-sdc-coral font-semibold text-sm">
            ਪੰਜਾਬ ਭਰ ਵਿੱਚ ਯਾਦਗਾਰੀ ਪ੍ਰੋਗਰਾਮ
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { src: realMandapSrc, title: 'Traditional Mandap', tag: 'Sacred Vows' },
            { src: realCateringSrc, title: 'Royal Banquet Catering', tag: 'Live Chefs' },
            { src: realEntranceSrc, title: 'Grand Floral Entrance', tag: 'Fairylit Walkway' },
            { src: realHaldiSrc, title: 'Haldi & Mehndi Setup', tag: 'Vibrant Lawn' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] border border-sdc-coral/20 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sdc-teal/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <span className="block text-[0.65rem] sm:text-xs font-montserrat tracking-wide uppercase text-sdc-gold2 font-bold">
                  {item.tag}
                </span>
                <span className="block font-playfair text-xs sm:text-sm font-bold leading-tight">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

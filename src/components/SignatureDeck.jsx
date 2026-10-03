import { useState, useEffect, useRef, useCallback } from 'react';
import Text3DFlip from './ui/text-3d-flip';

// Real event photographs provided by user & authentic work
import realMandapSrc from '../../assets/images/real-mandap-ceremony.jpg';
import realCateringSrc from '../../assets/images/real-catering-buffet.jpg';
import realEntranceSrc from '../../assets/images/real-grand-entrance.jpg';
import realHaldiSrc from '../../assets/images/real-haldi-mehndi.jpg';
import sdcStageSrc from '../../assets/images/sdc-stage.jpg';
import sdcAnandKarajSrc from '../../assets/images/sdc-anand-karaj.jpg';

const DECK_CARDS = [
  {
    id: 'mandap',
    badge: '👑 Royal Mandap',
    title: 'Traditional Floral Mandaps',
    punjabi: 'ਸ਼ਾਹੀ ਮੰਡਪ ਤੇ ਪਵਿੱਤਰ ਫੇਰਿਆਂ ਦੀ ਸਜਾਵਟ',
    desc: 'Grand traditional carved pillars, fresh cascading marigold and rose garlands, brass ceremonial lamps, and holy havan kund setup under rich ivory drapes.',
    image: realMandapSrc,
    features: ['Carved gold pillars & fresh floral canopy', 'Traditional brass samai lamps & agni altar', 'Comfortable family ceremonial seating'],
    whatsappQuery: 'Hi Sunny ji, I want to inquire about Traditional Mandap and Wedding setups.',
  },
  {
    id: 'catering',
    badge: '🍽️ Punjabi Zaika',
    title: 'Live Counters & Gourmet Catering',
    punjabi: 'ਤਾਜ਼ਾ ਗਰਮਾ-ਗਰਮ ਲਾਈਵ ਕਾਊਂਟਰ ਤੇ ਬੇਮਿਸਾਲ ਸਵਾਦ',
    desc: 'Lavish copper and brass chafing setups, master chefs serving sizzling tandoori delicacies, live Amritsari kulchas, Dal Makhani, and hot desserts.',
    image: realCateringSrc,
    features: ['Uniformed professional chef service', 'Traditional hammered copper chafing handis', 'Multi-course royal feasts & live chaat'],
    whatsappQuery: 'Hi Sunny ji, I want to inquire about Live Catering & Food Counters for our celebration.',
  },
  {
    id: 'haldi-mehndi',
    badge: '🌸 Mehndi & Haldi',
    title: 'Mehndi, Haldi & Sangeet Sets',
    punjabi: 'ਰੰਗ-ਬਿਰੰਗੇ ਝੂਲੇ, ਫੁਲਕਾਰੀ ਥੀਮ ਤੇ ਢੋਲ ਸਟੇਜ',
    desc: 'Vibrant marigold canopies, decorated wooden floral jhoola, heritage phulkari backdrops, antique brass urli with floating petals, and joyful celebration zones.',
    image: realHaldiSrc,
    features: ['Decorated floral wooden swing (jhoola)', 'Brass urli with fresh marigold petals', 'Colorful phulkari seating & festive cushions'],
    whatsappQuery: 'Hi Sunny ji, I want to inquire about Mehndi, Haldi & Sangeet decor setup.',
  },
  {
    id: 'entrances',
    badge: '🏰 Grand Entrances',
    title: 'Floral Tunnels & Fairylit Walkways',
    punjabi: 'ਰਾਹਦਾਰੀਆਂ ਤੇ ਫੁੱਲਾਂ ਭਰੇ ਸ਼ਾਹੀ ਦਰਵਾਜ਼ੇ',
    desc: 'Awe-inspiring grand floral archways, ceiling chandeliers with cascading jasmine, red carpet walkway, and warm lantern lighting for a royal arrival.',
    image: realEntranceSrc,
    features: ['Magnificent floral arch tunnel with chandelier', 'Red carpet entrance for bride & groom', 'Romantic fairy lights & candle lanterns'],
    whatsappQuery: 'Hi Sunny ji, I want to inquire about Grand Entrance & Walkway decor for our event.',
  },
  {
    id: 'stages',
    badge: '✨ Wedding Stage',
    title: 'Grand Stages & Crystal Chandeliers',
    punjabi: 'ਸ਼ਾਨਦਾਰ ਰਿਸੈਪਸ਼ਨ ਸਟੇਜ ਤੇ ਝੂਮਰ ਸਜਾਵਟ',
    desc: 'Bespoke crystal backdrops, imported fresh flower walls, designer royal velvet seating, and ambient warm lighting for cinematic photography.',
    image: sdcStageSrc,
    features: ['Custom 3D stage backdrops', 'Fresh rose & orchid floral walls', 'Warm golden luxury lighting'],
    whatsappQuery: 'Hi Sunny ji, I want to inquire about Grand Wedding Stage setups.',
  },
  {
    id: 'anand-karaj',
    badge: '🕊️ Anand Karaj',
    title: 'Pavitra Anand Karaj & Gurdwara Setups',
    punjabi: 'ਪਵਿੱਤਰ ਆਨੰਦ ਕਾਰਜ ਲਈ ਮਰਯਾਦਾ ਅਨੁਸਾਰ ਸਜਾਵਟ',
    desc: 'Reverent, peaceful white and gold floral arrangements, respectful floor carpetings, and dignified palki sahib decorations adhering strictly to Sikh maryada.',
    image: sdcAnandKarajSrc,
    features: ['Strictly maryada-compliant decor', 'Fragrant jasmine, tuberoses & white lilies', 'Complete sound & canopy arrangements'],
    whatsappQuery: 'Hi Sunny ji, I want to inquire about Anand Karaj floral and seating setups.',
  },
];

export default function SignatureDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('#why-us .rv').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Draw next card with fluid exit animation
  const nextCard = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % DECK_CARDS.length);
      setIsExiting(false);
    }, 280);
  }, [isExiting]);

  // Pull previous card to top
  const prevCard = useCallback(() => {
    if (isExiting) return;
    setActiveIndex((prev) => (prev - 1 + DECK_CARDS.length) % DECK_CARDS.length);
  }, [isExiting]);

  // Select specific card when clicking a background card in the fan
  const selectCard = (index) => {
    if (index === activeIndex || isExiting) return;
    setActiveIndex(index);
  };

  // Permanent auto-play timer (pauses when user hovers or is touching)
  useEffect(() => {
    if (!isHovered) {
      autoPlayTimerRef.current = setInterval(() => {
        nextCard();
      }, 4500);
      return () => clearInterval(autoPlayTimerRef.current);
    }
  }, [isHovered, nextCard]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      id="why-us"
      className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-[5vw] max-w-[1240px] mx-auto overflow-hidden select-none"
      aria-labelledby="why-us-heading"
    >
      {/* ── Background Aesthetic Glow ───────────────────────────── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-gradient-to-tr from-sdc-coral/10 via-sdc-gold/8 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ── Background Floating Horizontal Watermark ──────────────────────── */}
      <div
        className="absolute top-10 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.06] -z-10"
        aria-hidden="true"
      >
        <div
          className="watermark-glide-right font-cinzel font-black whitespace-nowrap text-[5rem] sm:text-[8rem] lg:text-[10rem] text-sdc-teal leading-none"
        >
          <span>SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS •&nbsp;</span>
          <span>SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS •&nbsp;</span>
        </div>
      </div>

      {/* ── Section Header ─────────────────────────────────────── */}
      <div className="rv text-center mb-10 sm:mb-14">
        <span
          className="inline-block border border-sdc-coral/40 text-sdc-teal px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase font-times font-bold mb-3 bg-sdc-coral/5 shadow-sm"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Signature Excellence
        </span>
        <h2
          id="why-us-heading"
          className="group font-playfair font-bold text-sdc-coral leading-tight mb-3 cursor-pointer"
          style={{ fontSize: 'clamp(1.75rem, 5.5vw, 2.85rem)' }}
        >
          <Text3DFlip
            text="Why Families Trust SDC"
            className="text-sdc-coral"
            staggerDelay={24}
            autoFlipInterval={7500}
          />
        </h2>
        <p className="font-poppins text-sdc-mute text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          From grand royal stages to authentic live Punjabi catering, discover the craft, passion, and care that make every Sahib Decor &amp; Catters celebration extraordinary.
        </p>
      </div>

      {/* ── Deck Stage & Controls ──────────────────────────────── */}
      <div
        className="rv-scale flex flex-col items-center justify-center max-w-[620px] mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ── 3D Card Stack Container ──────────────────────────── */}
        <div
          className="relative w-full max-w-[420px] sm:max-w-[460px] h-[565px] sm:h-[545px] deck-stage cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="Card Deck of SDC Signature Highlights"
        >
          {DECK_CARDS.map((card, i) => {
            const offset = (i - activeIndex + DECK_CARDS.length) % DECK_CARDS.length;
            const isTop = offset === 0;

            let transform = '';
            let zIndex = 30 - offset;
            let opacity = 1;
            let pointerEvents = isTop || isHovered ? 'auto' : 'none';

            if (isTop && isExiting) {
              // Swoosh exit animation
              transform = 'translateX(130%) translateY(-20px) rotate(22deg) scale(0.85)';
              opacity = 0;
              zIndex = 40;
            } else if (isHovered && !isExiting) {
              // Smooth fan out when hovering the deck area
              const fanAngles = isMobile ? [0, 4, -4, 8, -8, 12] : [0, 7, -7, 14, -14, 20];
              const fanX = isMobile ? [0, 32, -32, 64, -64, 96] : [0, 70, -70, 140, -140, 200];
              const fanY = isMobile ? [-10, 4, 4, 16, 16, 28] : [-15, 6, 6, 24, 24, 40];
              const angle = fanAngles[offset] || 0;
              const xPos = fanX[offset] || 0;
              const yPos = fanY[offset] || 0;
              const scale = 1 - offset * 0.025;

              transform = `translateX(${xPos}px) translateY(${yPos}px) rotate(${angle}deg) scale(${scale})`;
              opacity = 1 - offset * 0.07;
              zIndex = 30 - offset;
              pointerEvents = 'auto';
            } else {
              // Natural stacked deck layout
              const stackY = offset * 12;
              const stackScale = 1 - offset * 0.038;
              const naturalRot = offset === 1 ? 2.5 : offset === 2 ? -2 : offset === 3 ? 1.5 : offset === 4 ? -1.5 : offset === 5 ? 2 : 0;
              const stackZ = -offset * 18;

              transform = `translateY(${stackY}px) scale(${stackScale}) rotate(${naturalRot}deg) translateZ(${stackZ}px)`;
              opacity = 1 - offset * 0.12;
              zIndex = 30 - offset;
            }

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isTop) {
                    nextCard();
                  } else {
                    selectCard(i);
                  }
                }}
                className={`absolute inset-0 deck-card rounded-2xl sm:rounded-[22px] p-4 sm:p-5 lg:p-6 flex flex-col justify-between overflow-hidden ${
                  isTop
                    ? 'border-2 border-sdc-coral/50 shadow-[0_22px_45px_-10px_rgba(224,87,92,0.22),0_15px_30px_rgba(31,45,46,0.12)]'
                    : 'border border-sdc-coral/25 shadow-lg'
                }`}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  pointerEvents,
                  background: 'linear-gradient(160deg, #ffffff 0%, #fdf9f2 50%, #f6ebd8 100%)',
                }}
              >
                {/* Card Top Ribbon */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[0.7rem] sm:text-xs font-montserrat font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-sdc-coral/10 text-sdc-coral border border-sdc-coral/20 whitespace-nowrap shrink-0">
                      {card.badge}
                    </span>
                    <span className="text-[0.65rem] sm:text-[0.72rem] font-cinzel tracking-wider text-sdc-teal/80 font-bold uppercase whitespace-nowrap shrink-0">
                      <span className="sm:hidden">SDC Heritage</span>
                      <span className="hidden sm:inline">Sahib Decor &amp; Catters</span>
                    </span>
                  </div>

                  {/* Card Visual Photo */}
                  <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden mb-3 group/img border border-sdc-coral/15 shadow-inner shrink-0">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sdc-teal/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2 text-[0.7rem] sm:text-xs font-gurmukhi font-semibold text-white px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                      {card.punjabi}
                    </span>
                  </div>

                  {/* Card Title & Description */}
                  <h3 className="font-playfair font-bold text-sdc-teal text-[1.05rem] sm:text-lg lg:text-xl leading-snug mb-1.5 sm:mb-2">
                    {card.title}
                  </h3>
                  <p className="font-poppins text-sdc-mute text-xs sm:text-[0.85rem] leading-relaxed mb-2.5 sm:mb-3">
                    {card.desc}
                  </p>
                </div>

                {/* Key Bullet Features & Actions */}
                <div>
                  <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 border-t border-sdc-coral/15 pt-2.5 sm:pt-3">
                    {card.features.map((feat, featIdx) => (
                      <div key={featIdx} className="flex items-center gap-2 text-xs text-sdc-ink">
                        <span className="text-sdc-coral font-bold text-sm">✓</span>
                        <span className="font-poppins font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-2 border-t border-sdc-coral/10 shrink-0">
                    <a
                      href={`https://wa.me/919888129647?text=${encodeURIComponent(card.whatsappQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-center py-2.5 sm:py-3 px-4 rounded-xl bg-sdc-coral hover:bg-sdc-coral2 text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>💬</span>
                      <span>Enquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom Deck Navigation (No card count numbers) ───────────────── */}
        <div className="flex items-center justify-between w-full max-w-[420px] sm:max-w-[460px] mt-6 px-2">
          {/* Previous Card Button */}
          <button
            type="button"
            onClick={prevCard}
            disabled={isExiting}
            aria-label="Previous highlight card"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sdc-coral/30 hover:border-sdc-coral text-sdc-teal font-montserrat text-xs sm:text-sm font-bold hover:bg-sdc-coral/10 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>⟵ Prev</span>
          </button>

          <span className="font-cinzel text-xs tracking-widest text-sdc-coral/80 font-bold uppercase">
            ✦ SDC Heritage ✦
          </span>

          {/* Next Card Button */}
          <button
            type="button"
            onClick={nextCard}
            disabled={isExiting}
            aria-label="Next highlight card"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sdc-coral hover:bg-sdc-coral2 text-white font-montserrat text-xs sm:text-sm font-bold shadow-md shadow-sdc-coral/25 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <span>Next ⟶</span>
          </button>
        </div>
      </div>
    </section>
  );
}

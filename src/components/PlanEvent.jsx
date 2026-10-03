import { useState, useEffect, useCallback } from 'react';
import Text3DFlip from './ui/text-3d-flip';

const EVENT_TYPES  = ['Wedding / Reception', 'Anand Karaj', 'Mehndi / Haldi / Sangeet', 'Birthday / Baby Shower', 'Religious / Festive Event', 'Other'];
const FOOD_OPTIONS = ['Veg', 'Non-Veg', 'Both'];
const SERVICE_OPTS = ['Decor & Catering', 'Decor only', 'Catering only'];

function ChipGroup({ options, value, onChange, groupLabel }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={groupLabel}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full
              text-[0.76rem] sm:text-[0.85rem] font-montserrat font-semibold border
              transition-all duration-200 active:scale-95 touch-manipulation
              ${active
                ? 'bg-sdc-coral text-white border-sdc-coral shadow-md shadow-sdc-coral/25 chip-selected'
                : 'bg-transparent text-sdc-ink border-sdc-coral/40 hover:border-sdc-coral hover:bg-sdc-coral/10'
              }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function PlanEvent() {
  const [eventType, setEventType] = useState('Wedding / Reception');
  const [guests,    setGuests]    = useState(350);
  const [food,      setFood]      = useState('Veg');
  const [services,  setServices]  = useState('Decor & Catering');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('#plan .rv').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const sendWhatsApp = useCallback(() => {
    const msg = [
      'Sat Sri Akal Jatinderpal ji (Sunny ji),',
      'I would like to inquire about booking Sahib Decor & Catters for an event:',
      '',
      `• Event Type: ${eventType}`,
      `• Date: (Please share your preferred date)`,
      `• Location: Ludhiana`,
      `• Guest Count: ${guests} Guests`,
      `• Services: ${services}`,
      `• Food Preference: ${food}`,
      '',
      'Please share your availability and estimated package.',
    ].join('\n');

    window.open(`https://wa.me/919888129647?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  }, [eventType, guests, food, services]);

  return (
    <section
      id="plan"
      className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 px-4 sm:px-6"
      aria-labelledby="plan-heading"
      style={{ background: 'linear-gradient(180deg, #fbf6ec 0%, #f5ead8 100%)' }}
    >
      {/* ── Background Floating Horizontal Watermark ──────────────────────── */}
      <div
        className="absolute top-10 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.06] z-0"
        aria-hidden="true"
      >
        <div
          className="watermark-glide-right font-cinzel font-black whitespace-nowrap text-[5rem] sm:text-[8rem] lg:text-[10rem] text-sdc-teal leading-none"
        >
          <span>SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS •&nbsp;</span>
          <span>SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS • SAHIB DECOR &amp; CATTERS •&nbsp;</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="rv text-center mb-8 sm:mb-10">
          <span
            className="inline-block border border-sdc-coral/40 text-sdc-teal px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase font-times font-bold mb-3 bg-sdc-coral/5 shadow-sm"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Instant Estimate
          </span>
          <h2
            id="plan-heading"
            className="group font-playfair font-bold text-sdc-coral mb-3 leading-tight cursor-pointer"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2.6rem)' }}
          >
            <Text3DFlip
              text="Plan Your Event"
              className="text-sdc-coral"
              staggerDelay={26}
              autoFlipInterval={7000}
            />
          </h2>
          <p className="font-poppins text-sdc-mute max-w-sm mx-auto text-sm sm:text-base">
            Tell us the basics and send your enquiry straight to Sunny ji on WhatsApp.
          </p>
        </div>

        {/* Estimator card */}
        <div
          className="rv-scale max-w-[700px] mx-auto rounded-2xl sm:rounded-[22px] p-4 sm:p-7 lg:p-9"
          style={{
            background: 'linear-gradient(160deg, #fff, #fbf1dd)',
            border: '1px solid #e0575c55',
            boxShadow: '0 18px 40px rgba(31,45,46,0.10)',
          }}
        >
          {/* Event type */}
          <div className="mb-4 sm:mb-6">
            <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-2">
              Event type
            </p>
            <ChipGroup
              options={EVENT_TYPES}
              value={eventType}
              onChange={setEventType}
              groupLabel="Event type selection"
            />
          </div>

          {/* Guest count */}
          <div className="mb-4 sm:mb-6">
            <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-1">
              Guests:{' '}
              <span className="font-playfair text-sdc-coral text-xl sm:text-2xl ml-1 tabular-nums font-bold">{guests}</span>
            </p>
            <input
              id="guest-slider"
              type="range"
              min={50}
              max={2000}
              step={50}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full mt-2 cursor-pointer h-5 touch-manipulation"
              style={{ accentColor: '#e0575c' }}
              aria-valuemin={50}
              aria-valuemax={2000}
              aria-valuenow={guests}
              aria-label="Number of guests"
            />
            <div className="flex justify-between font-montserrat text-sdc-mute text-xs mt-1 font-semibold">
              <span>50</span><span>2000</span>
            </div>
          </div>

          {/* Food preference */}
          <div className="mb-4 sm:mb-6">
            <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-2">
              Food preference
            </p>
            <ChipGroup
              options={FOOD_OPTIONS}
              value={food}
              onChange={setFood}
              groupLabel="Food preference selection"
            />
          </div>

          {/* Services */}
          <div className="mb-5 sm:mb-7">
            <p className="font-montserrat text-sdc-teal text-xs tracking-wider uppercase font-bold mb-2">
              Services
            </p>
            <ChipGroup
              options={SERVICE_OPTS}
              value={services}
              onChange={setServices}
              groupLabel="Services selection"
            />
          </div>

          {/* WhatsApp CTA */}
          <button
            id="plan-whatsapp-btn"
            type="button"
            onClick={sendWhatsApp}
            className="btn-shine w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-full font-montserrat font-bold text-white
              text-[0.78rem] sm:text-[0.92rem] tracking-wide sm:tracking-wider uppercase
              hover:-translate-y-1 hover:shadow-xl active:scale-95
              transition-all duration-300 touch-manipulation flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #fb6b6e, #e0575c)',
              boxShadow: '0 8px 25px rgba(224,87,92,0.35)',
            }}
            aria-label="Send enquiry on WhatsApp to Sahib Decor & Catters"
          >
            <span className="text-base sm:text-lg shrink-0">💬</span>
            <span className="whitespace-nowrap">Send Enquiry on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
}

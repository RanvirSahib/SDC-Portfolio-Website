import { useEffect, useState } from 'react';
import instaSrc from '../../assets/images/insta.png';
import facebookSrc from '../../assets/images/facebook-logo.png';
import Text3DFlip from './ui/text-3d-flip';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const address = 'B-XII, 1262/N2, Kot Alamgir, Opp. Civil Hospital, Ludhiana, Punjab';
  // Exact landmark coordinates (Civil Hospital / Kot Alamgir, Ludhiana) with branded pin marker
  const mapCoordinates = '30.9064,75.8606';
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapCoordinates}+(Sahib+Decor+%26+Catters)&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapCoordinates}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('#contact .rv').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const copyAddress = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-[5vw] max-w-[1240px] mx-auto"
      aria-labelledby="contact-heading"
    >
      {/* ── Background Floating Horizontal Watermark ──────────────────────── */}
      <div
        className="absolute top-16 sm:top-20 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.035] -z-10"
        aria-hidden="true"
      >
        <div
          className="watermark-glide-left font-cinzel font-black whitespace-nowrap text-[5rem] sm:text-[8rem] lg:text-[10rem] text-sdc-teal leading-none"
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
          Find Us in Ludhiana
        </span>
        <h2
          id="contact-heading"
          className="group font-playfair font-bold text-sdc-coral leading-tight mb-3 cursor-pointer"
          style={{ fontSize: 'clamp(1.85rem, 6vw, 3.2rem)' }}
        >
          <Text3DFlip
            text="Visit & Connect"
            className="text-sdc-coral"
            staggerDelay={28}
            autoFlipInterval={7000}
          />
        </h2>
        <p className="font-gurmukhi text-sdc-ink text-base sm:text-lg font-medium max-w-xl mx-auto">
          ਸਾਡੇ ਦਫ਼ਤਰ ਆਓ ਜਾਂ ਇੱਕ ਫ਼ੋਨ ਕਾਲ ਕਰੋ — ਅਸੀਂ ਤੁਹਾਡੀ ਸੇਵਾ ਲਈ ਹਮੇਸ਼ਾ ਤਿਆਰ ਹਾਂ
        </p>
      </div>

      {/* ── Main Interactive Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* ── Left Column: Interactive Map & Location Card (7 cols) — slides from left ── */}
        <div className="rv-left lg:col-span-7 flex flex-col">
          <div className="relative flex-1 rounded-3xl overflow-hidden border-2 border-sdc-coral/30 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-sdc-coral transition-all duration-300 flex flex-col group">
            
            {/* Interactive Google Maps Frame with Pinned Marker */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#e5e3df]">
              <iframe
                title="Sahib Decor & Catters Location Map"
                src={mapEmbedUrl}
                className="w-full h-full border-0 filter contrast-[1.03] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
                aria-label="Google Maps View of Sahib Decor & Catters, Kot Alamgir Ludhiana"
              />

              {/* Floating Live Location Pinned Badge */}
              <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-sdc-coral/30 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sdc-coral opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sdc-coral"></span>
                  </span>
                  <span className="font-montserrat font-bold text-[0.7rem] sm:text-xs text-sdc-teal tracking-wide whitespace-nowrap">
                    📍 Location Pinned
                  </span>
                </div>
              </div>
            </div>

            {/* Address Details & Interactive Buttons */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-[#fffcf7]">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sdc-coral/15 text-sdc-coral text-base">
                    📍
                  </span>
                  <span className="font-playfair font-bold text-sdc-teal text-base sm:text-lg tracking-wide">
                    Main Office &amp; Decor Studio
                  </span>
                </div>
                <p className="font-poppins text-sdc-ink text-base sm:text-[1.12rem] font-semibold leading-relaxed mb-1">
                  {address}
                </p>
                <p className="font-poppins text-sdc-mute text-xs sm:text-sm">
                  Opposite Civil Hospital, Kot Alamgir, Ludhiana, Punjab
                </p>
              </div>

              {/* Action Buttons for Location */}
              <div className="mt-6 pt-5 border-t border-sdc-coral/15 flex flex-wrap gap-3 sm:gap-4 items-center">
                <a
                  href={googleDirectionsUrl}
                  id="get-directions-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine flex-1 min-w-[200px] text-center px-5 sm:px-6 py-3.5 rounded-2xl bg-sdc-coral text-white font-montserrat font-bold text-sm sm:text-base shadow-lg shadow-sdc-coral/25 hover:bg-[#e0575c] hover:-translate-y-0.5 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span className="shrink-0">🧭</span>
                  <span className="whitespace-nowrap">Get Directions on Maps</span>
                  <span className="text-lg leading-none shrink-0">↗</span>
                </a>

                <button
                  type="button"
                  id="copy-address-btn"
                  onClick={copyAddress}
                  className="px-5 py-3.5 rounded-2xl border-2 border-sdc-coral/30 hover:border-sdc-coral text-sdc-teal hover:text-sdc-coral font-montserrat font-bold text-sm transition-all duration-200 bg-white hover:bg-sdc-coral/5 active:scale-95 flex items-center gap-1.5"
                  aria-label="Copy Address to clipboard"
                >
                  <span>{copied ? '✓' : '📋'}</span>
                  <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── Right Column: Interactive Phone & Social Cards (5 cols) — slides from right ─ */}
        <div className="rv-right lg:col-span-5 flex flex-col gap-5 sm:gap-6 justify-between">
          
          {/* Phone & Direct WhatsApp Card */}
          <div className="rounded-3xl p-6 sm:p-7 border-2 border-sdc-coral/30 bg-gradient-to-br from-white to-[#fdf5e8] shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sdc-coral/15 text-sdc-coral text-xl">
                📞
              </span>
              <div>
                <h3 className="font-playfair font-bold text-sdc-teal text-base sm:text-lg leading-tight">
                  Call or WhatsApp Directly
                </h3>
                <p className="font-poppins text-sdc-mute text-xs sm:text-sm">
                  Speak with Sunny Singh &amp; Team
                </p>
              </div>
            </div>

            <a
              href="tel:+919888129647"
              className="block font-montserrat font-extrabold text-sdc-ink text-xl sm:text-2xl hover:text-sdc-coral transition-colors mb-5"
            >
              +91 98881-29647
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+919888129647"
                id="contact-call-btn"
                className="text-center py-3 px-4 rounded-xl bg-sdc-teal text-white hover:bg-sdc-teal/90 font-montserrat font-bold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span>📞</span>
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/919888129647?text=Hello%20Sunny%20Ji%2C%20I%20would%20like%20to%20discuss%20an%20event%20with%20Sahib%20Decor%20%26%20Catters."
                id="contact-whatsapp-btn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-montserrat font-bold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Social Channels */}
          <div className="rounded-3xl p-4 sm:p-6 lg:p-7 border-2 border-sdc-coral/30 bg-gradient-to-br from-white to-[#fbf1dd] shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="font-playfair font-bold text-sdc-teal text-base sm:text-lg mb-1 leading-tight">
              Follow Our Celebrations
            </h3>
            <p className="font-poppins text-sdc-mute text-xs sm:text-sm mb-4 sm:mb-5">
              Watch real setups, live videos, decor photos and latest events
            </p>

            <div className="flex flex-col gap-3">
              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/sahib_decorators_caterers/"
                id="contact-instagram-card"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white border border-sdc-coral/20 hover:border-sdc-coral shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <img
                    src={instaSrc}
                    alt="Instagram logo"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block font-montserrat font-bold text-sdc-ink text-sm sm:text-base group-hover:text-sdc-coral transition-colors truncate">
                      Instagram
                    </span>
                    <span className="block font-poppins text-sdc-mute text-[0.72rem] sm:text-xs truncate" title="@sahib_decorators_caterers">
                      @sahib_decorators_caterers
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-montserrat font-bold text-sdc-coral px-2.5 sm:px-3 py-1.5 rounded-lg bg-sdc-coral/10 group-hover:bg-sdc-coral group-hover:text-white transition-all whitespace-nowrap">
                  Follow ↗
                </span>
              </a>

              {/* Facebook Card */}
              <a
                href="https://www.facebook.com/sunny.singh2107"
                id="contact-facebook-card"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white border border-sdc-coral/20 hover:border-sdc-coral shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <img
                    src={facebookSrc}
                    alt="Facebook logo"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block font-montserrat font-bold text-sdc-ink text-sm sm:text-base group-hover:text-sdc-coral transition-colors truncate">
                      Facebook
                    </span>
                    <span className="block font-poppins text-sdc-mute text-[0.72rem] sm:text-xs truncate" title="Sunny Singh (Jatinderpal Singh)">
                      Sunny Singh (Jatinderpal Singh)
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-montserrat font-bold text-sdc-teal px-2.5 sm:px-3 py-1.5 rounded-lg bg-sdc-teal/10 group-hover:bg-sdc-teal group-hover:text-white transition-all whitespace-nowrap">
                  Visit ↗
                </span>
              </a>
            </div>
          </div>

          {/* Quick Hours / Availability Badge */}
          <div className="rounded-2xl p-4 bg-sdc-teal/5 border border-sdc-teal/15 flex items-center justify-between text-xs sm:text-sm font-montserrat text-sdc-teal">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="font-semibold">Open 7 Days a Week</strong>
            </span>
            <span className="font-poppins text-sdc-mute font-medium">9:00 AM – 9:00 PM</span>
          </div>

        </div>

      </div>

      {/* Decorative divider */}
      <div
        className="w-24 h-[2px] mx-auto mt-14 sm:mt-18 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #e0575c, transparent)' }}
        aria-hidden="true"
      />
    </section>
  );
}

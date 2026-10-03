import { useEffect, useRef } from 'react';
import logoSrc from '../../assets/images/SDC.png';

export default function Loader({ onDone }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.classList.add('loader-off');
      }
      document.body.style.overflow = '';
      // Notify parent after animation completes
      setTimeout(onDone, 950);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      id="loader-overlay"
      ref={overlayRef}
      className="fixed inset-0 z-[100] grid place-items-center bg-sdc-bg"
      aria-label="Loading Sahib Decor & Catters"
      role="status"
    >
      <div className="text-center">
        {/* Pulsing logo */}
        <img
          src={logoSrc}
          alt="Sahib Decor & Catters Logo"
          className="w-28 h-28 rounded-3xl object-contain bg-sdc-teal shadow-2xl shadow-sdc-teal/30 animate-logoPulse mx-auto"
        />

        {/* SDC brand name */}
        <p className="font-cinzel text-sdc-coral tracking-[0.3em] text-sm mt-5 font-semibold">
          SDC
        </p>

        {/* Progress bar */}
        <div className="w-40 h-[3px] bg-sdc-coral/20 rounded-full mx-auto mt-4 overflow-hidden">
          <div
            className="h-full w-0 rounded-full animate-ldb"
            style={{
              background: 'linear-gradient(90deg, #e0575c, #fb6b6e)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

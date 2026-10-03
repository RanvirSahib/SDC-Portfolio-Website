import { useState, useEffect } from 'react';
import logoSrc from '../../assets/images/SDC.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '#services', label: 'Services',   id: 'services' },
    { href: '#why-us',   label: 'Why Us',     id: 'why-us' },
    { href: '#about',    label: 'About',      id: 'about' },
    { href: '#plan',     label: 'Plan Event', id: 'plan' },
    { href: '#contact',  label: 'Visit Us',   id: 'contact' },
  ];

  /* ── Track Scroll & Active Section ───────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll position with navbar offset
      const scrollPosition = window.scrollY + 220;

      let current = '';
      for (const { id } of links) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
            break;
          }
        }
      }

      // If scrolled near the bottom of the page, highlight contact
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        current = 'contact';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setActiveSection(id);
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-sdc-bg/95 backdrop-blur-md shadow-md border-b border-sdc-coral/25 py-2.5'
          : 'bg-sdc-bg/85 backdrop-blur-sm border-b border-sdc-coral/10 py-3.5'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a
          href="#hero"
          onClick={() => handleLinkClick('')}
          className="flex items-center gap-2.5 group"
          aria-label="Sahib Decor & Catters home"
        >
          <img
            src={logoSrc}
            alt="SDC Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain bg-sdc-teal shadow-md transition-transform duration-500 ease-bounce-out group-hover:rotate-[-10deg] group-hover:scale-110"
          />
          <div className="flex flex-col justify-center">
            <span
              className="font-times text-sdc-coral font-bold text-xl sm:text-[1.48rem] tracking-[0.08em] leading-none"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              SDC
            </span>
            <span
              className="font-times text-[0.6rem] sm:text-[0.67rem] tracking-[0.12em] text-sdc-teal font-bold uppercase opacity-95 mt-0.5"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Sahib Decor &amp; Catters
            </span>
          </div>
        </a>

        {/* Desktop Nav Links with Active Section Highlight */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-sdc-coral/15 shadow-sm">
          {links.map(({ href, label, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                onClick={() => handleLinkClick(id)}
                className={`relative px-3.5 py-1.5 rounded-full font-inter text-[0.84rem] tracking-normal transition-all duration-250 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sdc-coral text-white font-semibold shadow-md shadow-sdc-coral/30 scale-105'
                    : 'text-sdc-ink/80 hover:text-sdc-coral hover:bg-sdc-coral/5 font-medium'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                {label}
              </a>
            );
          })}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+919888129647"
            id="navbar-call-btn"
            className="btn-shine px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase text-sdc-teal shadow-md shadow-sdc-coral/25 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #fb6b6e, #e0575c)',
            }}
            aria-label="Call Sahib Decor & Catters"
          >
            <span>📞</span>
            <span>Call Now</span>
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/70 border border-sdc-coral/20 flex flex-col items-center justify-center gap-1.5 text-sdc-teal hover:text-sdc-coral transition-colors"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            <span
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-current transition-all duration-200 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation with Active Section Highlighting */}
      {menuOpen && (
        <div className="md:hidden border-t border-sdc-coral/20 bg-sdc-bg/95 backdrop-blur-xl px-5 py-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            {links.map(({ href, label, id }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => handleLinkClick(id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl font-inter text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-sdc-coral text-white font-semibold shadow-md shadow-sdc-coral/30'
                      : 'text-sdc-ink hover:bg-sdc-coral/10 font-medium'
                  }`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{label}</span>
                  {isActive ? (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      Current Section
                    </span>
                  ) : (
                    <span className="text-sdc-coral text-xs">→</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

import logoSrc from '../assets/images/SDC.png';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-center px-[5vw] pt-10 pb-28 md:pb-10 border-t border-sdc-coral/20"
      aria-label="Site footer"
    >
      {/* Logo */}
      <a href="#hero" aria-label="Back to top — Sahib Decor & Catters">
        <img
          src={logoSrc}
          alt="Sahib Decor & Catters Logo"
          className="w-14 h-14 rounded-2xl object-contain bg-sdc-teal mx-auto mb-3 hover:rotate-[-10deg] hover:scale-110 transition-transform duration-500 ease-bounce-out"
        />
      </a>

      {/* Brand name */}
      <p className="font-cinzel text-sdc-coral font-bold text-sm tracking-widest mb-1">
        SAHIB DECOR &amp; CATTERS
      </p>

      {/* Copyright */}
      <p className="font-poppins text-sdc-mute text-xs">
        &copy; {year} Sahib Decor &amp; Catters (SDC) &middot; Ludhiana, Punjab
      </p>

      {/* Social links */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <a
          href="https://www.instagram.com/sahib_decorators_caterers/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-montserrat font-semibold text-sdc-mute text-xs hover:text-sdc-coral transition-colors duration-250"
          aria-label="Instagram"
        >
          Instagram
        </a>
        <span className="text-sdc-coral/30 text-xs">·</span>
        <a
          href="https://www.facebook.com/sunny.singh2107"
          target="_blank"
          rel="noopener noreferrer"
          className="font-montserrat font-semibold text-sdc-mute text-xs hover:text-sdc-coral transition-colors duration-250"
          aria-label="Facebook"
        >
          Facebook
        </a>
        <span className="text-sdc-coral/30 text-xs">·</span>
        <a
          href="tel:+919888129647"
          className="font-montserrat font-semibold text-sdc-mute text-xs hover:text-sdc-coral transition-colors duration-250"
          aria-label="Call us"
        >
          +91 98881-29647
        </a>
      </div>
    </footer>
  );
}

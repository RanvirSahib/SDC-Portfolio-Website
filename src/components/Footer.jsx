import logoSrc from '../assets/images/SDC.png';
import instaSrc from '../assets/images/insta.png';
import facebookSrc from '../assets/images/facebook-logo.png';
import whatsappSrc from '../assets/images/whatsapp.png';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-center px-[5vw] pt-10 pb-36 sm:pb-32 md:pb-12 border-t border-sdc-coral/20"
      aria-label="Site footer"
    >
      {/* Logo */}
      <a href="#hero" aria-label="Back to top — Sahib Decorators & Caterers">
        <img
          src={logoSrc}
          alt="Sahib Decorators & Caterers Logo"
          className="w-14 h-14 rounded-2xl object-contain bg-sdc-teal mx-auto mb-3 hover:rotate-[-10deg] hover:scale-110 transition-transform duration-500 ease-bounce-out"
        />
      </a>

      {/* Brand name */}
      <p className="font-cinzel text-sdc-coral font-bold text-sm tracking-widest mb-1">
        SAHIB DECORATORS &amp; CATERERS
      </p>

      {/* Copyright */}
      <p className="font-poppins text-sdc-mute text-xs">
        &copy; {year} Sahib Decorators &amp; Caterers (Sahib Tent House) &middot; Ludhiana, Punjab
      </p>

      {/* Social and Contact Links with Brand Logos */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4">
        <a
          href="https://www.instagram.com/sahib_decorators_caterers/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-montserrat font-semibold text-sdc-ink/80 text-xs hover:text-sdc-coral transition-colors duration-200"
          aria-label="Instagram"
        >
          <img
            src={instaSrc}
            alt=""
            aria-hidden="true"
            className="w-4 h-4 rounded-[4px] object-cover shadow-xs group-hover:scale-110 transition-transform duration-200 shrink-0"
          />
          <span>Instagram</span>
        </a>

        <span className="text-sdc-coral/30 text-xs hidden xs:inline select-none">·</span>

        <a
          href="https://www.facebook.com/sunny.singh2107"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-montserrat font-semibold text-sdc-ink/80 text-xs hover:text-sdc-coral transition-colors duration-200"
          aria-label="Facebook"
        >
          <img
            src={facebookSrc}
            alt=""
            aria-hidden="true"
            className="w-4 h-4 rounded-full object-contain shadow-xs group-hover:scale-110 transition-transform duration-200 shrink-0"
          />
          <span>Facebook</span>
        </a>

        <span className="text-sdc-coral/30 text-xs hidden xs:inline select-none">·</span>

        <a
          href="https://wa.me/919888129647?text=Hello%20Sunny%20Ji%2C%20I%20would%20like%20to%20discuss%20an%20event%20with%20Sahib%20Decorators%20%26%20Caterers."
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-montserrat font-semibold text-sdc-ink/80 text-xs hover:text-[#25D366] transition-colors duration-200 whitespace-nowrap"
          aria-label="WhatsApp Sunny Singh"
        >
          <img
            src={whatsappSrc}
            alt=""
            aria-hidden="true"
            className="w-4 h-4 rounded-full object-contain shadow-xs group-hover:scale-110 transition-transform duration-200 shrink-0"
          />
          <span>+91 98881-29647</span>
        </a>
      </div>
    </footer>
  );
}

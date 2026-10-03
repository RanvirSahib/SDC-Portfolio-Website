export default function MobileActionDock() {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-30 flex gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-sdc-coral/15 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden"
      style={{ background: 'rgba(251,246,236,0.96)', backdropFilter: 'blur(10px)' }}
      role="navigation"
      aria-label="Mobile quick actions"
    >
      {/* Call button */}
      <a
        href="tel:+919888129647"
        id="dock-call-btn"
        className="flex-1 text-center py-3.5 rounded-full font-jakarta font-bold text-sdc-teal text-sm transition-all duration-200 active:scale-95 hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #fb6b6e, #e0575c)' }}
        aria-label="Call Sahib Decorators & Caterers"
      >
        📞 Call
      </a>

      {/* WhatsApp button */}
      <a
        href="https://wa.me/919888129647"
        id="dock-whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-center py-3.5 rounded-full font-jakarta font-bold text-[#04210f] text-sm transition-all duration-200 active:scale-95 hover:opacity-90"
        style={{ background: '#25d366' }}
        aria-label="WhatsApp Sahib Decorators & Caterers"
      >
        💬 WhatsApp
      </a>
    </div>
  );
}

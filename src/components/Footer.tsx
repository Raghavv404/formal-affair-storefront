import { Link } from "react-router-dom";
import { Instagram, ShieldCheck, Globe, Leaf } from "lucide-react";
import SizeGuideModal from "./SizeGuideModal";
import logo from "@/assets/logo.png"; // Using your imported logo for consistency

const Footer = () => {
  const footerLinks = {
    customerCare: [
      { name: "Shipping & Delivery", href: "/shipping" },
      { name: "Returns & Exchanges", href: "/returns" },
      { name: "Cancellation Policy", href: "/cancellation-policy" },
      { name: "Contact Us", href: "/contact" },
    ],
    theBrand: [
      { name: "Our Story", href: "/our-story" },
      { name: "Sustainability", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
    ],
    policies: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* --- NEW: LUXURY TRUST BADGES --- */}
      <div className="border-b border-gray-50 py-16 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <Globe className="w-6 h-6 mb-4 text-gray-400" strokeWidth={1} />
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Premium Materials</h4>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] leading-relaxed max-w-[250px]">
              Sourced from the finest Indian mills for lasting comfort and elegance.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Leaf className="w-6 h-6 mb-4 text-gray-400" strokeWidth={1} />
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Ethical Craft</h4>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] leading-relaxed max-w-[250px]">
              Supporting local artisans through conscious and fair-trade practices.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 mb-4 text-gray-400" strokeWidth={1} />
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Secure Luxury</h4>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] leading-relaxed max-w-[250px]">
              Insured worldwide shipping delivered in eco-friendly minimalist packaging.
            </p>
          </div>
        </div>
      </div>

      {/* --- INSTAGRAM SECTION --- */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <a 
            href="https://www.instagram.com/theformalaffairr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row items-center justify-center gap-6 group"
          >
            <div className="flex items-center gap-4">
              <Instagram className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
              <span className="text-sm font-medium tracking-widest uppercase italic">@theformalaffairr</span>
            </div>
            <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">
              Follow our journey for behind-the-scenes & daily inspiration
            </span>
          </a>
        </div>
      </div>

      {/* --- MAIN LINKS --- */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {/* Customer Care */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-gray-900">
              Customer Care
            </h3>
            <ul className="space-y-4">
              {footerLinks.customerCare.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-[11px] text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <SizeGuideModal />
              </li>
            </ul>
          </div>

          {/* The Brand */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-gray-900">
              The Brand
            </h3>
            <ul className="space-y-4">
              {footerLinks.theBrand.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-[11px] text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-gray-900">
              Legal
            </h3>
            <ul className="space-y-4">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-[11px] text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 text-gray-900">
              Connect
            </h3>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed mb-6">
              Subscribe to receive updates on new collections and cinematic campaigns.
            </p>
            <div className="flex items-center gap-4">
               <a 
                href="https://www.instagram.com/theformalaffairr/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-black transition-colors"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-12 flex flex-col items-center">
          <img src={logo} alt="The Formal Affair" className="h-10 w-auto mb-8 opacity-80" />
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em]">
            © 2026 The Formal Affair. Designed for the Poised & Powerful.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
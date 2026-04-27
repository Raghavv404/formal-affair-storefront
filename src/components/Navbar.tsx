import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/data/products"; 
import SignInModal from "@/components/SignInModal";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; // <-- ADDED SUPABASE IMPORT

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  
  // State for specific modal steps (like opening directly to password reset)
  const [authModalStep, setAuthModalStep] = useState<"identifier_only" | "update_password">("identifier_only");
  
  const [hasPrompted, setHasPrompted] = useState(false);
  
  const { toggleCart, totalItems } = useCart();
  const { toggleWishlist, totalItems: wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- NEW: LISTEN FOR PASSWORD RECOVERY CLICKS ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Automatically open the modal to the reset password screen!
        setAuthModalStep("update_password");
        setIsSignInModalOpen(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- SMART SIGN IN NUDGE ---
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (!isAuthenticated && !hasPrompted) {
      timer = setTimeout(() => {
        toast("Member Access", {
          description: "Sign in to save your wishlist and track orders.",
          action: {
            label: "Sign In",
            onClick: () => setIsSignInModalOpen(true),
          },
          duration: 8000, 
        });
        setHasPrompted(true); 
      }, 5000); 
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasPrompted]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "COLLECTION", href: "/shop" },
    { name: "OUR STORY", href: "/our-story" },
    { name: "CAMPAIGNS", href: "#campaign" },
    { name: "ABOUT", href: "#about" }
  ];

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/account");
    } else {
      setIsSignInModalOpen(true);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/product/${searchResults[0].id}`);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setTimeout(() => setSearchQuery(""), 300); 
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-gray-100" 
            : "bg-transparent py-6 border-transparent"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          <div className="flex items-center flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden mr-4 text-black hover:opacity-60 transition-opacity"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <Link to="/" onClick={handleLogoClick} className="hidden md:block">
              <img 
                src={logo} 
                alt="The Formal Affair" 
                className="h-10 w-auto object-contain hover:opacity-70 transition-opacity" 
              />
            </Link>
          </div>

          <div className="flex justify-center flex-auto">
            <Link to="/" onClick={handleLogoClick} className="md:hidden block">
              <img src={logo} alt="The Formal Affair" className="h-8 w-auto object-contain" />
            </Link>

            <div className="hidden md:flex items-center gap-6 lg:gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href, e)}
                  className="relative text-[11px] lg:text-xs font-bold tracking-[0.15em] text-gray-900 group cursor-pointer whitespace-nowrap"
                >
                  <span className="transition-opacity group-hover:opacity-70">{link.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-300 ease-out group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-5 lg:gap-7 flex-1">
            <button onClick={() => setIsSearchOpen(true)} className="text-black hover:opacity-60 transition-opacity">
              <Search className="w-[22px] h-[22px]" strokeWidth={1.5} />
            </button>
            
            <button onClick={handleUserClick} className="hidden md:block text-black hover:opacity-60 transition-opacity">
              <User className="w-[22px] h-[22px]" strokeWidth={1.5} />
            </button>

            <button onClick={toggleWishlist} className="text-black hover:opacity-60 transition-opacity relative">
              <Heart className="w-[22px] h-[22px]" strokeWidth={1.5} />
              {wishlistItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlistItems}
                </span>
              )}
            </button>

            <button onClick={toggleCart} className="text-black hover:opacity-60 transition-opacity relative">
              <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 bg-white/95 backdrop-blur-md z-[60] transition-all duration-500 overflow-y-auto ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-full max-w-5xl mx-auto px-6 pt-32 pb-20 relative min-h-screen">
          <button 
            onClick={closeSearch}
            className="absolute top-8 right-6 md:right-0 text-black hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-8 h-8" strokeWidth={1} />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-16">
            <input
              type="text"
              placeholder="SEARCH..."
              className="w-full text-2xl md:text-5xl font-serif bg-transparent border-b border-gray-300 py-6 pr-12 focus:outline-none focus:border-black placeholder:text-gray-300 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isSearchOpen}
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-black hover:opacity-60 transition-opacity">
              <Search className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
            </button>
          </form>

          {searchQuery.trim().length > 0 && (
            <div className="animate-fade-in transition-all duration-500">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8 border-b border-gray-100 pb-2">
                {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
              </h3>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
                  {searchResults.slice(0, 4).map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`} 
                      onClick={closeSearch}
                      className="group block"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover object-top scale-[1.10] origin-top transition-transform duration-700 ease-in-out group-hover:scale-[1.15]" 
                        />
                      </div>
                      <h4 className="text-[11px] font-bold tracking-widest uppercase text-gray-900 group-hover:text-gray-500 transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1">₹{product.price}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-sm font-serif text-gray-400">No products match your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-[85vw] max-w-[400px] bg-white shadow-2xl p-8 flex flex-col transform transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-16">
            <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-black hover:rotate-90 transition-all">
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col gap-8 flex-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(link.href, e)}
                className="text-[13px] font-bold tracking-[0.15em] uppercase text-gray-900 hover:text-gray-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-100 mt-auto">
            <button 
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleUserClick(e);
              }} 
              className="flex items-center gap-4 text-xs font-bold tracking-[0.15em] uppercase text-gray-900 hover:text-gray-400 transition-colors w-full text-left"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
              {isAuthenticated ? "MY ACCOUNT" : "SIGN IN"}
            </button>
          </div>
        </div>
      </div>

      {/* --- AUTH MODAL --- */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        defaultStep={authModalStep}
        onClose={() => {
          setIsSignInModalOpen(false);
          // Gently reset the step behind the scenes after the closing animation
          setTimeout(() => setAuthModalStep("identifier_only"), 300);
        }} 
      />
    </>
  );
};

export default Navbar;
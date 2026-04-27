import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import CampaignSection from "@/components/CampaignSection";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>The Formal Affair – Luxury Women's Formalwear</title>
        <meta
          name="description"
          content="Discover premium formalwear for confident, independent women. Power suits, elegant blazers, and modern dresses crafted for those who lead."
        />
        <meta
          property="og:title"
          content="The Formal Affair – Luxury Women's Formalwear"
        />
        <meta
          property="og:description"
          content="Where Strength Meets Sophistication. Premium formalwear for confident, independent women."
        />
        <link rel="canonical" href="https://theformalaffair.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <CartSidebar />
        <WishlistSidebar />

        <main>
          <HeroCarousel />
          <ProductGrid />
          
          {/* Showcase Video Section */}
          <section className="relative w-full">
            <div className="relative w-full h-[45vh] min-h-[350px] overflow-hidden">
              {/* Video */}
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/story-showcase.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Burgundy overlay */}
              <div className="absolute inset-0 bg-[#4a0006]/85" />
              
              {/* Centered content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-background border-b-[6px] border-b-transparent" />
                  <span className="text-background text-xs sm:text-sm tracking-[0.3em] uppercase font-light">
                    This Is How We Craft With Love
                  </span>
                </div>
                <h2 className="text-background text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-[0.15em] uppercase">
                  The Formal Affair
                </h2>
              </div>
            </div>
          </section>

          <CampaignSection />
          <AboutSection />
          <Newsletter />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;

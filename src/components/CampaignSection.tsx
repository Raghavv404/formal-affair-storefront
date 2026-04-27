import React from 'react';
import { Link } from 'react-router-dom';

// --- IMPORTS ---
import modelWhite from '@/assets/white-shirt-model-1.png'; 
import modelPink1 from '@/assets/pink-shirt-new1.png';
import instagramBg from '@/assets/instagram-bg.png';
import instagramPfp from '@/assets/instagram-pfp.png';

const CampaignSection = () => {
  return (
    // ADDED id="campaign" below so the navbar link works
    <section id="campaign" className="py-24 px-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 font-sans">
          Campaign
        </p>
        <h2 className="text-4xl md:text-5xl font-serif text-[#9e1b32]">The Power Edit</h2>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* --- CARD 1: INSTAGRAM COMMUNITY --- */}
        <a 
          href="https://www.instagram.com/theformalaffairr/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative group overflow-hidden aspect-[3/4] cursor-pointer block shadow-xl"
        >
          <img 
            src={instagramBg} 
            alt="The formal affair" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="w-24 h-24 rounded-full border-[3px] border-white shadow-2xl overflow-hidden mb-4 relative z-10 group-hover:scale-110 transition-transform duration-500">
              <img src={instagramPfp} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-2 drop-shadow-md tracking-wide">
              The formal Affair
            </h3>
            <span className="inline-block text-white/90 text-xs uppercase tracking-[0.2em] border-b border-white/50 pb-1 group-hover:text-white group-hover:border-white transition-colors">
              Join the Community →
            </span>
          </div>
        </a>


        {/* --- CARD 2: SPRING EDIT (Pink Shirt) --- */}
        <div className="relative group overflow-hidden aspect-[3/4]">
          <img 
            src={modelPink1} 
            alt="Elegance Meets Strength" 
            className="w-full h-full object-cover object-top scale-110 transition-transform duration-700 group-hover:scale-125" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <h3 className="font-serif text-2xl lg:text-3xl text-white mb-2">
              Elegance Meets Strength
            </h3>
            <Link to="/shop" className="inline-block text-white text-sm tracking-widest border-b border-white pb-1 hover:text-gray-200">
              Shop The Look
            </Link>
          </div>
        </div>


        {/* --- CARD 3: WORKDAY WARDROBE (White Shirt) --- */}
        <div className="relative group overflow-hidden aspect-[3/4] hidden lg:block">
          <img 
            src={modelWhite} 
            alt="Redefine Workday" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <p className="text-sm tracking-[0.3em] uppercase text-white mb-3 font-sans">Spring 2025</p>
            <h3 className="font-serif text-2xl lg:text-3xl text-white mb-4">
              Redefine Your <br /> Workday Wardrobe
            </h3>
            <Link to="/shop" className="inline-block text-white text-sm tracking-widest border-b border-white pb-1 hover:text-gray-200">
              Explore the Edit
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CampaignSection;
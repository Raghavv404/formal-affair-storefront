import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react'; // Added ArrowLeft for the icon
import { Link } from 'react-router-dom'; // Added Link for navigation

// --- IMPORTS ---
import story1 from '@/assets/Our story1.png'; 
import story2 from '@/assets/Our story2.png';
import story3 from '@/assets/Our story3.png';
import story4 from '@/assets/Our story4.png';

const OurStory = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1a1a1a] overflow-x-hidden relative">
      
      {/* --- BACK TO HOME BUTTON --- */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3 text-[#9e1b32] hover:opacity-70 transition-opacity z-50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest text-xs md:text-sm font-semibold">Back to Home</span>
      </Link>

      {/* --- HEADER --- */}
      <div className="text-center pt-24 pb-12 animate-fade-in-up">
        <span className="uppercase tracking-[0.3em] text-xs md:text-sm text-gray-500 mb-4 block">
          The Journey
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-[#9e1b32] mb-4">
          The Formal Affair
        </h1>
        <div className="h-px w-24 bg-[#9e1b32] mx-auto opacity-60"></div>
      </div>

      {/* --- VISUAL STORY STACK (Order: 1 -> 2 -> 3 -> 4) --- */}
      <div className="max-w-6xl mx-auto px-4 pb-24 space-y-8 md:space-y-16">
        
        {/* SLIDE 1 */}
        <div className="w-full shadow-2xl rounded-sm overflow-hidden animate-fade-in-up">
          <img 
            src={story1} 
            alt="The Beginning" 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* SLIDE 2 */}
        <div className="w-full shadow-2xl rounded-sm overflow-hidden hover:scale-[1.01] transition-transform duration-700">
          <img 
            src={story2} 
            alt="Our Community" 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* SLIDE 3 */}
        <div className="w-full shadow-2xl rounded-sm overflow-hidden hover:scale-[1.01] transition-transform duration-700">
          <img 
            src={story3} 
            alt="Our Mission" 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* SLIDE 4 */}
        <div className="w-full shadow-2xl rounded-sm overflow-hidden hover:scale-[1.01] transition-transform duration-700">
          <img 
            src={story4} 
            alt="The Founders" 
            className="w-full h-auto object-cover" 
          />
        </div>

      </div>

      {/* --- FOOTER QUOTE --- */}
      <div className="text-center py-20 px-6 bg-white">
        <Sparkles className="w-8 h-8 text-[#9e1b32] mx-auto mb-6" />
        <h2 className="text-2xl md:text-4xl font-serif italic text-gray-800 max-w-3xl mx-auto leading-relaxed">
          "We envision a world where women don't dress to fit into boxes, but dress to move forward with confidence and calm."
        </h2>
      </div>

    </div>
  );
};

export default OurStory;
import { Instagram, ExternalLink, Sparkles, Award, Heart } from "lucide-react";
import insta1 from "@/assets/insta1.jpeg";
import insta2 from "@/assets/insta2.jpeg";
import insta3 from "@/assets/insta3.jpeg";
import insta4 from "@/assets/insta4.jpeg";
import insta5 from "@/assets/insta5.jpeg";
import herLogo from "@/assets/HER.png"; // Imported the logo

const AboutSection = () => {
  const instagramHighlights = [{
    icon: Sparkles,
    title: "Premium Fabrics",
    desc: "Handpicked luxury materials"
  }, {
    icon: Award,
    title: "Expert Tailoring",
    desc: "Precision in every stitch"
  }, {
    icon: Heart,
    title: "Made in India",
    desc: "Made for the Indian woman"
  }];

  return (
    <section id="about" className="py-24 lg:py-40 bg-secondary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-sans animate-fade-in-up">
            Our Story
          </p>
          <h2 className="section-heading mb-8 animate-fade-in-up animation-delay-200">
            The Story of <br />
            <span className="text-primary">The Formal Affair</span>
          </h2>
          <p className="text-lg lg:text-xl font-serif italic text-foreground/80 mb-8 animate-fade-in-up animation-delay-400">
            "Born from elegance, tailored for leadership."
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story Content */}
          <div className="space-y-6 animate-fade-in-up animation-delay-600">
            <p className="body-text text-muted-foreground">
              The Formal Affair was founded on a simple belief: that women deserve
              formalwear that empowers them to lead with confidence and grace. Our
              designs blend timeless sophistication with modern sensibilities,
              creating pieces that speak to the woman who commands attention in
              every room she enters.
            </p>
            <p className="body-text text-muted-foreground">
              Each garment is meticulously crafted using the finest fabrics and
              techniques, ensuring that every stitch reflects our commitment to
              excellence. From the boardroom to the evening gala, The Formal Affair
              dresses women who are writing their own stories of success.
            </p>
            
            
          </div>

          {/* Highlights Grid */}
          <div className="grid gap-6 animate-fade-in-up animation-delay-800">
            {instagramHighlights.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-border/30">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Preview Section */}
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-border/50 animate-fade-in-up">
          
          {/* HEADER WITH ELEGANT LOGO PLACEMENT */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
              <h3 className="font-serif text-2xl">The Commpunity we built : HER WEEKEND HOBBIES</h3>
              
              {/* Elegant Divider & Logo Container */}
              <div className="flex items-center gap-6">
                <span className="hidden md:block w-px h-8 bg-border/60"></span>
                {/* UPDATED: Increased height to h-16 (approx 64px) for better visibility */}
                <img 
                  src={herLogo} 
                  alt="Her Weekend Hobbies" 
                  className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" 
                />
              </div>
            </div>
            
            <p className="text-muted-foreground text-center">
              Follow us for exclusive behind-the-scenes, A place to connect with ambitious women and for scaling yourself 
              <span className="font-medium text-primary">"HER WEEKEND HOBBIES"</span>
            </p>
          </div>
          
          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 mb-12">
            <div className="aspect-square overflow-hidden group cursor-pointer relative">
              <img src={insta1} alt="Glimpse 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            <div className="aspect-square overflow-hidden group cursor-pointer relative">
              <img src={insta2} alt="Glimpse 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            <div className="aspect-square overflow-hidden group cursor-pointer relative">
              <img src={insta3} alt="Glimpse 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            <div className="aspect-square overflow-hidden group cursor-pointer relative">
              <img src={insta4} alt="Glimpse 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            <div className="aspect-square overflow-hidden group cursor-pointer relative hidden md:block">
              <img src={insta5} alt="Glimpse 5" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
          
          <div className="text-center">
            <a href="https://www.instagram.com/herweekendhobbies/" target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent transition-all duration-300">
              <Instagram className="w-4 h-4" />
              Visit Our Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
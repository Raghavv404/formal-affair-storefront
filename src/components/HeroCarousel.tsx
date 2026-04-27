import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";

interface Slide {
  type: "image" | "video";
  src: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const slides: Slide[] = [
  {
    type: "video",
    src: "/videos/fashion-runway.mp4",
    title: "Where Strength Meets Style",
    subtitle: "Cinematic Elegance",
    cta: "Shop the Collection",
    link: "/shop",
  },
  {
    type: "video",
    src: "/videos/fashion-video-2.mp4",
    title: "The Art of Power Dressing",
    subtitle: "New Arrivals",
    cta: "Explore Now",
    link: "/shop",
  },
  {
    type: "image",
    src: heroBanner1,
    title: "Power in Every Stitch",
    subtitle: "The Spring 2025 Collection",
    cta: "Discover Now",
    link: "/shop",
  },
  {
    type: "image",
    src: heroBanner2,
    title: "Elegance Redefined",
    subtitle: "Modern Formalwear for the Bold",
    cta: "View Lookbook",
    link: "/shop",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();

  // Handle slide transitions
  const goToNextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const currentSlideData = slides[currentSlide];
    const currentVideo = videoRefs.current[currentSlide];

    // Pause all other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentSlide) {
        video.pause();
        video.currentTime = 0;
      }
    });

    if (currentSlideData.type === "video" && currentVideo) {
      currentVideo.currentTime = 0;
      const playPromise = currentVideo.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, use timer fallback
          console.log("Video autoplay prevented, using timer");
        });
      }

      const handleEnded = () => goToNextSlide();
      currentVideo.addEventListener("ended", handleEnded);
      
      // Fallback timer in case video doesn't play or end event doesn't fire
      const fallbackTimer = setTimeout(() => {
        if (currentVideo.paused || currentVideo.currentTime === 0) {
          goToNextSlide();
        }
      }, 4000);

      return () => {
        currentVideo.removeEventListener("ended", handleEnded);
        clearTimeout(fallbackTimer);
      };
    } else {
      // For images, use interval
      const interval = setTimeout(goToNextSlide, 3000);
      return () => clearTimeout(interval);
    }
  }, [currentSlide]);

  const handleCTAClick = (link: string) => {
    if (link.startsWith("#")) {
      document.getElementById(link.substring(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(link);
    }
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-foreground/5 z-10" />
            {slide.type === "video" ? (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={slide.src}
                muted
                playsInline
                autoPlay={currentSlide === index}
                loop={false}
                className="w-full h-full object-cover scale-105"
              />
            ) : (
              <img
                src={slide.src}
                alt={slide.title}
                className={`w-full h-full object-cover ${
                  currentSlide === index ? "animate-ken-burns" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-foreground/30 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-background/50 to-transparent z-20" />
      <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-l from-background/50 to-transparent z-20" />

      {/* Content */}
      <div className="relative z-20 h-full min-h-[100svh] flex flex-col justify-center lg:justify-end pb-32 lg:pb-40 pt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div
            className={`transition-all duration-700 ease-out ${
              isAnimating
                ? "opacity-0 translate-y-12"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-px bg-background/60" />
              <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-background/90 font-sans font-light">
                {slides[currentSlide].subtitle}
              </p>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-background mb-10 max-w-4xl leading-[1.1] tracking-tight">
              {slides[currentSlide].title}
            </h1>
            <button
              onClick={() => handleCTAClick(slides[currentSlide].link)}
              className="group relative overflow-hidden bg-background text-foreground px-10 py-4 text-sm tracking-[0.2em] uppercase font-sans transition-all duration-500 hover:bg-background/90"
            >
              <span className="relative z-10 flex items-center gap-3">
                {slides[currentSlide].cta}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </span>
            </button>
          </div>
        </div>

        {/* Elegant Slide Indicators */}
        <div className="absolute bottom-12 left-6 sm:left-8 lg:left-12 flex items-center gap-6">
          <span className="text-background/60 text-sm font-sans tracking-wider">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setIsAnimating(false);
                  }, 500);
                }}
                className={`h-0.5 transition-all duration-500 ${
                  currentSlide === index
                    ? "bg-background w-12"
                    : "bg-background/30 w-6 hover:bg-background/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <span className="text-background/40 text-sm font-sans tracking-wider">
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 right-6 sm:right-8 lg:right-12 flex flex-col items-center gap-3">
          <span className="text-background/60 text-xs tracking-[0.3em] uppercase font-sans [writing-mode:vertical-lr]">
            Scroll
          </span>
          <div className="w-px h-12 bg-background/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-background animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
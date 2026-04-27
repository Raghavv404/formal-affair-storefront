import { Instagram } from "lucide-react";

const InstagramSection = () => {
  return (
    <section className="bg-gradient-to-br from-secondary via-secondary to-muted py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <a 
          href="https://www.instagram.com/theformalaffairr/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-lg sm:text-xl tracking-wide">@theformalaffairr</span>
          </div>
          <div className="h-px w-12 bg-border hidden sm:block" />
          <p className="text-muted-foreground text-sm sm:text-base text-center sm:text-left">
            Follow us for glimpses, behind-the-scenes & more
          </p>
        </a>
      </div>
    </section>
  );
};

export default InstagramSection;

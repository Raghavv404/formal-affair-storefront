import { X, Ruler } from "lucide-react";
import { useEffect, useState } from "react";

const sizeDataCm = [
  { measurement: "Bust", xs: "81-84", s: "86-89", m: "91-94", l: "97-102", xl: "107-112" },
  { measurement: "Waist", xs: "61-64", s: "66-69", m: "71-74", l: "79-84", xl: "89-94" },
  { measurement: "Hip", xs: "89-92", s: "94-97", m: "99-102", l: "107-112", xl: "117-122" },
];

const sizeDataInches = [
  { measurement: "Bust", xs: "32-33", s: "34-35", m: "36-37", l: "38-40", xl: "42-44" },
  { measurement: "Waist", xs: "24-25", s: "26-27", m: "28-29", l: "31-33", xl: "35-37" },
  { measurement: "Hip", xs: "35-36", s: "37-38", m: "39-40", l: "42-44", xl: "46-48" },
];

const SizeTable = ({ data, unit }: { data: any[]; unit: string }) => (
  <table className="w-full border-collapse text-sm">
    <thead>
      <tr className="bg-muted/50 text-foreground">
        <th className="py-3 px-4 text-left font-medium">Size ({unit})</th>
        <th className="py-3 px-4 text-center font-medium">XS</th>
        <th className="py-3 px-4 text-center font-medium">S</th>
        <th className="py-3 px-4 text-center font-medium">M</th>
        <th className="py-3 px-4 text-center font-medium">L</th>
        <th className="py-3 px-4 text-center font-medium">XL</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr 
          key={row.measurement} 
          className={`border-b border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
        >
          <td className="py-3 px-4 font-medium text-foreground">{row.measurement}</td>
          <td className="py-3 px-4 text-center text-muted-foreground">{row.xs}</td>
          <td className="py-3 px-4 text-center text-muted-foreground">{row.s}</td>
          <td className="py-3 px-4 text-center text-muted-foreground">{row.m}</td>
          <td className="py-3 px-4 text-center text-muted-foreground">{row.l}</td>
          <td className="py-3 px-4 text-center text-muted-foreground">{row.xl}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const SizeGuideModal = () => {
  // INTERNAL STATE: The modal now controls itself!
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<"cm" | "inches">("cm");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* 1. THE TRIGGER BUTTON (Click this to open) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 underline underline-offset-4 transition-colors"
      >
        <Ruler className="w-4 h-4" />
        Size Guide
      </button>

      {/* 2. THE MODAL (Only shows if isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop (Click to close) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white">
              <div className="w-full text-center">
                <h2 className="font-serif text-2xl mb-1">Women's Size Guide</h2>
                <p className="text-sm text-muted-foreground">Find your perfect fit</p>
              </div>
              
              {/* CLOSE BUTTON (Now works!) */}
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 bg-white">
              
              {/* DIAGRAM SECTION (Kept your original design) */}
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
                <div className="relative w-40 h-60 flex-shrink-0">
                  <svg viewBox="0 0 120 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="60" cy="18" rx="14" ry="16" className="stroke-foreground fill-muted/20" strokeWidth="1.5"/>
                    <path d="M54 34 L54 42 L66 42 L66 34" className="stroke-foreground fill-muted/20" strokeWidth="1.5"/>
                    <path d="M40 42 Q35 55 38 75 Q40 95 45 110 L75 110 Q80 95 82 75 Q85 55 80 42 Z" className="stroke-foreground fill-muted/20" strokeWidth="1.5"/>
                    <path d="M40 42 Q25 44 20 52" className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M80 42 Q95 44 100 52" className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M20 52 Q18 75 22 100" className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M100 52 Q102 75 98 100" className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M45 110 Q43 140 42 175" className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M75 110 Q77 140 78 175" className="stroke-foreground" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="15" y1="58" x2="105" y2="58" className="stroke-black" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <circle cx="15" cy="58" r="2" className="fill-black"/>
                    <circle cx="105" cy="58" r="2" className="fill-black"/>
                    <line x1="25" y1="80" x2="95" y2="80" className="stroke-black" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <circle cx="25" cy="80" r="2" className="fill-black"/>
                    <circle cx="95" cy="80" r="2" className="fill-black"/>
                    <line x1="30" y1="105" x2="90" y2="105" className="stroke-black" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <circle cx="30" cy="105" r="2" className="fill-black"/>
                    <circle cx="90" cy="105" r="2" className="fill-black"/>
                  </svg>
                </div>
                
                <div className="flex flex-col gap-5 text-sm max-w-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
                    <div>
                      <p className="font-bold text-foreground">Bust</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">Measure around the fullest part of your bust, keeping the tape horizontal.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
                    <div>
                      <p className="font-bold text-foreground">Waist</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">Measure around your natural waistline, the narrowest part of your torso.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
                    <div>
                      <p className="font-bold text-foreground">Hip</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">Measure around the fullest part of your hips, about 8" below your waist.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABS */}
              <div className="mb-6">
                <div className="bg-gray-100 p-1 rounded-md inline-flex w-full">
                  <button
                    onClick={() => setUnit("cm")}
                    className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all ${
                      unit === "cm" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                  <button
                    onClick={() => setUnit("inches")}
                    className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all ${
                      unit === "inches" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Inches (in)
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <SizeTable data={unit === "cm" ? sizeDataCm : sizeDataInches} unit={unit === "cm" ? "cm" : "in"} />
              </div>

              {/* FOOTER TIP */}
              <div className="mt-6 p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                  <Ruler className="w-3 h-3" />
                  Tip: When between sizes, we recommend sizing up for a relaxed fit or down for a tailored look.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeGuideModal;
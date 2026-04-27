import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Grid3x3, LayoutGrid, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { products as localProducts } from "@/data/products"; // Added local products for image merging

const categories = ["View All", "Shirts"];

const Shop = () => {
  const [viewMode, setViewMode] = useState<"grid-2" | "grid-4">("grid-4");
  const [selectedCategory, setSelectedCategory] = useState("View All");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sorting States
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popularity"); // Default to popularity
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- MAX BRAIN DATABASE MERGE LOGIC ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      let query = supabase.from("products").select("*");

      // 1. Handle Category Filtering
      if (selectedCategory !== "View All") {
        query = query.ilike("category", `%shirt%`);
      }

      // 2. Handle Sorting Logic
      if (sortBy === "price-low") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price-high") {
        query = query.order("price", { ascending: false });
      } else if (sortBy === "popularity") {
        // Puts Best Sellers (is_bestseller flag) at the top
        query = query.order("is_bestseller", { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        // MERGE LOGIC: Database handles data, Local handles images
        const mergedData = data.map((dbItem) => {
          const dbName = dbItem.name.toLowerCase();
          let matchingLocal;

          // Smart matching based on color/name
          if (dbName.includes("yellow")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("yellow"));
          else if (dbName.includes("pink")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("pink"));
          else if (dbName.includes("green")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("green"));
          else if (dbName.includes("blue")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("blue"));
          else matchingLocal = localProducts.find(p => p.id === "1" || p.name.toLowerCase().includes("white"));

          if (!matchingLocal) matchingLocal = localProducts.find(p => p.id === dbItem.id?.toString());

          return {
            ...matchingLocal, // Fallback for nested objects (like story/fabric)
            ...dbItem,        // Supabase DB is the ultimate boss (overrides name, price, etc.)
            image: matchingLocal?.image || dbItem.image, // Secure the local Vite image
            images: matchingLocal?.images || [],
            // Ensure UI flags match the database exactly
            is_bestseller: dbItem.is_bestseller,
            isNew: dbItem.is_new 
          };
        });

        setProducts(mergedData);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [selectedCategory, sortBy]);

  return (
    <div className="bg-white min-h-screen text-black selection:bg-black selection:text-white">
      <Navbar />
      <CartSidebar />
      <WishlistSidebar />

      <main className="pt-24 lg:pt-32 pb-20">
        
        {/* HEADER */}
        <div className="text-center mb-10 px-4">
          <h1 className="text-4xl lg:text-5xl font-serif mb-6 tracking-tight">The Collection</h1>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-xs lg:text-sm uppercase tracking-widest font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pb-1 border-b-2 transition-colors ${selectedCategory === cat ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* STICKY FILTER BAR */}
        <div className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur-sm border-t border-b border-gray-100 px-4 lg:px-8 py-4 mb-8">
            <div className="flex justify-between items-center max-w-[1920px] mx-auto">
                
                {/* SORT DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)} 
                    className="flex items-center gap-2 text-[10px] lg:text-xs uppercase tracking-widest hover:text-gray-500 transition-colors"
                  >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>{sortBy === 'popularity' ? 'Popularity' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isSortOpen && (
                    <div className="absolute top-full left-0 mt-6 w-56 bg-white border border-gray-100 shadow-xl py-2 z-50 flex flex-col">
                       <button 
                         onClick={() => { setSortBy("popularity"); setIsSortOpen(false); }} 
                         className={`px-5 py-3 text-left text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-colors ${sortBy === 'popularity' ? 'font-bold text-black' : 'text-gray-500'}`}
                       >
                         Popularity
                       </button>
                       <button 
                         onClick={() => { setSortBy("price-low"); setIsSortOpen(false); }} 
                         className={`px-5 py-3 text-left text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-colors ${sortBy === 'price-low' ? 'font-bold text-black' : 'text-gray-500'}`}
                       >
                         Price: Low to High
                       </button>
                       <button 
                         onClick={() => { setSortBy("price-high"); setIsSortOpen(false); }} 
                         className={`px-5 py-3 text-left text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-colors ${sortBy === 'price-high' ? 'font-bold text-black' : 'text-gray-500'}`}
                       >
                         Price: High to Low
                       </button>
                    </div>
                  )}
                </div>

                {/* ITEM COUNT */}
                <span className="hidden md:block text-xs text-gray-400 uppercase tracking-widest">
                    {products.length} Items
                </span>

                {/* VIEW TOGGLES */}
                <div className="flex items-center gap-4 text-gray-400">
                    <button 
                      onClick={() => setViewMode("grid-2")} 
                      className={`hover:text-black transition-colors ${viewMode === "grid-2" ? "text-black" : ""}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setViewMode("grid-4")} 
                      className={`hidden md:flex hover:text-black transition-colors ${viewMode === "grid-4" ? "text-black" : ""}`}
                    >
                        <Grid3x3 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="px-2 lg:px-4 max-w-[1920px] mx-auto">
            {isLoading ? (
              <div className="text-center py-20 text-xs uppercase tracking-[0.2em] animate-pulse">Loading Collection...</div>
            ) : (
              <div className={`grid gap-x-1 gap-y-10 lg:gap-x-4 lg:gap-y-16 transition-all duration-500 ease-in-out ${viewMode === "grid-2" ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
                  {products.map((product) => (
                      <ProductCard key={product.id} {...product} />
                  ))}
              </div>
            )}
            
            {!isLoading && products.length === 0 && (
                <div className="text-center py-20 text-gray-400 uppercase tracking-widest text-sm">
                  No items found.
                </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
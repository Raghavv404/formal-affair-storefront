import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Plus, Minus, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import Footer from "@/components/Footer";
import ProductReviews from "@/src/components/ui/ProductReviews"; 
import { products as localProducts, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import SizeGuideModal from "@/components/SizeGuideModal";
import { supabase } from "@/lib/supabase"; 

const Accordion = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left group">
        <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-900">{title}</span>
        <span className="text-gray-400 group-hover:text-black transition-colors">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="text-[13px] text-gray-600 font-light leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]); 
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  // --- SMART RANDOMIZER LOGIC ---
  const stats = useMemo(() => {
    const seed = id ? parseInt(id) || 1 : 1;
    const randomRating = (4.5 + (seed * 0.13) % 0.5).toFixed(1);
    const randomCount = 10 + (seed * 7) % 11;
    return { rating: randomRating, count: randomCount };
  }, [id]);

  // --- MAX BRAIN SUPABASE MERGE LOGIC ---
  useEffect(() => {
    const fetchAndMergeData = async () => {
      window.scrollTo(0, 0);

      const { data: dbProduct } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (dbProduct) {
        const dbName = dbProduct.name.toLowerCase();
        
        let localData;
        if (dbName.includes("yellow")) localData = localProducts.find(p => p.name.toLowerCase().includes("yellow"));
        else if (dbName.includes("pink")) localData = localProducts.find(p => p.name.toLowerCase().includes("pink"));
        else if (dbName.includes("green")) localData = localProducts.find(p => p.name.toLowerCase().includes("green"));
        else if (dbName.includes("blue")) localData = localProducts.find(p => p.name.toLowerCase().includes("blue"));
        else localData = localProducts.find(p => p.id === "1" || p.name.toLowerCase().includes("white"));

        if (!localData) localData = localProducts.find(p => p.id === id);
        
        setProduct({
          ...localData, 
          ...dbProduct, 
          image: localData?.image || dbProduct.image,
          images: localData?.images && localData.images.length > 0 ? localData.images : [dbProduct.image],
          is_bestseller: dbProduct.is_bestseller,
          isNew: dbProduct.is_new
        } as Product);

        const { data: related } = await supabase
          .from("products")
          .select("*")
          .neq("id", id)
          .limit(3);
          
        if (related) {
          const mergedRelated = related.map(dbItem => {
             const relatedDbName = dbItem.name.toLowerCase();
             let matchingLocal;

             if (relatedDbName.includes("yellow")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("yellow"));
             else if (relatedDbName.includes("pink")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("pink"));
             else if (relatedDbName.includes("green")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("green"));
             else if (relatedDbName.includes("blue")) matchingLocal = localProducts.find(p => p.name.toLowerCase().includes("blue"));
             else matchingLocal = localProducts.find(p => p.id === "1" || p.name.toLowerCase().includes("white"));
             
             if (!matchingLocal) matchingLocal = localProducts.find(p => p.id === dbItem.id?.toString());
             
             return { 
               ...matchingLocal, 
               ...dbItem, 
               image: matchingLocal?.image || dbItem.image,
               is_bestseller: dbItem.is_bestseller,
               isNew: dbItem.is_new
             };
          });
          setRelatedProducts(mergedRelated);
        }
      } else {
        const found = localProducts.find(p => p.id === id);
        if (found) {
          setProduct(found);
          setRelatedProducts(localProducts.filter(p => p.id !== id).slice(0, 3));
        }
      }
    };

    if (id) fetchAndMergeData();
  }, [id]);

  if (!product) return <div className="min-h-screen flex items-center justify-center tracking-widest uppercase text-xs animate-pulse">Loading Collection...</div>;

  const isWishlisted = isInWishlist(product.id);
  const formatPrice = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem({ 
      id: product.id, 
      name: `${product.name} - ${selectedSize}`, 
      price: product.price, 
      image: product.image 
    } as any);
    toast.success("Added to Bag", { duration: 1500 });
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist", { duration: 1500 });
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image } as any);
      toast.success("Added to wishlist", { duration: 1500 });
    }
  };

  return (
    <div className="bg-white min-h-screen text-black selection:bg-black selection:text-white">
      <Navbar />
      <CartSidebar />
      <WishlistSidebar />

      <main className="pt-24 lg:pt-32 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 px-4 md:px-8">
          
          {/* LEFT: IMAGE GRID */}
          <div className="w-full lg:w-[65%]">
            <div className="hidden md:grid grid-cols-2 gap-3">
              {(product.images?.length > 0 ? product.images : [product.image, product.image]).map((img, i) => (
                <div key={i} className="bg-gray-50 aspect-[3/4] overflow-hidden relative group cursor-zoom-in">
                   <img 
                     src={img} 
                     alt={product.name} 
                     className="w-full h-full object-cover object-top scale-[1.10] origin-top transition-transform duration-700 ease-out group-hover:scale-[1.20]" 
                   />
                </div>
              ))}
            </div>

            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-2 no-scrollbar -mx-4 px-4 pb-4">
              {(product.images?.length > 0 ? product.images : [product.image, product.image]).map((img, i) => (
                <div key={i} className="w-[85vw] shrink-0 snap-center bg-gray-50 aspect-[3/4] overflow-hidden">
                   <img src={img} alt="" className="w-full h-full object-cover object-top scale-[1.10] origin-top" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="w-full lg:w-[35%] relative">
            <div className="lg:sticky lg:top-28 pb-12">
              <Link to="/shop" className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.5} /> 
                Back to Collection
              </Link>

              <h1 className="text-2xl lg:text-3xl font-normal tracking-wide uppercase mb-3 text-gray-900 leading-tight italic">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl font-medium">{formatPrice(product.price)}</span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-gray-400 line-through text-sm">{formatPrice(product.mrp)}</span>
                )}
                <div className="flex items-center ml-auto">
                  <Star className="w-4 h-4 fill-black" />
                  <span className="text-xs font-bold ml-1 uppercase tracking-tighter">
                    {stats.rating} ({stats.count})
                  </span>
                </div>
              </div>

              {/* DYNAMIC COLOR DOTS RESTORED */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full border border-gray-300 bg-white shadow-sm"></div>
                  {product.name.toLowerCase().includes("blue") && <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200 shadow-sm"></div>}
                  {product.name.toLowerCase().includes("pink") && <div className="w-3 h-3 rounded-full bg-pink-100 border border-pink-200 shadow-sm"></div>}
                  {product.name.toLowerCase().includes("green") && <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200 shadow-sm"></div>}
                  {product.name.toLowerCase().includes("yellow") && <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200 shadow-sm"></div>}
                </div>
                <span className="text-[11px] text-gray-500 uppercase tracking-widest">{product.fabric?.title || "Cotton"}</span>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-widest">Select Size</span>
                  <SizeGuideModal />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {(product.availableSizes || ["XS", "S", "M", "L", "XL"]).map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 min-w-[3.5rem] px-4 text-[11px] tracking-wider transition-all border ${
                        selectedSize === size 
                          ? "border-black bg-black text-white font-medium" 
                          : "border-gray-200 hover:border-black text-gray-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mb-10">
                <button 
                  onClick={handleAddToBag}
                  className="flex-1 bg-black text-white py-4 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors"
                >
                  Add to Bag
                </button>
                <button 
                  onClick={handleWishlist}
                  className="w-14 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-black" : "text-gray-900"}`} strokeWidth={1} />
                </button>
              </div>

              {/* ACCORDIONS */}
              <div className="border-t border-gray-200">
                <Accordion title="Description & Style" defaultOpen={true}>
                    <div className="space-y-4">
                      <p>{product.description}</p>
                      <div className="bg-gray-50 p-4 border border-gray-100">
                        <p className="font-serif text-lg mb-2 text-black">{product.story?.emoji} {product.story?.title}</p>
                        <p className="mb-2 italic">"{product.story?.quote}"</p>
                      </div>
                    </div>
                </Accordion>

                <Accordion title="Size & Fit">
                  <p className="font-medium text-black mb-3 text-[11px] uppercase tracking-widest">
                    {product.fit?.model || "Model is 5'9\" and wears size S"}
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 marker:text-gray-400">
                    {(product.fit?.notes || ["Fits true to size", "Take your normal size", "Designed for a relaxed fit"]).map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </Accordion>

                <Accordion title="Materials & Fabric">
                  <p className="font-medium text-black mb-2 uppercase tracking-widest text-[11px]">{product.fabric?.title || "Premium Formal Fabric"}</p>
                  <ul className="list-disc pl-4 space-y-1.5 marker:text-gray-400">
                    {product.fabric?.points ? product.fabric.points.map((pt, i) => <li key={i}>{pt}</li>) : (
                      <>
                        <li>Breathable, lightweight, and comfortable for all-day wear</li>
                        <li>Relaxed fit with clean structure</li>
                      </>
                    )}
                  </ul>
                </Accordion>

                <Accordion title="Care Guide">
                  <ul className="space-y-2">
                    {(product.washCare || ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"]).map((care, i) => (
                       <li key={i} className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                         {care}
                       </li>
                    ))}
                  </ul>
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-20 px-4 md:px-8">
          <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase mb-10 text-center">Complete The Look</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
            {relatedProducts.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="group relative">
                {/* Ensure New/Bestseller tags show on related products too */}
                {item.is_bestseller && (
                  <span className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                    Best Seller
                  </span>
                )}
                {!item.is_bestseller && item.isNew && (
                  <span className="absolute top-2 left-2 z-10 bg-white text-black text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
                    New In
                  </span>
                )}
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover scale-[1.10] origin-top transition-transform duration-500 group-hover:scale-[1.15]" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-1">{item.name}</h4>
                <p className="text-[10px] text-gray-500">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 border-t border-gray-100 mt-20">
          <ProductReviews productId={product.id} />
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default ProductDetail;
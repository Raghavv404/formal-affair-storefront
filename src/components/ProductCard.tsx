import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/data/products";
import { toast } from "sonner";

interface ProductCardProps extends Product {
  priority?: boolean;
}

const ProductCard = (product: ProductCardProps) => {
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  const isWishlisted = isInWishlist(product.id);
  
  // Convert name to lowercase so it always matches the database text perfectly
  const productName = product.name?.toLowerCase() || "";

  // Calculate discount percentage
  const discountPercentage = product.mrp && product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist", { duration: 1500 });
    } else {
      addToWishlist({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image 
      } as any);
      toast.success("Added to wishlist", { duration: 1500 });
    }
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({ 
      id: product.id, 
      name: `${product.name} - ${size}`, 
      price: product.price, 
      image: product.image 
    } as any);
    
    toast.success(`${product.name} (Size ${size}) added to bag`, {
      duration: 1500,
    });
    
    setIsQuickAddOpen(false);
  };

  const toggleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickAddOpen(!isQuickAddOpen);
  };

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-top scale-[1.10] origin-top transition-transform duration-700 ease-in-out group-hover:scale-[1.15]"
          />
          
          {/* LABELS SECTION */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.is_bestseller && (
              <span className="bg-black text-white px-2 py-1 text-[9px] uppercase tracking-[0.2em] font-bold">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] uppercase tracking-widest font-medium text-gray-900 shadow-sm">
                New Now
              </span>
            )}
          </div>

          {/* WISHLIST BUTTON */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 text-black transition-transform hover:scale-110 active:scale-95 z-10"
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-black" : ""}`}
              strokeWidth={1.5}
            />
          </button>

          {/* QUICK ADD BUTTON / SIZE SELECTOR */}
          <div className="absolute inset-x-0 bottom-0 z-[30] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-3">
            {!isQuickAddOpen ? (
              <button
                onClick={toggleQuickAdd}
                className="w-full bg-white/95 backdrop-blur-md text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3 h-3" strokeWidth={2} /> Quick Add
              </button>
            ) : (
              <div className="bg-white p-3 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest">Select Size</span>
                  <button onClick={toggleQuickAdd} className="text-gray-400 hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-center gap-1.5">
                  {(product.availableSizes || ["XS", "S", "M", "L", "XL"]).map(size => (
                    <button
                      key={size}
                      onClick={(e) => handleSizeSelect(e, size)}
                      className="h-8 min-w-[2.2rem] px-1 border border-gray-200 text-[10px] font-medium hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-4 space-y-1.5">
          <h3 className="text-sm font-normal text-gray-900 leading-none uppercase tracking-tight line-clamp-1">
            {product.name}
          </h3>
          
          {/* ELEGANT DISCOUNT DISPLAY */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 font-medium">₹{product.price}</span>
            {discountPercentage > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-[10px] font-medium text-amber-700 tracking-wider">
                  ({discountPercentage}% OFF)
                </span>
              </>
            )}
          </div>
          
          {/* BULLETPROOF DYNAMIC COLOR DOTS */}
          <div className="flex gap-1 pt-1">
             <div className="w-3 h-3 rounded-full border border-gray-300 bg-white shadow-sm"></div>
             {productName.includes("blue") && <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200 shadow-sm"></div>}
             {productName.includes("pink") && <div className="w-3 h-3 rounded-full bg-pink-100 border border-pink-200 shadow-sm"></div>}
             {productName.includes("green") && <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200 shadow-sm"></div>}
             {productName.includes("yellow") && <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200 shadow-sm"></div>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
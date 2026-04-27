import { useState } from "react";
// FIX 1: Added 'Heart' to the import list so the system knows what it is!
import { X, Trash2, ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { toast } from "sonner";

const WishlistSidebar = () => {
  // FIX 2: Swapped 'setIsOpen' for 'toggleWishlist' to match your actual Context
  const { isOpen, toggleWishlist, items, removeItem } = useWishlist();
  const { addItem } = useCart();
  
  const [sizePromptId, setSizePromptId] = useState<string | null>(null);

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const handleSizeSelectAndAdd = (item: any, size: string) => {
    addItem({ 
      id: item.id, 
      name: `${item.name} - ${size}`, 
      price: item.price, 
      image: item.image 
    } as any);
    
    toast.success("Added to Bag");
    removeItem(item.id); 
    setSizePromptId(null);
  };

  return (
    <>
      {/* BACKGROUND OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleWishlist}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-[80] transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 flex items-center gap-2">
            <Heart className="w-4 h-4 fill-[#9e1b32] text-[#9e1b32]" />
            Wishlist ({items.length})
          </h2>
          <button onClick={toggleWishlist} className="text-gray-400 hover:text-black hover:rotate-90 transition-all">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <Heart className="w-12 h-12 text-gray-200" strokeWidth={1} />
              <p className="text-xs uppercase tracking-widest text-gray-500">Your wishlist is empty</p>
              <button 
                onClick={toggleWishlist}
                className="mt-4 text-[10px] font-bold tracking-widest uppercase border-b border-black pb-1 hover:text-gray-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const originalProduct = products.find(p => p.id === item.id);
              const availableSizes = originalProduct?.availableSizes || ["XS", "S", "M", "L", "XL"];

              return (
                <div key={item.id} className="flex gap-4 group">
                  
                  {/* Image */}
                  <Link to={`/product/${item.id}`} onClick={toggleWishlist} className="w-24 h-32 shrink-0 bg-gray-50 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-top scale-[1.10] origin-top transition-transform duration-500 group-hover:scale-[1.15]" 
                    />
                  </Link>
                  
                  {/* Details */}
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${item.id}`} onClick={toggleWishlist} className="text-[11px] font-bold tracking-widest uppercase text-gray-900 hover:text-gray-500 transition-colors pr-4">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-[#9e1b32] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    <p className="text-sm font-medium mt-2">{formatPrice(item.price)}</p>

                    <div className="mt-auto pt-4">
                      {sizePromptId === item.id ? (
                        /* INLINE SIZE SELECTOR */
                        <div className="animate-fade-in">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Select Size:</p>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {availableSizes.map(size => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelectAndAdd(item, size)}
                                className="h-8 min-w-[2rem] px-2 border border-gray-200 text-[10px] tracking-wider hover:border-black hover:bg-black hover:text-white transition-all"
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                          <button 
                            onClick={() => setSizePromptId(null)} 
                            className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-2"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        /* ADD TO CART BUTTON */
                        <button
                          onClick={() => setSizePromptId(item.id)}
                          className="w-full bg-[#9e1b32] text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingBag className="w-3 h-3" strokeWidth={2} /> Add to Bag
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;
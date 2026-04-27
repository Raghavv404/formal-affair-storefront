import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const CartSidebar = () => {
  const navigate = useNavigate();
  // Using your existing context function names: closeCart, updateQuantity, etc.
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* BACKGROUND OVERLAY */}
      <div
        className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[80] shadow-2xl transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* HEADER - Zara/Mango Style */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase">Shopping Bag</h2>
              <span className="text-[10px] text-gray-400 font-sans tracking-widest">
                ({items.reduce((acc, item) => acc + item.quantity, 0)} ITEMS)
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:rotate-90 transition-all duration-300"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* CART ITEMS */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-100" strokeWidth={1} />
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Your bag is empty</p>
                <button 
                  onClick={closeCart} 
                  className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 transition-colors"
                >
                  Discover Collection
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-5 group"
                  >
                    {/* IMAGE WITH VIRTUAL CROP */}
                    <div className="w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top scale-[1.10] origin-top transition-transform duration-700 group-hover:scale-[1.15]"
                      />
                    </div>

                    <div className="flex-1 flex flex-col py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          {/* LUXURY TYPOGRAPHY: Splits name and size */}
                          <h3 className="text-[11px] font-bold uppercase tracking-widest mb-1 leading-tight pr-4">
                            {item.name.split(' - ')[0]}
                          </h3>
                          {item.name.includes(' - ') && (
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                              Size: {item.name.split(' - ')[1]}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* QUANTITY SELECTOR */}
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-400" />
                          </button>
                          <span className="px-3 text-[10px] font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-8 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Subtotal</span>
                <span className="text-xl font-medium">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
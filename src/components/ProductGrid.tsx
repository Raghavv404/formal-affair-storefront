import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products, getRandomProduct, Product } from "@/data/products";

const ProductGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  
  const displayedProducts = showAll ? products : products.slice(0, 3);

  const handleDiscover = () => {
    const randomProduct = getRandomProduct();
    setFeaturedProduct(randomProduct);
    // Auto-hide after 5 seconds
    setTimeout(() => setFeaturedProduct(null), 5000);
  };

  return (
    <section id="collection" className="py-20 lg:py-32 bg-background relative">
      {/* Featured Product Popup */}
      {featuredProduct && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-in-right">
          <div className="bg-background shadow-2xl border border-border p-4 max-w-xs">
            <p className="text-xs tracking-widest uppercase text-primary mb-2 font-sans">✨ Discover This</p>
            <div className="flex gap-4">
              <img 
                src={featuredProduct.image} 
                alt={featuredProduct.name}
                className="w-20 h-24 object-cover"
              />
              <div>
                <h4 className="font-serif text-sm mb-1">{featuredProduct.name}</h4>
                <p className="font-sans text-sm font-medium text-primary">
                  ₹{featuredProduct.price.toLocaleString()}
                </p>
                <button 
                  onClick={() => setFeaturedProduct(null)}
                  className="text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-sans">
            The Collection
          </p>
          <h2 className="section-heading mb-6">New Arrivals</h2>
          <button 
            onClick={handleDiscover}
            className="btn-outline text-xs py-2 px-6 animate-float"
          >
            ✨ Discover Something New
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          {!showAll && products.length > 3 && (
            <button 
              onClick={() => setShowAll(true)}
              className="btn-outline"
            >
              View All ({products.length} Products) →
            </button>
          )}
          {showAll && (
            <button 
              onClick={() => setShowAll(false)}
              className="btn-outline"
            >
              Show Less
            </button>
          )}
          <button 
            onClick={() => navigate('/shop')}
            className="btn-primary"
          >
            Shop Full Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
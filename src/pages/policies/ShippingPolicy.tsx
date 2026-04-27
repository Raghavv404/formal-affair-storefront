import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Truck, Package, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import Footer from "@/components/Footer";

const ShippingPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Shipping & Delivery Policy – The Formal Affair</title>
        <meta name="description" content="Learn about our shipping methods, delivery times, and charges" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <CartSidebar />
        <WishlistSidebar />

        <main className="pt-24 lg:pt-32 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="section-heading mb-8">Shipping & Delivery</h1>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              {/* Shipping Highlights */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-6 text-center">
                  <Truck className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-serif text-sm mb-1">Free Shipping</h3>
                  <p className="text-xs text-muted-foreground">On orders above ₹2,000</p>
                </div>
                <div className="bg-muted/50 p-6 text-center">
                  <Package className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-serif text-sm mb-1">Secure Packaging</h3>
                  <p className="text-xs text-muted-foreground">Premium gift-ready packaging</p>
                </div>
                <div className="bg-muted/50 p-6 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-serif text-sm mb-1">Pan India</h3>
                  <p className="text-xs text-muted-foreground">Delivery across India</p>
                </div>
              </div>

              <section>
                <h2 className="font-serif text-xl mb-4">Delivery Timelines</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 border border-border">
                    <span className="text-sm">Metro Cities (Delhi, Mumbai, Bangalore, etc.)</span>
                    <span className="text-sm font-medium">3-5 Business Days</span>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-border">
                    <span className="text-sm">Tier 2 Cities</span>
                    <span className="text-sm font-medium">5-7 Business Days</span>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-border">
                    <span className="text-sm">Remote Areas</span>
                    <span className="text-sm font-medium">7-10 Business Days</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Shipping Charges</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-primary/5 border border-primary/20">
                    <span className="text-sm">Orders above ₹2,000</span>
                    <span className="text-sm font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-border">
                    <span className="text-sm">Orders below ₹2,000</span>
                    <span className="text-sm font-medium">₹99</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Order Processing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Orders are processed within <strong>24-48 hours</strong> of placement (excluding weekends and holidays). 
                  You will receive a confirmation email with tracking details once your order has been shipped.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Tracking Your Order</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once your order is shipped, you'll receive an email and SMS with the tracking number and link. 
                  You can also track your order by logging into your account and visiting the Order History section.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Delivery Attempts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our courier partners will make up to <strong>3 delivery attempts</strong>. If the package is undelivered after all attempts, 
                  it will be returned to us. In such cases, shipping charges (if applicable) may not be refunded.
                </p>
              </section>

              <section className="bg-muted/50 p-6 rounded-lg">
                <h2 className="font-serif text-xl mb-4">Need Help?</h2>
                <p className="text-muted-foreground">
                  For shipping-related queries, please contact us at{" "}
                  <a href="mailto:support@theformalaffair.com" className="text-foreground underline">
                    support@theformalaffair.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ShippingPolicy;

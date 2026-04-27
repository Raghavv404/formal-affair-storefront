import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import Footer from "@/components/Footer";

const CancellationPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation Policy – The Formal Affair</title>
        <meta name="description" content="Learn about our order cancellation policy and time limits" />
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

            <h1 className="section-heading mb-8">Cancellation Policy</h1>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              {/* Highlight Box */}
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="font-serif text-xl m-0">Cancellation Window</h2>
                </div>
                <p className="text-muted-foreground m-0">
                  Orders can be cancelled within <strong className="text-foreground">12 hours</strong> of placing the order. 
                  After this window, cancellation requests may not be accepted if the order has been processed for shipping.
                </p>
              </div>

              <section>
                <h2 className="font-serif text-xl mb-4">How to Cancel an Order</h2>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li>Log in to your account and navigate to "Order History"</li>
                  <li>Find the order you wish to cancel</li>
                  <li>Click the "Cancel Order" button if available (within 12-hour window)</li>
                  <li>Select the reason for cancellation</li>
                  <li>Confirm your cancellation request</li>
                </ol>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Cancellation Timeline</h2>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 border border-border">
                    <div className="w-24 shrink-0">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">0-12 Hours</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Free Cancellation</p>
                      <p className="text-sm text-muted-foreground">Full refund within 3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 border border-border">
                    <div className="w-24 shrink-0">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">12-24 Hours</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Conditional</p>
                      <p className="text-sm text-muted-foreground">Subject to order processing status</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 border border-border">
                    <div className="w-24 shrink-0">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">After Shipped</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">Not Cancellable</p>
                      <p className="text-sm text-muted-foreground">Please use our return policy instead</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Refund for Cancelled Orders</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For successfully cancelled orders, refunds will be processed within <strong>3-5 business days</strong> 
                  and credited to your original payment method. The exact timing may vary depending on your bank or payment provider.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Partial Cancellation</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For orders with multiple items, you can cancel individual items within the cancellation window, 
                  subject to their processing status. Items already packed or shipped cannot be cancelled.
                </p>
              </section>

              <section className="bg-muted/50 p-6 rounded-lg">
                <h2 className="font-serif text-xl mb-4">Questions?</h2>
                <p className="text-muted-foreground">
                  If you have any questions about cancelling an order or need assistance, please contact us at{" "}
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

export default CancellationPolicy;

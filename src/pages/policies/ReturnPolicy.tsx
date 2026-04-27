import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import Footer from "@/components/Footer";

const ReturnPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Return & Refund Policy – The Formal Affair</title>
        <meta name="description" content="Learn about our return and refund policy for clothing items" />
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

            <h1 className="section-heading mb-8">Return & Refund Policy</h1>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="font-serif text-xl mb-4">Return Window</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a <strong>7-day return window</strong> from the date of delivery for all clothing items. 
                  Items must be returned in their original condition with all tags attached and in the original packaging.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Eligible for Return</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Unworn and unwashed items with original tags intact</li>
                  <li>Items in original packaging with all accessories included</li>
                  <li>Items without any stains, damage, or alterations</li>
                  <li>Items that don't show signs of wear or washing</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Non-Returnable Items</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Items marked as "Final Sale" or purchased during clearance</li>
                  <li>Intimates and undergarments (for hygiene reasons)</li>
                  <li>Customized or altered items</li>
                  <li>Items damaged due to customer misuse</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Refund Process</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. 
                  If approved, your refund will be processed within <strong>5-7 business days</strong> and credited to your original payment method.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Exchange Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer free exchanges for different sizes or colors, subject to availability. 
                  Exchange requests must be made within the 7-day return window.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">How to Initiate a Return</h2>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li>Log in to your account and go to Order History</li>
                  <li>Select the order containing the item you wish to return</li>
                  <li>Click on "Return Item" and select the reason for return</li>
                  <li>Print the prepaid return label (if applicable)</li>
                  <li>Pack the item securely and drop off at the nearest courier</li>
                </ol>
              </section>

              <section className="bg-muted/50 p-6 rounded-lg">
                <h2 className="font-serif text-xl mb-4">Need Help?</h2>
                <p className="text-muted-foreground">
                  For any queries regarding returns or refunds, please contact us at{" "}
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

export default ReturnPolicy;

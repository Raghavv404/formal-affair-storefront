import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service – The Formal Affair</title>
        <meta name="description" content="Read our terms of service and conditions for using our website" />
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

            <h1 className="section-heading mb-8">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: January 2025</p>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="font-serif text-xl mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using The Formal Affair website and services, you agree to be bound by these 
                  Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Use of Our Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">When using our services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information during registration and checkout</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use our services for personal, non-commercial purposes only</li>
                  <li>Not engage in any fraudulent or unlawful activities</li>
                  <li>Not attempt to interfere with the proper functioning of our website</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Products and Pricing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All product descriptions and prices are subject to change without notice. We reserve the right to 
                  limit quantities, discontinue products, and refuse orders at our discretion. In case of pricing errors, 
                  we will contact you before processing the order.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Orders and Payment</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All orders are subject to availability and confirmation</li>
                  <li>We reserve the right to cancel orders for any reason</li>
                  <li>Payment must be completed before order processing</li>
                  <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, is the property 
                  of The Formal Affair and is protected by intellectual property laws. You may not reproduce, distribute, 
                  or use any content without our written permission.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Formal Affair shall not be liable for any indirect, incidental, special, or consequential damages 
                  arising from your use of our services. Our liability is limited to the amount paid for the specific 
                  product or service in question.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account information and for all 
                  activities that occur under your account. You must notify us immediately of any unauthorized use 
                  of your account.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service are governed by and construed in accordance with the laws of India. 
                  Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City], India.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
                  posting on our website. Your continued use of our services constitutes acceptance of the updated terms.
                </p>
              </section>

              <section className="bg-muted/50 p-6 rounded-lg">
                <h2 className="font-serif text-xl mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  For any questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:legal@theformalaffair.com" className="text-foreground underline">
                    legal@theformalaffair.com
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

export default TermsOfService;

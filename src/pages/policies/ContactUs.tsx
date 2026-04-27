import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us – The Formal Affair</title>
        <meta name="description" content="Get in touch with The Formal Affair. We're here to help with your queries." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <CartSidebar />
        <WishlistSidebar />

        <main className="pt-24 lg:pt-32 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="section-heading mb-8">Contact Us</h1>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're here to help! Whether you have a question about our products, need assistance with an order, 
                  or want to share feedback, we'd love to hear from you.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm mb-1">Email</h3>
                      <a href="mailto:support@theformalaffair.com" className="text-muted-foreground hover:text-foreground">
                        contact@theformalaffair.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-muted-foreground hover:text-foreground">
                        
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">Mon - Sat, 10 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm mb-1">Address</h3>
                      <p className="text-muted-foreground text-sm">
                        The Formal Affair<br />
                        629 ,Vipul plaza, Sector 81 <br />
                        Faridabad, Haryana 121004<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-serif text-lg mb-4">Common Queries</h3>
                  <div className="space-y-3 text-sm">
                    <p>
                      <strong>Order Status:</strong>{" "}
                      <Link to="/account" className="text-muted-foreground hover:text-foreground underline">
                        Check in your account
                      </Link>
                    </p>
                    <p>
                      <strong>Returns:</strong>{" "}
                      <Link to="/returns" className="text-muted-foreground hover:text-foreground underline">
                        View return policy
                      </Link>
                    </p>
                    <p>
                      <strong>Shipping:</strong>{" "}
                      <Link to="/shipping" className="text-muted-foreground hover:text-foreground underline">
                        View shipping policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-muted/30 p-8">
                <h2 className="font-serif text-xl mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                        errors.name ? "border-destructive" : "border-border"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                        errors.email ? "border-destructive" : "border-border"
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                        errors.subject ? "border-destructive" : "border-border"
                      }`}
                    >
                      <option value="">Select a topic</option>
                      <option value="Order Issue">Order Issue</option>
                      <option value="Return/Exchange">Return/Exchange</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Shipping Query">Shipping Query</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none ${
                        errors.message ? "border-destructive" : "border-border"
                      }`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;

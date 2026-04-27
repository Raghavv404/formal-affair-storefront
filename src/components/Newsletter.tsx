import { useState } from "react";
import { toast } from "sonner";
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to The Affair! Check your inbox for exclusive previews.");
      setEmail("");
    }
  };
  return <section className="py-20 lg:py-28 bg-background border-t border-border">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-2xl lg:text-3xl mb-4">
          Join The Affair
        </h2>
        <p className="body-text text-muted-foreground mb-8">
          Get exclusive previews, launch updates, and styling inspiration
          delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-12">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-6 py-4 bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors font-sans text-sm tracking-wide" required />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>

        
      </div>
    </section>;
};
export default Newsletter;
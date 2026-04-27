import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Welcome back!");
      } else {
        await signup(email, password, name);
        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Sign In" : "Create Account"} – The Formal Affair</title>
        <meta name="description" content="Access your account to manage orders, wishlist, and more." />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/20 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200"
            alt="Fashion"
            className="w-full h-full object-cover animate-ken-burns"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24">
          <div className="max-w-md mx-auto w-full">
            {/* Back Link */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>

            {/* Logo */}
            <div className="mb-12">
              <img src="/WhatsApp Image 2026-01-05 at 22.18.46.jpeg" alt="The Formal Affair" className="h-16 mb-6" />
              <h1 className="font-serif text-3xl mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="body-text text-muted-foreground">
                {isLogin 
                  ? "Sign in to access your account and continue shopping." 
                  : "Join us to enjoy exclusive benefits and faster checkout."
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-sans tracking-wide mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full bg-transparent border border-border px-4 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-sans tracking-wide mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border border-border px-4 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-sans tracking-wide mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-transparent border border-border px-4 py-3 pr-12 text-sm font-sans focus:outline-none focus:border-foreground transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? "Please wait..." 
                  : isLogin ? "Sign In" : "Create Account"
                }
              </button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {isLogin ? "Create one" : "Sign in"}
              </button>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground tracking-widest uppercase">Or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-outline py-3 text-xs">
                Google
              </button>
              <button className="btn-outline py-3 text-xs">
                Apple
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center mt-8">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Phone, User as UserIcon, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
  defaultStep?: "identifier_only" | "login_password" | "signup_details" | "verify_otp" | "forgot_password" | "verify_recovery_otp" | "update_password";
}

const SignInModal = ({ isOpen, onClose, redirectTo, defaultStep }: SignInModalProps) => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<
    "identifier_only" | "login_password" | "signup_details" | "verify_otp" | "forgot_password" | "verify_recovery_otp" | "update_password"
  >(defaultStep || "identifier_only");
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  
  // NEW: Additional contact state for strict signups
  const [additionalContact, setAdditionalContact] = useState("");
  
  // Recovery State
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(defaultStep || "identifier_only");
    }
  }, [isOpen, defaultStep]);

  if (!isOpen) return null;

  // --- HELPER: DETECT EMAIL vs PHONE ---
  const formatIdentifier = (val: string) => {
    if (val.includes("@")) return { type: "email", value: val.toLowerCase().trim() };
    const cleaned = val.replace(/\D/g, "");
    return { type: "phone", value: `+91${cleaned.slice(-10)}` };
  };

  // --- STEP 1: CHECK IF USER EXISTS ---
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { type, value } = formatIdentifier(identifier);

      if (type === "phone" && value.length !== 13) {
        throw new Error("Please enter a valid 10-digit mobile number.");
      }

      const { data: userExists, error } = await supabase.rpc('check_user_exists', { lookup_id: value });
      if (error) throw error;

      if (userExists) {
        setStep("login_password"); 
      } else {
        setStep("signup_details"); 
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2A: LOG IN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { type, value } = formatIdentifier(identifier);
      const credentials = type === "email" ? { email: value, password } : { phone: value, password };
      const { error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        if (error.message.includes("not confirmed")) {
          const resendType = type === "email" ? "signup" : "sms";
          await supabase.auth.resend({ type: resendType, [type]: value } as any);
          toast("Verification Required", { description: "We sent a fresh code to verify your account." });
          setStep("verify_otp");
          return;
        }
        throw error;
      }

      toast.success("Welcome back to The Formal Affair!");
      resetAndClose();
    } catch (error: any) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2B: CREATE ACCOUNT (STRICT) ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Additional Contact
    const { type: primaryType } = formatIdentifier(identifier);
    if (primaryType === "email") {
      const phoneRegex = /^[6-9](?!(\d)\1{8})\d{9}$/;
      if (!phoneRegex.test(additionalContact)) {
        toast.error("Please provide a valid 10-digit Indian mobile number.");
        return;
      }
    } else {
      if (!additionalContact.includes("@") || !additionalContact.includes(".")) {
        toast.error("Please provide a valid email address.");
        return;
      }
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);

    try {
      const { type, value } = formatIdentifier(identifier);
      
      // Save EVERYTHING to metadata so the Profile page is instantly complete
      const commonOptions = {
        data: { 
          first_name: firstName, 
          last_name: lastName, 
          name: `${firstName} ${lastName}`,
          phone: type === "phone" ? value : `+91${additionalContact}`,
          email: type === "email" ? value : additionalContact.toLowerCase()
        }
      };

      let error;
      if (type === "email") {
        const res = await supabase.auth.signUp({ email: value, password, options: commonOptions });
        error = res.error;
      } else {
        const res = await supabase.auth.signUp({ phone: value, password, options: commonOptions });
        error = res.error;
      }

      if (error) throw error;

      toast.success("Account created! Check for your verification code.");
      setStep("verify_otp"); 
    } catch (error: any) {
      toast.error(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: OTP VERIFICATION (NEW SIGNUPS) ---
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return; // Allow 6-8 digits
    setLoading(true);

    try {
      const { type, value } = formatIdentifier(identifier);
      let error;

      if (type === "email") {
        const res = await supabase.auth.verifyOtp({ email: value, token: otp, type: 'signup' });
        error = res.error;
      } else {
        const res = await supabase.auth.verifyOtp({ phone: value, token: otp, type: 'sms' });
        error = res.error;
      }
      
      if (error) throw error;
      
      toast.success("Account verified! Welcome to the club.");
      resetAndClose();
    } catch (error: any) {
      toast.error("Invalid or expired code.");
      setOtp(""); 
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 4: INITIATE FORGOT PASSWORD ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { type, value } = formatIdentifier(resetIdentifier);
      if (type === "phone" && value.length !== 13) throw new Error("Please enter a valid 10-digit number.");

      if (type === "email") {
        const { error } = await supabase.auth.resetPasswordForEmail(value);
        if (error) throw error;

        toast.success("Recovery code sent!", { description: "Check your email inbox." });
        setStep("verify_recovery_otp"); 
      } else {
        const { error } = await supabase.auth.signInWithOtp({ phone: value });
        if (error) throw error;

        toast.success("Recovery code sent!", { description: "Check your text messages." });
        setStep("verify_recovery_otp"); 
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send recovery code.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 5: VERIFY RECOVERY OTP (EMAIL & PHONE) ---
  const handleVerifyRecoveryOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return; // Allow 6-8 digits
    setLoading(true);

    try {
      const { type, value } = formatIdentifier(resetIdentifier);
      let error;

      if (type === "email") {
        const res = await supabase.auth.verifyOtp({ email: value, token: otp, type: 'recovery' });
        error = res.error;
      } else {
        const res = await supabase.auth.verifyOtp({ phone: value, token: otp, type: 'sms' });
        error = res.error;
      }

      if (error) throw error;

      toast.success("Verified! Please set a new password.");
      setOtp(""); 
      setStep("update_password"); 
    } catch (error: any) {
      toast.error("Invalid or expired code.");
      setOtp(""); 
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 6: UPDATE TO NEW PASSWORD ---
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success("Password updated successfully! Welcome back.");
      resetAndClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep("identifier_only");
    setIdentifier("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setAdditionalContact("");
    setOtp("");
    setResetIdentifier("");
    setNewPassword("");
    setShowPassword(false);
    onClose();
    if (redirectTo) navigate(redirectTo);
  };

  const handleGoToForgot = () => {
    setResetIdentifier(identifier); 
    setStep("forgot_password");
  };

  const currentIdentifierType = formatIdentifier(identifier).type;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-gray-50 p-6 text-center border-b border-gray-100 relative shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          {step !== "identifier_only" && step !== "verify_otp" && step !== "verify_recovery_otp" && step !== "update_password" && (
            <button onClick={() => { 
              if (step === "forgot_password") setStep("login_password");
              else { setStep("identifier_only"); setPassword(""); }
            }} className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <h2 className="text-2xl font-serif text-gray-900 mb-2">
            {step === "identifier_only" ? "Sign In / Sign Up" : 
             step === "login_password" ? "Welcome Back" :
             step === "signup_details" ? "Create Account" : 
             step === "forgot_password" ? "Reset Password" : 
             step === "update_password" ? "New Password" : "Verify Account"}
          </h2>
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            {step === "identifier_only" ? "Enter details to continue" : 
             step === "forgot_password" ? "We'll send you a code" : 
             step === "update_password" ? "Secure your account" : identifier}
          </p>
        </div>
        
        {/* SCROLLABLE FORM AREA */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          {/* VIEW 1: IDENTIFIER */}
          {step === "identifier_only" && (
            <form onSubmit={handleIdentifierSubmit} className="space-y-5 animate-in slide-in-from-left-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Email Address or Mobile Number *</label>
                <div className="relative">
                  {identifier && !identifier.includes("@") && identifier.match(/\d/) ? (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                  <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full border border-gray-200 py-3 pl-10 pr-3 text-sm focus:border-black outline-none transition-colors" placeholder="Email or 10-digit number" autoFocus />
                </div>
              </div>
              <button type="submit" disabled={loading || !identifier} className="w-full bg-black text-white py-4 mt-2 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                {loading ? "Checking..." : "Continue"} 
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* VIEW 2A: LOGIN */}
          {step === "login_password" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-right-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500">Password</label>
                  <button type="button" onClick={handleGoToForgot} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 py-3 pl-10 pr-10 text-sm focus:border-black outline-none transition-colors" placeholder="••••••••" autoFocus />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading || !password} className="w-full bg-black text-white py-4 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors">
                {loading ? "Signing In..." : "Sign In"} 
              </button>
            </form>
          )}

          {/* VIEW 2B: SIGNUP (STRICT) */}
          {step === "signup_details" && (
            <form onSubmit={handleSignUp} className="space-y-4 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">First Name *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-gray-200 py-3 pl-10 pr-3 text-sm focus:border-black outline-none transition-colors" placeholder="Jane" autoFocus />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Last Name *</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-gray-200 py-3 px-4 text-sm focus:border-black outline-none transition-colors" placeholder="Doe" />
                </div>
              </div>
              
              {/* NEW: DYNAMIC MANDATORY CONTACT FIELD */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">
                  {currentIdentifierType === "email" ? "Mobile Number *" : "Email Address *"}
                </label>
                <div className="relative">
                  {currentIdentifierType === "email" ? (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                  <input 
                    type="text" 
                    required 
                    value={additionalContact} 
                    onChange={(e) => setAdditionalContact(e.target.value)} 
                    className="w-full border border-gray-200 py-3 pl-10 pr-3 text-sm focus:border-black outline-none transition-colors" 
                    placeholder={currentIdentifierType === "email" ? "10-digit number" : "jane@example.com"} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Create Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 py-3 pl-10 pr-10 text-sm focus:border-black outline-none transition-colors" placeholder="At least 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading || !password || !firstName || !additionalContact} className="w-full bg-black text-white py-4 mt-4 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors">
                {loading ? "Creating Account..." : "Create Account"} 
              </button>
            </form>
          )}

          {/* VIEW 3: OTP (NEW SIGNUPS) */}
          {step === "verify_otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <input type="text" required maxLength={8} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-200 py-4 text-center text-2xl tracking-[0.5em] font-medium focus:border-black outline-none transition-colors rounded-sm" placeholder="--------" autoFocus />
              </div>
              <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-black text-white py-4 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors">
                {loading ? "Verifying..." : "Verify & Complete Signup"}
              </button>
            </form>
          )}

          {/* --- VIEW 4: FORGOT PASSWORD REQUEST --- */}
          {step === "forgot_password" && (
            <form onSubmit={handleForgotPassword} className="space-y-5 animate-in slide-in-from-right-4">
               <div className="bg-gray-50 p-3 rounded text-[11px] text-gray-500 mb-2 leading-relaxed">
                Enter your details below. We'll send you a secure code to reset your password.
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Email Address or Mobile Number *</label>
                <div className="relative">
                  {resetIdentifier && !resetIdentifier.includes("@") && resetIdentifier.match(/\d/) ? (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                  <input type="text" required value={resetIdentifier} onChange={(e) => setResetIdentifier(e.target.value)} className="w-full border border-gray-200 py-3 pl-10 pr-3 text-sm focus:border-black outline-none transition-colors" placeholder="Email or 10-digit number" autoFocus />
                </div>
              </div>
              <button type="submit" disabled={loading || !resetIdentifier} className="w-full bg-black text-white py-4 mt-2 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors">
                {loading ? "Sending..." : "Send Recovery Code"} 
              </button>
            </form>
          )}

          {/* --- VIEW 5: VERIFY RECOVERY OTP --- */}
          {step === "verify_recovery_otp" && (
            <form onSubmit={handleVerifyRecoveryOTP} className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-gray-50 p-3 rounded text-[11px] text-gray-500 mb-2 leading-relaxed text-center">
                Enter the code we just sent to {resetIdentifier}
              </div>
              <div>
                <input type="text" required maxLength={8} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-200 py-4 text-center text-2xl tracking-[0.5em] font-medium focus:border-black outline-none transition-colors rounded-sm" placeholder="--------" autoFocus />
              </div>
              <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-black text-white py-4 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors">
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {/* --- VIEW 6: UPDATE PASSWORD --- */}
          {step === "update_password" && (
            <form onSubmit={handleUpdatePassword} className="space-y-5 animate-in slide-in-from-right-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">New Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-200 py-3 pl-10 pr-10 text-sm focus:border-black outline-none transition-colors" placeholder="At least 8 characters" autoFocus />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading || !newPassword} className="w-full bg-black text-white py-4 mt-2 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-gray-800 transition-colors">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default SignInModal;
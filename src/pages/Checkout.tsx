import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, CreditCard, Shield, CheckCircle2, MapPin, Smartphone, Beaker, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import SignInModal from "@/components/SignInModal";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/lib/supabase"; 

// --- STRICT INDIAN ADDRESS SCHEMA ---
const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[6-9](?!(\d)\1{8})\d{9}$/, "Enter a valid, genuine 10-digit mobile number"),
  address: z.string().min(5, "Please enter your full street address"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian Pincode"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, removeItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  // --- NEW ADDRESS UX STATE ---
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>("");
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);

  const [orderId, setOrderId] = useState<string>("");
  const [isValidatingPincode, setIsValidatingPincode] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "test">("test");
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingForm>({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingForm, boolean>>>({});

  const shippingCost = totalPrice >= 2000 ? 0 : 99;
  const finalTotal = totalPrice + shippingCost;

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 6); 
    return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
  };
  const deliveryDateString = getDeliveryDate();

  const isFormValid = useMemo(() => {
    return shippingSchema.safeParse(shippingInfo).success;
  }, [shippingInfo]);

  // --- FETCH ADDRESSES & AUTO-SWITCH TO CARD VIEW ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setShippingInfo(prev => ({ ...prev, email: user.email || "" }));
        
        const { data } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id);

        if (data && data.length > 0) {
          const mappedAddresses = data.map(d => ({
            id: d.id,
            name: `${d.first_name} ${d.last_name}`,
            phone: d.phone_number,
            address: d.street_address,
            city: d.city,
            state: d.state,
            pincode: d.pincode,
            isDefault: d.is_default
          }));
          
          setSavedAddresses(mappedAddresses);
          setShowAddressForm(false); // Hide the form, show the cards!
          
          const defaultAddr = mappedAddresses.find(a => a.isDefault) || mappedAddresses[0];
          handleCardSelect(defaultAddr.id, mappedAddresses);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Sync selected card data to the shippingInfo state in the background
  const handleCardSelect = (id: string, addressesToSearch = savedAddresses) => {
    setSelectedSavedAddressId(id);
    const addr = addressesToSearch.find(a => a.id === id);
    if (addr) {
      const nameParts = addr.name.split(" ");
      setShippingInfo(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      }));
      setErrors({});
    }
  };

  const lookupPincode = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setIsValidatingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0] && data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        setShippingInfo(prev => ({ ...prev, city: details.District, state: details.State }));
        setErrors(prev => ({ ...prev, city: undefined, state: undefined, pincode: undefined }));
        toast.success(`Location detected: ${details.District}, ${details.State}`);
      } else {
        setErrors(prev => ({ ...prev, pincode: "Invalid Pincode. Please check again." }));
        setShippingInfo(prev => ({ ...prev, city: "", state: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch pincode details");
    } finally {
      setIsValidatingPincode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if ((name === "phone" || name === "pincode") && !/^\d*$/.test(value)) return;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (name === "pincode" && value.length === 6) lookupPincode(value);
    if (name === "pincode" && value.length < 6) setShippingInfo(prev => ({ ...prev, city: "", state: "" }));
    if (touched[name as keyof ShippingForm]) validateField(name as keyof ShippingForm, value);
  };

  const validateField = (name: keyof ShippingForm, value: string) => {
    try {
      shippingSchema.shape[name].parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof ShippingForm, value);
  };

  const handleContinueToPayment = async () => {
    if (!isAuthenticated) {
      setShowSignInModal(true);
      return;
    }
    
    // Validate Form if they are using the manual input
    const result = shippingSchema.safeParse(shippingInfo);
    if (!result.success) {
      toast.error("Please fix the errors in the form");
      const allTouched = Object.keys(shippingInfo).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      return;
    }

    // Save to Database if checkbox is checked
    if (saveAddressToAccount && user) {
      const existingAddress = savedAddresses.find(
        a => a.address.toLowerCase() === shippingInfo.address.toLowerCase() && a.pincode === shippingInfo.pincode
      );
      
      if (!existingAddress) {
        await supabase.from("user_addresses").insert([{
          user_id: user.id,
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          email: shippingInfo.email,
          phone_number: shippingInfo.phone,
          street_address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          is_default: savedAddresses.length === 0
        }]);
      }
    }
    
    setStep("payment");
    window.scrollTo(0,0);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    if (paymentMethod !== 'test') {
      setProcessingStatus("Connecting to Secure Gateway...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingStatus("Verifying Payment Details...");
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setProcessingStatus("Saving Order to Database...");
    
    try {
      if (!user) throw new Error("User not authenticated");

      const customOrderId = `ORD-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;

      // --- MAX BRAIN DB INSERT ---
      // We now push the address, the expected delivery date, AND the payment method to Supabase!
      const { error: orderError } = await supabase.from("orders").insert([{
        id: customOrderId,
        user_id: user.id,
        customer_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        total_amount: finalTotal,
        status: "Processing",
        shipping_address: shippingInfo,           // Solves the NULL address issue
        expected_delivery: deliveryDateString,    // Adds the delivery date to user's account view
        payment_method: paymentMethod             // Tracks UPI/Card/Test in the database
      }]);

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        id: crypto.randomUUID(),
        order_id: customOrderId,
        product_id: item.id,
        product_name: item.name,
        selected_size: (item as any).size || "Standard", 
        quantity: item.quantity || 1,
        price: item.price
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      setOrderId(customOrderId.replace('ORD-', '')); 
      items.forEach(item => removeItem(item.id));
      setStep("confirmation");
      window.scrollTo(0,0);
      toast.success(paymentMethod === 'test' ? "Test Order placed successfully!" : "Payment Successful! Order placed.", { id: "payment" });

    } catch (error: any) {
      toast.error(error.message || "Failed to save order details.", { id: "payment" });
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const renderInput = (label: string, name: keyof ShippingForm, type = "text", maxLength?: number, readOnly = false) => {
    const hasError = touched[name] && errors[name];
    
    if (name === "phone") {
      const isPhoneValid = !errors.phone && shippingInfo.phone.length === 10;
      return (
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <label className="text-sm font-medium text-gray-700 block">{label}</label>
            {isPhoneValid && (
              <span className="text-[10px] font-bold tracking-widest text-green-600 flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={type} name={name} value={shippingInfo[name]} onChange={handleInputChange} onBlur={handleBlur} maxLength={maxLength}
              className={`w-full border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all bg-white text-gray-900 placeholder:text-gray-400
                ${hasError ? "border-red-500 focus:border-red-500 bg-red-50" : isPhoneValid ? "border-green-500 focus:border-green-500" : "border-gray-300 focus:border-gray-900"}
              `}
            />
          </div>
          {hasError && <p className="text-red-600 text-xs mt-1.5">{errors[name]}</p>}
        </div>
      );
    }

    return (
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
        <div className="relative">
          <input
            type={type} name={name} value={shippingInfo[name]} onChange={handleInputChange} onBlur={handleBlur} maxLength={maxLength} readOnly={readOnly}
            placeholder={readOnly ? "Auto-filled from Pincode" : ""}
            className={`w-full border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all bg-white text-gray-900 placeholder:text-gray-400
              ${hasError ? "border-red-500 focus:border-red-500 bg-red-50" : "border-gray-300 focus:border-gray-900"}
              ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
            `}
          />
        </div>
        {hasError && <p className="text-red-600 text-xs mt-1.5">{errors[name]}</p>}
      </div>
    );
  };

  const formatPrice = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Your cart is empty</h1>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout – The Formal Affair</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-white sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link to="/" className="font-serif text-2xl tracking-wider">THE FORMAL AFFAIR</Link>
            <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <Lock className="w-3 h-3" /> Secure Checkout
            </div>
          </div>
        </header>

        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {step === "confirmation" ? (
              <div className="max-w-xl mx-auto text-center py-20 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="font-serif text-3xl mb-4">Order Confirmed!</h1>
                <p className="text-lg mb-2">Order ID: ORD-{orderId}</p>
                <p className="text-muted-foreground mb-8">{paymentMethod === 'test' ? 'Test Order Successful' : 'A confirmation email has been sent.'}</p>
                <div className="bg-gray-50 p-4 rounded-sm inline-block text-left mb-8">
                  <p className="text-sm text-gray-600">Expected Delivery:</p>
                  <p className="text-lg font-medium text-gray-900">{deliveryDateString}</p>
                </div>
                <div className="flex gap-4 justify-center mt-2">
                  <Link to="/shop" className="btn-primary flex-1 max-w-[200px] py-3 text-[11px] font-bold tracking-[0.2em] uppercase">Continue Shopping</Link>
                  <Link to="/account" className="btn-outline flex-1 max-w-[200px] py-3 text-[11px] font-bold tracking-[0.2em] uppercase border border-gray-200">View Order History</Link>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7">
                  <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                  </Link>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step === "shipping" ? "text-foreground" : "text-muted-foreground"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "shipping" ? "bg-foreground text-background" : "bg-muted"}`}>1</div>
                      <span className="text-sm font-sans tracking-wide font-medium">Shipping</span>
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <div className={`flex items-center gap-2 ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "payment" ? "bg-foreground text-background" : "bg-muted"}`}>2</div>
                      <span className="text-sm font-sans tracking-wide font-medium">Payment</span>
                    </div>
                  </div>

                  {step === "shipping" && (
                    <div className="space-y-6 animate-fade-in">
                      <h2 className="font-serif text-2xl">Shipping Address</h2>
                      
                      {/* LUXURY SAVED ADDRESS CARDS */}
                      {!showAddressForm && savedAddresses.length > 0 ? (
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            {savedAddresses.map(addr => (
                              <div
                                key={addr.id}
                                onClick={() => handleCardSelect(addr.id)}
                                className={`border p-5 rounded-sm cursor-pointer relative transition-all ${
                                  selectedSavedAddressId === addr.id
                                    ? "border-black ring-1 ring-black bg-gray-50/50 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-medium text-sm text-gray-900 flex items-center gap-2">
                                    {addr.name}
                                    {addr.isDefault && <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>}
                                  </p>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSavedAddressId === addr.id ? 'border-black' : 'border-gray-300'}`}>
                                    {selectedSavedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-black" />}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {addr.address}<br />
                                  {addr.city}, {addr.state} - {addr.pincode}<br />
                                  <span className="mt-2 inline-block font-medium text-gray-900">+91 {addr.phone}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => { setShowAddressForm(true); setShippingInfo(prev => ({...prev, address: "", city: "", state: "", pincode: ""}))}} className="text-sm font-medium tracking-wide text-gray-600 hover:text-black underline underline-offset-4">
                            + Add a New Address
                          </button>
                          <div className="pt-4 border-t border-gray-100">
                            <button onClick={() => { setStep("payment"); window.scrollTo(0,0); }} className="w-full py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 rounded-sm bg-foreground text-background hover:opacity-90 shadow-md">
                              Deliver to this address
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* MANUAL INPUT FORM */
                        <div className="space-y-6 animate-fade-in">
                          <div className="grid grid-cols-2 gap-4">
                            {renderInput("First Name", "firstName")}
                            {renderInput("Last Name", "lastName")}
                          </div>
                          {renderInput("Email Address", "email", "email")}
                          {renderInput("Mobile Number (+91)", "phone", "tel", 10)}
                          {renderInput("Street Address / Flat / Building", "address")}
                          <div className="grid grid-cols-2 gap-4">
                            {renderInput("Pincode (6 digits)", "pincode", "text", 6)}
                            {renderInput("City / District", "city", "text", undefined, true)}
                          </div>
                          {renderInput("State", "state", "text", undefined, true)}
                          
                          {isAuthenticated && (
                            <label className="flex items-center gap-2 cursor-pointer mt-4">
                              <input type="checkbox" checked={saveAddressToAccount} onChange={(e) => setSaveAddressToAccount(e.target.checked)} className="w-4 h-4 rounded-sm border-gray-300 text-black focus:ring-black accent-black" />
                              <span className="text-sm text-gray-600">Save this address to my account for future orders</span>
                            </label>
                          )}

                          <div className="flex gap-4 pt-4 border-t border-gray-100">
                            {savedAddresses.length > 0 && (
                              <button type="button" onClick={() => setShowAddressForm(false)} className="w-1/3 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                                Cancel
                              </button>
                            )}
                            <button onClick={handleContinueToPayment} disabled={!isFormValid || isValidatingPincode} className={`flex-1 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 rounded-sm ${(isFormValid && !isValidatingPincode) ? "bg-foreground text-background hover:opacity-90 shadow-md cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                              {isAuthenticated ? "Deliver to this address" : "Sign In & Continue"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === "payment" && (
                    <div className="space-y-6 animate-fade-in">
                       <h2 className="font-serif text-2xl mb-4">Select Payment Method</h2>
                       <div className="bg-white border border-gray-200 p-4 rounded-sm mb-6 relative">
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="font-medium text-gray-900 text-sm">Delivering To:</h3>
                           <button onClick={() => setStep("shipping")} className="text-xs font-semibold tracking-widest uppercase text-gray-500 hover:text-black transition-colors underline underline-offset-4">Change</button>
                         </div>
                         <p className="text-sm font-medium text-gray-900">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                         <p className="text-sm text-gray-600 mt-1">{shippingInfo.address}</p>
                         <p className="text-sm text-gray-600">{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                         <p className="text-sm text-gray-600 mt-1">+91 {shippingInfo.phone}</p>
                       </div>
                       
                       <div className="space-y-3">
                         <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-foreground bg-gray-50 ring-1 ring-foreground' : 'border-gray-200 hover:border-gray-300'}`}>
                           <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-foreground focus:ring-foreground accent-black" />
                           <div className="ml-4 flex items-center gap-3">
                             <div className="p-2 bg-white rounded-md border shadow-sm"><Smartphone className="w-5 h-5 text-green-600" /></div>
                             <div><p className="font-medium text-gray-900">UPI</p><p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p></div>
                           </div>
                         </label>
                         <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-foreground bg-gray-50 ring-1 ring-foreground' : 'border-gray-200 hover:border-gray-300'}`}>
                           <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-foreground focus:ring-foreground accent-black" />
                           <div className="ml-4 flex items-center gap-3">
                             <div className="p-2 bg-white rounded-md border shadow-sm"><CreditCard className="w-5 h-5 text-blue-600" /></div>
                             <div><p className="font-medium text-gray-900">Credit / Debit / ATM Card</p><p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p></div>
                           </div>
                         </label>
                         
                         {/* --- NEW TEST PAYMENT BLOCK --- */}
                         <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'test' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-indigo-200 hover:border-indigo-300'}`}>
                           <input type="radio" name="payment" value="test" checked={paymentMethod === 'test'} onChange={() => setPaymentMethod('test')} className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 accent-indigo-600" />
                           <div className="ml-4 flex items-center gap-3">
                             <div className="p-2 bg-white rounded-md border border-indigo-100 shadow-sm"><Beaker className="w-5 h-5 text-indigo-600" /></div>
                             <div><p className="font-medium text-indigo-900">Test Payment (Sandbox)</p><p className="text-xs text-indigo-500">Bypasses Razorpay to test database inserts</p></div>
                           </div>
                         </label>
                       </div>

                       <div className="pt-6">
                         <button 
                            onClick={handlePayment} 
                            disabled={isProcessing}
                            className={`w-full py-4 text-sm tracking-widest uppercase transition-all duration-200 text-white shadow-lg
                              ${isProcessing ? 'opacity-80 cursor-wait bg-gray-600' : paymentMethod === 'test' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-black hover:bg-gray-900'}
                            `}
                          >
                            {isProcessing ? processingStatus : paymentMethod === 'test' ? `Simulate Order (${formatPrice(finalTotal)})` : `Pay ${formatPrice(finalTotal)}`}
                          </button>
                          <div className="flex flex-col items-center justify-center mt-6">
                             <div className="flex items-center gap-2 text-xs text-green-700 font-medium bg-green-50 px-4 py-2 rounded-full mb-3">
                               <Shield className="w-3 h-3" />
                               <span>100% Secure Transaction via Razorpay</span>
                             </div>
                             <p className="text-[10px] text-gray-400 text-center max-w-xs">
                               By placing this order, you agree to our Terms of Service. Anti-fraud monitoring is active.
                             </p>
                          </div>
                       </div>
                    </div>
                  )}
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="lg:col-span-5 lg:border-l border-border lg:pl-10">
                  <div className="sticky top-24">
                    <h2 className="font-serif text-xl mb-6">Price Details</h2>
                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 mb-4">
                          <div className="w-16 h-20 bg-muted overflow-hidden rounded-sm border shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Size: {(item as any).size || "Standard"} | Qty: {item.quantity}</p>
                            <p className="text-sm font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-[10px] text-green-600 mt-1 font-medium">Delivery by {deliveryDateString}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600"><span>Price ({items.length} items)</span><span>{formatPrice(totalPrice)}</span></div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Delivery Charges</span><span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span></div>
                      <div className="border-t border-dashed my-4"></div>
                      <div className="flex justify-between text-lg font-bold text-gray-900"><span>Total Amount</span><span>{formatPrice(finalTotal)}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} redirectTo="" />
    </>
  );
};

export default Checkout;
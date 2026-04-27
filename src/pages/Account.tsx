import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Package, MapPin, User, Heart, LogOut, Clock, AlertCircle, Check, X, Edit2, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import Footer from "@/components/Footer";
import AddAddressForm from "@/components/account/AddAddressForm";
// --- FIXED IMPORT PATH: Points directly to components now ---
import ProfileDetails from "@/components/account/ProfileDetails"; 
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; 
import { products } from "@/data/products"; 

interface Order {
  id: string;
  dbId?: string; // Hidden ID for database updates
  items: Array<{ id: string; name: string; price: number; image: string; quantity: number; size?: string }>;
  total: number;
  shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: string;
  date: string;
}

interface SavedAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
}

const CANCELLATION_WINDOW_HOURS = 12;

const Account = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile" | "wishlist">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [profile, setProfile] = useState<ProfileInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // --- LIVE SUPABASE DATA FETCH ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch Profile Data (from Auth metadata)
        setProfile({
          email: user.email || "",
          firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(" ")[0] || "",
          lastName: user.user_metadata?.last_name || user.user_metadata?.name?.split(" ").slice(1).join(" ") || "",
          phone: user.user_metadata?.phone || "",
          gender: user.user_metadata?.gender || "",
        });

        // 2. Fetch Addresses from Database
        const { data: addrData } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        if (addrData) {
          setAddresses(addrData.map(d => ({
            id: d.id,
            name: `${d.first_name} ${d.last_name}`,
            phone: d.phone_number,
            address: d.street_address,
            city: d.city,
            state: d.state,
            pincode: d.pincode,
            isDefault: d.is_default
          })));
        }

        // 3. Fetch Orders & Order Items from Database
        const { data: orderData } = await supabase
          .from("orders")
          .select(`*, order_items(*)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (orderData) {
          const formattedOrders = orderData.map(o => {
            const mappedItems = (o.order_items || []).map((item: any) => {
              const localProduct = products.find(p => p.id === item.product_id);
              return {
                id: item.product_id,
                name: item.product_name,
                price: item.price,
                quantity: item.quantity,
                size: item.selected_size || "Standard", // Captured Size
                image: localProduct?.image || "" 
              };
            });

            const ship = o.shipping_address || {};
            
            return {
              id: o.id, // <-- FIX: Directly use the database ID here without splitting
              dbId: o.id, 
              items: mappedItems,
              total: o.total_amount,
              status: o.status,
              date: o.created_at,
              shippingInfo: {
                firstName: ship.firstName || ship.first_name || "",
                lastName: ship.lastName || ship.last_name || "",
                address: ship.address || ship.street_address || "",
                city: ship.city || "",
                state: ship.state || "",
                pincode: ship.pincode || ""
              }
            };
          });
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const getHoursRemaining = (orderDate: string) => {
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();
    const hoursElapsed = (now - orderTime) / (1000 * 60 * 60);
    return Math.max(0, CANCELLATION_WINDOW_HOURS - hoursElapsed);
  };

  const canCancelOrder = (order: Order) => {
    if (order.status === "Cancelled" || order.status === "Delivered" || order.status === "Shipped") return false;
    return getHoursRemaining(order.date) > 0;
  };

  // --- DATABASE: CANCEL ORDER ---
  const handleCancelOrder = async (displayId: string, realDbId?: string) => {
    if (!realDbId) return;
    try {
      const { error } = await supabase.from("orders").update({ status: "Cancelled" }).eq("id", realDbId);
      if (error) throw error;
      
      setOrders(orders.map(o => o.id === displayId ? { ...o, status: "Cancelled" } : o));
      toast.success("Order cancelled successfully. Refund will be processed within 5-7 business days.");
    } catch (e) {
      toast.error("Failed to cancel order.");
    }
  };

  // --- DATABASE: UPDATE PROFILE ---
  const handleProfileUpdate = async (updatedProfile: ProfileInfo) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          first_name: updatedProfile.firstName, 
          last_name: updatedProfile.lastName,
          phone: updatedProfile.phone,
          gender: updatedProfile.gender
        }
      });
      if (error) throw error;
      setProfile(updatedProfile);
      toast.success("Profile updated securely!");
    } catch (e) {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update password.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleAddAddress = () => {
    setEditingAddressId(null);
    setShowAddAddressForm(true);
  };

  const handleEditAddress = (addressId: string) => {
    setEditingAddressId(addressId);
    setShowAddAddressForm(true);
  };

  // --- DATABASE: DELETE ADDRESS ---
  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await supabase.from("user_addresses").delete().eq("id", addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      toast.success("Address deleted successfully");
    }
  };

  // --- DATABASE: SET DEFAULT ADDRESS ---
  const handleSetDefaultAddress = async (addressId: string) => {
    await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user?.id);
    await supabase.from("user_addresses").update({ is_default: true }).eq("id", addressId);
    
    setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === addressId })));
    toast.success("Default address updated");
  };

  // --- DATABASE: SAVE/EDIT ADDRESS ---
  const handleAddressSave = async (addressData: Omit<SavedAddress, "id" | "isDefault">) => {
    const nameParts = addressData.name.split(" ");
    const dbPayload = {
      user_id: user?.id,
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      phone_number: addressData.phone,
      street_address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode
    };

    if (editingAddressId) {
      await supabase.from("user_addresses").update(dbPayload).eq("id", editingAddressId);
      setAddresses(addresses.map(addr => addr.id === editingAddressId ? { ...addr, ...addressData } : addr));
      toast.success("Address updated successfully");
    } else {
      const { data } = await supabase.from("user_addresses").insert([{ ...dbPayload, is_default: addresses.length === 0 }]).select().single();
      if (data) {
        setAddresses([...addresses, { ...addressData, id: data.id, isDefault: data.is_default }]);
      }
      toast.success("Address added successfully");
    }
    setShowAddAddressForm(false);
    setEditingAddressId(null);
  };

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "profile", label: "Profile", icon: User },
    { id: "wishlist", label: "Wishlist", icon: Heart },
  ] as const;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!isAuthenticated && !isLoading) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>My Account – The Formal Affair</title>
        <meta name="description" content="Manage your orders, addresses, and profile settings" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <CartSidebar />
        <WishlistSidebar />

        <main className="pt-24 lg:pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
              <h1 className="section-heading">My Account</h1>
              {user && <p className="text-muted-foreground mt-2">Welcome back, {profile.firstName || "Guest"}!</p>}
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* SIDEBAR */}
              <div className="lg:col-span-1">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide transition-colors ${
                        activeTab === tab.id ? "bg-foreground text-background" : "hover:bg-muted"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {tab.id === "wishlist" && wishlistItems.length > 0 && <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5">{wishlistItems.length}</span>}
                      {tab.id === "orders" && orders.length > 0 && <span className="ml-auto text-xs text-muted-foreground">{orders.length}</span>}
                    </button>
                  ))}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </nav>
              </div>

              {/* CONTENT */}
              <div className="lg:col-span-3">
                {isLoading ? (
                   <div className="py-20 text-center text-xs tracking-widest uppercase text-gray-400 animate-pulse">Loading secure data...</div>
                ) : (
                  <>
                    {activeTab === "orders" && (
                      <div>
                        <h2 className="font-serif text-2xl mb-6">Order History</h2>
                        {orders.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-border">
                            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground mb-4">No orders yet</p>
                            <Link to="/shop" className="btn-primary">Start Shopping</Link>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {orders.map((order) => {
                              const hoursRemaining = getHoursRemaining(order.date);
                              const isCancelable = canCancelOrder(order);
                              const isExpanded = expandedOrder === order.id;
                              
                              return (
                                <div key={order.id} className="border border-border">
                                  <div className="p-6 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                      <div>
                                        {/* FIX: Removed the extra hardcoded "ORD-" */}
                                        <p className="text-sm font-medium">Order #{order.id}</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(order.date)} at {formatTime(order.date)}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                                      </div>
                                      <div className="text-right">
                                        <span className={`inline-block px-3 py-1 text-xs tracking-wide uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
                                        <p className="text-sm font-medium mt-2">{formatPrice(order.total)}</p>
                                      </div>
                                    </div>

                                    {order.status !== "Cancelled" && order.status !== "Delivered" && order.status !== "Shipped" && (
                                      <div className="mt-4 pt-4 border-t border-border">
                                        {isCancelable ? (
                                          <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-yellow-600" /><span className="text-yellow-700">Cancelable for {Math.floor(hoursRemaining)}h {Math.floor((hoursRemaining % 1) * 60)}m</span></div>
                                        ) : (
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground"><AlertCircle className="w-4 h-4" /><span>Cancellation window expired</span></div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {isExpanded && (
                                    <div className="border-t border-border p-6 bg-muted/20">
                                      <div className="space-y-4 mb-6">
                                        <h4 className="text-sm font-medium">Items</h4>
                                        {order.items.map((item, idx) => (
                                          <div key={idx} className="flex gap-4">
                                            <div className="w-16 h-20 bg-muted overflow-hidden">
                                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                              <p className="font-serif text-sm">{item.name}</p>
                                              {/* SIZE VISIBLE IN ORDER HISTORY */}
                                              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mt-1">
                                                Size: {item.size} | Qty: {item.quantity}
                                              </p>
                                              <p className="text-sm mt-1">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="mb-6">
                                        <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                                          {order.shippingInfo.address}<br />
                                          {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
                                        </p>
                                      </div>
                                      <div className="flex gap-4">
                                        {isCancelable && (
                                          <button onClick={(e) => { e.stopPropagation(); if (confirm("Are you sure you want to cancel this order?")) { handleCancelOrder(order.id, order.dbId); } }} className="btn-outline text-sm text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">Cancel Order</button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "addresses" && (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="font-serif text-2xl">Saved Addresses</h2>
                          <button onClick={handleAddAddress} className="btn-primary text-sm">Add New Address</button>
                        </div>
                        {addresses.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-border"><MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" /><p className="text-muted-foreground mb-4">No saved addresses</p><button onClick={handleAddAddress} className="btn-primary">Add Address</button></div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-4">
                            {addresses.map((address) => (
                              <div key={address.id} className={`border p-6 relative ${address.isDefault ? "border-primary bg-primary/5" : "border-border"}`}>
                                {address.isDefault && <span className="absolute top-4 right-4 text-xs text-primary flex items-center gap-1"><Check className="w-3 h-3" /> Default</span>}
                                <p className="font-medium mb-2">{address.name}</p>
                                <p className="text-sm text-muted-foreground">{address.address}</p>
                                <p className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.pincode}</p>
                                <p className="text-sm text-muted-foreground mt-2">{address.phone}</p>
                                <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                                  <button onClick={() => handleEditAddress(address.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-4 h-4" /> Edit</button>
                                  {!address.isDefault && <button onClick={() => handleSetDefaultAddress(address.id)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Set as Default</button>}
                                  <button onClick={() => handleDeleteAddress(address.id)} className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors ml-auto"><Trash2 className="w-4 h-4" /> Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "profile" && (
                      <div>
                        <h2 className="font-serif text-2xl mb-8">Profile Settings</h2>
                        <ProfileDetails profile={profile} onProfileUpdate={handleProfileUpdate} onPasswordUpdate={handlePasswordUpdate} />
                      </div>
                    )}

                    {activeTab === "wishlist" && (
                      <div>
                        <h2 className="font-serif text-2xl mb-6">My Wishlist</h2>
                        {wishlistItems.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-border"><Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" /><p className="text-muted-foreground mb-4">Your wishlist is empty</p><Link to="/shop" className="btn-primary">Explore Products</Link></div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {wishlistItems.map((item) => (
                              <div key={item.id} className="group relative">
                                <Link to={`/product/${item.id}`}>
                                  <div className="aspect-[3/4] bg-muted overflow-hidden mb-3"><img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                                  <h3 className="font-serif text-sm">{item.name}</h3>
                                  <p className="text-sm">{formatPrice(item.price)}</p>
                                </Link>
                                <button onClick={() => { removeFromWishlist(item.id); toast.success("Removed from wishlist"); }} className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <AddAddressForm
        isOpen={showAddAddressForm}
        onClose={() => { setShowAddAddressForm(false); setEditingAddressId(null); }}
        addresses={addresses}
        editingAddressId={editingAddressId}
        onSave={handleAddressSave}
      />
    </>
  );
};

export default Account;
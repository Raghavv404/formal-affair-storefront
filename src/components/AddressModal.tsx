import { useState } from "react";
import { X, Plus, Check, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
  mode?: "manage" | "select";
  onSelectAddress?: (address: Address) => void;
}

const addressSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(10, "Invalid phone number").max(15),
  address: z.string().min(5, "Address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  pincode: z.string().min(6, "Invalid pincode").max(6),
});

const AddressModal = ({ 
  isOpen, 
  onClose, 
  addresses, 
  onAddressesChange,
  mode = "manage",
  onSelectAddress,
}: AddressModalProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = addressSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    let updatedAddresses: Address[];
    
    if (editingId) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingId ? { ...addr, ...formData } : addr
      );
      toast.success("Address updated successfully");
    } else {
      const newAddress: Address = {
        id: `addr_${Date.now()}`,
        ...formData,
        isDefault: addresses.length === 0,
      };
      updatedAddresses = [...addresses, newAddress];
      toast.success("Address added successfully");
    }

    onAddressesChange(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
    setErrors({});
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    onAddressesChange(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    toast.success("Address deleted");
  };

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    onAddressesChange(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    toast.success("Default address updated");
  };

  const handleSelect = (address: Address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="font-serif text-xl">
            {mode === "select" ? "Select Delivery Address" : "Manage Addresses"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full border-2 border-dashed border-border p-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors mb-6"
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="border border-border p-6 mb-6 space-y-4">
              <h3 className="font-serif text-lg mb-4">
                {editingId ? "Edit Address" : "Add New Address"}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                      errors.name ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                      errors.phone ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                    errors.address ? "border-destructive" : "border-border"
                  }`}
                  placeholder="House no., Building, Street, Area"
                />
                {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                      errors.city ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                      errors.state ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground ${
                      errors.pincode ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.pincode && <p className="text-destructive text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary">
                  {editingId ? "Update Address" : "Save Address"}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`border p-6 relative ${
                    address.isDefault ? "border-primary bg-primary/5" : "border-border"
                  } ${mode === "select" ? "cursor-pointer hover:border-foreground transition-colors" : ""}`}
                  onClick={mode === "select" ? () => handleSelect(address) : undefined}
                >
                  {address.isDefault && (
                    <span className="absolute top-4 right-4 text-xs text-primary font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Default
                    </span>
                  )}
                  <p className="font-medium mb-2">{address.name}</p>
                  <p className="text-sm text-muted-foreground">{address.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{address.phone}</p>
                  
                  {mode === "manage" && (
                    <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                      <button 
                        onClick={() => handleEdit(address)}
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      {!address.isDefault && (
                        <button 
                          onClick={() => handleSetDefault(address.id)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Set as Default
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(address.id)}
                        className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : !showForm && (
            <p className="text-center text-muted-foreground py-8">No saved addresses yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressModal;

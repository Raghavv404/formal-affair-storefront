import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface AddAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  editingAddressId?: string | null;
  onSave: (addressData: Omit<Address, "id" | "isDefault">) => void;
}

type AddressFormData = Omit<Address, "id" | "isDefault">;
type AddressField = keyof AddressFormData;

// Zod validation schema with strict rules
const addressSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name cannot contain numbers"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number")
    .length(10, "Please enter a valid Indian mobile number"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits")
    .length(6, "Pincode must be exactly 6 digits"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

// Floating Label Input Component with enhanced features
interface FloatingLabelInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  rightIcon?: React.ReactNode;
  rightText?: string;
}

const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  maxLength,
  placeholder,
  disabled = false,
  rightIcon,
  rightText,
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;
  const hasError = !!error;

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          if (onBlur) onBlur();
        }}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 pt-6 pb-2 text-sm
          border
          bg-transparent
          focus:outline-none focus:ring-0
          transition-all duration-200
          ${hasError ? "border-red-500" : "border-black"}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          ${rightIcon || rightText ? "pr-20" : ""}
        `}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${shouldFloat
            ? "top-2 text-xs text-muted-foreground"
            : "top-4 text-sm text-muted-foreground"
          }
        `}
      >
        {label}
      </label>
      {(rightIcon || rightText) && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {rightText && (
            <span className={`text-xs ${rightText === "Checking..." ? "text-muted-foreground" : "text-green-600"}`}>
              {rightText}
            </span>
          )}
          {rightIcon}
        </div>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

const AddAddressForm = ({
  isOpen,
  onClose,
  addresses,
  editingAddressId,
  onSave,
}: AddAddressFormProps) => {
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Partial<Record<AddressField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<AddressField, boolean>>>({});
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [cityStateEditable, setCityStateEditable] = useState(false);

  // Load address data when editing
  useEffect(() => {
    if (editingAddressId && isOpen) {
      const addressToEdit = addresses.find(addr => addr.id === editingAddressId);
      if (addressToEdit) {
        setFormData({
          name: addressToEdit.name,
          phone: addressToEdit.phone,
          address: addressToEdit.address,
          city: addressToEdit.city,
          state: addressToEdit.state,
          pincode: addressToEdit.pincode,
        });
        setPincodeVerified(true);
        setCityStateEditable(true); // Allow editing when editing existing address
      }
    } else if (isOpen) {
      // Reset form when opening for new address
      setFormData({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      setErrors({});
      setTouched({});
      setPincodeVerified(false);
      setCityStateEditable(false);
    }
  }, [editingAddressId, isOpen, addresses]);

  // Watch pincode field for auto-fill
  useEffect(() => {
    const checkPincode = async () => {
      if (formData.pincode.length === 6 && /^\d{6}$/.test(formData.pincode)) {
        setIsCheckingPincode(true);
        setPincodeVerified(false);

        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await response.json();

          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: postOffice.District || "",
              state: postOffice.State || "",
            }));
            setPincodeVerified(true);
            setErrors(prev => ({
              ...prev,
              pincode: undefined,
              city: undefined,
              state: undefined,
            }));
          } else {
            // Invalid pincode
            setFormData(prev => ({
              ...prev,
              city: "",
              state: "",
            }));
            setPincodeVerified(false);
            setErrors(prev => ({
              ...prev,
              pincode: "Invalid Pincode",
            }));
          }
        } catch (error) {
          console.error("Error fetching pincode data:", error);
          setPincodeVerified(false);
          setErrors(prev => ({
            ...prev,
            pincode: "Failed to verify pincode. Please try again.",
          }));
        } finally {
          setIsCheckingPincode(false);
        }
      } else if (formData.pincode.length < 6) {
        setPincodeVerified(false);
        setErrors(prev => ({
          ...prev,
          pincode: undefined,
        }));
      }
    };

    // Only check if not editing or if pincode changed
    if (!editingAddressId || (editingAddressId && formData.pincode.length === 6)) {
      checkPincode();
    }
  }, [formData.pincode, editingAddressId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For name field - only allow letters and spaces
    if (name === "name") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: lettersOnly }));
      // Validate immediately for name
      if (lettersOnly.length > 0 && /[0-9]/.test(value)) {
        setErrors((prev) => ({ ...prev, name: "Name cannot contain numbers" }));
      } else if (errors.name) {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
    }
    // For phone and pincode, only allow digits
    else if (name === "phone" || name === "pincode") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));

      // Validate phone immediately
      if (name === "phone" && numericValue.length > 0) {
        if (numericValue.length === 10) {
          if (!/^[6-9]/.test(numericValue)) {
            setErrors((prev) => ({ ...prev, phone: "Please enter a valid Indian mobile number" }));
          } else {
            setErrors((prev) => ({ ...prev, phone: undefined }));
          }
        } else if (numericValue.length < 10) {
          setErrors((prev) => ({ ...prev, phone: undefined }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing (except for name which is handled above)
    if (name !== "name" && errors[name as AddressField]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: AddressField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate individual field on blur
    const fieldSchema = addressSchema.shape[field];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(formData[field]);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          [field]: result.error.errors[0]?.message,
        }));
      } else {
        // Clear error if validation passes
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }
  };

  // Check if all fields are valid
  const isFormValid = () => {
    const result = addressSchema.safeParse(formData);
    return result.success && pincodeVerified && formData.city.length > 0 && formData.state.length > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const result = addressSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<AddressField, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as AddressField;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      // Mark all fields as touched to show errors
      setTouched({
        name: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
      });
      return;
    }

    // Ensure pincode is verified
    if (!pincodeVerified || !formData.city || !formData.state) {
      toast.error("Please wait for pincode verification to complete");
      return;
    }

    // Call onSave callback with form data
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setErrors({});
    setTouched({});
    setPincodeVerified(false);
    setCityStateEditable(false);
    setIsCheckingPincode(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <FloatingLabelInput
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            error={touched.name ? errors.name : undefined}
          />

          {/* Mobile */}
          <FloatingLabelInput
            id="phone"
            label="Mobile"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
            error={touched.phone ? errors.phone : undefined}
            maxLength={10}
            placeholder=""
          />

          {/* Pincode */}
          <FloatingLabelInput
            id="pincode"
            label="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            onBlur={() => handleBlur("pincode")}
            error={touched.pincode ? errors.pincode : undefined}
            maxLength={6}
            placeholder=""
            rightIcon={
              isCheckingPincode ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : pincodeVerified ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : null
            }
            rightText={isCheckingPincode ? "Checking..." : pincodeVerified ? "Verified" : undefined}
          />

          {/* City */}
          <div className="relative">
            <FloatingLabelInput
              id="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              onBlur={() => handleBlur("city")}
              error={touched.city ? errors.city : undefined}
              disabled={!cityStateEditable && pincodeVerified}
            />
            {!cityStateEditable && pincodeVerified && (
              <button
                type="button"
                onClick={() => setCityStateEditable(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>

          {/* State */}
          <div className="relative">
            <FloatingLabelInput
              id="state"
              label="State"
              value={formData.state}
              onChange={handleChange}
              onBlur={() => handleBlur("state")}
              error={touched.state ? errors.state : undefined}
              disabled={!cityStateEditable && pincodeVerified}
            />
            {!cityStateEditable && pincodeVerified && (
              <button
                type="button"
                onClick={() => setCityStateEditable(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>

          {/* Address */}
          <FloatingLabelInput
            id="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            onBlur={() => handleBlur("address")}
            error={touched.address ? errors.address : undefined}
            placeholder=""
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isCheckingPincode}
            className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingAddressId ? "Update Address" : "Save Address"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressForm;
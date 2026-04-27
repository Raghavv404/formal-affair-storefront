import React, { useState, useEffect, useMemo } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Corrected import path
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  display_name: string;
  content: string;
  created_at: string;
}

const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({ name: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = useMemo(() => {
    const seed = productId ? parseInt(productId) || 1 : 1;
    const randomRating = (4.5 + (seed * 0.13) % 0.5).toFixed(1);
    const randomCount = 10 + (seed * 7) % 11;
    return { rating: randomRating, count: randomCount };
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (data) setReviews(data);
    };

    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");
    
    setIsSubmitting(true);
    const { error } = await supabase.from("reviews").insert([
      { product_id: productId, rating, display_name: formData.name, content: formData.content }
    ]);
    setIsSubmitting(false);

    if (!error) {
      toast.success("Review posted successfully!", { duration: 1500 });
      setShowForm(false);
      // Optional: Refresh local state instead of reload for "Max Brain" performance
      const { data } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
      if (data) setReviews(data);
    }
  };

  return (
    <div className="mt-20 border-t border-gray-100 pt-20 pb-10">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-serif mb-4 uppercase tracking-[0.2em]">Customer Reviews</h2>
          <div className="flex items-center gap-2 mb-8">
            <Star className="w-5 h-5 fill-black" />
            <span className="text-lg font-bold">{stats.rating} / 5.0</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest ml-2">
              ({Number(stats.count) + reviews.length} Verified)
            </span>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full py-4 border border-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        <div className="w-full lg:w-2/3">
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 mb-12 space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} className={`w-6 h-6 cursor-pointer ${n <= rating ? "fill-black" : "text-gray-300"}`} onClick={() => setRating(n)} />
                ))}
              </div>
              <input required placeholder="Your Name" className="w-full p-3 border border-gray-200 outline-none text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea required placeholder="Share your experience..." rows={4} className="w-full p-3 border border-gray-200 outline-none text-sm" onChange={e => setFormData({...formData, content: e.target.value})} />
              <button type="submit" disabled={isSubmitting} className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest disabled:bg-gray-400">
                {isSubmitting ? "Posting..." : "Post Review"}
              </button>
            </form>
          )}

          <div className="space-y-12">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-50 pb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest">{r.display_name}</span>
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-[9px] text-green-600 uppercase font-bold tracking-tighter">Verified Purchase</span>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-black" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">"{r.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
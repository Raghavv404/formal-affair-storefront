import whiteShirtModel1 from "@/assets/white-shirt-model-1.png";
import whiteShirtModel2 from "@/assets/white-shirt-model-2.png";
import whiteShirtModel3 from "@/assets/white-shirt-model-3.png";
import pinkNew1 from "@/assets/pink-shirt-new1.png";
import pinkNew2 from "@/assets/pink-shirt-new2.png";
import pinkNew3 from "@/assets/pink-shirt-new3.png";
import pinkNew4 from "@/assets/pink-shirt-new4.png";
import blueWhiteStripe1 from "@/assets/blue-white-stripe-1.png";
import blueWhiteStripe2 from "@/assets/blue-white-stripe-2.png";
import blueWhiteStripe3 from "@/assets/blue-white-stripe-3.png";
import greenStripe1 from "@/assets/green-stripe-1.png";
import greenStripe2 from "@/assets/green-stripe-2.png";
import greenStripe3 from "@/assets/green-stripe-3.png";
import blueYellowWhite1 from "@/assets/blue-yellow-white-1.png";
import blueYellowWhite2 from "@/assets/blue-yellow-white-2.png";
import blueYellowWhite3 from "@/assets/blue-yellow-white-3.png";

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  images: string[];
  description: string;
  isNew?: boolean;
  is_bestseller?: boolean; 
  category: string;
  availableSizes: string[];
  story: { title: string; emoji: string; meaning: string; quote: string; };
  fabric: { title: string; points: string[]; };
  fit: { model: string; notes: string[]; };
  washCare: string[];
}

const standardSizes = ["XS", "S", "M", "L", "XL"];

export const products: Product[] = [
  {
    id: "1", 
    name: "Classic White Shirt",
    price: 1299, // Updated Price
    mrp: 1899,   // Updated MRP
    image: whiteShirtModel1,
    images: [whiteShirtModel1, whiteShirtModel2, whiteShirtModel3],
    description: "The foundation of every elegant wardrobe. Crafted from the finest cotton, featuring imported pearl buttons.",
    isNew: false,
    is_bestseller: false,
    category: "shirts",
    availableSizes: standardSizes,
    story: {
      title: "The Clear Start", emoji: "🤍",
      meaning: "White represents clarity, freshness, and intention. The Clear Start is about stepping into your day with a clean mind and quiet confidence.",
      quote: "I'm clear. I'm prepared. I'm present."
    },
    fabric: { title: "Polycotton blend", points: ["Breathable, lightweight, and comfortable", "Relaxed fit with clean structure", "Back box pleat for ease of movement"] },
    fit: { model: "Model is 5'9\" and wears size S", notes: ["Fits true to size", "Take your normal size", "Designed for a relaxed fit"] },
    washCare: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"]
  },
  {
    id: "2", 
    name: "Pink White Stripe Shirt",
    price: 1299, // Updated Price
    mrp: 1899,   // Updated MRP
    image: pinkNew1,
    images: [pinkNew1, pinkNew2, pinkNew3, pinkNew4],
    description: "Warmth meets strength. Designed for those who lead with grace and confidence.",
    isNew: true,
    is_bestseller: true, // <-- PINK IS NOW THE BEST SELLER
    category: "shirts",
    availableSizes: standardSizes,
    story: {
      title: "The Poised Presence", emoji: "🌸",
      meaning: "Pink brings warmth and femininity, while poise adds strength and self-assurance. Soft in tone, strong in impact.",
      quote: "I'm confident, composed, and unmistakably myself."
    },
    fabric: { title: "Polycotton blend", points: ["Breathable, lightweight, and comfortable", "Relaxed fit with clean structure", "Back box pleat for ease of movement"] },
    fit: { model: "Model is 5'9\" and wears size S", notes: ["Fits true to size", "Take your normal size", "Designed for a relaxed fit"] },
    washCare: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"]
  },
  {
    id: "3", 
    name: "Blue White Stripe Shirt",
    price: 1299, // Updated Price
    mrp: 1899,   // Updated MRP
    image: blueWhiteStripe1,
    images: [blueWhiteStripe1, blueWhiteStripe2, blueWhiteStripe3],
    description: "Trust and intelligence woven into fabric. Reflects confidence that doesn't need to raise its voice.",
    isNew: false,
    is_bestseller: false, // <-- REMOVED BEST SELLER FROM BLUE
    category: "shirts",
    availableSizes: standardSizes,
    story: {
      title: "The Calm Command", emoji: "💙",
      meaning: "Blue is the color of trust and intelligence. It's designed for moments when control comes naturally and leadership feels effortless.",
      quote: "I'm steady, focused, and in control."
    },
    fabric: { title: "Polycotton blend", points: ["Breathable, lightweight, and comfortable", "Relaxed fit with clean structure", "Back box pleat for ease of movement"] },
    fit: { model: "Model is 5'9\" and wears size S", notes: ["Fits true to size", "Take your normal size", "Designed for a relaxed fit"] },
    washCare: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"]
  },
  {
    id: "4", 
    name: "Blue Yellow White Stripe Shirt",
    price: 1299, // Updated Price
    mrp: 1899,   // Updated MRP
    image: blueYellowWhite1,
    images: [blueYellowWhite1, blueYellowWhite2, blueYellowWhite3],
    description: "Clarity, optimism, and strength combined. Represents balance — focus with energy.",
    isNew: false,
    is_bestseller: false,
    category: "shirts",
    availableSizes: standardSizes,
    story: {
      title: "The Power Blend", emoji: "💙💛",
      meaning: "This shirt brings together clarity, optimism, and strength. It's made for forward movement and bold intent.",
      quote: "I'm moving forward — with purpose."
    },
    fabric: { title: "Polycotton blend", points: ["Breathable, lightweight, and comfortable", "Relaxed fit with clean structure", "Back box pleat for ease of movement"] },
    fit: { model: "Model is 5'9\" and wears size S", notes: ["Fits true to size", "Take your normal size", "Designed for a relaxed fit"] },
    washCare: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"]
  },
  {
    id: "5", 
    name: "Green White Stripe Shirt",
    price: 1299, // Updated Price
    mrp: 1899,   // Updated MRP
    image: greenStripe1,
    images: [greenStripe1, greenStripe2, greenStripe3],
    description: "Balance and grounded strength. The Green-White Stripe shirt embodies presence without pressure.",
    isNew: false,
    is_bestseller: false,
    category: "shirts",
    availableSizes: standardSizes,
    story: {
      title: "The Easy Authority", emoji: "💚",
      meaning: "Green stands for balance and grounded strength. This shirt moves with ease, just like the confidence of the person wearing it.",
      quote: "I belong here — comfortably."
    },
    fabric: { title: "Polycotton blend", points: ["Breathable, lightweight, and comfortable", "Relaxed fit with clean structure", "Back box pleat for ease of movement"] },
    fit: { model: "Model is 5'9\" and wears size S", notes: ["Fits true to size", "Take your normal size", "Designed for a relaxed fit"] },
    washCare: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getRandomProduct = (): Product => {
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
};
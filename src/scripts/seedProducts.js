import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
  {
    id: "1",
    name: "white shirt - The clear start",
    price: 1299,
    mrp: 1899,
    image: "/src/assets/white-shirt-model-1.png",
    images: ["/src/assets/white-shirt-model-1.png", "/src/assets/white-shirt-model-2.png", "/src/assets/white-shirt-model-3.png"],
    description: "The foundation of every elegant wardrobe. Our classic white shirt is crafted from the finest cotton, featuring impeccable construction and timeless design that transcends seasons.",
    details: ["100% Supima cotton", "Pearl buttons", "French cuffs option", "Machine washable"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Shirts",
    fabric: "Supima Cotton",
    fit: "Classic Fit",
    shirtStory: {
      title: "The Clear Start",
      emoji: "🤍",
      meaning: "White represents clarity, freshness, and intention. The Clear Start is about stepping into your day with a clean mind and quiet confidence. It's the shirt you wear when you want to feel reset, composed, and ready — no matter where you're headed.",
      whatItSays: "I'm clear. I'm prepared. I'm present."
    },
    fabricDetails: {
      material: "Polycotton blend",
      features: ["Breathable, lightweight, and comfortable for all-day wear"]
    },
    designDetails: [
      "Relaxed fit with clean structure",
      "Back box pleat for ease of movement",
      "Slightly longer length for added comfort",
      "Designed to hold its shape without stretch"
    ],
    sizeAndFit: {
      fitType: 'relaxed',
      stretchType: 'no-stretch',
      modelHeight: "5'9\"",
      modelMeasurements: {
        bust: "32\"",
        waist: "23\"",
        hip: "35\""
      },
      modelWearingSize: "UK Size 6",
      sizeMeasurements: {
        basedOnSize: "UK Size 6",
        totalLength: "70.5cm/27.7in",
        chest: "95cm/37.4in",
        sleeveLength: "62cm/24.4in"
      }
    },
    washCare: {
      mainLabelSize: "3INCH",
      sizeLabelSize: "1.5INCH",
      instructions: [
        "Machine wash cold with similar colors",
        "Do not bleach",
        "Tumble dry low",
        "Iron on low heat if needed",
        "Do not dry clean"
      ]
    },
    delivery: {
      estimatedDays: 7,
      returnPolicy: "Easy returns as per policy"
    },
    availableSizes: ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16"],
    isBestseller: false,
    isNew: false
  },
  {
    id: "2",
    name: "pink stripe - The Poised presence",
    price: 1299,
    mrp: 1899,
    image: "/src/assets/pink-shirt-new1.png",
    images: ["/src/assets/pink-shirt-new1.png", "/src/assets/pink-shirt-new2.png", "/src/assets/pink-shirt-new3.png", "/src/assets/pink-shirt-new4.png"],
    description: "A new pink shirt with a new design. Perfect for adding a touch of elegance to both casual and professional outfits.",
    details: ["100% Supima cotton", "Pearl buttons", "French cuffs option", "Machine washable"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Shirts",
    fabric: "Supima Cotton",
    fit: "Classic Fit",
    isNew: true,
    isBestseller: false,
    shirtStory: {
      title: "The Poised Presence",
      emoji: "🌸",
      meaning: "Pink brings warmth and femininity, while poise adds strength and self-assurance. The Poised Presence is designed for those who lead with grace and confidence. Soft in tone, strong in impact.",
      whatItSays: "I'm confident, composed, and unmistakably myself."
    },
    fabricDetails: {
      material: "Polycotton blend",
      features: ["Breathable, lightweight, and comfortable for all-day wear"]
    },
    designDetails: [
      "Relaxed fit with clean structure",
      "Back box pleat for ease of movement",
      "Slightly longer length for added comfort",
      "Designed to hold its shape without stretch"
    ],
    sizeAndFit: {
      fitType: 'relaxed',
      stretchType: 'no-stretch',
      modelHeight: "5'9\"",
      modelMeasurements: {
        bust: "32\"",
        waist: "23\"",
        hip: "35\""
      },
      modelWearingSize: "UK Size 6",
      sizeMeasurements: {
        basedOnSize: "UK Size 6",
        totalLength: "70.5cm/27.7in",
        chest: "95cm/37.4in",
        sleeveLength: "62cm/24.4in"
      }
    },
    washCare: {
      mainLabelSize: "3INCH",
      sizeLabelSize: "1.5INCH",
      instructions: [
        "Machine wash cold with similar colors",
        "Do not bleach",
        "Tumble dry low",
        "Iron on low heat if needed",
        "Do not dry clean"
      ]
    },
    delivery: {
      estimatedDays: 7,
      returnPolicy: "Easy returns as per policy"
    },
    availableSizes: ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16"]
  },
  {
    id: "3",
    name: "blue white stripe - The calm command",
    price: 1299,
    mrp: 1899,
    image: "/src/assets/blue-white-stripe-1.png",
    images: ["/src/assets/blue-white-stripe-1.png", "/src/assets/blue-white-stripe-2.png", "/src/assets/blue-white-stripe-3.png"],
    description: "A sophisticated blue and white striped shirt that exudes calm confidence. Perfect for commanding attention in any professional setting while maintaining effortless elegance.",
    details: ["Premium cotton blend", "Classic collar design", "Button-front closure", "Machine washable"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    isBestseller: false,
    category: "Shirts",
    fabric: "Cotton Blend",
    fit: "Regular Fit",
    shirtStory: {
      title: "blue white stripe - The calm command",
      emoji: "💙",
      meaning: "Blue is the color of trust and intelligence. The Calm Command reflects confidence that doesn't need to raise its voice. It's designed for moments when control comes naturally and leadership feels effortless.",
      whatItSays: "I'm steady, focused, and in control."
    },
    fabricDetails: {
      material: "Polycotton blend",
      features: ["Breathable, lightweight, and comfortable for all-day wear"]
    },
    designDetails: [
      "Relaxed fit with clean structure",
      "Back box pleat for ease of movement",
      "Slightly longer length for added comfort",
      "Designed to hold its shape without stretch"
    ],
    sizeAndFit: {
      fitType: 'relaxed',
      stretchType: 'no-stretch',
      modelHeight: "5'9\"",
      modelMeasurements: {
        bust: "32\"",
        waist: "23\"",
        hip: "35\""
      },
      modelWearingSize: "UK Size 6",
      sizeMeasurements: {
        basedOnSize: "UK Size 6",
        totalLength: "70.5cm/27.7in",
        chest: "95cm/37.4in",
        sleeveLength: "62cm/24.4in"
      }
    },
    washCare: {
      mainLabelSize: "3INCH",
      sizeLabelSize: "1.5INCH",
      instructions: [
        "Machine wash cold with similar colors",
        "Do not bleach",
        "Tumble dry low",
        "Iron on low heat if needed",
        "Do not dry clean"
      ]
    },
    delivery: {
      estimatedDays: 7,
      returnPolicy: "Easy returns as per policy"
    },
    availableSizes: ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16"]
  },
  {
    id: "4",
    name: "Blue - Yellow - White – The Power Blend",
    price: 1299,
    mrp: 1899,
    image: "/src/assets/blue-yellow-white-1.png",
    images: ["/src/assets/blue-yellow-white-1.png", "/src/assets/blue-yellow-white-2.png", "/src/assets/blue-yellow-white-3.png"],
    description: "A powerful blend of blue, yellow, and white stripes that commands attention. This shirt perfectly balances boldness with sophistication for the modern professional woman.",
    details: ["Premium cotton blend", "Classic collar design", "Button-front closure", "Machine washable"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    isBestseller: false,
    category: "Shirts",
    fabric: "Cotton Blend",
    fit: "Regular Fit",
    shirtStory: {
      title: "The Power Blend",
      emoji: "💙💛",
      meaning: "This shirt brings together clarity, optimism, and strength. The Power Blend represents balance — focus with energy, confidence with warmth. It's made for forward movement and bold intent.",
      whatItSays: "I'm moving forward — with purpose."
    },
    fabricDetails: {
      material: "Polycotton blend",
      features: ["Breathable, lightweight, and comfortable for all-day wear"]
    },
    designDetails: [
      "Relaxed fit with clean structure",
      "Back box pleat for ease of movement",
      "Slightly longer length for added comfort",
      "Designed to hold its shape without stretch"
    ],
    sizeAndFit: {
      fitType: 'relaxed',
      stretchType: 'no-stretch',
      modelHeight: "5'9\"",
      modelMeasurements: {
        bust: "32\"",
        waist: "23\"",
        hip: "35\""
      },
      modelWearingSize: "UK Size 6",
      sizeMeasurements: {
        basedOnSize: "UK Size 6",
        totalLength: "70.5cm/27.7in",
        chest: "95cm/37.4in",
        sleeveLength: "62cm/24.4in"
      }
    },
    washCare: {
      mainLabelSize: "3INCH",
      sizeLabelSize: "1.5INCH",
      instructions: [
        "Machine wash cold with similar colors",
        "Do not bleach",
        "Tumble dry low",
        "Iron on low heat if needed",
        "Do not dry clean"
      ]
    },
    delivery: {
      estimatedDays: 7,
      returnPolicy: "Easy returns as per policy"
    },
    availableSizes: ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16"]
  },
  {
    id: "5",
    name: "Green Stripe – The Easy Authority",
    price: 1299,
    mrp: 1899,
    image: "/src/assets/green-stripe-1.png",
    images: ["/src/assets/green-stripe-1.png", "/src/assets/green-stripe-2.png", "/src/assets/green-stripe-3.png"],
    description: "Effortless authority meets refined style in this green striped shirt. The calming green tones paired with classic stripes create a look of confident ease.",
    details: ["Premium cotton blend", "Classic collar design", "Button-front closure", "Machine washable"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    isBestseller: false,
    category: "Shirts",
    fabric: "Cotton Blend",
    fit: "Regular Fit",
    shirtStory: {
      title: "The Easy Authority",
      emoji: "💚",
      meaning: "Green stands for balance and grounded strength. The Easy Authority is about presence without pressure — authority that feels natural, not forced. This shirt moves with ease, just like the confidence of the person wearing it.",
      whatItSays: "I belong here — comfortably."
    },
    fabricDetails: {
      material: "Polycotton blend",
      features: ["Breathable, lightweight, and comfortable for all-day wear"]
    },
    designDetails: [
      "Relaxed fit with clean structure",
      "Back box pleat for ease of movement",
      "Slightly longer length for added comfort",
      "Designed to hold its shape without stretch"
    ],
    sizeAndFit: {
      fitType: 'relaxed',
      stretchType: 'no-stretch',
      modelHeight: "5'9\"",
      modelMeasurements: {
        bust: "32\"",
        waist: "23\"",
        hip: "35\""
      },
      modelWearingSize: "UK Size 6",
      sizeMeasurements: {
        basedOnSize: "UK Size 6",
        totalLength: "70.5cm/27.7in",
        chest: "95cm/37.4in",
        sleeveLength: "62cm/24.4in"
      }
    },
    washCare: {
      mainLabelSize: "3INCH",
      sizeLabelSize: "1.5INCH",
      instructions: [
        "Machine wash cold with similar colors",
        "Do not bleach",
        "Tumble dry low",
        "Iron on low heat if needed",
        "Do not dry clean"
      ]
    },
    delivery: {
      estimatedDays: 7,
      returnPolicy: "Easy returns as per policy"
    },
    availableSizes: ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16"]
  }
];

async function seedProducts() {
  console.log('🌱 Starting to seed products...');

  try {
    for (const product of products) {
      console.log(`📦 Inserting: ${product.name}`);
      
      const { data, error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          image: product.image,
          images: product.images,
          description: product.description,
          details: product.details,
          sizes: product.sizes,
          is_bestseller: product.isBestseller || false,
          is_new: product.isNew || false,
          category: product.category,
          fabric: product.fabric || null,
          fit: product.fit || null,
          
          // Shirt Story
          shirt_story_title: product.shirtStory?.title || null,
          shirt_story_emoji: product.shirtStory?.emoji || null,
          shirt_story_meaning: product.shirtStory?.meaning || null,
          shirt_story_what_it_says: product.shirtStory?.whatItSays || null,
          
          // Fabric Details
          fabric_material: product.fabricDetails?.material || null,
          fabric_features: product.fabricDetails?.features || null,
          
          // Design Details
          design_details: product.designDetails || null,
          
          // Size and Fit
          fit_type: product.sizeAndFit?.fitType || null,
          stretch_type: product.sizeAndFit?.stretchType || null,
          model_height: product.sizeAndFit?.modelHeight || null,
          model_bust: product.sizeAndFit?.modelMeasurements.bust || null,
          model_waist: product.sizeAndFit?.modelMeasurements.waist || null,
          model_hip: product.sizeAndFit?.modelMeasurements.hip || null,
          model_wearing_size: product.sizeAndFit?.modelWearingSize || null,
          size_based_on: product.sizeAndFit?.sizeMeasurements.basedOnSize || null,
          size_total_length: product.sizeAndFit?.sizeMeasurements.totalLength || null,
          size_chest: product.sizeAndFit?.sizeMeasurements.chest || null,
          size_sleeve_length: product.sizeAndFit?.sizeMeasurements.sleeveLength || null,
          
          // Wash Care
          wash_care_main_label_size: product.washCare?.mainLabelSize || null,
          wash_care_size_label_size: product.washCare?.sizeLabelSize || null,
          wash_care_instructions: product.washCare?.instructions || null,
          
          // Delivery
          delivery_estimated_days: product.delivery?.estimatedDays || null,
          delivery_return_policy: product.delivery?.returnPolicy || null,
          
          // Available Sizes
          available_sizes: product.availableSizes || null,
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error(`❌ Error inserting ${product.name}:`, error.message);
      } else {
        console.log(`✅ Successfully inserted: ${product.name}`);
      }
    }

    console.log('🎉 Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seed function
seedProducts();
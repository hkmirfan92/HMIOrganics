import type { Product } from '../types/index.ts';

export const PERSONAL_CARE_PRODUCTS: Product[] = [
  {
    id: 'tooth-powder',
    name: 'Herbal Tooth Powder',
    category: 'personal-care',
    subCategory: 'Oral Care',
    tagline: 'Ancient Dental Care with Clove & Rock Salt',
    description: 'A traditional and effective fluoride-free oral powder crafted with pure clove oil, babool bark, calcium carbonate, and cooling peppermint to whiten enamel and strengthen gums naturally.',
    volumeOrWeight: '60g Jar',
    pricePkr: 450,
    keyIngredients: ['Clove Oil', 'Babool (Acacia) Bark', 'Peppermint Essential Oil', 'Calcium Carbonate', 'Himalayan Rock Salt'],
    benefits: [
      'Relieves tooth sensitivity and gum bleeding',
      'Removes tea, coffee, and tobacco stains naturally',
      'Long-lasting fresh herbal breath',
      '100% chemical and microplastic free'
    ],
    howToUse: 'Dampen your toothbrush or clean fingertip, dab a small amount of powder, massage teeth and gum lines gently for 2 minutes, then rinse clean.',
    isBestseller: true,
    ecoHighlights: ['Zero Microplastics', 'Fluoride-Free', 'Reusable Glass Jar', 'Cruelty-Free']
  },
  {
    id: 'hair-growth-oil',
    name: 'Pure Herbal Hair Growth Oil',
    category: 'personal-care',
    subCategory: 'Hair Care',
    tagline: 'Deep Follicle Nourishment from Root to Tip',
    description: 'A therapeutic cold-pressed blend steeped with Bhringraj, Rosemary oil, Amla, Almond oil, and Black Seed (Kalonji) to stimulate dormant follicles, halt premature hair fall, and restore thick, lustrous shine.',
    volumeOrWeight: '120ml Amber Glass Dropper',
    pricePkr: 950,
    keyIngredients: ['Rosemary Essential Oil', 'Cold-Pressed Castor Oil', 'Bhringraj Extract', 'Amla', 'Pure Almond Oil', 'Black Seed (Kalonji)'],
    benefits: [
      'Visibly reduces hair fall within 3 weeks of regular use',
      'Stimulates new baby hair growth and thickens density',
      'Soothes dry, flaky scalp and dandruff',
      'Deeply conditions rough and split ends'
    ],
    howToUse: 'Section dry hair and use the dropper to apply directly to the scalp. Massage with fingertips in circular motions for 5–10 minutes. Leave for 2 hours or overnight, then wash with HMI Herbal Shampoo.',
    isBestseller: true,
    ecoHighlights: ['100% Pure Cold-Pressed', 'No Mineral Oil', 'No Synthetic Silicones', 'Recyclable Glass']
  },
  {
    id: 'herbal-shampoo',
    name: 'Nourishing Herbal Shampoo',
    category: 'personal-care',
    subCategory: 'Hair Care',
    tagline: 'Sulfate-Free Scalp Cleanser & Shine Restorer',
    description: 'Formulated with traditional Reetha (soapnut) and Shikakai for a mild, rich botanical lather. Infused with soothing Aloe Vera and botanical extracts to clean buildup without stripping natural lipids.',
    volumeOrWeight: '300ml Eco Bottle',
    pricePkr: 750,
    keyIngredients: ['Reetha (Soapnut) Glucoside', 'Shikakai Extract', 'Aloe Vera Leaf Gel', 'Nettle Leaf', 'Wild Mint Oil'],
    benefits: [
      'Gentle everyday scalp cleansing that balances natural sebum',
      'Zero harsh sulfates (SLS/SLES free)',
      'Restores natural bounce, softness, and volume',
      'Safe for color-treated and keratin-treated hair'
    ],
    howToUse: 'Wet hair thoroughly, apply a coin-sized amount into palms, work into scalp with gentle massage until natural herbal foam forms, then rinse clean with water.',
    isBestseller: false,
    ecoHighlights: ['Sulfate & Paraben Free', 'Plant-Derived Surfactants', 'Biodegradable Rinse', 'Color Safe']
  },
  {
    id: 'glycerin-soap',
    name: 'Handcrafted Glycerin Soap',
    category: 'personal-care',
    subCategory: 'Skin Care',
    tagline: 'Moisture-Rich Botanical Cleansing Bar',
    description: 'Slow-crafted artisan bath bar made with 100% vegetable glycerin, soothing lavender oil, and colloidal oat milk. Maintains your skin moisture barrier with a rich, creamy lather.',
    volumeOrWeight: '110g Hand-cut Bar',
    pricePkr: 380,
    keyIngredients: ['100% Pure Vegetable Glycerin', 'French Lavender Oil', 'Colloidal Oat Extract', 'Cold-Pressed Coconut Oil', 'Vitamin E'],
    benefits: [
      'Ultra-hydrating formula prevents post-shower tightness',
      'Gentle enough for facial cleansing and sensitive skin',
      'Free from tallow, artificial dyes, and harsh detergents',
      'Mild natural lavender aroma for relaxation'
    ],
    howToUse: 'Rub soap between wet hands or loofah to create rich, creamy lather. Wash body or face gently, then rinse with lukewarm water. Keep on a draining soap dish between uses.',
    isBestseller: true,
    ecoHighlights: ['Vegan & Cruelty Free', 'Plastic-Free Paper Wrap', 'Palm-Oil Conscious', 'Zero Detergents']
  },
  {
    id: 'herbal-handwash',
    name: 'Herbal Foaming Handwash',
    category: 'personal-care',
    subCategory: 'Skin Care',
    tagline: 'Botanical Antibacterial Defense with Tea Tree',
    description: 'A comforting, skin-softening handwash formulated with natural antimicrobial tea tree oil, neem extract, and fresh lemon peel to cleanse thoroughly while keeping hands soft throughout frequent daily washes.',
    volumeOrWeight: '300ml Pump Bottle',
    pricePkr: 420,
    keyIngredients: ['Tea Tree Essential Oil', 'Neem Leaf Extract', 'Lemon Peel Essence', 'Vegetable Glycerin', 'Aloe Vera Juice'],
    benefits: [
      'Naturally eliminates 99.9% common household germs',
      'No drying alcohols or harsh synthetic triclosan',
      'Leaves hands lightly scented with fresh crisp lemon & herbs',
      'Gentle on kids and delicate hands'
    ],
    howToUse: 'Dispense one pump onto wet hands. Lather between fingers, palms, and backs of hands for at least 20 seconds. Rinse cleanly with water.',
    isBestseller: false,
    ecoHighlights: ['Triclosan-Free', 'Food-Prep Safe', 'Non-Drying Botanical Base', 'Refill Friendly']
  }
];

export const HOME_CARE_PRODUCTS: Product[] = [
  {
    id: 'dishwash-liquid',
    name: 'Plant-Powered Dishwash Liquid',
    category: 'home-care',
    subCategory: 'Kitchen Care',
    tagline: 'Cuts Tough Grease, Safe on Hands & Dishes',
    description: 'An eco-friendly dishwashing concentrate powered by citrus bio-enzymes and coconut glucosides. Dissolves stubborn biryani oils, baked curries, and grease without leaving toxic synthetic film on utensils.',
    volumeOrWeight: '500ml Bottle',
    pricePkr: 480,
    keyIngredients: ['Citrus Bio-Enzymes', 'Coconut Glucoside', 'Lemon Oil', 'Aloe Vera Extract', 'Citric Acid'],
    benefits: [
      'Dissolves tough baked-on oil and stubborn grease effortlessly',
      'Rinses completely clean without any chemical residue on dinnerware',
      'Infused with aloe vera to keep hands soft during sink duty',
      'Non-toxic greywater runoff safe for garden watering'
    ],
    howToUse: 'Dilute 1 teaspoon in a small bowl of water or apply directly onto a wet scrub pad. Wash dishes, pots, and glasses, then rinse with running water.',
    isBestseller: true,
    ecoHighlights: ['Phosphates & Bleach Free', 'Non-Toxic Greywater', 'Plant Enzyme Action', 'Gentle on Hands']
  },
  {
    id: 'car-wash',
    name: 'Eco Car Wash Shampoo',
    category: 'home-care',
    subCategory: 'Auto Care',
    tagline: 'High-Foaming pH-Neutral Gloss Wash',
    description: 'A professional-grade, biodegradable automotive shampoo formulated to encapsulate grit, dirt, and road film safely without stripping wax, ceramic coatings, or protective sealants.',
    volumeOrWeight: '1 Liter Eco Bottle',
    pricePkr: 850,
    keyIngredients: ['Biodegradable Coconut Surfactants', 'Carnauba Wax Emulsion', 'Water Softening Minerals', 'Lime Citrus Peel'],
    benefits: [
      'High-foaming slick lather prevents swirl marks and scratches',
      'pH-neutral formula completely safe on all paint, clear coats, and vinyl wraps',
      'Infused with carnauba to boost glossy showroom shine after every wash',
      'Spot-free, fast sheeting rinse action'
    ],
    howToUse: 'Rinse loose dirt off vehicle with hose. Add 30-40ml of shampoo to a 10L bucket of water and agitate to create foam. Wash with a microfiber mitt from roof downwards, then rinse and dry with a microfiber towel.',
    isBestseller: true,
    ecoHighlights: ['pH Balanced 7.0', 'Wax & Ceramic Safe', '100% Biodegradable', 'Water Shedding Formula']
  },
  {
    id: 'kitchen-degreaser',
    name: 'Kitchen Degreaser & Heavy Cleaner',
    category: 'home-care',
    subCategory: 'Kitchen Care',
    tagline: 'Dissolves Baked-on Grease, Stovetop & Chimney Grime',
    description: 'Heavy-duty plant enzyme degreasing spray designed for heavy Pakistani kitchen cooking residue. Melts sticky oil films on stovetops, exhaust chimneys, microwave ovens, air fryers, and backsplash tiles.',
    volumeOrWeight: '500ml Trigger Spray',
    pricePkr: 550,
    keyIngredients: ['Natural Orange Terpenes (d-Limonene)', 'Plant-Based Degreasing Surfactants', 'Sodium Carbonate', 'Purified Water'],
    benefits: [
      'Dissolves hardened sticky cooking grease in under 3 minutes',
      'No corrosive caustic soda or choking chemical fumes',
      'Safe for stainless steel, tempered glass, ceramic tile, and marble',
      'Fresh natural orange peel fragrance'
    ],
    howToUse: 'Turn nozzle to spray. Spray directly onto oily or sticky surfaces. Allow 2–3 minutes for enzymes to break down oils. Wipe clean with a damp microfiber cloth or sponge.',
    isBestseller: true,
    ecoHighlights: ['No Caustic Soda', 'Zero Choking Fumes', 'Orange Terpene Solvent', 'Surface Safe']
  },
  {
    id: 'glass-cleaner',
    name: 'Crystal Clear Glass & Window Cleaner',
    category: 'home-care',
    subCategory: 'Surface Care',
    tagline: 'Streak-Free Clarity with Anti-Dust Shield',
    description: 'Ammonia-free glass cleaner made with grain alcohol and botanical vinegar essence. Leaves windows, mirrors, glass tables, and car windscreens crystal clear with a dust-repellent sheen.',
    volumeOrWeight: '500ml Trigger Spray',
    pricePkr: 420,
    keyIngredients: ['Grain Bio-Alcohol', 'Fermented Vinegar Essence', 'Purified Reverse Osmosis Water', 'Peppermint Oil'],
    benefits: [
      'Zero streaks, haze, or cloudy residues',
      'Ammonia-free: safe for tinted car windows and coated screens',
      'Natural anti-static property slows down dust accumulation',
      'Clean, crisp peppermint scent'
    ],
    howToUse: 'Mist lightly over glass or mirror from 15-20cm away. Wipe with a dry, lint-free microfiber cloth or squeegee in a smooth sweeping motion.',
    isBestseller: false,
    ecoHighlights: ['100% Ammonia Free', 'Tint-Safe Formula', 'Anti-Static Effect', 'Grain Bio-Ethanol']
  },
  {
    id: 'table-cleaner',
    name: 'Table & Multipurpose Surface Cleaner',
    category: 'home-care',
    subCategory: 'Surface Care',
    tagline: 'Quick-Drying Botanical Sanitizing Spray',
    description: 'An everyday versatile surface cleaner for dining tables, study desks, kitchen islands, laptop keyboards, and countertops. Neutralizes bacteria and sticky fingerprints with zero sticky residues.',
    volumeOrWeight: '500ml Trigger Spray',
    pricePkr: 460,
    keyIngredients: ['Eucalyptus Essential Oil', 'Thyme Herb Essence', 'Mild Plant Glucosides', 'Deionized Water'],
    benefits: [
      'Instantly lifts grease, food splatters, and finger smudges',
      'Dries quickly with no tacky or slippery residue',
      'Food-contact safe for dining tables and high-touch areas',
      'Subtle herbal eucalyptus aroma refreshes the living room'
    ],
    howToUse: 'Spray directly onto tabletop, laminate desk, granite, or wood surface. Wipe immediately with a dry cloth or paper towel. No rinsing needed.',
    isBestseller: false,
    ecoHighlights: ['Food-Contact Safe', 'Fast-Drying', 'Natural Antimicrobial', 'Family Safe']
  },
  {
    id: 'furniture-polish',
    name: 'Furniture & Car Protective Polish',
    category: 'home-care',
    subCategory: 'Polish & Shine',
    tagline: 'Deep Warm Luster with Beeswax & Carnauba',
    description: 'A dual-purpose rich conditioning cream crafted with natural beeswax and Brazilian carnauba. Feeds dry wood furniture to prevent cracking and restores deep hydrophobic gloss to car dashboards and exterior body panels.',
    volumeOrWeight: '250g Conditioning Cream',
    pricePkr: 890,
    keyIngredients: ['Pure Natural Beeswax', 'Refined Carnauba Wax', 'Cold-Pressed Linseed Oil', 'Citrus Solvent'],
    benefits: [
      'Revives tired wooden furniture, concealing minor micro-scratches',
      'Conditions car dashboards and leather seats without greasy glare',
      'Provides a durable water-beading barrier against moisture and spills',
      'Infused with subtle honey and citrus fragrance'
    ],
    howToUse: 'Use a dry microfiber cloth or foam applicator to rub a small amount into the wood or car trim in circular motions. Allow to set for 5 minutes, then buff lightly with a clean cloth for a silky shine.',
    isBestseller: true,
    ecoHighlights: ['Natural Beeswax & Carnauba', 'No Petrochemical Solvents', 'Long-Lasting Seal', 'UV Barrier']
  },
  {
    id: 'floor-cleaner-phenyl',
    name: 'Herbal Disinfectant Floor Cleaner & Phenyl',
    category: 'home-care',
    subCategory: 'Disinfection & Floors',
    tagline: 'Pine Oil & Citronella Natural Germ Shield',
    description: 'A safe, non-corrosive alternative to harsh synthetic phenyls. Blended with real alpine pine oil and insect-deterring citronella to eliminate bacteria, deter ants and flies, and impart a clean garden scent.',
    volumeOrWeight: '1 Liter Concentrated Bottle',
    pricePkr: 490,
    keyIngredients: ['Pure Pine Essential Oil', 'Ceylon Citronella Oil', 'Neem Leaf Extract', 'Botanical Surfactants'],
    benefits: [
      'Disinfects marble, tile, ceramic, and hardwood floors safely',
      'Naturally deters crawling insects, ants, and flies',
      'Zero toxic chlorine or harsh synthetic black-phenyl odor',
      'Safe for crawling babies, toddlers, and pets'
    ],
    howToUse: 'Add 1 to 2 caps (30–60ml) into half a bucket of mop water (approx. 5 Liters). Mop floors thoroughly. No rinse required.',
    isBestseller: true,
    ecoHighlights: ['Non-Corrosive', 'Pet & Child Safe', 'Pine & Citronella Base', 'Fly & Insect Deterrent']
  },
  {
    id: 'laundry-powder',
    name: 'Eco Laundry Powder & Robin Blue Neel',
    category: 'home-care',
    subCategory: 'Laundry Care',
    tagline: 'Bio-Enzymatic Stain Release & Dazzling Whites',
    description: 'A gentle yet formidable laundry solution containing oxygen-based stain lifters and natural washing minerals, paired with a bottle of classic Robin Blue Neel fabric brightener for timeless crisp white kurtas, shirts, and bed linens.',
    volumeOrWeight: '1kg Eco Box + 100ml Liquid Neel',
    pricePkr: 580,
    keyIngredients: ['Natural Washing Soda', 'Oxygen Bio-Enzymes', 'Pure Vegetable Soap Flakes', 'Ultramarine Blue Mineral Neel', 'Lavender Essence'],
    benefits: [
      'Removes stubborn dirt from cuffs, collars, and kids clothes',
      'Robin Blue Neel restores dazzling brightness to white cottons without yellowing',
      'Dissolves readily in cold or warm water in top-load & front-load machines',
      'Zero synthetic optical bleaches that cause skin irritation'
    ],
    howToUse: 'For Machine: Add 1 scoop (40g) into detergent drawer. For Whites: Dilute 4-5 drops of Robin Blue Neel into the final rinse water bucket, dip whites evenly for 1 minute, and dry.',
    isBestseller: false,
    ecoHighlights: ['Bleach & Optical Brightener Free', 'Hypoallergenic on Skin', 'Machine & Handwash Safe', 'Enzyme Stain Power']
  }
];

export const ALL_PRODUCTS: Product[] = [
  ...PERSONAL_CARE_PRODUCTS,
  ...HOME_CARE_PRODUCTS
];

export const BRAND_INFO = {
  name: 'HMI Organics',
  tagline: 'Pure, Natural & Trusted Care for Home and Body',
  phone: '+92 305 2211093',
  phoneRaw: '923052211093',
  email: 'hmiorganicspk@gmail.com',
  whatsAppUrl: 'https://wa.me/923052211093',
  location: 'Karachi, Pakistan (Nationwide Delivery)',
  address: 'C 65/29, 2nd Floor, Street 2, Punjab Colony, Karachi.',
  deliveryNotice: 'Delivering across Karachi, Lahore, Islamabad, Faisalabad, Peshawar, and all of Pakistan',
  logoUrl: '/assets/aistudio/IMG-20261007-WA0000-Photoroom_407330cc.png',
  faviconUrl: '/favicon.png'
};

export const TRUST_BADGES = [
  {
    title: '100% Herbal & Pure',
    description: 'Cold-pressed oils, wild botanicals, and zero synthetic parabens or harsh sulfates.'
  },
  {
    title: 'Safe for Home & Pets',
    description: 'Child-friendly and pet-safe formulations without toxic caustic chemicals or choking fumes.'
  },
  {
    title: 'Direct WhatsApp Concierge',
    description: 'Personalized customer service and lightning-fast nationwide delivery confirmation.'
  },
  {
    title: 'Eco-Friendly & Biodegradable',
    description: 'Responsible packaging, plant-based surfactants, and zero harmful greywater runoff.'
  }
];

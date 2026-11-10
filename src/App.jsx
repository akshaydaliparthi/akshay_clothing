import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Sun,
  Moon,
  User,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Star,
  SlidersHorizontal,
  Trash2,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Ruler,
  Package,
  MapPin,
  CreditCard,
  Lock,
  BarChart3,
  Layers,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Info,
  Instagram,
  Globe,
  Mail,
  Phone,
  Clock,
  Filter,
  RefreshCw,
  LogOut,
  Settings,
  Terminal,
  Tag,
  Award,
  Flame,
  Zap,
  HelpCircle,
  FileText,
  ExternalLink,
  Copy,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SAFE LOCAL STORAGE HELPERS & CUSTOM HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

function safeGetStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignore storage quota / sandbox iframe errors
  }
}

function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function formatINR(amount) {
  const num = Number(amount) || 0;
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MOCK PRODUCT CATALOG (24 REALISTIC URBAN STREETWEAR ITEMS ACROSS 6 CATEGORIES)
// ═══════════════════════════════════════════════════════════════════════════════

const INITIAL_PRODUCTS = [
  // ─── T-SHIRTS (4) ───
  {
    id: 'ak-tee-01',
    sku: 'AK-AW26-T01',
    title: 'KINETIC HEAVYWEIGHT BOXY TEE',
    subtitle: '280 GSM Combed Organic Cotton • Drop Shoulder',
    category: 'T-Shirts',
    price: 1699,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 142,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'tee-graphic',
    badgeText: 'AW26 DROP',
    colors: [
      { name: 'Obsidian Black', hex: '#141416' },
      { name: 'Signal Red', hex: '#E63946' },
      { name: 'Concrete Grey', hex: '#8E959E' },
      { name: 'Chalk White', hex: '#F2F3F5' },
    ],
    sizes: { XS: 5, S: 12, M: 18, L: 9, XL: 4, XXL: 0 },
    fabric: '100% GOTS-Certified Organic Ring-Spun Cotton (280 GSM)',
    care: 'Machine wash cold inside-out. Do not tumble dry. Iron on reverse away from puff print.',
    fit: 'Oversized boxy fit with dropped shoulders and a thick 1.2-inch ribbed crew collar.',
    description:
      'Engineered for structure and drape, the Kinetic Heavyweight Boxy Tee is cut from custom-milled 280 GSM organic jersey. Finished with high-density archival typography on the back and a tonal silicon chest emblem.',
    completeLookIds: ['ak-btm-01', 'ak-jkt-01', 'ak-acc-01'],
  },
  {
    id: 'ak-tee-02',
    sku: 'AK-AW26-T02',
    title: 'ACID-WASH CYBERPUNK GRAPHIC TEE',
    subtitle: '260 GSM Enzyme Vintage Wash • Puff Ink Back Print',
    category: 'T-Shirts',
    price: 1899,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 98,
    isNewDrop: true,
    isBestSeller: false,
    onSale: true,
    silhouette: 'tee-acid',
    badgeText: 'LIMITED EDITION',
    colors: [
      { name: 'Charcoal Wash', hex: '#36454F' },
      { name: 'Amethyst Haze', hex: '#6B3FA0' },
      { name: 'Midnight Cyan', hex: '#114B5F' },
    ],
    sizes: { XS: 3, S: 8, M: 14, L: 11, XL: 6, XXL: 2 },
    fabric: '100% Cotton Terry-Backed Jersey (260 GSM) with Custom Enzyme Wash',
    care: 'Hand wash or gentle cold cycle separately. Shade dry flat.',
    fit: 'Relaxed streetwear silhouette. Take your normal size for an intentional oversized drape.',
    description:
      'Each piece undergoes an artisanal enzyme mineral wash for a one-of-a-kind distressed patina. Features neo-brutalist schematics across the shoulder blades in crackle-resistant plastisol ink.',
    completeLookIds: ['ak-btm-02', 'ak-acc-02'],
  },
  {
    id: 'ak-tee-03',
    sku: 'AK-CORE-T03',
    title: 'ARCHITECT ESSENTIAL RIB-KNIT TEE',
    subtitle: '240 GSM Pima Interlock • Minimalist Seam Detailing',
    category: 'T-Shirts',
    price: 1299,
    originalPrice: 1299,
    rating: 4.7,
    reviewsCount: 215,
    isNewDrop: false,
    isBestSeller: true,
    onSale: false,
    silhouette: 'tee-minimal',
    badgeText: 'CORE ESSENTIAL',
    colors: [
      { name: 'Jet Black', hex: '#0A0A0B' },
      { name: 'Moonlit Silver', hex: '#C9CED6' },
      { name: 'Olive Drab', hex: '#4A5D4E' },
      { name: 'Raw Ecru', hex: '#E8E2D5' },
    ],
    sizes: { XS: 10, S: 20, M: 25, L: 19, XL: 12, XXL: 7 },
    fabric: '95% Long-Staple Pima Cotton, 5% Elastane Micro-Rib (240 GSM)',
    care: 'Gentle machine wash at 30°C. Lay flat to maintain rib recovery.',
    fit: 'Structured athletic-modern cut with clean twin-needle hem and reverse-lock side seams.',
    description:
      'The foundation of any modern capsule wardrobe. Ultra-smooth interlock knit that resists torque and collar sagging after 100+ washes.',
    completeLookIds: ['ak-btm-03', 'ak-sh-01'],
  },
  {
    id: 'ak-tee-04',
    sku: 'AK-AW26-T04',
    title: 'MONOLITH LONG-SLEEVE MESH LAYER TEE',
    subtitle: '250 GSM Waffle-Knit Sleeves • Layered Fake-Two-Piece',
    category: 'T-Shirts',
    price: 2199,
    originalPrice: 2699,
    rating: 4.6,
    reviewsCount: 64,
    isNewDrop: true,
    isBestSeller: false,
    onSale: true,
    silhouette: 'tee-long',
    badgeText: 'NEW DROP',
    colors: [
      { name: 'Onyx / Silver', hex: '#22262B' },
      { name: 'Crimson / Black', hex: '#9E1B24' },
    ],
    sizes: { XS: 0, S: 6, M: 11, L: 8, XL: 3, XXL: 1 },
    fabric: '100% Combed Cotton Body + Thermal Waffle-Knit Contrast Sleeves',
    care: 'Wash cold with similar colors. Do not bleach.',
    fit: 'Dropped shoulder layered skate-inspired fit with thumbhole cuffs.',
    description:
      'Merges late-90s underground skate layering with clean contemporary tailoring. Contrast waffle sleeves feature tonal embroidered coordinates along the forearm.',
    completeLookIds: ['ak-btm-01', 'ak-acc-03'],
  },

  // ─── SHIRTS (4) ───
  {
    id: 'ak-sh-01',
    sku: 'AK-AW26-S01',
    title: 'NOCTURNE REVERE COLLAR SATIN SHIRT',
    subtitle: 'Fluid Matte Cupro-Blend • Architectural Camp Collar',
    category: 'Shirts',
    price: 2799,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 87,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'shirt-camp',
    badgeText: 'BEST SELLER',
    colors: [
      { name: 'Shadow Amethyst', hex: '#4B2878' },
      { name: 'Liquid Charcoal', hex: '#2B353D' },
      { name: 'Champagne Silver', hex: '#D4D8DF' },
    ],
    sizes: { XS: 4, S: 9, M: 15, L: 12, XL: 5, XXL: 0 },
    fabric: '65% Cupro Modal, 35% Lenzing Ecovero Viscose (185 GSM)',
    care: 'Dry clean or cold hand wash. Steam while damp.',
    fit: 'Relaxed camp-collar boxy drape with split side vents and smoked mother-of-pearl buttons.',
    description:
      'Designed for effortless transition from daylight gallery walks to late-night sets. The heavyweight cupro blend delivers a cool, silk-like handfeel without excessive shine.',
    completeLookIds: ['ak-tee-03', 'ak-btm-03'],
  },
  {
    id: 'ak-sh-02',
    sku: 'AK-AW26-S02',
    title: 'UTILITY RIPSTOP OVERSHIRT SHACKET',
    subtitle: '310 GSM Crosshatch Cotton Ripstop • Concealed Snap Placket',
    category: 'Shirts',
    price: 3299,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 112,
    isNewDrop: false,
    isBestSeller: true,
    onSale: true,
    silhouette: 'shirt-overshirt',
    badgeText: 'URBAN UTILITY',
    colors: [
      { name: 'Tactical Slate', hex: '#36454F' },
      { name: 'Cargo Olive', hex: '#3D4B3E' },
      { name: 'Obsidian', hex: '#121214' },
    ],
    sizes: { XS: 2, S: 11, M: 16, L: 14, XL: 8, XXL: 4 },
    fabric: '100% Military-Spec Crosshatch Cotton Ripstop (310 GSM)',
    care: 'Machine wash warm. Tumble dry low.',
    fit: 'Structured overshirt cut designed to layer smoothly over heavyweight tees or hoodies.',
    description:
      'Featuring dual bellows chest pockets with magnetic fidlock-style flaps and articulated elbow darts, this overshirt bridges workwear resilience and sleek gallery minimalism.',
    completeLookIds: ['ak-tee-01', 'ak-btm-02'],
  },
  {
    id: 'ak-sh-03',
    sku: 'AK-CORE-S03',
    title: 'DISTORTION CHECK BRUSHED FLANNEL',
    subtitle: '290 GSM Yarn-Dyed Twill • Raw Hem Detail',
    category: 'Shirts',
    price: 2599,
    originalPrice: 2599,
    rating: 4.7,
    reviewsCount: 73,
    isNewDrop: false,
    isBestSeller: false,
    onSale: false,
    silhouette: 'shirt-flannel',
    badgeText: 'YARN DYED',
    colors: [
      { name: 'Crimson / Charcoal', hex: '#B82937' },
      { name: 'Cyan / Onyx', hex: '#008DA5' },
    ],
    sizes: { XS: 5, S: 10, M: 13, L: 9, XL: 6, XXL: 2 },
    fabric: '100% Double-Brushed Yarn-Dyed Cotton Flannel (290 GSM)',
    care: 'Machine wash cold. Hang dry.',
    fit: 'Generous streetwear cut with slightly elongated sleeves and matte metal buttons.',
    description:
      'Custom-woven check pattern with subtle ombre gradient transitions. Double-brushed on the exterior for a plush halo texture.',
    completeLookIds: ['ak-tee-03', 'ak-btm-01'],
  },
  {
    id: 'ak-sh-04',
    sku: 'AK-AW26-S04',
    title: 'ASYMMETRIC POPLIN ARCHITECT SHIRT',
    subtitle: 'Crisp 160 GSM High-Twist Poplin • Diagonal Placket',
    category: 'Shirts',
    price: 2999,
    originalPrice: 3599,
    rating: 4.9,
    reviewsCount: 51,
    isNewDrop: true,
    isBestSeller: false,
    onSale: true,
    silhouette: 'shirt-architect',
    badgeText: 'EDITORIAL PICK',
    colors: [
      { name: 'Optic White', hex: '#F7F8FA' },
      { name: 'Pitch Black', hex: '#0D0E11' },
      { name: 'Steel Mist', hex: '#A4ADB8' },
    ],
    sizes: { XS: 3, S: 7, M: 10, L: 6, XL: 0, XXL: 0 },
    fabric: '100% High-Twist Compact Cotton Poplin (160 GSM)',
    care: 'Cold gentle wash. Steam press.',
    fit: 'Tailored shoulders with a relaxed torso and signature offset button closure.',
    description:
      'A deconstructed take on formal shirting. Features a concealed diagonal placket, mitered cuffs, and a subtle D-ring harness tab at the back yoke.',
    completeLookIds: ['ak-btm-03', 'ak-acc-04'],
  },

  // ─── HOODIES (4) ───
  {
    id: 'ak-hd-01',
    sku: 'AK-AW26-H01',
    title: 'APEX 480 GSM FRENCH TERRY HOODIE',
    subtitle: 'Ultra-Heavyweight Loopback • Double-Lined Structured Hood',
    category: 'Hoodies',
    price: 3499,
    originalPrice: 4499,
    rating: 5.0,
    reviewsCount: 284,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'hoodie-pullover',
    badgeText: 'CULT FAVORITE',
    colors: [
      { name: 'Jet Black', hex: '#0A0A0B' },
      { name: 'Royal Amethyst', hex: '#6B3FA0' },
      { name: 'Charcoal Slate', hex: '#36454F' },
      { name: 'Signal Red', hex: '#E63946' },
    ],
    sizes: { XS: 6, S: 15, M: 22, L: 14, XL: 8, XXL: 3 },
    fabric: '100% Combed Cotton Heavy Loopback French Terry (480 GSM)',
    care: 'Turn inside out. Machine wash cold. Dry flat.',
    fit: 'Boxy cropped-waist proportion with wide rib waistband and zero-drawstring minimalist hood.',
    description:
      'Our flagship silhouette. Constructed from custom 480 GSM loopback terry that holds an architectural shape around the hood and shoulders without feeling stiff.',
    completeLookIds: ['ak-btm-04', 'ak-acc-01'],
  },
  {
    id: 'ak-hd-02',
    sku: 'AK-AW26-H02',
    title: 'VORTEX FULL-ZIP SCUBA TECH HOODIE',
    subtitle: 'Two-Way Matte YKK Excella Zipper • Articulated Seams',
    category: 'Hoodies',
    price: 3899,
    originalPrice: 4699,
    rating: 4.8,
    reviewsCount: 119,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'hoodie-zip',
    badgeText: 'AW26 DROP',
    colors: [
      { name: 'Obsidian / Cyan', hex: '#101419' },
      { name: 'Ash Silver', hex: '#B8C0C8' },
      { name: 'Deep Violet', hex: '#4C2A78' },
    ],
    sizes: { XS: 4, S: 10, M: 17, L: 12, XL: 5, XXL: 1 },
    fabric: '78% Cotton, 16% Polyester, 6% Spandex Scuba Interlock (410 GSM)',
    care: 'Zip closed before washing cold. Do not iron zipper tape.',
    fit: 'Ergonomic tech-street fit with high chin-guard storm collar and zippered welt pockets.',
    description:
      'Engineered with a two-way oxidized metal zipper so you can style the silhouette open at the hem. Includes a hidden sleeve pass pocket for metro cards or AirPods.',
    completeLookIds: ['ak-tee-01', 'ak-btm-02'],
  },
  {
    id: 'ak-hd-03',
    sku: 'AK-CORE-H03',
    title: 'RELIC PIGMENT-DYED DISTRESSED HOODIE',
    subtitle: '450 GSM Brushed Fleece • Hand-Abrazed Edges',
    category: 'Hoodies',
    price: 3699,
    originalPrice: 3699,
    rating: 4.7,
    reviewsCount: 92,
    isNewDrop: false,
    isBestSeller: false,
    onSale: false,
    silhouette: 'hoodie-distressed',
    badgeText: 'ARTISAN WASH',
    colors: [
      { name: 'Washed Graphite', hex: '#3D434A' },
      { name: 'Faded Burgundy', hex: '#6E2530' },
    ],
    sizes: { XS: 2, S: 8, M: 11, L: 7, XL: 4, XXL: 0 },
    fabric: '100% Ring-Spun Cotton Brushed Fleece (450 GSM)',
    care: 'Wash cold separately due to natural pigment dye character.',
    fit: 'Oversized vintage fit with drop shoulders and subtle distressing along pocket edges.',
    description:
      'Garment-dyed in small batches for rich highs and lows along every triple-stitched seam. Features an embossed tonal leather brand patch at the back neck.',
    completeLookIds: ['ak-btm-01', 'ak-acc-02'],
  },
  {
    id: 'ak-hd-04',
    sku: 'AK-AW26-H04',
    title: 'MODULAR SLEEVELESS BOX-CUT GILET HOODIE',
    subtitle: '430 GSM Terry • Raw Armhole Cut for Layering',
    category: 'Hoodies',
    price: 2699,
    originalPrice: 3199,
    rating: 4.6,
    reviewsCount: 44,
    isNewDrop: true,
    isBestSeller: false,
    onSale: true,
    silhouette: 'hoodie-gilet',
    badgeText: 'LAYER PIECE',
    colors: [
      { name: 'Jet Black', hex: '#0A0A0B' },
      { name: 'Moonlit Silver', hex: '#C9CED6' },
    ],
    sizes: { XS: 5, S: 9, M: 12, L: 8, XL: 3, XXL: 2 },
    fabric: '100% Organic French Terry (430 GSM)',
    care: 'Machine wash cold. Lay flat.',
    fit: 'Wide shoulder cap with deep armholes designed to layer over long-sleeve tees or flannels.',
    description:
      'Adds instant dimensional proportion to transitional outfits without overheating in Indian metro climates.',
    completeLookIds: ['ak-tee-04', 'ak-btm-04'],
  },

  // ─── JACKETS (4) ───
  {
    id: 'ak-jkt-01',
    sku: 'AK-AW26-J01',
    title: 'AERO WATER-REPELLENT TECHNICAL SHELL JACKET',
    subtitle: '3-Layer Membrane • Sealed Seams & Internal Carry Straps',
    category: 'Jackets',
    price: 5999,
    originalPrice: 7499,
    rating: 4.9,
    reviewsCount: 163,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'jacket-shell',
    badgeText: 'FLAGSHIP TECH',
    colors: [
      { name: 'Stealth Black', hex: '#0A0A0B' },
      { name: 'Cyber Amethyst', hex: '#5A318C' },
      { name: 'Glacier Silver', hex: '#C2C9D1' },
    ],
    sizes: { XS: 3, S: 9, M: 14, L: 10, XL: 5, XXL: 2 },
    fabric: '3-Layer Ripstop Nylon with 10,000mm DWR Waterproof Breathable Membrane',
    care: 'Wipe clean or gentle cold wash with technical detergent. Do not fabric-soften.',
    fit: 'Articulated shell fit with adjustable storm hood, pit vents, and drawcord hem.',
    description:
      'Built for monsoon downpours and midnight city commutes. Features six weatherproof AquaGuard pockets and removable internal backpack sling straps so you can wear it off-shoulder indoors.',
    completeLookIds: ['ak-tee-01', 'ak-btm-02', 'ak-acc-03'],
  },
  {
    id: 'ak-jkt-02',
    sku: 'AK-AW26-J02',
    title: 'VARSITY ARCHIVE VEGAN LEATHER BOMBER',
    subtitle: 'Melton Wool Body • Matte Pebble Grain Sleeves',
    category: 'Jackets',
    price: 6499,
    originalPrice: 7999,
    rating: 4.9,
    reviewsCount: 108,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'jacket-varsity',
    badgeText: 'COLLECTOR PIECE',
    colors: [
      { name: 'Black / Signal Red', hex: '#B81D2A' },
      { name: 'Charcoal / Silver', hex: '#36454F' },
    ],
    sizes: { XS: 2, S: 7, M: 11, L: 8, XL: 4, XXL: 0 },
    fabric: '650 GSM Recycled Wool Blend Body + Cruelty-Free Microfiber Pebble Leather Sleeves',
    care: 'Specialist dry clean only.',
    fit: 'Boxy varsity bomber cut with heavy striped knit trim and quilted satin lining.',
    description:
      'Chain-stitched bouclé chenille patches meet minimalist architectural typography. Quilted internal lining features a dedicated phone pocket and numbered edition woven label.',
    completeLookIds: ['ak-tee-03', 'ak-btm-01'],
  },
  {
    id: 'ak-jkt-03',
    sku: 'AK-CORE-J03',
    title: 'RAW SELVEDGE TYPE-III DENIM TRUCKER',
    subtitle: '14oz Japanese Indigo Rope-Dyed Denim • Contrast Bar-Tacks',
    category: 'Jackets',
    price: 4999,
    originalPrice: 4999,
    rating: 4.8,
    reviewsCount: 89,
    isNewDrop: false,
    isBestSeller: false,
    onSale: false,
    silhouette: 'jacket-trucker',
    badgeText: '14OZ SELVEDGE',
    colors: [
      { name: 'Raw Indigo', hex: '#1F2F46' },
      { name: 'Sulfur Black', hex: '#181A1D' },
    ],
    sizes: { XS: 4, S: 10, M: 15, L: 11, XL: 6, XXL: 3 },
    fabric: '100% Cotton 14oz Red-Line Selvedge Denim',
    care: 'Spot clean or cold soak inside out. Hang dry.',
    fit: 'Modernized Type-III boxy silhouette with dropped shoulders and deep internal pouch pockets.',
    description:
      'Breaks in uniquely to your movement patterns over time. Finished with custom gunmetal donut shanks and selvedge ID visible inside the front placket.',
    completeLookIds: ['ak-btm-01', 'ak-tee-03'],
  },
  {
    id: 'ak-jkt-04',
    sku: 'AK-AW26-J04',
    title: 'THERMAL CLOUD PUFFER VEST',
    subtitle: '3M Thinsulate Featherless Fill • High Funnel Collar',
    category: 'Jackets',
    price: 4299,
    originalPrice: 5299,
    rating: 4.7,
    reviewsCount: 57,
    isNewDrop: true,
    isBestSeller: false,
    onSale: true,
    silhouette: 'jacket-vest',
    badgeText: 'WINTER READY',
    colors: [
      { name: 'Matte Onyx', hex: '#121316' },
      { name: 'Electric Cyan Accent', hex: '#00A8BD' },
      { name: 'Titanium Silver', hex: '#B4BCC6' },
    ],
    sizes: { XS: 5, S: 11, M: 13, L: 9, XL: 4, XXL: 1 },
    fabric: 'Matte Nylon Tactel Shell + Recycled 3M Featherless Insulation',
    care: 'Machine wash cold gentle cycle. Tumble dry low with tennis balls.',
    fit: 'Oversized baffle proportion with hidden elastic hem cinch.',
    description:
      'High-loft warmth without bulk. Designed specifically to layer over our 480 GSM Apex Hoodie for sharp winter proportions.',
    completeLookIds: ['ak-hd-01', 'ak-btm-04'],
  },

  // ─── BOTTOMS: JEANS & JOGGERS (4) ───
  {
    id: 'ak-btm-01',
    sku: 'AK-AW26-B01',
    title: 'COLOSSUS WIDE-LEG CARPENTER DENIM JEANS',
    subtitle: '13.5oz Vintage Wash Denim • Double-Knee Paneling',
    category: 'Bottoms',
    price: 3299,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 196,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'bottom-jeans',
    badgeText: 'BEST SELLER',
    colors: [
      { name: 'Washed Slate Black', hex: '#282C32' },
      { name: 'Vintage Ice Blue', hex: '#6D88A3' },
      { name: 'Overdyed Rust', hex: '#543D37' },
    ],
    sizes: { XS: 6, S: 14, M: 21, L: 16, XL: 9, XXL: 3 },
    fabric: '100% Non-Stretch 13.5oz Open-End Cotton Denim',
    care: 'Wash cold inside out every 8–10 wears.',
    fit: 'Relaxed mid-to-high rise with a generous wide-leg puddle stack over sneakers.',
    description:
      'Constructed with riveted double-knee reinforcements, utility hammer loop, and custom debossed leather waist patch. Engineered to stack cleanly over chunky footwear.',
    completeLookIds: ['ak-tee-01', 'ak-jkt-02'],
  },
  {
    id: 'ak-btm-02',
    sku: 'AK-AW26-B02',
    title: 'NOMAD 8-POCKET PARACHUTE CARGO PANTS',
    subtitle: 'Water-Resistant Nylon-Cotton Poplin • Knee Pleats & Hem Toggles',
    category: 'Bottoms',
    price: 2999,
    originalPrice: 3699,
    rating: 4.8,
    reviewsCount: 154,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'bottom-cargo',
    badgeText: '8-POCKET TECH',
    colors: [
      { name: 'Jet Black', hex: '#0A0A0B' },
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Tactical Sage', hex: '#4F5D53' },
    ],
    sizes: { XS: 8, S: 18, M: 24, L: 15, XL: 7, XXL: 2 },
    fabric: '70% Cotton, 30% Cordura Nylon Blend (230 GSM) with DWR Finish',
    care: 'Machine wash cold. Line dry.',
    fit: 'Adjustable integrated webbing belt waist with toggle bungee cuffs for wide or tapered styling.',
    description:
      'Convert seamlessly from a wide-leg silhouette to a tapered jogger cuff using the concealed Nifco cord locks at the ankle.',
    completeLookIds: ['ak-tee-02', 'ak-jkt-01'],
  },
  {
    id: 'ak-btm-03',
    sku: 'AK-CORE-B03',
    title: 'PLEATED ARCHITECTURAL TROUSER PANT',
    subtitle: 'Bi-Stretch TR Suiting • Concealed Elastic Back Waist',
    category: 'Bottoms',
    price: 2899,
    originalPrice: 2899,
    rating: 4.8,
    reviewsCount: 83,
    isNewDrop: false,
    isBestSeller: false,
    onSale: false,
    silhouette: 'bottom-trouser',
    badgeText: 'TAILORED STREET',
    colors: [
      { name: 'Charcoal Pinstripe', hex: '#303840' },
      { name: 'Obsidian Black', hex: '#111215' },
      { name: 'Silver Stone', hex: '#B9C0C8' },
    ],
    sizes: { XS: 5, S: 12, M: 16, L: 13, XL: 6, XXL: 0 },
    fabric: '68% Polyester, 28% Viscose, 4% Spandex Wrinkle-Free Twill (290 GSM)',
    care: 'Machine wash cold gentle. Hang immediately.',
    fit: 'Double front pleats with a fluid wide-straight leg and clean blind-stitched hem.',
    description:
      'Tailoring comfort that feels like sweatpants. Pair with our Nocturne Satin Shirt or an oversized graphic tee.',
    completeLookIds: ['ak-sh-01', 'ak-tee-03'],
  },
  {
    id: 'ak-btm-04',
    sku: 'AK-AW26-B04',
    title: 'APEX 480 GSM HEAVYWEIGHT SWEATPANT JOGGERS',
    subtitle: 'Raw Seam Piping • Uncuffed Open or Cinchable Hem',
    category: 'Bottoms',
    price: 2499,
    originalPrice: 3199,
    rating: 4.9,
    reviewsCount: 131,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'bottom-jogger',
    badgeText: 'CO-ORD SET',
    colors: [
      { name: 'Jet Black', hex: '#0A0A0B' },
      { name: 'Royal Amethyst', hex: '#6B3FA0' },
      { name: 'Moonlit Silver', hex: '#C9CED6' },
    ],
    sizes: { XS: 7, S: 15, M: 19, L: 14, XL: 8, XXL: 4 },
    fabric: '100% Combed Cotton Heavy Loopback French Terry (480 GSM)',
    care: 'Machine wash cold inside out.',
    fit: 'Relaxed straight-leg jogger with internal metal-tipped drawcords and zippered back pocket.',
    description:
      'Cut from the exact same 480 GSM custom terry as our Apex Hoodie for a unified monochrome tracksuit statement.',
    completeLookIds: ['ak-hd-01', 'ak-jkt-04'],
  },

  // ─── ACCESSORIES (4) ───
  {
    id: 'ak-acc-01',
    sku: 'AK-AW26-A01',
    title: 'BALLISTIC NYLON MODULAR CROSSBODY SLING BAG',
    subtitle: '1680D Cordura • Magnetic Quick-Release Cobra Buckle',
    category: 'Accessories',
    price: 2199,
    originalPrice: 2799,
    rating: 4.9,
    reviewsCount: 178,
    isNewDrop: true,
    isBestSeller: true,
    onSale: true,
    silhouette: 'acc-bag',
    badgeText: 'BEST SELLER',
    colors: [
      { name: 'Stealth Black', hex: '#0A0A0B' },
      { name: 'Signal Red Webbing', hex: '#E63946' },
      { name: 'Amethyst Tech', hex: '#6B3FA0' },
    ],
    sizes: { 'ONE SIZE': 32 },
    fabric: '1680D Ballistic Cordura Nylon + YKK Waterproof Zippers',
    care: 'Wipe with damp cloth.',
    fit: 'Fits 11-inch iPad Pro, film camera, water bottle, and daily essentials (6.5L capacity).',
    description:
      'Engineered with a stabilizing 3-point strap system, MOLLE attachment loops, and a fleece-lined tech compartment.',
    completeLookIds: ['ak-jkt-01', 'ak-tee-01'],
  },
  {
    id: 'ak-acc-02',
    sku: 'AK-AW26-A02',
    title: 'DISTRESSED EMBROIDERED 6-PANEL DAD CAP',
    subtitle: 'Heavy Bull Denim • Brushed Gunmetal Tri-Glide Buckle',
    category: 'Accessories',
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 145,
    isNewDrop: false,
    isBestSeller: true,
    onSale: true,
    silhouette: 'acc-cap',
    badgeText: '3D EMBROIDERY',
    colors: [
      { name: 'Washed Charcoal', hex: '#36454F' },
      { name: 'Jet Black', hex: '#0A0A0B' },
      { name: 'Crimson Red', hex: '#C82834' },
    ],
    sizes: { 'ONE SIZE': 45 },
    fabric: '100% Heavyweight 12oz Cotton Twill',
    care: 'Spot clean only.',
    fit: 'Unstructured curved-brim crown with adjustable strap (54cm–62cm).',
    description:
      'Features high-density 3D puff embroidery of the AKSHAY monogram on the crown and coordinates stitched along the temple.',
    completeLookIds: ['ak-tee-02', 'ak-hd-03'],
  },
  {
    id: 'ak-acc-03',
    sku: 'AK-AW26-A03',
    title: 'MERINO RIB-KNIT FISHERMAN BEANIE',
    subtitle: 'Non-Itch Extra-Fine Merino Blend • Woven Archive Tag',
    category: 'Accessories',
    price: 1199,
    originalPrice: 1499,
    rating: 4.7,
    reviewsCount: 68,
    isNewDrop: true,
    isBestSeller: false,
    onSale: true,
    silhouette: 'acc-beanie',
    badgeText: 'AW26 DROP',
    colors: [
      { name: 'Obsidian', hex: '#141518' },
      { name: 'Electric Cyan', hex: '#00C4DB' },
      { name: 'Heather Silver', hex: '#B5BCC4' },
    ],
    sizes: { 'ONE SIZE': 28 },
    fabric: '60% Extra-Fine Australian Merino Wool, 40% Recycled Nylon',
    care: 'Cold hand wash with wool detergent. Dry flat.',
    fit: 'Short-watch fisherman cuff with high recovery stretch.',
    description:
      'Double-layered turn-up cuff traps warmth without losing elasticity. Finished with a high-contrast woven archive label.',
    completeLookIds: ['ak-jkt-01', 'ak-tee-04'],
  },
  {
    id: 'ak-acc-04',
    sku: 'AK-CORE-A04',
    title: 'INDUSTRIAL COBRA WEBBING TACTICAL BELT',
    subtitle: '38mm High-Tensile Nylon • CNC Anodized Alloy Buckle',
    category: 'Accessories',
    price: 1499,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 110,
    isNewDrop: false,
    isBestSeller: false,
    onSale: false,
    silhouette: 'acc-belt',
    badgeText: 'CNC HARDWARE',
    colors: [
      { name: 'Matte Black / Red Release', hex: '#18191C' },
      { name: 'Silver Grey / Black', hex: '#8F96A0' },
    ],
    sizes: { 'ONE SIZE': 36 },
    fabric: 'High-Tensile 38mm Parachute Webbing + 7075 Aluminum Alloy Buckle',
    care: 'Wipe clean.',
    fit: 'Micro-adjustable up to 44-inch waist; fits standard denim and cargo belt loops.',
    description:
      'Quick-release dual-tab mechanical buckle rated for extreme durability with laser-etched AKSHAY serial markings.',
    completeLookIds: ['ak-btm-01', 'ak-btm-02'],
  },
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'ak-tee-01',
    author: 'Aarav Mehta',
    city: 'Mumbai',
    rating: 5,
    date: '2 days ago',
    verified: true,
    sizeBought: 'L',
    fitFeedback: 'True to size',
    title: 'Best 280 GSM tee in India right now',
    comment:
      'The collar thickness and boxy shoulder drop rival international labels costing 4x as much. Zero shrinkage after washing cold.',
  },
  {
    id: 'rev-2',
    productId: 'ak-hd-01',
    author: 'Riya Sharma',
    city: 'Bengaluru',
    rating: 5,
    date: '5 days ago',
    verified: true,
    sizeBought: 'M',
    fitFeedback: 'Slightly oversized',
    title: 'The Royal Amethyst color is unreal in person',
    comment:
      'Heavy, structured hood that stands up on its own. Wore it on a late flight and got three compliments at the terminal.',
  },
  {
    id: 'rev-3',
    productId: 'ak-jkt-01',
    author: 'Kabir Verma',
    city: 'New Delhi',
    rating: 5,
    date: '1 week ago',
    verified: true,
    sizeBought: 'L',
    fitFeedback: 'True to size',
    title: 'Internal sling straps are a game changer',
    comment:
      'Water beads right off the shell and the AquaGuard zippers feel super premium. Worth every rupee.',
  },
  {
    id: 'rev-4',
    productId: 'ak-btm-01',
    author: 'Zoya Khan',
    city: 'Hyderabad',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    sizeBought: 'S',
    fitFeedback: 'True to size',
    title: 'Stacks on Jordan 4s and New Balances',
    comment:
      'Finally a carpenter pant with actual 13.5oz weight that drapes cleanly instead of feeling flimsy.',
  },
];

const INITIAL_ORDERS = [
  {
    id: 'AK-ORD-98412',
    date: '2026-11-04',
    customerName: 'Rohan Kapoor',
    email: 'rohan.k@akshay.studio',
    status: 'Delivered',
    paymentMethod: 'Razorpay UPI',
    total: 5198,
    items: [
      {
        productId: 'ak-tee-01',
        title: 'KINETIC HEAVYWEIGHT BOXY TEE',
        size: 'L',
        color: 'Obsidian Black',
        qty: 1,
        price: 1699,
      },
      {
        productId: 'ak-hd-01',
        title: 'APEX 480 GSM FRENCH TERRY HOODIE',
        size: 'L',
        color: 'Royal Amethyst',
        qty: 1,
        price: 3499,
      },
    ],
    shippingAddress: '402 Carter Road Residency, Bandra West, Mumbai, MH 400050',
  },
  {
    id: 'AK-ORD-98489',
    date: '2026-11-08',
    customerName: 'Ananya Nair',
    email: 'ananya.nair@gmail.com',
    status: 'Shipped',
    paymentMethod: 'Card (••4242)',
    total: 5999,
    items: [
      {
        productId: 'ak-jkt-01',
        title: 'AERO WATER-REPELLENT TECHNICAL SHELL JACKET',
        size: 'M',
        color: 'Stealth Black',
        qty: 1,
        price: 5999,
      },
    ],
    shippingAddress: '12th Main Indiranagar, HAL 2nd Stage, Bengaluru, KA 560038',
  },
  {
    id: 'AK-ORD-98504',
    date: '2026-11-09',
    customerName: 'Vikramaditya Rao',
    email: 'vikram.rao@outlook.com',
    status: 'Processing',
    paymentMethod: 'Razorpay UPI',
    total: 5498,
    items: [
      {
        productId: 'ak-btm-01',
        title: 'COLOSSUS WIDE-LEG CARPENTER DENIM JEANS',
        size: 'M',
        color: 'Washed Slate Black',
        qty: 1,
        price: 3299,
      },
      {
        productId: 'ak-acc-01',
        title: 'BALLISTIC NYLON MODULAR CROSSBODY SLING BAG',
        size: 'ONE SIZE',
        color: 'Stealth Black',
        qty: 1,
        price: 2199,
      },
    ],
    shippingAddress: 'Plot 84 Jubilee Hills Road No. 36, Hyderabad, TS 500033',
  },
];

const LOOKBOOK_EDITORIALS = [
  {
    id: 'lb-01',
    tag: 'EDITORIAL 01 // MONOLITH RAIN',
    title: 'NEO-MUMBAI MONSOON ARMOR',
    subtitle:
      'Three-layer breathable shells paired with 8-pocket Cordura parachute cargos for high-humidity urban transit.',
    productIds: ['ak-jkt-01', 'ak-btm-02', 'ak-acc-01'],
    accent: '#00E5FF',
  },
  {
    id: 'lb-02',
    tag: 'EDITORIAL 02 // HEAVYWEIGHT ARCHIVE',
    title: '480 GSM SCULPTURAL PROPORTIONS',
    subtitle:
      'Zero-drawstring double-lined hoods and wide-leg carpenter denim engineered for architectural volume.',
    productIds: ['ak-hd-01', 'ak-btm-01', 'ak-acc-02'],
    accent: '#E63946',
  },
  {
    id: 'lb-03',
    tag: 'EDITORIAL 03 // AFTER-HOURS GALLERY',
    title: 'MATTE CUPRO & TAILORED DRAPE',
    subtitle:
      'Fluid Nocturne camp-collar satin shirting layered over 240 GSM Pima rib tanks and pleated suiting trousers.',
    productIds: ['ak-sh-01', 'ak-tee-03', 'ak-btm-03'],
    accent: '#6B3FA0',
  },
];

const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    handle: '@aarav.archive',
    location: 'Kala Ghoda, Mumbai',
    caption: '280 GSM Kinetic Tee holding shape in 32°C heat.',
    likes: '2.4k',
    productId: 'ak-tee-01',
  },
  {
    id: 'ig-2',
    handle: '@zoya.fits',
    location: 'Indiranagar, BLR',
    caption: 'Apex 480 GSM set in Royal Amethyst.',
    likes: '3.9k',
    productId: 'ak-hd-01',
  },
  {
    id: 'ig-3',
    handle: '@kabir.visuals',
    location: 'Hauz Khas, Delhi',
    caption: 'Aero Shell Jacket tested in midnight drizzle.',
    likes: '1.8k',
    productId: 'ak-jkt-01',
  },
  {
    id: 'ig-4',
    handle: '@dev.streetwear',
    location: 'Bandra West, BOM',
    caption: 'Colossus Carpenter Denim + Varsity Bomber.',
    likes: '4.1k',
    productId: 'ak-jkt-02',
  },
];

const FAQ_DATA = [
  {
    category: 'Shipping & Delivery',
    q: 'How fast does AKSHAY ship across India?',
    a: 'All in-stock orders placed before 2:00 PM IST dispatch the same business day from our Mumbai & Bengaluru fulfillment hubs. Metro cities receive deliveries within 24–48 hours via BlueDart Air; rest of India takes 3–5 business days. Free express shipping applies automatically on orders above ₹2,999.',
  },
  {
    category: 'Sizing & Fit',
    q: 'Are your tees and hoodies oversized or true to size?',
    a: 'Our streetwear silhouettes feature an intentional boxy, drop-shoulder cut. Order your usual size for a relaxed editorial fit, or size down one size if you prefer a closer standard fit. Every product page includes an interactive CM/Inches Size Guide and fit calculator.',
  },
  {
    category: 'Returns & Exchanges',
    q: 'What is your 7-day return and instant size exchange policy?',
    a: 'We offer hassle-free 7-day reverse pickup returns and free instant size exchanges on all unworn items with original archive tags attached. Once picked up by our courier partner, refunds are credited to your original payment source or UPI within 24 hours.',
  },
  {
    category: 'Fabric & Care',
    q: 'How should I wash 280 GSM tees and 480 GSM French Terry hoodies?',
    a: 'Always turn heavyweight cotton and puff-print garments inside out and machine wash cold (30°C) on a gentle cycle with mild liquid detergent. Avoid tumble drying—lay flat or hang dry in shade to preserve the GSM structure and collar rib tension.',
  },
  {
    category: 'Payments & Promo Codes',
    q: 'Which payment methods and promo codes are supported?',
    a: 'We accept all UPI apps (GPay, PhonePe, Paytm), Visa/Mastercard/RuPay cards, NetBanking, and Cash on Delivery (COD). Try code AKSHAY20 for 20% off your order, FIRST10 for 10% off, or FREESHIP for complimentary express delivery.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3. BESPOKE EDITORIAL SVG GARMENT STUDIO ILLUSTRATOR
//    Renders crisp, color-reactive vector fashion garments & studio lighting
// ═══════════════════════════════════════════════════════════════════════════════

function GarmentIllustration({
  product,
  colorHex,
  viewAngle = 'front',
  className = '',
  interactiveZoom = false,
}) {
  const activeHex = colorHex || product?.colors?.[0]?.hex || '#141416';
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e) => {
    if (!interactiveZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    if (!interactiveZoom) return;
    setZoomPos((p) => ({ ...p, active: false }));
  };

  const isLightGarment =
    activeHex.toLowerCase() === '#f2f3f5' ||
    activeHex.toLowerCase() === '#f7f8fa' ||
    activeHex.toLowerCase() === '#e8e2d5' ||
    activeHex.toLowerCase() === '#c9ced6' ||
    activeHex.toLowerCase() === '#d4d8df';

  const strokeColor = isLightGarment ? '#222831' : '#E2E8F0';
  const accentColor =
    product?.category === 'Jackets' || product?.isNewDrop ? '#00E5FF' : '#E63946';

  const renderSilhouettePath = () => {
    const type = product?.silhouette || 'tee-graphic';
    if (viewAngle === 'macro') {
      return (
        <g>
          <rect x="45" y="45" width="210" height="210" rx="16" fill={activeHex} stroke={strokeColor} strokeWidth="2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="55"
              y1={60 + i * 16}
              x2="245"
              y2={60 + i * 16}
              stroke={strokeColor}
              strokeOpacity="0.22"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={60 + i * 16}
              y1="55"
              x2={60 + i * 16}
              y2="245"
              stroke={strokeColor}
              strokeOpacity="0.18"
              strokeWidth="1.5"
            />
          ))}
          <rect x="75" y="115" width="150" height="70" rx="6" fill="#0A0A0B" stroke={accentColor} strokeWidth="1.5" />
          <text x="150" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" letterSpacing="3">
            AKSHAY ARCHIVE
          </text>
          <text x="150" y="166" textAnchor="middle" fill={accentColor} fontSize="9" fontWeight="600" letterSpacing="2">
            {product?.subtitle?.split('•')[0]?.trim() || 'HEAVYWEIGHT GSM'}
          </text>
        </g>
      );
    }

    if (type.startsWith('tee')) {
      return (
        <g>
          {/* Drop-shoulder boxy tee */}
          <path
            d="M95 58 C115 70, 185 70, 205 58 L262 96 L238 152 L204 134 L204 252 L96 252 L96 134 L62 152 L38 96 Z"
            fill={activeHex}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Thick ribbed crew collar */}
          <path
            d="M114 62 C132 76, 168 76, 186 62 C178 82, 122 82, 114 62 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
          />
          {/* Shoulder drop seams */}
          <line x1="96" y1="134" x2="78" y2="82" stroke={strokeColor} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="204" y1="134" x2="222" y2="82" stroke={strokeColor} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />
          {viewAngle === 'back' ? (
            <g>
              <rect x="112" y="102" width="76" height="92" rx="4" fill="none" stroke={accentColor} strokeWidth="1.8" />
              <text x="150" y="132" textAnchor="middle" fill={strokeColor} fontSize="14" fontWeight="900" letterSpacing="3">
                AKSHAY
              </text>
              <text x="150" y="150" textAnchor="middle" fill={accentColor} fontSize="8" fontWeight="700" letterSpacing="2">
                URBAN ARCHIVE // 26
              </text>
              <line x1="122" y1="164" x2="178" y2="164" stroke={strokeColor} strokeOpacity="0.5" strokeWidth="1" />
              <text x="150" y="178" textAnchor="middle" fill={strokeColor} fontSize="7" opacity="0.8" letterSpacing="1.5">
                19.0760° N, 72.8777° E
              </text>
            </g>
          ) : (
            <g>
              <text x="172" y="116" textAnchor="middle" fill={accentColor} fontSize="9" fontWeight="800" letterSpacing="2">
                AK//26
              </text>
              <rect x="112" y="232" width="24" height="10" fill={accentColor} rx="1" />
            </g>
          )}
        </g>
      );
    }

    if (type.startsWith('shirt')) {
      return (
        <g>
          <path
            d="M102 56 L198 56 L256 96 L234 150 L204 134 L204 252 L96 252 L96 134 L66 150 L44 96 Z"
            fill={activeHex}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Revere / Camp Collar */}
          <path d="M118 56 L150 96 L100 84 Z" fill={activeHex} stroke={strokeColor} strokeWidth="2" />
          <path d="M182 56 L150 96 L200 84 Z" fill={activeHex} stroke={strokeColor} strokeWidth="2" />
          {/* Placket & Pockets */}
          <line x1="150" y1="96" x2="150" y2="252" stroke={strokeColor} strokeWidth="2" />
          {[118, 148, 178, 208, 234].map((cy) => (
            <circle key={cy} cx="150" cy={cy} r="2.5" fill={accentColor} />
          ))}
          <rect x="108" y="118" width="30" height="34" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.6" />
          <rect x="162" y="118" width="30" height="34" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.6" />
        </g>
      );
    }

    if (type.startsWith('hoodie')) {
      return (
        <g>
          {/* Structured Double Hood */}
          <path
            d="M108 64 C104 26, 196 26, 192 64 Z"
            fill={activeHex}
            stroke={strokeColor}
            strokeWidth="2.4"
          />
          <path
            d="M96 62 L204 62 L262 110 L238 238 L206 238 L202 142 L202 250 L98 250 L98 142 L94 238 L62 238 L38 110 Z"
            fill={activeHex}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Kangaroo Pocket */}
          <path
            d="M110 176 L190 176 L198 234 L102 234 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
          />
          {/* Wide Rib Hem */}
          <line x1="98" y1="236" x2="202" y2="236" stroke={strokeColor} strokeWidth="2" />
          <text x="150" y="128" textAnchor="middle" fill={strokeColor} fontSize="13" fontWeight="900" letterSpacing="4">
            AKSHAY
          </text>
          <text x="150" y="143" textAnchor="middle" fill={accentColor} fontSize="8" fontWeight="700" letterSpacing="2.5">
            480 GSM HEAVY TERRI
          </text>
        </g>
      );
    }

    if (type.startsWith('jacket')) {
      return (
        <g>
          {/* High Storm Collar & Technical Shell */}
          <path
            d="M115 44 L185 44 L196 66 L260 106 L240 242 L208 242 L202 140 L204 252 L96 252 L98 140 L92 242 L60 242 L40 106 L104 66 Z"
            fill={activeHex}
            stroke={strokeColor}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Waterproof Center Zip & Technical Chest Zip */}
          <line x1="150" y1="44" x2="150" y2="252" stroke={accentColor} strokeWidth="2.5" />
          <line x1="114" y1="105" x2="136" y2="145" stroke={accentColor} strokeWidth="2" />
          <line x1="186" y1="105" x2="164" y2="145" stroke={accentColor} strokeWidth="2" />
          <rect x="164" y="82" width="28" height="12" rx="2" fill={accentColor} />
          <text x="178" y="91" textAnchor="middle" fill="#0A0A0B" fontSize="6.5" fontWeight="900">
            AK-SHELL
          </text>
        </g>
      );
    }

    if (type.startsWith('bottom')) {
      return (
        <g>
          {/* Wide-leg Carpenter / Cargo Pants */}
          <path
            d="M98 44 L202 44 L222 256 L158 256 L150 118 L142 256 L78 256 Z"
            fill={activeHex}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Waistband & Belt Loops */}
          <line x1="96" y1="62" x2="204" y2="62" stroke={strokeColor} strokeWidth="2" />
          {/* Double-knee & Cargo bellows pockets */}
          <rect x="84" y="118" width="26" height="44" rx="3" fill={activeHex} stroke={strokeColor} strokeWidth="1.8" />
          <rect x="190" y="118" width="26" height="44" rx="3" fill={activeHex} stroke={strokeColor} strokeWidth="1.8" />
          <rect x="92" y="142" width="44" height="58" rx="2" fill="none" stroke={strokeColor} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="164" y="142" width="44" height="58" rx="2" fill="none" stroke={strokeColor} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="150" cy="53" r="3" fill={accentColor} />
        </g>
      );
    }

    // Accessories (Sling Bag / Cap / Beanie / Belt)
    return (
      <g>
        <rect
          x="74"
          y="88"
          width="152"
          height="118"
          rx="18"
          fill={activeHex}
          stroke={strokeColor}
          strokeWidth="2.4"
        />
        <path
          d="M74 114 C40 60, 260 60, 226 114"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line x1="92" y1="132" x2="208" y2="132" stroke={accentColor} strokeWidth="2.5" />
        <rect x="115" y="152" width="70" height="28" rx="4" fill="#0A0A0B" stroke={accentColor} strokeWidth="1.5" />
        <text x="150" y="170" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="3">
          AKSHAY
        </text>
      </g>
    );
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{
        background:
          'radial-gradient(circle at 50% 35%, rgba(201, 206, 214, 0.22), rgba(10, 10, 11, 0.06) 75%)',
      }}
    >
      {/* Subtle architectural grid backdrop */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <svg
        viewBox="0 0 300 300"
        role="img"
        aria-label={`${product?.title || 'Akshay Garment'} in ${activeHex}`}
        className="w-full h-full max-h-full transition-transform duration-300 ease-out"
        style={
          interactiveZoom && zoomPos.active
            ? {
                transform: 'scale(1.65)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }
            : undefined
        }
      >
        <defs>
          <filter id={`shadow-${product?.id || 'default'}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>
        <g filter={`url(#shadow-${product?.id || 'default'})`}>{renderSilhouettePath()}</g>
      </svg>

      {/* Corner technical spec stamp */}
      <div className="absolute bottom-2.5 right-3 pointer-events-none text-[10px] font-mono tracking-widest opacity-60 uppercase">
        {product?.sku || 'AK-AW26'} • {viewAngle.toUpperCase()}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. GLOBAL STORE CONTEXT + REDUCER (CART, WISHLIST, AUTH, THEME, ADMIN, TOASTS)
// ═══════════════════════════════════════════════════════════════════════════════

const StoreContext = createContext(null);

const PROMO_CODES = {
  AKSHAY20: { code: 'AKSHAY20', type: 'percent', value: 20, label: '20% OFF AW26 DROP' },
  FIRST10: { code: 'FIRST10', type: 'percent', value: 10, label: '10% WELCOME DISCOUNT' },
  FREESHIP: { code: 'FREESHIP', type: 'shipping', value: 100, label: 'FREE EXPRESS SHIPPING' },
};

function getInitialTheme() {
  const saved = safeGetStorage('akshay_theme', null);
  if (saved === 'light' || saved === 'dark') return saved;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

const initialState = {
  theme: getInitialTheme(),
  products: safeGetStorage('akshay_products', INITIAL_PRODUCTS),
  cart: safeGetStorage('akshay_cart', [
    {
      productId: 'ak-tee-01',
      size: 'L',
      color: 'Obsidian Black',
      colorHex: '#141416',
      quantity: 1,
    },
  ]),
  wishlist: safeGetStorage('akshay_wishlist', ['ak-hd-01', 'ak-jkt-01']),
  promoCode: null,
  user: safeGetStorage('akshay_user', {
    id: 'usr-01',
    name: 'Aarav Sharma',
    email: 'aarav@akshay.studio',
    role: 'admin', // Has access to both Customer Account & Admin Dashboard
    phone: '+91 98201 44510',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home Studio (Default)',
        fullName: 'Aarav Sharma',
        street: '14B Pali Hill, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        phone: '+91 98201 44510',
        isDefault: true,
      },
    ],
  }),
  orders: safeGetStorage('akshay_orders', INITIAL_ORDERS),
  reviews: safeGetStorage('akshay_reviews', INITIAL_REVIEWS),
  toasts: [],
};

function storeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME': {
      const next = state.theme === 'light' ? 'dark' : 'light';
      safeSetStorage('akshay_theme', next);
      return { ...state, theme: next };
    }
    case 'SET_THEME': {
      safeSetStorage('akshay_theme', action.payload);
      return { ...state, theme: action.payload };
    }
    case 'ADD_TO_CART': {
      const { productId, size, color, colorHex, quantity = 1 } = action.payload;
      const existingIndex = state.cart.findIndex(
        (item) => item.productId === productId && item.size === size && item.color === color
      );
      let nextCart;
      if (existingIndex > -1) {
        nextCart = state.cart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        nextCart = [...state.cart, { productId, size, color, colorHex, quantity }];
      }
      safeSetStorage('akshay_cart', nextCart);
      return { ...state, cart: nextCart };
    }
    case 'UPDATE_CART_ITEM': {
      const { index, updates } = action.payload;
      const nextCart = state.cart
        .map((item, idx) => (idx === index ? { ...item, ...updates } : item))
        .filter((item) => item.quantity > 0);
      safeSetStorage('akshay_cart', nextCart);
      return { ...state, cart: nextCart };
    }
    case 'REMOVE_FROM_CART': {
      const nextCart = state.cart.filter((_, idx) => idx !== action.payload);
      safeSetStorage('akshay_cart', nextCart);
      return { ...state, cart: nextCart };
    }
    case 'CLEAR_CART': {
      safeSetStorage('akshay_cart', []);
      return { ...state, cart: [], promoCode: null };
    }
    case 'APPLY_PROMO': {
      return { ...state, promoCode: action.payload };
    }
    case 'TOGGLE_WISHLIST': {
      const id = action.payload;
      const exists = state.wishlist.includes(id);
      const nextWish = exists
        ? state.wishlist.filter((item) => item !== id)
        : [...state.wishlist, id];
      safeSetStorage('akshay_wishlist', nextWish);
      return { ...state, wishlist: nextWish };
    }
    case 'SET_USER': {
      safeSetStorage('akshay_user', action.payload);
      return { ...state, user: action.payload };
    }
    case 'ADD_ADDRESS': {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        addresses: [...(state.user.addresses || []), action.payload],
      };
      safeSetStorage('akshay_user', updatedUser);
      return { ...state, user: updatedUser };
    }
    case 'DELETE_ADDRESS': {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        addresses: (state.user.addresses || []).filter((a) => a.id !== action.payload),
      };
      safeSetStorage('akshay_user', updatedUser);
      return { ...state, user: updatedUser };
    }
    case 'PLACE_ORDER': {
      const newOrder = action.payload;
      const nextOrders = [newOrder, ...state.orders];
      safeSetStorage('akshay_orders', nextOrders);
      safeSetStorage('akshay_cart', []);
      return { ...state, orders: nextOrders, cart: [], promoCode: null };
    }
    case 'ADD_REVIEW': {
      const nextReviews = [action.payload, ...state.reviews];
      safeSetStorage('akshay_reviews', nextReviews);
      return { ...state, reviews: nextReviews };
    }
    case 'ADMIN_SAVE_PRODUCT': {
      const prod = action.payload;
      const exists = state.products.some((p) => p.id === prod.id);
      const nextProducts = exists
        ? state.products.map((p) => (p.id === prod.id ? prod : p))
        : [prod, ...state.products];
      safeSetStorage('akshay_products', nextProducts);
      return { ...state, products: nextProducts };
    }
    case 'ADMIN_DELETE_PRODUCT': {
      const nextProducts = state.products.filter((p) => p.id !== action.payload);
      safeSetStorage('akshay_products', nextProducts);
      return { ...state, products: nextProducts };
    }
    case 'ADMIN_UPDATE_ORDER_STATUS': {
      const { orderId, status } = action.payload;
      const nextOrders = state.orders.map((o) => (o.id === orderId ? { ...o, status } : o));
      safeSetStorage('akshay_orders', nextOrders);
      return { ...state, orders: nextOrders };
    }
    case 'ADD_TOAST': {
      return { ...state, toasts: [...state.toasts, action.payload] };
    }
    case 'REMOVE_TOAST': {
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    }
    default:
      return state;
  }
}

function useStore() {
  return useContext(StoreContext);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SIZE GUIDE MODAL & QUICK-VIEW MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function SizeGuideModal({ isOpen, onClose, category = 'T-Shirts' }) {
  const [unit, setUnit] = useState('cm');
  const [heightCm, setHeightCm] = useState(176);
  const [weightKg, setWeightKg] = useState(72);
  const [fitPref, setFitPref] = useState('oversized');

  if (!isOpen) return null;

  const recommendedSize = (() => {
    let score = 0;
    if (heightCm < 166 && weightKg < 60) score = 0; // XS
    else if (heightCm < 172 && weightKg < 68) score = 1; // S
    else if (heightCm < 179 && weightKg < 78) score = 2; // M
    else if (heightCm < 185 && weightKg < 88) score = 3; // L
    else score = 4; // XL
    if (fitPref === 'oversized' && score < 4) score += 0; // Already cut oversized
    if (fitPref === 'fitted' && score > 0) score -= 1;
    return ['XS', 'S', 'M', 'L', 'XL'][score];
  })();

  const rows = [
    { size: 'XS', chest: 106, length: 69, shoulder: 51, waist: 72 },
    { size: 'S', chest: 112, length: 71, shoulder: 53, waist: 76 },
    { size: 'M', chest: 118, length: 74, shoulder: 55.5, waist: 81 },
    { size: 'L', chest: 124, length: 76.5, shoulder: 58, waist: 86 },
    { size: 'XL', chest: 130, length: 79, shoulder: 60.5, waist: 91 },
    { size: 'XXL', chest: 136, length: 81, shoulder: 63, waist: 96 },
  ];

  const conv = (val) => (unit === 'cm' ? `${val} cm` : `${(val / 2.54).toFixed(1)}"`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Size Guide Modal"
    >
      <div className="w-full max-w-2xl rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-[var(--ak-text)] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--ak-border)] bg-[var(--ak-bg)]">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-[var(--ak-accent)]" />
            <h3 className="font-display text-lg font-extrabold tracking-wider uppercase">
              AKSHAY ARCHIVE // SIZE & FIT MATRIX ({category})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Size Guide"
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Interactive Fit Finder */}
          <div className="p-4 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--ak-accent)]">
                AI FIT CALCULATOR
              </span>
              <span className="text-xs font-mono">
                Recommended Archive Size:{' '}
                <strong className="px-2 py-0.5 rounded bg-[var(--ak-accent)] text-white dark:text-black font-extrabold">
                  {recommendedSize}
                </strong>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block mb-1 opacity-75">Height: {heightCm} cm</label>
                <input
                  type="range"
                  min="150"
                  max="200"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-[var(--ak-accent)]"
                />
              </div>
              <div>
                <label className="block mb-1 opacity-75">Weight: {weightKg} kg</label>
                <input
                  type="range"
                  min="45"
                  max="115"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[var(--ak-accent)]"
                />
              </div>
              <div>
                <label className="block mb-1 opacity-75">Drape Preference</label>
                <select
                  value={fitPref}
                  onChange={(e) => setFitPref(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-[var(--ak-border)] bg-[var(--ak-surface)]"
                >
                  <option value="oversized">Signature Boxy / Oversized</option>
                  <option value="fitted">Closer Standard Fit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-xs opacity-80">
              All AKSHAY tops feature dropped shoulders and pre-shrunk heavyweight fabric.
            </p>
            <div className="inline-flex rounded-lg border border-[var(--ak-border)] overflow-hidden text-xs font-bold">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1.5 ${
                  unit === 'cm' ? 'bg-[var(--ak-accent)] text-white dark:text-black' : ''
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1.5 ${
                  unit === 'in' ? 'bg-[var(--ak-accent)] text-white dark:text-black' : ''
                }`}
              >
                INCHES
              </button>
            </div>
          </div>

          {/* Measurement Table */}
          <div className="overflow-x-auto rounded-lg border border-[var(--ak-border)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--ak-bg)] uppercase tracking-wider border-b border-[var(--ak-border)]">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest</th>
                  <th className="py-3 px-4">Body Length</th>
                  <th className="py-3 px-4">Shoulder Width</th>
                  <th className="py-3 px-4">Waist (Bottoms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ak-border)]">
                {rows.map((r) => (
                  <tr
                    key={r.size}
                    className={
                      r.size === recommendedSize ? 'bg-[var(--ak-accent)]/10 font-bold' : ''
                    }
                  >
                    <td className="py-2.5 px-4 font-mono font-bold">{r.size}</td>
                    <td className="py-2.5 px-4">{conv(r.chest)}</td>
                    <td className="py-2.5 px-4">{conv(r.length)}</td>
                    <td className="py-2.5 px-4">{conv(r.shoulder)}</td>
                    <td className="py-2.5 px-4">{conv(r.waist)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MAIN APPLICATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Navigation / Routing state
  const [route, setRoute] = useState({ page: 'home', params: {} });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sizeGuideCategory, setSizeGuideCategory] = useState(null);
  const [archModalOpen, setArchModalOpen] = useState(false);

  // Navbar search
  const [navSearch, setNavSearch] = useState('');
  const [navSearchFocused, setNavSearchFocused] = useState(false);
  const debouncedNavSearch = useDebounce(navSearch, 200);

  // Shop Filters
  const [shopCategory, setShopCategory] = useState('All');
  const [shopSize, setShopSize] = useState('All');
  const [shopColor, setShopColor] = useState('All');
  const [shopMaxPrice, setShopMaxPrice] = useState(8000);
  const [shopMinRating, setShopMinRating] = useState(0);
  const [shopInStockOnly, setShopInStockOnly] = useState(false);
  const [shopOnSaleOnly, setShopOnSaleOnly] = useState(false);
  const [shopSort, setShopSort] = useState('popular');
  const [shopSearch, setShopSearch] = useState('');
  const debouncedShopSearch = useDebounce(shopSearch, 200);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isFilteringSkeleton, setIsFilteringSkeleton] = useState(false);

  // Toast helper
  const notify = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 3200);
  }, []);

  // Navigate helper with scroll-to-top
  const navigate = useCallback((page, params = {}) => {
    setRoute({ page, params });
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setNavSearchFocused(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Trigger brief skeleton shimmer when changing major shop category
  const selectCategoryAndGo = useCallback(
    (cat) => {
      setIsFilteringSkeleton(true);
      setShopCategory(cat);
      setVisibleCount(12);
      navigate('shop');
      setTimeout(() => setIsFilteringSkeleton(false), 240);
    },
    [navigate]
  );

  // Computed Cart Totals
  const cartSummary = useMemo(() => {
    const detailedItems = state.cart
      .map((item) => {
        const product = state.products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);

    const subtotal = detailedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const totalCount = detailedItems.reduce((sum, i) => sum + i.quantity, 0);

    let discount = 0;
    if (state.promoCode && PROMO_CODES[state.promoCode]) {
      const rule = PROMO_CODES[state.promoCode];
      if (rule.type === 'percent') {
        discount = Math.round((subtotal * rule.value) / 100);
      }
    }

    const freeShippingThreshold = 2999;
    const isFreeShipping =
      subtotal - discount >= freeShippingThreshold ||
      state.promoCode === 'FREESHIP' ||
      subtotal === 0;
    const shipping = isFreeShipping ? 0 : 149;
    const taxable = Math.max(0, subtotal - discount);
    const gstIncluded = Math.round(taxable * 0.12);
    const total = taxable + shipping;

    return {
      detailedItems,
      subtotal,
      totalCount,
      discount,
      shipping,
      gstIncluded,
      total,
      freeShippingThreshold,
      amountToFreeShipping: Math.max(0, freeShippingThreshold - (subtotal - discount)),
    };
  }, [state.cart, state.products, state.promoCode]);

  // Add to cart action with toast
  const handleAddToCart = useCallback(
    (product, size, colorObj, quantity = 1, openDrawer = false) => {
      const chosenSize =
        size ||
        Object.keys(product.sizes).find((s) => product.sizes[s] > 0) ||
        Object.keys(product.sizes)[0];
      const chosenColor = colorObj || product.colors[0];

      if ((product.sizes[chosenSize] || 0) <= 0) {
        notify(`Size ${chosenSize} is currently out of stock.`, 'error');
        return;
      }

      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          productId: product.id,
          size: chosenSize,
          color: chosenColor.name,
          colorHex: chosenColor.hex,
          quantity,
        },
      });
      notify(`Added ${product.title} (${chosenSize}) to your bag.`);
      if (openDrawer) setCartDrawerOpen(true);
    },
    [notify]
  );

  const handleToggleWishlist = useCallback(
    (product) => {
      const exists = state.wishlist.includes(product.id);
      dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
      notify(
        exists
          ? `Removed ${product.title} from Wishlist.`
          : `Saved ${product.title} to your Wishlist.`,
        'info'
      );
    },
    [state.wishlist, notify]
  );

  // Live search suggestions for navbar
  const navSuggestions = useMemo(() => {
    const q = debouncedNavSearch.trim().toLowerCase();
    if (!q) return [];
    return state.products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [debouncedNavSearch, state.products]);

  const isDark = state.theme === 'dark';

  // Theme CSS Variable Tokens matching the prompt specification:
  // Theme 1 - LIGHT: Charcoal Grey #36454F, Moonlit Silver #C9CED6, Signal Red #E63946
  // Theme 2 - DARK: Jet Black #0A0A0B, Royal Amethyst #6B3FA0, Electric Cyan #00E5FF
  const themeStyle = isDark
    ? {
        '--ak-bg': '#0A0A0B',
        '--ak-surface': '#13111C',
        '--ak-card': '#191426',
        '--ak-secondary': '#6B3FA0',
        '--ak-text': '#F4F6F9',
        '--ak-muted': '#A6A1B8',
        '--ak-border': '#2F2347',
        '--ak-accent': '#00E5FF',
        '--ak-accent-fg': '#0A0A0B',
        '--ak-badge': '#6B3FA0',
      }
    : {
        '--ak-bg': '#F4F6F8',
        '--ak-surface': '#FFFFFF',
        '--ak-card': '#E6E9EE',
        '--ak-secondary': '#C9CED6',
        '--ak-text': '#36454F',
        '--ak-muted': '#5A6B77',
        '--ak-border': '#C9CED6',
        '--ak-accent': '#E63946',
        '--ak-accent-fg': '#FFFFFF',
        '--ak-badge': '#36454F',
      };

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      route,
      navigate,
      selectCategoryAndGo,
      cartSummary,
      handleAddToCart,
      handleToggleWishlist,
      notify,
      setQuickViewProduct,
      setSizeGuideCategory,
      setCartDrawerOpen,
      setArchModalOpen,
    }),
    [
      state,
      route,
      navigate,
      selectCategoryAndGo,
      cartSummary,
      handleAddToCart,
      handleToggleWishlist,
      notify,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      <div
        style={themeStyle}
        className={`${
          isDark ? 'dark' : ''
        } min-h-screen bg-[var(--ak-bg)] text-[var(--ak-text)] font-sans transition-colors duration-300 selection:bg-[var(--ak-accent)] selection:text-[var(--ak-accent-fg)]`}
      >
        {/* Google Fonts Injection for Space Grotesk + Inter */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
          .font-display { font-family: 'Space Grotesk', sans-serif; }
          .font-sans { font-family: 'Inter', sans-serif; }
          .ak-hover-glow:hover {
            box-shadow: ${
              isDark
                ? '0 0 24px rgba(0, 229, 255, 0.32)'
                : '0 10px 25px -5px rgba(230, 57, 70, 0.25)'
            };
          }
          .ak-nav-underline {
            position: relative;
          }
          .ak-nav-underline::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 0%;
            height: 2px;
            background-color: var(--ak-accent);
            transition: width 0.25s ease;
          }
          .ak-nav-underline:hover::after {
            width: 100%;
          }
        `}</style>

        {/* ─── TOP ANNOUNCEMENT BAR ─── */}
        <div
          className="px-4 py-2 text-[11px] font-bold tracking-widest uppercase text-center border-b border-[var(--ak-border)]"
          style={{
            backgroundColor: isDark ? '#6B3FA0' : '#36454F',
            color: '#FFFFFF',
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="hidden md:inline opacity-90">
              AW26 &ldquo;METROPOLIS ARCHIVE&rdquo; LIVE NOW
            </span>
            <span className="mx-auto">
              FREE EXPRESS SHIPPING OVER ₹2,999 • USE CODE{' '}
              <span
                className="px-1.5 py-0.5 rounded font-mono font-extrabold"
                style={{
                  backgroundColor: isDark ? '#00E5FF' : '#E63946',
                  color: isDark ? '#0A0A0B' : '#FFFFFF',
                }}
              >
                AKSHAY20
              </span>{' '}
              FOR 20% OFF
            </span>
            <button
              onClick={() => setArchModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 underline hover:opacity-80"
            >
              <Terminal className="w-3.5 h-3.5" /> Code & Deploy Guide
            </button>
          </div>
        </div>

        {/* ─── STICKY NAVBAR WITH MEGA-MENU & LIVE SEARCH ─── */}
        <header className="sticky top-0 z-40 border-b border-[var(--ak-border)] bg-[var(--ak-surface)]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Trigger + Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open Navigation Drawer"
                className="lg:hidden p-2 rounded-lg border border-[var(--ak-border)] hover:border-[var(--ak-accent)]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={() => navigate('home')}
                className="text-left group focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-7 rounded-sm inline-block transition-transform group-hover:scale-y-110"
                    style={{ backgroundColor: 'var(--ak-accent)' }}
                  />
                  <div>
                    <span className="font-display text-2xl font-extrabold tracking-tighter block leading-none">
                      AKSHAY
                    </span>
                    <span className="text-[9px] font-mono tracking-[0.28em] uppercase opacity-70 block">
                      URBAN ARCHIVE
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Center: Desktop Navigation + Mega-Menu Trigger */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-widest">
              <button
                onClick={() => navigate('home')}
                className={`ak-nav-underline py-1 ${
                  route.page === 'home' ? 'text-[var(--ak-accent)]' : ''
                }`}
              >
                Home
              </button>
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  onClick={() => selectCategoryAndGo('All')}
                  className={`ak-nav-underline py-1 inline-flex items-center gap-1 ${
                    route.page === 'shop' ? 'text-[var(--ak-accent)]' : ''
                  }`}
                >
                  Collections <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Mega Menu Dropdown */}
                {megaMenuOpen && (
                  <div className="absolute left-0 top-full pt-3 w-[640px] -ml-28 z-50">
                    <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] shadow-2xl grid grid-cols-3 gap-6 normal-case tracking-normal">
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ak-accent)] mb-3">
                          Apparel Categories
                        </p>
                        <ul className="space-y-2 text-xs font-semibold">
                          {['All', 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Bottoms', 'Accessories'].map(
                            (cat) => (
                              <li key={cat}>
                                <button
                                  onClick={() => selectCategoryAndGo(cat)}
                                  className="hover:text-[var(--ak-accent)] flex items-center justify-between w-full py-0.5"
                                >
                                  <span>{cat === 'All' ? 'Shop All Archive' : cat}</span>
                                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--ak-accent)] mb-3">
                          Curated Edits
                        </p>
                        <ul className="space-y-2.5 text-xs">
                          <li>
                            <button
                              onClick={() => {
                                setShopOnSaleOnly(false);
                                selectCategoryAndGo('All');
                              }}
                              className="text-left hover:text-[var(--ak-accent)]"
                            >
                              <span className="font-bold block">AW26 New Drop</span>
                              <span className="text-[11px] opacity-70">280–480 GSM Heavyweights</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                setShopOnSaleOnly(true);
                                selectCategoryAndGo('All');
                              }}
                              className="text-left hover:text-[var(--ak-accent)]"
                            >
                              <span className="font-bold block">Archive Sale (Up to 30% Off)</span>
                              <span className="text-[11px] opacity-70">Limited sizes remaining</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => setSizeGuideCategory('All Silhouettes')}
                              className="text-left hover:text-[var(--ak-accent)]"
                            >
                              <span className="font-bold block">Interactive Size Calculator</span>
                              <span className="text-[11px] opacity-70">Find your exact boxy fit</span>
                            </button>
                          </li>
                        </ul>
                      </div>

                      <div
                        className="rounded-xl p-4 flex flex-col justify-between text-white"
                        style={{
                          background: isDark
                            ? 'linear-gradient(135deg, #6B3FA0 0%, #0A0A0B 100%)'
                            : 'linear-gradient(135deg, #36454F 0%, #1B242B 100%)',
                        }}
                      >
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-white/20">
                            FEATURED CAPSULE
                          </span>
                          <h4 className="font-display text-base font-extrabold mt-2">
                            MONSOON TECH SHELLS
                          </h4>
                          <p className="text-[11px] opacity-80 mt-1">
                            10,000mm waterproof membrane with internal sling straps.
                          </p>
                        </div>
                        <button
                          onClick={() => selectCategoryAndGo('Jackets')}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                          style={{ color: isDark ? '#00E5FF' : '#E63946' }}
                        >
                          Explore Jackets <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShopOnSaleOnly(true);
                  selectCategoryAndGo('All');
                }}
                className="ak-nav-underline py-1 text-[var(--ak-accent)]"
              >
                Sale
              </button>
              <button
                onClick={() => navigate('about')}
                className={`ak-nav-underline py-1 ${
                  route.page === 'about' ? 'text-[var(--ak-accent)]' : ''
                }`}
              >
                Editorial / About
              </button>
              <button
                onClick={() => navigate('faq')}
                className={`ak-nav-underline py-1 ${
                  route.page === 'faq' ? 'text-[var(--ak-accent)]' : ''
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => navigate('admin')}
                className={`ak-nav-underline py-1 inline-flex items-center gap-1 ${
                  route.page === 'admin' ? 'text-[var(--ak-accent)]' : ''
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Admin
              </button>
            </nav>

            {/* Right: Search Bar + Theme Toggle + Wishlist + Account + Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Live Search Input */}
              <div className="relative hidden sm:block w-44 xl:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  type="text"
                  value={navSearch}
                  onFocus={() => setNavSearchFocused(true)}
                  onBlur={() => setTimeout(() => setNavSearchFocused(false), 180)}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && navSearch.trim()) {
                      setShopSearch(navSearch.trim());
                      navigate('shop');
                    }
                  }}
                  placeholder="Search 480 GSM, cargos..."
                  aria-label="Search clothing catalog"
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-[var(--ak-border)] bg-[var(--ak-bg)] focus:outline-none focus:border-[var(--ak-accent)]"
                />
                {navSearchFocused && navSuggestions.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)] shadow-2xl overflow-hidden z-50">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest opacity-60 border-b border-[var(--ak-border)]">
                      Instant Matches
                    </div>
                    {navSuggestions.map((item) => (
                      <button
                        key={item.id}
                        onMouseDown={() => navigate('product', { id: item.id })}
                        className="w-full px-3 py-2.5 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between gap-3 border-b last:border-b-0 border-[var(--ak-border)]"
                      >
                        <div>
                          <p className="text-xs font-bold line-clamp-1">{item.title}</p>
                          <p className="text-[10px] opacity-65">{item.category}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[var(--ak-accent)]">
                          {formatINR(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle (Light Charcoal/Silver/Red <-> Dark Jet Black/Amethyst/Cyan) */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                aria-label="Toggle Light and Dark Brand Theme"
                title={
                  isDark
                    ? 'Switch to Theme 1: Light (Charcoal / Silver / Signal Red)'
                    : 'Switch to Theme 2: Dark (Jet Black / Amethyst / Electric Cyan)'
                }
                className="p-2 rounded-full border border-[var(--ak-border)] bg-[var(--ak-bg)] hover:border-[var(--ak-accent)] transition-colors"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-[#00E5FF]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#36454F]" />
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => navigate('wishlist')}
                aria-label="Open Wishlist"
                className="relative p-2 rounded-full border border-[var(--ak-border)] bg-[var(--ak-bg)] hover:border-[var(--ak-accent)]"
              >
                <Heart className="w-4 h-4" />
                {state.wishlist.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--ak-accent)',
                      color: 'var(--ak-accent-fg)',
                    }}
                  >
                    {state.wishlist.length}
                  </span>
                )}
              </button>

              {/* Account Button */}
              <button
                onClick={() => navigate('account')}
                aria-label="User Account"
                className="p-2 rounded-full border border-[var(--ak-border)] bg-[var(--ak-bg)] hover:border-[var(--ak-accent)]"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                aria-label="Open Shopping Bag"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-transform active:scale-95 ak-hover-glow"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cartSummary.totalCount}</span>
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[var(--ak-border)] bg-[var(--ak-surface)] px-4 py-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  type="text"
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                  placeholder="Search garments..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase">
                {['All', 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Bottoms', 'Accessories'].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => selectCategoryAndGo(c)}
                      className="p-2.5 rounded-lg border border-[var(--ak-border)] text-left hover:border-[var(--ak-accent)]"
                    >
                      {c === 'All' ? 'Shop All' : c}
                    </button>
                  )
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--ak-border)] text-xs font-bold">
                <button onClick={() => navigate('about')}>About</button>
                <button onClick={() => navigate('contact')}>Contact</button>
                <button onClick={() => navigate('faq')}>FAQ</button>
                <button onClick={() => navigate('admin')} className="text-[var(--ak-accent)]">
                  Admin Dashboard
                </button>
                <button onClick={() => setArchModalOpen(true)} className="underline">
                  Project Docs
                </button>
              </div>
            </div>
          )}
        </header>

        {/* ─── MAIN ROUTE VIEWPORT ─── */}
        <main className="min-h-[75vh]">
          {route.page === 'home' && <HomePage />}
          {route.page === 'shop' && (
            <ShopPage
              shopCategory={shopCategory}
              setShopCategory={setShopCategory}
              shopSize={shopSize}
              setShopSize={setShopSize}
              shopColor={shopColor}
              setShopColor={setShopColor}
              shopMaxPrice={shopMaxPrice}
              setShopMaxPrice={setShopMaxPrice}
              shopMinRating={shopMinRating}
              setShopMinRating={setShopMinRating}
              shopInStockOnly={shopInStockOnly}
              setShopInStockOnly={setShopInStockOnly}
              shopOnSaleOnly={shopOnSaleOnly}
              setShopOnSaleOnly={setShopOnSaleOnly}
              shopSort={shopSort}
              setShopSort={setShopSort}
              shopSearch={shopSearch}
              setShopSearch={setShopSearch}
              debouncedShopSearch={debouncedShopSearch}
              visibleCount={visibleCount}
              setVisibleCount={setVisibleCount}
              isFilteringSkeleton={isFilteringSkeleton}
            />
          )}
          {route.page === 'product' && <ProductDetailsPage productId={route.params?.id} />}
          {route.page === 'cart' && <CartPage />}
          {route.page === 'checkout' && <CheckoutPage />}
          {route.page === 'order-confirmation' && (
            <OrderConfirmationPage order={route.params?.order} />
          )}
          {route.page === 'wishlist' && <WishlistPage />}
          {route.page === 'account' && <AccountPage />}
          {route.page === 'admin' && <AdminDashboardPage />}
          {route.page === 'about' && <AboutPage />}
          {route.page === 'contact' && <ContactPage />}
          {route.page === 'faq' && <FaqPage />}
          {route.page === 'policies' && <PoliciesPage initialTab={route.params?.tab} />}
          {route.page === '404' && <NotFoundPage />}
        </main>

        {/* ─── EDITORIAL FOOTER ─── */}
        <Footer onOpenDocs={() => setArchModalOpen(true)} />

        {/* ─── SLIDE-OVER CART DRAWER ─── */}
        {cartDrawerOpen && <CartDrawer onClose={() => setCartDrawerOpen(false)} />}

        {/* ─── QUICK-VIEW MODAL ─── */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}

        {/* ─── SIZE GUIDE MODAL ─── */}
        <SizeGuideModal
          isOpen={Boolean(sizeGuideCategory)}
          category={sizeGuideCategory || 'All Garments'}
          onClose={() => setSizeGuideCategory(null)}
        />

        {/* ─── ARCHITECTURE, SETUP & DEPLOYMENT GUIDE MODAL ─── */}
        {archModalOpen && <ArchitectureGuideModal onClose={() => setArchModalOpen(false)} />}

        {/* ─── TOAST NOTIFICATIONS STACK ─── */}
        <div
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        >
          {state.toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-[var(--ak-text)] shadow-2xl text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                {t.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[var(--ak-accent)] shrink-0" />
                )}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: t.id })}
                className="opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </StoreContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. REUSABLE PRODUCT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ProductCard({ product }) {
  const {
    state,
    navigate,
    handleAddToCart,
    handleToggleWishlist,
    setQuickViewProduct,
  } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [hovered, setHovered] = useState(false);

  const isWishlisted = state.wishlist.includes(product.id);
  const discountPct =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] overflow-hidden flex flex-col justify-between transition-all duration-300 ak-hover-glow"
    >
      <div>
        {/* Image / Studio Garment Preview Box */}
        <div className="relative aspect-[4/5] bg-[var(--ak-card)] overflow-hidden">
          <button
            onClick={() => navigate('product', { id: product.id })}
            className="w-full h-full block text-left focus:outline-none"
          >
            <GarmentIllustration
              product={product}
              colorHex={selectedColor?.hex}
              viewAngle={hovered ? 'back' : 'front'}
              className="w-full h-full"
            />
          </button>

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {product.badgeText && (
              <span
                className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest"
                style={{
                  backgroundColor: 'var(--ak-badge)',
                  color: '#FFFFFF',
                }}
              >
                {product.badgeText}
              </span>
            )}
            {discountPct > 0 && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                -{discountPct}% SALE
              </span>
            )}
          </div>

          {/* Top Right Wishlist & Quick View */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={() => handleToggleWishlist(product)}
              aria-label={`Save ${product.title} to wishlist`}
              className="p-2 rounded-full bg-[var(--ak-surface)]/90 backdrop-blur border border-[var(--ak-border)] hover:border-[var(--ak-accent)] transition-transform active:scale-90"
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? 'fill-[var(--ak-accent)] text-[var(--ak-accent)]' : ''
                }`}
              />
            </button>
            <button
              onClick={() => setQuickViewProduct(product)}
              aria-label={`Quick view ${product.title}`}
              className="p-2 rounded-full bg-[var(--ak-surface)]/90 backdrop-blur border border-[var(--ak-border)] hover:border-[var(--ak-accent)]"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick-Add Size Bar on Hover */}
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <div className="p-2 rounded-xl bg-[var(--ak-surface)]/95 backdrop-blur border border-[var(--ak-border)] shadow-lg">
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1.5 text-center">
                Quick Add Size
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {Object.entries(product.sizes).map(([sz, stock]) => (
                  <button
                    key={sz}
                    disabled={stock <= 0}
                    onClick={() => handleAddToCart(product, sz, selectedColor, 1, false)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors ${
                      stock <= 0
                        ? 'opacity-30 line-through cursor-not-allowed border-[var(--ak-border)]'
                        : 'border-[var(--ak-border)] hover:bg-[var(--ak-accent)] hover:text-[var(--ak-accent-fg)] hover:border-[var(--ak-accent)]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] opacity-75 mb-1">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          <button
            onClick={() => navigate('product', { id: product.id })}
            className="text-left block w-full group-hover:text-[var(--ak-accent)] transition-colors"
          >
            <h3 className="font-display text-sm font-extrabold tracking-tight line-clamp-1">
              {product.title}
            </h3>
          </button>
          <p className="text-xs opacity-70 line-clamp-1 mt-0.5">{product.subtitle}</p>
        </div>
      </div>

      {/* Price & Color Swatches Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-[var(--ak-border)]/60 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-extrabold">
            {formatINR(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs line-through opacity-50 font-mono">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c)}
              title={c.name}
              aria-label={`Preview color ${c.name}`}
              className={`w-4 h-4 rounded-full border ${
                selectedColor.name === c.name
                  ? 'ring-2 ring-offset-1 ring-[var(--ak-accent)] scale-110'
                  : 'opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. PAGE 1: HOME PAGE (HERO, CATEGORIES, NEW DROP, BEST SELLERS, LOOKBOOK, ETC.)
// ═══════════════════════════════════════════════════════════════════════════════

function HomePage() {
  const {
    state,
    navigate,
    selectCategoryAndGo,
    handleAddToCart,
    notify,
  } = useStore();
  const [heroProductIndex, setHeroProductIndex] = useState(0);
  const [bestSellerFilter, setBestSellerFilter] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const heroProducts = useMemo(
    () => state.products.filter((p) => p.isNewDrop).slice(0, 4),
    [state.products]
  );
  const activeHeroProduct = heroProducts[heroProductIndex] || state.products[0];

  const newDrops = useMemo(
    () => state.products.filter((p) => p.isNewDrop).slice(0, 4),
    [state.products]
  );

  const bestSellers = useMemo(() => {
    const pool = state.products.filter((p) => p.isBestSeller);
    if (bestSellerFilter === 'All') return pool.slice(0, 8);
    return pool.filter((p) => p.category === bestSellerFilter).slice(0, 8);
  }, [state.products, bestSellerFilter]);

  const categories = [
    { name: 'T-Shirts', count: '240–280 GSM Boxy Cuts', tag: 'CORE' },
    { name: 'Hoodies', count: '480 GSM Loopback Terry', tag: 'HEAVYWEIGHT' },
    { name: 'Jackets', count: '3-Layer Shells & Varsity', tag: 'OUTERWEAR' },
    { name: 'Shirts', count: 'Cupro Camp & Ripstop', tag: 'EDITORIAL' },
    { name: 'Bottoms', count: '13.5oz Denim & 8-Pocket Cargos', tag: 'UTILITY' },
    { name: 'Accessories', count: 'Cordura Bags & Hardware', tag: 'MODULAR' },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) {
      notify('Please enter a valid email address.', 'error');
      return;
    }
    notify('Welcome to AKSHAY ARCHIVE! Use code FIRST10 for 10% off.');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* ─── 1. FULL-WIDTH EDITORIAL HERO ─── */}
      <section className="relative overflow-hidden border-b border-[var(--ak-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--ak-border)] bg-[var(--ak-surface)] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--ak-accent)]" />
              <span>SEASON 04 // AUTUMN-WINTER 2026 ARCHIVE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[0.96] uppercase">
              ARCHITECTURAL{' '}
              <span
                className="underline decoration-4 underline-offset-8"
                style={{ textDecorationColor: 'var(--ak-accent)' }}
              >
                STREETWEAR
              </span>{' '}
              FOR THE MODERN METROPOLIS.
            </h1>

            <p className="text-sm sm:text-base opacity-80 max-w-xl leading-relaxed">
              Engineered in India from 280–480 GSM organic ring-spun cotton, 3-layer waterproof
              membranes, and raw selvedge denim. Designed for bold silhouette precision.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => selectCategoryAndGo('All')}
                className="px-7 py-4 rounded-xl font-display font-extrabold text-xs sm:text-sm uppercase tracking-widest inline-flex items-center gap-2.5 transition-transform active:scale-95 ak-hover-glow"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                <span>Shop AW26 Drop</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('lookbook-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-4 rounded-xl font-display font-bold text-xs sm:text-sm uppercase tracking-widest border border-[var(--ak-border)] bg-[var(--ak-surface)] hover:border-[var(--ak-accent)]"
              >
                Explore Lookbook
              </button>
            </div>

            {/* Key Editorial Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--ak-border)] max-w-lg">
              <div>
                <p className="font-display text-2xl font-extrabold text-[var(--ak-accent)]">
                  480 GSM
                </p>
                <p className="text-[11px] uppercase tracking-wider opacity-75">
                  Heavy Loopback Terry
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold">48-HR</p>
                <p className="text-[11px] uppercase tracking-wider opacity-75">
                  Express Metro Dispatch
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold">4.9 ★</p>
                <p className="text-[11px] uppercase tracking-wider opacity-75">
                  18,400+ Verified Fits
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hero Showcase Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] p-5 shadow-2xl relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
                  SPOTLIGHT SILHOUETTE // 0{heroProductIndex + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  {heroProducts.map((hp, idx) => (
                    <button
                      key={hp.id}
                      onClick={() => setHeroProductIndex(idx)}
                      aria-label={`Spotlight item ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        heroProductIndex === idx
                          ? 'w-7 bg-[var(--ak-accent)]'
                          : 'w-2 bg-[var(--ak-border)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div
                onClick={() => navigate('product', { id: activeHeroProduct.id })}
                className="aspect-square rounded-2xl bg-[var(--ak-card)] overflow-hidden cursor-pointer"
              >
                <GarmentIllustration
                  product={activeHeroProduct}
                  colorHex={activeHeroProduct.colors[0]?.hex}
                  viewAngle="front"
                  className="w-full h-full"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-base font-extrabold">
                    {activeHeroProduct.title}
                  </h2>
                  <p className="text-xs opacity-75">{activeHeroProduct.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-lg font-extrabold text-[var(--ak-accent)]">
                    {formatINR(activeHeroProduct.price)}
                  </p>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        activeHeroProduct,
                        'L',
                        activeHeroProduct.colors[0],
                        1,
                        true
                      )
                    }
                    className="text-[11px] font-bold uppercase tracking-wider underline hover:opacity-80"
                  >
                    + Quick Bag (L)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TRUST BADGES BAR ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: '256-Bit Encrypted Checkout',
              desc: 'UPI, Cards, NetBanking & COD verified by Razorpay',
            },
            {
              icon: Truck,
              title: 'Fast 48-Hr Metro Delivery',
              desc: 'Free express air shipping on orders above ₹2,999',
            },
            {
              icon: RotateCcw,
              title: 'Easy 7-Day Returns',
              desc: 'Instant size exchange & doorstep reverse pickup',
            },
            {
              icon: Award,
              title: 'Heavyweight GSM Guarantee',
              desc: 'Pre-shrunk combed organic cotton & YKK hardware',
            },
          ].map((b) => (
            <div
              key={b.title}
              className="p-4 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] flex items-start gap-3.5"
            >
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                <b.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xs font-extrabold uppercase tracking-wider">
                  {b.title}
                </h3>
                <p className="text-xs opacity-75 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. SHOP BY CATEGORY TILES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
              01 // ARCHITECTURAL SILHOUETTES
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              SHOP BY CATEGORY
            </h2>
          </div>
          <button
            onClick={() => selectCategoryAndGo('All')}
            className="text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 hover:text-[var(--ak-accent)]"
          >
            View Full Catalog (24 Items) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const sampleProduct =
              state.products.find((p) => p.category === cat.name) || state.products[0];
            return (
              <button
                key={cat.name}
                onClick={() => selectCategoryAndGo(cat.name)}
                className="group text-left rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] p-5 flex items-center justify-between gap-4 transition-all ak-hover-glow"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[var(--ak-card)]">
                    {cat.tag}
                  </span>
                  <h3 className="font-display text-xl font-extrabold uppercase group-hover:text-[var(--ak-accent)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs opacity-75">{cat.count}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--ak-accent)] pt-1">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="w-28 h-28 rounded-xl bg-[var(--ak-card)] shrink-0 overflow-hidden">
                  <GarmentIllustration
                    product={sampleProduct}
                    colorHex={sampleProduct.colors[0]?.hex}
                    className="w-full h-full"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── 4. "NEW DROP" AW26 COLLECTION ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
              02 // LIMITED RELEASE
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              NEW DROP: AW26 METROPOLIS
            </h2>
          </div>
          <button
            onClick={() => selectCategoryAndGo('All')}
            className="text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 hover:text-[var(--ak-accent)]"
          >
            Shop All New Arrivals <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newDrops.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ─── 5. EDITORIAL LOOKBOOK SECTION WITH "SHOP THE LOOK" ─── */}
      <section id="lookbook-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
            03 // SEASONAL CAMPAIGN
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
            EDITORIAL LOOKBOOK — SHOP THE FIT
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {LOOKBOOK_EDITORIALS.map((look) => {
            const lookProducts = look.productIds
              .map((id) => state.products.find((p) => p.id === id))
              .filter(Boolean);
            const bundleTotal = lookProducts.reduce((s, p) => s + p.price, 0);

            return (
              <div
                key={look.id}
                className="rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
                    {look.tag}
                  </span>
                  <h3 className="font-display text-xl font-extrabold uppercase">{look.title}</h3>
                  <p className="text-xs opacity-75 leading-relaxed">{look.subtitle}</p>

                  {/* 3-Item Visual Collage */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {lookProducts.map((lp) => (
                      <button
                        key={lp.id}
                        onClick={() => navigate('product', { id: lp.id })}
                        className="rounded-xl bg-[var(--ak-card)] p-2 text-left hover:ring-2 ring-[var(--ak-accent)] transition-all"
                      >
                        <div className="aspect-square">
                          <GarmentIllustration
                            product={lp}
                            colorHex={lp.colors[0]?.hex}
                            className="w-full h-full"
                          />
                        </div>
                        <p className="text-[10px] font-bold line-clamp-1 mt-1">{lp.title}</p>
                        <p className="text-[10px] font-mono text-[var(--ak-accent)]">
                          {formatINR(lp.price)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--ak-border)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-70 block">
                      Complete 3-Piece Fit
                    </span>
                    <span className="font-display text-base font-extrabold">
                      {formatINR(bundleTotal)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      lookProducts.forEach((lp) =>
                        handleAddToCart(lp, null, lp.colors[0], 1, false)
                      );
                      notify(`Added all 3 pieces from "${look.title}" to your bag!`);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: 'var(--ak-accent)',
                      color: 'var(--ak-accent-fg)',
                    }}
                  >
                    + Add Full Look
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 6. BEST SELLERS WITH CATEGORY FILTER PILLS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
              04 // MOST WANTED
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              ARCHIVE BEST SELLERS
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Bottoms'].map((tab) => (
              <button
                key={tab}
                onClick={() => setBestSellerFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                  bestSellerFilter === tab
                    ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                    : 'border-[var(--ak-border)] bg-[var(--ak-surface)] hover:border-[var(--ak-accent)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ─── 7. VERIFIED CUSTOMER TESTIMONIALS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
            05 // COMMUNITY VERDICT
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
            VERIFIED ARCHIVE REVIEWS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {state.reviews.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold">
                    VERIFIED BUYER
                  </span>
                </div>
                <h3 className="font-display text-sm font-extrabold">{rev.title}</h3>
                <p className="text-xs opacity-80 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
              </div>
              <div className="pt-3 border-t border-[var(--ak-border)] flex items-center justify-between text-[11px] opacity-75">
                <span className="font-bold">
                  {rev.author} • {rev.city}
                </span>
                <span className="font-mono">Size: {rev.sizeBought}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. INSTAGRAM-STYLE SHOPPABLE GALLERY ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
              06 // STYLED ON THE STREETS
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              TAG @AKSHAY.ARCHIVE TO BE FEATURED
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold">
            <Instagram className="w-4 h-4 text-[var(--ak-accent)]" /> #AKSHAYSTREETWEAR
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INSTAGRAM_POSTS.map((post) => {
            const linkedProd =
              state.products.find((p) => p.id === post.productId) || state.products[0];
            return (
              <div
                key={post.id}
                className="rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-square bg-[var(--ak-card)] relative">
                  <GarmentIllustration
                    product={linkedProd}
                    colorHex={linkedProd.colors[0]?.hex}
                    viewAngle="back"
                    className="w-full h-full"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-mono">
                    {post.handle} • {post.location}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs opacity-85 line-clamp-2">{post.caption}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--ak-border)]">
                    <span className="text-[11px] font-mono opacity-70">♥ {post.likes}</span>
                    <button
                      onClick={() => navigate('product', { id: linkedProd.id })}
                      className="text-[11px] font-bold uppercase tracking-wider text-[var(--ak-accent)] hover:underline"
                    >
                      Shop Tagged Piece →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 9. NEWSLETTER INNER-CIRCLE SIGNUP ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-3xl p-8 sm:p-12 border border-[var(--ak-border)] text-white relative overflow-hidden"
          style={{
            background:
              state.theme === 'dark'
                ? 'linear-gradient(135deg, #191426 0%, #6B3FA0 60%, #0A0A0B 100%)'
                : 'linear-gradient(135deg, #36454F 0%, #1E272D 100%)',
          }}
        >
          <div className="max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-white/15">
              UNLOCK EARLY DROP ACCESS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
              JOIN THE AKSHAY INNER ARCHIVE & GET 10% OFF YOUR FIRST ORDER.
            </h2>
            <p className="text-xs sm:text-sm opacity-85">
              Receive private SMS/email links 2 hours before limited heavyweight restocks go public.
              Zero spam—unsubscribe in one click.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-wrap gap-3 pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 min-w-[240px] px-4 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white placeholder:text-white/60 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                Claim 10% Code
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. PAGE 2: SHOP PAGE (FILTERS, COLOR SWATCHES, PRICE SLIDER, SORTING, PAGINATION)
// ═══════════════════════════════════════════════════════════════════════════════

function ShopPage({
  shopCategory,
  setShopCategory,
  shopSize,
  setShopSize,
  shopColor,
  setShopColor,
  shopMaxPrice,
  setShopMaxPrice,
  shopMinRating,
  setShopMinRating,
  shopInStockOnly,
  setShopInStockOnly,
  shopOnSaleOnly,
  setShopOnSaleOnly,
  shopSort,
  setShopSort,
  shopSearch,
  setShopSearch,
  debouncedShopSearch,
  visibleCount,
  setVisibleCount,
  isFilteringSkeleton,
}) {
  const { state } = useStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allColors = useMemo(() => {
    const map = new Map();
    state.products.forEach((p) =>
      p.colors.forEach((c) => {
        if (!map.has(c.name)) map.set(c.name, c.hex);
      })
    );
    return Array.from(map.entries()).slice(0, 12);
  }, [state.products]);

  const filteredProducts = useMemo(() => {
    const q = debouncedShopSearch.trim().toLowerCase();
    let list = state.products.filter((p) => {
      if (shopCategory !== 'All' && p.category !== shopCategory) return false;
      if (shopSize !== 'All' && (p.sizes[shopSize] === undefined || p.sizes[shopSize] <= 0))
        return false;
      if (shopColor !== 'All' && !p.colors.some((c) => c.name === shopColor)) return false;
      if (p.price > shopMaxPrice) return false;
      if (p.rating < shopMinRating) return false;
      if (shopOnSaleOnly && !p.onSale) return false;
      if (shopInStockOnly) {
        const totalStock = Object.values(p.sizes).reduce((a, b) => a + b, 0);
        if (totalStock <= 0) return false;
      }
      if (q) {
        const match =
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    if (shopSort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (shopSort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (shopSort === 'newest') list.sort((a, b) => Number(b.isNewDrop) - Number(a.isNewDrop));
    else if (shopSort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviewsCount - a.reviewsCount);

    return list;
  }, [
    state.products,
    shopCategory,
    shopSize,
    shopColor,
    shopMaxPrice,
    shopMinRating,
    shopOnSaleOnly,
    shopInStockOnly,
    shopSort,
    debouncedShopSearch,
  ]);

  const resetAllFilters = () => {
    setShopCategory('All');
    setShopSize('All');
    setShopColor('All');
    setShopMaxPrice(8000);
    setShopMinRating(0);
    setShopInStockOnly(false);
    setShopOnSaleOnly(false);
    setShopSearch('');
    setShopSort('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--ak-border)] pb-6">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
            AKSHAY // CATALOG ARCHIVE
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            {shopCategory === 'All' ? 'ALL URBAN APPAREL' : shopCategory}
          </h1>
          <p className="text-xs opacity-75 mt-1">
            Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length}{' '}
            pieces
          </p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="text"
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder="Filter by name, GSM, SKU..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-xs"
            />
          </div>

          <select
            value={shopSort}
            onChange={(e) => setShopSort(e.target.value)}
            aria-label="Sort products"
            className="px-3.5 py-2 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-xs font-bold"
          >
            <option value="popular">Sort: Popularity</option>
            <option value="newest">Sort: Newest Drop</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Sort: Highest Rated</option>
          </select>

          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-xs font-bold inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="p-5 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--ak-accent)]" /> Filters
              </h2>
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-bold uppercase underline opacity-75 hover:opacity-100"
              >
                Reset All
              </button>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider opacity-75">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Bottoms', 'Accessories'].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setShopCategory(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        shopCategory === c
                          ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                          : 'border-[var(--ak-border)] hover:border-[var(--ak-accent)]'
                      }`}
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider opacity-75">
                In-Stock Size
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setShopSize(sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                      shopSize === sz
                        ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                        : 'border-[var(--ak-border)] hover:border-[var(--ak-accent)]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider opacity-75">Max Price</span>
                <span className="font-mono font-bold text-[var(--ak-accent)]">
                  {formatINR(shopMaxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="999"
                max="8000"
                step="100"
                value={shopMaxPrice}
                onChange={(e) => setShopMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--ak-accent)]"
              />
              <div className="flex justify-between text-[10px] font-mono opacity-60">
                <span>₹999</span>
                <span>₹8,000</span>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider opacity-75">Colorway</span>
                {shopColor !== 'All' && (
                  <button
                    onClick={() => setShopColor('All')}
                    className="text-[10px] underline"
                  >
                    Clear ({shopColor})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allColors.map(([name, hex]) => (
                  <button
                    key={name}
                    onClick={() => setShopColor(shopColor === name ? 'All' : name)}
                    title={name}
                    className={`w-6 h-6 rounded-full border ${
                      shopColor === name
                        ? 'ring-2 ring-offset-2 ring-[var(--ak-accent)] scale-110'
                        : ''
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider opacity-75">
                Minimum Rating
              </p>
              <div className="flex gap-1.5">
                {[0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setShopMinRating(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                      shopMinRating === r
                        ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                        : 'border-[var(--ak-border)]'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes: On Sale & In Stock */}
            <div className="space-y-2 pt-2 border-t border-[var(--ak-border)] text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shopOnSaleOnly}
                  onChange={(e) => setShopOnSaleOnly(e.target.checked)}
                  className="accent-[var(--ak-accent)]"
                />
                <span>On Sale Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shopInStockOnly}
                  onChange={(e) => setShopInStockOnly(e.target.checked)}
                  className="accent-[var(--ak-accent)]"
                />
                <span>In-Stock Ready to Ship</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid + Skeletons + Empty State */}
        <div className="lg:col-span-9 space-y-8">
          {isFilteringSkeleton ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-[4/5] rounded-xl bg-[var(--ak-card)]" />
                  <div className="h-4 w-2/3 rounded bg-[var(--ak-card)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--ak-card)]" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] p-12 text-center space-y-4">
              <Package className="w-10 h-10 mx-auto text-[var(--ak-accent)]" />
              <h3 className="font-display text-xl font-extrabold uppercase">
                NO ARCHIVE PIECES MATCH YOUR FILTERS
              </h3>
              <p className="text-xs opacity-75 max-w-md mx-auto">
                Try clearing your size, colorway, or price ceiling filter to view all 24 pieces in
                the AW26 collection.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.slice(0, visibleCount).map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Load More Pagination */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleCount((c) => c + 6)}
                    className="px-7 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest border border-[var(--ak-border)] bg-[var(--ak-surface)] hover:border-[var(--ak-accent)]"
                  >
                    Load More Pieces ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. PAGE 3: PRODUCT DETAILS PAGE (ZOOM GALLERY, SWATCHES, SIZES, TABS, REVIEWS)
// ═══════════════════════════════════════════════════════════════════════════════

function ProductDetailsPage({ productId }) {
  const {
    state,
    dispatch,
    navigate,
    handleAddToCart,
    handleToggleWishlist,
    setSizeGuideCategory,
    notify,
  } = useStore();

  const product =
    state.products.find((p) => p.id === productId) || state.products[0];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(
    Object.keys(product.sizes).find((s) => product.sizes[s] > 0) ||
      Object.keys(product.sizes)[0]
  );
  const [viewAngle, setViewAngle] = useState('front');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review submission state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    setSelectedColor(product.colors[0]);
    setSelectedSize(
      Object.keys(product.sizes).find((s) => product.sizes[s] > 0) ||
        Object.keys(product.sizes)[0]
    );
    setViewAngle('front');
    setQuantity(1);
  }, [product]);

  const isWishlisted = state.wishlist.includes(product.id);
  const completeLookProducts = (product.completeLookIds || [])
    .map((id) => state.products.find((p) => p.id === id))
    .filter(Boolean);
  const relatedProducts = state.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productReviews = state.reviews.filter((r) => r.productId === product.id);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      notify('Please fill in your name and review comment.', 'error');
      return;
    }
    dispatch({
      type: 'ADD_REVIEW',
      payload: {
        id: 'rev-' + Date.now(),
        productId: product.id,
        author: reviewAuthor.trim(),
        city: reviewCity.trim() || 'India',
        rating: reviewRating,
        date: 'Just now',
        verified: true,
        sizeBought: selectedSize,
        fitFeedback: 'True to size',
        title: reviewTitle.trim() || 'Solid Archive Quality',
        comment: reviewComment.trim(),
      },
    });
    setReviewAuthor('');
    setReviewCity('');
    setReviewTitle('');
    setReviewComment('');
    notify('Thank you! Your verified review has been published.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono opacity-75">
        <button onClick={() => navigate('home')} className="hover:underline">
          HOME
        </button>
        <span>/</span>
        <button onClick={() => navigate('shop')} className="hover:underline">
          {product.category.toUpperCase()}
        </button>
        <span>/</span>
        <span className="text-[var(--ak-accent)] font-bold">{product.title}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Multi-Angle Interactive Zoom Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-card)] overflow-hidden relative">
            <GarmentIllustration
              product={product}
              colorHex={selectedColor?.hex}
              viewAngle={viewAngle}
              interactiveZoom={true}
              className="w-full h-full cursor-crosshair"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/65 text-white text-[10px] font-mono">
              HOVER TO ZOOM 1.65x • CLICK THUMBNAILS TO SWITCH ANGLE
            </div>
          </div>

          {/* Angle Switcher Thumbnails */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'front', label: '01 // Front Studio Silhouette' },
              { id: 'back', label: '02 // Back Print & Architecture' },
              { id: 'macro', label: '03 // GSM Weave & Neck Label' },
            ].map((ang) => (
              <button
                key={ang.id}
                onClick={() => setViewAngle(ang.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  viewAngle === ang.id
                    ? 'border-[var(--ak-accent)] ring-2 ring-[var(--ak-accent)]/30 bg-[var(--ak-surface)]'
                    : 'border-[var(--ak-border)] bg-[var(--ak-surface)] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="h-24 rounded-xl bg-[var(--ak-card)] mb-2 overflow-hidden">
                  <GarmentIllustration
                    product={product}
                    colorHex={selectedColor?.hex}
                    viewAngle={ang.id}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[10px] font-mono font-bold uppercase">{ang.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Specs, Swatches, Size Matrix & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[var(--ak-card)]">
                SKU: {product.sku}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviewsCount + productReviews.length} reviews)
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm opacity-80">{product.subtitle}</p>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[var(--ak-border)]">
            <span className="font-display text-3xl font-extrabold text-[var(--ak-accent)]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-base line-through opacity-50 font-mono">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[var(--ak-accent)] text-[var(--ak-accent-fg)]">
                  SAVE {formatINR(product.originalPrice - product.price)}
                </span>
              </>
            )}
            <span className="text-[11px] opacity-65 ml-auto">Inclusive of all taxes (GST)</span>
          </div>

          {/* Color Swatches */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold uppercase tracking-wider">
                Colorway: <strong className="text-[var(--ak-accent)]">{selectedColor?.name}</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                    selectedColor?.name === c.name
                      ? 'border-[var(--ak-accent)] ring-2 ring-[var(--ak-accent)]/30 bg-[var(--ak-surface)]'
                      : 'border-[var(--ak-border)] bg-[var(--ak-surface)] opacity-80'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector + Size Guide Modal Trigger */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider">
                Select Size:{' '}
                <strong className="font-mono text-[var(--ak-accent)]">{selectedSize}</strong>
              </span>
              <button
                onClick={() => setSizeGuideCategory(product.category)}
                className="inline-flex items-center gap-1 font-bold underline text-[var(--ak-accent)]"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Guide & Fit Calculator
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.entries(product.sizes).map(([sz, stock]) => {
                const out = stock <= 0;
                const active = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    disabled={out}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 px-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                      out
                        ? 'opacity-35 line-through cursor-not-allowed border-[var(--ak-border)]'
                        : active
                        ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)] shadow-md'
                        : 'border-[var(--ak-border)] bg-[var(--ak-surface)] hover:border-[var(--ak-accent)]'
                    }`}
                  >
                    <div>{sz}</div>
                    <div className="text-[9px] opacity-75">
                      {out ? 'SOLD' : stock <= 4 ? `${stock} left` : 'In Stock'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart + Wishlist */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="p-3 hover:text-[var(--ak-accent)]"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-mono text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-3 hover:text-[var(--ak-accent)]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() =>
                handleAddToCart(product, selectedSize, selectedColor, quantity, true)
              }
              className="flex-1 py-3.5 px-6 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2 ak-hover-glow"
              style={{
                backgroundColor: 'var(--ak-accent)',
                color: 'var(--ak-accent-fg)',
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag — {formatINR(product.price * quantity)}</span>
            </button>

            <button
              onClick={() => handleToggleWishlist(product)}
              aria-label="Toggle Wishlist"
              className="p-3.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-surface)] hover:border-[var(--ak-accent)]"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? 'fill-[var(--ak-accent)] text-[var(--ak-accent)]' : ''
                }`}
              />
            </button>
          </div>

          {/* Detail Tabs (Description, Fabric & Care, Fit, Shipping & Returns) */}
          <div className="pt-4 border-t border-[var(--ak-border)] space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[var(--ak-card)] text-[11px] font-bold uppercase">
              {[
                { id: 'description', label: 'Description' },
                { id: 'fabric', label: 'Fabric & Care' },
                { id: 'fit', label: 'Fit & Cut' },
                { id: 'shipping', label: 'Shipping' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`py-2 px-2 rounded-lg transition-colors ${
                    activeTab === t.id
                      ? 'bg-[var(--ak-surface)] text-[var(--ak-accent)] shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-xs leading-relaxed">
              {activeTab === 'description' && <p>{product.description}</p>}
              {activeTab === 'fabric' && (
                <div className="space-y-2">
                  <p>
                    <strong>Material Spec:</strong> {product.fabric}
                  </p>
                  <p>
                    <strong>Care Protocol:</strong> {product.care}
                  </p>
                </div>
              )}
              {activeTab === 'fit' && <p>{product.fit}</p>}
              {activeTab === 'shipping' && (
                <p>
                  Dispatches within 24 hours from Mumbai/Bengaluru. Free Express Shipping on orders
                  above ₹2,999. Easy 7-day reverse pickup returns & instant size exchanges.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete The Look Section */}
      {completeLookProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-[var(--ak-border)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
                CURATED STYLING PAIRING
              </p>
              <h2 className="font-display text-2xl font-extrabold uppercase">
                COMPLETE THE LOOK
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completeLookProducts.map((cp) => (
              <ProductCard key={cp.id} product={cp} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews + Write Review Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[var(--ak-border)]">
        <div className="lg:col-span-5 space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
            VERIFIED FEEDBACK
          </p>
          <h2 className="font-display text-2xl font-extrabold uppercase">
            WRITE AN ARCHIVE REVIEW
          </h2>
          <form
            onSubmit={handleReviewSubmit}
            className="p-5 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-3 text-xs"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Your Name *"
                className="px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
              />
              <input
                type="text"
                value={reviewCity}
                onChange={(e) => setReviewCity(e.target.value)}
                placeholder="City (e.g., Mumbai)"
                className="px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Rating:</span>
              {[5, 4, 3, 2, 1].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReviewRating(r)}
                  className={`px-2.5 py-1 rounded border font-mono ${
                    reviewRating === r
                      ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                      : 'border-[var(--ak-border)]'
                  }`}
                >
                  {r}★
                </button>
              ))}
            </div>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Review Headline (e.g., Unreal 480 GSM weight)"
              className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
            />
            <textarea
              rows={3}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How is the fit, fabric weight, and finish? *"
              className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-display font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--ak-accent)',
                color: 'var(--ak-accent-fg)',
              }}
            >
              Submit Verified Review
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-display text-lg font-extrabold uppercase">
            RECENT REVIEWS ({productReviews.length || state.reviews.length})
          </h3>
          <div className="space-y-3">
            {(productReviews.length > 0 ? productReviews : state.reviews).map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">
                    {r.author} ({r.city}) •{' '}
                    <span className="font-mono text-[var(--ak-accent)]">
                      Size {r.sizeBought}
                    </span>
                  </span>
                  <span className="font-mono opacity-60">{r.date}</span>
                </div>
                <p className="font-display text-sm font-bold">{r.title}</p>
                <p className="text-xs opacity-80">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-6 pt-8 border-t border-[var(--ak-border)]">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          SIMILAR ARCHIVE SILHOUETTES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((rp) => (
            <ProductCard key={rp.id} product={rp} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. QUICK-VIEW MODAL & CART DRAWER
// ═══════════════════════════════════════════════════════════════════════════════

function QuickViewModal({ product, onClose }) {
  const { handleAddToCart, navigate } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(
    Object.keys(product.sizes).find((s) => product.sizes[s] > 0) ||
      Object.keys(product.sizes)[0]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-[var(--ak-text)] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="aspect-square bg-[var(--ak-card)]">
          <GarmentIllustration
            product={product}
            colorHex={selectedColor?.hex}
            className="w-full h-full"
          />
        </div>
        <div className="p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                {product.sku}
              </span>
              <button onClick={onClose} aria-label="Close Quick View">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-display text-xl font-extrabold uppercase">{product.title}</h3>
            <p className="font-display text-2xl font-extrabold text-[var(--ak-accent)]">
              {formatINR(product.price)}
            </p>
            <p className="text-xs opacity-80">{product.description}</p>

            {/* Color Swatches */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold uppercase">
                Color: {selectedColor?.name}
              </span>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border ${
                      selectedColor?.name === c.name
                        ? 'ring-2 ring-offset-1 ring-[var(--ak-accent)]'
                        : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold uppercase">Size: {selectedSize}</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(product.sizes).map(([sz, st]) => (
                  <button
                    key={sz}
                    disabled={st <= 0}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                      st <= 0
                        ? 'opacity-30 line-through'
                        : selectedSize === sz
                        ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                        : 'border-[var(--ak-border)]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[var(--ak-border)]">
            <button
              onClick={() => {
                handleAddToCart(product, selectedSize, selectedColor, 1, true);
                onClose();
              }}
              className="w-full py-3 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest"
              style={{
                backgroundColor: 'var(--ak-accent)',
                color: 'var(--ak-accent-fg)',
              }}
            >
              Add to Bag — {formatINR(product.price)}
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('product', { id: product.id });
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase border border-[var(--ak-border)]"
            >
              View Full Specs & Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ onClose }) {
  const { cartSummary, dispatch, navigate } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--ak-surface)] text-[var(--ak-text)] h-full flex flex-col justify-between border-l border-[var(--ak-border)] shadow-2xl">
        <div className="p-5 border-b border-[var(--ak-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--ak-accent)]" />
            <h3 className="font-display text-lg font-extrabold uppercase">
              YOUR BAG ({cartSummary.totalCount})
            </h3>
          </div>
          <button onClick={onClose} aria-label="Close Bag Drawer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-5 py-3 bg-[var(--ak-bg)] border-b border-[var(--ak-border)] text-xs">
          {cartSummary.amountToFreeShipping === 0 ? (
            <p className="font-bold text-emerald-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> You unlocked FREE Express Air Shipping!
            </p>
          ) : (
            <p>
              Add{' '}
              <strong className="text-[var(--ak-accent)]">
                {formatINR(cartSummary.amountToFreeShipping)}
              </strong>{' '}
              more for <strong>FREE Express Shipping</strong>
            </p>
          )}
          <div className="w-full h-1.5 rounded-full bg-[var(--ak-border)] mt-2 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  (cartSummary.subtotal / cartSummary.freeShippingThreshold) * 100
                )}%`,
                backgroundColor: 'var(--ak-accent)',
              }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartSummary.detailedItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-40" />
              <p className="font-display font-bold uppercase">Your Archive Bag is Empty</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('shop');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                Explore AW26 Drop
              </button>
            </div>
          ) : (
            cartSummary.detailedItems.map((item, idx) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-3.5 p-3 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
              >
                <div className="w-20 h-24 rounded-xl bg-[var(--ak-card)] shrink-0 overflow-hidden">
                  <GarmentIllustration
                    product={item.product}
                    colorHex={item.colorHex}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex justify-between gap-2">
                    <h4 className="font-display font-bold line-clamp-1">{item.product.title}</h4>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: idx })}
                      aria-label="Remove item"
                      className="opacity-60 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="opacity-70 font-mono">
                    Size: {item.size} • {item.color}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="inline-flex items-center rounded-lg border border-[var(--ak-border)] bg-[var(--ak-surface)]">
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CART_ITEM',
                            payload: { index: idx, updates: { quantity: item.quantity - 1 } },
                          })
                        }
                        className="px-2 py-1"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CART_ITEM',
                            payload: { index: idx, updates: { quantity: item.quantity + 1 } },
                          })
                        }
                        className="px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono font-bold">{formatINR(item.lineTotal)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {cartSummary.detailedItems.length > 0 && (
          <div className="p-5 border-t border-[var(--ak-border)] space-y-3 bg-[var(--ak-bg)]">
            <div className="flex justify-between text-sm font-bold">
              <span>Estimated Total</span>
              <span className="font-display text-lg text-[var(--ak-accent)]">
                {formatINR(cartSummary.total)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  navigate('cart');
                }}
                className="py-3 rounded-xl text-xs font-bold uppercase border border-[var(--ak-border)] bg-[var(--ak-surface)]"
              >
                View Full Cart
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('checkout');
                }}
                className="py-3 rounded-xl font-display font-extrabold text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 12. PAGE 4: FULL CART PAGE (EDIT SIZE/COLOR/QTY, PROMO CODE, FREE SHIPPING BAR)
// ═══════════════════════════════════════════════════════════════════════════════

function CartPage() {
  const { state, dispatch, cartSummary, navigate, notify } = useStore();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      dispatch({ type: 'APPLY_PROMO', payload: code });
      notify(`Applied code ${code}: ${PROMO_CODES[code].label}`);
    } else {
      notify('Invalid promo code. Try AKSHAY20, FIRST10, or FREESHIP.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ak-border)] pb-5">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
            ARCHIVE BAG // REVIEW & MODIFY
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase">
            SHOPPING CART ({cartSummary.totalCount} ITEMS)
          </h1>
        </div>
        <button
          onClick={() => navigate('shop')}
          className="text-xs font-bold uppercase tracking-wider underline hover:text-[var(--ak-accent)]"
        >
          ← Continue Shopping
        </button>
      </div>

      {cartSummary.detailedItems.length === 0 ? (
        <div className="p-14 rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-center space-y-4">
          <ShoppingBag className="w-12 h-12 mx-auto text-[var(--ak-accent)]" />
          <h2 className="font-display text-2xl font-extrabold uppercase">YOUR BAG IS EMPTY</h2>
          <p className="text-xs opacity-75">
            Explore our 280 GSM boxy tees, 480 GSM hoodies, and waterproof technical shells.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest"
            style={{
              backgroundColor: 'var(--ak-accent)',
              color: 'var(--ak-accent-fg)',
            }}
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Editable Items */}
          <div className="lg:col-span-8 space-y-4">
            {cartSummary.detailedItems.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="p-4 sm:p-5 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-28 rounded-xl bg-[var(--ak-card)] shrink-0 overflow-hidden">
                    <GarmentIllustration
                      product={item.product}
                      colorHex={item.colorHex}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => navigate('product', { id: item.product.id })}
                      className="font-display text-base font-extrabold hover:text-[var(--ak-accent)] text-left"
                    >
                      {item.product.title}
                    </button>
                    <p className="text-xs opacity-70">{item.product.subtitle}</p>

                    {/* Inline Size & Color Editors */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <label className="flex items-center gap-1">
                        <span className="opacity-70">Size:</span>
                        <select
                          value={item.size}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_CART_ITEM',
                              payload: { index: idx, updates: { size: e.target.value } },
                            })
                          }
                          className="px-2 py-1 rounded border border-[var(--ak-border)] bg-[var(--ak-bg)] font-mono font-bold"
                        >
                          {Object.entries(item.product.sizes)
                            .filter(([, st]) => st > 0)
                            .map(([sz]) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                        </select>
                      </label>

                      <label className="flex items-center gap-1">
                        <span className="opacity-70">Color:</span>
                        <select
                          value={item.color}
                          onChange={(e) => {
                            const found = item.product.colors.find(
                              (c) => c.name === e.target.value
                            );
                            dispatch({
                              type: 'UPDATE_CART_ITEM',
                              payload: {
                                index: idx,
                                updates: {
                                  color: e.target.value,
                                  colorHex: found?.hex || item.colorHex,
                                },
                              },
                            });
                          }}
                          className="px-2 py-1 rounded border border-[var(--ak-border)] bg-[var(--ak-bg)] font-semibold"
                        >
                          {item.product.colors.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Quantity & Subtotal */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <span className="font-display text-lg font-extrabold">
                    {formatINR(item.lineTotal)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]">
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CART_ITEM',
                            payload: { index: idx, updates: { quantity: item.quantity - 1 } },
                          })
                        }
                        className="px-2.5 py-1"
                      >
                        -
                      </button>
                      <span className="px-3 font-mono text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CART_ITEM',
                            payload: { index: idx, updates: { quantity: item.quantity + 1 } },
                          })
                        }
                        className="px-2.5 py-1"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: idx })}
                      className="p-2 rounded-lg border border-[var(--ak-border)] hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Promo Code & Order Summary */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-5">
              <h2 className="font-display text-lg font-extrabold uppercase">ORDER SUMMARY</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider opacity-75">
                  Promo Code (Try AKSHAY20)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="AKSHAY20 / FIRST10"
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)] text-xs font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase border border-[var(--ak-border)] hover:border-[var(--ak-accent)]"
                  >
                    Apply
                  </button>
                </div>
                {state.promoCode && (
                  <p className="text-xs text-emerald-500 font-mono font-bold">
                    ✓ Code {state.promoCode} active ({PROMO_CODES[state.promoCode]?.label})
                  </p>
                )}
              </form>

              <div className="space-y-2.5 text-xs pt-3 border-t border-[var(--ak-border)]">
                <div className="flex justify-between">
                  <span className="opacity-75">Subtotal</span>
                  <span className="font-mono font-bold">{formatINR(cartSummary.subtotal)}</span>
                </div>
                {cartSummary.discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Promo Discount ({state.promoCode})</span>
                    <span className="font-mono">-{formatINR(cartSummary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-75">Express Shipping</span>
                  <span className="font-mono font-bold">
                    {cartSummary.shipping === 0 ? 'FREE' : formatINR(cartSummary.shipping)}
                  </span>
                </div>
                <div className="flex justify-between opacity-70">
                  <span>Included GST (12%)</span>
                  <span className="font-mono">{formatINR(cartSummary.gstIncluded)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-3 border-t border-[var(--ak-border)]">
                  <span>Total Payable</span>
                  <span className="font-display text-xl text-[var(--ak-accent)]">
                    {formatINR(cartSummary.total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('checkout')}
                className="w-full py-4 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest ak-hover-glow"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 13. PAGE 5: MULTI-STEP CHECKOUT (SHIPPING -> PAYMENT -> REVIEW) & CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════

function CheckoutPage() {
  const { state, dispatch, cartSummary, navigate, notify } = useStore();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  const defaultAddr = state.user?.addresses?.[0] || {};
  const [shippingForm, setShippingForm] = useState({
    fullName: defaultAddr.fullName || state.user?.name || '',
    email: state.user?.email || '',
    phone: defaultAddr.phone || '+91 98201 44510',
    street: defaultAddr.street || '14B Pali Hill, Bandra West',
    city: defaultAddr.city || 'Mumbai',
    state: defaultAddr.state || 'Maharashtra',
    pincode: defaultAddr.pincode || '400050',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('Razorpay UPI');
  const [upiId, setUpiId] = useState('aarav@okicici');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');

  const validateShipping = () => {
    const errs = {};
    if (!shippingForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!shippingForm.email.includes('@')) errs.email = 'Valid email is required';
    if (shippingForm.phone.trim().length < 10) errs.phone = 'Valid 10-digit phone required';
    if (!shippingForm.street.trim()) errs.street = 'Street address is required';
    if (!shippingForm.city.trim()) errs.city = 'City is required';
    if (!/^\d{6}$/.test(shippingForm.pincode.trim()))
      errs.pincode = 'Valid 6-digit Indian PIN code required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    const newOrder = {
      id: 'AK-ORD-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().slice(0, 10),
      customerName: shippingForm.fullName,
      email: shippingForm.email,
      status: 'Processing',
      paymentMethod,
      total: cartSummary.total,
      items: cartSummary.detailedItems.map((i) => ({
        productId: i.productId,
        title: i.product.title,
        size: i.size,
        color: i.color,
        qty: i.quantity,
        price: i.product.price,
      })),
      shippingAddress: `${shippingForm.street}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.pincode}`,
    };
    dispatch({ type: 'PLACE_ORDER', payload: newOrder });
    notify(`Order ${newOrder.id} confirmed!`);
    navigate('order-confirmation', { order: newOrder });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-[var(--ak-border)] pb-6">
        {[
          { num: 1, label: '01. Shipping Address' },
          { num: 2, label: '02. Payment Gateway' },
          { num: 3, label: '03. Final Review' },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 text-xs font-mono font-bold uppercase ${
              step >= s.num ? 'text-[var(--ak-accent)]' : 'opacity-40'
            }`}
          >
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          {step === 1 && (
            <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-4">
              <h2 className="font-display text-xl font-extrabold uppercase">
                STEP 1: SHIPPING DETAILS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={shippingForm.fullName}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                  />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block font-bold mb-1">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={shippingForm.pincode}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, pincode: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)] font-mono"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.pincode}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Street / Apartment / Landmark *</label>
                  <input
                    type="text"
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.street}</p>
                  )}
                </div>
                <div>
                  <label className="block font-bold mb-1">City *</label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">State *</label>
                  <input
                    type="text"
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (validateShipping()) setStep(2);
                }}
                className="w-full py-3.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest mt-4"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-4">
              <h2 className="font-display text-xl font-extrabold uppercase">
                STEP 2: RAZORPAY / STRIPE PAYMENT GATEWAY
              </h2>
              <div className="space-y-2.5 text-xs">
                {[
                  {
                    id: 'Razorpay UPI',
                    title: 'Razorpay Instant UPI (GPay / PhonePe / Paytm)',
                    desc: 'Zero gateway fee • Instant confirmation',
                  },
                  {
                    id: 'Credit / Debit Card',
                    title: 'Credit / Debit Card (Visa / Mastercard / RuPay)',
                    desc: '256-bit 3D Secure OTP',
                  },
                  {
                    id: 'Cash on Delivery',
                    title: 'Cash / UPI on Delivery (COD)',
                    desc: 'Pay at your doorstep upon delivery',
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'border-[var(--ak-accent)] bg-[var(--ak-accent)]/5'
                        : 'border-[var(--ak-border)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="mt-1 accent-[var(--ak-accent)]"
                    />
                    <div>
                      <p className="font-bold">{pm.title}</p>
                      <p className="opacity-70">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'Razorpay UPI' && (
                <div className="p-4 rounded-xl bg-[var(--ak-bg)] border border-[var(--ak-border)] text-xs space-y-2">
                  <label className="block font-bold">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-surface)] font-mono"
                  />
                </div>
              )}

              {paymentMethod === 'Credit / Debit Card' && (
                <div className="p-4 rounded-xl bg-[var(--ak-bg)] border border-[var(--ak-border)] text-xs space-y-2">
                  <label className="block font-bold">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-surface)] font-mono"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase border border-[var(--ak-border)]"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest"
                  style={{
                    backgroundColor: 'var(--ak-accent)',
                    color: 'var(--ak-accent-fg)',
                  }}
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-5">
              <h2 className="font-display text-xl font-extrabold uppercase">
                STEP 3: FINAL ORDER REVIEW
              </h2>
              <div className="p-4 rounded-xl bg-[var(--ak-bg)] border border-[var(--ak-border)] text-xs space-y-1">
                <p className="font-bold uppercase text-[var(--ak-accent)]">Shipping To:</p>
                <p className="font-bold">{shippingForm.fullName}</p>
                <p>
                  {shippingForm.street}, {shippingForm.city}, {shippingForm.state} –{' '}
                  {shippingForm.pincode}
                </p>
                <p className="font-mono">
                  {shippingForm.phone} • {shippingForm.email}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--ak-bg)] border border-[var(--ak-border)] text-xs flex justify-between">
                <span className="font-bold">Selected Payment Method:</span>
                <span className="font-mono font-bold text-[var(--ak-accent)]">
                  {paymentMethod}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3.5 rounded-xl text-xs font-bold uppercase border border-[var(--ak-border)]"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest ak-hover-glow"
                  style={{
                    backgroundColor: 'var(--ak-accent)',
                    color: 'var(--ak-accent-fg)',
                  }}
                >
                  Authorize & Pay {formatINR(cartSummary.total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-4">
            <h3 className="font-display text-base font-extrabold uppercase">
              BAG SUMMARY ({cartSummary.totalCount})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cartSummary.detailedItems.map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>
                    {i.quantity}x {i.product.title} ({i.size})
                  </span>
                  <span className="font-mono font-bold">{formatINR(i.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--ak-border)] pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatINR(cartSummary.subtotal)}</span>
              </div>
              {cartSummary.discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Promo Discount</span>
                  <span className="font-mono">-{formatINR(cartSummary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono">
                  {cartSummary.shipping === 0 ? 'FREE' : formatINR(cartSummary.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[var(--ak-border)]">
                <span>Total</span>
                <span className="font-display text-[var(--ak-accent)]">
                  {formatINR(cartSummary.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderConfirmationPage({ order }) {
  const { navigate, state } = useStore();
  const displayOrder = order || state.orders[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <div className="p-8 rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-center space-y-6 shadow-2xl">
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{
            backgroundColor: 'var(--ak-accent)',
            color: 'var(--ak-accent-fg)',
          }}
        >
          <Check className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500">
          ORDER CONFIRMED // {displayOrder?.id}
        </span>
        <h1 className="font-display text-3xl font-extrabold uppercase">
          THANK YOU FOR YOUR ARCHIVE ORDER
        </h1>
        <p className="text-xs sm:text-sm opacity-80 max-w-lg mx-auto">
          We have sent your GST tax invoice and live BlueDart Air tracking link to{' '}
          <strong>{displayOrder?.email}</strong>.
        </p>

        <div className="p-5 rounded-2xl bg-[var(--ak-bg)] border border-[var(--ak-border)] text-left text-xs space-y-2">
          <div className="flex justify-between font-bold">
            <span>Order Reference:</span>
            <span className="font-mono text-[var(--ak-accent)]">{displayOrder?.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="font-mono">{displayOrder?.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Address:</span>
            <span>{displayOrder?.shippingAddress}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-[var(--ak-border)]">
            <span>Amount Paid:</span>
            <span className="font-mono text-[var(--ak-accent)]">
              {formatINR(displayOrder?.total)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate('account')}
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase border border-[var(--ak-border)]"
          >
            Track Order in Account
          </button>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-3 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest"
            style={{
              backgroundColor: 'var(--ak-accent)',
              color: 'var(--ak-accent-fg)',
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 14. PAGE 6 & 7: WISHLIST PAGE + LOGIN/REGISTER & USER ACCOUNT PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function WishlistPage() {
  const { state, navigate, handleAddToCart } = useStore();
  const wishProducts = state.products.filter((p) => state.wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ak-border)] pb-5">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
            SAVED ARCHIVE PIECES
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase">
            YOUR WISHLIST ({wishProducts.length})
          </h1>
        </div>
        {wishProducts.length > 0 && (
          <button
            onClick={() =>
              wishProducts.forEach((p) => handleAddToCart(p, null, p.colors[0], 1, false))
            }
            className="px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider"
            style={{
              backgroundColor: 'var(--ak-accent)',
              color: 'var(--ak-accent-fg)',
            }}
          >
            + Move All to Bag
          </button>
        )}
      </div>

      {wishProducts.length === 0 ? (
        <div className="p-12 rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-center space-y-4">
          <Heart className="w-10 h-10 mx-auto text-[var(--ak-accent)]" />
          <h2 className="font-display text-xl font-extrabold uppercase">
            NO SAVED PIECES YET
          </h2>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase"
            style={{
              backgroundColor: 'var(--ak-accent)',
              color: 'var(--ak-accent-fg)',
            }}
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function AccountPage() {
  const { state, dispatch, navigate, notify } = useStore();
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // New Address Form
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@') || password.length < 4) {
      notify('Enter a valid email and password (min 4 chars).', 'error');
      return;
    }
    dispatch({
      type: 'SET_USER',
      payload: {
        id: 'usr-' + Date.now(),
        name: name.trim() || email.split('@')[0],
        email,
        role: 'admin',
        addresses: [
          {
            id: 'addr-default',
            label: 'Primary Studio',
            fullName: name.trim() || 'Akshay Member',
            street: '14B Pali Hill, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
          },
        ],
      },
    });
    notify('Signed in to AKSHAY Archive account.');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddrStreet.trim() || !newAddrCity.trim()) return;
    dispatch({
      type: 'ADD_ADDRESS',
      payload: {
        id: 'addr-' + Date.now(),
        label: 'Saved Address',
        fullName: state.user.name,
        street: newAddrStreet,
        city: newAddrCity,
        state: 'India',
        pincode: newAddrPin || '400001',
      },
    });
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrPin('');
    notify('Saved new delivery address.');
  };

  if (!state.user) {
    return (
      <div className="max-w-md mx-auto px-4 py-14">
        <div className="p-8 rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-5">
          <div className="flex gap-2 p-1 rounded-xl bg-[var(--ak-bg)] text-xs font-bold uppercase">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg ${
                authMode === 'login' ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)]' : ''
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-lg ${
                authMode === 'register' ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)]' : ''
              }`}
            >
              Register
            </button>
          </div>

          <h1 className="font-display text-2xl font-extrabold uppercase">
            {authMode === 'login' ? 'MEMBER SIGN IN' : 'CREATE ARCHIVE ACCOUNT'}
          </h1>

          <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
            {authMode === 'register' && (
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-display font-extrabold uppercase tracking-widest"
              style={{
                backgroundColor: 'var(--ak-accent)',
                color: 'var(--ak-accent-fg)',
              }}
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ak-border)] pb-5">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
            MEMBER PORTAL // {state.user.email}
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase">
            WELCOME BACK, {state.user.name}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('admin')}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase border border-[var(--ak-accent)] text-[var(--ak-accent)]"
          >
            Open Admin Dashboard
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'SET_USER', payload: null });
              notify('Signed out of your account.');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase border border-[var(--ak-border)] inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order History */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-xl font-extrabold uppercase">
            ORDER HISTORY ({state.orders.length})
          </h2>
          {state.orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-3 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ak-border)] pb-2.5">
                <div>
                  <span className="font-mono font-extrabold text-[var(--ak-accent)]">
                    {ord.id}
                  </span>
                  <span className="opacity-60 ml-2">• {ord.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-[var(--ak-card)]">
                  {ord.status}
                </span>
              </div>
              <div className="space-y-1">
                {ord.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.qty}x {it.title} ({it.size} / {it.color})
                    </span>
                    <span className="font-mono font-bold">{formatINR(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--ak-border)] font-bold">
                <span>{ord.shippingAddress}</span>
                <span className="font-mono text-sm text-[var(--ak-accent)]">
                  {formatINR(ord.total)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Saved Addresses */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display text-xl font-extrabold uppercase">SAVED ADDRESSES</h2>
          <div className="space-y-3">
            {(state.user.addresses || []).map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-xs flex justify-between items-start"
              >
                <div>
                  <p className="font-bold text-[var(--ak-accent)]">{a.label}</p>
                  <p className="font-semibold mt-0.5">{a.fullName}</p>
                  <p className="opacity-80">
                    {a.street}, {a.city} – {a.pincode}
                  </p>
                </div>
                <button
                  onClick={() => dispatch({ type: 'DELETE_ADDRESS', payload: a.id })}
                  className="opacity-60 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAddAddress}
            className="p-5 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-3 text-xs"
          >
            <p className="font-display font-bold uppercase">Add New Address</p>
            <input
              type="text"
              required
              value={newAddrStreet}
              onChange={(e) => setNewAddrStreet(e.target.value)}
              placeholder="Street / Building / Area"
              className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newAddrCity}
                onChange={(e) => setNewAddrCity(e.target.value)}
                placeholder="City"
                className="px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
              />
              <input
                type="text"
                required
                value={newAddrPin}
                onChange={(e) => setNewAddrPin(e.target.value)}
                placeholder="PIN Code"
                className="px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)] font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold uppercase"
              style={{
                backgroundColor: 'var(--ak-accent)',
                color: 'var(--ak-accent-fg)',
              }}
            >
              + Save Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 15. PAGE 9: PROTECTED ADMIN DASHBOARD (KPI CARDS, RECHARTS, CRUD TABLE, ORDERS)
// ═══════════════════════════════════════════════════════════════════════════════

function AdminDashboardPage() {
  const { state, dispatch, notify } = useStore();
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminTab, setAdminTab] = useState('inventory');

  const salesChartData = [
    { month: 'Jun', revenue: 184000, orders: 48 },
    { month: 'Jul', revenue: 229000, orders: 61 },
    { month: 'Aug', revenue: 312000, orders: 84 },
    { month: 'Sep', revenue: 294000, orders: 76 },
    { month: 'Oct', revenue: 418000, orders: 109 },
    { month: 'Nov', revenue: 512000, orders: 138 },
  ];

  const totalRevenue = state.orders.reduce((s, o) => s + o.total, 0) + 1949000;
  const lowStockCount = state.products.filter(
    (p) => Object.values(p.sizes).reduce((a, b) => a + b, 0) < 15
  ).length;

  const openNewProductModal = () => {
    setEditingProduct({
      id: 'ak-custom-' + Date.now(),
      sku: 'AK-AW26-NEW',
      title: 'NEW ARCHIVE GARMENT',
      subtitle: '300 GSM Heavyweight Organic Cotton',
      category: 'T-Shirts',
      price: 1999,
      originalPrice: 2499,
      rating: 5.0,
      reviewsCount: 1,
      isNewDrop: true,
      isBestSeller: false,
      onSale: true,
      silhouette: 'tee-graphic',
      badgeText: 'NEW DROP',
      colors: [{ name: 'Obsidian Black', hex: '#141416' }],
      sizes: { XS: 5, S: 10, M: 15, L: 10, XL: 5 },
      fabric: '100% Organic Cotton (300 GSM)',
      care: 'Machine wash cold.',
      fit: 'Boxy streetwear cut.',
      description: 'Custom archive release added via Admin Dashboard.',
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADMIN_SAVE_PRODUCT', payload: editingProduct });
    notify(`Saved product "${editingProduct.title}" to catalog.`);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ak-border)] pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-500">
            PROTECTED ROUTE // ADMIN ROLE VERIFIED
          </span>
          <h1 className="font-display text-3xl font-extrabold uppercase mt-1">
            AKSHAY COMMAND CENTER
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAdminTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
              adminTab === 'inventory'
                ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                : 'border-[var(--ak-border)]'
            }`}
          >
            Products ({state.products.length})
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
              adminTab === 'orders'
                ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
                : 'border-[var(--ak-border)]'
            }`}
          >
            Orders ({state.orders.length})
          </button>
          <button
            onClick={openNewProductModal}
            className="px-4 py-2 rounded-xl font-display font-extrabold text-xs uppercase inline-flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--ak-accent)',
              color: 'var(--ak-accent-fg)',
            }}
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Gross Archive Revenue', val: formatINR(totalRevenue), delta: '+22.4% MoM' },
          { label: 'Total Fulfilled Orders', val: state.orders.length + 516, delta: '99.2% SLA' },
          { label: 'Average Order Value', val: formatINR(3840), delta: '+₹410 vs Q3' },
          { label: 'Low Stock Variants', val: `${lowStockCount} SKUs`, delta: 'Restock Alert' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="p-5 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-1"
          >
            <p className="text-xs opacity-70 uppercase tracking-wider font-semibold">{kpi.label}</p>
            <p className="font-display text-2xl font-extrabold text-[var(--ak-accent)]">
              {kpi.val}
            </p>
            <p className="text-[11px] font-mono opacity-80">{kpi.delta}</p>
          </div>
        ))}
      </div>

      {/* Revenue Analytics Chart */}
      <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-4">
        <h2 className="font-display text-lg font-extrabold uppercase">
          MONTHLY REVENUE PERFORMANCE (INR ₹)
        </h2>
        <div className="relative h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
              <YAxis stroke="currentColor" fontSize={12} />
              <Tooltip
                formatter={(value) => formatINR(value)}
                contentStyle={{
                  backgroundColor: '#13111C',
                  borderColor: '#2F2347',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                }}
              />
              <Bar
                dataKey="revenue"
                fill={state.theme === 'dark' ? '#00E5FF' : '#E63946'}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Inventory Table or Orders Table */}
      {adminTab === 'inventory' ? (
        <div className="rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--ak-bg)] uppercase tracking-wider border-b border-[var(--ak-border)]">
              <tr>
                <th className="py-3.5 px-4">SKU / Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Size & Variant Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ak-border)]">
              {state.products.map((p) => (
                <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="py-3 px-4">
                    <p className="font-bold">{p.title}</p>
                    <p className="font-mono text-[10px] opacity-65">{p.sku}</p>
                  </td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[var(--ak-accent)]">
                    {formatINR(p.price)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(p.sizes).map(([sz, st]) => (
                        <span
                          key={sz}
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                            st === 0
                              ? 'border-red-500/40 text-red-500'
                              : 'border-[var(--ak-border)]'
                          }`}
                        >
                          {sz}:{st}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="px-2.5 py-1 rounded border border-[var(--ak-border)] hover:border-[var(--ak-accent)] font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        dispatch({ type: 'ADMIN_DELETE_PRODUCT', payload: p.id });
                        notify(`Deleted ${p.title}`);
                      }}
                      className="px-2.5 py-1 rounded border border-red-500/30 text-red-500 font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--ak-bg)] uppercase tracking-wider border-b border-[var(--ak-border)]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Update Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ak-border)]">
              {state.orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 px-4 font-mono font-bold text-[var(--ak-accent)]">{o.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold">{o.customerName}</p>
                    <p className="opacity-65">{o.shippingAddress}</p>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">{formatINR(o.total)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-[var(--ak-card)]">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => {
                        dispatch({
                          type: 'ADMIN_UPDATE_ORDER_STATUS',
                          payload: { orderId: o.id, status: e.target.value },
                        });
                        notify(`Order ${o.id} updated to ${e.target.value}`);
                      }}
                      className="px-2.5 py-1 rounded border border-[var(--ak-border)] bg-[var(--ak-bg)] font-bold"
                    >
                      {['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(
                        (st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-lg rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] p-6 space-y-4 text-xs max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[var(--ak-border)] pb-3">
              <h3 className="font-display text-lg font-extrabold uppercase">
                EDIT PRODUCT & VARIANT STOCK
              </h3>
              <button type="button" onClick={() => setEditingProduct(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold mb-1">Product Title</label>
              <input
                type="text"
                required
                value={editingProduct.title}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)]"
                >
                  {['T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Bottoms', 'Accessories'].map(
                    (c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[var(--ak-border)] bg-[var(--ak-bg)] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Stock Per Size Variant</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(editingProduct.sizes).map(([sz, count]) => (
                  <div key={sz} className="flex items-center gap-1.5">
                    <span className="font-mono font-bold w-10">{sz}:</span>
                    <input
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          sizes: {
                            ...editingProduct.sizes,
                            [sz]: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-2 py-1 rounded border border-[var(--ak-border)] bg-[var(--ak-bg)] font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--ak-border)]">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl border border-[var(--ak-border)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold uppercase"
                style={{
                  backgroundColor: 'var(--ak-accent)',
                  color: 'var(--ak-accent-fg)',
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 16. PAGE 8: ABOUT, CONTACT, FAQ, SHIPPING & PRIVACY POLICIES, 404 PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function AboutPage() {
  const { navigate } = useStore();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-10">
      <div className="space-y-4">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
          MANIFESTO // EST. MUMBAI
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
          BUILT ON HEAVYWEIGHT GSM & ARCHITECTURAL PRECISION.
        </h1>
        <p className="text-sm sm:text-base opacity-80 leading-relaxed">
          AKSHAY was founded to bridge the gap between disposable fast fashion and ₹40,000
          international luxury streetwear. Every garment in our archive is custom-milled in Tiruppur
          and Ahmedabad using long-staple organic cotton (240–480 GSM), Japanese selvedge looms, and
          weather-sealed technical membranes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: '01 // Small-Batch Craftsmanship',
            desc: 'We produce in numbered runs of 300 units per silhouette to eliminate deadstock waste and guarantee strict seam inspection.',
          },
          {
            title: '02 // Dual-Theme Visual Identity',
            desc: 'Our digital flagship honors both editorial daylight minimalism (Charcoal / Silver / Signal Red) and nocturnal club culture (Jet Black / Royal Amethyst / Electric Cyan).',
          },
          {
            title: '03 // Indian Climate Engineering',
            desc: 'Breathable loopback weaves and pit-vented 3-layer shells designed specifically for Indian metro monsoons and winters.',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-2"
          >
            <h3 className="font-display text-base font-extrabold uppercase text-[var(--ak-accent)]">
              {card.title}
            </h3>
            <p className="text-xs opacity-80 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('shop')}
        className="px-7 py-4 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest"
        style={{
          backgroundColor: 'var(--ak-accent)',
          color: 'var(--ak-accent-fg)',
        }}
      >
        Explore the AW26 Collection →
      </button>
    </div>
  );
}

function ContactPage() {
  const { notify } = useStore();
  const [form, setForm] = useState({ name: '', email: '', orderId: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    notify(`Support Ticket #AK-${Math.floor(1000 + Math.random() * 9000)} created! We reply within 2 hrs.`);
    setForm({ name: '', email: '', orderId: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-5 space-y-5">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
          CLIENT CONCIERGE
        </p>
        <h1 className="font-display text-3xl font-extrabold uppercase">CONTACT AKSHAY STUDIO</h1>
        <p className="text-xs opacity-80 leading-relaxed">
          Need sizing advice, custom styling, or status updates on an exchange? Our studio team is
          live Monday–Saturday, 10:00 AM to 8:00 PM IST.
        </p>
        <div className="space-y-3 text-xs pt-2">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--ak-accent)]" /> Flagship Studio: 14th Road, Khar
            West, Mumbai 400052
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--ak-accent)]" /> concierge@akshay.studio
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--ak-accent)]" /> +91 (022) 4890-2600
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="md:col-span-7 p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-4 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your Name *"
            className="px-3.5 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address *"
            className="px-3.5 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
          />
        </div>
        <input
          type="text"
          value={form.orderId}
          onChange={(e) => setForm({ ...form, orderId: e.target.value })}
          placeholder="Order ID (Optional, e.g., AK-ORD-98412)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)] font-mono"
        />
        <textarea
          rows={4}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="How can our studio team help you? *"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--ak-border)] bg-[var(--ak-bg)]"
        />
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-display font-extrabold uppercase tracking-widest"
          style={{
            backgroundColor: 'var(--ak-accent)',
            color: 'var(--ak-accent-fg)',
          }}
        >
          Send Message to Concierge
        </button>
      </form>
    </div>
  );
}

function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div>
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--ak-accent)]">
          KNOWLEDGE BASE
        </p>
        <h1 className="font-display text-3xl font-extrabold uppercase">
          FREQUENTLY ASKED QUESTIONS
        </h1>
      </div>

      <div className="space-y-3">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className="rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--ak-accent)] block">
                    {item.category}
                  </span>
                  <span className="font-display text-sm font-extrabold">{item.q}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs opacity-80 leading-relaxed border-t border-[var(--ak-border)] pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PoliciesPage({ initialTab = 'shipping' }) {
  const [tab, setTab] = useState(initialTab);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('shipping')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
            tab === 'shipping'
              ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
              : 'border-[var(--ak-border)]'
          }`}
        >
          Shipping & 7-Day Returns
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
            tab === 'privacy'
              ? 'bg-[var(--ak-accent)] text-[var(--ak-accent-fg)] border-[var(--ak-accent)]'
              : 'border-[var(--ak-border)]'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      <div className="p-6 rounded-2xl border border-[var(--ak-border)] bg-[var(--ak-surface)] space-y-4 text-xs leading-relaxed">
        {tab === 'shipping' ? (
          <>
            <h1 className="font-display text-2xl font-extrabold uppercase">
              SHIPPING & 7-DAY EASY RETURNS POLICY
            </h1>
            <p>
              <strong>Express Dispatch:</strong> Orders placed before 2:00 PM IST ship the same day via
              BlueDart Air or Delhivery Express. Orders above ₹2,999 qualify for complimentary
              express shipping across all Indian PIN codes.
            </p>
            <p>
              <strong>7-Day Reverse Pickup & Exchanges:</strong> You may initiate a size exchange or
              full refund within 7 days of delivery. Items must be unworn with the AKSHAY security
              seal intact.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-extrabold uppercase">
              PRIVACY & DATA PROTECTION POLICY
            </h1>
            <p>
              AKSHAY Studio respects your privacy under the Digital Personal Data Protection Act
              (DPDP). Payment credentials are tokenized directly by Razorpay/Stripe PCI-DSS Level 1
              servers and never stored on our servers.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function NotFoundPage() {
  const { navigate } = useStore();
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--ak-accent)]">
        ERROR 404 // ARCHIVE COORDINATES NOT FOUND
      </p>
      <h1 className="font-display text-5xl font-extrabold uppercase">LOST IN THE METROPOLIS</h1>
      <p className="text-xs opacity-75">
        The silhouette or page you requested has been archived or moved.
      </p>
      <button
        onClick={() => navigate('home')}
        className="px-6 py-3.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-widest"
        style={{
          backgroundColor: 'var(--ak-accent)',
          color: 'var(--ak-accent-fg)',
        }}
      >
        Return to Home Flagship
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 17. ARCHITECTURE, SETUP, BACKEND INTEGRATION & DEPLOYMENT MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function ArchitectureGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-3xl border border-[var(--ak-border)] bg-[var(--ak-surface)] text-[var(--ak-text)] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[var(--ak-border)] flex items-center justify-between bg-[var(--ak-bg)]">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--ak-accent)]" />
            <h3 className="font-display text-base font-extrabold uppercase">
              AKSHAY STORE // PROJECT STRUCTURE, SETUP & BACKEND GUIDE
            </h3>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed font-mono">
          <div>
            <h4 className="font-sans font-extrabold text-sm uppercase text-[var(--ak-accent)] mb-2">
              1. Modular Vite + React 18 Folder Tree
            </h4>
            <pre className="p-4 rounded-xl bg-black text-emerald-400 overflow-x-auto text-[11px]">
{`akshay-clothing-store/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── StoreContext.jsx       # Cart, Wishlist, Auth, Theme & Admin Reducer
    ├── hooks/
    │   ├── useCart.js
    │   ├── useDebounce.js
    │   ├── useLocalStorage.js
    │   └── useTheme.js
    ├── data/
    │   └── products.json          # 24 Realistic Clothing Products across 6 Categories
    ├── utils/
    │   ├── currency.js            # ₹ INR Formatter & GST Tax Helpers
    │   └── sanitize.js            # Input Sanitization & Validation
    ├── routes/
    │   └── ProtectedRoute.jsx     # Role-based Admin Guard
    ├── components/
    │   ├── layout/ (Navbar.jsx, MegaMenu.jsx, Footer.jsx)
    │   ├── ui/ (GarmentIllustration.jsx, SizeGuideModal.jsx, ToastStack.jsx)
    │   ├── product/ (ProductCard.jsx, QuickViewModal.jsx)
    │   └── cart/ (CartDrawer.jsx)
    └── pages/
        ├── Home.jsx
        ├── Shop.jsx
        ├── ProductDetails.jsx
        ├── Cart.jsx
        ├── Checkout.jsx
        ├── Wishlist.jsx
        ├── Account.jsx
        ├── AdminDashboard.jsx
        └── StaticPages.jsx`}
            </pre>
          </div>

          <div>
            <h4 className="font-sans font-extrabold text-sm uppercase text-[var(--ak-accent)] mb-2">
              2. Local Setup & Production Build Commands
            </h4>
            <pre className="p-4 rounded-xl bg-black text-cyan-300 overflow-x-auto text-[11px]">
{`# 1. Install dependencies
npm install react react-dom react-router-dom lucide-react framer-motion recharts react-helmet-async
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer

# 2. Start local Vite dev server (http://localhost:5173)
npm run dev

# 3. Build optimized production bundle
npm run build && npm run preview`}
            </pre>
          </div>

          <div>
            <h4 className="font-sans font-extrabold text-sm uppercase text-[var(--ak-accent)] mb-2">
              3. Swapping Mock Data for Node/Express, Supabase, or Firebase
            </h4>
            <p className="font-sans text-xs opacity-85">
              All state mutations in <code>StoreContext.jsx</code> are dispatched through a clean
              action layer. Replace <code>INITIAL_PRODUCTS</code> with a <code>useEffect</code>{' '}
              fetch to <code>GET /api/v1/products</code> (Express/MongoDB) or{' '}
              <code>supabase.from(&apos;products&apos;).select(&apos;*&apos;)</code>, and wire{' '}
              <code>PLACE_ORDER</code> to Razorpay Order Creation API (
              <code>POST /api/v1/checkout/create-razorpay-order</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 18. FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Footer({ onOpenDocs }) {
  const { navigate, selectCategoryAndGo, dispatch, state } = useStore();

  return (
    <footer className="border-t border-[var(--ak-border)] bg-[var(--ak-surface)] pt-14 pb-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[var(--ak-border)]">
        <div className="lg:col-span-2 space-y-3">
          <span className="font-display text-2xl font-extrabold tracking-tighter block">
            AKSHAY // URBAN ARCHIVE
          </span>
          <p className="opacity-75 max-w-sm leading-relaxed">
            Contemporary Indian luxury streetwear engineered with heavyweight 280–480 GSM organic
            cotton, 3-layer waterproof shells, and raw selvedge denim.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
              className="px-3 py-1.5 rounded-lg border border-[var(--ak-border)] font-mono font-bold"
            >
              Active Theme: {state.theme === 'dark' ? 'DARK (Jet/Amethyst/Cyan)' : 'LIGHT (Charcoal/Silver/Red)'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-display font-extrabold uppercase tracking-wider text-[var(--ak-accent)]">
            Shop Archive
          </p>
          <ul className="space-y-1.5 opacity-80">
            {['T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Bottoms', 'Accessories'].map((c) => (
              <li key={c}>
                <button
                  onClick={() => selectCategoryAndGo(c)}
                  className="hover:text-[var(--ak-accent)]"
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-display font-extrabold uppercase tracking-wider text-[var(--ak-accent)]">
            Client Services
          </p>
          <ul className="space-y-1.5 opacity-80">
            <li>
              <button onClick={() => navigate('account')} className="hover:text-[var(--ak-accent)]">
                My Account & Order Tracker
              </button>
            </li>
            <li>
              <button onClick={() => navigate('wishlist')} className="hover:text-[var(--ak-accent)]">
                Saved Wishlist
              </button>
            </li>
            <li>
              <button onClick={() => navigate('faq')} className="hover:text-[var(--ak-accent)]">
                FAQ & Sizing Help
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('policies', { tab: 'shipping' })}
                className="hover:text-[var(--ak-accent)]"
              >
                Shipping & 7-Day Returns
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('policies', { tab: 'privacy' })}
                className="hover:text-[var(--ak-accent)]"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-display font-extrabold uppercase tracking-wider text-[var(--ak-accent)]">
            Studio & Admin
          </p>
          <ul className="space-y-1.5 opacity-80">
            <li>
              <button onClick={() => navigate('about')} className="hover:text-[var(--ak-accent)]">
                About AKSHAY Manifesto
              </button>
            </li>
            <li>
              <button onClick={() => navigate('contact')} className="hover:text-[var(--ak-accent)]">
                Contact Studio Concierge
              </button>
            </li>
            <li>
              <button onClick={() => navigate('admin')} className="hover:text-[var(--ak-accent)]">
                Admin Dashboard (Protected)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('404')} className="hover:text-[var(--ak-accent)]">
                Preview Custom 404 Page
              </button>
            </li>
            <li>
              <button onClick={onOpenDocs} className="hover:text-[var(--ak-accent)] underline">
                Vite Project Code & Deploy Guide
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-wrap items-center justify-between gap-4 opacity-70">
        <p>© 2026 AKSHAY APPAREL ARCHIVE PVT. LTD. All Rights Reserved. Currency: INR (₹).</p>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>UPI</span>
          <span>•</span>
          <span>RAZORPAY</span>
          <span>•</span>
          <span>VISA / MASTERCARD</span>
          <span>•</span>
          <span>RUPAY</span>
          <span>•</span>
          <span>COD</span>
        </div>
      </div>
    </footer>
  );
}

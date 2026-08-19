export type ServiceCategoryKey =
  | 'periodic'
  | 'rsa'
  | 'insurance'
  | 'spare_parts'
  | 'batteries'
  | 'tyres'
  | 'engine'
  | 'accidental';

export interface ServiceCategory {
  id: ServiceCategoryKey;
  name: string;
  tagline: string;
  icon: string;
  badge?: string;
  description: string;
  bannerImage: string;
  packages: ServicePackage[];
}

export interface ServicePackage {
  id: string;
  categoryId: ServiceCategoryKey;
  title: string;
  shortDesc: string;
  price: number;
  originalPrice?: number;
  estimatedTime: string;
  warranty: string;
  popular?: boolean;
  features: string[];
  recommendedFor?: string;
  iconName?: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'periodic',
    name: 'Periodic Service',
    tagline: 'Complete 30-Point Health Tune-Up at Your Doorstep',
    icon: 'Wrench',
    badge: 'Most Popular',
    description:
      'Scheduled preventive maintenance for electric & petrol 2-wheelers. Includes engine/motor check, brake pad cleaning, chain tensioning, nut-bolt torque audit, electrical test, and test ride.',
    bannerImage:
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-per-1',
        categoryId: 'periodic',
        title: 'Standard Periodic Service (General Check)',
        shortDesc: 'Essential maintenance & safety checkup for daily commuters',
        price: 499,
        originalPrice: 799,
        estimatedTime: '45 mins',
        warranty: '10-Day Warranty',
        popular: true,
        features: [
          'Full 21-point safety & bolt-torque inspection',
          'Brake shoe/pad cleaning & hydraulic lever bleeding',
          'Drive chain/belt lubrication & tension adjustment',
          'Air filter blow-cleaning & spark plug / wire harness test',
          'Free waterless eco-wash & polish coat',
        ],
        recommendedFor: 'Every 3 months / 2,500 KM',
      },
      {
        id: 'pkg-per-2',
        categoryId: 'periodic',
        title: 'Comprehensive Master Service (Complete Overhaul)',
        shortDesc: 'Deep diagnostic scan, fluid top-up, battery health report & full tuning',
        price: 899,
        originalPrice: 1299,
        estimatedTime: '75 mins',
        warranty: '30-Day Warranty',
        features: [
          'Full 35-point safety, chassis & powertrain diagnostic',
          'Brake fluid (DOT 4) top-up & caliper greasing',
          'Wheel bearing & steering cone bearing lubrication',
          'Engine oil replacement (oil cost additional / customer provided)',
          'Battery health & BMS cell delta diagnostic report',
          'Free 10-day doorstep callback assurance',
        ],
        recommendedFor: 'Every 6 months / 5,000 KM',
      },
      {
        id: 'pkg-per-3',
        categoryId: 'periodic',
        title: 'EV Powertrain & BMS Specialized Service',
        shortDesc: 'High-voltage electric 2-wheeler motor controller & battery pack health audit',
        price: 749,
        originalPrice: 1099,
        estimatedTime: '60 mins',
        warranty: '15-Day Warranty',
        features: [
          'BMS cell balancing & temperature sensor verification',
          'Julet IP67 waterproof connector inspection',
          'Hub motor hall sensor signal calibration',
          'Throttle potentiometer voltage mapping',
          'Regenerative braking efficiency tuning',
        ],
        recommendedFor: 'All EV Scooters & E-Bikes',
      },
    ],
  },
  {
    id: 'rsa',
    name: 'RSA Services',
    tagline: '24x7 Emergency Roadside Assistance & Breakdown Rescue',
    icon: 'Siren',
    badge: '15-Min Arrival',
    description:
      'Stuck on the road? Our rapid-response mobile workshop vans arrive with workshop-grade tools, puncture kits, jumpstarters, fresh battery packs, and towing equipment.',
    bannerImage:
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-rsa-1',
        categoryId: 'rsa',
        title: 'Instant Breakdown Rescue & On-Spot Repair',
        shortDesc: 'Rapid doorstep / highway mechanic arrival for sudden engine/motor stoppage',
        price: 349,
        originalPrice: 499,
        estimatedTime: '15-20 mins arrival',
        warranty: 'On-Spot Resolution Guarantee',
        popular: true,
        features: [
          'Guaranteed priority dispatch to nearest van',
          'Clutch cable, throttle cable or lever on-spot fix',
          'Spark plug replacement / fuse blowout repair',
          '30 mins on-spot labor included',
        ],
        recommendedFor: 'Non-starting bike or sudden stoppage',
      },
      {
        id: 'pkg-rsa-2',
        categoryId: 'rsa',
        title: 'Emergency Battery Jumpstart & Swap',
        shortDesc: 'Dead battery recharge or temporary rescue battery pack swap',
        price: 299,
        originalPrice: 450,
        estimatedTime: '15 mins arrival',
        warranty: 'Instant Power Assurance',
        features: [
          'Heavy-duty 12V / 48V jumpstart booster connection',
          'Alternator / stator coil charging output test',
          'Emergency doorstep battery replacement option available',
        ],
        recommendedFor: 'Discharged battery / click-click starter issue',
      },
      {
        id: 'pkg-rsa-3',
        categoryId: 'rsa',
        title: 'Emergency Puncture & Air Fill (Tubeless/Tube)',
        shortDesc: 'On-road tire patch, sealant injection & portable compressor inflation',
        price: 249,
        originalPrice: 350,
        estimatedTime: '15 mins arrival',
        warranty: 'Leak-Proof Assurance',
        features: [
          'High-durability mushroom plug puncture fix (up to 2 punctures)',
          'High-pressure digital air inflation',
          'Valve core / nozzle pin replacement if leaking',
        ],
        recommendedFor: 'Flat tire on road / doorstep',
      },
    ],
  },
  {
    id: 'insurance',
    name: 'Bike Insurance',
    tagline: 'Instant Policy Renewal & Cashless Claim Assistance',
    icon: 'ShieldCheck',
    badge: 'Cashless Claims',
    description:
      'Comprehensive and 3rd-party two-wheeler insurance with top insurers (HDFC ERGO, ICICI Lombard, Digit, Bajaj Allianz). Zero paperwork, instant PDF policy issuance, and hassle-free claim settlement.',
    bannerImage:
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-ins-1',
        categoryId: 'insurance',
        title: 'Comprehensive Zero-Depreciation Cover',
        shortDesc: '100% payout for plastic, fiber & metal parts with roadside cover',
        price: 1199,
        originalPrice: 1699,
        estimatedTime: 'Instant 2-Min Policy',
        warranty: '1 Year Full Coverage',
        popular: true,
        features: [
          'Zero depreciation on all fiber, metal and rubber parts',
          'Cashless accidental repairs at GOVOLT partner network',
          '24x7 Roadside Assistance add-on included',
          'Engine & battery protection add-on cover',
          'No Claim Bonus (NCB) transfer up to 50%',
        ],
        recommendedFor: 'All bikes & EV scooters under 5 years old',
      },
      {
        id: 'pkg-ins-2',
        categoryId: 'insurance',
        title: 'Mandatory Third-Party Liability Cover',
        shortDesc: 'IRDAI approved legal liability cover against third party damages & injuries',
        price: 538,
        originalPrice: 750,
        estimatedTime: 'Instant 2-Min Policy',
        warranty: '1 / 3 / 5 Years Valid',
        features: [
          'Protects against legal penalties and traffic fines',
          'Covers third-party property damage up to ₹1 Lakh',
          'Personal accident cover of ₹15 Lakh for owner-driver',
          'Instant digital policy download to WhatsApp / Email',
        ],
        recommendedFor: 'Compliance with Motor Vehicles Act',
      },
      {
        id: 'pkg-ins-3',
        categoryId: 'insurance',
        title: 'Accident Claim Filing & Cashless Repair Assist',
        shortDesc: 'Complete surveyor inspection coordination & cashless repair at your doorstep',
        price: 0,
        originalPrice: 499,
        estimatedTime: 'Doorstep Surveyor Survey',
        warranty: 'Cashless Settlement',
        features: [
          'Dedicated insurance claim manager assigned',
          'Doorstep accidental damage estimation & photo survey',
          'Direct cashless tie-ups with all major insurance providers',
          'Original OEM parts replacement guaranteed',
        ],
        recommendedFor: 'Accident-damaged 2-wheelers with existing policy',
      },
    ],
  },
  {
    id: 'spare_parts',
    name: 'Spare Parts',
    tagline: '100% Genuine OEM & OES Spares with Doorstep Fitting',
    icon: 'Settings',
    badge: '100% Genuine',
    description:
      'Buy original spare parts for all major brands (Hero, Honda, Bajaj, TVS, Yamaha, Royal Enfield, Ather, Ola, Revolt). Delivered and fitted by certified mechanics at your home.',
    bannerImage:
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-sp-1',
        categoryId: 'spare_parts',
        title: 'Brake Pads & Disc Rotor Kit (OEM)',
        shortDesc: 'High-friction ceramic/semi-metallic brake pads with anti-fade warranty',
        price: 349,
        originalPrice: 499,
        estimatedTime: '25 mins fitting',
        warranty: '6 Months Warranty',
        popular: true,
        features: [
          'High thermal dissipation ceramic/metallic compound',
          'Precision CNC-machined backing plate',
          'Includes doorstep fitment & caliper lever bleed',
          'Compatible with all disc brake models',
        ],
      },
      {
        id: 'pkg-sp-2',
        categoryId: 'spare_parts',
        title: 'Drive Chain & Sprocket Combo Pack',
        shortDesc: 'Heavy-duty O-ring sealed chain + hardened steel sprockets',
        price: 1199,
        originalPrice: 1650,
        estimatedTime: '40 mins fitting',
        warranty: '12 Months / 15,000 KM Warranty',
        features: [
          'Rolon / Diamond genuine heavy duty O-ring chain',
          'High-tensile heat-treated front & rear sprockets',
          'Doorstep installation & alignment included',
        ],
      },
      {
        id: 'pkg-sp-3',
        categoryId: 'spare_parts',
        title: 'Control Cables & Lever Set (Clutch/Throttle/Brake)',
        shortDesc: 'Teflon-lined smooth action cables with anti-rust casing',
        price: 249,
        originalPrice: 380,
        estimatedTime: '20 mins fitting',
        warranty: '6 Months Warranty',
        features: [
          'High fatigue-strength stainless steel inner wire',
          'Teflon-sleeved friction-free action',
          'Includes free doorstep replacement labor',
        ],
      },
    ],
  },
  {
    id: 'batteries',
    name: 'Bike Batteries',
    tagline: 'Brand New Batteries with Up to 48 Months Warranty & Doorstep Fitting',
    icon: 'BatteryCharging',
    badge: 'Exchange Discount',
    description:
      'High-cranking SLA and Lithium-ion batteries from top brands: Amaron, Exide, Livguard, Tata Green, and GOVOLT EV PowerPack. Old battery buyback exchange discount included.',
    bannerImage:
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-bat-1',
        categoryId: 'batteries',
        title: 'Amaron Pro Rider (Zero Maintenance SLA Battery)',
        shortDesc: 'High-CCA battery for self-start bikes & scooters with instant doorstep install',
        price: 1299,
        originalPrice: 1750,
        estimatedTime: '20 mins fitting',
        warranty: '48 Months Pro-Rata Warranty',
        popular: true,
        features: [
          'Advanced AGM separator for high vibration resistance',
          'Factory charged & ready for instant start',
          'Free old battery pickup (₹250 exchange discount included in price)',
          'Free charging system & regulator voltage audit',
        ],
        recommendedFor: 'Honda Activa, Hero Splendor, Pulsar, Apache, Jupiter',
      },
      {
        id: 'pkg-bat-2',
        categoryId: 'batteries',
        title: 'Exide Xplore Maintenance-Free Battery',
        shortDesc: 'Reliable all-weather battery with spill-proof design',
        price: 1349,
        originalPrice: 1800,
        estimatedTime: '20 mins fitting',
        warranty: '48 Months Warranty',
        features: [
          'Spill-proof sealed VRLA construction',
          'High cold-cranking amps (CCA) for quick winter starts',
          'Doorstep installation & terminal grease protection',
        ],
        recommendedFor: 'Royal Enfield, Yamaha FZ, Suzuki Access, KTM',
      },
      {
        id: 'pkg-bat-3',
        categoryId: 'batteries',
        title: 'GOVOLT Smart Li-Ion Auxiliary / Traction Pack (EV)',
        shortDesc: 'High-density lithium battery pack with built-in Smart BMS monitoring',
        price: 3499,
        originalPrice: 4500,
        estimatedTime: '30 mins fitting',
        warranty: '36 Months Replacement Warranty',
        features: [
          'Grade-A prismatic/cylindrical cells with 2000+ cycle life',
          'Active thermal runaway prevention & short-circuit cutoff',
          'Includes doorstep mounting and harness coding',
        ],
        recommendedFor: 'Electric Bikes & High-Speed EV Scooters',
      },
    ],
  },
  {
    id: 'tyres',
    name: 'Tyres at Home',
    tagline: 'Brand New Tyres Delivered & Fitted at Your Doorstep',
    icon: 'CircleDot',
    badge: 'Free Fitting',
    description:
      'Choose from top tire brands like MRF, CEAT, Michelin, TVS Eurogrip, and Apollo. Includes doorstep pneumatic tire mounting, valve replacement, and digital balancing.',
    bannerImage:
      'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-ty-1',
        categoryId: 'tyres',
        title: 'MRF Zapper / Nylogrip (Front/Rear Tubeless)',
        shortDesc: 'India’s most trusted high-mileage all-weather grip tire',
        price: 1450,
        originalPrice: 1850,
        estimatedTime: '25 mins fitting',
        warranty: '5 Years Manufacturer Warranty',
        popular: true,
        features: [
          'Directional tread design for superior wet-road traction',
          'Cut-resistant rubber tread compound',
          'Free doorstep mounting, bead seating & leak test',
          'Free new brass tubeless valve pin included',
        ],
        recommendedFor: 'Commuter bikes (Splendor, Shine, Passion, Platina)',
      },
      {
        id: 'pkg-ty-2',
        categoryId: 'tyres',
        title: 'CEAT Gripp X3 / Zoom RAD (High-Grip Radial)',
        shortDesc: 'Dual-compound cornering grip with puncture protection layer',
        price: 1699,
        originalPrice: 2200,
        estimatedTime: '25 mins fitting',
        warranty: '6 Years Warranty (3 Years Unconditional)',
        features: [
          'Tri-groove pattern for quick water displacement',
          'Thick sidewall armor against potholes and curb strikes',
          'Includes doorstep rim cleaning & nitrogen fill',
        ],
        recommendedFor: 'Pulsar, Apache, FZ, Duke, Gixxer, R15',
      },
      {
        id: 'pkg-ty-3',
        categoryId: 'tyres',
        title: 'Puncture-Proof Sealant Treatment (Both Tyres)',
        shortDesc: 'Liquid kevlar armor sealant injected into tires for zero roadside punctures',
        price: 499,
        originalPrice: 750,
        estimatedTime: '15 mins fitting',
        warranty: '12 Months Sealant Protection',
        features: [
          'Instantly seals punctures up to 6mm upon penetration',
          'Non-corrosive water-based formula (safe for alloy rims)',
          'Maintains optimum tire pressure longer',
        ],
        recommendedFor: 'All daily riders and delivery partners',
      },
    ],
  },
  {
    id: 'engine',
    name: 'Engine Repair',
    tagline: 'Expert Engine Decarb, Clutch Overhaul & Major Mechanical Repairs',
    icon: 'Cpu',
    badge: 'Expert Mechanics',
    description:
      'Complete engine diagnostics, carburetor tuning, fuel injector cleaning, clutch plate replacement, piston cylinder rebuild, valvetrain adjustment, and smoke issue resolution.',
    bannerImage:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-eng-1',
        categoryId: 'engine',
        title: 'Engine Decarbonization & Fuel System Tuning',
        shortDesc: 'Restore lost pickup, smooth idling & increase fuel mileage by up to 15%',
        price: 699,
        originalPrice: 1050,
        estimatedTime: '45 mins',
        warranty: '15-Day Performance Guarantee',
        popular: true,
        features: [
          'Combustion chamber & valve seat carbon removal',
          'Carburetor sonic bath cleaning / Fuel Injector spray test',
          'Tappet / valve clearance tuning with feeler gauge',
          'Spark plug electrode gap calibration',
        ],
        recommendedFor: 'Low mileage, sluggish acceleration & knocking',
      },
      {
        id: 'pkg-eng-2',
        categoryId: 'engine',
        title: 'Clutch Assembly & Pressure Plate Overhaul',
        shortDesc: 'Replace worn friction plates to eliminate gear slip and harsh shifting',
        price: 899,
        originalPrice: 1350,
        estimatedTime: '60 mins',
        warranty: '6 Months Warranty',
        features: [
          'OEM friction plates & clutch center hub inspection',
          'Clutch spring tension check & basket groove smoothing',
          'New crankcase gasket & high-temp sealant',
          'Doorstep installation by Master Mechanic',
        ],
        recommendedFor: 'High RPM slipping, hard gear shifts, loss of pulling power',
      },
      {
        id: 'pkg-eng-3',
        categoryId: 'engine',
        title: 'White/Black Smoke Fix & Cylinder Compression Test',
        shortDesc: 'Diagnose oil burning, valve stem seals, and piston ring wear',
        price: 1199,
        originalPrice: 1750,
        estimatedTime: '90 mins',
        warranty: '30-Day Assurance',
        features: [
          'Digital compression gauge cylinder test',
          'Valve guide seal leak inspection',
          'Oil pump pressure output audit',
          'Complete diagnostic report with genuine parts quotation',
        ],
        recommendedFor: 'Excessive engine oil consumption & exhaust smoke',
      },
    ],
  },
  {
    id: 'accidental',
    name: 'Accidental Repair',
    tagline: 'Body Panel Rebuild, Chassis Alignment & Cashless Insurance Claims',
    icon: 'ShieldAlert',
    badge: 'OEM Finish',
    description:
      'Complete accidental restoration: body panel replacement, headlight cowl, handle bar straightening, fork alignment, paint touchup, and cashless insurance claim processing.',
    bannerImage:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-acc-1',
        categoryId: 'accidental',
        title: 'Doorstep Accidental Assessment & Estimation',
        shortDesc: 'On-spot damage evaluation, structural safety audit & insurance report',
        price: 199,
        originalPrice: 400,
        estimatedTime: '30 mins survey',
        warranty: '100% Certified Estimate',
        popular: true,
        features: [
          'Detailed part-by-part damage cost calculation',
          'Front fork bend & chassis alignment measurement',
          'Digital photo documentation for insurance surveyor',
          'Inspection fee adjusted in repair bill upon confirmation',
        ],
      },
      {
        id: 'pkg-acc-2',
        categoryId: 'accidental',
        title: 'Body Fiber Panels & Cowl Replacement (OEM Color Match)',
        shortDesc: 'Replace cracked fairings, mudguards, visor, side panels with factory finish',
        price: 499,
        originalPrice: 750,
        estimatedTime: '45 mins fitting',
        warranty: 'Color Match & Fitment Guarantee',
        features: [
          'Genuine factory painted body panels with original decals',
          'Anti-vibration rubber damper mounting',
          'Doorstep installation & alignment',
        ],
      },
      {
        id: 'pkg-acc-3',
        categoryId: 'accidental',
        title: 'Handlebar, Front Fork & Wheel Rim Truing / Replacement',
        shortDesc: 'Fix steering wobble, bent handle bar, or misaligned front suspension',
        price: 799,
        originalPrice: 1200,
        estimatedTime: '60 mins',
        warranty: '30-Day Alignment Guarantee',
        features: [
          'Hydraulic press fork straightening or OEM replacement',
          'Steering T-stem cone set bearing replacement & torqueing',
          'Front axle alignment & brake disc trueing',
        ],
      },
    ],
  },
];

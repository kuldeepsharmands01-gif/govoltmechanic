import { BlogPost } from '../types';

export interface BlogCategoryInfo {
  name: string;
  count: number;
  slug: string;
  description: string;
  iconName?: string;
}

export const BLOG_CATEGORIES: BlogCategoryInfo[] = [
  { name: 'Bike Service', count: 16, slug: 'bike-service', description: 'Doorstep maintenance routines, periodic checkups, and tune-up guides' },
  { name: 'Automotive', count: 14, slug: 'automotive', description: 'Two-wheeler and automotive industry trends, technological evolutions, and mechanics' },
  { name: 'Bike Tips', count: 12, slug: 'bike-tips', description: 'Actionable riding hacks, mileage boosters, and daily maintenance advice' },
  { name: 'Bikes', count: 10, slug: 'bikes', description: 'Comprehensive bike reviews, ownership stories, and road test insights' },
  { name: 'Bike Parts', count: 8, slug: 'bike-parts', description: 'Genuine OEM components, wear indicators, and upgrade recommendations' },
  { name: 'Engine Oil', count: 7, slug: 'engine-oil', description: 'Synthetic vs mineral lubricants, viscosity ratings, and oil flush schedules' },
  { name: 'Bike News', count: 5, slug: 'bike-news', description: 'Latest launches, EV subsidies, government regulations, and automotive headlines' },
  { name: 'Maintenance Tips', count: 4, slug: 'maintenance-tips', description: 'Monsoon care, chain lubrication, electrical diagnostics, and preventative care' },
  { name: 'Accessories', count: 2, slug: 'accessories', description: 'Riding jackets, mobile mounts, crash guards, and essential touring gear' },
  { name: 'Bike Insurance', count: 2, slug: 'bike-insurance', description: 'Comprehensive vs third-party policies, cashless claims, and NCB protection' },
  { name: 'Bike Service Center', count: 2, slug: 'bike-service-center', description: 'Doorstep mobile workshops vs traditional garages: price and quality comparison' },
  { name: 'Engine', count: 2, slug: 'engine', description: 'Air-cooled vs liquid-cooled engines, valve clearance, and spark plug troubleshooting' },
  { name: 'Repair', count: 2, slug: 'repair', description: 'Roadside breakdown quick fixes, clutch cable snapping, and starter motor repair' },
  { name: 'Bike Models', count: 1, slug: 'bike-models', description: 'In-depth specification comparison of popular Indian commuter and performance bikes' },
  { name: 'Brake Pads', count: 1, slug: 'brake-pads', description: 'Ceramic vs semi-metallic brake pads, squeal elimination, and rotor life' },
  { name: 'Brands', count: 1, slug: 'brands', description: 'Spotlight on Hero, Honda, Bajaj, TVS, Yamaha, Royal Enfield, and Ather' },
  { name: 'Cars', count: 1, slug: 'cars', description: 'Dual-vehicle family care and crossover maintenance techniques' },
  { name: 'Driving License', count: 1, slug: 'driving-license', description: 'Parivahan portal updates, DL renewal steps, and learner license tests' },
  { name: 'Electric Two-Wheelers', count: 1, slug: 'electric-two-wheelers', description: 'High-voltage BMS, lithium battery thermal management, and range tips' },
  { name: 'EV', count: 1, slug: 'ev', description: 'Electric mobility infrastructure, home AC charging, and green energy tax savings' },
  { name: 'EV Two-Wheeler Sales', count: 1, slug: 'ev-two-wheeler-sales', description: 'FADA sales analysis, state-wise subsidies, and market adoption rates' },
  { name: 'Helmet', count: 1, slug: 'helmet', description: 'ISI vs ECE 22.06 vs DOT helmet safety standards and visor anti-fog care' },
  { name: 'Pollution Certificate', count: 1, slug: 'pollution-certificate', description: 'PUCC validity, online Parivahan download, BS6 emission norms, and fines' },
  { name: 'Scooters', count: 1, slug: 'scooters', description: 'CVT belt maintenance, gearless scooter care, and city commuter tips' },
  { name: 'Top Selling Two Wheelers', count: 1, slug: 'top-selling-two-wheelers', description: 'Top 10 highest selling bikes and scooters across India' },
  { name: 'Tyre', count: 1, slug: 'tyre', description: 'Tubeless tyre puncture repair, tyre pressure PSI charts, and tread wear limits' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Why Doorstep Bike Service is Taking Over Traditional Workshops in 2026',
    slug: 'doorstep-bike-service-vs-traditional-garages',
    category: 'Bike Service',
    excerpt: 'Save 3+ hours and up to 40% on bills by getting certified bike mechanics to your home or office with transparent digital job cards and 100% genuine parts.',
    content: `Long queues, dubious spare part charges, and losing entire weekends at local grease-stained garages are quickly becoming relics of the past. In Delhi NCR, Uttar Pradesh, and across India, doorstep bike repair services like GoVoltMechanic are revolutionizing two-wheeler upkeep.

### 1. 100% Transparent Live Servicing In Front of Your Eyes
When a mechanic services your motorcycle in your parking lot or driveway, you witness every oil bottle being unsealed, every filter being cleaned, and every brake adjustment being tested. No hidden charges, no fake replacement bills.

### 2. Comprehensive 21-Point Digital Health Inspection
Our fully equipped mobile workshop vans carry professional diagnostic multimeters, computerized battery load testers, digital tyre inflators, and pneumatic tool sets. Every appointment includes:
- Engine oil drain and flush with fresh Motul/Castrol oil
- Spark plug cleaning and electrode gap calibration
- Chain slack adjustment, degreasing, and high-tack lubrication
- Front and rear drum/disc brake pad wear inspection
- Battery terminal voltage and charging coil output test

### 3. Save Time and Beat Traffic
Instead of fighting city traffic to drop off your bike at 9 AM and waiting until 7 PM to collect it, our certified technician arrives at your chosen slot. You can continue working from home or spending quality time with family while your motorcycle gets showroom-grade care.`,
    readTime: '4 min read',
    author: {
      name: 'Amit Verma',
      role: 'Master EV & Bike Technician',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Aug 18, 2026',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bike Service', 'Doorstep Repair', 'Maintenance', 'Bike Tips'],
    views: 14200,
    likes: 890,
    featured: true,
  },
  {
    id: 'post-2',
    title: 'The Ultimate Guide to Motorcycle Engine Oil: Mineral vs Semi-Synthetic vs Fully Synthetic',
    slug: 'motorcycle-engine-oil-guide',
    category: 'Engine Oil',
    excerpt: 'Choosing between 10W-30, 20W-40, and 10W-40? Here is how the right lubricant grade protects your clutch and keeps your engine running silky smooth.',
    content: `Engine oil is the lifeblood of your motorcycle. Unlike cars, where the engine, transmission, and clutch often use separate fluids, most 4-stroke motorcycles utilize a common sump lubrication system (JASO MA/MA2).

### Understanding Viscosity Numbers (e.g., 10W-40)
- **10W**: The 'W' stands for Winter. The number preceding 'W' indicates oil flowability during cold startups. A lower number means easier cold cranking.
- **40**: The high-temperature viscosity grade at 100°C. In hot Indian summers, higher numbers prevent oil breakdown under heavy traffic.

### Oil Types Breakdown:
1. **Mineral Oil (Change every 2,000 - 3,000 km)**: Refined directly from crude oil. Ideal for budget commuters (100cc-125cc) and during the initial engine run-in period.
2. **Semi-Synthetic Oil (Change every 4,000 - 5,000 km)**: A balanced blend of mineral and synthetic base stocks. Great for 150cc-250cc daily commuters like Pulsar, Apache, and FZ.
3. **Fully Synthetic Oil (Change every 7,000 - 10,000 km)**: Chemically synthesized molecules offering extreme thermal resistance, zero clutch slippage, and maximum high-RPM protection for sports bikes and liquid-cooled engines.`,
    readTime: '5 min read',
    author: {
      name: 'Rajesh Kumar',
      role: 'Senior Automotive Lubrication Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Aug 15, 2026',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Engine Oil', 'Automotive', 'Engine', 'Bike Tips'],
    views: 9800,
    likes: 640,
    featured: false,
  },
  {
    id: 'post-3',
    title: 'Top 10 Essential Bike Maintenance Tips Every Indian Rider Must Practice',
    slug: 'top-10-essential-bike-maintenance-tips',
    category: 'Bike Tips',
    excerpt: 'Boost your motorcycle mileage, prevent unexpected roadside breakdowns, and extend engine life with these 10 easy weekly habits.',
    content: `Regular preventative care keeps your bike running like new and saves thousands of rupees in unexpected repair bills. Here are our top 10 practical tips:

1. **Check Tyre Pressure Weekly**: Under-inflated tyres reduce fuel economy by up to 15% and cause uneven tyre shoulder wear. Always check pressure when tyres are cold.
2. **Clean & Lube Chain Every 500 km**: An unlubricated chain robs engine power and wears sprockets rapidly. Use dedicated chain lube instead of used engine oil.
3. **Inspect Brake Pad Thickness**: When pad material wears below 2mm, replace immediately to avoid scoring costly brake discs.
4. **Keep Battery Terminals Clean**: Apply petroleum jelly to prevent sulphate corrosion on 12V terminals.
5. **Clean the Air Filter**: A choked air filter restricts air intake, causing rich fuel burning and black exhaust smoke.
6. **Smooth Throttle & Gear Shifts**: Aggressive revving in lower gears burns excess fuel and strains the clutch plates.
7. **Inspect Cables for Fraying**: Lubricate clutch and accelerator cables with silicone spray to prevent sudden snapping.
8. **Check Suspension Fork Seals**: Look for oil weeping around the front fork stanchions.
9. **Maintain Correct Spark Plug Gap**: Clean soot deposits with a wire brush and set the gap between 0.7mm - 0.9mm.
10. **Wash & Wax Regularly**: Prevent rust on the chassis and chrome exhausts, especially during monsoon season.`,
    readTime: '6 min read',
    author: {
      name: 'Priya Singh',
      role: 'EV & Mechanical Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Aug 12, 2026',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bike Tips', 'Maintenance Tips', 'Bikes', 'Bike Service'],
    views: 18500,
    likes: 1240,
    featured: true,
  },
  {
    id: 'post-4',
    title: 'Electric Two-Wheeler Battery Life: How to Make Your EV Battery Last 5+ Years',
    slug: 'electric-two-wheeler-battery-life-extension-tips',
    category: 'Electric Two-Wheelers',
    excerpt: 'Smart charging practices, thermal management, and avoiding deep discharges can double the cycle life of your Ola, Ather, or TVS iQube lithium battery.',
    content: `Lithium-ion batteries (NMC and LFP chemistry) are the single most expensive component in any electric scooter or motorcycle. By understanding battery chemistry, you can keep state-of-health (SoH) above 85% for years.

### The Golden 20%-80% Charging Rule
Avoid regularly draining your battery to 0% or leaving it plugged in at 100% for days under direct sunlight. Charging between 20% and 80% reduces internal cell stress and minimizes dendrite formation.

### Avoid Immediate Fast Charging After High-Speed Riding
When you finish a long high-speed commute, the battery pack and motor are hot. Allow the battery to cool down for 15-20 minutes before plugging in your fast charger.

### Regular Regenerative Braking Calibration
Modern smart EVs calibrate range algorithms through regen. Ensure your smart BMS firmware is updated regularly through over-the-air (OTA) updates.`,
    readTime: '4 min read',
    author: {
      name: 'Pradeep',
      role: 'EV Fleet Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Aug 10, 2026',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    tags: ['Electric Two-Wheelers', 'EV', 'Automotive', 'Bike Parts'],
    views: 8900,
    likes: 530,
    featured: false,
  },
  {
    id: 'post-5',
    title: 'Bike Insurance in India: 1st Party vs 3rd Party vs Zero Depreciation Demystified',
    slug: 'bike-insurance-types-explained',
    category: 'Bike Insurance',
    excerpt: 'Understand what covers theft, natural disasters, engine hydro-locking, and third-party liabilities so you never pay out of pocket during claims.',
    content: `Having valid insurance is not just legally mandatory under the Motor Vehicles Act — it is your financial safety net when accidents happen.

### 1. Third-Party Only Insurance (Mandatory)
Covers bodily injury, death, and property damage caused to third parties by your bike. It does NOT cover any damage or theft of your own motorcycle.

### 2. Comprehensive Insurance
Covers third-party liabilities PLUS damages to your own vehicle caused by road accidents, fire, vandalism, theft, floods, or storms.

### 3. Zero-Depreciation (Bumper-to-Bumper) Add-on
In standard insurance, plastic, rubber, and nylon parts (like fairings, headlights, and tyres) receive up to 50% depreciation deduction during claims. Zero-Dep ensures 100% claim settlement on all replaced components without depreciation deductions.`,
    readTime: '4 min read',
    author: {
      name: 'Rohan Mehta',
      role: 'Insurance & Fleet Claims Advisor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Aug 05, 2026',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bike Insurance', 'Bike News', 'Automotive'],
    views: 6400,
    likes: 410,
    featured: false,
  },
  {
    id: 'post-6',
    title: 'How to Download PUC Certificate Online on Parivahan Portal and Avoid ₹10,000 Fines',
    slug: 'download-puc-certificate-online-parivahan',
    category: 'Pollution Certificate',
    excerpt: 'Step-by-step guide to checking PUCC validity, downloading digital pollution certificates, and understanding BS6 emission thresholds.',
    content: `Under Section 190(2) of the amended Motor Vehicles Act, riding a two-wheeler with an expired Pollution Under Control Certificate (PUCC) attracts a penalty of up to ₹10,000 and possible driving license suspension.

### How to Check & Download PUCC Online via Parivahan:
1. Visit the official Ministry of Road Transport and Highways (MoRTH) portal at \`puc.parivahan.gov.in\`.
2. Click on **"PUC Certificate"** in the navigation menu.
3. Enter your **Registration Number** (e.g. UP16XX1234 or DL3SXX5678).
4. Enter the **last 5 digits of your Chassis Number** (found on your RC card or insurance policy).
5. Complete the Security Captcha and click **"PUC Details"**.
6. View testing dates, emission carbon monoxide (CO) & hydrocarbon (HC) readings, and download a verified PDF with digital QR code.`,
    readTime: '3 min read',
    author: {
      name: 'Amit Verma',
      role: 'Master EV & Bike Technician',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Jul 30, 2026',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    tags: ['Pollution Certificate', 'Driving License', 'Bike News'],
    views: 11200,
    likes: 720,
    featured: false,
  },
  {
    id: 'post-7',
    title: 'Brake Pad Replacement Guide: How to Identify Worn Out Disc Brakes Before They Damage Your Rotors',
    slug: 'brake-pad-replacement-and-disc-maintenance',
    category: 'Brake Pads',
    excerpt: 'Squealing sounds, spongy levers, and reduced stopping power? Learn how to inspect brake pads and bleed hydraulic brake fluid.',
    content: `Disc brakes are crucial for emergency deceleration on Indian highways and crowded city streets. Ignoring worn brake pads ruins expensive stainless steel disc rotors and severely compromises rider safety.

### Signs Your Brake Pads Need Immediate Replacement:
- **High-Pitched Squeal or Metal-on-Metal Grinding**: Modern brake pads have built-in wear indicators. Grinding sounds indicate the friction material has worn off completely and the steel backing plate is gouging into your rotor.
- **Brake Lever Feels Spongy**: Air bubbles or degraded DOT 4 fluid inside the hydraulic master cylinder reduces hydraulic pressure.
- **Pad Thickness Below 1.5mm**: Inspect through the caliper inspection slot using a torch.
- **Uneven Rotor Grooving**: Dark circular rings or warping on the disc face.

GoVoltMechanic mobile technicians carry genuine Brembo, ByBre, and OEM ceramic pads for all bikes. Book doorstep brake overhaul in 60 seconds!`,
    readTime: '4 min read',
    author: {
      name: 'Priya Singh',
      role: 'EV & Mechanical Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Jul 24, 2026',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Brake Pads', 'Bike Parts', 'Repair', 'Bike Service'],
    views: 7300,
    likes: 490,
    featured: false,
  },
  {
    id: 'post-8',
    title: 'Top 10 Selling Two-Wheelers in India (2026 Edition): Price, Mileage & Reliability Compared',
    slug: 'top-selling-two-wheelers-in-india',
    category: 'Top Selling Two Wheelers',
    excerpt: 'From Hero Splendor Plus and Honda Activa 6G to Bajaj Pulsar and TVS Jupiter: In-depth analysis of India’s most popular commuters.',
    content: `The Indian two-wheeler market continues to lead the world in commuter demand and value engineering. Here is our ranking of the top selling models based on real-world reliability, service cost, and resale value:

1. **Hero Splendor Plus (97.2cc)**: The undisputed king of rural and urban commuting. Delivers 65-70 km/l real-world mileage with low maintenance costs.
2. **Honda Activa 6G (109.5cc)**: India's favourite family scooter with silent ACG starter, combi-braking, and indestructible HET engine.
3. **Honda Shine 125**: Refined 5-speed gearbox, excellent low-end torque, and comfortable upright seating ergonomics.
4. **Bajaj Pulsar 125 & 150 Series**: Distinctive muscular styling, wolf-eyed headlamps, and sporty performance for youth riders.
5. **TVS Jupiter 110 & 125**: External fuel filler cap, largest under-seat storage in its class, and plush gas-charged rear suspension.
6. **Suzuki Access 125**: Peppy SEP engine, retro chrome styling, and super comfortable single-piece seat.
7. **Royal Enfield Classic 350**: Iconic J-series counterbalanced engine, thump exhaust note, and commanding highway cruising presence.
8. **TVS Raider 125**: Digital reverse LCD cluster, riding modes, and monoshock suspension.
9. **Ather 450X & 450S**: High-performance electric scooter with Google Maps touchscreen navigation and warp mode acceleration.
10. **Ola S1 Pro & S1 Air**: High top speed, MoveOS features, and large boot capacity.`,
    readTime: '6 min read',
    author: {
      name: 'Rajesh Kumar',
      role: 'Senior Automotive Lubrication Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Jul 18, 2026',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    tags: ['Top Selling Two Wheelers', 'Bikes', 'Scooters', 'Brands', 'Bike Models'],
    views: 22400,
    likes: 1850,
    featured: false,
  },
  {
    id: 'post-9',
    title: 'Tyre Maintenance Masterclass: Tubeless Puncture Fixes, PSI Recommendations & Tread Life',
    slug: 'motorcycle-tyre-maintenance-guide',
    category: 'Tyre',
    excerpt: 'Avoid high-speed tyre blowouts by checking the TWI tread wear indicator and maintaining the right front/rear PSI ratings.',
    content: `Your tyres are the only contact patch between your motorcycle and the asphalt. Maintaining proper air pressure and inspecting tread depth directly dictates braking distance and wet weather grip.

### Recommended Cold PSI Ratings:
- **Solo Rider (Commuter 100-150cc)**: Front 28 PSI | Rear 32 PSI
- **Rider with Pillion**: Front 29 PSI | Rear 36 PSI
- **Heavy Touring / ADV Bikes**: Front 32 PSI | Rear 38 PSI

### Identifying Tread Wear (TWI):
Locate the small triangle mark on your tyre sidewall. Follow it onto the tread surface to find the Tread Wear Indicator (TWI) bar. When the tread wears level with this bar (below 1.5mm remaining depth), replace the tyre immediately to avoid aquaplaning during rain.`,
    readTime: '4 min read',
    author: {
      name: 'Amit Verma',
      role: 'Master EV & Bike Technician',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Jul 10, 2026',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Tyre', 'Bike Parts', 'Maintenance Tips', 'Bike Tips'],
    views: 8200,
    likes: 580,
    featured: false,
  },
  {
    id: 'post-10',
    title: 'Essential Riding Accessories: What Every Daily Commuter and Weekend Tourer Needs',
    slug: 'essential-motorcycle-accessories-guide',
    category: 'Accessories',
    excerpt: 'Crash guards, phone mounts with vibration dampeners, waterproof saddlebags, and disc locks: Protect your bike and stay comfortable on long rides.',
    content: `Investing in high-quality motorcycle accessories significantly enhances safety, ergonomics, and luggage convenience.

### Must-Have Accessories for Every Rider:
1. **Vibration-Dampened Mobile Mount**: Smartphones with Optical Image Stabilization (OIS) can get damaged by high-frequency engine vibration. A dampener protects your phone camera while using GPS.
2. **Engine Crash Guard & Frame Sliders**: Minimizes crankcase damage and broken levers during low-speed parking lot tips.
3. **Heavy-Duty Disc Brake Alarm Lock**: Emits a 110dB alarm if anyone tampers with your parked bike.
4. **All-Weather Waterproof Seat Cover**: Keeps your seat dry during heavy monsoon downpours and cool under scorching summer heat.`,
    readTime: '4 min read',
    author: {
      name: 'Rohan Mehta',
      role: 'Insurance & Fleet Claims Advisor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Jun 28, 2026',
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Accessories', 'Helmet', 'Bikes', 'Bike Tips'],
    views: 7900,
    likes: 470,
    featured: false,
  },
  {
    id: 'post-11',
    title: 'Helmet Safety Standards Explained: ISI vs ECE 22.06 vs DOT Ratings',
    slug: 'helmet-safety-standards-isi-ece-dot',
    category: 'Helmet',
    excerpt: 'Why cheap roadside helmets fail impact tests and how ECE 22.06 rotational acceleration testing protects your head.',
    content: `A helmet is the single most critical piece of personal protective equipment (PPE). Wearing an uncertified helmet or riding with an unfastened chin strap is equivalent to wearing no helmet at all.

### Understanding Helmet Certifications:
- **ISI (IS 4151:2015)**: The mandatory standard in India. Tested for impact absorption, chin strap retention, and penetration resistance.
- **DOT (FMVSS 218)**: United States standard. High energy drop testing.
- **ECE 22.06 (European Standard)**: The global gold standard. Includes oblique impact testing to measure rotational acceleration on the brain during high-speed slides.

Always replace your helmet after any major crash or every 5 years due to degradation of the internal EPS foam liner.`,
    readTime: '4 min read',
    author: {
      name: 'Priya Singh',
      role: 'EV & Mechanical Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Jun 20, 2026',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80',
    tags: ['Helmet', 'Accessories', 'Bike Tips', 'Automotive'],
    views: 9100,
    likes: 670,
    featured: false,
  },
  {
    id: 'post-12',
    title: 'Monsoon Bike Care Checklist: How to Protect Your Motorcycle from Rust, Waterlogging & Electrical Shorts',
    slug: 'monsoon-bike-care-checklist',
    category: 'Maintenance Tips',
    excerpt: 'Step-by-step rainy season protection for spark plug caps, chain links, brake drums, and electrical wiring looms.',
    content: `Indian monsoons bring waterlogged roads, mud slush, and high humidity that accelerate rust formation and cause electrical misfires.

### 5 Crucial Monsoon Steps:
1. **Apply Dielectric Grease to Spark Plug Boot**: Prevents water seepage that causes engine stalling when splashing through puddles.
2. **Wash Off Mud Immediately**: Wet mud holds moisture against the swingarm and exhaust bend pipe, accelerating rust.
3. **Clean Drum Brake Linings**: Moisture inside drum brakes creates a muddy slurry that drastically reduces braking bite.
4. **Use Wet Chain Lube**: High-viscosity wet lube resists wash-off from road spray much better than standard dry wax sprays.
5. **Inspect Fuel Tank Drainage Hole**: Clear the tiny overflow drain hole around your fuel cap so rainwater doesn't enter the petrol tank.`,
    readTime: '4 min read',
    author: {
      name: 'Amit Verma',
      role: 'Master EV & Bike Technician',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishDate: 'Jun 12, 2026',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    tags: ['Maintenance Tips', 'Bike Tips', 'Bike Service', 'Repair'],
    views: 12800,
    likes: 910,
    featured: false,
  }
];

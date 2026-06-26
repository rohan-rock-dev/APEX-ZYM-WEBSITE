import React, { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Flame,
  Check,
  ArrowRight,
  X,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Target,
  Award,
  Dumbbell,
  Clock,
  ChevronLeft,
  ArrowLeft,
  Instagram,
  Facebook,
  Twitter,
  CreditCard,
  Lock
} from "lucide-react";
import ThreeCanvas from "./components/ThreeCanvas";
import SlicedImage from "./components/SlicedImage";
import HeroStrengthTransition from "./components/HeroStrengthTransition";
import GridMosaicReveal from "./components/GridMosaicReveal";
import IrisWipeReveal from "./components/IrisWipeReveal";
import SequencedYogaPersonalReveal from "./components/SequencedYogaPersonalReveal";
import LiquidDistortionReveal from "./components/LiquidDistortionReveal";
import StackedCardPeel from "./components/StackedCardPeel";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import FlipText from "./components/ui/flip-text";
import FlipFadeText from "./components/ui/flip-fade-text";
import ScrollFloat from "./components/ui/ScrollFloat";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Types corresponding to shared data structures
import { GymService, MembershipTier, Testimonial } from "./types";

// State datasets in pristine theme-matched formatting
const SERVICES_DATA: GymService[] = [
  {
    id: "zone-1",
    title: "Strength Training",
    description: "Build exceptional power, lean mass, and skeletal fortitude. Train on high-grade Olympic racks equipped with Eleiko bars, custom steel plates, and custom-machined dumbbell suites.",
    iconName: "Dumbbell",
    badge: "POWER & FORCE",
    bgGradient: "from-[#66241f]/10 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "zone-2",
    title: "Cardio",
    description: "Enhance VO2 max, accelerate stamina, and scale work capacity. Work on manual curved belt treadmills, air-resistance stationary bikes, and smart heart-rate-syncing stepmills.",
    iconName: "Flame",
    badge: "ENDURANCE & BIOMETRICS",
    bgGradient: "from-[#66241f]/10 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "zone-3",
    title: "Yoga",
    description: "Elevate your range of motion, nervous system recovery, and mental clarity. Our climate-controlled, acoustic-isolated yoga sanctuary offers serene, guided restorative training.",
    iconName: "Sparkles",
    badge: "MIND-BODY & MOBILITY",
    bgGradient: "from-[#66241f]/10 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "zone-4",
    title: "Personal Training",
    description: "Obtain fully individualized programming, biomechanical optimization, and periodic body composition tracking directly guided by expert physique and physiology coaches.",
    iconName: "Target",
    badge: "BESPOKE COACHING",
    bgGradient: "from-[#66241f]/10 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800"
  }
];

const MEMBERSHIPS_DATA: MembershipTier[] = [
  {
    id: "gold",
    name: "Base",
    price: "$80",
    period: "month",
    description: "Ideal for individuals seeking elite access to our high-grade training rigs and premium lockers.",
    features: [
      "Access to premium training grids",
      "Full digital telemetry analytics tracking",
      "Towel service & vanity lockers",
      "Daily contrast-therapy access",
      "Complimentary recovery bar drink"
    ],
    isFeatured: false,
    accentColor: "#66241f"
  },
  {
    id: "elite",
    name: "Pro",
    price: "$120",
    period: "month",
    description: "Our signature tier offering comprehensive biometric optimization and live athletic diagnostics.",
    features: [
      "Everything in Base access",
      "Sub-zero contrast plunges",
      "1-on-1 private biology coaching",
      "Custom nutrition formulation",
      "Bi-weekly metabolic profiling"
    ],
    isFeatured: true,
    accentColor: "#4F6BEB"
  },
  {
    id: "platinum",
    name: "Enterprise",
    price: "$260",
    period: "month",
    description: "Ultimate bespoke concierge protocol for corporations, professionals, and maximum privacy.",
    features: [
      "Everything in Pro access",
      "Private lifting lane booking",
      "24/7 dedicated wellness supervisor",
      "Medical-grade diagnostics integrations",
      "Concierge physical rehabilitation"
    ],
    isFeatured: false,
    accentColor: "#8b5cf6"
  }
];

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "st-1",
    name: "Marcus Vance",
    role: "Venture Capital Partner / Powerlifter",
    result: "BUILT +45KG SQUAT & LOWERED CORTISOL 30%",
    quote: "Apex is unlike anything in Metropolis. Most luxury gyms feel like hotels, whereas hardcore gyms feel like scrap yards. Apex merges precise scientific diagnostic tools with absolute elite-quality steel. A masterpiece of design.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "st-2",
    name: "Dr. Elena Rostova",
    role: "Biomedical Systems Engineer",
    result: "RESTORED POST-INJURY KNEE ACCELERATION",
    quote: "The Contrast therapy facility and dry saunas alone would justify the price, but the integration with actual biomechanical coaching is the real asset. They do not guess they measure. My peak concentric power metrics are back.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "st-3",
    name: "Christian Thorne",
    role: "Technology Founder",
    result: "9.2% BODY FAT ATTAINED IN 90 DAYS",
    quote: "I split my work between London and New York. Finding physical spaces that cater to elite focus standards is rare. Apex is quiet, incredibly well-designed, extremely clean, and is styled for high-efficiency results.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "st-4",
    name: "Sarah Jenkins",
    role: "Olympic Weightlifter / Architect",
    result: "INCREASED CLEAN & JERK BY 25KG",
    quote: "As an architect, space design and physical layout speak directly to my focus. Apex has created a spatial flow that maximizes concentration and physical output. The equipment tolerances are unmatched.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "st-5",
    name: "David Chen",
    role: "Ultra-endurance Big Trail Runner",
    result: "REDUCED 100K TRAIL RECOVERY TIME BY 40%",
    quote: "The hot/cold contrast therapy sequences and core physical therapy integrations have fundamentally altered how quickly I bounce back from hyper-mileage runs. Apex is my recovery engine.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "st-6",
    name: "Robert Sterling",
    role: "Chief Executive Officer / Rower",
    result: "RECLAIMED ENERGY & LOWER BACK MOBILITY",
    quote: "My posture was failing due to continuous boardroom meetings. Apex designed tailored rotational core exercises that completely eliminated my chronic thoracic spine stiffness. Life-saving longevity care.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

// Trainers / Elite Team Interface & Dataset
interface Trainer {
  id: string;
  name: string;
  photoUrl: string;
  certifications: string;
  specialties: string;
  bio: string;
}

const TRAINERS_DATA: Trainer[] = [
  {
    id: "trainer-1",
    name: "Julian Kross",
    photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=650&h=800",
    certifications: "B.S. Sports & Exercise Science, NASM-CPT, Hypertrophy Specialist",
    specialties: "Aesthetic Physique, Hypertrophy Pacing",
    bio: "Julian coordinates lean muscle proportions using customized time-under-tension (TUT) strategies. He is known for designing elegant, safe pacing patterns that build continuous structural density."
  },
  {
    id: "trainer-2",
    name: "Dominic Santos",
    photoUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=650&h=800",
    certifications: "CSCS (Certified Strength & Conditioning Specialist), USA Boxing Coach",
    specialties: "Explosive Athleticism, Hand & Wrist Traumatology",
    bio: "Dominic elevates raw concentric strike force and hand alignment safety. Utilizing dynamic compound lifts and combat conditioning, he ensures athletic output operates at baseline peaks."
  },
  {
    id: "trainer-3",
    name: "Marcus Vance",
    photoUrl: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&q=80&w=650&h=800",
    certifications: "M.S. Exercise Physiology, PES, Biomechanical Coach",
    specialties: "Deep Muscle Activation, Force Production",
    bio: "Marcus applies neurological biomechanics directly to loaded barbells and specialized gym zones. His targeted activation sequences maximize fast-twitch fiber expansion with safe, sustainable mechanics."
  },
  {
    id: "trainer-4",
    name: "Mateo Alva",
    photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=650&h=800",
    certifications: "Divine Performance Specialist, Master Trainer, CFT",
    specialties: "Holistic Discipline, Mind-Body Pacing",
    bio: "Mateo anchors athletic training with absolute mental and spiritual clarity. Known for his elite lifestyle coaching, his training philosophy pairs rigorous compound lifting with positive mindfulness, discipline, and community leadership."
  }
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "INR">("INR");
  const [showHeader, setShowHeader] = useState(true);
  
  // Trainers / Elite Team State
  const [expandedTrainerId, setExpandedTrainerId] = useState<string | null>(null);

  // Testimonial State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialDirection, setTestimonialDirection] = useState<"prev" | "next" | null>(null);
  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pricing Active Tier State (0 = Base, 1 = Pro, 2 = Enterprise)
  const [activePricingTierIdx, setActivePricingTierIdx] = useState(1);

  // Upgrade Payment States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSelectedPlan, setPaymentSelectedPlan] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payCardholder, setPayCardholder] = useState("");
  const [payCardNumber, setPayCardNumber] = useState("");
  const [payExpiry, setPayExpiry] = useState("");
  const [payCvv, setPayCvv] = useState("");
  const [payTab, setPayTab] = useState<'card' | 'upi'>('card');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');



  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    target: "performance"
  });

  // Track scroll position to update active Section
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const sections = [
        { id: "hero-sec", name: "home" },
        { id: "cardio-sec", name: "zones" },
        { id: "personal-training-sec", name: "programs" },
        { id: "experience-sec", name: "transform" },
        { id: "testimonials-sec", name: "stories" },
      ];
      
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.name);
            break;
          }
        }
      }

      // Hide header on scroll down, show on scroll up
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle CTA application submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() === "" || formData.name.trim() === "") return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setModalOpen(false);
      setFormData({ name: "", email: "", target: "performance" });
    }, 2800);
  };

  // Convert prices based on currency state
  const getDisplayPrice = (usdPrice: string) => {
    const numericPart = parseInt(usdPrice.replace("$", ""));
    if (billingCycle === "annual") {
      // 20% discount on annual plans
      const annualPrice = Math.round((numericPart * 0.8));
      if (currency === "EUR") return `€${Math.round(annualPrice * 0.93)}`;
      if (currency === "GBP") return `£${Math.round(annualPrice * 0.79)}`;
      if (currency === "INR") return `₹${Math.round(annualPrice * 83)}`;
      return `$${annualPrice}`;
    } else {
      if (currency === "EUR") return `€${Math.round(numericPart * 0.93)}`;
      if (currency === "GBP") return `£${Math.round(numericPart * 0.79)}`;
      if (currency === "INR") return `₹${Math.round(numericPart * 83)}`;
      return usdPrice;
    }
  };

  const getPlanPriceNumber = (usdPrice: string) => {
    const numericPart = parseInt(usdPrice.replace("$", ""));
    let basePrice = numericPart;
    if (billingCycle === "annual") {
      basePrice = Math.round(numericPart * 0.8);
    }
    if (currency === "EUR") return Math.round(basePrice * 0.93);
    if (currency === "GBP") return Math.round(basePrice * 0.79);
    if (currency === "INR") return Math.round(basePrice * 83);
    return basePrice;
  };

  const getCurrencySymbol = () => {
    if (currency === "EUR") return "€";
    if (currency === "GBP") return "£";
    if (currency === "INR") return "₹";
    return "$";
  };

  const handleNavScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const currentPlanPrice = paymentSelectedPlan ? getPlanPriceNumber(paymentSelectedPlan.price) : getPlanPriceNumber("$120");
  const currentTax = Math.round(currentPlanPrice * 0.18 * 100) / 100;
  const currentTotal = currentPlanPrice + Math.round(currentPlanPrice * 0.18);
  const currentSymbol = getCurrencySymbol();
  const formatLoc = (num: number) => {
    if (currency === "INR") return num.toLocaleString('en-IN');
    return num.toLocaleString();
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 selection:bg-[#66241f] selection:text-white font-sans overflow-x-hidden">
      
      {/* Full-screen Loader screen overlay */}
      <Loader onComplete={() => setLoading(false)} />

      {!loading && (
        <>
          {/* Main Navigation Bar from Mockup Image */}
          <header 
            className="fixed top-4 md:top-6 left-0 right-0 z-[999] px-4 md:px-10 lg:px-20 transition-all duration-300 pointer-events-none"
            style={{
              transform: showHeader ? 'translateY(0)' : 'translateY(-150%)',
            }}
          >
            <div className="relative flex justify-end md:justify-start">
              <div className="ml-auto mr-0 md:ml-0 md:mr-auto w-fit max-w-[95vw] rounded-full bg-white/45 backdrop-blur-xl border border-white/60 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.73),0_12px_45px_-12px_rgba(0,0,0,0.15)] p-1.5 md:p-2.5 flex items-center justify-start gap-3 md:gap-10 pointer-events-auto overflow-hidden">
                
                {/* Left Section - Logo with custom emblem */}
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setActiveSection("home");
                    }}
                    className="flex items-center gap-2.5 group select-none pl-2 pr-1 md:pl-3"
                  >
                    <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 bg-gradient-to-tr from-[#520907] to-[#8c1814] shadow-md border border-[#8c1814]/10">
                      <svg viewBox="0 0 100 100" className="w-4 h-4 md:w-5 md:h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 16L82 76H66L50 46L34 76H18L50 16Z" fill="white" />
                      </svg>
                    </div>
                    <span className="font-sans font-black text-base md:text-xl tracking-wider text-[#1a1a1a] leading-none antialiased">
                      APEX
                    </span>
                  </a>

                  {/* Three-dotted line on mobile & tablet */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className="lg:hidden p-1.5 hover:bg-black/5 active:scale-95 rounded-full transition-all flex items-center gap-0.5 justify-center cursor-pointer ml-1"
                    aria-label="Open menu"
                  >
                    <div className="flex items-center justify-center gap-1 w-6 h-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    </div>
                  </button>
                </div>

                {/* Middle Section - Elegant Navigation Links (always visible, responsive, zero clunky dropdown overlays) */}
                <nav className="hidden lg:flex items-center gap-1 md:gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                  {[
                    { id: "home", label: "Home", target: "hero-sec" },
                    { id: "zones", label: "Zones", target: "cardio-sec" },
                    { id: "team", label: "Team", target: "experience-sec" },
                    { id: "plans", label: "Plans", target: "memberships-sec" },
                    { id: "stories", label: "Stories", target: "testimonials-sec" },
                    { id: "contact", label: "Contact", target: "cta-sec" }
                  ].map((item) => {
                    const isActive = activeSection === item.id;
                    if (isActive) {
                      return (
                        <a
                          key={item.id}
                          href={`#${item.target}`}
                          onClick={(e) => {
                            handleNavScroll(e, item.target);
                            setActiveSection(item.id);
                          }}
                          className="relative px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-red-500/10 border border-red-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] text-[#7a1c1c] font-sans font-bold text-xs md:text-sm tracking-wide transition-all shrink-0"
                        >
                          <span className="underline underline-offset-4 decoration-2 decoration-[#7a1c1c]">
                            {item.label}
                          </span>
                        </a>
                      );
                    }
                    return (
                      <a
                        key={item.id}
                        href={`#${item.target}`}
                        onClick={(e) => {
                          handleNavScroll(e, item.target);
                          setActiveSection(item.id);
                        }}
                        className="px-3 md:px-5 py-1.5 md:py-2 rounded-full text-neutral-800 hover:text-[#7a1c1c] font-sans font-bold text-xs md:text-sm tracking-wide transition-all shrink-0"
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Liquid glass effect vertical menu list for mobile/tablet */}
              {mobileMenuOpen && (
                <div className="absolute top-14 right-0 w-[240px] rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/40 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] p-4 shrink-0 transition-all pointer-events-auto z-[999999] flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#7a1c1c] tracking-widest pl-2 pb-1 border-b border-black/5 mb-1 select-none">
                    Navigate
                  </span>
                  {[
                    { id: "home", label: "Home", target: "hero-sec" },
                    { id: "zones", label: "Zones", target: "cardio-sec" },
                    { id: "team", label: "Team", target: "experience-sec" },
                    { id: "plans", label: "Plans", target: "memberships-sec" },
                    { id: "stories", label: "Stories", target: "testimonials-sec" },
                    { id: "contact", label: "Contact", target: "cta-sec" }
                  ].map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.target}`}
                        onClick={(e) => {
                          handleNavScroll(e, item.target);
                          setActiveSection(item.id);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all font-sans font-extrabold text-[11px] uppercase tracking-wider ${
                          isActive
                            ? "bg-red-500/10 text-[#7a1c1c] border-l-4 border-[#7a1c1c] pl-4 font-black"
                            : "text-neutral-900 hover:bg-neutral-950/5"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </header>

          {/* Main content viewport */}
          <main className="relative pt-0 z-10">

            {/* HERO & STRENGTH TRAINING TRANSITION - Beautiful customized scroll-driven panel slide-in + vertical slices reveal */}
            <div id="hero-sec" />
            <HeroStrengthTransition onApplyForEntry={() => setModalOpen(true)} />

            {/* PHASE 2: CARDIO SECTION (GRID MOSAIC REVEAL EFFECT) */}
            <GridMosaicReveal
              id="cardio-sec"
              imageUrl="https://ftzwac4mdpz15xv4.public.blob.vercel-storage.com/ZYM/Using_the_same_of_this_202606192036.jpeg"
              rows={5}
              cols={6}
              scrollHeightVh={250}
              pattern="stagger"
              tileStagger={0.015}
              assembleEnd={0.6}
              startScale={0.6}
              backgroundColor="#FAF9F6"
              className="border-b border-neutral-100"
            >
              {/* Overlaid details on the left for mobile and right for desktop matching mockup guidelines */}
              <div className="w-full h-full flex items-center justify-start md:justify-end">
                <div className="w-full h-full md:h-auto md:w-[45%] lg:w-[40%] px-6 md:px-6 lg:px-8 pt-[42vh] pb-12 md:py-20 flex flex-col justify-between md:justify-center md:space-y-5 pointer-events-auto mr-1 md:mr-2 lg:mr-4 xl:mr-6 z-10 select-none">
                  
                  {/* Grouped Heading and Tagline so they move together */}
                  <div className="space-y-4">
                    {/* Oswald styled heading matching home page style */}
                    <div>
                      <h2 className="apex-giant-h1 flex flex-col md:block" style={{ fontSize: "clamp(38px, 6.8vw, 94px)" }}>
                        <span className="text-[#7a1c1c] inline-block">CARDIO</span>{" "}
                        <span className="text-black inline-block">CONDITIONING</span>
                      </h2>
                    </div>

                    {/* Orange bottom line and tagline details */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-1 bg-[#fc5404] flex-shrink-0" />
                      <p className="text-[11px] md:text-sm font-sans font-bold tracking-wider text-neutral-800 uppercase leading-none antialiased">
                        <span className="text-white">BUILD ENDURANCE. BURN MORE.</span> <span className="text-[#fc5404] font-extrabold">PERFORM BETTER.</span>
                      </p>
                    </div>
                  </div>

                  {/* Clean readable description inside glass card */}
                  <div className="backdrop-blur-md bg-black/20 border border-white/10 p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[360px] pointer-events-auto">
                    <p className="text-white text-[13px] sm:text-[14px] md:text-sm lg:text-sm font-medium leading-normal sm:leading-relaxed tracking-wide antialiased">
                      Enhance VO2 max and accelerate work capacity. Train on manual curved treadmills, air bikes &amp; smart trackers.
                    </p>
                  </div>
                </div>
              </div>
            </GridMosaicReveal>

            {/* COMBINED PHASE 3 & PHASE 4: SEQUENCED YOGA & PERSONAL TRAINING */}
            <SequencedYogaPersonalReveal
              id="personal-training-sec"
              yogaImageUrl="https://ftzwac4mdpz15xv4.public.blob.vercel-storage.com/create_a_yoga_and_mobility_202606231531.jpeg"
              personalImageUrl="https://ftzwac4mdpz15xv4.public.blob.vercel-storage.com/ZYM/create_a_stunning_image_for_202606231536.jpeg"
              scrollHeightVh={380}
            />

            {/* TRAINERS & ELITE TEAM SECTION */}
            <section
              id="experience-sec"
              className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 border-t border-neutral-100 bg-gradient-to-b from-white to-neutral-50/30"
            >
                <div className="flex flex-col items-center justify-center text-center mb-16 gap-6 w-full">
                  <div className="flex flex-col items-center gap-2.5 text-center group">
                    {/* Oswald styled heading matching home page style */}
                    <div>
                      <h2 className="apex-h1 whitespace-nowrap text-center !text-5xl sm:!text-[4rem] md:!text-[5.5rem] lg:!text-[7rem] xl:!text-[8rem] 2xl:!text-[9rem] leading-none uppercase font-black">
                        <span className="text-[#7a1c1c]">Elite </span>
                        <span className="dark">Team</span>
                      </h2>
                    </div>

                    {/* Orange line and tagline */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 select-none justify-center">
                      <div className="w-10 h-1 bg-[#fc5404] flex-shrink-0" />
                      <p className="text-[10px] md:text-sm font-sans font-black tracking-wider text-neutral-900 uppercase leading-none text-center">
                        DEDICATED COACHING. ADVANCED CERTIFICATION. <span className="text-[#fc5404] font-extrabold">TRUE METABOLICS.</span>
                      </p>
                    </div>
                  </div>
                 </div>

                {/* Grid of trainers with expandable profiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                  {TRAINERS_DATA.map((trainer) => {
                    const isExpanded = expandedTrainerId === trainer.id;
                    return (
                      <motion.div
                        key={trainer.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`relative flex flex-col justify-between overflow-hidden bg-white border rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer ${
                          isExpanded
                            ? "border-red-700 ring-2 ring-red-700/10"
                            : "border-neutral-200/80 hover:border-red-700/40"
                        }`}
                        onClick={() => setExpandedTrainerId(isExpanded ? null : trainer.id)}
                      >
                        <div>
                          {/* Elegant trainer portrait container */}
                          <div className="relative h-72 w-full overflow-hidden bg-neutral-100">
                            <img
                              src={trainer.photoUrl}
                              alt={trainer.name}
                              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500 ease-out select-none"
                              draggable={false}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            {/* Overlay Name / Cert tag */}
                            <div className="absolute bottom-5 left-6 right-6 text-left">
                              <h3 className="font-sans font-black text-2xl text-white uppercase tracking-tight">
                                {trainer.name}
                              </h3>
                              <p className="text-[#EEF2FF] text-xs font-bold leading-none mt-1 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                {trainer.certifications.split(",")[0]}
                              </p>
                            </div>
                          </div>

                          {/* Details content body */}
                          <div className="p-6 md:p-8 space-y-4">
                            
                            {/* Specialties element */}
                            <div className="text-left space-y-1">
                              <span className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                                Specialty Focus
                              </span>
                              <div className="inline-block bg-red-50/50 border border-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold font-sans">
                                {trainer.specialties}
                              </div>
                            </div>

                            {/* Certifications expanded list */}
                            <div className="text-left space-y-1">
                              <span className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                                Full Accreditations
                              </span>
                              <p className="text-xs text-neutral-700 font-semibold leading-relaxed">
                                {trainer.certifications}
                              </p>
                            </div>

                            {/* Dynamic Framer Motion biological roll down */}
                            <motion.div
                              initial={false}
                              animate={{ 
                                height: isExpanded ? "auto" : 0, 
                                opacity: isExpanded ? 1 : 0,
                                marginTop: isExpanded ? 16 : 0
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden text-left"
                            >
                              <div className="p-4 bg-neutral-50/80 border border-neutral-100 rounded-2xl text-xs md:text-sm text-neutral-600 font-medium leading-relaxed italic">
                                "{trainer.bio}"
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Expanding trigger button */}
                        <div className="p-6 pt-0 border-t border-neutral-100/60 flex items-center justify-between text-xs font-bold uppercase tracking-wider select-none bg-neutral-50/20">
                          <span className="text-neutral-400 font-semibold text-[10px]/none mt-1">
                            {isExpanded ? "Collapse" : "Card for full bio"}
                          </span>
                          <div className="text-red-800 font-black text-xs hover:underline flex items-center gap-1">
                            <span>{isExpanded ? "Collapse" : "Read Bio"}</span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronRight className="w-4 h-4 text-red-700" />
                            </motion.div>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
            </section>

            {/* MEMBERSHIP PLANS PRICING SECTION */}
            <section
              id="memberships-sec"
              className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-16 md:pb-32 border-t border-neutral-100 bg-[#FAF9F6]"
            >
              <div className="flex flex-col items-center text-center justify-center mb-10 gap-3 group select-none">
                {/* Oswald styled heading matching home page style */}
                <div className="flex flex-col items-center">
                  <h2 className="apex-h1 dark max-[#1023px]:!text-[2.2rem] max-md:!text-[2.3rem]">Membership</h2>
                  <h2 className="apex-h1 red max-[#1023px]:!text-[2.2rem] max-md:!text-[2.3rem]">Plans</h2>
                </div>

                {/* Orange line and tagline */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-1 bg-[#fc5404] flex-shrink-0" />
                  <p className="text-[10px] md:text-xs font-sans font-black tracking-wider text-neutral-900 uppercase leading-none">
                    NO CONTRACTS. HIGHEST ACCESS. <span className="text-[#fc5404] font-extrabold">PRESTIGE TRAINING.</span>
                  </p>
                </div>

                <p className="apex-paragraph-light text-sm md:text-base max-w-lg mt-3 tracking-wide">
                  No contracts, cancel anytime. Access to premium human biological optimization slots and clean training rigs.
                </p>

                {/* Elegant Billing toggle container styled like the attached graphic */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-10 p-1.5 bg-[#EEF2FF] border border-neutral-100 rounded-full max-w-md shadow-[0_4px_12px_rgba(79,107,235,0.05)]">
                  <div className="flex items-center">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-5 py-2 text-xs font-bold uppercase rounded-full transition-all duration-300 cursor-pointer ${
                        billingCycle === "monthly" ? "bg-[#4F6BEB] text-white shadow-md shadow-[#4F6BEB]/20" : "text-[#4F6BEB]/70 hover:text-[#4F6BEB]"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={`px-5 py-2 text-xs font-bold uppercase rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        billingCycle === "annual" ? "bg-[#4F6BEB] text-white shadow-md shadow-[#4F6BEB]/20" : "text-[#4F6BEB]/70 hover:text-[#4F6BEB]"
                      }`}
                    >
                      Yearly <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-sm font-extrabold font-sans">SAVE 20%</span>
                    </button>
                  </div>

                  <div className="h-4 w-px bg-neutral-200" />

                  {/* Currency switches */}
                  <div className="flex items-center gap-1">
                    {["USD", "EUR", "GBP", "INR"].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr as any)}
                        className={`text-[11.5px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                          currency === curr ? "bg-[#4F6BEB] text-white" : "text-[#4F6BEB]/60 hover:text-[#4F6BEB]"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overlapping interactive card layout inspired by the requested visual */}
              <div className="relative w-full max-w-[850px] lg:max-w-[1000px] mx-auto h-[480px] sm:h-[520px] md:h-[540px] lg:h-[620px] flex items-center justify-center overflow-visible mt-16 mb-4 px-4 select-none">
                {MEMBERSHIPS_DATA.map((tier, idx) => {
                  const isPro = tier.isFeatured;
                  const displayPrice = getDisplayPrice(tier.price);
                  
                  // Calculate modulo balanced placement offsets
                  const diff = (idx - activePricingTierIdx + 3) % 3;
                  const offset = diff === 2 ? -1 : diff;
                  
                  // Determine precise positioning styles
                  const isCenter = offset === 0;

                  return (
                    <motion.div
                      key={tier.id}
                      onClick={() => setActivePricingTierIdx(idx)}
                      animate={{
                        x: isLaptop ? `${offset * 86.4}%` : `${offset * 58}%`,
                        scale: isCenter ? 1.04 : 0.86,
                        zIndex: isCenter ? 30 : 10,
                        opacity: isCenter ? 1 : 0.85,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 26,
                      }}
                      className={`absolute w-[240px] sm:w-[280px] md:w-[310px] lg:w-[360px] h-[440px] sm:h-[470px] md:h-[490px] lg:h-[560px] p-5 sm:p-7 md:p-8 lg:p-10 rounded-[24px] lg:rounded-[28px] flex flex-col justify-between shadow-xl cursor-pointer transition-shadow duration-300 ${
                        isPro 
                          ? "bg-gradient-to-b from-[#5E78FF] to-[#465CE6] text-white border border-transparent"
                          : "bg-white border border-[#E9EEFF] text-neutral-800"
                      }`}
                      id={`membership-tier-${tier.id}`}
                    >
                      {/* MOST POPULAR Badging overlay */}
                      {isPro && (
                        <div className="absolute top-5 right-5 bg-white/15 backdrop-blur-md border border-white/25 text-white font-mono font-bold text-[8px] sm:text-[9px] tracking-widest px-2.5 py-1 rounded-full uppercase">
                          MOST POPULAR
                        </div>
                      )}

                      <div>
                        {/* Huge Price in standard elegant layout matching image */}
                        <div className="flex items-baseline mt-1 sm:mt-2">
                          <span className={`text-2xl sm:text-3xl md:text-4xl font-sans font-black tracking-tight ${
                            isPro ? "text-white" : "text-[#1E2B63]"
                          }`}>
                            {displayPrice}
                          </span>
                          <span className={`text-[10px] sm:text-xs ml-1 font-medium ${
                            isPro ? "text-white/80" : "text-neutral-400"
                          }`}>
                            /{tier.period}
                          </span>
                        </div>

                        {/* Bold Name tag below price */}
                        <h3 className={`font-sans font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight mt-3 ${
                          isPro ? "text-white" : "text-neutral-950"
                        }`} id={`tier-name-${tier.id}`}>
                          {tier.name}
                        </h3>

                        {/* Description */}
                        <p className={`text-[10px] sm:text-xs leading-normal mt-1.5 mb-4 sm:mb-6 ${
                          isPro ? "text-white/85" : "text-neutral-400 font-normal"
                        }`}>
                          {tier.description}
                        </p>

                        <div className={`w-full h-px mb-4 sm:mb-6 ${isPro ? "bg-white/10" : "bg-neutral-100"}`} />

                        {/* List items with checkmarks styled perfectly like the graphic */}
                        <ul className="flex flex-col gap-2.5 sm:gap-3 mb-4 text-left">
                          {tier.features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] md:text-xs">
                              <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isPro ? "bg-white/15" : "bg-[#EEF2FF]"
                              }`}>
                                <Check className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                  isPro ? "text-white" : "text-[#4F6BEB]"
                                }`} />
                              </span>
                              <span className={isPro ? "text-white/90" : "text-[#3F4865] font-medium"}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Custom styled Pill buttons exactly corresponding to the attached asset graphic states */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentSelectedPlan(tier);
                          setPaymentModalOpen(true);
                          setPaymentSuccess(false);
                          setPayCardholder("");
                          setPayCardNumber("");
                          setPayExpiry("");
                          setPayCvv("");
                          setPayTab("card");
                          setUpiId("");
                          setUpiError("");
                        }}
                        className={`w-full py-2.5 sm:py-3.5 rounded-full font-sans font-bold text-[10px] sm:text-xs tracking-wide shadow-sm transition-all duration-300 active:scale-98 cursor-pointer ${
                          isPro 
                            ? "bg-white hover:bg-neutral-50 text-[#4F6BEB] hover:shadow-lg"
                            : "bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F6BEB] hover:shadow-md"
                        }`}
                      >
                        {tier.name === "Base" ? "Downgrade" : "Upgrade"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Slider Dots and Navigation arrow controls below cards for clear interactive access */}
              <div className="w-full max-w-[310px] sm:max-w-[420px] flex items-center justify-between mt-8 lg:mt-12 lg:translate-x-28 lg:-translate-y-6 mx-auto z-30 select-none px-4">
                {/* Elegant dots indicators */}
                <div className="flex items-center space-x-2.5">
                  {MEMBERSHIPS_DATA.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActivePricingTierIdx(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        dotIdx === activePricingTierIdx ? "w-6 bg-[#4F6BEB]" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                      }`}
                      aria-label={`Go to membership tier ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                {/* Right bottom action arrow controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setActivePricingTierIdx((prev) => (prev === 0 ? MEMBERSHIPS_DATA.length - 1 : prev - 1));
                    }}
                    className="p-3 bg-[#111] hover:bg-neutral-800 text-white rounded-full active:scale-95 transition-all duration-200 cursor-pointer shadow-md border border-white/10 flex items-center justify-center animate-none"
                    aria-label="Previous membership tier"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActivePricingTierIdx((prev) => (prev === MEMBERSHIPS_DATA.length - 1 ? 0 : prev + 1));
                    }}
                    className="p-3 bg-[#4F6BEB] hover:bg-[#3d57db] text-white rounded-full active:scale-95 transition-all duration-200 cursor-pointer shadow-md border border-white/15 flex items-center justify-center animate-none"
                    aria-label="Next membership tier"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* TESTIMONIALS CLIENT STORIES SECTION */}
            <section
              id="testimonials-sec"
              className="relative py-20 bg-white border-t border-b border-neutral-100 overflow-hidden"
            >
              {/* Floating aesthetic background layout details */}
              <div className="absolute top-1/2 left-10 -translate-y-1/2 text-neutral-100 font-serif italic font-black text-[12vw] select-none pointer-events-none opacity-[0.15]">
                APX
              </div>

              {/* Central container */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-12 flex flex-col items-center">
                {/* Header with gap parameter exactly as previously requested */}
                <div className="w-full text-center group flex flex-col items-center mb-10 md:mb-14">
                   <div className="flex flex-col items-center">
                     <h2 className="apex-h1 dark !text-5xl sm:!text-6xl md:!text-7xl lg:!text-[5rem] xl:!text-[6rem] 2xl:!text-[6.8rem] leading-[0.85] tracking-tighter uppercase font-black text-center !mb-[3px]">Client</h2>
                     <h2 className="apex-h1 red !text-5xl sm:!text-6xl md:!text-7xl lg:!text-[5rem] xl:!text-[6rem] 2xl:!text-[6.8rem] leading-[0.85] tracking-tighter uppercase font-black text-center">Testimonials</h2>
                     <p className="apex-eyebrow !mt-[3px]">Real Outcomes</p>
                   </div>
                   <div className="w-12 h-1 bg-[#7A1F1A] mt-4 group-hover:w-24 transition-all duration-300 mx-auto" />
                </div>

                {/* Animated Testimonial Card Frame with real physical layering stack effect */}
                <div className="relative w-full max-w-[480px] lg:max-w-[580px] h-[290px] sm:h-[250px] lg:h-[380px] flex items-center justify-center">
                  {TESTIMONIALS_DATA.map((t, idx) => {
                    const totalCards = TESTIMONIALS_DATA.length;
                    const relativeIndex = (activeTestimonial - idx + totalCards) % totalCards;
                    const isActive = relativeIndex === 0;
                    const isVisible = relativeIndex < 3 || relativeIndex === totalCards - 1;
                    const isImageUrl = t.avatarUrl.startsWith("http") || t.avatarUrl.includes("/");

                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20, rotate: 0, x: 0 }}
                        animate={
                          isActive
                            ? { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0, zIndex: 40 }
                            : relativeIndex === 1
                            ? { 
                                opacity: 0.85, 
                                scale: 0.95, 
                                y: 14, 
                                x: 12, 
                                rotate: -1.5, 
                                zIndex: 30 
                              }
                            : relativeIndex === 2
                            ? { 
                                opacity: 0.5, 
                                scale: 0.9, 
                                y: 28, 
                                x: 24, 
                                rotate: 1.5, 
                                zIndex: 20 
                              }
                            : relativeIndex === totalCards - 1
                            ? {
                                opacity: 0,
                                scale: 0.8,
                                y: 15,
                                x: testimonialDirection === "prev" ? (isLaptop ? 600 : 460) : (testimonialDirection === "next" ? (isLaptop ? -600 : -460) : (isLaptop ? 600 : 460)),
                                rotate: testimonialDirection === "prev" ? 12 : (testimonialDirection === "next" ? -12 : 12),
                                zIndex: testimonialDirection === "prev" ? 50 : 10
                              }
                            : { opacity: 0, scale: 0.8, y: 40, x: 0, rotate: 0, zIndex: 0 }
                        }
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className={`absolute inset-0 bg-[#f8f9fa] border border-neutral-200 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-9 flex flex-col justify-between lg:justify-start lg:gap-7 text-left cursor-pointer shadow-xl overflow-hidden`}
                        onClick={() => {
                          if (isActive) setModalOpen(true);
                        }}
                        style={{ 
                          display: isVisible ? "flex" : "none",
                          pointerEvents: isActive ? "auto" : "none"
                        }}
                      >
                        <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                        {/* Top Group: Spaced profile and testimonial text compactly to remove random layout gap */}
                        <div className="relative z-10 flex flex-col space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-5">
                          <div className="flex items-center space-x-3 sm:space-x-3.5 lg:space-x-4">
                            {isImageUrl ? (
                              <div className="h-12 w-12 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-13 lg:w-13 rounded-full overflow-hidden shadow-md border border-neutral-300 flex-shrink-0 select-none">
                                <img
                                  src={t.avatarUrl}
                                  alt={t.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-13 lg:w-13 rounded-full bg-neutral-900 text-[#f8f9fa] flex items-center justify-center font-display font-black text-xs sm:text-xs md:text-lg lg:text-lg shadow-md border border-neutral-200 flex-shrink-0 select-none">
                                {t.avatarUrl}
                              </div>
                            )}
                            <div>
                              <div className="text-black font-serif italic font-extrabold text-base sm:text-[17px] md:text-base lg:text-lg tracking-tight leading-snug antialiased">
                                {t.name}
                              </div>
                              <div className="text-neutral-600 font-sans text-xs sm:text-[13px] md:text-xs lg:text-xs font-semibold uppercase tracking-wider mt-0.5 antialiased">
                                {t.role}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2 text-left">
                            <div className="flex text-[#D4AF37] text-base sm:text-md lg:text-lg tracking-tighter select-none">
                              {"★".repeat(t.rating)}
                            </div>
                            <p className="text-black font-serif font-semibold text-base sm:text-[17px] md:text-lg lg:text-[1.12rem] xl:text-[1.2rem] leading-snug sm:leading-relaxed lg:leading-relaxed tracking-wide antialiased select-none">
                              "{t.quote}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Navigation and Indicators positioned inline BELOW the card to prevent overlap on any device */}
                <div className="w-full max-w-[480px] lg:max-w-[580px] flex items-center justify-between lg:justify-center mt-6 z-30 select-none px-1">
                  {/* Elegant dots indicators */}
                  <div className="flex items-center space-x-2.5">
                    {TESTIMONIALS_DATA.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => {
                          setTestimonialDirection(dotIdx > activeTestimonial ? "next" : "prev");
                          setActiveTestimonial(dotIdx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          dotIdx === activeTestimonial ? "w-6 bg-[#7A1F1A]" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                        }`}
                        aria-label={`Go to testimonial ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Right bottom action button controls */}
                  <div className="flex items-center space-x-3 lg:absolute lg:bottom-4 lg:right-12">
                    <button
                      onClick={() => {
                        setTestimonialDirection("prev");
                        setActiveTestimonial((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
                      }}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full active:scale-95 transition-all duration-200 cursor-pointer shadow-md border border-white/10 flex items-center justify-center"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setTestimonialDirection("next");
                        setActiveTestimonial((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
                      }}
                      className="p-3 bg-[#7A1F1A] hover:bg-[#611814] text-white rounded-full active:scale-95 transition-all duration-200 cursor-pointer shadow-md border border-white/15 flex items-center justify-center"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* CALL TO ACTION & CONTACT SECTION - Asymmetric Premium Layout */}
            <section
              id="cta-sec"
              className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 border-t border-neutral-100/80 bg-[#FCFCFD]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              
              {/* Left side: Premium CTA Hook */}
              <motion.div 
                className="lg:col-span-7 flex flex-col justify-between items-start text-left space-y-8 bg-gradient-to-br from-[#FAF9F6] to-[#FFF] p-8 md:p-12 rounded-[2rem] border border-neutral-200/50 shadow-[0_20px_50px_rgba(102,36,31,0.01)]"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="space-y-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#66241f]/10 rounded-full text-[10px] font-bold text-[#66241f] uppercase tracking-widest">
                    <div className="relative w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#520907] to-[#8c1814] border border-[#8c1814]/10">
                      <svg viewBox="0 0 100 100" className="w-2 h-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 16L82 76H66L50 46L34 76H18L50 16Z" fill="white" />
                      </svg>
                    </div>
                    MEMBERSHIP PRE-ENROLLMENT ACTIVE
                  </span>
                  
                  <div className="flex flex-col items-start text-left">
                    <p className="apex-eyebrow">Trajectory</p>
                    <h2 className="apex-h1 dark !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl !leading-[1.1]">Ready For Your</h2>
                    <h2 className="apex-h1 red !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl !leading-[1.1]">Transformation?</h2>
                  </div>
                  
                  <p className="apex-paragraph-light text-sm md:text-base max-w-xl">
                    Experience elite athletic optimization, highly calibrated diagnostic facilities, and dedicated private training with first-class coaches. Start your physical trajectory today.
                  </p>
                </div>

                <div className="pt-4 w-full sm:w-auto">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto px-8 py-5 bg-[#66241f] hover:bg-[#521a16] text-white font-sans font-bold uppercase tracking-widest text-xs rounded shadow-[0_15px_30px_rgba(102,36,31,0.15)] hover:shadow-[0_20px_40px_rgba(102,36,31,0.3)] hover:-translate-y-1 active:scale-98 cursor-pointer flex items-center justify-center gap-3 transition-all duration-300"
                  >
                    <span>Get Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Right side: Elegant Contact details aligned perfectly inside cards */}
              <motion.div 
                className="lg:col-span-5 flex flex-col justify-between bg-white border border-neutral-200/50 p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(30,43,101,0.01)]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="space-y-8">
                  <h3 className="font-display-serif italic font-medium text-xl md:text-2xl text-neutral-900 tracking-tight">
                    Metropolitan Facility & Liaison
                  </h3>

                  {/* Highly stylized contact listings */}
                  <div className="space-y-6">
                    
                    {/* Address detail */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#66241f]/10 flex items-center justify-center text-[#66241f] flex-shrink-0 mt-0.5 shadow-sm">
                        <MapPin className="w-5 h-5 text-[#66241f]" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 font-sans">HQ Address</span>
                        <p className="text-neutral-700 font-semibold text-sm md:text-base leading-relaxed tracking-wide">
                          742 Apex Boulevard, Suite 100<br />Metropolis, NY 10001
                        </p>
                      </div>
                    </div>

                    {/* Phone detail */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#66241f]/10 flex items-center justify-center text-[#66241f] flex-shrink-0 mt-0.5 shadow-sm">
                        <Phone className="w-5 h-5 text-[#66241f]" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 font-sans">Phone Line</span>
                        <p className="text-neutral-700 font-bold text-sm md:text-base tracking-wide">
                          +1 (800) 555-APEX
                        </p>
                      </div>
                    </div>

                    {/* Email detail */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#66241f]/10 flex items-center justify-center text-[#66241f] flex-shrink-0 mt-0.5 shadow-sm">
                        <Mail className="w-5 h-5 text-[#66241f]" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 font-sans">Inquiries</span>
                        <p className="text-neutral-700 font-bold text-sm md:text-base hover:text-[#66241f] transition-colors">
                          liaison@apexprotocol.com
                        </p>
                      </div>
                    </div>

                    {/* Hours detail */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#66241f]/10 flex items-center justify-center text-[#66241f] flex-shrink-0 mt-0.5 shadow-sm">
                        <Clock className="w-5 h-5 text-[#66241f]" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 font-sans font-sans">Operating Hours</span>
                        <p className="text-neutral-700 font-bold text-sm md:text-base leading-relaxed tracking-wide">
                          Mon – Fri: 05:00 – 23:00<br />Sat – Sun: 07:00 – 21:00
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-8 border-t border-neutral-100 mt-8 text-left text-xs text-[#3F4865]/60 font-semibold">
                  * Advance verification of appointment required for facility walk-in sessions.
                </div>
              </motion.div>

              </div>
            </section>
          </main>

          {/* Footnotes coordinates */}
          <footer
            id="site-footer"
            className="relative bg-neutral-50 border-t border-neutral-100 z-[100] shadow-[0_-32px_64px_rgba(0,0,0,0.15)] py-16 text-left"
          >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 font-display font-black text-xl tracking-tighter text-neutral-900">
                  <div className="w-6 h-6 bg-gradient-to-tr from-neon to-[#66241f] rounded-sm flex items-center justify-center">
                    <span className="text-neutral-950 text-[10px] font-black">APX</span>
                  </div>
                  <span>APEX <span className="text-[#66241f] font-extrabold">ATHLETICS</span></span>
                </div>
                <p className="text-xs text-neutral-800 font-medium leading-relaxed max-w-xs">
                  We formulate custom training environments centering premium structural infrastructure and performance metrics tracking.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <a href="#instagram" className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black hover:border-[#66241f]" aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#facebook" className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black hover:border-cyan-50" aria-label="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#twitter" className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black hover:border-neon" aria-label="Twitter">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Coordinates */}
              <div className="flex flex-col gap-4">
                <h4 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-widest">
                  Performance Lab
                </h4>
                <ul className="flex flex-col gap-3 text-xs text-neutral-600 font-light">
                  <li className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#66241f] flex-shrink-0" />
                    <span>883 Apex Blvd, Metropolis NV</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#66241f] flex-shrink-0" />
                    <span>+1 (800) 555-APEX</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#66241f] flex-shrink-0" />
                    <span>concierge@apexathletics.com</span>
                  </li>
                </ul>
              </div>

              {/* Schedules */}
              <div className="flex flex-col gap-4">
                <h4 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-widest">
                  Operation Hours
                </h4>
                <ul className="flex flex-col gap-2.5 text-xs text-neutral-600 font-light">
                  <li className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span>Monday - Friday</span>
                    <span className="font-bold text-neutral-800">05:00 - 23:00</span>
                  </li>
                  <li className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span>Saturday</span>
                    <span className="font-bold text-neutral-800">06:00 - 21:00</span>
                  </li>
                  <li className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span>Sunday (Recovery)</span>
                    <span className="font-bold text-neutral-800">08:00 - 18:00</span>
                  </li>
                </ul>
              </div>

              {/* Fast links */}
              <div className="flex flex-col gap-4">
                <h4 className="font-display font-bold text-sm text-neutral-900 uppercase tracking-widest">
                  Direct Registry
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500">
                  <a href="#services" onClick={(e) => handleNavScroll(e, "services-sec")} className="hover:text-[#66241f] transition-colors font-semibold">Gym Zones</a>
                  <a href="#experience" onClick={(e) => handleNavScroll(e, "experience-sec")} className="hover:text-[#66241f] transition-colors font-semibold">Coaches</a>
                  <a href="#memberships" onClick={(e) => handleNavScroll(e, "memberships-sec")} className="hover:text-[#66241f] transition-colors font-semibold">Tiers</a>
                  <a href="#testimonials" onClick={(e) => handleNavScroll(e, "testimonials-sec")} className="hover:text-[#66241f] transition-colors font-semibold">Reviews</a>
                  <a href="#" className="hover:text-[#66241f] transition-colors font-semibold">Liability Waiver</a>
                  <a href="#" className="hover:text-[#66241f] transition-colors font-semibold">Privacy Charter</a>
                </div>
              </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-neutral-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-neutral-500 font-medium tracking-wider">
              <span>© {new Date().getFullYear()} APEX ATHLETICS LLC. BIOMETRICAL INTEGRATIONS RESERVED.</span>
              <span>CRAFTED BY THE ELITE FRONTEND TEAM • FULL-STACK SANDBOX</span>
            </div>
          </footer>

          {/* Interactive Protocol Form modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
              {/* Blur transparent backdrop */}
              <div
                onClick={() => setModalOpen(false)}
                className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md transition-opacity duration-300"
              />

              {/* Form card */}
              <div className="relative w-full max-w-md bg-white border border-neutral-100 shadow-[0_24px_60px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden p-8 sm:p-10 z-10 text-center animate-scale-up">
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-5 right-5 text-neutral-400 hover:text-black transition-colors p-1 rounded-full hover:bg-neutral-100"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {formSubmitted ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-5">
                    <div className="w-14 h-14 bg-[#66241f]/10 text-[#66241f] rounded-full flex items-center justify-center">
                      <Check className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-sans font-extrabold text-xl text-neutral-900 uppercase tracking-wider">
                        Trial Reserved
                      </h3>
                      <p className="text-neutral-500 text-sm mt-3 leading-relaxed max-w-xs mx-auto font-medium">
                        Your free day pass is confirmed. We look forward to seeing you at Apex Athletics.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                    <div className="text-center pb-2">
                      <h3 className="font-sans font-black text-2xl text-neutral-900 uppercase tracking-wide">
                        Get a Free Trial
                      </h3>
                      <p className="text-neutral-500 text-sm font-medium mt-2 leading-relaxed">
                        Experience our premium platforms, custom coaching, and elite athletic facilities.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold text-neutral-700 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Vance Carter"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-[#66241f] focus:bg-white text-sm rounded-lg outline-none transition-all text-neutral-900 font-medium placeholder:text-neutral-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold text-neutral-700 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vance@apexathletics.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-[#66241f] focus:bg-white text-sm rounded-lg outline-none transition-all text-neutral-900 font-medium placeholder:text-neutral-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold text-neutral-700 uppercase tracking-wider">
                        Fitness Focus
                      </label>
                      <select
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-[#66241f] focus:bg-white text-sm rounded-lg outline-none transition-all text-neutral-900 font-medium cursor-pointer"
                      >
                        <option value="strength">Strength & Conditioning</option>
                        <option value="performance">Athletic Performance</option>
                        <option value="cardio">Cardio & Endurance</option>
                        <option value="mobility">Recovery & Mobility</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 bg-[#66241f] hover:bg-[#521a16] text-white font-sans font-bold uppercase tracking-widest text-xs rounded-full transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-[#66241f]/15"
                    >
                      Claim Your Pass
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Custom Upgrade Payment Modal with Complete White Background */}
          {paymentModalOpen && (
            <div 
              className="fixed inset-0 z-[1200] bg-white overflow-y-auto flex flex-col items-center justify-start md:justify-center p-4 sm:p-6 md:p-8 animate-scale-up"
              style={{
                '--font-sans': '"Inter", sans-serif',
                '--color-background-primary': '#ffffff',
                '--color-background-secondary': '#f9fafb',
                '--color-background-info': '#eff6ff',
                '--color-border-primary': '#111827',
                '--color-border-tertiary': '#e5e7eb',
                '--border-radius-lg': '16px',
                '--border-radius-md': '8px',
                '--color-text-primary': '#111827',
                '--color-text-secondary': '#4b5563',
                '--color-text-tertiary': '#9ca3af',
                '--color-text-info': '#2563eb',
                '--color-text-success': '#10b981',
              } as React.CSSProperties}
            >
              {/* Back / Close button */}
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="absolute top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Tiers</span>
              </button>

              <button
                onClick={() => setPaymentModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <style>{`
                .pay-root { width: 100%; max-width: 680px; margin: 0 auto; padding: 1.5rem 0; font-family: var(--font-sans); }
                .pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .pay-card { background: var(--color-background-primary); border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
                .pay-label { font-size: 11px; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
                .pay-input { width: 100%; box-sizing: border-box; margin-bottom: 14px; border-radius: var(--border-radius-md); border: 1px solid var(--color-border-tertiary); padding: 10px 14px; font-size: 16px; outline: none; transition: border-color 0.2s; }
                .pay-input:focus { border-color: var(--color-border-primary); }
                .pay-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .pay-badge { display: inline-block; background: var(--color-background-info); color: var(--color-text-info); font-size: 11px; padding: 4px 10px; border-radius: var(--border-radius-md); margin-bottom: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
                .pay-plan-name { font-size: 20px; font-weight: 800; color: var(--color-text-primary); margin: 0 0 4px; text-transform: uppercase; letter-spacing: -0.01em; }
                .pay-plan-price { font-size: 32px; font-weight: 900; color: var(--color-text-primary); margin: 0; letter-spacing: -0.02em; }
                .pay-plan-price span { font-size: 14px; font-weight: 500; color: var(--color-text-secondary); }
                .pay-divider { border: none; border-top: 1px solid var(--color-border-tertiary); margin: 16px 0; }
                .pay-feature { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px; font-weight: 500; }
                .pay-summary-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px; font-weight: 500; }
                .pay-summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: var(--color-text-primary); margin-top: 8px; border-top: 1px dashed var(--color-border-tertiary); pt-3; }
                .pay-btn { width: 100%; padding: 12px; background: var(--color-background-primary); border: 1.5px solid var(--color-border-primary); border-radius: var(--border-radius-md); font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px; color: var(--color-text-primary); transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.04em; }
                .pay-btn:hover { background: var(--color-background-secondary); }
                .pay-btn.primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: var(--color-text-primary); }
                .pay-btn.primary:hover { opacity: 0.9; transform: translateY(-1px); }
                .pay-secure { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--color-text-tertiary); justify-content: center; margin-top: 12px; font-weight: 500; }
                .pay-card-icons { display: flex; gap: 8px; margin-bottom: 14px; }
                .pay-card-pill { background: var(--color-background-secondary); border: 1px solid var(--color-border-tertiary); border-radius: 6px; padding: 4px 10px; font-size: 11px; color: var(--color-text-secondary); font-weight: 700; letter-spacing: 0.04em; }
                .pay-heading { font-size: 15px; font-weight: 700; color: var(--color-text-primary); margin: 0 0 14px; text-transform: uppercase; letter-spacing: 0.02em; }
                @media (max-width: 640px) {
                  .pay-grid { grid-template-columns: 1fr; gap: 16px; }
                  .pay-root { padding: 5.5rem 0 2rem; }
                  .pay-card { padding: 1.25rem; }
                }
                @media (min-width: 641px) {
                  .pay-input { font-size: 14px; }
                }
              `}</style>

              <div className="pay-root">
                <h2 className="sr-only">Payment page mockup showing plan summary and card details form</h2>

                {paymentSuccess ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="font-sans font-black text-xl text-neutral-900 uppercase tracking-widest mt-2">
                      PAYMENT SUCCESSFUL
                    </h3>
                    <p className="text-neutral-600 text-sm font-light leading-relaxed">
                      Thank you! Your transaction has been processed securely. Your membership tier has been updated to <strong>{paymentSelectedPlan?.name || "Pro"}</strong>.
                    </p>
                    <button
                      onClick={() => setPaymentModalOpen(false)}
                      className="mt-6 w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs rounded-full uppercase tracking-widest transition-colors"
                    >
                      Return to Gym Protocol
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (payTab === 'upi') {
                        const validateUpi = (id: string) => /^[\w.\-]+@[\w]+$/.test(id);
                        if (!validateUpi(upiId)) {
                          setUpiError('Enter a valid UPI ID (e.g. name@upi)');
                          return;
                        }
                      }
                      setUpiError('');
                      setPaymentSuccess(true);
                    }}
                    className="pay-grid"
                  >
                    {/* Left: Card details Form */}
                    <div className="pay-card">
                      <p className="pay-heading">
                        <CreditCard className="w-4 h-4 mr-1.5 inline-block align-middle text-neutral-800" style={{ verticalAlign: "-2px" }} />
                        Payment details
                      </p>

                      {/* Tab switcher */}
                      <div className="flex gap-2 mb-5 bg-neutral-100 p-1 rounded-lg">
                        {(['card', 'upi'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setPayTab(t)}
                            className={`flex-1 py-1.5 text-[10px] sm:text-xs rounded-md font-bold transition-all uppercase tracking-wider select-none cursor-pointer ${
                              payTab === t
                                ? 'bg-white shadow text-black'
                                : 'text-neutral-500 hover:text-black'
                            }`}
                          >
                            {t === 'card' ? '💳 Card' : '📱 UPI'}
                          </button>
                        ))}
                      </div>

                      {payTab === 'card' && (
                        <>
                          <div className="pay-card-icons">
                            <div className="pay-card-pill">VISA</div>
                            <div className="pay-card-pill">MC</div>
                            <div className="pay-card-pill">AMEX</div>
                          </div>

                          <div className="flex flex-col">
                            <p className="pay-label">Cardholder name</p>
                            <input 
                              className="pay-input" 
                              type="text" 
                              required
                              placeholder="Jane Smith" 
                              value={payCardholder}
                              onChange={(e) => setPayCardholder(e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col">
                            <p className="pay-label">Card number</p>
                            <input 
                              className="pay-input" 
                              type="text" 
                              required
                              placeholder="1234  5678  9012  3456" 
                              value={payCardNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                const groups = val.match(/.{1,4}/g);
                                setPayCardNumber(groups ? groups.join("  ") : val);
                              }}
                            />
                          </div>

                          <div className="pay-row">
                            <div className="flex flex-col">
                              <p className="pay-label">Expiry</p>
                              <input 
                                className="pay-input"
                                type="text" 
                                required
                                placeholder="MM / YY" 
                                value={payExpiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\s/g, "").replace(/\//g, "");
                                  if (val.length > 4) val = val.substring(0, 4);
                                  if (val.length >= 2) {
                                    setPayExpiry(val.substring(0, 2) + " / " + val.substring(2));
                                  } else {
                                    setPayExpiry(val);
                                  }
                                }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="pay-label">CVV</p>
                              <input 
                                className="pay-input"
                                type="password" 
                                required
                                placeholder="•••" 
                                value={payCvv}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                  setPayCvv(val);
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {payTab === 'upi' && (
                        <div className="flex flex-col text-left">
                          <p className="pay-label">UPI ID</p>
                          <input 
                            className={`pay-input ${upiError ? 'border-red-500 focus:border-red-500' : ''}`}
                            type="text" 
                            required
                            placeholder="yourname@upi" 
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiError('');
                            }}
                          />
                          {upiError && (
                            <p className="text-xs text-red-500 -mt-2 mb-3 font-semibold">{upiError}</p>
                          )}
                          <p className="text-xs text-neutral-400 mb-3 leading-relaxed font-medium">
                            Works with GPay, PhonePe, Paytm, BHIM, and all UPI apps.
                          </p>

                          {/* Popular UPI apps hint */}
                          <div className="flex gap-2 flex-wrap mb-4">
                            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                              <span
                                key={app}
                                className="text-[10px] font-bold border border-neutral-200 bg-neutral-50 rounded-md px-2.5 py-1 text-neutral-500 uppercase tracking-wide"
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <hr className="pay-divider" />

                      <button className="pay-btn primary" type="submit">
                        {payTab === 'upi' ? `Pay via UPI — ${currentSymbol}${formatLoc(currentTotal)}` : `Pay ${currentSymbol}${formatLoc(currentTotal)}`}
                      </button>
                      
                      <div className="pay-secure">
                        <Lock className="w-3.5 h-3.5 text-neutral-400 inline-block align-middle" />
                        Secured with 256-bit SSL encryption
                      </div>
                    </div>

                    {/* Right: Plan summary Card */}
                    <div className="pay-card">
                      <div className="pay-badge">
                        {paymentSelectedPlan?.name || "Pro"} plan
                      </div>
                      <p className="pay-plan-name">{paymentSelectedPlan?.name || "Pro"}</p>
                      <p className="pay-plan-price">
                        {currentSymbol}{formatLoc(currentPlanPrice)} 
                        <span> / {billingCycle === "annual" ? "year" : "month"}</span>
                      </p>
                      
                      <hr className="pay-divider" />

                      {/* Dyn features */}
                      <div className="flex flex-col gap-2">
                        {(paymentSelectedPlan?.features || [
                          "Everything in Base access",
                          "Sub-zero contrast plunges",
                          "1-on-1 private biology coaching",
                          "Custom nutrition formulation",
                          "Bi-weekly metabolic profiling"
                        ]).map((feature: string, fIdx: number) => (
                          <div key={fIdx} className="pay-feature">
                            <Check className="w-4 h-4 text-emerald-500 mr-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <hr className="pay-divider" />

                      <div className="pay-summary-row">
                        <span>Subtotal</span>
                        <span>{currentSymbol}{formatLoc(currentPlanPrice)}.00</span>
                      </div>
                      <div className="pay-summary-row">
                        <span>Tax (18% GST)</span>
                        <span>{currentSymbol}{currentTax.toLocaleString(currency === 'INR' ? 'en-IN' : undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>
                      
                      <hr className="pay-divider" style={{ margin: '8px 0' }} />
                      
                      <div className="pay-summary-total pt-3">
                        <span>Total due today</span>
                        <span>{currentSymbol}{formatLoc(currentTotal)}.00</span>
                      </div>

                      <hr className="pay-divider" />
                      <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', margin: 0, lineHeight: 1.4 }}>
                        Billed {billingCycle === "annual" ? "annually" : "monthly"}. Cancel anytime from your account settings.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Embedded key animation frames */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .animate-scale-up {
          animation: scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

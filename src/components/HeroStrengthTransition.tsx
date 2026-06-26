import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GradientColorSweep from "./ui/GradientColorSweep";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroStrengthTransitionProps {
  onApplyForEntry: () => void;
}

export default function HeroStrengthTransition({
  onApplyForEntry,
}: HeroStrengthTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const strengthLayerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);
  const sliceImagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliceCount = isCompact ? 4 : 8;
  const widthPercent = 100 / sliceCount;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinRef.current) return;

      const slices = slicesRef.current.filter(Boolean);
      const sliceImages = sliceImagesRef.current.filter(Boolean);

      // Pre-set vertical image slices to be off-screen above
      gsap.set(slices, { yPercent: -125 });

      // Gather strength training text targets
      const h2 = textContentRef.current?.querySelector(".animated-heading");
      const bar = textContentRef.current?.querySelector(".animated-bar");
      const desc = textContentRef.current?.querySelector(".animated-desc");
      const textElements = [h2, bar, desc].filter(Boolean);

      // Pre-set strength text elements to be hidden/offset below
      gsap.set(textElements, { opacity: 0, y: 30 });

      // Pre-set Strength Training layer off-screen to the right
      gsap.set(strengthLayerRef.current, { x: "100%", scale: 0.98 });

      // Create main coordinate timeline linked to section scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // 1. Panel Slide-in: Strength panel slides in from the right & covers Hero section
      //    (From scroll progress 0.0 to 0.4)
      tl.to(
        strengthLayerRef.current,
        {
          x: "0%",
          scale: 1,
          ease: "power2.out",
          duration: 0.4,
        },
        0
      );

      // Hero page only fades out to prevent horizontal/vertical shifting of the left-aligned text
      tl.to(
        heroLayerRef.current,
        {
          opacity: 0,
          ease: "power2.out",
          duration: 0.4,
        },
        0
      );

      // 2. Heading Animation on the blank white panel
      //    (From scroll progress 0.15 to 0.45)
      tl.to(
        textElements,
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          duration: 0.3,
        },
        0.15
      );

      // 3. Sliced Image Drop-In animation
      //    (From scroll progress 0.45 to 0.78)
      tl.to(
        slices,
        {
          yPercent: 0,
          stagger: 0.035,
          ease: "power2.out",
          duration: 0.33,
        },
        0.45
      );

      // 4. Inner Image Zoom Scale 1.0 -> 1.15
      //    (From scroll progress 0.55 to 0.95)
      tl.fromTo(
        sliceImages,
        { scale: 1.0 },
        {
          scale: 1.15,
          ease: "none",
          duration: 0.4,
        },
        0.55
      );

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [sliceCount]); // Reset hook trigger when slice count shifts

  // Clear tracking refs on change
  slicesRef.current = [];
  sliceImagesRef.current = [];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#FAF9F6] overflow-visible"
    >
      <div
        ref={pinRef}
        className="w-full h-screen overflow-hidden relative bg-[#FAF9F6]"
      >
        {/* PANEL 1: HERO SECTION - Static during pin, but scales down and fades as Panel 2 slides in */}
        <div
          ref={heroLayerRef}
          className="absolute inset-0 w-full h-full flex items-end justify-start overflow-hidden pb-12 sm:pb-16 md:pb-24 pl-6 md:pl-16 lg:pl-24 z-10 will-change-transform"
        >
          {/* Premium Background Image Container with Soft Elegant Contrast Wash */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://ftzwac4mdpz15xv4.public.blob.vercel-storage.com/add_some_design_in_the_202606222000.jpeg"
              alt="Apex Athletics Premium Interior background"
              className="w-full h-full object-cover object-[72%_30%] max-md:object-[72%_30%] scale-125 lg:scale-102"
              referrerPolicy="no-referrer"
            />

            {/* Floating Animated Backdrop Text Layers to blend beautifully behind content */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              <div
                className="absolute top-1/4 left-10 md:left-24 text-[14vw] font-display font-black leading-none text-transparent tracking-widest uppercase opacity-20 filter blur-[1px] animate-bg-drift"
                style={{
                  WebkitTextStroke: "2px rgba(229, 193, 88, 0.5)",
                  animationDuration: "14s",
                  animationDelay: "-2s",
                }}
              >
                APEX
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-2xl px-0 flex justify-start">
            <div className="flex flex-col items-start text-left animate-item-drop select-none">
              <div className="flex flex-col items-start" style={{ padding: "1.5rem 0" }}>
                <GradientColorSweep
                  text="Building"
                  variant="custom"
                  fontSize="clamp(2.8rem, 8.5vw, 5.8rem)"
                  fontWeight={900}
                  fontFamily="'Oswald', sans-serif"
                  baseColor="rgba(26,26,26,0.15)"
                  afterColor="#1a1a1a"
                  gradientColors={["#1b1b1b", "#4a4a4a", "#333333", "#1b1b1b"]}
                  sweepStyle="pass"
                  withEntrance={true}
                  scrub={false}
                  className="hidden md:block apex-h1 dark whitespace-nowrap"
                  style={{ lineHeight: "0.95" }}
                />
                <div 
                  className="md:hidden apex-h1 dark whitespace-nowrap"
                  style={{
                    fontSize: "clamp(2.8rem, 8.5vw, 5.8rem)",
                    fontWeight: 900,
                    fontFamily: "'Oswald', sans-serif",
                    lineHeight: "0.95",
                    color: "#1a1a1a"
                  }}
                >
                  Buil<span className="text-[#7a1c1c]">ding</span>
                </div>
                <GradientColorSweep
                  text="Strong Muscles"
                  variant="custom"
                  fontSize="clamp(2.8rem, 8.5vw, 5.8rem)"
                  fontWeight={900}
                  fontFamily="'Oswald', sans-serif"
                  baseColor="rgba(122,28,28,0.15)"
                  afterColor="#7a1c1c"
                  gradientColors={["#7a1c1c", "#b53e3e", "#9d2828", "#7a1c1c"]}
                  sweepStyle="pass"
                  withEntrance={true}
                  scrub={false}
                  className="apex-h1 red whitespace-nowrap"
                  style={{ lineHeight: "0.95" }}
                />
              </div>
              <button 
                onClick={onApplyForEntry} 
                className="apex-btn hover:scale-105 transition-all duration-300 shadow-md active:scale-95"
              >
                Get a free trial &nbsp;→
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: STRENGTH TRAINING SECTION - Slides in from right, starts blank white, heading animates, then image slices drop down */}
        <div
          ref={strengthLayerRef}
          id="services-sec"
          className="absolute inset-0 w-full h-full overflow-hidden bg-[#FAF9F6] z-20 shadow-[0_0_50px_rgba(0,0,0,0.15)] will-change-transform"
        >
          {/* Slices of image - no overlay as per guidelines */}
          <div className="absolute inset-0 z-0 flex w-full h-full overflow-hidden select-none bg-transparent">
            {Array.from({ length: sliceCount }).map((_, index) => {
              return (
                <div
                  key={index}
                  ref={(el) => {
                    slicesRef.current[index] = el;
                  }}
                  className="relative h-full overflow-hidden bg-transparent"
                  style={{
                    width: `calc(${widthPercent}% + 1px)`,
                    marginRight: "-1px",
                    willChange: "transform",
                  }}
                >
                  <img
                    ref={(el) => {
                      sliceImagesRef.current[index] = el;
                    }}
                    src="https://ftzwac4mdpz15xv4.public.blob.vercel-storage.com/ZYM/add_more_natural_light_to_202606192031.jpeg"
                    alt={`Strength Slice Component ${index + 1}`}
                    className="absolute top-0 h-full object-cover object-[72%_center] max-[1023px]:object-[72%_center] select-none"
                    style={{
                      width: "100vw",
                      maxWidth: "none",
                      left: `-${index * widthPercent}vw`,
                      willChange: "transform",
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              );
            })}
          </div>

          {/* Text Presentation overlay - with text-shadow for elegant legibility */}
          <div
            ref={textContentRef}
            className="absolute inset-0 z-10 w-full md:w-3/5 lg:w-1/2 px-8 md:px-16 lg:px-24 flex flex-col justify-end text-left items-start space-y-6 select-none pointer-events-none pb-12 sm:pb-16 md:pb-24 lg:pb-28"
          >
            <div className="animated-heading pointer-events-auto">
              <div style={{ padding: "1rem 0" }}>
                <h2 className="apex-giant-h1 flex flex-col md:block">
                  <span className="text-[#7a1c1c] inline-block">STRENGTH</span>{" "}
                  <span className="text-black inline-block">TRAINING</span>
                </h2>
              </div>
            </div>

            <div className="backdrop-blur-md bg-black/20 border border-white/10 p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[360px] pointer-events-auto flex items-center">
              <p className="animated-desc text-white font-medium text-[13px] sm:text-[14px] md:text-sm lg:text-sm leading-normal sm:leading-relaxed tracking-wide antialiased">
                Build exceptional power and mass. Train on premium Olympic platforms, Eleiko bars, custom steel plates in our state-of-the-art facility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

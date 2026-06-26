import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SequencedYogaPersonalProps {
  /** Yoga background image URL */
  yogaImageUrl: string;
  /** Personal training background image URL */
  personalImageUrl: string;
  /** ID for target scrolling */
  id?: string;
  /** Height in vh for the overall scroll trigger container. Default 400. */
  scrollHeightVh?: number;
}

export default function SequencedYogaPersonalReveal({
  yogaImageUrl,
  personalImageUrl,
  id,
  scrollHeightVh = 400,
}: SequencedYogaPersonalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Yoga DOM refs
  const yogaFrameRef = useRef<HTMLDivElement>(null);
  const yogaImageRef = useRef<HTMLImageElement>(null);
  const yogaContentRef = useRef<HTMLDivElement>(null);

  // Personal Training DOM refs
  const personalFrameRef = useRef<HTMLDivElement>(null);
  const personalImageRef = useRef<HTMLImageElement>(null);
  const personalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pin = pinRef.current;
      if (!pin) return;

      const irisState = { yogaRadius: 0, personalRadius: 0 };

      const setYogaClip = (r: number) => {
        if (yogaFrameRef.current) {
          yogaFrameRef.current.style.clipPath = `circle(${r}% at 50% 50%)`;
        }
      };

      const setPersonalClip = (r: number) => {
        if (personalFrameRef.current) {
          personalFrameRef.current.style.clipPath = `circle(${r}% at 50% 50%)`;
        }
      };

      // 1. Set up initial states
      setYogaClip(0);
      setPersonalClip(0);
      
      gsap.set(yogaImageRef.current, { scale: 1 });
      gsap.set(yogaContentRef.current, { opacity: 0, y: 30 });

      gsap.set(personalImageRef.current, { scale: 1 });
      gsap.set(personalContentRef.current, { opacity: 0, y: 40 });

      // Create the master scroll-driven timeline
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pin,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // ==========================================
      // PHASE 1: YOGA & MOBILITY REVEAL (0% to 45% scroll)
      // ==========================================
      
      // Expand circle to reveal Yoga background
      mainTimeline.to(
        irisState,
        {
          yogaRadius: 140,
          ease: "power2.inOut",
          onUpdate: () => setYogaClip(irisState.yogaRadius),
        },
        0
      );

      // Subtle zoom on Yoga background image
      mainTimeline.to(
        yogaImageRef.current,
        {
          scale: 1.15,
          ease: "power1.inOut",
        },
        0
      );

      // Fade in Yoga texts as the iris finishes opening (0.15 to 0.35)
      mainTimeline.to(
        yogaContentRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
        },
        0.18
      );

      // Keep Yoga resting/visible up to 0.45, then fade it out (0.45 to 0.55)
      mainTimeline.to(
        yogaContentRef.current,
        {
          opacity: 0,
          y: -40,
          ease: "power2.in",
        },
        0.45
      );

      // ==========================================
      // PHASE 2: PERSONAL TRAINING IRIS REVEAL (50% to 100% scroll)
      // ==========================================
      
      // Expand circle to reveal Personal Training background over the Yoga layer
      mainTimeline.to(
        irisState,
        {
          personalRadius: 140,
          ease: "power2.inOut",
          onUpdate: () => setPersonalClip(irisState.personalRadius),
        },
        0.5
      );

      // Zoom in inner image inside Personal Training frame for perspective depth
      mainTimeline.to(
        personalImageRef.current,
        {
          scale: 1.15,
          ease: "power1.inOut",
        },
        0.5
      );

      // Fade in/slide up Personal Training texts as the frame fills the screen (0.75 to 0.95)
      mainTimeline.to(
        personalContentRef.current,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
        },
        0.75
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id={id}
      className="relative w-full bg-white"
      style={{ height: `${scrollHeightVh}vh` }}
    >
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-white"
      >
        {/* ==========================================
            YOGA LAYER (IRIS REVEAL)
            ========================================== */}
        <div
          ref={yogaFrameRef}
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ willChange: "clip-path" }}
        >
          <img
            ref={yogaImageRef}
            src={yogaImageUrl}
            referrerPolicy="no-referrer"
            alt="Yoga & Mobility"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ willChange: "transform" }}
          />

          {/* Yoga texts */}
          <div
            ref={yogaContentRef}
            className="absolute inset-0 z-10 w-full h-full pointer-events-none"
          >
            <div className="w-full md:w-3/5 lg:w-1/2 h-full px-8 md:px-16 lg:px-24 flex flex-col justify-between text-left pointer-events-auto pt-16 md:pt-[6%] pb-12 sm:pb-16 md:pb-24 lg:pb-28">
              <div className="flex flex-col items-start select-none">
                <h2 className="apex-h1 red whitespace-nowrap !text-[4.5rem] sm:!text-[5.8rem] md:!text-[7.8vw] lg:!text-[7.0vw] xl:!text-[7.6vw] leading-none">Yoga</h2>
                <h3 className="font-['Oswald'] font-black text-black uppercase text-[2.8rem] sm:text-[4rem] md:text-[5.8vw] lg:text-[5.4vw] xl:text-[5.8vw] mt-1 sm:mt-2 leading-none">& Mobility</h3>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3 select-none">
                  <div className="w-10 h-1 bg-[#fc5404] flex-shrink-0" />
                  <p className="text-[10px] md:text-xs font-sans font-bold tracking-wider text-black uppercase leading-none drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]">
                    <span className="text-black">RESTORE RANGE. STRENGTHEN CORE.</span> <span className="text-[#fc5404] font-extrabold">CALM MIND.</span>
                  </p>
                </div>

                {/* Description glass card */}
                <div className="backdrop-blur-md bg-black/25 border border-white/10 p-3 sm:p-3.5 rounded-xl shadow-lg max-w-xs sm:max-w-[280px] md:max-w-[320px] transform max-[#1023px]:translate-y-8 max-[#1023px]:-translate-x-5">
                  <p className="text-white text-[13px] sm:text-[14px] md:text-sm text-left font-medium leading-relaxed antialiased">
                    Elevate your range of motion and nervous system recovery. Our acoustic-isolated yoga sanctuary offers serene, professionally guided restorative training.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            PERSONAL TRAINING LAYER (IRIS REVEAL)
            ========================================== */}
        <div
          ref={personalFrameRef}
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ willChange: "clip-path" }}
        >
          <img
            ref={personalImageRef}
            src={personalImageUrl}
            referrerPolicy="no-referrer"
            alt="Personal Training"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ willChange: "transform" }}
          />

          {/* Personal training texts */}
          <div
            ref={personalContentRef}
            className="absolute inset-0 z-10 w-full h-full pointer-events-none"
          >
            <div className="w-full md:w-3/5 lg:w-1/2 h-full px-8 max-[#1023px]:px-5 md:px-16 lg:px-24 flex flex-col justify-between text-left pointer-events-auto max-[#1023px]:-translate-x-3 pt-16 md:pt-[6%] pb-12 sm:pb-16 md:pb-24 lg:pb-28">
              <button className="hidden pointer-events-none" />
              <div className="select-none">
                <h2 className="apex-h1 !text-[#7a1c1c] whitespace-nowrap !text-[3.5rem] sm:!text-[4.5rem] md:!text-[6vw] lg:!text-[7.2vw] xl:!text-[7.5vw] leading-none">Personal</h2>
                <h3 className="font-['Oswald'] font-extrabold !text-white uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl max-[#1023px]:!text-2xl mt-2 leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">Training</h3>
              </div>

              <div className="flex flex-col space-y-4">
                {/* Tagline placed in-between */}
                <div className="flex items-center gap-3 select-none my-4">
                  <div className="w-10 h-1 bg-[#fc5404] flex-shrink-0" />
                  <p className="text-[10px] md:text-sm font-sans font-bold tracking-wider text-white uppercase leading-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                    <span className="text-white">OPTIMIZE METABOLICS. LOCK IN</span> <span className="text-[#fc5404] font-extrabold">TRUE POWER.</span>
                  </p>
                </div>

                {/* Description glass card */}
                <div className="backdrop-blur-md bg-black/25 border border-white/10 p-3.5 sm:p-4.5 rounded-xl shadow-lg max-w-sm max-[#1023px]:max-w-[190px]">
                  <p className="text-white text-xs sm:text-sm md:text-base max-sm:text-[13px] max-[#1023px]:text-[14px] font-medium leading-relaxed max-[#1023px]:leading-normal antialiased">
                    Obtain customized athletic programming, biomechanical analysis, and periodic composition analytics guided by expert physiology coaches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

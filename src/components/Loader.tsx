import React, { useEffect, useState } from "react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [percent, setPercent] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Check session storage to see if loader was already shown
    const hasLoaded = sessionStorage.getItem("apex-gym-loaded");
    if (hasLoaded) {
      onComplete();
      setIsMounted(false);
      return;
    }

    // Lock scroll
    document.body.style.overflow = "hidden";

    const duration = 2000; // 2 seconds counting
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextPercent = Math.min(Math.round((currentStep / steps) * 100), 100);
      setPercent(nextPercent);

      if (nextPercent >= 100) {
        clearInterval(timer);
        // Trigger split animation
        setTimeout(() => {
          setIsFinishing(true);
          sessionStorage.setItem("apex-gym-loaded", "true");
          
          // Complete transition and unlock scroll
          setTimeout(() => {
            document.body.style.overflow = "";
            onComplete();
            setIsMounted(false);
          }, 800); // matches the sliding animation duration
        }, 300);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      {/* Top Half Panel */}
      <div
        id="loader-top-panel"
        className="absolute top-0 left-0 w-full h-[50.5vh] bg-[#faf9f6] transition-transform duration-700 ease-out flex items-end justify-center overflow-hidden pointer-events-auto"
        style={{
          transform: isFinishing ? "translateY(-100%)" : "translateY(0%)",
        }}
      >
        <div
          className="text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-white bg-clip-text font-display opacity-90 select-none"
          style={{
            WebkitTextStroke: "2px rgba(180, 140, 42, 0.5)",
            transform: `translateY(50%) scale(${1 + percent * 0.002})`,
          }}
        >
          APEX
        </div>
      </div>

      {/* Bottom Half Panel */}
      <div
        id="loader-bottom-panel"
        className="absolute bottom-0 left-0 w-full h-[50.5vh] bg-[#faf9f6] transition-transform duration-700 ease-out flex items-start justify-center overflow-hidden pointer-events-auto border-t border-neutral-100"
        style={{
          transform: isFinishing ? "translateY(100%)" : "translateY(0%)",
        }}
      >
        <div
          className="text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-neutral-900 font-display opacity-90 select-none"
          style={{
            transform: `translateY(-50%) scale(${1 + percent * 0.002})`,
          }}
        >
          APEX
        </div>

        {/* Counter bottom-right */}
        <div
          id="loader-counter"
          className="absolute bottom-12 right-12 md:bottom-16 md:right-16 text-right font-display text-neutral-800 transition-opacity duration-300"
          style={{ opacity: isFinishing ? 0 : 1 }}
        >
          <span className="text-xl md:text-2xl text-neutral-400 mr-2 tracking-wider">L O A D I N G</span>
          <span className="text-6xl md:text-8xl font-black text-gold block ml-2">
            {percent.toString().padStart(3, "0")}
          </span>
        </div>

        {/* Dynamic progress bar line */}
        <div
          className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-cyan via-neon to-gold transition-all duration-100"
          style={{
            width: `${percent}%`,
            opacity: isFinishing ? 0 : 1,
          }}
        />
      </div>
    </div>
  );
}

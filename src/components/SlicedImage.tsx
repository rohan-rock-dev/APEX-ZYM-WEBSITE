import React, { useEffect, useRef, useState } from "react";

interface SlicedImageProps {
  id?: string;
  className?: string;
  technique?: "diagonal" | "split-halves" | "horizontal-halves";
  placeholderType: "hero" | "experience";
  imageUrl?: string;
  alt?: string;
}

export default function SlicedImage({
  id,
  className = "",
  technique = "diagonal",
  placeholderType,
  imageUrl,
  alt = ""
}: SlicedImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Renders either the real photo (if imageUrl is passed) or the SVG placeholder
  const renderContent = () => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
      );
    }
    return renderSVGPlaceholder();
  };

  const renderSVGPlaceholder = () => {
    if (placeholderType === "hero") {
      return (
        <svg
          className="w-full h-full min-h-[400px] md:min-h-[600px] select-none"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hero-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#7209b7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ff006e" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="gold-neon" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#ff006e" />
              <stop offset="100%" stopColor="#00b4d8" />
            </linearGradient>
            <pattern id="grid-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="rgba(0,0,0,0.08)" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="#ffffff" />
          <rect width="800" height="600" fill="url(#hero-grad-1)" />
          <rect width="800" height="600" fill="url(#grid-dots)" />
          <path d="M 100 0 L 500 600" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" />
          <path d="M 600 0 L 200 600" stroke="rgba(0, 180, 216, 0.2)" strokeWidth="2" />
          <path d="M 0 300 H 800" stroke="rgba(255, 0, 110, 0.1)" strokeWidth="1" />
          <polygon points="400,100 650,220 580,480 320,400" fill="rgba(0, 180, 216, 0.03)" stroke="url(#gold-neon)" strokeWidth="1.5" />
          <g transform="translate(250, 150) scale(0.9)" opacity="0.95">
            <line x1="50" y1="120" x2="250" y2="120" stroke="#d4af37" strokeWidth="6" strokeLinecap="round" />
            <rect x="35" y="100" width="15" height="40" rx="3" fill="#111111" />
            <rect x="250" y="100" width="15" height="40" rx="3" fill="#111111" />
            <circle cx="260" cy="120" r="12" fill="#ff006e" />
            <circle cx="40" cy="120" r="12" fill="#00b4d8" />
            <path d="M 148 120 L 150 220 L 110 320" stroke="#111111" strokeWidth="14" strokeLinecap="round" strokeJoin="round" />
            <path d="M 150 220 L 190 320" stroke="#111111" strokeWidth="14" strokeLinecap="round" strokeJoin="round" />
            <path d="M 152 140 L 98 120" stroke="#00b4d8" strokeWidth="11" strokeLinecap="round" />
            <path d="M 148 140 L 202 120" stroke="#ff006e" strokeWidth="11" strokeLinecap="round" />
            <circle cx="150" cy="100" r="18" fill="#111111" />
          </g>
          <text x="50" y="100" fill="rgba(212, 175, 55, 0.15)" fontSize="72" fontWeight="900" fontFamily="Outfit">APEX</text>
          <text x="500" y="520" fill="rgba(0, 180, 216, 0.08)" fontSize="72" fontWeight="900" fontFamily="Outfit">ATHLETICS</text>
        </svg>
      );
    } else {
      return (
        <svg
          className="w-full h-full min-h-[400px] select-none"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="exp-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#faf9f6" />
              <stop offset="100%" stopColor="#7209b7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="neon-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff006e" />
              <stop offset="100%" stopColor="#00b4d8" />
            </linearGradient>
          </defs>
          <rect width="600" height="500" fill="url(#exp-grad)" />
          <path d="M 100 0 L 180 500" fill="none" stroke="rgba(255, 0, 110, 0.04)" strokeWidth="60" />
          <path d="M 450 0 L 380 500" fill="none" stroke="rgba(0, 180, 216, 0.04)" strokeWidth="70" />
          <line x1="0" y1="400" x2="600" y2="400" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1.5" />
          <line x1="0" y1="410" x2="600" y2="410" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1" />
          <g transform="translate(150, 160) scale(1.1)">
            <path d="M 50 150 L 250 150" stroke="#bbb" strokeWidth="8" strokeLinecap="round" />
            <path d="M 60 150 L 50 250" stroke="#999" strokeWidth="10" />
            <path d="M 240 150 L 250 250" stroke="#999" strokeWidth="10" />
            <g transform="translate(100, 100)">
              <rect x="15" y="12" width="50" height="8" fill="#555" rx="2" />
              <rect x="0" y="0" width="15" height="32" fill="#d4af37" rx="3" />
              <rect x="65" y="0" width="15" height="32" fill="#d4af37" rx="3" />
              <rect x="5" y="4" width="6" height="24" fill="#333" rx="1" />
              <rect x="69" y="4" width="6" height="24" fill="#333" rx="1" />
            </g>
            <g transform="translate(180, 95) rotate(5)">
              <rect x="15" y="12" width="50" height="8" fill="#333" rx="2" stroke="url(#neon-glow)" strokeWidth="1" />
              <rect x="0" y="0" width="15" height="32" fill="url(#neon-glow)" rx="3" />
              <rect x="65" y="0" width="15" height="32" fill="url(#neon-glow)" rx="3" />
            </g>
          </g>
          <rect x="420" y="50" width="130" height="36" rx="18" fill="rgba(0,0,0,0.03)" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />
          <circle cx="438" cy="68" r="5" fill="#ff006e" />
          <text x="452" y="73" fill="#111111" fontSize="11" fontFamily="Inter" fontWeight="605" letterSpacing="1">EST. 2026</text>
        </svg>
      );
    }
  };

  // ===== NEW: Horizontal halves (top/bottom) technique =====
  if (technique === "horizontal-halves") {
    return (
      <div
        id={id}
        ref={containerRef}
        className={`relative overflow-hidden w-full h-full bg-white ${className}`}
      >
        {/* TOP HALF */}
        <div
          className="absolute top-0 left-0 w-full h-1/2 overflow-hidden"
          style={{
            transform: isVisible ? "translateY(0%)" : "translateY(-110%)",
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10,
          }}
        >
          <div
            className="absolute top-0 left-0 w-full h-[200%]"
            style={{
              transform: isVisible ? "translateY(0%)" : "translateY(8%)",
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {renderContent()}
          </div>
        </div>

        {/* BOTTOM HALF */}
        <div
          className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden"
          style={{
            transform: isVisible ? "translateY(0%)" : "translateY(110%)",
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 10,
          }}
        >
          <div
            className="absolute bottom-0 left-0 w-full h-[200%]"
            style={{
              transform: isVisible ? "translateY(0%)" : "translateY(-8%)",
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  // Diagonal strips (Technique 4)
  if (technique === "diagonal") {
    return (
      <div
        id={id}
        ref={containerRef}
        className={`relative overflow-hidden w-full h-full rounded bg-white border border-neutral-100 shadow-xl ${className}`}
        style={{ minHeight: placeholderType === "hero" ? "450px" : "380px" }}
      >
        {[0, 1, 2, 3, 4].map((index) => {
          const isOdd = index % 2 !== 0;
          const initialTranslateY = isOdd ? "-105%" : "105%";
          const currentTranslateY = isVisible ? "0%" : initialTranslateY;
          const innerTranslateY = isVisible ? "0%" : isOdd ? "60%" : "-60%";

          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full strip-${index} overflow-hidden`}
              style={{
                transform: `translate3d(0, ${currentTranslateY}, 0)`,
                transition: `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
                zIndex: 10 + index,
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center bg-white"
                style={{
                  transform: `translate3d(0, ${innerTranslateY}, 0) scale(1.04)`,
                  transition: `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
                }}
              >
                {renderContent()}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback: split-halves (left/right)
  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full rounded bg-white border border-neutral-100 shadow-xl flex ${className}`}
      style={{ minHeight: "380px" }}
    >
      <div
        className="w-1/2 h-full overflow-hidden absolute top-0 left-0"
        style={{
          transform: isVisible ? "translateX(0%)" : "translateX(-100%)",
          transition: "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)",
          zIndex: 10,
        }}
      >
        <div
          className="w-[200%] h-full absolute top-0 left-0 bg-white"
          style={{
            transform: isVisible ? "translateX(0%)" : "translateX(30%)",
            transition: "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        >
          {renderContent()}
        </div>
      </div>

      <div
        className="w-1/2 h-full overflow-hidden absolute top-0 right-0"
        style={{
          transform: isVisible ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)",
          zIndex: 10,
        }}
      >
        <div
          className="w-[200%] h-full absolute top-0 right-0 bg-[#faf9f6]"
          style={{
            transform: isVisible ? "translateX(-50%)" : "translateX(-80%)",
            transition: "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true);
  const [hoverType, setHoverType] = useState<"none" | "interactive" | "image">("none");
  const [isClicked, setIsClicked] = useState(false);

  // Position references
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if touch device
    const checkMobile = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch);
      if (!isTouch) {
        document.body.classList.add("custom-cursor-active");
      }
    };

    checkMobile();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Update inner dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    // Global delegation for hover types
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if target or parent is interactive
      const isAnchor = target.closest("a");
      const isButton = target.closest("button");
      const isInput = target.closest("input, select, textarea");
      const isInteractiveCard = target.closest(".interactive-hover");

      if (isAnchor || isButton || isInput || isInteractiveCard) {
        setHoverType("interactive");
        return;
      }

      // Check if target is an image card or contains lazy-loaded images
      const isImage = target.tagName === "IMG" || target.closest(".image-hover-trigger");
      if (isImage) {
        setHoverType("image");
        return;
      }

      setHoverType("none");
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);

    // Lerping for outer ring using requestAnimationFrame
    let animationFrameId: number;
    const lerpRing = () => {
      const ring = ringRef.current;
      const mouse = mouseRef.current;

      // Simple linear interpolation
      const targetX = mouse.x;
      const targetY = mouse.y;

      ring.x += (targetX - ring.x) * 0.12;
      ring.y += (targetY - ring.y) * 0.12;

      if (ringElementRef.current) {
        ringElementRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(lerpRing);
    };

    animationFrameId = requestAnimationFrame(lerpRing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (isMobile) return null;

  // Render cursor elements
  return (
    <>
      {/* Inner Dot */}
      <div
        id="custom-dot"
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%)`,
          transition: "transform 0.05s ease-out, scale 0.2s ease",
          scale: isClicked ? "0.75" : "1",
        }}
      />

      {/* Outer Ring */}
      <div
        id="custom-ring"
        ref={ringElementRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center transition-all duration-300 ease-out border"
        style={{
          transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%)`,
          width: hoverType === "interactive" ? "64px" : hoverType === "image" ? "80px" : "36px",
          height: hoverType === "interactive" ? "64px" : hoverType === "image" ? "80px" : "36px",
          borderColor: hoverType === "interactive" ? "#ff006e" : hoverType === "image" ? "#00b4d8" : "#d4af37",
          backgroundColor: hoverType === "interactive" ? "rgba(255, 255, 255, 0.05)" : hoverType === "image" ? "rgba(0, 180, 216, 0.1)" : "transparent",
          scale: isClicked ? "0.8" : "1",
        }}
      >
        {hoverType === "image" && (
          <span className="text-[10px] font-display uppercase tracking-widest text-cyan font-bold animate-[spin_8s_linear_infinite]">
            VIEW •
          </span>
        )}
      </div>
    </>
  );
}

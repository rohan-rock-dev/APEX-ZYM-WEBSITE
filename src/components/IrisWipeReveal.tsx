import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * IrisWipeReveal
 * ---------------------------------------------------------
 * A reusable scroll-driven "circular iris" reveal effect.
 *
 * How it works:
 * 1. The background image is masked behind a circular clip-path.
 * 2. The circle starts very small (or fully closed) at a chosen
 *    origin point (center, or anywhere you want, e.g. a button).
 * 3. On scroll, the circle radius expands until it covers the
 *    whole viewport, like a camera iris/aperture opening or a
 *    spotlight widening to reveal the full image.
 * 4. Optionally, the image can also zoom slightly as the iris
 *    opens, for extra depth.
 *
 * Usage:
 *   <IrisWipeReveal imageUrl="/my-image.jpg">
 *     <h1>Any heading or content here</h1>
 *   </IrisWipeReveal>
 *
 * Drop this into ANY section — hero, about, project intro, etc.
 * Each instance pins independently and is fully self-contained.
 */

export interface IrisWipeRevealProps {
  /** Background image to reveal. Required. */
  imageUrl: string;

  /** Total scroll distance for the whole effect, in vh. Default 200. */
  scrollHeightVh?: number;

  /** Horizontal origin of the iris, in % of viewport width. Default 50 (center). */
  originX?: number;

  /** Vertical origin of the iris, in % of viewport height. Default 50 (center). */
  originY?: number;

  /** Starting circle radius in %, relative to the diagonal needed to fill the screen. Default 0 (fully closed). */
  startRadius?: number;

  /** Ending circle radius in %. Default 150 (overshoots viewport so corners are fully covered). */
  endRadius?: number;

  /** Whether the inner image should zoom slightly as the iris opens. Default true. */
  zoomImage?: boolean;

  /** Final scale of the inner image if zoomImage is true. Default 1.1. */
  zoomScale?: number;

  /** GSAP scrub smoothing value. Lower = snappier, higher = laggier/smoother. Default 0.4. */
  scrub?: number;

  /** Easing for the radius expansion. Default "power2.inOut". */
  ease?: string;

  /** Called with scroll progress (0-1) on every update. */
  onProgress?: (progress: number) => void;

  /** Content to render on top of the image (heading, button, etc). Optional. */
  children?: React.ReactNode;

  /** Extra className for the outer wrapper. */
  className?: string;

  /** HTML id for the outer wrapper. */
  id?: string;

  /** Background color shown outside the circle before it expands. Default white. */
  backgroundColor?: string;
}

export default function IrisWipeReveal({
  imageUrl,
  scrollHeightVh = 200,
  originX = 50,
  originY = 50,
  startRadius = 0,
  endRadius = 150,
  zoomImage = true,
  zoomScale = 1.1,
  scrub = 0.4,
  ease = "power2.inOut",
  onProgress,
  children,
  className = "",
  id,
  backgroundColor = "#ffffff",
}: IrisWipeRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const circleRadiusRef = useRef({ value: startRadius });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const img = imageRef.current;
      const pin = pinRef.current;
      if (!pin) return;

      // 1. Initial state: circle closed at the chosen origin point
      const setClip = (radius: number) => {
        pin.style.clipPath = `circle(${radius}% at ${originX}% ${originY}%)`;
      };
      setClip(startRadius);
      circleRadiusRef.current.value = startRadius;

      if (img) {
        gsap.set(img, { scale: zoomImage ? 1 : zoomScale });
      }

      // 2. Master scrubbed timeline pinned to this section
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin,
          scrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            onProgress?.(self.progress);
          },
        },
      });

      // Part A: Expand the iris radius
      masterTl.to(
        circleRadiusRef.current,
        {
          value: endRadius,
          ease,
          onUpdate: () => setClip(circleRadiusRef.current.value),
        },
        0
      );

      // Part B (optional): Subtle zoom on the image as the iris opens
      if (zoomImage && img) {
        masterTl.to(
          img,
          {
            scale: zoomScale,
            ease: "power1.inOut",
          },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originX, originY, startRadius, endRadius, zoomImage, zoomScale, scrub, ease, onProgress]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: `${scrollHeightVh}vh`, backgroundColor }}
    >
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center animate-none"
        style={{ backgroundColor }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          referrerPolicy="no-referrer"
          alt=""
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {children && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

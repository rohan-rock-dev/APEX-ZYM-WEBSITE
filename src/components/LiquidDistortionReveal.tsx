import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * LiquidDistortionReveal
 * ---------------------------------------------------------
 * A reusable scroll-driven "liquid melt" distortion effect.
 *
 * How it works:
 * 1. The background image sits inside an SVG <filter> built from
 *    feTurbulence (organic noise) + feDisplacementMap (warps the
 *    image using that noise as a height map).
 * 2. On scroll, the displacement "scale" (how strongly the image
 *    is warped) animates from a high value (heavily rippled/melted)
 *    down to 0 (perfectly sharp) — or the reverse, sharp to melted.
 * 3. The turbulence's seed/baseFrequency can also drift slowly over
 *    time for a living, liquid feel rather than a static ripple.
 *
 * This is pure SVG filter + GSAP — no WebGL/Three.js required, so
 * it's lightweight and works in any React project with gsap installed.
 *
 * Usage:
 *   <LiquidDistortionReveal imageUrl="/my-image.jpg">
 *     <h1>Any heading or content here</h1>
 *   </LiquidDistortionReveal>
 *
 * Drop this into ANY section — hero, about, project intro, etc.
 * Each instance pins independently and is fully self-contained.
 */

export interface LiquidDistortionRevealProps {
  /** Background image to distort. Required. */
  imageUrl: string;

  /** Total scroll distance for the whole effect, in vh. Default 200. */
  scrollHeightVh?: number;

  /** Direction of the effect: "settle" = starts melted, resolves to sharp (default). "melt" = starts sharp, melts as you scroll. */
  direction?: "settle" | "melt";

  /** Maximum displacement strength (how warped the image looks at its most distorted). Default 80. */
  maxDisplacement?: number;

  /** Turbulence base frequency — lower = larger, smoother liquid blobs; higher = finer ripples. Default 0.01. */
  baseFrequency?: number;

  /** Number of turbulence octaves — more = more organic detail, costs a little more perf. Default 3. */
  octaves?: number;

  /** Whether the turbulence pattern should slowly animate/drift on its own (independent of scroll) for a "living liquid" feel. Default true. */
  ambientDrift?: boolean;

  /** Speed of the ambient drift animation in seconds per loop. Default 12. */
  driftDuration?: number;

  /** Whether the inner image should also zoom slightly during the effect. Default true. */
  zoomImage?: boolean;

  /** Final/peak scale of the inner image if zoomImage is true. Default 1.12. */
  zoomScale?: number;

  /** GSAP scrub smoothing value. Lower = snappier, higher = laggier/smoother. Default 0.5. */
  scrub?: number;

  /** Called with scroll progress (0-1) on every update. */
  onProgress?: (progress: number) => void;

  /** Content to render on top of the image (heading, button, etc). Optional. */
  children?: React.ReactNode;

  /** Optional HTML element ID */
  id?: string;

  /** Extra className for the outer wrapper. */
  className?: string;

  /** Background color shown behind the image. Default white. */
  backgroundColor?: string;
}

let filterIdCounter = 0;

export default function LiquidDistortionReveal({
  imageUrl,
  scrollHeightVh = 200,
  direction = "settle",
  maxDisplacement = 80,
  baseFrequency = 0.01,
  octaves = 3,
  ambientDrift = true,
  driftDuration = 12,
  zoomImage = true,
  zoomScale = 1.12,
  scrub = 0.5,
  onProgress,
  children,
  id,
  className = "",
  backgroundColor = "#ffffff",
}: LiquidDistortionRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  // Stable unique filter id so multiple instances on one page don't collide
  const filterId = useRef(`liquid-distort-${filterIdCounter++}`).current;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const img = imageRef.current;
      const displace = displaceRef.current;
      const turbulence = turbulenceRef.current;
      if (!displace) return;

      const startVal = direction === "settle" ? maxDisplacement : 0;
      const endVal = direction === "settle" ? 0 : maxDisplacement;

      const displacementRef = { value: startVal };
      displace.setAttribute("scale", String(startVal));

      if (img) {
        gsap.set(img, { scale: zoomImage ? (direction === "settle" ? zoomScale : 1) : 1 });
      }

      // 1. Master scrubbed timeline pinned to this section
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          scrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            onProgress?.(self.progress);
          },
        },
      });

      masterTl.to(
        displacementRef,
        {
          value: endVal,
          ease: "power2.inOut",
          onUpdate: () => displace.setAttribute("scale", String(displacementRef.value)),
        },
        0
      );

      if (zoomImage && img) {
        masterTl.to(
          img,
          {
            scale: direction === "settle" ? 1 : zoomScale,
            ease: "power1.inOut",
          },
          0
        );
      }

      // 2. Ambient drift: slowly animate the turbulence seed/frequency
      // independent of scroll, so the liquid feels alive even when
      // the user pauses mid-scroll.
      if (ambientDrift && turbulence) {
        const driftObj = { seed: 0 };
        gsap.to(driftObj, {
          seed: 20,
          duration: driftDuration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          onUpdate: () => {
            turbulence.setAttribute("seed", String(driftObj.seed));
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, maxDisplacement, baseFrequency, octaves, ambientDrift, driftDuration, zoomImage, zoomScale, scrub, onProgress]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{ height: `${scrollHeightVh}vh`, backgroundColor }}
    >
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor }}
      >
        {/* SVG filter definition — invisible, just declares the distortion */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency={baseFrequency}
                numOctaves={octaves}
                seed={0}
                result="turbulence"
              />
              <feDisplacementMap
                ref={displaceRef}
                in="SourceGraphic"
                in2="turbulence"
                scale={0}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <img
          ref={imageRef}
          src={imageUrl}
          referrerPolicy="no-referrer"
          alt=""
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          style={{ filter: `url(#${filterId})` }}
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

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GradientColorSweep
 * ---------------------------------------------------------
 * A scroll-triggered "gradient sweep" text animation.
 *
 * How it works:
 * 1. Text starts in a muted/gray color (or fully transparent).
 * 2. As the element scrolls into view, a vivid gradient sweeps
 *    left to right across the text — like someone running a
 *    colorful spotlight or paintbrush over the words.
 * 3. This is achieved by animating the background-position of a
 *    gradient applied via background-clip: text — the gradient
 *    is much wider than the text and slides across it.
 * 4. Three sweep styles:
 *    "fill"    = gradient sweeps in and stays (text ends up colorful).
 *    "pass"    = gradient sweeps across and leaves plain text behind.
 *    "loop"    = gradient continuously sweeps left to right on loop.
 * 5. Optionally, text also fades in and rises slightly as the
 *    gradient sweeps — combining the color sweep with a subtle
 *    entrance animation.
 *
 * Usage:
 *   <GradientColorSweep text="Hello World" variant="heading" />
 *   <GradientColorSweep text="Creative Developer" sweepStyle="pass" />
 *   <GradientColorSweep text="Always moving." sweepStyle="loop" />
 *
 * Works as a drop-in text component. No pinning needed.
 */

export type SweepStyle = "fill" | "pass" | "loop";
export type GradientVariant = "heading" | "subheading" | "paragraph" | "custom";

export interface GradientColorSweepProps {
  /** The text to animate. Required. */
  text: string;

  /**
   * Sweep style:
   * "fill"  = gradient sweeps in and stays — text ends up colorful (default).
   * "pass"  = gradient sweeps across then leaves, text returns to base color.
   * "loop"  = gradient continuously sweeps left to right, never stops.
   */
  sweepStyle?: SweepStyle;

  /**
   * Visual variant:
   * "heading"    = large, bold (default).
   * "subheading" = medium.
   * "paragraph"  = normal body size.
   * "custom"     = use fontSize/fontWeight props.
   */
  variant?: GradientVariant;

  /**
   * Gradient colors (left to right).
   * Default: vivid multi-color gradient.
   * Pass 2+ CSS color strings.
   */
  gradientColors?: string[];

  /**
   * Gradient direction in degrees. Default 90 (left to right).
   * 45 = diagonal. 135 = reverse diagonal.
   */
  gradientAngle?: number;

  /**
   * Color of the text BEFORE the gradient sweeps in.
   * Default "#555555" (muted gray).
   * Pass "transparent" for a fade-in-with-color effect.
   */
  baseColor?: string;

  /**
   * Color of the text AFTER the gradient passes (for sweepStyle="pass").
   * Default "#ffffff" (fully revealed white/light).
   */
  afterColor?: string;

  /**
   * Whether the text also fades in and rises slightly as the
   * gradient sweeps. Default true.
   */
  withEntrance?: boolean;

  /**
   * Scroll progress (0–1) at which the sweep completes.
   * For sweepStyle="fill" and "pass". Default 0.7.
   */
  sweepEnd?: number;

  /**
   * Duration of the loop sweep in seconds. Only for sweepStyle="loop".
   * Default 3.
   */
  loopDuration?: number;

  /**
   * ScrollTrigger scrub value for "fill" and "pass" styles.
   * Default true (tied to scroll position).
   * Pass a number for smoothing (e.g. 0.5).
   */
  scrub?: boolean | number;

  /**
   * ScrollTrigger start. Default "top 85%".
   */
  triggerStart?: string;

  /**
   * ScrollTrigger end. Default "top 30%".
   * Only used for "fill" and "pass" styles.
   */
  triggerEnd?: string;

  /** Font size override (for variant="custom"). */
  fontSize?: string;

  /** Font weight override. */
  fontWeight?: number | string;

  /** Font family. Default inherit. */
  fontFamily?: string;

  /** Letter spacing. Default inherit. */
  letterSpacing?: string;

  /** Line height. Default 1.2. */
  lineHeight?: number | string;

  /** Text alignment. Default "left". */
  textAlign?: "left" | "center" | "right";

  /** Extra className on the outer wrapper. */
  className?: string;

  /** Extra inline styles on the outer wrapper. */
  style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<
  GradientVariant,
  { fontSize: string; fontWeight: number }
> = {
  heading:    { fontSize: "clamp(2.5rem, 8vw, 7rem)",  fontWeight: 800 },
  subheading: { fontSize: "clamp(1.4rem, 4vw, 3rem)",  fontWeight: 600 },
  paragraph:  { fontSize: "clamp(1rem, 2vw, 1.3rem)",  fontWeight: 400 },
  custom:     { fontSize: "1rem",                       fontWeight: 700 },
};

const DEFAULT_GRADIENT = [
  "#ff6b6b",
  "#ff9f43",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#c77dff",
];

export default function GradientColorSweep({
  text,
  sweepStyle = "fill",
  variant = "heading",
  gradientColors = DEFAULT_GRADIENT,
  gradientAngle = 90,
  baseColor = "#555555",
  afterColor = "#ffffff",
  withEntrance = true,
  sweepEnd = 0.7,
  loopDuration = 3,
  scrub = true,
  triggerStart = "top 85%",
  triggerEnd = "top 30%",
  fontSize,
  fontWeight,
  fontFamily = "inherit",
  letterSpacing = "inherit",
  lineHeight = 1.2,
  textAlign = "left",
  className = "",
  style,
}: GradientColorSweepProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const variantStyle = VARIANT_STYLES[variant];
  const resolvedFontSize = fontSize ?? variantStyle.fontSize;
  const resolvedFontWeight = fontWeight ?? variantStyle.fontWeight;

  // Build gradient string — make it 3x wider than needed so the
  // sweep has room to slide across the text
  const gradientString = `linear-gradient(
    ${gradientAngle}deg,
    ${gradientColors.join(", ")}
  )`;

  // The "muted to vivid" gradient used for the sweep:
  // starts with baseColor, then vivid colors, then either baseColor or afterColor
  const sweepGradientColors =
    sweepStyle === "pass"
      ? [baseColor, ...gradientColors, afterColor]
      : [baseColor, ...gradientColors];

  const sweepGradient = `linear-gradient(
    ${gradientAngle}deg,
    ${sweepGradientColors.join(", ")}
  )`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = textRef.current;
      if (!el) return;

      if (sweepStyle === "loop") {
        // Continuously looping gradient sweep — independent of scroll
        // Use a wide background (300% width) that slides left
        el.style.backgroundImage = gradientString;
        el.style.backgroundSize = "300% 100%";
        el.style.backgroundClip = "text";
        el.style.webkitBackgroundClip = "text";
        el.style.color = "transparent";
        el.style.webkitTextFillColor = "transparent";

        // Entrance: fade in from below (optional)
        if (withEntrance) {
          gsap.set(el, { opacity: 0, y: 20 });
          ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: triggerStart,
            once: true,
            onEnter: () => {
              gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
            },
          });
        }

        // Continuously animate backgroundPosition
        gsap.to(el, {
          backgroundPosition: "100% 0%",
          duration: loopDuration,
          repeat: -1,
          ease: "none",
        });

        return;
      }

      // "fill" and "pass" modes — scroll-driven or time-driven sweep
      // Technique: use a very wide background (400% of text width)
      // and animate its position from off-left to center/right
      const colorCount = sweepGradientColors.length;
      const bgWidth = `${colorCount * 100}%`;

      el.style.backgroundImage = sweepGradient;
      el.style.backgroundSize = `${bgWidth} 100%`;
      el.style.backgroundClip = "text";
      el.style.webkitBackgroundClip = "text";
      el.style.color = "transparent";
      el.style.webkitTextFillColor = "transparent";

      // Start: background positioned so only the first color (baseColor) shows
      gsap.set(el, {
        backgroundPosition: "0% 0%",
        opacity: withEntrance ? 0 : 1,
        y: withEntrance ? 24 : 0,
      });

      if (scrub === false) {
        // Time-based smooth sweep on view enter - perfect for hero elements!
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: triggerStart,
          once: true,
          onEnter: () => {
            gsap.to(el, {
              backgroundPosition: "100% 0%",
              opacity: 1,
              y: 0,
              duration: 1.6,
              ease: "power2.out",
            });
          },
        });
      } else {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: triggerStart,
          end: triggerEnd,
          scrub,
          onUpdate: (self) => {
            const p = Math.min(self.progress / sweepEnd, 1);

            // Animate backgroundPosition from 0% to 100%
            // (slides the gradient across so vivid colors pass over text)
            el.style.backgroundPosition = `${p * 100}% 0%`;

            // Entrance fade
            if (withEntrance) {
              el.style.opacity = String(Math.min(p * 2, 1));
              el.style.transform = `translateY(${(1 - Math.min(p * 2, 1)) * 24}px)`;
            }
          },
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    text, sweepStyle, gradientColors, gradientAngle,
    baseColor, afterColor, withEntrance, sweepEnd,
    loopDuration, scrub, triggerStart, triggerEnd,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        fontSize: resolvedFontSize,
        fontWeight: resolvedFontWeight,
        fontFamily,
        letterSpacing,
        lineHeight,
        textAlign,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        ref={textRef}
        style={{
          display: "inline-block",
          width: "100%",
          willChange: "background-position, opacity, transform",
        }}
      >
        {text}
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface GridMosaicRevealProps {
  /** Background image to slice into a grid. Required. */
  imageUrl: string;

  /** Number of rows in the grid. Default 5. */
  rows?: number;

  /** Number of columns in the grid. Default 6. */
  cols?: number;

  /** Total scroll distance for the whole effect, in vh. Default 250. */
  scrollHeightVh?: number;

  /** How tiles animate in: "stagger" (sequential wave) or "random" (random order). Default "stagger". */
  pattern?: "stagger" | "random";

  /** Stagger delay (seconds) between each tile's reveal when pattern="stagger". Default 0.015. */
  tileStagger?: number;

  /** Scroll progress (0-1) span over which tiles assemble. Default ends at 0.6. */
  assembleEnd?: number;

  /** Starting scale for hidden tiles (e.g. 0.4 = tiles start small and grow). Default 0.6. */
  startScale?: number;

  /** Whether tiles should fade back out near the end of scroll to reveal content underneath. Default false. */
  dissolveAtEnd?: boolean;

  /** Scroll progress (0-1) at which the dissolve-out starts, if dissolveAtEnd is true. Default 0.8. */
  dissolveStart?: number;

  /** GSAP scrub smoothing value. Lower = snappier, higher = laggier/smoother. Default 0.4. */
  scrub?: number;

  /** Called with scroll progress (0-1) on every update. */
  onProgress?: (progress: number) => void;

  /** Content to render on top of the grid (heading, button, etc). Optional. */
  children?: React.ReactNode;

  /** Extra className for the outer wrapper. */
  className?: string;

  /** Background color shown behind the grid/tiles. Default white. */
  backgroundColor?: string;

  /** Gap between tiles in px, for a "grout line" look. Default 0 (seamless). */
  tileGap?: number;

  /** HTML element ID */
  id?: string;
}

export default function GridMosaicReveal({
  imageUrl,
  rows = 5,
  cols = 6,
  scrollHeightVh = 250,
  pattern = "stagger",
  tileStagger = 0.015,
  assembleEnd = 0.6,
  startScale = 0.6,
  dissolveAtEnd = false,
  dissolveStart = 0.8,
  scrub = 0.4,
  onProgress,
  children,
  className = "",
  backgroundColor = "#ffffff",
  tileGap = 0,
  id,
}: GridMosaicRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isCompact, setIsCompact] = React.useState(false);
  const [isLaptop, setIsLaptop] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 1024, height: 768 });
  const [imageAspect, setImageAspect] = React.useState(16 / 9); // default fallback

  React.useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth < 1024;
      setIsCompact(compact);
      setIsLaptop(!compact);
      if (pinRef.current) {
        setDimensions({
          width: pinRef.current.clientWidth,
          height: pinRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Also update when ScrollTrigger refreshes to be super accurate
    ScrollTrigger.addEventListener("refresh", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.removeEventListener("refresh", handleResize);
    };
  }, []);

  // Fetch image natural aspect ratio dynamically to be 100% bug-free and responsive
  React.useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setImageAspect(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [imageUrl]);

  const actualCols = isCompact ? 4 : cols;
  const tileCount = rows * actualCols;
  const tilesArray = React.useMemo(
    () => Array.from({ length: tileCount }),
    [tileCount]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tiles = tilesRef.current.filter((t) => t !== null) as HTMLDivElement[];
      if (tiles.length === 0) return;

      // 1. Initial state: tiles hidden, scaled down
      gsap.set(tiles, { opacity: 0, scale: startScale, transformOrigin: "center center" });

      // Determine the reveal order
      const order = tiles.map((_, i) => i);
      if (pattern === "random") {
        // Fisher-Yates shuffle for a randomized but deterministic-per-mount order
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
      }
      const orderedTiles = order.map((i) => tiles[i]);

      // 2. Master scrubbed timeline pinned to this section
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

      // Part A: Assemble tiles (fade + scale in)
      masterTl.to(
        orderedTiles,
        {
          opacity: 1,
          scale: 1,
          stagger: tileStagger,
          ease: "power2.out",
        },
        0
      );
      // Anchor the assemble phase to end at assembleEnd by padding the timeline
      masterTl.to({}, {}, assembleEnd);

      // Part B (optional): Dissolve tiles back out to reveal content underneath
      if (dissolveAtEnd) {
        masterTl.to(
          tiles,
          {
            opacity: 0,
            scale: startScale,
            stagger: tileStagger,
            ease: "power2.in",
          },
          dissolveStart
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [rows, actualCols, pattern, tileStagger, assembleEnd, startScale, dissolveAtEnd, dissolveStart, scrub, onProgress]);

  // Clear tracking refs on resize / change
  tilesRef.current = [];

  const memoizedTiles = React.useMemo(() => {
    const W_v = dimensions.width;
    const H_v = dimensions.height;
    const C = actualCols;
    const R = rows;

    let W_grid = W_v;
    let H_grid = H_v;

    if (isLaptop) {
      // Cover the viewport while keeping image aspect ratio so complete image is covered and no white spaces are visible
      if (imageAspect > W_v / H_v) {
        H_grid = H_v;
        W_grid = Math.round(H_v * imageAspect);
      } else {
        W_grid = W_v;
        H_grid = Math.round(W_v / imageAspect);
      }
    } else {
      // Normal cover behavior for mobile / default
      const S = Math.max(W_v / C, H_v / R);
      const S_ceil = Math.ceil(S);
      W_grid = C * S_ceil;
      H_grid = R * S_ceil;
    }

    // Calculate background image dimensions
    let W_img = W_grid;
    let H_img = H_grid;

    if (!isLaptop) {
      if (imageAspect > W_grid / H_grid) {
        // Image is wider than the grid -> match height
        H_img = H_grid;
        W_img = Math.ceil(H_grid * imageAspect);
      } else {
        // Image is taller than the grid -> match width
        W_img = W_grid;
        H_img = Math.ceil(W_grid / imageAspect);
      }
    }

    // Centered vertically, shifted horizontally to 0.35 focus point to reveal the character perfectly in the center
    const focusX = 0.35;
    const focusY = 0.50;

    const left_offset = isLaptop ? 0 : Math.round((W_grid - W_img) * focusX);
    const top_offset = isLaptop ? 0 : Math.round((H_grid - H_img) * focusY);

    const S_ceil = Math.ceil(Math.max(W_v / C, H_v / R));

    return (
      <div
        className="absolute"
        style={{
          width: `${W_grid}px`,
          height: `${H_grid}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "grid",
          gridTemplateRows: `repeat(${R}, 1fr)`,
          gridTemplateColumns: `repeat(${C}, 1fr)`,
          gap: `${tileGap}px`,
        }}
      >
        {tilesArray.map((_, idx) => {
          const row = Math.floor(idx / C);
          const col = idx % C;

          // Tile dimension representation
          const left_tile = isLaptop ? -col * (W_grid / C) : left_offset - col * S_ceil;
          const top_tile = isLaptop ? -row * (H_grid / R) : top_offset - row * S_ceil;

          return (
            <div
              key={idx}
              ref={(el) => {
                tilesRef.current[idx] = el;
              }}
              className="relative overflow-hidden bg-transparent"
              style={{
                // Prevent subpixel rendering whitespace gaps with a small margin
                margin: tileGap === 0 ? "-1px" : undefined,
              }}
            >
              <img
                src={imageUrl}
                alt=""
                draggable={false}
                referrerPolicy="no-referrer"
                className="absolute pointer-events-none select-none max-w-none max-h-none"
                style={{
                  width: `${W_img}px`,
                  height: `${H_img}px`,
                  left: `${left_tile}px`,
                  top: `${top_tile}px`,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }, [tilesArray, rows, actualCols, imageUrl, tileGap, dimensions, imageAspect, isLaptop]);

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
        {memoizedTiles}

        {children && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

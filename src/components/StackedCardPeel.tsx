import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * StackedCardPeel
 * ---------------------------------------------------------
 * A reusable scroll-driven "card stack peel" effect.
 *
 * How it works:
 * 1. You pass an array of cards (image + optional content per card).
 * 2. All cards are stacked directly on top of each other, slightly
 *    offset in scale/position so you can see the edges of the stack
 *    (like a real deck of photos).
 * 3. As the user scrolls through the pinned section, the TOP card
 *    peels away (rotates + flies off + fades) to reveal the card
 *    underneath, one at a time, until the last card is the only
 *    one left.
 * 4. Each card gets an equal slice of the scroll timeline, so the
 *    more cards you pass, the longer the scroll distance needed
 *    (scrollHeightVh scales automatically per card unless you
 *    override it).
 *
 * Usage:
 *   <StackedCardPeel
 *     cards={[
 *       { imageUrl: "/card1.jpg", title: "Step One" },
 *       { imageUrl: "/card2.jpg", title: "Step Two" },
 *       { imageUrl: "/card3.jpg", title: "Step Three" },
 *     ]}
 *   />
 *
 * Drop this into ANY section — project showcase, testimonials,
 * process steps, case studies, etc. Self-contained, pins independently.
 */

export interface StackedCard {
  /** Image for this card. Required. */
  imageUrl: string;

  /** Optional title shown on the card. */
  title?: string;

  /** Optional subtitle/description shown on the card. */
  subtitle?: string;

  /** Alt text for accessibility. Default empty (decorative) if no title. */
  alt?: string;

  /** Custom content component or extra React node to render on the card (e.g., customized testimonial card) */
  customContent?: React.ReactNode;
}

export interface StackedCardPeelProps {
  /** Ordered array of cards, first = bottom of stack (revealed last), last = top of stack (peels off first). Required. */
  cards: StackedCard[];

  /**
   * Scroll distance PER CARD, in vh. Total section height =
   * cards.length * scrollPerCardVh. Default 100.
   */
  scrollPerCardVh?: number;

  /** Direction the top card flies off toward. Default "left". */
  peelDirection?: "left" | "right" | "up" | "down" | "alternate";

  /** How far (in vw) the peeling card travels before it's fully gone. Default 120. */
  peelDistance?: number;

  /** Rotation (degrees) applied to a card as it peels off. Default 18. */
  peelRotation?: number;

  /** Scale of cards sitting underneath the active one (creates the "stack" depth look). Default 0.92. */
  stackedScale?: number;

  /** Vertical offset (px) between stacked cards underneath, for a fanned-deck look. Default 14. */
  stackedOffset?: number;

  /** GSAP scrub smoothing value. Lower = snappier, higher = laggier/smoother. Default 0.5. */
  scrub?: number;

  /** Called with scroll progress (0-1) on every update. */
  onProgress?: (progress: number) => void;

  /** Called with the index of the currently topmost (active) card. */
  onActiveCardChange?: (index: number) => void;

  /** Extra className for the outer wrapper. */
  className?: string;

  /** Background color shown behind the stack. Default white. */
  backgroundColor?: string;

  /** Width of the card, e.g. "min(90vw, 600px)". Default "min(90vw, 560px)". */
  cardWidth?: string;

  /** Height of the card, e.g. "60vh". Default "65vh". */
  cardHeight?: string;

  /** Custom translateY on the card container, e.g. "90px" or "10vh". Default "54px". */
  cardTranslateY?: string;

  /** Optional HTML element ID */
  id?: string;

  /** Optional children content rendered on top of stack */
  children?: React.ReactNode;
}

export default function StackedCardPeel({
  cards,
  scrollPerCardVh = 100,
  peelDirection = "left",
  peelDistance = 120,
  peelRotation = 18,
  stackedScale = 0.92,
  stackedOffset = 14,
  scrub = 0.5,
  onProgress,
  onActiveCardChange,
  className = "",
  backgroundColor = "#ffffff",
  cardWidth = "min(90vw, 560px)",
  cardHeight = "65vh",
  cardTranslateY = "54px",
  id,
  children,
}: StackedCardPeelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollHeightVh = cards.length * scrollPerCardVh;

  const getDirection = (idx: number) => {
    if (peelDirection !== "alternate") return peelDirection;
    return idx % 2 === 0 ? "left" : "right";
  };

  const getPeelTarget = (dir: "left" | "right" | "up" | "down") => {
    switch (dir) {
      case "left":
        return { x: -peelDistance, y: 0, rotate: -peelRotation };
      case "right":
        return { x: peelDistance, y: 0, rotate: peelRotation };
      case "up":
        return { x: 0, y: -peelDistance, rotate: -peelRotation * 0.4 };
      case "down":
        return { x: 0, y: peelDistance, rotate: peelRotation * 0.4 };
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardEls = cardRefs.current.filter((c) => c !== null) as HTMLDivElement[];
      if (cardEls.length === 0) return;

      // 1. Initial stacked state: every card except the last sits
      // slightly scaled down and offset, fanned underneath the top one.
      cardEls.forEach((el, idx) => {
        const depthFromTop = idx; // 0 for the first/topmost card, fanning down
        gsap.set(el, {
          x: 0,
          y: depthFromTop * stackedOffset,
          rotate: 0,
          scale: 1 - depthFromTop * (1 - stackedScale),
          opacity: 1,
          zIndex: cardEls.length - idx,
        });
      });

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
            const activeIdx = Math.min(
              cardEls.length - 1,
              Math.floor(self.progress * cardEls.length)
            );
            onActiveCardChange?.(activeIdx);
          },
        },
      });

      // 2. Each card (except the last) peels off in its own equal
      // slice of the timeline, revealing the card underneath.
      const peelableCount = cardEls.length - 1;
      cardEls.forEach((el, idx) => {
        if (idx >= peelableCount) return; // last card never peels away

        const dir = getDirection(idx);
        const target = getPeelTarget(dir);

        // Animate the current card out
        masterTl.to(
          el,
          {
            x: target.x,
            y: target.y,
            rotate: target.rotate,
            opacity: 0,
            ease: "power1.inOut",
          },
          idx
        );

        // Simultaneously, animate all underneath cards one step closer to the top
        for (let k = idx + 1; k < cardEls.length; k++) {
          const depthFromTopAtEnd = k - (idx + 1);
          masterTl.to(
            cardEls[k],
            {
              y: depthFromTopAtEnd * stackedOffset,
              scale: 1 - depthFromTopAtEnd * (1 - stackedScale),
              ease: "power1.inOut",
            },
            idx
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, peelDirection, peelDistance, peelRotation, stackedScale, stackedOffset, scrub, onProgress, onActiveCardChange]);

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
        <div
          className="relative"
          style={{ width: cardWidth, height: cardHeight, transform: `translateY(${cardTranslateY})` }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              style={{ willChange: "transform, opacity" }}
            >
              {card.imageUrl && (
                <img
                  src={card.imageUrl}
                  referrerPolicy="no-referrer"
                  alt={card.alt ?? card.title ?? ""}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />
              )}
              {card.customContent ? (
                <div className="absolute inset-0 z-10 w-full h-full">
                  {card.customContent}
                </div>
              ) : (
                (card.title || card.subtitle) && (
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    {card.title && (
                      <h3 className="text-white text-xl md:text-2xl font-bold">
                        {card.title}
                      </h3>
                    )}
                    {card.subtitle && (
                      <p className="text-white/80 text-sm md:text-base mt-1">
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {children && (
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

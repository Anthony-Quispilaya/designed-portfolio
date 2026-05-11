"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HackPrincetonSlide = {
  src: string;
  alt: string;
  label: string;
  caption: string;
};

type HackPrincetonCarouselProps = {
  slides: readonly HackPrincetonSlide[];
};

export function HackPrincetonCarousel({ slides }: HackPrincetonCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <div
      className="relative overflow-hidden rounded-[8px] border border-white/70 bg-[#cad8db]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        aria-live="polite"
        className="relative aspect-[4/3] w-full sm:aspect-[5/4] lg:aspect-[4/3]"
      >
        {slides.map((slide, index) => (
          <figure
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-3 top-3 flex flex-wrap items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
              <span className="rounded-full bg-white/92 px-3 py-2 text-xs font-bold tracking-[0.14em] text-[#435247] uppercase sm:px-4">
                {slide.label}
              </span>
              <span className="rounded-full bg-[#17231c] px-3 py-2 text-xs font-bold text-white sm:px-4">
                HackPrinceton 2026
              </span>
            </div>
            <figcaption className="absolute inset-x-3 bottom-3 rounded-[8px] border border-white/70 bg-white/90 p-4 shadow-[0_8px_20px_rgba(32,49,38,0.1)] backdrop-blur-sm sm:inset-x-4 sm:bottom-4 sm:p-5">
              <p className="text-xs font-bold text-[#697b56] uppercase tracking-[0.16em] sm:text-sm">
                Primary proof
              </p>
              <p className="mt-2 text-lg font-extrabold leading-tight text-[#17231c] sm:text-xl lg:text-2xl">
                {slide.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-white/70 bg-white/78 px-4 py-3">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show ${slide.label}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full ring-1 ring-[#cdd7d9] transition focus:outline-none focus:ring-2 focus:ring-[#17231c] focus:ring-offset-2 ${
              index === activeIndex
                ? "w-10 bg-[#17231c]"
                : "w-8 bg-[#6f806f] hover:bg-[#435247]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

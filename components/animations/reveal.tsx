"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: "none" | "sm" | "md";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  distance = "md",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || hasEntered) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setHasEntered(true);
    }, delay + 900);

    return () => window.clearTimeout(timeout);
  }, [delay, hasEntered, isVisible]);

  const revealClassName = hasEntered
    ? className
    : `scroll-reveal scroll-reveal--${distance} ${
        isVisible ? "is-visible" : ""
      } ${className}`;

  return (
    <div
      ref={ref}
      className={revealClassName}
      style={
        hasEntered
          ? undefined
          : ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
      }
    >
      {children}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#proof", label: "Proof" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function PortfolioHeader() {
  const [activeSection, setActiveSection] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setHasScrolled(window.scrollY > 12);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        const marker = window.scrollY + Math.min(360, window.innerHeight * 0.4);
        const pageBottom = window.scrollY + window.innerHeight;
        const isAtPageEnd =
          pageBottom >= document.documentElement.scrollHeight - 8;
        let currentSection = "";

        for (const item of navItems) {
          const section = document.querySelector<HTMLElement>(item.href);

          if (section && section.offsetTop <= marker) {
            currentSection = section.id;
          }
        }

        setActiveSection(
          isAtPageEnd
            ? navItems[navItems.length - 1].href.slice(1)
            : currentSection,
        );
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header
      className={`border-b bg-[#f7f3ec]/92 backdrop-blur-md transition-colors duration-300 ${
        hasScrolled ? "border-[#c8d0c0]" : "border-[#d7ddcf]/80"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.18em] !text-[#24352b] uppercase"
        >
          Anthony Quispilaya
        </Link>
        <nav
          aria-label="Portfolio sections"
          className="hidden gap-5 text-sm font-semibold !text-[#4b5966] sm:flex"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`border-b border-transparent pb-1 transition-colors ${
                  isActive
                    ? "!text-[#17231c] border-[#697b56]"
                    : "hover:!text-[#17231c]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

// src/components/Header.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { tokens } from "../styles/tokens";
import LogoMagnifyBars from "./LogoMagnifyBars";

type NavItem = { label: string; type: "route" | "section"; to: string };

const NAV: NavItem[] = [
  { label: "Home", type: "route", to: "/" },
  { label: "Pricing", type: "section", to: "pricing" },
  { label: "Contact", type: "route", to: "/contact" },
];

function findAnchor(id: string): HTMLElement | null {
  const root = document.getElementById(id);
  if (!root) return null;
  const explicit = root.querySelector<HTMLElement>("[data-anchor-target='true']");
  if (explicit) return explicit;
  const heading = root.querySelector<HTMLElement>("h1, h2, h3");
  return heading ?? root;
}

function headerOffsetPx(headerEl: HTMLElement | null): number {
  const h = headerEl ? headerEl.offsetHeight : 64;
  return h + 8;
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      setVisible(y < lastY || y < 160);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const translateClass = visible ? "translate-y-0" : "-translate-y-full";

  const scrollWithOffset = useCallback((id: string) => {
    const target = findAnchor(id);
    if (!target) return;
    setVisible(true);
    const y =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerOffsetPx(headerRef.current);
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const goSection = useCallback(
    (id: string) => {
      setOpen(false);
      if (pathname !== "/") {
        navigate("/", { replace: false });
        requestAnimationFrame(() =>
          requestAnimationFrame(() => scrollWithOffset(id))
        );
      } else {
        scrollWithOffset(id);
      }
    },
    [navigate, pathname, scrollWithOffset]
  );

  return (
    <>
      <header
        ref={headerRef as any}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-transform duration-300",
          translateClass,
          "bg-white/90 backdrop-blur border-b border-neutral-200",
          atTop ? "" : "shadow-sm",
        ].join(" ")}
      >
        <div className={`${tokens.container} h-16 flex items-center justify-between relative`}>
          {/* Left: Logo */}
          <Link to="/" className="flex items-center" aria-label="Home" onClick={() => setOpen(false)}>
            <LogoMagnifyBars className="h-12 w-12 md:h-14 md:w-14 text-black" />
          </Link>

          {/* Center: desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
            aria-label="Primary"
          >
            {NAV.map((item) =>
              item.type === "route" ? (
                <Link key={item.label} to={item.to} className="text-sm text-neutral-800 hover:text-neutral-900">
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    goSection(item.to);
                  }}
                  className="text-sm text-neutral-800 hover:text-neutral-900"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {/* Right: glass login + mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Use darker glass so it’s visible on white header */}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-neutral-900 backdrop-blur-md bg-black/10 border border-black/20 hover:bg-black/15 ring-1 ring-black/5 shadow-sm transition"
            >
              Log in
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-neutral-300"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full right-4 mt-2 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg p-2 md:hidden"
              >
                <button
                  className="absolute top-1 right-1 p-2"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="pt-6 flex flex-col gap-1">
                  {NAV.map((item) =>
                    item.type === "route" ? (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="px-3 py-2 rounded hover:bg-neutral-100 text-sm"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.label}
                        type="button"
                        className="px-3 py-2 rounded hover:bg-neutral-100 text-left text-sm"
                        onClick={() => {
                          setOpen(false);
                          goSection(item.to);
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  )}

                  {/* Mobile login button, same darker glass for contrast */}
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="mt-2 px-4 py-2 rounded-xl text-center text-sm font-medium text-neutral-900 backdrop-blur-md bg-black/10 border border-black/20 hover:bg-black/15 ring-1 ring-black/5 shadow-sm transition"
                  >
                    Log in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div aria-hidden className="h-16" />
    </>
  );
}

// src/components/FloatingBurgerMenu.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu as IconMenu, X, Home, BadgeDollarSign, Phone } from "lucide-react";

/* ----- helpers to match Header.tsx behavior ----- */
function findAnchor(id: string): HTMLElement | null {
  const root = document.getElementById(id);
  if (!root) return null;
  const explicit = root.querySelector<HTMLElement>("[data-anchor-target='true']");
  if (explicit) return explicit;
  const heading = root.querySelector<HTMLElement>("h1, h2, h3");
  return heading ?? root;
}
function headerOffsetPx(headerEl: HTMLElement | null): number {
  const h = headerEl ? headerEl.offsetHeight : 72;
  return h + 8;
}
function useHeaderVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setVisible(y < last || y < 160);
      last = y;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const mo = new MutationObserver(update);
    const header = document.querySelector("header");
    if (header) mo.observe(header, { attributes: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mo?.disconnect();
    };
  }, []);
  return visible;
}

/* ----- stack container ----- */
function MenuContainer({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = useMemo(() => React.Children.toArray(children), [children]);
  return (
    <div className="relative w-16" data-expanded={isExpanded}>
      <button
        aria-label="Open quick menu"
        className="h-12 w-12 rounded-full shadow bg-white text-black border border-neutral-200"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <IconMenu className="h-6 w-6 mx-auto my-3" />
      </button>
      {isExpanded && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-neutral-200 bg-white shadow p-2">
          {items}
          <button
            aria-label="Close"
            className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 py-2"
            onClick={() => setIsExpanded(false)}
          >
            <X className="h-4 w-4" /> Close
          </button>
        </div>
      )}
    </div>
  );
}

export default function FloatingBurgerMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const visible = useHeaderVisible();

  const goSection = (id: "pricing" | "audit") => () => {
    const header = document.querySelector("header") as HTMLElement | null;
    const target = findAnchor(id);
    const scrollToTarget = () => {
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - headerOffsetPx(header);
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    if (pathname !== "/") {
      navigate("/", { replace: false });
      requestAnimationFrame(() => requestAnimationFrame(scrollToTarget));
    } else {
      scrollToTarget();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden">
      <div className="flex items-center gap-3">
        <MenuContainer>
          <button className="w-full px-3 py-2 rounded hover:bg-neutral-100 inline-flex items-center gap-2" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" /> Home
          </button>
          <button className="w-full px-3 py-2 rounded hover:bg-neutral-100 inline-flex items-center gap-2" onClick={() => { const fn = goSection('pricing'); fn(); }}>
            <BadgeDollarSign className="h-4 w-4" /> Pricing
          </button>
          <button className="w-full px-3 py-2 rounded hover:bg-neutral-100 inline-flex items-center gap-2" onClick={() => navigate("/contact")}>
            <Phone className="h-4 w-4" /> Contact
          </button>
        </MenuContainer>
      </div>
    </div>
  );
}

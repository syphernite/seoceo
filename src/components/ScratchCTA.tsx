// src/components/ScratchCTA.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  revealHref: string;
  className?: string;
  width?: number;
  height?: number;
  revealLabel?: string;
};

export default function ScratchCTA({
  revealHref,
  className = "w-full max-w-3xl h-52",
  width,
  height,
  revealLabel,
}: Props) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  const paintCover = () => {
    const c = canvasRef.current;
    const wrap = wrapRef.current;
    if (!c || !wrap) return;

    // derive size
    let w = width ?? Math.floor(wrap.clientWidth);
    let h = height ?? Math.floor(wrap.clientHeight);

    // fallback if height is zero at first render
    if (!h || h < 10) {
      h = Math.max(160, Math.round((w || 720) * 0.28));
      wrap.style.height = h + "px";
    }
    if (!w || w < 10) w = 720;

    const dpr = window.devicePixelRatio || 1;

    // CSS size
    c.style.width = w + "px";
    c.style.height = h + "px";
    // backing store
    c.width = Math.max(1, Math.floor(w * dpr));
    c.height = Math.max(1, Math.floor(h * dpr));

    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // cover
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    // instruction
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    const fs = Math.max(16, Math.min(30, Math.floor(w / 18)));
    ctx.font = `600 ${fs}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to reveal", w / 2, h / 2);
  };

  useEffect(() => {
    paintCover();
    const onResize = () => {
      if (!revealed) paintCover();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, revealed]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let drawing = false;
    const scratchAt = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 36;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.01, y + 0.01);
      ctx.stroke();
    };
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      drawing = true;
      c.setPointerCapture(e.pointerId);
      const { x, y } = pos(e);
      scratchAt(x, y);
      e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!drawing) return;
      const { x, y } = pos(e);
      scratchAt(x, y);
      e.preventDefault();
    };
    const up = (e: PointerEvent) => {
      drawing = false;
      try { c.releasePointerCapture(e.pointerId); } catch {}
      setRevealed(true);
    };

    c.addEventListener("pointerdown", down, { passive: false });
    c.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up, { passive: false });
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const go = () => {
    try {
      const url = new URL(revealHref, window.location.href);
      if (url.origin === window.location.origin) {
        navigate(url.pathname + url.search + url.hash);
      } else {
        window.location.href = url.toString();
      }
    } catch {
      navigate(revealHref);
    }
  };

  return (
    <div className={`${className} mx-auto`}>
      <div
        ref={wrapRef}
        className="relative w-full h-full mx-auto rounded-2xl overflow-hidden bg-white flex items-center justify-center"
      >
        {revealed && (
          <button
            onClick={go}
            className="absolute z-10 inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.8)] hover:shadow-[0_0_36px_rgba(16,185,129,0.9)] transition-shadow"
          >
            {revealLabel ?? "Next"}
          </button>
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full rounded-2xl touch-none cursor-pointer"
          role="img"
          aria-label="Scratch to reveal"
          style={{ display: revealed ? "none" : "block" }}
        />
      </div>
    </div>
  );
}

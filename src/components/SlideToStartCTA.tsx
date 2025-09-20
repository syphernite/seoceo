import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Check } from "lucide-react"

type Props = {
  to: string
  label?: string
  className?: string
}

/**
 * Same UI. Stronger cross-browser drag.
 * - While dragging: force `touch-action:none` on the track and block page scroll with a non-passive document touchmove.
 * - Pointer events first, with touch/mouse fallbacks.
 * - rAF batching.
 */
export default function SlideToStartCTA({ to, label = "Slide to start", className = "" }: Props) {
  const nav = useNavigate()
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  // prevent page scroll during drag (iOS Safari and some UAs)
  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      if (draggingRef.current) e.preventDefault()
    }
    document.addEventListener("touchmove", prevent, { passive: false })
    return () => document.removeEventListener("touchmove", prevent as EventListener)
  }, [])

  // rAF batching
  const rafRef = useRef<number | null>(null)
  const schedule = (fn: () => void) => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      fn()
    })
  }
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  useEffect(() => { if (done) nav(to) }, [done, nav, to])

  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  const posToProgress = (clientX: number) => {
    const el = trackRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return clamp((clientX - rect.left) / rect.width)
  }

  // Pointer events
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (done) return
    draggingRef.current = true
    setDragging(true)
    try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId) } catch {}
    schedule(() => setProgress(posToProgress(e.clientX)))
    e.preventDefault()
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || done) return
    schedule(() => setProgress(posToProgress(e.clientX)))
    if (e.pointerType === "touch") e.preventDefault()
  }
  const endDrag = () => {
    if (!draggingRef.current || done) return
    draggingRef.current = false
    setDragging(false)
    if (progress >= 0.98) { setProgress(1); setDone(true) } else { setProgress(0) }
  }

  // Touch fallback if PointerEvent absent
  useEffect(() => {
    const el = trackRef.current
    if (!el || "PointerEvent" in window) return
    const ts = (ev: TouchEvent) => { if (done) return; draggingRef.current = true; setDragging(true); const t = ev.touches[0]; if (t) schedule(() => setProgress(posToProgress(t.clientX))); ev.preventDefault() }
    const tm = (ev: TouchEvent) => { if (!draggingRef.current || done) return; const t = ev.touches[0]; if (t) schedule(() => setProgress(posToProgress(t.clientX))); ev.preventDefault() }
    const te = (ev: TouchEvent) => { endDrag(); ev.preventDefault() }
    el.addEventListener("touchstart", ts, { passive: false })
    el.addEventListener("touchmove", tm, { passive: false })
    el.addEventListener("touchend", te, { passive: false })
    el.addEventListener("touchcancel", te, { passive: false })
    return () => {
      el.removeEventListener("touchstart", ts as EventListener)
      el.removeEventListener("touchmove", tm as EventListener)
      el.removeEventListener("touchend", te as EventListener)
      el.removeEventListener("touchcancel", te as EventListener)
    }
  }, [done])

  // Mouse fallback
  useEffect(() => {
    const mm = (ev: MouseEvent) => { if (!draggingRef.current || done) return; schedule(() => setProgress(posToProgress(ev.clientX))); ev.preventDefault() }
    const mu = () => endDrag()
    window.addEventListener("mousemove", mm)
    window.addEventListener("mouseup", mu)
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu) }
  }, [done])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (done) return
    if (e.key === "ArrowRight") { e.preventDefault(); setProgress(p => clamp(p + 0.2)) }
    if (e.key === "Enter") { e.preventDefault(); setDone(true) }
  }

  const handleX = `calc(${Math.max(progress, 0.02) * 100}% - 2.0rem)`
  const fillW = `${progress * 100}%`

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      className={[
        "relative isolate h-16 w-full max-w-xl select-none rounded-full",
        "border border-black/10 dark:border-white/10",
        "bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900",
        "shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_8px_20px_rgba(0,0,0,.08)]",
        "outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40",
        "cursor-pointer",
        "touch-pan-y",
        "overscroll-contain",
        className
      ].join(" ")}
      // While dragging, completely disable UA gestures on the track.
      style={{ touchAction: dragging ? "none" : "pan-y", WebkitTapHighlightColor: "transparent" }}
    >
      {/* progress fill */}
      <div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{
          width: fillW,
          background:
            "linear-gradient(90deg, rgba(16,185,129,.15), rgba(59,130,246,.15), rgba(99,102,241,.15))",
          transition: dragging ? "none" : "width 300ms cubic-bezier(.4,0,.2,1)"
        }}
      />

      {/* subtle animated stripes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(120deg, transparent 0, transparent 12px, rgba(0,0,0,.06) 12px, rgba(0,0,0,.06) 16px)",
            transform: "translate3d(0,0,0)",
            animation: "slideStripes 2.2s linear infinite"
          }}
        />
      </div>

      {/* label */}
      <div
        className="pointer-events-none absolute inset-0 grid place-items-center text-sm font-medium text-neutral-700 dark:text-neutral-200"
        style={{ opacity: done ? 0 : 1 - progress * 0.9, transition: "opacity 200ms linear" }}
      >
        {label}
      </div>

      {/* knob */}
      <div
        className={[
          "absolute top-1/2 -translate-y-1/2",
          "h-12 w-12 rounded-full",
          "grid place-items-center",
          "shadow-lg",
          done ? "bg-emerald-500 text-white" : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
        ].join(" ")}
        style={{
          left: handleX,
          transition:
            dragging || done ? "none" : "left 300ms cubic-bezier(.4,0,.2,1), background-color 200ms",
          pointerEvents: "none"
        }}
      >
        {done ? <Check className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
      </div>

      <style>{`@keyframes slideStripes{from{background-position:0 0}to{background-position:200px 0}}`}</style>
    </div>
  )
}

// src/components/LogoMagnifyBars.tsx
export default function LogoMagnifyBars({ className = "", title = "Logo Magnify Bars" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* magnifier */}
        <circle cx="10" cy="10" r="6" />
        <path d="M14.5 14.5L20 20" />
        {/* bar trio */}
        <path d="M7 12v-3" />
        <path d="M10 12V8" />
        <path d="M13 12V9" />
      </g>
      <style>{`:root,&{color:#000}`}</style>
    </svg>
  );
}

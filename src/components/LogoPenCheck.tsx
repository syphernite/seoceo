// src/components/LogoPenCheck.tsx
export default function LogoPenCheck({ className = "", title = "Logo Pen Check" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* stylized pen nib */}
        <path d="M12 2l4 4-8 8-3 6 6-3 8-8-4-4z" />
        {/* small check mark inside nib */}
        <path d="M9.5 12.5l1.5 1.5 3-3" />
      </g>
      <style>{`:root,&{color:#000}`}</style>
    </svg>
  );
}

// src/components/LogoArrowHex.tsx
export default function LogoArrowHex({ className = "", title = "Logo Arrow Hex" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* hex badge */}
      <path
        d="M12 2.5l7 4v11l-7 4-7-4v-11l7-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* up-right arrow rising over baseline */}
      <path
        d="M7.5 14.5h4.5m0 0V10m0 0h4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M16.5 10l-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <style>{`:root,&{color:#000}`}</style>
    </svg>
  );
}

import { cn } from "@/lib/utils"

/** Mochi-chan, Yan's original mascot. A squishy daifuku with a sakura clip. */
export function Mochi({ className, happy = false }: { className?: string; happy?: boolean }) {
  return (
    <svg viewBox="0 0 120 104" className={cn("overflow-visible", className)} aria-hidden="true">
      <defs>
        <radialGradient id="mochi-body" cx="38%" cy="26%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#fff1f7" />
          <stop offset="100%" stopColor="#ffc9e0" />
        </radialGradient>
        <radialGradient id="mochi-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff7fb0" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ff7fb0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="97" rx="40" ry="5" fill="#b0407a" opacity="0.22" />
      <path
        d="M60 16 C 98 16 113 52 111 73 C 109 92 91 95 60 95 C 29 95 11 92 9 73 C 7 52 22 16 60 16 Z"
        fill="url(#mochi-body)"
        stroke="#f58bb8"
        strokeWidth="2.5"
      />
      {/* gloss */}
      <path
        d="M33 37 C 39 27 50 23 58 23"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="27" cy="47" r="2.6" fill="#fff" opacity="0.95" />
      {/* eyes */}
      {happy ? (
        <path
          d="M39 60 q6 -8 12 0 M69 60 q6 -8 12 0"
          fill="none"
          stroke="#4a2140"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse cx="45" cy="58" rx="4.4" ry="6" fill="#4a2140" />
          <ellipse cx="75" cy="58" rx="4.4" ry="6" fill="#4a2140" />
          <circle cx="46.6" cy="55.6" r="1.8" fill="#fff" />
          <circle cx="76.6" cy="55.6" r="1.8" fill="#fff" />
          <circle cx="43.6" cy="60.8" r="0.9" fill="#fff" opacity="0.8" />
          <circle cx="73.6" cy="60.8" r="0.9" fill="#fff" opacity="0.8" />
        </>
      )}
      {/* blush */}
      <ellipse cx="33" cy="69" rx="9" ry="5.5" fill="url(#mochi-blush)" />
      <ellipse cx="87" cy="69" rx="9" ry="5.5" fill="url(#mochi-blush)" />
      {/* ω mouth */}
      <path
        d="M54 66 q3 4.4 6 0 q3 4.4 6 0"
        fill="none"
        stroke="#4a2140"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* sakura clip */}
      <g transform="translate(88 27) rotate(18)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse
            key={r}
            cx="0"
            cy="-6.4"
            rx="4.6"
            ry="7"
            fill="#ff8fc0"
            stroke="#f0609f"
            strokeWidth="1"
            transform={`rotate(${r})`}
          />
        ))}
        <circle r="2.8" fill="#ffe270" />
      </g>
    </svg>
  )
}

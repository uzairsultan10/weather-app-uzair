export function Effects() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        {/* Yellow gradient */}
        <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--color-yellow-400)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-amber-600)" }} />
        </linearGradient>

        {/* Yellow glow */}
        <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            style={{ stopColor: "var(--color-yellow-100)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--color-yellow-300)", stopOpacity: 0 }}
          />
        </radialGradient>

        {/* White inner shadow*/}
        <filter
          id="whiteInnerShadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
          <feOffset dx="0" dy="10" result="offsetBlur" />
          <feComposite
            in="SourceGraphic"
            in2="offsetBlur"
            operator="out"
            result="inverse"
          />
          <feFlood
            style={{ floodColor: "white" }}
            floodOpacity="0.5"
            result="color"
          />
          <feComposite in="color" in2="inverse" operator="in" result="shadow" />
          <feComposite in="shadow" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
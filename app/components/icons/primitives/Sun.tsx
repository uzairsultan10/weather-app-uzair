import { useId } from "react";

interface SunProps {
  x?: number;
  y?: number;
}

export function Sun({ x = 0, y = 0 }: SunProps) {
  const svgId = useId().replace(/:/g, "");
  const glowId = `${svgId}-yellow-glow`;
  const gradientId = `${svgId}-yellow-gradient`;
  const shadowId = `${svgId}-white-inner-shadow`;

  return (
    <>
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity={1} />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
        </radialGradient>

        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
          <feOffset dx="0" dy="10" result="offsetBlur" />
          <feComposite
            in="SourceGraphic"
            in2="offsetBlur"
            operator="out"
            result="inverse"
          />
          <feFlood floodColor="#ffffff" floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="inverse" operator="in" result="shadow" />
          <feComposite in="shadow" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>

      <circle cx={192 + x} cy={192 + y} r="150" fill={`url(#${glowId})`} opacity={0.7} />
      <circle
        cx={192 + x}
        cy={192 + y}
        r="104"
        fill={`url(#${gradientId})`}
        filter={`url(#${shadowId})`}
        className="animate-pulse"
        style={{ transformOrigin: "center" }}
      />
    </>
  );
}
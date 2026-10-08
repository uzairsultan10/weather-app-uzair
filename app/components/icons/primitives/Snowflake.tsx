interface SnowflakeProps {
  x?: number;
  y?: number;
}

export function Snowflake({ x = 0, y = 0 }: SnowflakeProps) {
  return (
    <g transform={`translate(${x}, ${y})`} className="animate-fall [--animation-delay:-0.4s]">
      <path
        d="M144 18V110M144 50L120 74L144 92L168 74L144 50ZM144 92L120 116L144 138L168 116L144 92ZM144 110L120 134L144 162L168 134L144 110ZM144 18L120 42L144 70L168 42L144 18Z"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        className="text-slate-100"
        fill="none"
      />
    </g>
  );
}

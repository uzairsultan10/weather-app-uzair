interface ThunderboltProps {
  x?: number;
  y?: number;
}

export function Thunderbolt({ x = 0, y = 0 }: ThunderboltProps) {
  return (
    <g transform={`translate(${x}, ${y})`} className="animate-flash">
      <path
        d="M201 28L116 190H170L143 338L273 154H219L252 28H201Z"
        className="fill-yellow-300"
      />
    </g>
  );
}

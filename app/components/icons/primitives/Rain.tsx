interface RainProps {
  x?: number;
  y?: number;
}

export function Rain({ x = 0, y = 0 }: RainProps) {
  return (
    <>
      <g transform={`translate(${x}, ${y})`} className="animate-fall [--animation-delay:-0.2s]">
        <path
          d="M130 40C130 32.268 136.268 26 144 26C151.732 26 158 32.268 158 40V98C158 105.732 151.732 112 144 112C136.268 112 130 105.732 130 98V40Z"
          className="fill-sky-300"
        />
      </g>
      <g transform={`translate(${x + 36}, ${y})`} className="animate-fall [--animation-delay:-0.6s]">
        <path
          d="M130 40C130 32.268 136.268 26 144 26C151.732 26 158 32.268 158 40V98C158 105.732 151.732 112 144 112C136.268 112 130 105.732 130 98V40Z"
          className="fill-sky-300"
        />
      </g>
      <g transform={`translate(${x + 72}, ${y})`} className="animate-fall [--animation-delay:-1s]">
        <path
          d="M130 40C130 32.268 136.268 26 144 26C151.732 26 158 32.268 158 40V98C158 105.732 151.732 112 144 112C136.268 112 130 105.732 130 98V40Z"
          className="fill-sky-300"
        />
      </g>
    </>
  );
}

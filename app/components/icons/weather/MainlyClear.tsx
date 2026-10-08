import { WeatherIconProps } from "../../../lib/types";
import { WeatherIcon } from "../WeatherIcon";
import { Cloud, Moon, Sun } from "../primitives";

export function MainlyClear({ isNight, className }: WeatherIconProps) {
  return (
    <WeatherIcon className={className}>
      {isNight ? <Moon /> : <Sun />}
      <g className="animate-hover">
        <Cloud x={-80} y={80} scale={0.5} />
      </g>
      <g className="animate-hover [--animation-delay:-2.5s]">
        <Cloud x={80} y={-80} scale={0.5} />
      </g>
    </WeatherIcon>
  );
}
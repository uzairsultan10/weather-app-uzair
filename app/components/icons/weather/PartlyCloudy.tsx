import { WeatherIconProps } from "../../../lib/types";
import { WeatherIcon } from "../WeatherIcon";
import { Cloud, Moon, Sun } from "../primitives";

export function PartlyCloudy({ isNight, className }: WeatherIconProps) {
  return (
    <WeatherIcon className={className}>
      {isNight ? <Moon x={20} y={-10} /> : <Sun x={20} y={-10} />}
      <g className="animate-hover">
        <Cloud x={-20} y={30} />
      </g>
    </WeatherIcon>
  );
}
import { WeatherIcon } from "../lib/types";

interface DaysListItemProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  Icon: WeatherIcon;
}

export function DaysListItem({
  day,
  maxTemp,
  minTemp,
  Icon,
}: DaysListItemProps) {
  return (
    <li className="... border-t border-border [--animation-duration:0]">
        <h3 className="text-base font-medium text-shadow-sm">{day}</h3>
        <Icon className="size-8 ml-auto" />
        <div className="flex gap-4 w-16 justify-end text-base font-normal">
            <span>{maxTemp}°</span>
      <span className="text-muted-foreground text-shadow-sm">{minTemp}°</span>
      </div>
    </li>
  );
}
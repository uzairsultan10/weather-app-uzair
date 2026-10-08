import { WeatherIcon } from "./types";
import { PartlyCloudy } from "../components/icons";

export function getWeatherIcon(code: number): WeatherIcon {
  // For now, return PartlyCloudy for all codes
  // You'll add more conditions as you create more icons
  return PartlyCloudy;
}
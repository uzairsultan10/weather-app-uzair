import type { TemperatureScale } from "../contexts/TemperatureScaleContext";

export function convertTemperature(
  celsius: number,
  scale: TemperatureScale
): number {
  return scale === "F" ? (celsius * 9) / 5 + 32 : celsius;
}

export function formatTemperature(
  celsius: number,
  scale: TemperatureScale
): string {
  return `${Math.round(convertTemperature(celsius, scale))}°${scale}`;
}

"use client";

import { useFormattedTemperature } from "../contexts/TemperatureScaleContext";

interface TemperatureValueProps {
  celsius: number;
  className?: string;
}

export function TemperatureValue({
  celsius,
  className,
}: TemperatureValueProps) {
  const temperature = useFormattedTemperature(celsius);

  return <span className={className}>{temperature}</span>;
}

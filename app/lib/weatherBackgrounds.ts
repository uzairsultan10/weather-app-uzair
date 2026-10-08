export function getWeatherBackground(code: number, isNight: boolean): string {
  // Clear sky (0), Mainly clear (1), Partly cloudy (2)
  if ([0, 1, 2].includes(code)) {
    return isNight ? "from-slate-900 to-blue-950" : "from-sky-600 to-blue-400";
  }

  // Thunderstorm (95-99) - darker variant
  if ([95, 96, 99].includes(code)) {
    return isNight
      ? "from-slate-900 to-slate-800"
      : "from-slate-800 to-slate-600";
  }

  // Overcast (3), Fog (45, 48), Rain (51-67, 80-82), Snow (71-77, 85-86), Default
  return isNight
    ? "from-slate-900 to-slate-800"
    : "from-slate-600 to-slate-500";
}
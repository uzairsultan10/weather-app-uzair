"use client";

import { useTemperatureScale } from "../contexts/TemperatureScaleContext";
import { Switch } from "../../components/ui/switch";

export function TemperatureToggle() {
  const { scale, setScale } = useTemperatureScale();
  const isFahrenheit = scale === "F";

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <span
        aria-hidden="true"
        className={`transition-colors ${
          isFahrenheit ? "text-muted-foreground" : "text-white"
        }`}
      >
        °C
      </span>
      <Switch
        checked={isFahrenheit}
        onCheckedChange={(checked) => setScale(checked ? "F" : "C")}
        aria-label={`Temperature unit: ${isFahrenheit ? "Fahrenheit" : "Celsius"}`}
        className="h-6 w-11 border border-border bg-slate-900/60 data-checked:bg-sky-500 data-unchecked:bg-slate-700 [&_[data-slot=switch-thumb]]:size-5"
      />
      <span
        aria-hidden="true"
        className={`transition-colors ${
          isFahrenheit ? "text-white" : "text-muted-foreground"
        }`}
      >
        °F
      </span>
    </div>
  );
}

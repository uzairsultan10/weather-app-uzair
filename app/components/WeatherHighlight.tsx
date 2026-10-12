"use client";

import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";
import {
  hourlyForecastData,
  type HourlyCondition,
} from "../data/hourlyForecast";
import { useTemperatureScale } from "../contexts/TemperatureScaleContext";
import { formatTemperature } from "../lib/temperature";

interface WeatherHighlightProps {
  locationName: string;
  timeZone: string;
  sunrise: string;
  sunset: string;
}

const conditionDetails: Record<
  HourlyCondition,
  { label: string; Icon: LucideIcon }
> = {
  clear: { label: "Clear", Icon: Sun },
  "partly-cloudy": { label: "Partly cloudy", Icon: CloudSun },
  cloudy: { label: "Cloudy", Icon: Cloud },
  rain: { label: "Rain", Icon: CloudRain },
  snow: { label: "Snow", Icon: CloudSnow },
  thunderstorm: { label: "Thunderstorm", Icon: CloudLightning },
};

const chartWidth = 960;
const chartHeight = 180;
const temperatureTop = 32;
const temperatureBottom = 124;
const temperatureMin = 10;
const temperatureMax = 24;

function getCurrentLocalMinutes(timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);

  return hour * 60 + minute;
}

function getEventMinutes(dateTime: string): number {
  const match = dateTime.match(/T(\d{2}):(\d{2})/);
  if (!match) {
    throw new Error(`Invalid sunrise or sunset time: ${dateTime}`);
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function getEventOffset(dateTime: string, currentMinutes: number): number {
  const minutesUntilEvent =
    (getEventMinutes(dateTime) - currentMinutes + 1440) % 1440;
  return minutesUntilEvent / 60;
}

function formatHour(hour: number): string {
  const normalizedHour = hour % 24;
  return `${normalizedHour % 12 || 12}${normalizedHour < 12 ? "AM" : "PM"}`;
}

function formatEventTime(dateTime: string): string {
  const eventMinutes = getEventMinutes(dateTime);
  const hour = Math.floor(eventMinutes / 60);
  const minute = eventMinutes % 60;
  return `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${
    hour < 12 ? "AM" : "PM"
  }`;
}

export function WeatherHighlight({
  locationName,
  timeZone,
  sunrise,
  sunset,
}: WeatherHighlightProps) {
  const { scale } = useTemperatureScale();
  const currentMinutes = getCurrentLocalMinutes(timeZone);
  const currentHour = Math.floor(currentMinutes / 60);
  const sunriseOffset = getEventOffset(sunrise, currentMinutes);
  const sunsetOffset = getEventOffset(sunset, currentMinutes);

  const points = hourlyForecastData.map((hour) => {
    const x = 20 + (hour.hourOffset / 24) * (chartWidth - 40);
    const y =
      temperatureBottom -
      ((hour.temperatureC - temperatureMin) /
        (temperatureMax - temperatureMin)) *
        (temperatureBottom - temperatureTop);
    return `${x},${y}`;
  });
  const temperatureLine = points.join(" ");
  const temperatureArea = `M ${points[0]} L ${points
    .slice(1)
    .join(" L ")} L ${chartWidth - 20},${temperatureBottom} L 20,${temperatureBottom} Z`;

  const events = [
    {
      label: "Sunrise",
      dateTime: sunrise,
      offset: sunriseOffset,
      color: "text-amber-300",
      stroke: "#fcd34d",
    },
    {
      label: "Sunset",
      dateTime: sunset,
      offset: sunsetOffset,
      color: "text-orange-300",
      stroke: "#fdba74",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-slate-800/40 p-6 shadow-lg shadow-black/20">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-shadow-md">
          Next 24 hours
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hourly forecast for {locationName}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="mb-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-4 rounded bg-sky-300" />
              Temperature (°{scale})
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-sky-400/60" />
              Precipitation chance
            </span>
          </div>

          <svg
            className="block h-auto w-full overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label={`Hourly temperature in °${scale} and precipitation chart for ${locationName}`}
          >
            <defs>
              <linearGradient id="temperature-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[temperatureTop, (temperatureTop + temperatureBottom) / 2, temperatureBottom].map(
              (y) => (
                <line
                  key={y}
                  x1="0"
                  x2={chartWidth}
                  y1={y}
                  y2={y}
                  stroke="rgb(255 255 255 / 12%)"
                  strokeDasharray="3 6"
                />
              )
            )}

            {events.map((event) => {
              const x =
                20 + (event.offset / 24) * (chartWidth - 40);
              const anchor =
                x < 90 ? "start" : x > chartWidth - 90 ? "end" : "middle";
              return (
                <g key={event.label}>
                  <line
                    x1={x}
                    x2={x}
                    y1="22"
                    y2={temperatureBottom}
                    stroke={event.stroke}
                    strokeDasharray="4 4"
                    strokeOpacity="0.8"
                  />
                  <text
                    x={x}
                    y="14"
                    textAnchor={anchor}
                    className={event.color}
                    fill="currentColor"
                    fontSize="11"
                  >
                    {event.label} {formatEventTime(event.dateTime)}
                  </text>
                </g>
              );
            })}

            <path d={temperatureArea} fill="url(#temperature-area)" />

            {hourlyForecastData.map((hour) => {
              const x = 20 + (hour.hourOffset / 24) * (chartWidth - 40);
              const barHeight = (hour.precipitationChance / 100) * 27;
              return (
                <rect
                  key={`precipitation-${hour.hourOffset}`}
                  x={x - 6}
                  y={chartHeight - 10 - barHeight}
                  width="12"
                  height={barHeight}
                  rx="3"
                  className="fill-sky-400/60"
                />
              );
            })}

            <polyline
              points={temperatureLine}
              fill="none"
              stroke="#7dd3fc"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            {hourlyForecastData.map((hour) => {
              const x = 20 + (hour.hourOffset / 24) * (chartWidth - 40);
              const y =
                temperatureBottom -
                ((hour.temperatureC - temperatureMin) /
                  (temperatureMax - temperatureMin)) *
                  (temperatureBottom - temperatureTop);
              return (
                <circle
                  key={`temperature-${hour.hourOffset}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#bae6fd"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] border-t border-border pt-3">
            {hourlyForecastData.map((hour) => {
              const { Icon, label } = conditionDetails[hour.condition];
              const localHour = (currentHour + hour.hourOffset) % 24;
              const timeLabel =
                hour.hourOffset === 0 ? "Now" : formatHour(localHour);

              return (
                <div
                  key={hour.hourOffset}
                  className="flex min-w-0 flex-col items-center gap-2 text-center"
                  title={`${label}, ${formatTemperature(hour.temperatureC, scale)}, ${hour.precipitationChance}% chance of precipitation`}
                >
                  <span className="text-[10px] text-muted-foreground">
                    {timeLabel}
                  </span>
                  <Icon
                    className="size-4 text-slate-200"
                    aria-label={label}
                    role="img"
                  />
                  <span className="text-xs font-medium">
                    {formatTemperature(hour.temperatureC, scale)}
                  </span>
                  <span className="text-[10px] text-sky-200">
                    {hour.precipitationChance}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

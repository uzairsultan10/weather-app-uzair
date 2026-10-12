export type HourlyCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "snow"
  | "thunderstorm";

export interface HourlyForecastSample {
  hourOffset: number;
  temperatureC: number;
  condition: HourlyCondition;
  precipitationChance: number;
}

export const hourlyForecastData: HourlyForecastSample[] = [
  { hourOffset: 0, temperatureC: 17, condition: "partly-cloudy", precipitationChance: 5 },
  { hourOffset: 1, temperatureC: 16, condition: "partly-cloudy", precipitationChance: 5 },
  { hourOffset: 2, temperatureC: 16, condition: "cloudy", precipitationChance: 10 },
  { hourOffset: 3, temperatureC: 15, condition: "cloudy", precipitationChance: 10 },
  { hourOffset: 4, temperatureC: 15, condition: "rain", precipitationChance: 35 },
  { hourOffset: 5, temperatureC: 14, condition: "rain", precipitationChance: 45 },
  { hourOffset: 6, temperatureC: 14, condition: "rain", precipitationChance: 30 },
  { hourOffset: 7, temperatureC: 15, condition: "partly-cloudy", precipitationChance: 15 },
  { hourOffset: 8, temperatureC: 16, condition: "partly-cloudy", precipitationChance: 10 },
  { hourOffset: 9, temperatureC: 18, condition: "clear", precipitationChance: 5 },
  { hourOffset: 10, temperatureC: 19, condition: "clear", precipitationChance: 0 },
  { hourOffset: 11, temperatureC: 20, condition: "clear", precipitationChance: 0 },
  { hourOffset: 12, temperatureC: 21, condition: "partly-cloudy", precipitationChance: 5 },
  { hourOffset: 13, temperatureC: 21, condition: "partly-cloudy", precipitationChance: 10 },
  { hourOffset: 14, temperatureC: 20, condition: "cloudy", precipitationChance: 15 },
  { hourOffset: 15, temperatureC: 19, condition: "cloudy", precipitationChance: 20 },
  { hourOffset: 16, temperatureC: 18, condition: "rain", precipitationChance: 35 },
  { hourOffset: 17, temperatureC: 17, condition: "rain", precipitationChance: 40 },
  { hourOffset: 18, temperatureC: 16, condition: "partly-cloudy", precipitationChance: 20 },
  { hourOffset: 19, temperatureC: 15, condition: "partly-cloudy", precipitationChance: 10 },
  { hourOffset: 20, temperatureC: 15, condition: "cloudy", precipitationChance: 10 },
  { hourOffset: 21, temperatureC: 14, condition: "cloudy", precipitationChance: 5 },
  { hourOffset: 22, temperatureC: 14, condition: "partly-cloudy", precipitationChance: 5 },
  { hourOffset: 23, temperatureC: 13, condition: "clear", precipitationChance: 0 },
];

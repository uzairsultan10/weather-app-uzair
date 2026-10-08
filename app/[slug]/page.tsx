import { notFound } from "next/navigation";
import { locations, getLocationBySlug } from "../data/locations";
import { getWeather } from "../actions/actions";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { getWeatherBackground } from "../lib/weatherBackgrounds";
import { connection } from "next/server";

import {
  getCurrentTimeInTimezone,
  formatDate,
  getDayName,
  isNightTime,
} from "../lib/utils";
import { DaysListItem } from "../components/DaysListItem";

export function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  await connection();

  const weather = await getWeather(location.lat, location.lon);
  const todayForecast = weather.daily[0];
  const Icon = getWeatherIcon(weather.current.weatherCode);
  const description = getWeatherDescription(weather.current.weatherCode);
  const isNight = isNightTime(
    weather.current.timezone,
    weather.current.sunrise,
    weather.current.sunset
  );
  const background = getWeatherBackground(weather.current.weatherCode, isNight);


  return (
    <div className={`min-h-screen bg-linear-to-b ${background}`}>
    <div className="max-w-xl mx-auto py-24 px-6">
    <section className="flex flex-col">
    <h2 className="text-xl font-semibold text-shadow-md">
        {location.name}
    </h2>
    <p className="text-base text-muted-foreground text-shadow-sm">
        {formatDate(todayForecast.date)}{" "}
        {getCurrentTimeInTimezone(weather.current.timezone)}
    </p>
    </section>
    
    <div className="flex flex-col gap-16 py-8">
      <header className="flex flex-col gap-8">
        <section className="flex flex-col">
          <h2 className="text-xl font-semibold text-shadow-md">{location.name}</h2>
          <p className="text-base text-muted-foreground">
            {formatDate(todayForecast.date)}{" "}
            {getCurrentTimeInTimezone(weather.current.timezone)}
          </p>
        </section>

        <section className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
                <span className="text-6xl font-light text-shadow-lg">
                {weather.current.temperature}°
                </span>
                <p className="text-base text-muted-foreground text-shadow-sm">
                {description}
                </p>
            </div>
        <Icon isNight={isNight} className="size-28" />
        </section>  
      </header>

      <section>
        <h2 className="text-base font-semibold mb-4 text-shadow-md">
            7-Day Forecast
        </h2>        
        <ul className="flex flex-col">
          {weather.daily.map((day, index) => {
            const DayIcon = getWeatherIcon(day.weatherCode);
            return (
              <DaysListItem
                key={day.date}
                day={getDayName(day.date, index)}
                maxTemp={day.maxTemp}
                minTemp={day.minTemp}
                Icon={DayIcon}
              />
            );
          })}
        </ul>
      </section>
    </div>
</div>
</div>
  );
}
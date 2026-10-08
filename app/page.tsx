import { locations } from "./data/locations";
import { getWeather } from "./actions/actions";
import { getWeatherIcon } from "./lib/weatherIcons";
import { getWeatherDescription } from "./lib/weatherDescriptions";
import { isNightTime } from "./lib/utils";
import { LocationCard } from "./components/LocationCard";

export default async function Home() {
  const weatherData = await Promise.all(
    locations.map(async (location) => {
      const weather = await getWeather(location.lat, location.lon);
      return { location, weather };
    })
  );

  return (
    <div className="max-w-xl mx-auto py-24 px-6">
      <ul className="flex flex-col gap-4">
        {weatherData.map(({ location, weather }) => {
          const Icon = getWeatherIcon(weather.current.weatherCode);
          const description = getWeatherDescription(weather.current.weatherCode);
          const isNight = isNightTime(
            weather.current.timezone,
            weather.current.sunrise,
            weather.current.sunset
          );

          return (
            <li key={location.slug}>
              <LocationCard
                slug={location.slug}
                name={location.name}
                description={description}
                temperature={weather.current.temperature}
                timezone={weather.current.timezone}
                Icon={Icon}
                isNight={isNight}
                weatherCode={weather.current.weatherCode}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
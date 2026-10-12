"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { cities, type City } from "../../data/cities";
import { getWeather } from "../actions/actions";
import { LocationCard } from "./LocationCard";
import { TemperatureToggle } from "./TemperatureToggle";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { isNightTime } from "../lib/utils";

const storageKey = "weather-app-cities";
const defaultCitySlugs = ["london", "new-york", "tokyo"];
const citiesBySlug = new Map(cities.map((city) => [city.slug, city]));

export function HomeCityDashboard() {
  const [citySlugs, setCitySlugs] = useState<string[]>([]);
  const comboboxPortalContainerRef = useRef<HTMLDivElement | null>(null);
  const [weatherBySlug, setWeatherBySlug] = useState<
    Record<string, Awaited<ReturnType<typeof getWeather>>>
  >({});
  const [loadingSlugs, setLoadingSlugs] = useState<string[]>([]);
  const loadingSet = useRef(new Set<string>());
  const [isHydrated, setIsHydrated] = useState(false);
  const [weatherErrors, setWeatherErrors] = useState<Record<string, string>>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [addCityError, setAddCityError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      let savedSlugs = defaultCitySlugs;
      try {
        const storedCities = window.localStorage.getItem(storageKey);
        if (storedCities !== null) {
          const parsed: unknown = JSON.parse(storedCities);
          if (
            !Array.isArray(parsed) ||
            !parsed.every((slug): slug is string => typeof slug === "string")
          ) {
            throw new Error("Saved city list must be an array of city slugs.");
          }

          const invalidSlugs = parsed.filter((slug) => !citiesBySlug.has(slug));
          if (invalidSlugs.length > 0) {
            throw new Error(
              `Saved city list contains unknown slugs: ${invalidSlugs.join(", ")}`
            );
          }

          if (parsed.length > 0) {
            savedSlugs = [...new Set(parsed)];
          }
        }
      } catch (error) {
        console.error("Unable to restore the saved city list.", error);
      }

      if (!cancelled) {
        setCitySlugs(savedSlugs);
        setIsHydrated(true);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(citySlugs));
    } catch (error) {
      console.error("Unable to save the city list to local storage.", error);
    }
  }, [citySlugs, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    for (const slug of citySlugs) {
      const city = citiesBySlug.get(slug);
      if (!city || weatherBySlug[slug] || loadingSet.current.has(slug)) {
        continue;
      }

      loadingSet.current.add(slug);
      setLoadingSlugs((current) =>
        current.includes(slug) ? current : [...current, slug]
      );

      void getWeather(city.latitude, city.longitude)
        .then((weather) => {
          setWeatherBySlug((current) => ({ ...current, [slug]: weather }));
          setWeatherErrors((current) => {
            const next = { ...current };
            delete next[slug];
            return next;
          });
        })
        .catch((error: unknown) => {
          console.error(`Unable to load weather for ${city.name}.`, error);
          setWeatherErrors((current) => ({
            ...current,
            [slug]: `Weather for ${city.name} could not be loaded.`,
          }));
        })
        .finally(() => {
          loadingSet.current.delete(slug);
          setLoadingSlugs((current) =>
            current.filter((loadingSlug) => loadingSlug !== slug)
          );
        });
    }
  }, [citySlugs, isHydrated, weatherBySlug]);

  const availableCities = cities.filter(
    (city) =>
      !citySlugs.includes(city.slug) &&
      city.name.toLocaleLowerCase().includes(citySearch.toLocaleLowerCase())
  );

  function handleAddCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddCityError("");

    if (!selectedCity) {
      setAddCityError("Choose a city before adding it.");
      return;
    }

    if (citySlugs.includes(selectedCity.slug)) {
      setAddCityError(`${selectedCity.name} is already in your list.`);
      return;
    }

    setCitySlugs((current) => [...current, selectedCity.slug]);
    setSelectedCity(null);
    setCitySearch("");
    setDialogOpen(false);
  }

  return (
    <div className="max-w-xl mx-auto py-24 px-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setSelectedCity(null);
              setCitySearch("");
              setAddCityError("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={!isHydrated}
              className="border-border bg-slate-900/50 text-foreground hover:bg-slate-800/70"
            >
              <Plus />
              Add city
            </Button>
          </DialogTrigger>
          <DialogContent className="border border-border bg-slate-900 text-foreground shadow-2xl">
            <DialogHeader>
              <DialogTitle>Add a city</DialogTitle>
              <DialogDescription>
                Search for a city to add it to your weather list.
              </DialogDescription>
            </DialogHeader>

            <div ref={comboboxPortalContainerRef}>
              <form onSubmit={handleAddCity} className="flex flex-col gap-4">
                <Combobox
                  items={availableCities}
                  value={selectedCity}
                  onValueChange={(value) => setSelectedCity(value ?? null)}
                  onInputValueChange={setCitySearch}
                  itemToStringLabel={(city) => city.name}
                >
                  <ComboboxInput
                    placeholder="Search cities..."
                    aria-label="Search cities"
                    showClear
                    className="w-full border-border bg-slate-950/60 text-foreground"
                  />
                  <ComboboxContent
                    container={comboboxPortalContainerRef}
                    className="border border-border bg-slate-900 text-foreground"
                  >
                    <ComboboxList>
                      {availableCities.map((city) => (
                        <ComboboxItem key={city.slug} value={city}>
                          {city.name}
                        </ComboboxItem>
                      ))}
                      <ComboboxEmpty>No cities found.</ComboboxEmpty>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                {addCityError && (
                  <p className="text-sm text-red-300" role="alert">
                    {addCityError}
                  </p>
                )}

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={!selectedCity || !isHydrated}
                    className="bg-sky-500 text-slate-950 hover:bg-sky-400"
                  >
                    Add city
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <TemperatureToggle />
      </div>

      <ul className="flex flex-col gap-4">
        {!isHydrated && (
          <li
            className="rounded-2xl border border-border bg-slate-800/40 px-7 py-6 text-sm text-muted-foreground"
            aria-live="polite"
          >
            Loading your cities...
          </li>
        )}
        {citySlugs.map((slug) => {
          const city = citiesBySlug.get(slug);
          if (!city) return null;

          const weather = weatherBySlug[slug];
          if (!weather) {
            const statusMessage =
              weatherErrors[slug] ??
              (loadingSlugs.includes(slug)
                ? `Loading weather for ${city.name}...`
                : `Weather for ${city.name} is unavailable.`);
            return (
              <li
                key={slug}
                className="rounded-2xl border border-border bg-slate-800/40 px-7 py-6 text-sm text-muted-foreground"
                aria-live="polite"
              >
                {statusMessage}
              </li>
            );
          }

          const Icon = getWeatherIcon(weather.current.weatherCode);
          const description = getWeatherDescription(weather.current.weatherCode);
          const isNight = isNightTime(
            weather.current.timezone,
            weather.current.sunrise,
            weather.current.sunset
          );

          return (
            <li key={slug}>
              <LocationCard
                slug={slug}
                name={city.name}
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

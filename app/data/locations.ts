import { cities } from "../../data/cities";

export interface Location {
  name: string;
  slug: string;
  lat: number;
  lon: number;
}

const defaultCitySlugs = [
  "london",
  "new-york",
  "berlin",
  "new-delhi",
  "beijing",
  "tokyo",
];

function toLocation(city: (typeof cities)[number]): Location {
  return {
    name: city.name,
    slug: city.slug,
    lat: city.latitude,
    lon: city.longitude,
  };
}

export const locations: Location[] = defaultCitySlugs.flatMap((slug) => {
  const city = cities.find((item) => item.slug === slug);
  return city ? [toLocation(city)] : [];
});

export function getLocationBySlug(slug: string): Location | undefined {
  const city = cities.find((item) => item.slug === slug);
  return city ? toLocation(city) : undefined;
}
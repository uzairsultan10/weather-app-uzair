"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { formatTemperature } from "../lib/temperature";

export type TemperatureScale = "C" | "F";

const storageKey = "weather-app-temperature-scale";
const changeEvent = "temperature-scale-change";
let currentScale: TemperatureScale = "C";
let storageUnavailable = false;

interface TemperatureScaleContextValue {
  scale: TemperatureScale;
  setScale: (scale: TemperatureScale) => void;
}

const TemperatureScaleContext =
  createContext<TemperatureScaleContextValue | null>(null);

function getScaleSnapshot(): TemperatureScale {
  if (storageUnavailable) {
    return currentScale;
  }

  try {
    const storedScale = window.localStorage.getItem(storageKey);
    if (storedScale === "C" || storedScale === "F") {
      currentScale = storedScale;
      return storedScale;
    }
    currentScale = "C";
    return "C";
  } catch (error) {
    storageUnavailable = true;
    console.error(
      "Unable to read the temperature scale from local storage.",
      error
    );
    return currentScale;
  }
}

function getServerSnapshot(): TemperatureScale {
  return "C";
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(changeEvent, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(changeEvent, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function setStoredScale(scale: TemperatureScale): void {
  currentScale = scale;
  try {
    window.localStorage.setItem(storageKey, scale);
    storageUnavailable = false;
  } catch (error) {
    storageUnavailable = true;
    console.error(
      "Unable to save the temperature scale to local storage.",
      error
    );
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function TemperatureScaleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const scale = useSyncExternalStore(
    subscribe,
    getScaleSnapshot,
    getServerSnapshot
  );

  return (
    <TemperatureScaleContext.Provider
      value={{ scale, setScale: setStoredScale }}
    >
      {children}
    </TemperatureScaleContext.Provider>
  );
}

export function useTemperatureScale(): TemperatureScaleContextValue {
  const context = useContext(TemperatureScaleContext);
  if (!context) {
    throw new Error(
      "useTemperatureScale must be used within a TemperatureScaleProvider"
    );
  }

  return context;
}

export function useFormattedTemperature(celsius: number): string {
  const { scale } = useTemperatureScale();
  return formatTemperature(celsius, scale);
}

import { useCallback, useEffect, useState } from 'react';
import type {
  Coordinates,
  GeocodingResult,
  WeatherResponse,
} from '../types/weather';
import {
  getCompleteWeather,
  getWeatherByCity,
  searchLocation,
} from '../api/service';

interface UseWeatherOptions {
  autoFetch?: boolean;
  forecastDays?: number;
}

interface UseWeatherReturn {
  weather: WeatherResponse | null;
  loading: boolean;
  error: Error | null;
  fetchWeather: (coordinates: Coordinates) => Promise<void>;
  fetchWeatherByCity: (cityName: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for fetching weather data
 */
export const useWeather = (
  initialCoordinates?: Coordinates,
  options: UseWeatherOptions = {},
): UseWeatherReturn => {
  const { autoFetch = false, forecastDays = 7 } = options;

  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<
    Coordinates | undefined
  >(initialCoordinates);

  const fetchWeather = useCallback(
    async (coordinates: Coordinates) => {
      try {
        setLoading(true);
        setError(null);
        setCurrentCoordinates(coordinates);
        const data = await getCompleteWeather(coordinates, forecastDays);
        setWeather(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [forecastDays],
  );

  const fetchWeatherByCity = useCallback(
    async (cityName: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherByCity(cityName, forecastDays);
        if (data) {
          setWeather(data);
          setCurrentCoordinates({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        } else {
          setError(new Error('City not found'));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [forecastDays],
  );

  const refresh = useCallback(async () => {
    if (currentCoordinates) {
      await fetchWeather(currentCoordinates);
    }
  }, [currentCoordinates, fetchWeather]);

  useEffect(() => {
    if (autoFetch && initialCoordinates) {
      fetchWeather(initialCoordinates);
    }
  }, [autoFetch, initialCoordinates, fetchWeather]);

  return {
    weather,
    loading,
    error,
    fetchWeather,
    fetchWeatherByCity,
    refresh,
  };
};

interface UseLocationSearchReturn {
  results: GeocodingResult[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

/**
 * Custom hook for searching locations
 */
export const useLocationSearch = (): UseLocationSearchReturn => {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchLocation(query, 10);
      setResults(data.results || []);
    } catch (err) {
      setError(err as Error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
};

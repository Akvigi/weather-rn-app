import axiosInstance from '../api';
import type {
  Coordinates,
  GeocodingResponse,
  WeatherResponse,
} from '../../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';

/**
 * Get current weather for specific coordinates
 */
export const getCurrentWeather = async (
  coordinates: Coordinates,
): Promise<WeatherResponse> => {
  const { latitude, longitude } = coordinates;
  const response = await axiosInstance.get<WeatherResponse>('/forecast', {
    params: {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'is_day',
      ].join(','),
      timezone: 'auto',
    },
  });
  return response.data;
};

/**
 * Get hourly weather forecast for specific coordinates
 */
export const getHourlyForecast = async (
  coordinates: Coordinates,
  days: number = 7,
): Promise<WeatherResponse> => {
  const { latitude, longitude } = coordinates;
  const response = await axiosInstance.get<WeatherResponse>('/forecast', {
    params: {
      latitude,
      longitude,
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
      ].join(','),
      forecast_days: days,
      timezone: 'auto',
    },
  });
  return response.data;
};

/**
 * Get daily weather forecast for specific coordinates
 */
export const getDailyForecast = async (
  coordinates: Coordinates,
  days: number = 7,
): Promise<WeatherResponse> => {
  const { latitude, longitude } = coordinates;
  const response = await axiosInstance.get<WeatherResponse>('/forecast', {
    params: {
      latitude,
      longitude,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'precipitation_sum',
        'wind_speed_10m_max',
      ].join(','),
      forecast_days: days,
      timezone: 'auto',
    },
  });
  return response.data;
};

/**
 * Get complete weather data (current, hourly, and daily)
 */
export const getCompleteWeather = async (
  coordinates: Coordinates,
  forecastDays: number = 7,
): Promise<WeatherResponse> => {
  const { latitude, longitude } = coordinates;
  const response = await axiosInstance.get<WeatherResponse>('/forecast', {
    params: {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'is_day',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'precipitation_sum',
        'wind_speed_10m_max',
      ].join(','),
      forecast_days: forecastDays,
      timezone: 'auto',
    },
  });
  return response.data;
};

/**
 * Search for cities by name (geocoding)
 */
export const searchLocation = async (
  query: string,
  count: number = 10,
): Promise<GeocodingResponse> => {
  const response = await axiosInstance.get<GeocodingResponse>(
    `${GEOCODING_API}/search`,
    {
      params: {
        name: query,
        count,
        language: 'en',
        format: 'json',
      },
    },
  );
  return response.data;
};

/**
 * Get weather by city name
 */
export const getWeatherByCity = async (
  cityName: string,
  forecastDays: number = 7,
): Promise<WeatherResponse | null> => {
  try {
    // First, search for the city
    const geoResponse = await searchLocation(cityName, 1);

    if (!geoResponse.results || geoResponse.results.length === 0) {
      return null;
    }

    const location = geoResponse.results[0];

    // Then get weather for that location
    return await getCompleteWeather(
      {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      forecastDays,
    );
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
};

/**
 * Get weather description from weather code
 */
export const getWeatherDescription = (weatherCode: number): string => {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherCodes[weatherCode] || 'Unknown';
};

import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocationSearch, useWeather } from '../hooks/useWeather';
import type { GeocodingResult } from '../types/weather';
import { WEATHER_CODES } from '../types/weather';

const WeatherSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const {
    results,
    loading: searchLoading,
    search,
    clear,
  } = useLocationSearch();
  const {
    weather,
    loading: weatherLoading,
    error,
    fetchWeatherByCity,
  } = useWeather();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      await search(query);
    } else {
      clear();
    }
  };

  const handleSelectCity = async (city: GeocodingResult) => {
    setSelectedCity(`${city.name}, ${city.country}`);
    setSearchQuery('');
    clear();
    await fetchWeatherByCity(city.name);
  };

  const renderCityItem = ({ item }: { item: GeocodingResult }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => handleSelectCity(item)}
    >
      <Text style={styles.cityName}>{item.name}</Text>
      <Text style={styles.cityCountry}>
        {item.admin1 ? `${item.admin1}, ` : ''}
        {item.country}
      </Text>
    </TouchableOpacity>
  );

  const getWeatherIcon = (code: number): string => {
    return WEATHER_CODES[code]?.icon || '🌍';
  };

  const getWeatherDescription = (code: number): string => {
    return WEATHER_CODES[code]?.description || 'Unknown';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="words"
        />
      </View>

      {searchLoading && (
        <ActivityIndicator size="small" style={styles.loader} />
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderCityItem}
          keyExtractor={item => item.id.toString()}
          style={styles.resultsList}
        />
      )}

      {selectedCity && (
        <View style={styles.selectedCityContainer}>
          <Text style={styles.selectedCity}>{selectedCity}</Text>
        </View>
      )}

      {weatherLoading && (
        <View style={styles.weatherLoading}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      )}

      {weather && weather.current && !weatherLoading && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weather.current.weather_code || 0)}
          </Text>

          <Text style={styles.temperature}>
            {Math.round(weather.current.temperature_2m || 0)}°C
          </Text>

          <Text style={styles.description}>
            {getWeatherDescription(weather.current.weather_code || 0)}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>
                {Math.round(weather.current.wind_speed_10m || 0)} km/h
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind Direction</Text>
              <Text style={styles.detailValue}>
                {Math.round(weather.current.wind_direction_10m || 0)}°
              </Text>
            </View>
          </View>

          {weather.daily && weather.daily.time && (
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTitle}>7-Day Forecast</Text>
              {weather.daily.time.slice(0, 7).map((date, index) => (
                <View key={date} style={styles.forecastItem}>
                  <Text style={styles.forecastDate}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.forecastIcon}>
                    {getWeatherIcon(weather.daily!.weather_code[index])}
                  </Text>
                  <Text style={styles.forecastTemp}>
                    {Math.round(weather.daily!.temperature_2m_max[index])}° /{' '}
                    {Math.round(weather.daily!.temperature_2m_min[index])}°
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    overflow: 'scroll',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 8,
  },
  resultsList: {
    maxHeight: 200,
    backgroundColor: '#fff',
  },
  cityItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cityCountry: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectedCityContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedCity: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  weatherLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  weatherContainer: {
    flex: 1,
    padding: 16,
  },
  weatherIcon: {
    fontSize: 80,
    textAlign: 'center',
    marginVertical: 16,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 24,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  forecastContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  forecastDate: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  forecastIcon: {
    fontSize: 24,
    marginHorizontal: 12,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 80,
    textAlign: 'right',
  },
});

export default WeatherSearchScreen;

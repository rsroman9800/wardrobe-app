import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { getUserLocation, getWeather, formatTemperature, formatDescription } from '@/lib/weather';
import Image from 'next/image';

const WeatherDisplay = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user's location
        const location = await getUserLocation();
        
        // Get weather data
        const weatherData = await getWeather(location.latitude, location.longitude);
        setWeather(weatherData);
        
        // Notify parent component if callback provided
        if (onWeatherUpdate) {
          onWeatherUpdate(weatherData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [onWeatherUpdate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!weather) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              {formatTemperature(weather.temp)}
            </div>
            <div className="text-sm text-gray-500">
              Feels like {formatTemperature(weather.feels_like)}
            </div>
            <div className="text-sm font-medium mt-1">
              {formatDescription(weather.description)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {weather.city}, {weather.country}
            </div>
          </div>
          <div className="text-right">
            <div className="relative w-16 h-16">
              <Image 
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-sm text-gray-500">
              Humidity: {weather.humidity}%
            </div>
            <div className="text-sm text-gray-500">
              Wind: {weather.wind_speed} km/h
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
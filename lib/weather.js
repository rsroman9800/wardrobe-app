// Cache weather data for 10 minutes to avoid hitting rate limits
let weatherCache = {
  data: null,
  timestamp: null
};

export const getWeather = async (lat, lon) => {
  try {
    // Check cache first - if data is less than 10 minutes old, return cached data
    const now = Date.now();
    if (weatherCache.data && weatherCache.timestamp && (now - weatherCache.timestamp < 600000)) {
      return weatherCache.data;
    }

    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      throw new Error('OpenWeather API key is not configured in environment variables');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);

    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Weather API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Format the response
    const weatherData = {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name,
      country: data.sys.country,
      wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      timestamp: new Date(data.dt * 1000).toISOString()
    };

    // Update cache
    weatherCache = {
      data: weatherData,
      timestamp: now
    };
    
    return weatherData;
  } catch (error) {
    console.error('Weather fetch error:', error);
    // If we have cached data and encounter an error, return cached data
    if (weatherCache.data) {
      return weatherCache.data;
    }
    throw new Error(error.message || 'Failed to fetch weather data');
  }
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Default to Calgary coordinates if geolocation is not available
      resolve({
        latitude: 51.0447,
        longitude: -114.0719
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        // Default to Calgary coordinates on error
        resolve({
          latitude: 51.0447,
          longitude: -114.0719
        });
      },
      {
        timeout: 5000,
        maximumAge: 600000 // Cache location for 10 minutes
      }
    );
  });
};
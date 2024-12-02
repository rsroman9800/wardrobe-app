// lib/weather.js
export const getWeather = async (lat, lon) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
  
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
  
    const data = await response.json();
    
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
  };
  
  export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('Location permission denied'));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error('Location information unavailable'));
                break;
              case error.TIMEOUT:
                reject(new Error('Location request timed out'));
                break;
              default:
                reject(new Error('An unknown error occurred'));
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }
    });
  };
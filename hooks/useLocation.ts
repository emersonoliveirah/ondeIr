"use client";

import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface UseLocationReturn {
  location: Location | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => void;
  setManualLocation: (lat: number, lng: number, city?: string) => void;
  clearLocation: () => void;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada por este navegador");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Tentar obter informações da cidade usando reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
          );
          
          if (response.ok) {
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              city: data.city || data.locality,
              country: data.countryName
            });
          } else {
            setLocation({ latitude, longitude });
          }
        } catch {
          // Se o reverse geocoding falhar, usar apenas as coordenadas
          setLocation({ latitude, longitude });
        }
        
        setLoading(false);
      },
      (err) => {
        setError("Erro ao obter localização: " + err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  const setManualLocation = (lat: number, lng: number, city?: string) => {
    setLocation({ latitude: lat, longitude: lng, city });
    setError(null);
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  // Tentar obter localização automaticamente ao carregar
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch {
        localStorage.removeItem("userLocation");
      }
    }
  }, []);

  // Salvar localização no localStorage quando ela mudar
  useEffect(() => {
    if (location) {
      localStorage.setItem("userLocation", JSON.stringify(location));
    }
  }, [location]);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    setManualLocation,
    clearLocation
  };
}

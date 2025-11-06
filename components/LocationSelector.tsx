"use client";

import React, { useState } from "react";
import { useLocation } from "@/hooks/useLocation";

interface LocationSelectorProps {
  onLocationChange?: (location: { latitude: number; longitude: number; city?: string }) => void;
}

export default function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const { location, loading, error, getCurrentLocation, setManualLocation, clearLocation } = useLocation();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualCity, setManualCity] = useState("");

  const handleGetCurrentLocation = () => {
    getCurrentLocation();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert("Por favor, insira coordenadas válidas");
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("Coordenadas inválidas. Latitude deve estar entre -90 e 90, longitude entre -180 e 180");
      return;
    }
    
    setManualLocation(lat, lng, manualCity || undefined);
    setShowManualInput(false);
    setManualLat("");
    setManualLng("");
    setManualCity("");
  };

  // Notificar mudanças de localização
  React.useEffect(() => {
    if (location && onLocationChange) {
      onLocationChange(location);
    }
  }, [location, onLocationChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <h3 className="text-lg font-semibold mb-3">📍 Localização</h3>
      
      {location ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {location.city ? `${location.city}, ${location.country}` : "Localização definida"}
              </p>
              <p className="text-sm text-gray-600">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            </div>
            <button
              onClick={clearLocation}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Limpar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Obtendo localização..." : "📍 Usar minha localização atual"}
          </button>
          
          <div className="text-center text-gray-500">ou</div>
          
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
          >
            📍 Inserir localização manual
          </button>
          
          {showManualInput && (
            <form onSubmit={handleManualSubmit} className="space-y-3 mt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade (opcional)
                </label>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="Ex: -23.5505"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="Ex: -46.6333"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Definir Localização
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        <p>💡 Dica: Use sua localização atual para encontrar lugares próximos a você!</p>
      </div>
    </div>
  );
}

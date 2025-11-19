"use client";

import React, { useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import type { Location } from "@/types";

interface LocationSelectorProps {
  onLocationChange?: (location: Location) => void;
}

export default function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const { location, loading, error, getCurrentLocation, setManualLocation, clearLocation } = useLocation();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    getCurrentLocation();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setValidationError("Por favor, insira coordenadas válidas");
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setValidationError("Coordenadas inválidas. Latitude deve estar entre -90 e 90, longitude entre -180 e 180");
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
    <div className="bg-white p-5 rounded-2xl shadow-lg border-2 border-slate-200 mb-6">
      <h3 className="text-xl font-bold mb-4 text-slate-800">📍 Localização</h3>
      
      {location ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-lg mb-1">
                {location.city ? `${location.city}, ${location.country}` : "Localização definida"}
              </p>
              <p className="text-sm text-slate-600 font-mono">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            </div>
            <button
              onClick={clearLocation}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold border border-red-300"
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md transition-all duration-200"
          >
            {loading ? "⏳ Obtendo localização..." : "📍 Usar minha localização atual"}
          </button>
          
          <div className="text-center text-slate-500 font-medium py-2">ou</div>
          
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 font-semibold border border-slate-300 transition-colors"
          >
            📍 Inserir localização manual
          </button>
          
          {showManualInput && (
            <form onSubmit={handleManualSubmit} className="space-y-3 mt-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cidade (opcional)
                </label>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="Ex: -23.5505"
                    className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="Ex: -46.6333"
                    className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-md transition-all duration-200"
                >
                  Definir Localização
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-300 font-semibold border border-slate-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl">
          <p className="text-red-900 text-sm font-semibold">{error}</p>
        </div>
      )}
      
      {validationError && (
        <div className="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl">
          <p className="text-red-900 text-sm font-semibold">{validationError}</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-blue-800 text-xs font-medium">💡 Dica: Use sua localização atual para encontrar lugares próximos a você!</p>
      </div>
    </div>
  );
}

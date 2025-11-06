"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import PlaceCard from "@/components/PlaceCard";
import LocationSelector from "@/components/LocationSelector";

interface Place {
  name: string;
  address: string;
  rating: number | null;
}

interface SearchResult {
  query: string;
  intent: string;
  results: Place[];
  location?: { latitude: number; longitude: number };
}

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; city?: string } | null>(null);

  const handleSearch = (newQuery: string) => {
    router.push(`/results?query=${encodeURIComponent(newQuery)}`);
  };

  const searchPlaces = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery, location: currentLocation }),
      });

      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }

      const data = await response.json();
      setSearchResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar lugares:", err);
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (query) {
      searchPlaces(query);
    }
  }, [query, searchPlaces]);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-6">Descubra lugares com IA ✨</h1>
          <SearchBar onSearch={handleSearch} initialValue={query} />
        </div>

        <LocationSelector onLocationChange={setCurrentLocation} />

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Buscando lugares...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Erro: {error}</p>
          </div>
        )}

        {searchResult && !loading && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Resultados para: &ldquo;{searchResult.query}&rdquo;
              </h2>
              <p className="text-gray-600">
                Intenção detectada: <span className="font-medium">{searchResult.intent}</span>
              </p>
              {searchResult.location && (
                <p className="text-sm text-blue-600">
                  📍 Buscando em um raio de 5km da sua localização
                </p>
              )}
            </div>

            {searchResult.results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum lugar encontrado para esta busca.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Tente uma busca diferente ou mais específica.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.results.map((place, index) => (
                  <PlaceCard key={index} place={place} />
                ))}
              </div>
            )}
          </div>
        )}

        {!query && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Digite uma busca para encontrar lugares!</p>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import PlaceCard from "@/components/PlaceCard";
import LocationSelector from "@/components/LocationSelector";
import type { SearchResult, Location } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Erro na busca: ${response.status}`
        );
      }

      const data = await response.json();
      
      // Validação dos dados recebidos
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Formato de resposta inválido");
      }
      
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Descubra lugares com IA ✨</h1>
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>
        </div>

        <LocationSelector onLocationChange={setCurrentLocation} />

        {loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-slate-200">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-700 font-medium">Buscando lugares...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-400 rounded-xl p-5 mb-6 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-900 font-semibold">Erro: {error}</p>
            </div>
          </div>
        )}

        {searchResult && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <h2 className="text-2xl font-bold mb-3 text-slate-800">
                Resultados para: &ldquo;{searchResult.query}&rdquo;
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                  🎯 {searchResult.intent}
                </span>
                {searchResult.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    📍 Raio de 5km
                  </span>
                )}
              </div>
            </div>

            {searchResult.results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-700 font-medium text-lg mb-2">Nenhum lugar encontrado para esta busca.</p>
                <p className="text-sm text-slate-500">
                  Tente uma busca diferente ou mais específica.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.results.map((place, index) => (
                  <PlaceCard key={index} place={place} />
                ))}
              </div>
            )}
          </div>
        )}

        {!query && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-slate-200">
            <div className="text-5xl mb-4">🔎</div>
            <p className="text-slate-700 font-medium text-lg">Digite uma busca para encontrar lugares!</p>
          </div>
        )}
      </div>
    </main>
  );
}

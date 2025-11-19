"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
}

export default function SearchBar({ 
  onSearch, 
  placeholder, 
  initialValue,
  debounceMs = 0 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue || "");

  // Debounce para melhorar performance
  useEffect(() => {
    if (debounceMs > 0 && query.trim()) {
      const timer = setTimeout(() => {
        onSearch(query);
      }, debounceMs);
      
      return () => clearTimeout(timer);
    }
  }, [query, debounceMs, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg items-center gap-2"
      aria-label="Formulário de busca"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Ex: quero sair para conversar com meu namorado"}
        className="flex-1 p-4 rounded-2xl border-2 border-slate-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-slate-800 placeholder:text-slate-400"
        aria-label="Campo de busca"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold disabled:from-slate-400 disabled:to-slate-500"
        disabled={!query.trim()}
        aria-label="Buscar lugares"
      >
        Buscar
      </button>
    </form>
  );
}

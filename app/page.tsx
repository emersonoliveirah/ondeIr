"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Descubra lugares com IA ✨</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex: quero sair para conversar com meu namorado"
        className="w-full max-w-lg p-3 rounded-2xl border shadow-md"
      />
      <button
        onClick={handleSearch}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
      >
        Buscar
      </button>
    </main>
  );
}

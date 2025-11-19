"use client";

import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="text-center mb-8 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
          Descubra lugares com IA ✨
        </h1>
        <p className="text-slate-200 text-lg md:text-xl mb-10 leading-relaxed">
          Digite o que você está procurando e deixe a inteligência artificial encontrar os melhores lugares para você
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Ex: quero sair para conversar com meu namorado"
          />
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:bg-white transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="font-bold text-lg mb-3 text-slate-800">IA Inteligente</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Nossa IA entende sua intenção e encontra os lugares perfeitos
          </p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:bg-white transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="font-bold text-lg mb-3 text-slate-800">Localização Precisa</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Encontre lugares próximos a você ou em qualquer localização
          </p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:bg-white transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="font-bold text-lg mb-3 text-slate-800">Resultados Rápidos</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Obtenha resultados instantâneos com informações detalhadas
          </p>
        </div>
      </div>
    </main>
  );
}

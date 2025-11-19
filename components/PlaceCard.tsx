import type { Place } from "@/types";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <div className="p-6 border-2 border-slate-200 rounded-2xl shadow-md bg-white hover:shadow-xl hover:border-purple-300 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-800 flex-1 leading-tight">{place.name}</h3>
        {place.rating && (
          <div className="flex items-center gap-1 ml-3 px-2 py-1 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-yellow-500 text-lg">⭐</span>
            <span className="text-sm font-bold text-slate-800">
              {place.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{place.address}</p>
      
      {place.distance && (
        <div className="mb-4 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200 inline-block">
          <p className="text-xs font-semibold text-blue-700">
            📍 {place.distance < 1000 
              ? `${Math.round(place.distance)}m de distância`
              : `${(place.distance / 1000).toFixed(1)}km de distância`}
          </p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
        {place.phone && (
          <a
            href={`tel:${place.phone}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium border border-green-200"
            aria-label={`Ligar para ${place.name}`}
          >
            <span>📞</span>
            <span>{place.phone}</span>
          </a>
        )}
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium border border-purple-200"
            aria-label={`Visitar site de ${place.name}`}
          >
            <span>🌐</span>
            <span>Site</span>
          </a>
        )}
      </div>
    </div>
  );
}
  
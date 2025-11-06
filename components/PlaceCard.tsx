interface Place {
  name: string;
  address: string;
  rating: number | null;
}

export default function PlaceCard({ place }: { place: Place }) {
    return (
      <div className="p-4 border rounded-xl shadow-sm bg-white">
        <h3 className="text-lg font-bold">{place.name}</h3>
        <p className="text-gray-600">{place.address}</p>
        {place.rating && (
          <p className="text-sm text-yellow-600">⭐ {place.rating}</p>
        )}
      </div>
    );
  }
  
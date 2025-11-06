import fetch from "node-fetch";

interface Place {
  name: string;
  address: string;
  rating: number | null;
}

interface OverpassElement {
  tags?: {
    name?: string;
    addr_full?: string;
    addr_street?: string;
    addr_housenumber?: string;
    addr_district?: string;
    addr_city?: string;
    addr_state?: string;
    addr_country?: string;
    addr_postcode?: string;
    addr_place?: string;
    addr_suburb?: string;
    website?: string;
    phone?: string;
    amenity?: string;
    tourism?: string;
    shop?: string;
    cuisine?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export async function searchPlaces(intent: string, location?: { latitude: number; longitude: number }): Promise<Place[]> {
  try {
    // Usar OpenStreetMap (Overpass API) como fonte principal
    const query = buildOverpassQuery(intent, location);
    
    const osmRes = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );

    if (!osmRes.ok) {
      throw new Error(`Overpass API error: ${osmRes.status}`);
    }

    const osmData = await osmRes.json() as OverpassResponse;
    
    if (!osmData.elements || osmData.elements.length === 0) {
      // Tentar busca alternativa sem filtro de nome
      return await tryAlternativeSearch(intent, location);
    }

    // Filtrar e processar apenas lugares com dados completos
    const validPlaces = osmData.elements
      .filter((element: OverpassElement) => {
        // Apenas lugares com nome
        return element.tags?.name && element.tags.name.trim() !== "";
      })
      .map((element: OverpassElement) => ({
        name: element.tags?.name || "Lugar sem nome",
        address: buildAddress(element.tags),
        rating: null, // OSM não tem ratings, mas podemos implementar depois
      }))
      .slice(0, 10); // Limitar a 10 resultados

    if (validPlaces.length === 0) {
      return await tryAlternativeSearch(intent, location);
    }

    return validPlaces;
  } catch (error) {
    console.error("Erro ao buscar lugares:", error);
    // Em caso de erro, retornar lugares de exemplo
    return getExamplePlaces(intent);
  }
}

async function tryAlternativeSearch(intent: string, location?: { latitude: number; longitude: number }): Promise<Place[]> {
  try {
    // Busca alternativa sem filtro de nome
    const amenityMap: Record<string, string> = {
      comida: "restaurant|cafe|fast_food|food_court|ice_cream|pub|biergarten",
      bebida: "bar|pub|cafe|biergarten",
      entretenimento: "cinema|theatre|museum|gallery|zoo|theme_park",
      lazer: "park|garden|sports_centre|fitness_centre|swimming_pool|golf_course",
      compras: "supermarket|convenience|clothes|shoes|electronics|books|pharmacy|bakery|butcher",
      hospedagem: "hotel|hostel|guest_house|apartment|resort",
      transporte: "bus_station|train_station|airport|ferry_terminal",
      saúde: "hospital|clinic|pharmacy|dentist|doctors",
      educação: "school|university|college|library",
      religião: "place_of_worship"
    };

    const amenity = amenityMap[intent] || "restaurant|cafe|bar";
    
    const alternativeQuery = location ? `
      [out:json][timeout:25];
      (
        node["amenity"~"${amenity}"](around:5000,${location.latitude},${location.longitude});
        way["amenity"~"${amenity}"](around:5000,${location.latitude},${location.longitude});
      );
      out center;
      limit 20;
    ` : `
      [out:json][timeout:25];
      (
        node["amenity"~"${amenity}"];
        way["amenity"~"${amenity}"];
      );
      out center;
      limit 20;
    `;

    const osmRes = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(alternativeQuery)}`
    );

    if (!osmRes.ok) {
      throw new Error(`Alternative search failed: ${osmRes.status}`);
    }

    const osmData = await osmRes.json() as OverpassResponse;
    
    if (!osmData.elements || osmData.elements.length === 0) {
      return getExamplePlaces(intent);
    }

    // Processar resultados alternativos
    const validPlaces = osmData.elements
      .map((element: OverpassElement) => ({
        name: element.tags?.name || `Lugar ${element.tags?.amenity || 'desconhecido'}`,
        address: buildAddress(element.tags),
        rating: null,
      }))
      .slice(0, 10);

    return validPlaces.length > 0 ? validPlaces : getExamplePlaces(intent);
  } catch (error) {
    console.error("Erro na busca alternativa:", error);
    return getExamplePlaces(intent);
  }
}

function buildOverpassQuery(intent: string, location?: { latitude: number; longitude: number }): string {
  // Query específica baseada na intenção
  const amenityMap: Record<string, string> = {
    comida: "restaurant",
    bebida: "bar|pub",
    entretenimento: "cinema|theatre|museum|gallery|zoo|theme_park",
    lazer: "park|garden|sports_centre|fitness_centre|swimming_pool|golf_course",
    compras: "supermarket|convenience|clothes|shoes|electronics|books|pharmacy|bakery|butcher",
    hospedagem: "hotel|hostel|guest_house|apartment|resort",
    transporte: "bus_station|train_station|airport|ferry_terminal",
    saúde: "hospital|clinic|pharmacy|dentist|doctors",
    educação: "school|university|college|library",
    religião: "place_of_worship"
  };

  const amenity = amenityMap[intent] || "restaurant";
  
  if (location) {
    // Usar coordenadas específicas com raio de 5km
    return `[out:json][timeout:25];node["amenity"~"${amenity}"](around:5000,${location.latitude},${location.longitude});out center;`;
  } else {
    // Query genérica sem localização específica
    return `[out:json][timeout:25];node["amenity"~"${amenity}"];out center;`;
  }
}

function buildAddress(tags?: OverpassElement['tags']): string {
  if (!tags) return "Endereço não disponível";
  
  const parts = [];
  
  // Tentar construir endereço completo usando campos do OpenStreetMap
  if (tags.addr_street) parts.push(tags.addr_street);
  if (tags.addr_housenumber) parts.push(tags.addr_housenumber);
  if (tags.addr_suburb) parts.push(tags.addr_suburb);
  if (tags.addr_place) parts.push(tags.addr_place);
  if (tags.addr_city) parts.push(tags.addr_city);
  if (tags.addr_state) parts.push(tags.addr_state);
  
  // Se não tem endereço completo, tentar alternativas
  if (parts.length === 0) {
    if (tags.addr_full) return tags.addr_full;
    if (tags.addr_postcode) return `CEP: ${tags.addr_postcode}`;
    if (tags.phone) return `Tel: ${tags.phone}`;
    if (tags.website) return "Ver site para endereço";
  }
  
  return parts.length > 0 ? parts.join(", ") : "Endereço não disponível";
}

function getExamplePlaces(intent: string): Place[] {
  // Lugares de exemplo baseados na intenção para demonstração
  const examplePlaces: Record<string, Place[]> = {
    comida: [
      { name: "Restaurante Sabor & Arte", address: "Rua das Flores, 123 - Centro", rating: 4.5 },
      { name: "Pizzaria Bella Vista", address: "Av. Principal, 456 - Vila Nova", rating: 4.2 },
      { name: "Café Central", address: "Praça da Liberdade, 789 - Centro", rating: 4.0 },
      { name: "Lanchonete do João", address: "Rua Comercial, 321 - Bairro Novo", rating: 3.8 }
    ],
    bebida: [
      { name: "Bar do Zé", address: "Rua da Noite, 100 - Centro", rating: 4.3 },
      { name: "Pub Irlandês", address: "Av. Internacional, 200 - Vila", rating: 4.1 },
      { name: "Café Especial", address: "Rua das Artes, 150 - Centro", rating: 4.4 },
      { name: "Lounge Moderno", address: "Praça da Cultura, 300 - Centro", rating: 4.0 }
    ],
    lazer: [
      { name: "Parque Central", address: "Av. das Árvores, s/n - Centro", rating: 4.6 },
      { name: "Praça da Liberdade", address: "Centro da Cidade", rating: 4.2 },
      { name: "Academia FitLife", address: "Rua do Esporte, 500 - Vila", rating: 4.1 },
      { name: "Piscina Municipal", address: "Complexo Esportivo - Centro", rating: 4.0 }
    ],
    entretenimento: [
      { name: "Cinema Multiplex", address: "Shopping Center, 2º andar", rating: 4.3 },
      { name: "Teatro Municipal", address: "Praça das Artes, 1 - Centro", rating: 4.5 },
      { name: "Museu da Cidade", address: "Rua da História, 50 - Centro", rating: 4.2 },
      { name: "Galeria de Arte", address: "Rua das Artes, 75 - Centro", rating: 4.0 }
    ],
    compras: [
      { name: "Shopping Center", address: "Av. Comercial, 1000 - Centro", rating: 4.4 },
      { name: "Supermercado Bom Preço", address: "Rua do Comércio, 200 - Vila", rating: 4.1 },
      { name: "Farmácia Central", address: "Rua da Saúde, 150 - Centro", rating: 4.0 },
      { name: "Livraria Cultura", address: "Praça do Conhecimento, 25 - Centro", rating: 4.3 }
    ]
  };

  return examplePlaces[intent] || examplePlaces.comida;
}

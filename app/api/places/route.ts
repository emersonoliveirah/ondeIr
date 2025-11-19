import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/places";
import { interpretQuery } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, location } = body;

    // Validação de entrada
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query é obrigatória e deve ser uma string não vazia" },
        { status: 400 }
      );
    }

    // Validação de localização se fornecida
    if (location) {
      if (
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number" ||
        location.latitude < -90 ||
        location.latitude > 90 ||
        location.longitude < -180 ||
        location.longitude > 180
      ) {
        return NextResponse.json(
          { error: "Coordenadas de localização inválidas" },
          { status: 400 }
        );
      }
    }

    // Interpreta a frase com IA
    const intent = await interpretQuery(query);

    // Busca locais com base na intenção e localização
    const results = await searchPlaces(intent, location);

    return NextResponse.json({ query, intent, results, location });
  } catch (error) {
    console.error("Erro na API de lugares:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/places";
import { interpretQuery } from "@/lib/ai";

export async function POST(req: Request) {
  const { query, location } = await req.json();

  // Interpreta a frase com IA
  const intent = await interpretQuery(query);

  // Busca locais com base na intenção e localização
  const results = await searchPlaces(intent, location);

  return NextResponse.json({ query, intent, results, location });
}

import { NextResponse } from "next/server";
import { interpretQuery } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    // Validação de entrada
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query é obrigatória e deve ser uma string não vazia" },
        { status: 400 }
      );
    }

    const intent = await interpretQuery(query);
    return NextResponse.json({ query, intent });
  } catch (error) {
    console.error("Erro na API de interpretação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

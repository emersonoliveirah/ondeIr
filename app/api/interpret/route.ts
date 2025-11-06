import { NextResponse } from "next/server";
import { interpretQuery } from "@/lib/ai";

export async function POST(req: Request) {
  const { query } = await req.json();
  const intent = await interpretQuery(query);
  return NextResponse.json({ query, intent });
}

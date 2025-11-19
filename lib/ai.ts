// Usando fetch nativo do Next.js

// Mapeamento de palavras-chave para categorias de lugares
const categoryMapping: Record<string, string[]> = {
  comida: ["restaurante", "pizzaria", "hamburgueria", "lanchonete", "fast food", "comida japonesa", "comida italiana", "comida chinesa"],
  bebida: ["bar", "pub", "café", "lanchonete", "bebida"],
  entretenimento: ["cinema", "teatro", "museu", "galeria", "parque", "shopping", "centro comercial"],
  lazer: ["parque", "praça", "jardim", "praia", "piscina", "academia", "esporte"],
  compras: ["shopping", "loja", "supermercado", "farmácia", "livraria", "eletrônicos"],
  hospedagem: ["hotel", "pousada", "hostel", "albergue"],
  transporte: ["estação", "terminal", "aeroporto", "rodoviária"],
  saúde: ["hospital", "clínica", "farmácia", "posto de saúde"],
  educação: ["escola", "universidade", "biblioteca", "livraria"],
  religião: ["igreja", "templo", "mesquita", "sinagoga"]
};

export async function interpretQuery(query: string): Promise<string> {
  try {
    // Usar Hugging Face Inference API gratuita (sem API key necessária para alguns modelos)
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Classifique a intenção desta busca: "${query}". Responda apenas com uma palavra: comida, bebida, entretenimento, lazer, compras, hospedagem, transporte, saúde, educação, religião.`,
          parameters: {
            max_length: 20,
            temperature: 0.1
          }
        }),
      }
    );

    if (hfRes.ok) {
      const result = await hfRes.json() as Array<{ generated_text: string }>;
      if (result && result[0] && result[0].generated_text) {
        const classification = result[0].generated_text.toLowerCase().trim();
        const category = findBestCategory(classification);
        if (category) return category;
      }
    }
  } catch (error) {
    console.error("Hugging Face API falhou, usando classificação local:", error);
  }

  // Fallback: classificação local baseada em palavras-chave
  return classifyQueryLocally(query);
}

function findBestCategory(classification: string): string | null {
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    if (keywords.some(keyword => classification.includes(keyword))) {
      return category;
    }
  }
  return null;
}

function classifyQueryLocally(query: string): string {
  const text = query.toLowerCase();
  
  // Busca por palavras-chave específicas
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  // Busca por padrões comuns mais específicos
  if (text.includes("comer") || text.includes("jantar") || text.includes("almoçar") || text.includes("lanche") || text.includes("refeição")) {
    return "comida";
  }
  if (text.includes("beber") || text.includes("tomar") || text.includes("happy hour") || text.includes("bebida")) {
    return "bebida";
  }
  if (text.includes("passear") || text.includes("caminhar") || text.includes("exercitar") || text.includes("lazer")) {
    return "lazer";
  }
  if (text.includes("comprar") || text.includes("shopping") || text.includes("loja") || text.includes("mercado")) {
    return "compras";
  }
  if (text.includes("dormir") || text.includes("hospedar") || text.includes("pernoitar") || text.includes("hotel")) {
    return "hospedagem";
  }
  if (text.includes("viajar") || text.includes("ir para") || text.includes("chegar") || text.includes("transporte")) {
    return "transporte";
  }
  if (text.includes("doente") || text.includes("médico") || text.includes("remédio") || text.includes("saúde")) {
    return "saúde";
  }
  if (text.includes("estudar") || text.includes("curso") || text.includes("aprender") || text.includes("escola")) {
    return "educação";
  }
  if (text.includes("rezar") || text.includes("missa") || text.includes("culto") || text.includes("igreja")) {
    return "religião";
  }
  if (text.includes("diversão") || text.includes("entreter") || text.includes("filme") || text.includes("show") || text.includes("cinema")) {
    return "entretenimento";
  }
  
  // Padrão padrão: café/restaurante
  return "comida";
}

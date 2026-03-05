import { GoogleGenAI, Type } from "@google/genai";
import { Goal, Theme, TurnResponse, PlayerProfile } from "../types";

const TEXT_MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-2.5-flash-image";

function getAiInstance() {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: apiKey });
}

const turnSchema = {
  type: Type.OBJECT,
  properties: {
    consequencia_imediata: { type: Type.STRING, description: "O que acontece logo após a decisão (curto)." },
    consequencia_futura: { type: Type.STRING, description: "Impacto de longo prazo (curto)." },
    stats_change: {
      type: Type.OBJECT,
      properties: {
        dinheiro: { type: Type.NUMBER, description: "Variação entre -10 e 10." },
        conhecimento: { type: Type.NUMBER, description: "Variação entre -10 e 10." },
        relacionamentos: { type: Type.NUMBER, description: "Variação entre -10 e 10." },
        energia: { type: Type.NUMBER, description: "Variação entre -10 e 10." },
        saude: { type: Type.NUMBER, description: "Variação entre -10 e 10." },
        fama: { type: Type.NUMBER, description: "Variação entre -10 e 10." },
        sanidade: { type: Type.NUMBER, description: "Variação entre -10 e 10." },
      },
      required: ["dinheiro", "conhecimento", "relacionamentos", "energia", "saude", "fama", "sanidade"]
    },
    nova_situacao: { type: Type.STRING, description: "A nova situação narrativa (curta e direta)." },
    opcoes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "4 opções de decisão curtas e impactantes."
    },
    image_prompt: { type: Type.STRING, description: "Um prompt detalhado em inglês para gerar uma imagem da cena atual (ex: 'A cyberpunk hacker running from police in a neon alleyway')." }
  },
  required: [
    "consequencia_imediata",
    "consequencia_futura",
    "stats_change",
    "nova_situacao",
    "opcoes",
    "image_prompt"
  ]
};

const initialSchema = {
  type: Type.OBJECT,
  properties: {
    scenario: { type: Type.STRING, description: "A situação inicial do jogo (curta e direta)." },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "4 opções iniciais para o jogador."
    },
    image_prompt: { type: Type.STRING, description: "Um prompt detalhado em inglês para a imagem inicial." }
  },
  required: ["scenario", "options", "image_prompt"]
};

export async function generateImage(prompt: string, base64Image?: string | null): Promise<string> {
  try {
    const ai = getAiInstance();
    const finalPrompt = base64Image 
      ? `Use the provided image as a reference for the main character's face/appearance. ${prompt}` 
      : prompt;
      
    const parts: any[] = [{ text: finalPrompt }];
    
    if (base64Image) {
      // Extract mime type and base64 data from data URL
      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.unshift({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation failed:", error);
    // Fallback to a placeholder if generation fails
    return `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 10))}/800/600?grayscale&blur=2`;
  }
}

export async function startSimulation(goal: Goal, theme: Theme, profile: PlayerProfile, maxTurns: number) {
  const prompt = `
    Você é um narrador de um jogo de simulação de vida chamado "Decisão Extrema".
    
    PERFIL DO JOGADOR:
    Nome: ${profile.name}
    Origem: ${profile.location}
    Background: ${profile.background}
    
    OBJETIVO: ${goal}
    TEMA/ERA: ${theme}
    DURAÇÃO DA HISTÓRIA: ${maxTurns} turnos.
    
    Crie uma situação inicial desafiadora condizente com o tema e o background do personagem.
    Forneça 4 opções de decisão estratégicas.
    Mantenha o tom sério e realista dentro do contexto do tema.
    Seja conciso. Textos curtos e diretos.
  `;

  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: initialSchema,
      temperature: 0.8,
    },
  });

  let text = response.text;
  if (!text) throw new Error("No response from AI");
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text) as { scenario: string; options: string[]; image_prompt: string };
}

export async function processDecision(
  goal: Goal,
  theme: Theme,
  profile: PlayerProfile,
  currentScenario: string,
  decision: string,
  turn: number,
  maxTurns: number
): Promise<TurnResponse> {
  const prompt = `
    Você é um sistema de simulação estratégica de vida.
    
    JOGADOR: ${profile.name} (${profile.background})
    OBJETIVO: ${goal}
    TEMA: ${theme}
    TURNO: ${turn}/${maxTurns}
    
    SITUAÇÃO ANTERIOR: "${currentScenario}"
    DECISÃO TOMADA: "${decision}"

    Baseado nisso, gere:
    1) Consequência imediata (curta)
    2) Consequência em 2 anos (curta)
    3) Alterações nos 7 indicadores (dinheiro, conhecimento, relacionamentos, energia, saúde, fama, sanidade). Valores entre -10 e 10.
    4) Uma NOVA situação narrativa decorrente dessa consequência para o próximo turno (curta).
    5) 4 novas opções de decisão.
    6) Um prompt visual em inglês descrevendo a AÇÃO ou a NOVA SITUAÇÃO.

    Se for o turno ${maxTurns}, a "nova_situacao" deve ser um texto de conclusão preparando para o relatório final, e as opções podem ser vazias.
  `;

  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: turnSchema,
      temperature: 0.7,
    },
  });

  let text = response.text;
  if (!text) throw new Error("No response from AI");
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text) as TurnResponse;
}

export async function generateFinalReport(
  goal: Goal,
  theme: Theme,
  profile: PlayerProfile,
  history: string[],
  finalStats: any
) {
  const prompt = `
    Gere um relatório final detalhado para o jogo "Decisão Extrema".
    
    JOGADOR: ${profile.name} de ${profile.location}
    OBJETIVO: ${goal}
    TEMA: ${theme}
    STATUS FINAL: ${JSON.stringify(finalStats)}
    HISTÓRICO: ${JSON.stringify(history)}

    O relatório deve conter:
    1. Perfil do jogador (Estratégico, Impulsivo, Equilibrado, ou Agressivo)
    2. Estilo de Jogo (Como o jogador tomou decisões? Foi cauteloso, arriscado, focado em dinheiro, focado em relacionamentos?)
    3. Resumo da trajetória (2 parágrafos)
    4. Análise estratégica final (O que poderia ter sido melhor?)
    5. Conclusão do objetivo (O jogador conseguiu atingir o objetivo inicial? Sim/Não e por que?)
    6. Resultado da Vida (Como terminou sua vida? Morreu? Viveu feliz? Foi esquecido? Virou lenda?)

    Retorne em JSON.
  `;

  const ai = getAiInstance();
  const schema = {
    type: Type.OBJECT,
    properties: {
      perfil: { type: Type.STRING },
      estilo_jogo: { type: Type.STRING },
      resumo: { type: Type.STRING },
      analise: { type: Type.STRING },
      conclusao_objetivo: { type: Type.STRING },
      resultado_vida: { type: Type.STRING }
    },
    required: ["perfil", "estilo_jogo", "resumo", "analise", "conclusao_objetivo", "resultado_vida"]
  };

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.7,
    },
  });

  let text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    // Try to extract JSON if there's markdown or extra text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      text = match[0];
    } else {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    return JSON.parse(text) as { perfil: string; estilo_jogo: string; resumo: string; analise: string; conclusao_objetivo: string; resultado_vida: string };
  } catch (e) {
    console.error("Failed to parse final report JSON:", text, e);
    // Fallback report so the game doesn't get stuck
    return {
      perfil: "Sobrevivente",
      estilo_jogo: "Desconhecido",
      resumo: "A simulação foi concluída, mas os registros foram corrompidos. Você sobreviveu aos desafios, mas os detalhes exatos da sua jornada se perderam no tempo.",
      analise: "O sistema não conseguiu processar a análise estratégica completa devido a uma anomalia temporal.",
      conclusao_objetivo: "Status desconhecido.",
      resultado_vida: "Seu destino permanece um mistério."
    };
  }
}

export async function generateStoryVideo(summary: string, lifeOutcome: string): Promise<string> {
  const ai = getAiInstance();
  const prompt = `A cinematic, dramatic short video trailer. Story: ${summary}. Final scene: ${lifeOutcome}. High quality, epic lighting, photorealistic, movie trailer style.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt.slice(0, 1000),
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed to return a URI.");

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey || '',
    },
  });

  if (!response.ok) {
     throw new Error("Failed to fetch video blob");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

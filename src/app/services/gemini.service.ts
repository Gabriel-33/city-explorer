// services/gemini.service.ts
import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';
import { ItineraryRequest, ItineraryResponse } from '../interfaces/itinerary.interface';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  async generateItinerary(request: ItineraryRequest): Promise<ItineraryResponse> {
    const prompt = this.buildPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseResponse(text, request);
    } catch (error) {
      console.error('Erro ao gerar itinerário:', error);
      throw new Error('Erro ao gerar itinerário. Tente novamente.');
    }
  }

  private buildPrompt(request: ItineraryRequest): string {
    const budgetMap = {
      'economico': 'econômico (foco em atrações gratuitas ou baratas)',
      'moderado': 'moderado (mistura de atrações gratuitas e pagas)',
      'luxo': 'luxo (incluindo restaurantes finos e experiências premium)'
    };

    const budget = budgetMap[request.budget || 'moderado'];
    const interests = request.interests?.join(', ') || 'pontos turísticos principais';

    return `
Crie um roteiro de viagem detalhado para ${request.duration} dias em ${request.city}, ${request.state}, Brasil.

CONTEXTO:
- Cidade: ${request.city}, ${request.state}
- Duração: ${request.duration} dias
- Orçamento: ${budget}
- Interesses: ${interests}

INSTRUÇÕES:
1. Crie um itinerário diário organizado
2. Para CADA local inclua:
   - Nome do local
   - Descrição curta (1-2 frases)
   - Link de imagem, pode ser uma imagem genérica
   - Duração estimada da visita
   - Melhor horário para visitar
   - Custo (gratuito, barato, moderado, caro)
   - Categoria (cultural, natureza, gastronomia, compras, entretenimento)

3. Organize os locais geograficamente para otimizar deslocamento
4. Inclua dicas práticas para a cidade
5. Seja REALISTA - não sobrecarregue o dia
6. Inclua opções para diferentes momentos do dia

FORMATO DE RESPOSTA EM JSON:
{
  "city": "${request.city}",
  "state": "${request.state}", 
  "summary": "Resumo geral da cidade",
  "days": [
    {
      "day": 1,
      "title": "Título do dia",
      "places": [
        {
          "name": "Nome do local",
          "description": "Descrição",
          "imageUrl": "https://exemplo.com/imagem.jpg",
          "visitDuration": "2 horas",
          "bestTime": "Manhã",
          "cost": "gratuito",
          "category": "cultural"
        }
      ]
    }
  ],
  "tips": ["Dica 1", "Dica 2"]
}

IMPORTANTE: Responda APENAS com o JSON válido, sem texto adicional.
    `;
  }

  private parseResponse(text: string, request: ItineraryRequest): ItineraryResponse {
    try {
      // Limpar a resposta e extrair JSON
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText);
      
      // Validar e completar dados se necessário
      return this.validateResponse(parsed, request);
    } catch (error) {
      console.error('Erro ao parsear resposta:', error);
      throw new Error('Erro ao processar itinerário. Tente novamente.');
    }
  }

  private validateResponse(response: any, request: ItineraryRequest): ItineraryResponse {
    // Garantir que todos os campos necessários existam
    return {
      city: response.city || request.city,
      state: response.state || request.state,
      summary: response.summary || `Roteiro para ${request.duration} dias em ${request.city}`,
      days: response.days || [],
      tips: response.tips || this.generateDefaultTips(request)
    };
  }

  private generateDefaultTips(request: ItineraryRequest): string[] {
    return [
      `Use protetor solar - ${request.city} tem clima quente`,
      'Leve uma garrafa de água reutilizável',
      'Baixe o aplicativo de transporte local',
      'Confirme horários de funcionamento antes de visitar',
      'Tenha dinheiro em espécie para pequenas compras'
    ];
  }
}
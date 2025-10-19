// pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { SeoService } from '../../services/seo.service';
import { ItineraryRequest, ItineraryResponse } from '../../interfaces/itinerary.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  itineraryForm: FormGroup;
  isLoading = false;
  itinerary: ItineraryResponse | null = null;
  error: string | null = null;

  states = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ];

  interestsList = [
    'Praias', 'Trilhas', 'Museus', 'Gastronomia', 'Compras', 'História',
    'Arquitetura', 'Vida Noturna', 'Esportes', 'Arte', 'Religião', 'Festivais'
  ];

  budgetOptions = [
    { value: 'economico', label: 'Econômico' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'luxo', label: 'Luxo' }
  ];

  constructor(
    private fb: FormBuilder,
    private geminiService: GeminiService,
    private seoService: SeoService
  ) {
    this.itineraryForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
      budget: ['moderado'],
      interests: [[]]
    });
  }

  ngOnInit() {
    this.setSeoTags();
  }

  private setSeoTags() {
    this.seoService.setMetaTags({
      title: 'Explorador de Cidades Brasileiras - Roteiros Personalizados com IA',
      description: 'Crie roteiros de viagem personalizados para cidades brasileiras usando IA. Descubra os melhores lugares, horários e dicas para sua viagem.',
      keywords: 'roteiro viagem, cidades brasileiras, turismo brasil, planejador viagem, pontos turísticos, dicas viagem, ia, inteligência artificial',
      image: '/assets/og-image.jpg',
      url: 'https://meu-explorador.netlify.app'
    });
  }

  async onSubmit() {
    if (this.itineraryForm.valid) {
      this.isLoading = true;
      this.error = null;
      this.itinerary = null;

      try {
        const request: ItineraryRequest = this.itineraryForm.value;
        this.itinerary = await this.geminiService.generateItinerary(request);
        
        // Atualizar meta tags quando um itinerário é gerado
        if (this.itinerary) {
          this.updateSeoForItinerary(this.itinerary);
        }
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    }
  }

  private updateSeoForItinerary(itinerary: ItineraryResponse) {
    this.seoService.setMetaTags({
      title: `Roteiro para ${itinerary.city}, ${itinerary.state} - ${itinerary.days.length} dias`,
      description: `Roteiro de viagem para ${itinerary.city} com ${itinerary.days.length} dias. ${itinerary.summary}`,
      keywords: `roteiro ${itinerary.city}, turismo ${itinerary.state}, pontos turísticos ${itinerary.city}, viagem ${itinerary.city}`,
      image: '/assets/og-image.jpg',
      url: `https://meu-explorador.netlify.app?city=${encodeURIComponent(itinerary.city)}&state=${encodeURIComponent(itinerary.state)}`
    });
  }

  onInterestChange(interest: string, event: any) {
    const interests = this.itineraryForm.get('interests')?.value || [];
    
    if (event.target.checked) {
      interests.push(interest);
    } else {
      const index = interests.indexOf(interest);
      if (index > -1) {
        interests.splice(index, 1);
      }
    }
    
    this.itineraryForm.patchValue({ interests });
  }

  resetForm() {
    this.itineraryForm.reset({
      duration: 1,
      budget: 'moderado',
      interests: []
    });
    this.itinerary = null;
    this.error = null;
    
    // Restaurar meta tags padrão ao resetar
    this.setSeoTags();
  }
}
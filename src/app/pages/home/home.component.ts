// pages/home/home.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { ItineraryRequest, ItineraryResponse } from '../../interfaces/itinerary.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
    private geminiService: GeminiService
  ) {
    this.itineraryForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
      budget: ['moderado'],
      interests: [[]]
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
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    }
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
  }
}
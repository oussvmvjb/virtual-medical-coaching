// evaluation.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../../services/mood.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  evaluationForm!: FormGroup;

  // Options pour les selects
  appetitOptions = ['NORMAL', 'DIMINUE', 'AUGMENTE'];
  activiteOptions = ['AUCUNE', 'FAIBLE', 'MODEREE', 'BONNE'];
  socialOptions = ['AUCUNE', 'FAIBLE', 'NORMALE', 'ACTIVE'];

  // Variables pour le graphe
  showGraph: boolean = false;
  chart: any;
  evaluations: any[] = []; // stocke toutes les évaluations locales

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleRiskLogic();
  }

  // Initialisation du formulaire avec valeurs par défaut
  initForm(): void {
    this.evaluationForm = this.fb.group({
      humeur: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      stress: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      energie: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      motivation: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      sommeil: [5, [Validators.required, Validators.min(1), Validators.max(10)]],

      symptomes: [''],
      appetit: ['NORMAL', Validators.required],
      activite_physique: ['FAIBLE', Validators.required],
      interactions_sociales: ['NORMALE', Validators.required],

      pensees_risque: [false],
      details_risque: [''],
      commentaire: ['']
    });
  }

  // Soumission du formulaire
  onSubmit(): void {
    if (!this.evaluationForm.valid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const patientId = currentUser.id;

    const rawData = this.evaluationForm.value;
    const formData = {
      idPatient: patientId,
      humeur: rawData.humeur,
      stress: rawData.stress,
      energie: rawData.energie,
      motivation: rawData.motivation,
      sommeil: rawData.sommeil,
      symptomes: rawData.symptomes,
      appetit: rawData.appetit,
      activitePhysique: rawData.activite_physique,
      interactionsSociales: rawData.interactions_sociales,
      penseesRisque: rawData.pensees_risque,
      detailsRisque: rawData.details_risque,
      commentaire: rawData.commentaire
    };

    console.log('📤 Data to send (sans date):', JSON.stringify(formData, null, 2));

    this.evaluationService.createEvaluation(formData).subscribe({
      next: (response) => {
        console.log('✅ Success:', response);
        alert('Évaluation enregistrée avec succès !');

        // Stocker localement pour le graphe
        this.evaluations.push(formData);
        this.updateGraph();

        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Error:', error);
        alert('Erreur: ' + (error.error?.message || 'Erreur inconnue'));
      }
    });
  }

  // Réinitialisation du formulaire
  private resetForm(): void {
    this.evaluationForm.reset({
      humeur: 5,
      stress: 5,
      energie: 5,
      motivation: 5,
      sommeil: 5,
      appetit: 'NORMAL',
      activite_physique: 'FAIBLE',
      interactions_sociales: 'NORMALE',
      pensees_risque: false
    });
  }

  // Gestion des champs de risque (placeholder)
  handleRiskLogic(): void {
    // Ici tu peux ajouter des subscriptions pour activer/désactiver details_risque
  }

  // Afficher le graphe
  afficherGraphe(): void {
    this.showGraph = true;
    this.updateGraph();
  }

  // Mettre à jour le graphe avec toutes les évaluations
  private updateGraph(): void {
    if (!this.evaluations.length) return;

    const labels = this.evaluations.map((_, index) => `Évaluation ${index + 1}`);
    const humeurData = this.evaluations.map(e => e.humeur);
    const stressData = this.evaluations.map(e => e.stress);
    const energieData = this.evaluations.map(e => e.energie);
    const motivationData = this.evaluations.map(e => e.motivation);
    const sommeilData = this.evaluations.map(e => e.sommeil);

    // Détruire le chart existant pour éviter les doublons
    if (this.chart) this.chart.destroy();

    this.chart = new Chart('evaluationGraph', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Humeur', data: humeurData, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
          { label: 'Stress', data: stressData, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
          { label: 'Énergie', data: energieData, backgroundColor: 'rgba(255, 206, 86, 0.6)' },
          { label: 'Motivation', data: motivationData, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
          { label: 'Sommeil', data: sommeilData, backgroundColor: 'rgba(153, 102, 255, 0.6)' }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, max: 10 }
        }
      }
    });
  }
}

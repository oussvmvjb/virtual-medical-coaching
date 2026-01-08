import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../../services/mood.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit, AfterViewInit {
  evaluationForm!: FormGroup;

  // Main metrics
  mainMetrics = [
    'motivation_sobre',
    'craving',
    'energie',
    'motivation_programme',
    'sommeil'
  ];

  // Options for radio buttons
  appetitOptions = ['Faible', 'Normal', 'Élevé'];
  activiteOptions = ['Aucune', 'Légère', 'Modérée', 'Intense'];
  socialOptions = ['Isolement', 'Limitées', 'Normales', 'Nombreuses'];
  hydratationOptions = ['Insuffisante', 'Suffisante', 'Excellente'];
  repasOptions = ['Non', 'Parfois', 'Oui'];
  routineOptions = ['Inexistante', 'Irregulière', 'Régulière'];

  // Graph properties
  showGraph: boolean = false;
  hasEvaluationData: boolean = false;
  viewType: 'weekly' | 'monthly' | 'all' = 'weekly';
  chart: any;
  evaluations: any[] = [];

  // Graph legend
  graphLegend = [
    { label: 'Motivation sobre (↑ mieux)', color: '#3498db' },
    { label: 'Craving inversé (↑ mieux)', color: '#e74c3c' },
    { label: 'Énergie (↑ mieux)', color: '#2ecc71' },
    { label: 'Motivation programme (↑ mieux)', color: '#9b59b6' },
    { label: 'Sommeil (↑ mieux)', color: '#f39c12' }
  ];

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleRiskLogic();
    this.loadPreviousEvaluations();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initForm(): void {
    this.evaluationForm = this.fb.group({
      // Main metrics
      motivation_sobre: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      craving: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      energie: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      motivation_programme: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      sommeil: [5, [Validators.required, Validators.min(1), Validators.max(10)]],

      // Physical & social state
      appetit: ['Normal', Validators.required],
      activite_physique: ['Légère', Validators.required],
      interactions_sociales: ['Normales', Validators.required],
      hydratation: ['Suffisante', Validators.required],
      repas_reguliers: ['Parfois', Validators.required],
      routine_exercice: ['Irregulière', Validators.required],

      // Risk assessment
      pensees_risque: [false],
      details_risque: [''],

      // Additional information
      symptomes: [''],
      commentaire: ['']
    });

    // Handle risk field visibility
    this.evaluationForm.get('pensees_risque')?.valueChanges.subscribe(value => {
      const detailsControl = this.evaluationForm.get('details_risque');
      if (value) {
        detailsControl?.setValidators([Validators.required]);
        detailsControl?.updateValueAndValidity();
      } else {
        detailsControl?.clearValidators();
        detailsControl?.updateValueAndValidity();
      }
    });
  }

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
      // Main metrics
      motivationSobre: rawData.motivation_sobre,
      craving: rawData.craving,
      energie: rawData.energie,
      motivationProgramme: rawData.motivation_programme,
      sommeil: rawData.sommeil,

      // Physical & social state
      appetit: rawData.appetit,
      activitePhysique: rawData.activite_physique,
      interactionsSociales: rawData.interactions_sociales,
      hydratation: rawData.hydratation,
      repasReguliers: rawData.repas_reguliers,
      routineExercice: rawData.routine_exercice,

      // Risk assessment
      penseesRisque: rawData.pensees_risque,
      detailsRisque: rawData.details_risque,

      // Additional information
      symptomes: rawData.symptomes,
      commentaire: rawData.commentaire,

      // Metadata
      dateEvaluation: new Date().toISOString()
    };

    this.evaluationService.createEvaluation(formData).subscribe({
      next: (response) => {
        alert('Évaluation enregistrée avec succès !');
        
        // Add to local evaluations array
        this.evaluations.push(formData);
        this.hasEvaluationData = true;
        
        // Update graph
        this.updateGraph();
        
        // Reset form
        this.resetForm();
      },
      error: (error) => {
        alert('Erreur: ' + (error.error?.message || 'Erreur inconnue'));
      }
    });
  }

  handleRiskLogic(): void {
    // Additional risk logic can be added here
  }

  loadPreviousEvaluations(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const patientId = currentUser.id;
    
    if (patientId) {
      this.evaluationService.getEvaluationsByPatient(patientId).subscribe({
        next: (evaluations) => {
          this.evaluations = evaluations;
          this.hasEvaluationData = evaluations.length > 0;
        },
        error: (error) => {
          console.error('Erreur chargement évaluations:', error);
        }
      });
    }
  }

  initChart(): void {
    if (this.evaluations.length > 0) {
      this.updateGraph();
    }
  }

  afficherGraphe(): void {
    this.showGraph = true;
    if (this.evaluations.length > 0) {
      this.updateGraph();
    }
  }

  setViewType(type: 'weekly' | 'monthly' | 'all'): void {
    this.viewType = type;
    this.updateGraph();
  }

  private updateGraph(): void {
    if (!this.evaluations.length || !this.showGraph) return;

    // Filter evaluations based on view type
    const filteredEvaluations = this.filterEvaluationsByViewType(this.evaluations, this.viewType);
    
    const labels = filteredEvaluations.map((e, index) => {
      const date = new Date(e.dateEvaluation);
      return this.formatDateLabel(date, this.viewType, index + 1);
    });

    // Prepare data with inverted craving
    const motivationSobreData = filteredEvaluations.map(e => e.motivationSobre);
    const cravingData = filteredEvaluations.map(e => 10 - e.craving); // Invert for better visualization
    const energieData = filteredEvaluations.map(e => e.energie);
    const motivationProgrammeData = filteredEvaluations.map(e => e.motivationProgramme);
    const sommeilData = filteredEvaluations.map(e => e.sommeil);

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('evaluationGraph') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { 
            label: 'Motivation sobre', 
            data: motivationSobreData, 
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            tension: 0.4,
            fill: true
          },
          { 
            label: 'Craving (inversé)', 
            data: cravingData, 
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            tension: 0.4,
            fill: true
          },
          { 
            label: 'Énergie', 
            data: energieData, 
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            tension: 0.4,
            fill: true
          },
          { 
            label: 'Motivation programme', 
            data: motivationProgrammeData, 
            borderColor: '#9b59b6',
            backgroundColor: 'rgba(155, 89, 182, 0.1)',
            tension: 0.4,
            fill: true
          },
          { 
            label: 'Sommeil', 
            data: sommeilData, 
            borderColor: '#f39c12',
            backgroundColor: 'rgba(243, 156, 18, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            grid: {
              drawBorder: false
            },
            title: {
              display: true,
              text: 'Score (1-10)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'nearest'
        }
      }
    });
  }

  private filterEvaluationsByViewType(evaluations: any[], viewType: string): any[] {
    if (viewType === 'all') return evaluations;
    
    const now = new Date();
    const filtered = evaluations.filter(eval => {
      const evalDate = new Date(eval.dateEvaluation);
      
      if (viewType === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return evalDate >= weekAgo;
      } else if (viewType === 'monthly') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return evalDate >= monthAgo;
      }
      
      return true;
    });

    return filtered.sort((a, b) => new Date(a.dateEvaluation).getTime() - new Date(b.dateEvaluation).getTime());
  }

  private formatDateLabel(date: Date, viewType: string, index: number): string {
    switch (viewType) {
      case 'weekly':
        return `J${index}`;
      case 'monthly':
        return `Sem ${index}`;
      case 'all':
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      default:
        return `Éval ${index}`;
    }
  }

  getMetricLabel(metric: string): string {
    const labels: { [key: string]: string } = {
      'motivation_sobre': 'Motivation à rester sobre',
      'craving': 'Craving / Envie de consommer',
      'energie': 'Énergie quotidienne',
      'motivation_programme': 'Motivation à suivre le programme',
      'sommeil': 'Qualité du sommeil'
    };
    return labels[metric] || metric;
  }

  getScaleMin(metric: string): string {
    if (metric === 'craving') return 'Aucune envie';
    
    const labels: { [key: string]: string } = {
      'motivation_sobre': 'Très faible',
      'energie': 'Épuisé',
      'motivation_programme': 'Très faible',
      'sommeil': 'Très mauvais'
    };
    return labels[metric] || '1 (Faible)';
  }

  getScaleMax(metric: string): string {
    if (metric === 'craving') return 'Envie intense';
    
    const labels: { [key: string]: string } = {
      'motivation_sobre': 'Très élevée',
      'energie': 'Très énergique',
      'motivation_programme': 'Très élevée',
      'sommeil': 'Excellent'
    };
    return labels[metric] || '10 (Fort)';
  }

  resetForm(): void {
    this.evaluationForm.reset({
      motivation_sobre: 5,
      craving: 5,
      energie: 5,
      motivation_programme: 5,
      sommeil: 5,
      appetit: 'Normal',
      activite_physique: 'Légère',
      interactions_sociales: 'Normales',
      hydratation: 'Suffisante',
      repas_reguliers: 'Parfois',
      routine_exercice: 'Irregulière',
      pensees_risque: false,
      details_risque: '',
      symptomes: '',
      commentaire: ''
    });
  }

  // Helper method to get user-friendly option labels
  getOptionLabel(option: string): string {
    const labelMap: { [key: string]: string } = {
      'Faible': 'Faible',
      'Normal': 'Normal',
      'Élevé': 'Élevé',
      'Aucune': 'Aucune',
      'Légère': 'Légère',
      'Modérée': 'Modérée',
      'Intense': 'Intense',
      'Isolement': 'Isolement',
      'Limitées': 'Limitées',
      'Normales': 'Normales',
      'Nombreuses': 'Nombreuses',
      'Insuffisante': 'Insuffisante',
      'Suffisante': 'Suffisante',
      'Excellente': 'Excellente',
      'Non': 'Non',
      'Parfois': 'Parfois',
      'Oui': 'Oui',
      'Inexistante': 'Inexistante',
      'Irregulière': 'Irregulière',
      'Régulière': 'Régulière'
    };
    
    return labelMap[option] || option;
  }
}
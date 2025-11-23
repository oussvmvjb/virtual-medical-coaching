import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../../services/mood.service'; // <-- chemin corrigé

@Component({
  selector: 'app-evaluation-humeurs',
  templateUrl: './list-evaluation.Component.html',
  styleUrls: ['./list-evaluation.Component.scss']
})
export class ListEvaluationComponent implements OnInit {
  evaluationForm!: FormGroup;
  evaluations: any[] = [];

  appetitOptions = ['NORMAL', 'DIMINUE', 'AUGMENTE'];
  activiteOptions = ['AUCUNE', 'FAIBLE', 'MODEREE', 'BONNE'];
  socialOptions = ['AUCUNE', 'FAIBLE', 'NORMALE', 'ACTIVE'];

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEvaluations();
  }

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
      commentaire: [''] // <-- champ manquant ajouté
    });
  }

  onSubmit(): void {
    if (this.evaluationForm.valid) {
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

      this.evaluationService.createEvaluation(formData).subscribe({
        next: () => {
          alert('Évaluation enregistrée avec succès !');
          this.resetForm();
          this.loadEvaluations();
        },
        error: (error) => {
          alert('Erreur: ' + (error.error?.message || 'Erreur inconnue'));
        }
      });
    } else {
      this.evaluationForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.evaluationForm.reset({
      humeur: 5,
      stress: 5,
      energie: 5,
      motivation: 5,
      sommeil: 5,
      symptomes: '',
      appetit: 'NORMAL',
      activite_physique: 'FAIBLE',
      interactions_sociales: 'NORMALE',
      pensees_risque: false,
      details_risque: '',
      commentaire: ''
    });
  }

  loadEvaluations(): void {
    this.evaluationService.getEvaluations().subscribe({
      next: (data) => {
        this.evaluations = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des évaluations', err);
      }
    });
  }

  getSmiley(humeur: number): string {
    if (humeur >= 7) return '🙂';
    if (humeur >= 4) return '😐';
    return '😟';
  }
}
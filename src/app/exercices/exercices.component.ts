import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../services/mood.service';


@Component({
  selector: 'app-evaluation',
  templateUrl: './exercices.component.html',
  styleUrls: ['./exercices.component.scss']
})
export class EvaluationComponent implements OnInit {

  evaluationForm!: FormGroup;

  // Options pour les selects
  appetitOptions = ['NORMAL', 'DIMINUE', 'AUGMENTE'];
  activiteOptions = ['AUCUNE', 'FAIBLE', 'MODEREE', 'BONNE'];
  socialOptions = ['AUCUNE', 'FAIBLE', 'NORMALE', 'ACTIVE'];

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleRiskLogic();
  }

  // ======================
  // 🟦 Création du FormGroup
  // ======================
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

  // ======================
  // 🟦 Gestion automatique du champ "détails risque"
  // ======================
  handleRiskLogic(): void {
    this.evaluationForm.get('pensees_risque')?.valueChanges.subscribe((value: boolean) => {
      const detailsControl = this.evaluationForm.get('details_risque');

      if (value === true) {
        detailsControl?.setValidators([Validators.required, Validators.minLength(5)]);
      } else {
        detailsControl?.clearValidators();
        detailsControl?.setValue('');
      }

      detailsControl?.updateValueAndValidity();
    });
  }

  // ======================
  // 🟩 Envoi du formulaire au service backend
  // ======================
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
        // ❗ La date est automatiquement générée côté backend
      };

      console.log('📤 Data sent:', JSON.stringify(formData, null, 2));

      this.evaluationService.createEvaluation(formData).subscribe({
        next: (response) => {
          console.log('✅ Success:', response);
          alert('Évaluation enregistrée avec succès !');
          this.resetForm();
        },
        error: (error) => {
          console.error('❌ Error:', error);
          alert('Erreur: ' + (error.error?.message || 'Erreur inconnue'));
        }
      });

    } else {
      this.evaluationForm.markAllAsTouched();
    }
  }

  // ======================
  // 🟨 Reset du formulaire
  // ======================
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
      pensees_risque: false,
      details_risque: '',
      symptomes: '',
      commentaire: ''
    });
  }
}

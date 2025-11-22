// evaluation.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../../services/mood.service';
import { Evaluation } from '../../models/mood-evaluation';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  evaluationForm!: FormGroup;
  
  // CORRECTION: Utiliser les majuscules comme dans le backend
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

  initForm(): void {
    this.evaluationForm = this.fb.group({
      humeur: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      stress: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      energie: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      motivation: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      sommeil: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      
      symptomes: [''],
      // CORRECTION: Valeurs par défaut en majuscules
      appetit: ['NORMAL', Validators.required],
      activite_physique: ['FAIBLE', Validators.required],
      interactions_sociales: ['NORMALE', Validators.required],
      
      pensees_risque: [false],
      details_risque: [''],
      commentaire: ['']
    });
  }

  onSubmit(): void {
    if (this.evaluationForm.valid) {
      console.log('Form Data:', this.evaluationForm.value); // DEBUG
      
      const formData: Evaluation = {
        ...this.evaluationForm.value,
        id_patient: 1,
        date_evaluation: new Date()
      };

      console.log('Data to send:', JSON.stringify(formData, null, 2)); // DEBUG

      this.evaluationService.createEvaluation(formData).subscribe({
        next: (response) => {
          console.log('Success:', response);
          alert('Évaluation enregistrée avec succès !');
          this.resetForm();
        },
        error: (error) => {
          console.error('Full error:', error);
          if (error.error?.message) {
            alert('Erreur: ' + error.error.message);
          } else {
            alert('Erreur lors de la sauvegarde');
          }
        }
      });
    } else {
      this.evaluationForm.markAllAsTouched();
    }
  }

  private resetForm(): void {
    this.evaluationForm.reset({ 
      humeur: 5, stress: 5, energie: 5, motivation: 5, sommeil: 5,
      appetit: 'NORMAL', 
      activite_physique: 'FAIBLE', 
      interactions_sociales: 'NORMALE',
      pensees_risque: false
    });
  }

  handleRiskLogic(): void {
    // Ton code existant...
  }
}
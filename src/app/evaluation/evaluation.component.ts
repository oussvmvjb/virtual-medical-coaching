import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../services/mood.service'; // Import Service
import { Evaluation } from '../models/mood-evaluation'; // Import Model

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  evaluationForm!: FormGroup;
  
  
  appetitOptions = ['normal', 'diminue', 'augmente'];
  activiteOptions = ['aucune', 'faible', 'moderee', 'bonne'];
  socialOptions = ['aucune', 'faible', 'normale', 'active'];

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
      // Numeric Scales 1-10 (Default 5)
      humeur: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      stress: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      energie: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      motivation: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      sommeil: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      
      // Text & Enums
      symptomes: [''],
      appetit: ['normal', Validators.required],
      activite_physique: ['faible', Validators.required],
      interactions_sociales: ['normale', Validators.required],
      
      // Risk Logic
      pensees_risque: [false],
      details_risque: [''],
      
      commentaire: ['']
    });
  }

  // Watch for "Risk" checkbox changes
  handleRiskLogic(): void {
    this.evaluationForm.get('pensees_risque')?.valueChanges.subscribe(isChecked => {
      const detailsControl = this.evaluationForm.get('details_risque');
      if (isChecked) {
        detailsControl?.setValidators([Validators.required]); // Make details mandatory
      } else {
        detailsControl?.clearValidators();
        detailsControl?.setValue('');
      }
      detailsControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.evaluationForm.valid) {
      // Prepare the object
      const formData: Evaluation = {
        ...this.evaluationForm.value,
        id_patient: 1, // TODO: Get this from your Auth Service later
        date_evaluation: new Date()
      };

      // Send to Backend
      this.evaluationService.createEvaluation(formData).subscribe({
        next: (response) => {
          console.log('Saved:', response);
          alert('Évaluation enregistrée avec succès !');
          this.evaluationForm.reset({ 
            humeur: 5, stress: 5, energie: 5, motivation: 5, sommeil: 5,
            appetit: 'normal', activite_physique: 'faible', interactions_sociales: 'normale',
            pensees_risque: false
          });
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Erreur lors de la sauvegarde.');
        }
      });
    } else {
      this.evaluationForm.markAllAsTouched();
    }
  }
}
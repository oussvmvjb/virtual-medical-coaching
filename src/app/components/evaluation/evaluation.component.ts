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
      appetit: ['NORMAL', Validators.required],
      activite_physique: ['FAIBLE', Validators.required],
      interactions_sociales: ['NORMALE', Validators.required],
      
      pensees_risque: [false],
      details_risque: [''],
      commentaire: ['']
    });
  }

 // evaluation.component.ts
// evaluation.component.ts
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
      // ⚠️ NE PAS envoyer dateEvaluation - le backend la gère automatiquement
    };

    console.log('📤 Data to send (sans date):', JSON.stringify(formData, null, 2));

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
  }
}
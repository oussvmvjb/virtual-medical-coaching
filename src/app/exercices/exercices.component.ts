import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-prescription',
  templateUrl: './exercices.component.html',
  styleUrls: ['./exercices.component.scss']
})
export class ExercicesComponent implements OnInit {
  prescriptionForm!: FormGroup;

  // Section A : Observations / informations patient
  niveauxRisque = ['Faible', 'Moyen', 'Élevé'];

  // Section B : Type de maladie / trouble ciblé
  troubles = [
    'Trouble anxieux',
    'Dépression',
    'Trouble du sommeil',
    'Burnout / Stress',
    'Trouble panique',
    'Stress post-traumatique',
    'Autre'
  ];
  autresTroublesSelected = false;

  // Section C : Prescription d’exercices
  frequences = ['1 exercice par jour', '1 exercice par semaine', 'Programme personnalisé (à définir)'];
  durees = ['1 semaine', '2 semaines', '1 mois', 'Jusqu’à nouvelle évaluation'];
  exercices: { [key: string]: string[] } = {
    'Trouble anxieux': [
      'Respiration diaphragmatique',
      'Relaxation musculaire progressive',
      'Exposition graduée',
      'Journal d’anxiété'
    ],
    'Dépression': [
      'Activation comportementale',
      'Journal des pensées positives',
      'Marche quotidienne',
      'Planification d’activités agréables'
    ],
    'Troubles du sommeil': [
      'Routine de sommeil',
      'Exercice de respiration 4-7-8',
      'Techniques d’hygiène du sommeil'
    ],
    'Stress / burnout': [
      'Méditation guidée',
      'Pause consciente 5 minutes',
      'Étirements / mobilité',
      'Organisation du temps'
    ]
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const troublesControls = this.troubles.map(() => false);

    this.prescriptionForm = this.fb.group({
      // Section A
      observations: [''],
      niveauRisque: ['Faible'],

      // Section B
      troubles: this.fb.array(troublesControls),
      autresTroubles: [''],

      // Section C
      frequence: ['1 exercice par semaine'],
      exercicesSelectionnes: [[]],
      exercicePersoNom: [''],
      exercicePersoDesc: [''],
      instructions: [''],
      duree: ['1 semaine']
    });
  }

  // Affichage du champ "Autre" pour troubles
  onTroubleChange(trouble: string, event: any) {
    if (trouble === 'Autre') {
      this.autresTroublesSelected = event.target.checked;
      if (!event.target.checked) {
        this.prescriptionForm.get('autresTroubles')?.setValue('');
      }
    }
  }

  // Gestion des exercices sélectionnés
  toggleExercice(ex: string, event: any) {
    const selected = this.prescriptionForm.value.exercicesSelectionnes;
    if (event.target.checked) {
      selected.push(ex);
    } else {
      const index = selected.indexOf(ex);
      if (index >= 0) selected.splice(index, 1);
    }
    this.prescriptionForm.get('exercicesSelectionnes')?.setValue(selected);
  }

  // Soumission du formulaire
  submit() {
    const selectedTroubles = this.troubles
      .filter((_, i) => this.prescriptionForm.value.troubles[i]);

    const result = {
      ...this.prescriptionForm.value,
      troubles: selectedTroubles
    };

    console.log('Prescription soumise :', result);
    alert('Prescription sauvegardée !');
  }
}

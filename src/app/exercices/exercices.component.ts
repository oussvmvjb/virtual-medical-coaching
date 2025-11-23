// exercices.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExerciseService } from '../services/exercise.service';
import { ExerciceRequest, TypeTrouble, Frequence, Duree, NiveauRisque } from '../models/exercise';

@Component({
  selector: 'app-prescription',
  templateUrl: './exercices.component.html',
  styleUrls: ['./exercices.component.scss']
})
export class ExercicesComponent implements OnInit {
  prescriptionForm!: FormGroup;
  
  niveauxRisque = ['Faible', 'Moyen', 'Élevé'];
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

  frequences = ['1 exercice par jour', '1 exercice par semaine', 'Programme personnalisé (à définir)'];
  durees = ['1 semaine', '2 semaines', '1 mois', 'Jusqu\'à nouvelle évaluation'];
  exercices: { [key: string]: string[] } = {
    'Trouble anxieux': [
      'Respiration diaphragmatique',
      'Relaxation musculaire progressive', 
      'Exposition graduée',
      'Journal d\'anxiété'
    ],
    'Dépression': [
      'Activation comportementale',
      'Journal des pensées positives',
      'Marche quotidienne',
      'Planification d\'activités agréables'
    ],
    'Troubles du sommeil': [
      'Routine de sommeil',
      'Exercice de respiration 4-7-8',
      'Techniques d\'hygiène du sommeil'
    ],
    'Stress / burnout': [
      'Méditation guidée',
      'Pause consciente 5 minutes',
      'Étirements / mobilité',
      'Organisation du temps'
    ]
  };

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleTroubleLogic();
  }

  initForm(): void {
    const troublesControls = this.troubles.map(() => false);

    this.prescriptionForm = this.fb.group({
      // Section A
      observations: [''],
      niveauRisque: ['Faible', Validators.required],

      // Section B
      troubles: this.fb.array(troublesControls),
      autresTroubles: [''],

      // Section C
      frequence: ['1 exercice par semaine', Validators.required],
      exercicesSelectionnes: [[]],
      exercicePersoNom: [''],
      exercicePersoDesc: [''],
      instructions: [''],
      duree: ['1 semaine', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.prescriptionForm.valid) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const coachId = currentUser.id;

      const rawData = this.prescriptionForm.value;
      
      // Trouver le premier trouble sélectionné
      const selectedTroubles = this.troubles.filter((_, i) => rawData.troubles[i]);
      const mainTrouble = selectedTroubles[0] || 'Autre';

      // Mapper les valeurs vers les enums exacts
      const typeTroubleMap: { [key: string]: TypeTrouble } = {
        'Trouble anxieux': TypeTrouble.TROUBLE_ANXIEUX,
        'Dépression': TypeTrouble.DEPRESSION, 
        'Trouble du sommeil': TypeTrouble.TROUBLE_SOMMEIL,
        'Burnout / Stress': TypeTrouble.BURNOUT_STRESS,
        'Trouble panique': TypeTrouble.TROUBLE_PANIQUE,
        'Stress post-traumatique': TypeTrouble.STRESS_POST_TRAUMATIQUE,
        'Autre': TypeTrouble.AUTRE
      };

      const frequenceMap: { [key: string]: Frequence } = {
        '1 exercice par jour': Frequence.UN_PAR_JOUR,
        '1 exercice par semaine': Frequence.UN_PAR_SEMAINE, 
        'Programme personnalisé (à définir)': Frequence.PROGRAMME_PERSONNALISE
      };

      const dureeMap: { [key: string]: Duree } = {
        '1 semaine': Duree.UNE_SEMAINE,
        '2 semaines': Duree.DEUX_SEMAINES,
        '1 mois': Duree.UN_MOIS,
        'Jusqu\'à nouvelle évaluation': Duree.JUSQUA_NOUVELLE_EVALUATION
      };

      const niveauRisqueMap: { [key: string]: NiveauRisque } = {
        'Faible': NiveauRisque.FAIBLE,
        'Moyen': NiveauRisque.MOYEN, 
        'Élevé': NiveauRisque.ELEVE
      };

      // Construire la description
      let description = rawData.observations || '';
      if (rawData.exercicesSelectionnes.length > 0) {
        description += `\n\nExercices sélectionnés: ${rawData.exercicesSelectionnes.join(', ')}`;
      }
      if (rawData.exercicePersoNom) {
        description += `\n\nExercice personnalisé: ${rawData.exercicePersoNom}`;
        if (rawData.exercicePersoDesc) {
          description += ` - ${rawData.exercicePersoDesc}`;
        }
      }

      const formData: ExerciceRequest = {
        idPatient: 1, // À remplacer par l'ID du patient sélectionné
        idCoach: coachId,
        titre: `Prescription pour ${mainTrouble}`,
        description: description.trim(),
        typeTrouble: typeTroubleMap[mainTrouble],
        frequence: frequenceMap[rawData.frequence],
        instructions: rawData.instructions || 'Instructions générales à suivre',
        duree: dureeMap[rawData.duree],
        niveauRisque: niveauRisqueMap[rawData.niveauRisque],
        exercicesSelectionnes: rawData.exercicesSelectionnes,
        exercicePersoNom: rawData.exercicePersoNom,
        exercicePersoDesc: rawData.exercicePersoDesc
      };

      console.log('📤 Data to send:', JSON.stringify(formData, null, 2));

      this.exerciseService.createExercice(formData).subscribe({
        next: (response) => {
          console.log('✅ Success:', response);
          alert('Prescription enregistrée avec succès !');
          this.resetForm();
        },
        error: (error) => {
          console.error('❌ Error:', error);
          alert('Erreur: ' + (error.error?.message || 'Erreur inconnue'));
        }
      });
    } else {
      this.prescriptionForm.markAllAsTouched();
    }
  }

  private resetForm(): void {
    const troublesControls = this.troubles.map(() => false);
    
    this.prescriptionForm.reset({
      observations: '',
      niveauRisque: 'Faible',
      troubles: troublesControls,
      autresTroubles: '',
      frequence: '1 exercice par semaine',
      exercicesSelectionnes: [],
      exercicePersoNom: '',
      exercicePersoDesc: '',
      instructions: '',
      duree: '1 semaine'
    });
    
    this.autresTroublesSelected = false;
  }

  // Affichage du champ "Autre" pour troubles
  onTroubleChange(trouble: string, event: any): void {
    if (trouble === 'Autre') {
      this.autresTroublesSelected = event.target.checked;
      if (!event.target.checked) {
        this.prescriptionForm.get('autresTroubles')?.setValue('');
      }
    }
  }

  // Gestion des exercices sélectionnés
  toggleExercice(ex: string, event: any): void {
    const selected = this.prescriptionForm.value.exercicesSelectionnes;
    if (event.target.checked) {
      selected.push(ex);
    } else {
      const index = selected.indexOf(ex);
      if (index >= 0) selected.splice(index, 1);
    }
    this.prescriptionForm.get('exercicesSelectionnes')?.setValue(selected);
  }

  handleTroubleLogic(): void {
    // Logique supplémentaire pour la gestion des troubles si nécessaire
  }

  // Getter pour le FormArray des troubles
  get troublesFormArray(): FormArray {
    return this.prescriptionForm.get('troubles') as FormArray;
  }
}

export { ExerciseService };
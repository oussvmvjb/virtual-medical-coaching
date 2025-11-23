// prescription.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { exerciceService } from '../services/exercice.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './exercices.component.html',
  styleUrls: ['./exercices.component.scss']
})
export class ExercicesComponent implements OnInit {
  prescriptionForm!: FormGroup;

  // Listes pour les sélections
  troublesList = [
    'Anxiété généralisée',
    'Dépression', 
    'Trouble panique',
    'Insomnie',
    'Stress post-traumatique',
    'Burnout',
    'Trouble obsessionnel compulsif',
    'Phobie sociale'
  ];

  anxieteList = [
    { id: 'respiration', label: 'Respiration profonde' },
    { id: 'meditation', label: 'Méditation guidée' },
    { id: 'relaxation', label: 'Relaxation musculaire' },
    { id: 'visualisation', label: 'Visualisation positive' },
    { id: 'journal', label: 'Journal des pensées' },
    { id: 'exposition', label: 'Exposition progressive' }
  ];

  depressionList = [
    { id: 'activite_agreable', label: 'Activités agréables' },
    { id: 'gratitude', label: 'Journal de gratitude' },
    { id: 'objectifs', label: 'Fixation de petits objectifs' },
    { id: 'exercice', label: 'Exercice physique léger' },
    { id: 'social', label: 'Contacts sociaux' },
    { id: 'pleine_conscience', label: 'Pleine conscience' }
  ];

  sommeilList = [
    { id: 'routine', label: 'Routine du coucher' },
    { id: 'relaxation_sommeil', label: 'Relaxation avant le sommeil' },
    { id: 'limitation_lit', label: 'Restriction du temps au lit' },
    { id: 'environnement', label: 'Optimisation environnement sommeil' },
    { id: 'cafeine', label: 'Gestion caféine' },
    { id: 'detente', label: 'Techniques de détente' }
  ];

  stressList = [
    { id: 'gestion_temps', label: 'Gestion du temps' },
    { id: 'affirmation', label: 'Affirmations positives' },
    { id: 'pause_detente', label: 'Pauses détente' },
    { id: 'resolution_probleme', label: 'Résolution de problèmes' },
    { id: 'limitation_medias', label: 'Limitation médias' },
    { id: 'loisirs', label: 'Activités loisirs' }
  ];

  constructor(
    private fb: FormBuilder,
    private prescriptionService: exerciceService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleTroubleLogic();
  }

  initForm(): void {
    this.prescriptionForm = this.fb.group({
      // A. Analyse du médecin
      observations: ['', Validators.required],
      niveau_risque: ['faible', Validators.required],
      
      // B. Diagnostic
      trouble: ['', Validators.required],
      trouble_autre: [''],
      
      // C. Prescription
      frequence: ['quotidien', Validators.required],
      
      // Exercices - Groupes de checkboxes
      exercices_anxiete: this.fb.group({
        respiration: [false],
        meditation: [false],
        relaxation: [false],
        visualisation: [false],
        journal: [false],
        exposition: [false]
      }),
      
      exercices_depression: this.fb.group({
        activite_agreable: [false],
        gratitude: [false],
        objectifs: [false],
        exercice: [false],
        social: [false],
        pleine_conscience: [false]
      }),
      
      exercices_sommeil: this.fb.group({
        routine: [false],
        relaxation_sommeil: [false],
        limitation_lit: [false],
        environnement: [false],
        cafeine: [false],
        detente: [false]
      }),
      
      exercices_stress: this.fb.group({
        gestion_temps: [false],
        affirmation: [false],
        pause_detente: [false],
        resolution_probleme: [false],
        limitation_medias: [false],
        loisirs: [false]
      }),
      
      message: ['', Validators.required],
      duree: ['1s', Validators.required]
    });
  }

  handleTroubleLogic(): void {
    // Réinitialiser les exercices quand le trouble change
    this.prescriptionForm.get('trouble')?.valueChanges.subscribe(trouble => {
      this.resetExercices();
    });
  }

  private resetExercices(): void {
    const exerciceGroups = [
      'exercices_anxiete',
      'exercices_depression', 
      'exercices_sommeil',
      'exercices_stress'
    ];
    
    exerciceGroups.forEach(group => {
      const groupControl = this.prescriptionForm.get(group) as FormGroup;
      Object.keys(groupControl.controls).forEach(key => {
        groupControl.get(key)?.setValue(false);
      });
    });
  }

  onSubmit(): void {
    if (this.prescriptionForm.valid) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const medecinId = currentUser.id;

      // Récupérer l'ID du patient depuis l'URL ou un service
      const patientId = this.getPatientIdFromContext();

      if (!patientId) {
        alert('Erreur: Patient non spécifié');
        return;
      }

      const rawData = this.prescriptionForm.value;
      
      // Compiler les exercices sélectionnés
      const exercicesSelectionnes = this.getSelectedExercices(rawData);

      const formData = {
        idPatient: patientId,
        idMedecin: medecinId,
        observations: rawData.observations,
        niveauRisque: rawData.niveau_risque,
        trouble: rawData.trouble,
        troubleAutre: rawData.trouble_autre,
        frequence: rawData.frequence,
        exercices: exercicesSelectionnes,
        message: rawData.message,
        duree: rawData.duree,
        datePrescription: new Date().toISOString().split('T')[0]
      };

      console.log('📤 Prescription data:', JSON.stringify(formData, null, 2));

      this.prescriptionService.createPrescription(formData).subscribe({
        next: (response) => {
          console.log('✅ Prescription créée:', response);
          alert('Prescription envoyée avec succès au patient !');
          this.resetForm();
        },
        error: (error) => {
          console.error('❌ Error:', error);
          alert('Erreur: ' + (error.error?.message || 'Erreur lors de l\'envoi'));
        }
      });
    } else {
      this.prescriptionForm.markAllAsTouched();
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }

  private getSelectedExercices(formData: any): string[] {
    const exercices: string[] = [];

    // Parcourir tous les groupes d'exercices
    Object.keys(formData).forEach(key => {
      if (key.startsWith('exercices_') && typeof formData[key] === 'object') {
        const groupe = formData[key];
        Object.keys(groupe).forEach(exerciceKey => {
          if (groupe[exerciceKey] === true) {
            // Ajouter l'ID de l'exercice
            exercices.push(exerciceKey);
          }
        });
      }
    });

    return exercices;
  }

  private getPatientIdFromContext(): number {
    // À adapter selon ton contexte
    // Exemple: récupérer depuis l'URL ou un service
    return 1; // Temporaire - à remplacer
  }

  private resetForm(): void {
    this.prescriptionForm.reset({
      observations: '',
      niveau_risque: 'faible',
      trouble: '',
      trouble_autre: '',
      frequence: 'quotidien',
      message: '',
      duree: '1s'
    });
    
    this.resetExercices();
  }
}
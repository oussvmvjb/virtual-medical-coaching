import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../services/exercise.service';
import { Exercice } from '../../models/exercise';

@Component({
  selector: 'app-patient-exercises',
  templateUrl: './patient-exercises.component.html',
  styleUrls: ['./patient-exercises.component.scss']
})
export class PatientExercisesComponent implements OnInit {
  exercices: Exercice[] = [];
  loading = false;
  patientId: number;

  constructor(private exerciseService: ExerciseService) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.patientId = currentUser.id;
  }

  ngOnInit(): void {
    this.loadExercices();
  }

  loadExercices(): void {
    this.loading = true;
    this.exerciseService.getActiveExercicesByPatient(this.patientId).subscribe({
      next: (exercices) => {
        this.exercices = exercices;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement exercices:', error);
        this.loading = false;
      }
    });
  }

  markAsCompleted(exerciceId: number): void {
    this.exerciseService.markAsCompleted(exerciceId).subscribe({
      next: (updatedExercice) => {
        const index = this.exercices.findIndex(e => e.id === exerciceId);
        if (index !== -1) {
          this.exercices[index] = updatedExercice;
        }
        alert('Exercice complété avec succès 🎉');
      },
      error: (error) => {
        console.error('Erreur mise à jour:', error);
        alert('Une erreur est survenue');
      }
    });
  }

  getStatusBadgeClass(statut: string): string {
    const classes = {
      'ACTIF': 'badge bg-warning',
      'COMPLETE': 'badge bg-success',
      'ANNULE': 'badge bg-danger'
    };
    return classes[statut as keyof typeof classes] || 'badge bg-secondary';
  }

  getStatusText(statut: string): string {
    const texts = {
      'ACTIF': 'Actif',
      'COMPLETE': 'Terminé',
      'ANNULE': 'Annulé'
    };
    return texts[statut as keyof typeof texts] || statut;
  }

  getFrequenceText(frequence: string): string {
    const texts = {
      'UN_PAR_JOUR': 'Une fois par jour',
      'UN_PAR_SEMAINE': 'Une fois par semaine',
      'PROGRAMME_PERSONNALISE': 'Programme personnalisé'
    };
    return texts[frequence as keyof typeof texts] || frequence;
  }

  getDureeText(duree: string): string {
    const texts = {
      'UNE_SEMAINE': '1 semaine',
      'DEUX_SEMAINES': '2 semaines',
      'UN_MOIS': '1 mois',
      'JUSQUA_NOUVELLE_EVALUATION': 'Jusqu’à la prochaine évaluation'
    };
    return texts[duree as keyof typeof texts] || duree;
  }
}

import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../services/exercise.service';
import { Exercice } from '../../models/exercise';

@Component({
  selector: 'app-doctor-exercises-view',
  templateUrl: './doctor-exercises-view.component.html',
  styleUrls: ['./doctor-exercises-view.component.scss']
})
export class DoctorExercisesViewComponent implements OnInit {
  exercices: Exercice[] = [];
  loading = false;
  filterStatut = 'TOUS';
  coachId: number;

  constructor(private exerciseService: ExerciseService) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.coachId = currentUser.id;
  }

  ngOnInit(): void {
    this.loadExercices();
  }

  loadExercices(): void {
    this.loading = true;
    this.exerciseService.getExercicesByCoach(this.coachId).subscribe({
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

  get filteredExercices(): Exercice[] {
    if (this.filterStatut === 'TOUS') return this.exercices;
    return this.exercices.filter(e => e.statut === this.filterStatut);
  }

  getStats() {
    const total = this.exercices.length;
    const active = this.exercices.filter(e => e.statut === 'ACTIF').length;
    const completed = this.exercices.filter(e => e.statut === 'COMPLETE').length;
    const cancelled = this.exercices.filter(e => e.statut === 'ANNULE').length;
    return { total, active, completed, cancelled };
  }

  // mêmes helpers (FR)
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
}

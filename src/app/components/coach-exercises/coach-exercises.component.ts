import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../services/exercise.service';
import { Exercice } from '../../models/exercise';

@Component({
  selector: 'coach-exercises',
  templateUrl: './coach-exercises.component.html',
  styleUrls: ['./coach-exercises.component.scss']
})
export class CoachExercisesComponent implements OnInit {
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

   

// تعريف خيارات الفلترة
filterOptions = [
  { value: 'TOUS', label: 'Tous les exercices', icon: '📋' },
  { value: 'ACTIF', label: 'Exercices Actifs', icon: '🟡' },
  { value: 'COMPLETE', label: 'Exercices Terminés', icon: '🟢' },
  { value: 'ANNULE', label: 'Exercices Annulés', icon: '🔴' }
];

// دالة لإعادة تعيين الفلترة
resetFilters(): void {
  this.filterStatut = 'TOUS';
}

// دالة لتحديد حالة الإلغاء
getCancelledStatus(): string {
  const cancelledPercentage = (this.getStats().cancelled / this.getStats().total) * 100;
  if (cancelledPercentage < 5) return 'low';
  if (cancelledPercentage < 15) return 'medium';
  return 'high';
}

  // دالة لتحديد كلاس الحالة
getExerciseStatusClass(statut: string): string {
  const statusMap: { [key: string]: string } = {
    'ACTIF': 'active',
    'COMPLETE': 'completed', 
    'ANNULE': 'cancelled'
  };
  return statusMap[statut] || '';
}

// دالة للحصول على نص الحالة
getStatusText(statut: string): string {
  const statusMap: { [key: string]: string } = {
    'ACTIF': 'Actif',
    'COMPLETE': 'Terminé',
    'ANNULE': 'Annulé'
  };
  return statusMap[statut] || statut;
}

// دالة للحصول على كلاس الـ badge
getStatusBadgeClass(statut: string): string {
  const statusMap: { [key: string]: string } = {
    'ACTIF': 'status-badge active',
    'COMPLETE': 'status-badge completed',
    'ANNULE': 'status-badge cancelled'
  };
  return statusMap[statut] || 'status-badge';
}

// دالة للحصول على نص التكرار
getFrequenceText(frequence: string): string {
  const frequenceMap: { [key: string]: string } = {
    'QUOTIDIEN': 'Quotidien',
    'HEBDOMADAIRE': 'Hebdomadaire', 
    'MENSUEL': 'Mensuel',
    'PONCTUEL': 'Ponctuel'
  };
  return frequenceMap[frequence] || frequence;
}
}

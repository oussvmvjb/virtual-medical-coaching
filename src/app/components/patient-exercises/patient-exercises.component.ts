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







  // دوال مساعدة للواجهة
getExerciseStatusClass(statut: string): string {
  const statusMap: { [key: string]: string } = {
    'ACTIF': 'active',
    'COMPLETE': 'completed', 
    'ANNULE': 'cancelled'
  };
  return statusMap[statut] || '';
}

getStatusBadgeClass(statut: string): string {
  const statusMap: { [key: string]: string } = {
    'ACTIF': 'status-badge active',
    'COMPLETE': 'status-badge completed',
    'ANNULE': 'status-badge cancelled'
  };
  return statusMap[statut] || 'status-badge';
}

getStatusText(statut: string): string {
  const statusMap: { [key: string]: string } = {
    'ACTIF': 'En Cours',
    'COMPLETE': 'Terminé',
    'ANNULE': 'Annulé'
  };
  return statusMap[statut] || statut;
}

getFrequenceText(frequence: string): string {
  const frequenceMap: { [key: string]: string } = {
    'QUOTIDIEN': 'Quotidien',
    'HEBDOMADAIRE': 'Hebdomadaire', 
    'MENSUEL': 'Mensuel',
    'PONCTUEL': 'Ponctuel'
  };
  return frequenceMap[frequence] || frequence;
}

getDureeText(duree: string): string {
  const dureeMap: { [key: string]: string } = {
    'COURTE': '15-30 min',
    'MOYENNE': '30-60 min',
    'LONGUE': '60+ min'
  };
  return dureeMap[duree] || duree || 'Non spécifiée';
}

getDifficulteText(difficulte: string): string {
  const difficulteMap: { [key: string]: string } = {
    'FACILE': 'Facile',
    'MOYEN': 'Moyen',
    'DIFFICILE': 'Difficile'
  };
  return difficulteMap[difficulte] || difficulte || 'Standard';
}

getProgressionText(exercice: any): string {
  if (exercice.statut === 'COMPLETE') return '100% Terminé';
  if (exercice.statut === 'ANNULE') return '0% Annulé';
  return 'En progression';
}

// دالة لتحديث التمارين
refreshExercices(): void {
  this.loading = true;
  // أضف منطق جلب التمارين هنا
  setTimeout(() => {
    this.loading = false;
  }, 1000);
}

// دالة لعرض تفاصيل التمرين
viewExerciseDetails(exercice: any): void {
  // أضف منطق عرض التفاصيل هنا
  console.log('Détails de l\'exercice:', exercice);
}
}

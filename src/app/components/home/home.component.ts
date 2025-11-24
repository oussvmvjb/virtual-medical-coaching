import { Component } from '@angular/core';

interface Psychologue {
  nom: string;
  specialite: string;
  photo: string;
  disponible: boolean;
  avis: number; 
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  besoins: string[] = [
    'Anxiété',
    'Dépression',
    'Stress',
    'Burn-out',
    'Problèmes de sommeil'
  ];

  psychologues: Psychologue[] = [
    {
      nom: 'Dr. Marie Dupont',
      specialite: 'Psychologie clinique',
      photo: 'assets/psycho1.jpg',
      disponible: true,
      avis: 4.5
    },
    {
      nom: 'Dr. Lina Ben Salah',
      specialite: 'Thérapie cognitive',
      photo: 'assets/psycho2.jpg',
      disponible: false,
      avis: 4
    },
    {
      nom: 'Dr. Sophie Martin',
      specialite: 'Psychothérapie',
      photo: 'assets/psycho3.jpg',
      disponible: true,
      avis: 5
    },
    {
      nom: 'Dr. Karim Lamine',
      specialite: 'Psychologie du travail',
      photo: 'assets/psycho4.jpg',
      disponible: true,
      avis: 4.2
    }
  ];

  commencer() {
    alert('Redirection vers la réservation d’une session.');
  }

  trouverCoach() {
    alert('Redirection vers la liste complète des coachs.');
  }

  voirProfil(psycho: Psychologue) {
    alert(`Voir le profil de ${psycho.nom}`);
  }

  toggleDisponibilite(index: number) {
    this.psychologues[index].disponible = !this.psychologues[index].disponible;
  }
}

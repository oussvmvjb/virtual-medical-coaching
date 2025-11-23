import { Component } from '@angular/core';

interface Psychologue {
  nom: string;
  specialite: string;
  photo: string;
  disponible: boolean;
  avis: number; // note sur 5
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Liste des besoins
  besoins: string[] = [
    'Anxiété',
    'Dépression',
    'Stress',
    'Burn-out',
    'Problèmes de sommeil'
  ];

  // Liste des psychologues
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

  // Actions des boutons
  commencer() {
    alert('Redirection vers la réservation d’une session.');
    // Ici tu peux ajouter la logique pour router vers la page de réservation
    // this.router.navigate(['/reservation']);
  }

  trouverCoach() {
    alert('Redirection vers la liste complète des coachs.');
    // Exemple : this.router.navigate(['/psychologues']);
  }

  voirProfil(psycho: Psychologue) {
    alert(`Voir le profil de ${psycho.nom}`);
    // Exemple : this.router.navigate(['/psychologue', psycho.id]);
  }

  toggleDisponibilite(index: number) {
    // Permet de changer la disponibilité d’un psychologue
    this.psychologues[index].disponible = !this.psychologues[index].disponible;
  }
}

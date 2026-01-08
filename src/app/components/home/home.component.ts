import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Psychologue {
  id?: number;
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
      id: 1,
      nom: 'Dr. Marie Dupont',
      specialite: 'Psychologie clinique',
      photo: 'assets/psycho1.jpg',
      disponible: true,
      avis: 4.5
    },
    {
      id: 2,
      nom: 'Dr. Lina Ben Salah',
      specialite: 'Thérapie cognitive',
      photo: 'assets/psycho2.jpg',
      disponible: false,
      avis: 4
    },
    {
      id: 3,
      nom: 'Dr. Sophie Martin',
      specialite: 'Psychothérapie',
      photo: 'assets/psycho3.jpg',
      disponible: true,
      avis: 5
    },
    {
      id: 4,
      nom: 'Dr. Karim Lamine',
      specialite: 'Psychologie du travail',
      photo: 'assets/psycho4.jpg',
      disponible: true,
      avis: 4.2
    }
  ];

  constructor(private router: Router) { }

  commencer() {
    alert('Redirection vers la réservation dune session.');
  }

  trouverCoach() {
    alert('Redirection vers la liste complète des coachs.');
  }

  voirProfil(psycho: Psychologue) {
    if (psycho.id) {
      this.router.navigate(['/coach-profile', psycho.id]);
    }
  }

  toggleDisponibilite(index: number) {
    this.psychologues[index].disponible = !this.psychologues[index].disponible;
  }
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Psychologue {
  id?: number;
  nom: string;
  specialite: string;
  photo: string;
  disponible: boolean;
  avis: number;
  description?: string;
  experience?: string;
  formation?: string;
  langues?: string[];
  tarif?: number;
  horaires?: string;
  email?: string;
  telephone?: string;
}

interface Avis {
  nom: string;
  note: number;
  commentaire: string;
  date: string;
}

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.scss']
})
export class CoachProfileComponent implements OnInit {
  psychologue: Psychologue | null = null;

  // Sample reviews
  avisClients: Avis[] = [
    {
      nom: 'Marie L.',
      note: 5,
      commentaire: 'Excellente psychologue, très à l\'écoute et professionnelle.',
      date: '15 Nov 2024'
    },
    {
      nom: 'Ahmed B.',
      note: 4.5,
      commentaire: 'Très bon accompagnement, je recommande vivement.',
      date: '10 Nov 2024'
    },
    {
      nom: 'Sophie D.',
      note: 5,
      commentaire: 'Une vraie aide dans mon parcours de guérison.',
      date: '5 Nov 2024'
    }
  ];

  // Sample psychologists data (in a real app, this would come from a service)
  psychologues: Psychologue[] = [
    {
      id: 1,
      nom: 'Dr. Marie Dupont',
      specialite: 'Psychologie clinique',
      photo: 'assets/psycho1.jpg',
      disponible: true,
      avis: 4.5,
      description: 'Psychologue clinicienne spécialisée dans la thérapie cognitive et comportementale. Je vous accompagne dans la gestion de l\'anxiété, du stress et des troubles de l\'humeur.',
      experience: '10 ans d\'expérience',
      formation: 'Doctorat en Psychologie Clinique - Université Paris Descartes',
      langues: ['Français', 'Anglais', 'Espagnol'],
      tarif: 60,
      horaires: 'Lun-Ven: 9h-18h',
      email: 'marie.dupont@vmc.com',
      telephone: '+33 6 12 34 56 78'
    },
    {
      id: 2,
      nom: 'Dr. Lina Ben Salah',
      specialite: 'Thérapie cognitive',
      photo: 'assets/psycho2.jpg',
      disponible: false,
      avis: 4,
      description: 'Spécialiste en thérapie cognitive avec une approche centrée sur la personne. J\'aide mes patients à surmonter leurs difficultés émotionnelles et relationnelles.',
      experience: '8 ans d\'expérience',
      formation: 'Master en Psychologie Cognitive - Université de Lyon',
      langues: ['Français', 'Arabe'],
      tarif: 55,
      horaires: 'Mar-Sam: 10h-19h',
      email: 'lina.bensalah@vmc.com',
      telephone: '+33 6 23 45 67 89'
    },
    {
      id: 3,
      nom: 'Dr. Sophie Martin',
      specialite: 'Psychothérapie',
      photo: 'assets/psycho3.jpg',
      disponible: true,
      avis: 5,
      description: 'Psychothérapeute expérimentée, je propose un accompagnement personnalisé pour les troubles anxieux, dépressifs et les problèmes de confiance en soi.',
      experience: '12 ans d\'expérience',
      formation: 'Doctorat en Psychothérapie - Université de Bordeaux',
      langues: ['Français', 'Anglais'],
      tarif: 65,
      horaires: 'Lun-Ven: 8h-17h',
      email: 'sophie.martin@vmc.com',
      telephone: '+33 6 34 56 78 90'
    },
    {
      id: 4,
      nom: 'Dr. Karim Lamine',
      specialite: 'Psychologie du travail',
      photo: 'assets/psycho4.jpg',
      disponible: true,
      avis: 4.2,
      description: 'Psychologue du travail spécialisé dans la gestion du stress professionnel, le burn-out et l\'accompagnement au changement.',
      experience: '7 ans d\'expérience',
      formation: 'Master en Psychologie du Travail - Université de Toulouse',
      langues: ['Français', 'Anglais', 'Arabe'],
      tarif: 58,
      horaires: 'Lun-Jeu: 14h-20h',
      email: 'karim.lamine@vmc.com',
      telephone: '+33 6 45 67 89 01'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get the psychologist ID from the route
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.psychologue = this.psychologues.find(p => p.id === id) || null;

      if (!this.psychologue) {
        // If no psychologist found, redirect to home
        this.router.navigate(['/home']);
      }
    });
  }

  reserverSession() {
    if (this.psychologue) {
      alert(`Réservation d'une session avec ${this.psychologue.nom}`);
      // In a real app, navigate to booking page
      // this.router.navigate(['/booking', this.psychologue.id]);
    }
  }

  envoyerMessage() {
    if (this.psychologue) {
      alert(`Envoi d'un message à ${this.psychologue.nom}`);
      // In a real app, open messaging interface
    }
  }

  retourListe() {
    this.router.navigate(['/home']);
  }

  getStarArray(rating: number): number[] {
    return [1, 2, 3, 4, 5];
  }
}

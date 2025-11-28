export interface Exercice {
[x: string]: any;
  id?: number;
  idPatient: number;
  idCoach: number;
  titre: string;
  description: string;
  typeTrouble: TypeTrouble;
  frequence: Frequence;
  instructions: string;
  duree: Duree;
  niveauRisque: NiveauRisque;
  dateCreation?: string;
  statut: StatutExercice;
}

export enum TypeTrouble {
  TROUBLE_ANXIEUX = 'TROUBLE_ANXIEUX',
  DEPRESSION = 'DEPRESSION',
  TROUBLE_SOMMEIL = 'TROUBLE_SOMMEIL',
  BURNOUT_STRESS = 'BURNOUT_STRESS',
  TROUBLE_PANIQUE = 'TROUBLE_PANIQUE',
  STRESS_POST_TRAUMATIQUE = 'STRESS_POST_TRAUMATIQUE',
  AUTRE = 'AUTRE'
}

export enum Frequence {
  UN_PAR_JOUR = 'UN_PAR_JOUR',
  UN_PAR_SEMAINE = 'UN_PAR_SEMAINE',
  PROGRAMME_PERSONNALISE = 'PROGRAMME_PERSONNALISE'
}

export enum Duree {
  UNE_SEMAINE = 'UNE_SEMAINE',
  DEUX_SEMAINES = 'DEUX_SEMAINES',
  UN_MOIS = 'UN_MOIS',
  JUSQUA_NOUVELLE_EVALUATION = 'JUSQUA_NOUVELLE_EVALUATION'
}

export enum NiveauRisque {
  FAIBLE = 'FAIBLE',
  MOYEN = 'MOYEN',
  ELEVE = 'ELEVE'
}

export enum StatutExercice {
  ACTIF = 'ACTIF',
  COMPLETE = 'COMPLETE',
  ANNULE = 'ANNULE'
}

// DTO pour la création d'exercice
export interface ExerciceRequest {
  idPatient: number;
  idCoach: number;
  titre: string;
  description: string;
  typeTrouble: TypeTrouble;
  frequence: Frequence;
  instructions: string;
  duree: Duree;
  niveauRisque: NiveauRisque;
  exercicesSelectionnes?: string[];
  exercicePersoNom?: string;
  exercicePersoDesc?: string;
}
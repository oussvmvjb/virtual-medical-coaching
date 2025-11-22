export interface MoodEvaluation {
  id_evaluation?: number; // Optional as it's usually auto-incremented by DB
  id_patient: number;
  humeur: number; // 1-10
  stress: number; // 1-10
  energie: number; // 1-10
  motivation: number; // 1-10
  sommeil: number; // 1-10
  symptomes: string; // Handling JSON text as string for the form
  pensees_risque: boolean;
  details_risque?: string;
  appetit: 'normal' | 'diminue' | 'augmente';
  activite_physique: 'aucune' | 'faible' | 'moderee' | 'bonne';
  interactions_sociales: 'aucune' | 'faible' | 'normale' | 'active';
  commentaire?: string;
  date_evaluation: Date;
}
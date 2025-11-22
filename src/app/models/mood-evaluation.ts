// models/mood-evaluation.ts
export interface Evaluation {
  id?: number;
  idPatient: number;                    // camelCase
  humeur: number;
  stress: number;
  energie: number;
  motivation: number;
  sommeil: number;
  symptomes?: string;
  appetit: 'NORMAL' | 'DIMINUE' | 'AUGMENTE';
  activitePhysique: 'AUCUNE' | 'FAIBLE' | 'MODEREE' | 'BONNE';  // camelCase
  interactionsSociales: 'AUCUNE' | 'FAIBLE' | 'NORMALE' | 'ACTIVE';  // camelCase
  penseesRisque: boolean;               // camelCase
  detailsRisque?: string;               // camelCase
  commentaire?: string;
  dateEvaluation?: Date;                // camelCase
}
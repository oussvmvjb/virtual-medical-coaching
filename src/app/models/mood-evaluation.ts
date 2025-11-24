
export interface Evaluation {
  id?: number;
  idPatient: number;                    
  humeur: number;
  stress: number;
  energie: number;
  motivation: number;
  sommeil: number;
  symptomes?: string;
  appetit: 'NORMAL' | 'DIMINUE' | 'AUGMENTE';
  activitePhysique: 'AUCUNE' | 'FAIBLE' | 'MODEREE' | 'BONNE';  
  interactionsSociales: 'AUCUNE' | 'FAIBLE' | 'NORMALE' | 'ACTIVE';  
  penseesRisque: boolean;               
  detailsRisque?: string;               
  commentaire?: string;
  dateEvaluation?: Date;                
}
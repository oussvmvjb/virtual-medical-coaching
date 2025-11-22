export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  psw: string;
  
}

export interface LoginRequest {
  email: string;
  psw: string;
}
export interface SignupRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string; // Changé de 'tel' à 'telephone'
  psw: string;
  confirmPassword: string;
  role: string; // Ajout du champ rôle
}
export interface ForgotPasswordRequest {
  email: string;
}
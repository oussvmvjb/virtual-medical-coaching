export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  psw: string;
  role: string; 
  
}

export interface LoginRequest {
  email: string;
  psw: string;
}
export interface SignupRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string; 
  psw: string;
  confirmPassword: string;
  role: string; 
}
export interface ForgotPasswordRequest {
  email: string;
}
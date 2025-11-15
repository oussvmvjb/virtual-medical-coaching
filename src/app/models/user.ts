export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
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
  tel: string;
  psw: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
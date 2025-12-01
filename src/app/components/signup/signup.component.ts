import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/user';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupData: SignupRequest = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    psw: '',
    confirmPassword: '',
    role: 'USER' 
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  passwordMismatch: boolean = false;


  roles = [
    { value: 'USER', label: 'Utilisateur' },
    { value: 'COACH', label: 'Coach' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  checkPasswordMatch(): void {
    this.passwordMismatch = this.signupData.psw !== this.signupData.confirmPassword;
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.signupData.nom || !this.signupData.prenom || !this.signupData.email || 
        !this.signupData.telephone || !this.signupData.psw || !this.signupData.confirmPassword) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return false;
    }

    if (this.signupData.psw.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }

    if (this.passwordMismatch) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupData.email)) {
      this.errorMessage = 'L\'email n\'est pas valide';
      return false;
    }

    const telRegex = /^[0-9]{8,8}$/;
    if (!telRegex.test(this.signupData.telephone)) {
      this.errorMessage = 'Le numéro de téléphone doit contenir 8 chiffres uniquement';
      return false;
    }

    if (!this.signupData.role) {
      this.errorMessage = 'Veuillez sélectionner un rôle';
      return false;
    }

    return true;
  }

onSubmit(): void {
  this.checkPasswordMatch();

  if (!this.validateForm()) {
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.authService.checkEmailExists(this.signupData.email).subscribe({
    next: (result) => {
      if (result.exists) {
        this.isLoading = false;
        this.errorMessage = "Cet email a déjà un compte. Veuillez utiliser un autre email ou récupérer votre mot de passe.";
        return;
      }
      this.authService.signup(this.signupData).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur d\'inscription:', error);
          this.errorMessage = error.message;
        }
      });
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = "Erreur lors de la vérification de l'email";
      console.error('Erreur de vérification email:', error);
    }
  });
}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  clearForm(): void {
    this.signupData = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '', 
      psw: '',
      confirmPassword: '',
      role: 'USER' 
    };
    this.errorMessage = '';
    this.passwordMismatch = false;
  }
}
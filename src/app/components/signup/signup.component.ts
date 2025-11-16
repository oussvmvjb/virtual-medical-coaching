import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/user';

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
    tel: '',
    psw: '',
    confirmPassword: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  checkPasswordMatch(): void {
    this.passwordMismatch = this.signupData.psw !== this.signupData.confirmPassword;
  }

  validateForm(): boolean {
    // Réinitialiser le message d'erreur
    this.errorMessage = '';

    if (!this.signupData.nom || !this.signupData.prenom || !this.signupData.email || 
        !this.signupData.tel || !this.signupData.psw || !this.signupData.confirmPassword) {
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

    // Vérification du numéro de téléphone
    const telRegex = /^[0-9]{10,15}$/;
    if (!telRegex.test(this.signupData.tel)) {
      this.errorMessage = 'Le numéro de téléphone doit contenir 10-15 chiffres uniquement';
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

    this.authService.signup(this.signupData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur d\'inscription:', error);
        
        // Afficher le message d'erreur à l'utilisateur
        this.errorMessage = error.message;
        
        // Si l'erreur est due à un email dupliqué, suggérer des solutions
        if (error.message.includes('email')) {
          this.errorMessage += ' - Essayez d\'utiliser un email différent ou récupérez votre mot de passe';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Fonction pour vider les champs
  clearForm(): void {
    this.signupData = {
      nom: '',
      prenom: '',
      email: '',
      tel: '',
      psw: '',
      confirmPassword: ''
    };
    this.errorMessage = '';
    this.passwordMismatch = false;
  }
}
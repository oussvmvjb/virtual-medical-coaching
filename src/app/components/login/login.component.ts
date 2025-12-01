import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    psw: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.checkEmailExists(this.loginData.email).subscribe({
      next: (result) => {
        if (!result.exists) {
          this.isLoading = false;
          this.errorMessage = "Don't have account";
          return;
        }
        this.authService.login(this.loginData).subscribe({
          next: (user) => {
            this.isLoading = false;
            if (user) {
              this.router.navigate(['/home']);
            } else {
              this.errorMessage = 'Password incorrect';
            }
          },
          error: (error) => {
            this.isLoading = false;
            const msg = error.error?.message || error.message || '';
            if (msg.includes('password')) {
              this.errorMessage = "Password incorrect";
            } else {
              this.errorMessage = 'Password incorrect';
            }
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la vérification de l\'email';
      }
    });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
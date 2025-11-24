import { Component } from '@angular/core';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  requestData = {
    email: ''
  };
  
  message: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  private emailjsConfig = environment.emailjs;

  constructor(private authService: AuthService, private router: Router) {
    emailjs.init(this.emailjsConfig.publicKey);
    console.log(' EmailJS initialisé avec la configuration:', this.emailjsConfig);
  }

  validateEmail(): boolean {
    this.errorMessage = '';
    
    if (!this.requestData.email) {
      this.errorMessage = 'L\'email est requis';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.requestData.email)) {
      this.errorMessage = 'L\'email n\'est pas valide';
      return false;
    }

    return true;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateEmail()) {
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';
    this.isSuccess = false;

    try {
      console.log(' Début de la réinitialisation du mot de passe pour:', this.requestData.email);

      const userExists = await this.checkUserExists(this.requestData.email);
      
      if (!userExists) {
        this.errorMessage = 'L\'email n\'est pas enregistré dans le système';
        this.isLoading = false;
        return;
      }

      console.log(' Utilisateur existe, génération du nouveau mot de passe...');

      const newPassword = this.generateRandomPassword();
      console.log(' Mot de passe généré:', newPassword);
      
      await this.updateUserPassword(this.requestData.email, newPassword);
      
      console.log('Mot de passe mis à jour dans la base de données, tentative d\'envoi d\'email...');

      try {
        await this.sendPasswordByEmail(this.requestData.email, newPassword);
        console.log(' Email envoyé avec succès!');
        
        this.isSuccess = true;
        this.message = ` Le nouveau mot de passe a été envoyé à ${this.requestData.email}`;
        
      } catch (emailError) {
        console.warn(' L\'email a échoué mais le mot de passe a été mis à jour');
        
        this.isSuccess = true;
        this.message = ` Mot de passe mis à jour avec succès! 
        Nouveau mot de passe: ${newPassword}
        Veuillez l'utiliser pour vous connecter puis le changer ultérieurement.`;
      }
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 8000); 

    } catch (error: any) {
      console.error(' Erreur de réinitialisation du mot de passe:', error);
      this.errorMessage = 'Une erreur est survenue: ' + error.message;
    } finally {
      this.isLoading = false;
    }
  }

  private async checkUserExists(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.authService.checkEmailExists(email).subscribe({
        next: (exists) => {
          console.log(' Résultat de l\'existence de l\'utilisateur:', exists);
          resolve(exists);
        },
        error: (error) => {
          console.error(' Erreur lors de la vérification de l\'utilisateur:', error);
          resolve(false);
        }
      });
    });
  }

  private async updateUserPassword(email: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(' Appel de l\'API updatePassword pour:', email);
      
      this.authService.updatePassword(email, newPassword).subscribe({
        next: (response) => {
          console.log(' Réponse de la mise à jour du mot de passe:', response);
          
          if (typeof response === 'string' && response.includes('Password updated successfully')) {
            console.log(' Mot de passe mis à jour avec succès dans la base de données');
            resolve();
          } else {
            console.warn(' Réponse inattendue:', response);
            resolve(); 
          }
        },
        error: (error) => {
          console.error(' Erreur lors de la mise à jour du mot de passe dans la base de données:', error);
          
          if (error.status === 200) {
            console.log(' On considère le statut 200 comme un succès malgré ok:false');
            resolve();
          } else {
            reject(new Error('Échec de la mise à jour du mot de passe dans le système'));
          }
        }
      });
    });
  }

  private generateRandomPassword(): string {
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  private handleEmailError(error: any): void {
    console.error(' Détails complets de l\'erreur:', error);
    
    if (error?.message?.includes('Échec de l\'envoi de l\'email')) {
      this.errorMessage = 'Le mot de passe a été mis à jour mais l\'envoi de l\'email a échoué. Veuillez utiliser le nouveau mot de passe pour vous connecter.';
    } else if (error?.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Une erreur inattendue est survenue, veuillez réessayer plus tard';
    }
  }

  private async sendPasswordByEmail(userEmail: string, newPassword: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(' Début du processus d\'envoi d\'email...');
        
        const templateParams = {
          to_email: userEmail,
          user_email: userEmail,
          new_password: newPassword,
          app_name: 'virtual medical coaching App',
          support_email: 'support@biblioapp.com',
          current_year: new Date().getFullYear(),
          login_url: 'http://localhost:4200/login'
        };

        console.log(' Paramètres EmailJS:', {
          serviceId: this.emailjsConfig.serviceId,
          templateId: this.emailjsConfig.templateId,
          publicKey: this.emailjsConfig.publicKey.substring(0, 10) + '...'  
        });

        console.log(' Paramètres du template:', templateParams);

        const response = await emailjs.send(
          this.emailjsConfig.serviceId,
          this.emailjsConfig.templateId,
          templateParams,
          this.emailjsConfig.publicKey
        );

        console.log('Réponse EmailJS:', response);
        resolve();

      } catch (error: any) {
        console.error(' Détails de l\'erreur EmailJS:', {
          status: error?.status,
          text: error?.text,
          message: error?.message,
          fullError: error
        });
        
        reject(new Error('Échec de l\'envoi de l\'email: ' + (error?.text || error?.message || 'Erreur inconnue')));
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  resetForm(): void {
    this.requestData.email = '';
    this.message = '';
    this.errorMessage = '';
    this.isSuccess = false;
  }

  async testEmailJS(): Promise<void> {
    const testEmail = this.requestData.email || 'test@example.com';
    const testPassword = 'TestPassword123';
    
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    try {
      console.log(' Test d\'EmailJS uniquement...');
      await this.sendPasswordByEmail(testEmail, testPassword);
      this.message = ' Test d\'envoi d\'email réussi!';
    } catch (error: any) {
      console.error(' Test EmailJS échoué:', error);
      this.errorMessage = ' Échec du test d\'email: ' + error.message;
    } finally {
      this.isLoading = false;
    }
  }

  showEmailJSConfig(): void {
    console.log(' Configuration complète d\'EmailJS:', this.emailjsConfig);
    this.message = `Paramètres EmailJS:
    Service: ${this.emailjsConfig.serviceId}
    Template: ${this.emailjsConfig.templateId}
    Clé Publique: ${this.emailjsConfig.publicKey.substring(0, 10)}...`;
  }
}
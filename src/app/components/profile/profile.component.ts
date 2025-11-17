import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  editData = {
    nom: '',
    prenom: '',
    email: '',
    tel: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.editData = {
      nom: this.currentUser.nom || '',
      prenom: this.currentUser.prenom || '',
      email: this.currentUser.email || '',
      tel: this.currentUser.tel || ''
    };
  }

  modifierProfil(): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  annulerModification(): void {
    this.isEditing = false;
    this.loadCurrentUser();
    this.errorMessage = '';
    this.successMessage = '';
  }

  sauvegarderModifications(): void {
    if (!this.currentUser?.id) {
      this.errorMessage = 'Utilisateur non trouvé';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (!this.validateEditData()) {
      this.isLoading = false;
      return;
    }

    this.authService.updateProfile(this.currentUser.id, this.editData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.isEditing = false;
        this.successMessage = 'Profil mis à jour avec succès!';
        this.currentUser = updatedUser;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        console.error('Erreur de mise à jour:', error);
      }
    });
  }

  private validateEditData(): boolean {
    if (!this.editData.nom?.trim() || !this.editData.prenom?.trim() || 
        !this.editData.email?.trim() || !this.editData.tel?.trim()) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editData.email)) {
      this.errorMessage = 'Format d\'email invalide';
      return false;
    }

    const telRegex = /^[0-9]{8,8}$/;
    if (!telRegex.test(this.editData.tel)) {
      this.errorMessage = 'Le numéro doit contenir 8 chiffres';
      return false;
    }

    return true;
  }

  supprimerCompte(): void {
    if (!this.currentUser?.id) {
      this.errorMessage = 'Utilisateur non trouvé';
      return;
    }

    const confirmation = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ?\nCette action est irréversible!'
    );

    if (!confirmation) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.deleteAccount(this.currentUser.id).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Votre compte a été supprimé avec succès');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        console.error('Erreur de suppression:', error);
      }
    });
  }

  retourAccueil(): void {
    this.router.navigate(['/home']);
  }
}
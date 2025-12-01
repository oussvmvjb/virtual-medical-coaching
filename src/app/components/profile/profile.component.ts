import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  editData = {
    prenom: '',
    nom: '',
    email: '',
    tel: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.editData = {
        prenom: this.currentUser.prenom || '',
        nom: this.currentUser.nom || '',
        email: this.currentUser.email || '',
        tel: this.currentUser.telephone || ''
      };
    }
  }

  getRoleText(role: string): string {
    const roleMap: { [key: string]: string } = {
      'USER': 'Patient',
      'COACH': 'Coach',
      'ADMIN': 'Administrateur'
    };
    return roleMap[role] || 'Utilisateur';
  }

  getRoleBadgeClass(role: string): string {
    const badgeClass: { [key: string]: string } = {
      'USER': 'badge bg-success',
      'COACH': 'badge bg-warning',
      'ADMIN': 'badge bg-danger'
    };
    return badgeClass[role] || 'badge bg-secondary';
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
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      this.isEditing = false;
      this.successMessage = 'Profil mis à jour avec succès!';
      
      if (this.currentUser) {
        this.currentUser.prenom = this.editData.prenom;
        this.currentUser.nom = this.editData.nom;
        this.currentUser.email = this.editData.email;
        this.currentUser.telephone = this.editData.tel;
        this.authService.setCurrentUser(this.currentUser);
      }
    }, 1500);
  }

  supprimerCompte(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.isLoading = false;
        this.authService.logout();
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  retourAccueil(): void {
    this.router.navigate(['/home']);
  }
}
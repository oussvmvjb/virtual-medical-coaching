import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { AdminService } from '../../../app/services/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  userForm!: FormGroup;
  selectedUser: User | null = null;
  isEditMode = false;
  isAddMode = false;
  filterRole = '';
  searchQuery = '';
  showForm = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      id: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      role: ['', Validators.required],
      psw: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.applyFilters();
      },
      (error: any) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
      }
    );
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesRole = !this.filterRole || user.role === this.filterRole;
      const matchesSearch = !this.searchQuery ||
        user.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.prenom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  addUser(): void {
    this.isAddMode = true;
    this.isEditMode = false;
    this.showForm = true;
    this.userForm.reset();
    this.userForm.patchValue({ role: '' });
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.isEditMode = true;
    this.isAddMode = false;
    this.showForm = true;
    this.userForm.patchValue({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role
    });
    this.errorMessage = '';
    this.successMessage = '';
    this.scrollToForm();
  }

  scrollToForm(): void {
    setTimeout(() => {
      const formSection = document.querySelector('.card-medical.mb-4');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    const formData = this.userForm.value;

    if (this.isAddMode) {
      this.adminService.createUser(formData).subscribe(
        (response: any) => {
          this.successMessage = 'Utilisateur créé avec succès';
          this.loadUsers();
          this.resetForm();
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error: any) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création de l\'utilisateur';
        }
      );
    } else if (this.isEditMode) {
      this.adminService.updateUser(formData.id, formData).subscribe(
        (response: any) => {
          this.successMessage = 'Utilisateur modifié avec succès';
          this.loadUsers();
          this.resetForm();
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error: any) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la modification de l\'utilisateur';
        }
      );
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.prenom} ${user.nom}?`)) {
      this.adminService.deleteUser(user.id).subscribe(
        (response: any) => {
          this.successMessage = 'Utilisateur supprimé avec succès';
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error: any) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'utilisateur';
        }
      );
    }
  }

  resetForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.isAddMode = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

  cancelForm(): void {
    this.resetForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'ADMIN': 'Administrateur',
      'COACH': 'Coach',
      'USER': 'Patient'
    };
    return roleLabels[role] || role;
  }
}

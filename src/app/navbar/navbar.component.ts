import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  currentUser: any;
  role: string = ''; // Changed from userRole to role to match your template
  isLoading = true;
  loadingMessage: string = "Bienvenue";
  private userSubscription: Subscription = new Subscription();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    
    // Subscribe to user changes for real-time updates
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateRoleFromUser();
      console.log('User updated:', this.currentUser);
      console.log('Role updated:', this.role);
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  loadCurrentUser(): void {
    // Get user from AuthService
    this.currentUser = this.authService.getCurrentUser();
    this.updateRoleFromUser();
    
    console.log('Initial User:', this.currentUser);
    console.log('Initial Role:', this.role);
  }

  private updateRoleFromUser(): void {
    if (this.currentUser) {
      // Handle different possible role property names and casings
      this.role = this.currentUser.role || 
                  this.currentUser.roleType || 
                  this.currentUser.userRole || 
                  '';
      
      // Normalize role to uppercase to match your template
      if (this.role) {
        this.role = this.role.toUpperCase();
      }
      
      // Fallback to localStorage
      if (!this.role) {
        const storedRole = localStorage.getItem('role');
        this.role = storedRole ? storedRole.toUpperCase() : '';
      }
    } else {
      this.role = '';
    }
  }

  // Helper methods for role checking (updated for your roles)
  isUser(): boolean {
    return this.role === 'USER';
  }

  isCoach(): boolean {
    return this.role === 'COACH';
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  hasRole(role: string): boolean {
    return this.role === role.toUpperCase();
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.map(r => r.toUpperCase()).includes(this.role);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || 
           this.router.url === '/signup' || 
           this.router.url === '/forgot-password';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.role = '';
    this.router.navigate(['/login']);
  }

  // Method to get user display name
  getUserDisplayName(): string {
    return this.currentUser?.name || 
           this.currentUser?.username || 
           this.currentUser?.email || 
           'Utilisateur';
  }

// دالة للحصول على حالة المستخدم
getUserStatus(): string {
  // يمكنك إضافة منطق لحالة المستخدم هنا
  return 'online'; // أو 'offline' أو 'busy'
}

// دالة للحصول على نص الدور
getRoleText(role: string): string {
  const roleMap: { [key: string]: string } = {
    'USER': 'Patient',
    'COACH': 'Coach Médical',
    'ADMIN': 'Administrateur'
  };
  return roleMap[role] || 'Utilisateur';
}
}
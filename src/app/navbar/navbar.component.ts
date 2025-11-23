import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  mobileMenuOpen = false;
  currentUser: any;
  userRole: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.userRole = this.currentUser.role || '';
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || 
           this.router.url === '/signup' || 
           this.router.url === '/forgot-password';
  }

  isUser(): boolean {
    return this.userRole === 'USER';
  }

  isCoach(): boolean {
    return this.userRole === 'COACH';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
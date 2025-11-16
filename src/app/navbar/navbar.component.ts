import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}
 mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
    isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url.includes('/login')|| 
    this.router.url === '/signup' || this.router.url.includes('/signup') || 
    this.router.url === '/forgot-password' || this.router.url.includes('/forgot-password');
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
      });
  }
}

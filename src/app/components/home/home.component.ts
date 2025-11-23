import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;

  // 👈 تعريف menuOpen للموبايل
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  get fullName(): string {
    return this.currentUser ? `${this.currentUser.prenom} ${this.currentUser.nom}` : '';
  }

  // 👈 طريقة لتبديل قائمة الموبايل
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}

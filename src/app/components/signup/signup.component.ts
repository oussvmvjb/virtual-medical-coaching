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
    // إعادة تعيين رسالة الخطأ
    this.errorMessage = '';

    if (!this.signupData.nom || !this.signupData.prenom || !this.signupData.email || 
        !this.signupData.tel || !this.signupData.psw || !this.signupData.confirmPassword) {
      this.errorMessage = 'جميع الحقول مطلوبة';
      return false;
    }

    if (this.signupData.psw.length < 6) {
      this.errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      return false;
    }

    if (this.passwordMismatch) {
      this.errorMessage = 'كلمات المرور غير متطابقة';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupData.email)) {
      this.errorMessage = 'البريد الإلكتروني غير صالح';
      return false;
    }

    // تحقق من رقم الهاتف
    const telRegex = /^[0-9]{10,15}$/;
    if (!telRegex.test(this.signupData.tel)) {
      this.errorMessage = 'رقم الهاتف يجب أن يحتوي على 10-15 رقم فقط';
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
        console.error('Signup error:', error);
        
        // عرض رسالة الخطأ للمستخدم
        this.errorMessage = error.message;
        
        // إذا كان الخطأ بسبب البريد المكرر، اقترح حلولاً
        if (error.message.includes('email')) {
          this.errorMessage += ' - حاول استخدام بريد إلكتروني مختلف أو استعادة كلمة المرور';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // دالة لتفريغ الحقول
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
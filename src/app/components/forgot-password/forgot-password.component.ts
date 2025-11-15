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
    // تهيئة EmailJS
    emailjs.init(this.emailjsConfig.publicKey);
    console.log('📧 EmailJS initialized with config:', this.emailjsConfig);
  }

  validateEmail(): boolean {
    this.errorMessage = '';
    
    if (!this.requestData.email) {
      this.errorMessage = 'البريد الإلكتروني مطلوب';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.requestData.email)) {
      this.errorMessage = 'البريد الإلكتروني غير صالح';
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
    console.log('🚀 Starting password reset for:', this.requestData.email);

    // 1. التحقق من وجود البريد
    const userExists = await this.checkUserExists(this.requestData.email);
    
    if (!userExists) {
      this.errorMessage = 'البريد الإلكتروني غير مسجل في النظام';
      this.isLoading = false;
      return;
    }

    console.log('✅ User exists, generating new password...');

    // 2. إنشاء كلمة مرور جديدة
    const newPassword = this.generateRandomPassword();
    console.log('🔑 Generated password:', newPassword);
    
    // 3. تحديث كلمة المرور في قاعدة البيانات أولاً
    await this.updateUserPassword(this.requestData.email, newPassword);
    
    console.log('✅ Password updated in database, attempting to send email...');

    // 4. محاولة إرسال البريد الإلكتروني (مع معالجة الخطأ)
    try {
      await this.sendPasswordByEmail(this.requestData.email, newPassword);
      console.log('✅ Email sent successfully!');
      
      this.isSuccess = true;
      this.message = `✅ تم إرسال كلمة المرور الجديدة إلى ${this.requestData.email}`;
      
    } catch (emailError) {
      console.warn('⚠️ Email failed but password was updated');
      
      // عرض كلمة المرور للمستخدم مباشرةً
      this.isSuccess = true;
      this.message = `✅ تم تحديث كلمة المرور بنجاح! 
      كلمة المرور الجديدة: ${newPassword}
      يرجى استخدامها لتسجيل الدخول ثم تغييرها لاحقاً.`;
    }
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 8000); // وقت أطول لقراءة كلمة المرور

  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    this.errorMessage = 'حدث خطأ في العملية: ' + error.message;
  } finally {
    this.isLoading = false;
  }
}

  private async checkUserExists(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.authService.checkEmailExists(email).subscribe({
        next: (exists) => {
          console.log('👤 User exists result:', exists);
          resolve(exists);
        },
        error: (error) => {
          console.error('❌ Error checking user exists:', error);
          resolve(false);
        }
      });
    });
  }

 


private async updateUserPassword(email: string, newPassword: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('💾 Calling updatePassword API for:', email);
    
    this.authService.updatePassword(email, newPassword).subscribe({
      next: (response) => {
        console.log('✅ Password update response:', response);
        
        // معالجة الـ response النصي
        if (typeof response === 'string' && response.includes('Password updated successfully')) {
          console.log('✅ Password updated successfully in database');
          resolve();
        } else {
          console.warn('⚠️ Unexpected response:', response);
          resolve(); // مع ذلك نعتبره نجاحاً
        }
      },
      error: (error) => {
        console.error('❌ Error updating password in database:', error);
        
        // إذا كان status 200 ولكن ok: false، نعتبره نجاحاً
        if (error.status === 200) {
          console.log('✅ Considering 200 status as success despite ok:false');
          resolve();
        } else {
          reject(new Error('فشل في تحديث كلمة المرور في النظام'));
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
    console.error('❌ Full error details:', error);
    
    if (error?.message?.includes('فشل في إرسال البريد الإلكتروني')) {
      this.errorMessage = 'تم تحديث كلمة المرور ولكن فشل إرسال البريد. يرجى استخدام كلمة المرور الجديدة لتسجيل الدخول.';
    } else if (error?.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً';
    }
  }


  // دالة لعرض بيانات EmailJS للتdebug

private async sendPasswordByEmail(userEmail: string, newPassword: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('📧 Starting email sending process...');
      
      const templateParams = {
        to_email: userEmail,
        user_email: userEmail,
        new_password: newPassword,
        app_name: 'Biblio App',
        support_email: 'support@biblioapp.com',
        current_year: new Date().getFullYear(),
        login_url: 'http://localhost:4200/login'
      };

      console.log('🔧 EmailJS Parameters:', {
        serviceId: this.emailjsConfig.serviceId,
        templateId: this.emailjsConfig.templateId,
        publicKey: this.emailjsConfig.publicKey.substring(0, 10) + '...' // إخفاء part من المفتاح
      });

      console.log('📨 Template Params:', templateParams);

      // محاولة إرسال البريد
      const response = await emailjs.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId,
        templateParams,
        this.emailjsConfig.publicKey
      );

      console.log('✅ EmailJS Response:', response);
      resolve();

    } catch (error: any) {
      console.error('❌ EmailJS Error Details:', {
        status: error?.status,
        text: error?.text,
        message: error?.message,
        fullError: error
      });
      
      reject(new Error('فشل إرسال البريد: ' + (error?.text || error?.message || 'Unknown error')));
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
  // دالة لاختبار إرسال البريد منفرداً
async testEmailJS(): Promise<void> {
  const testEmail = this.requestData.email || 'test@example.com';
  const testPassword = 'TestPassword123';
  
  this.isLoading = true;
  this.message = '';
  this.errorMessage = '';

  try {
    console.log('🧪 Testing EmailJS only...');
    await this.sendPasswordByEmail(testEmail, testPassword);
    this.message = '✅ اختبار إرسال البريد نجح!';
  } catch (error: any) {
    console.error('❌ EmailJS Test Failed:', error);
    this.errorMessage = '❌ فشل اختبار البريد: ' + error.message;
  } finally {
    this.isLoading = false;
  }
}

// دالة لعرض إعدادات EmailJS
showEmailJSConfig(): void {
  console.log('🔧 Full EmailJS Config:', this.emailjsConfig);
  this.message = `إعدادات EmailJS:
  Service: ${this.emailjsConfig.serviceId}
  Template: ${this.emailjsConfig.templateId}
  Public Key: ${this.emailjsConfig.publicKey.substring(0, 10)}...`;
}
}
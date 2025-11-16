import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, LoginRequest, SignupRequest, ForgotPasswordRequest } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
forgotPassword(request: ForgotPasswordRequest): Observable<any> {
  return this.http.get<User[]>(this.apiUrl).pipe(
    map(users => {
      const userExists = users.some(user => user.email === request.email);
      if (!userExists) {
        throw new Error('البريد الإلكتروني غير مسجل في النظام');
      }
      return { message: 'تم إرسال رابط الاستعادة بنجاح' };
    }),
    catchError(this.handleError.bind(this))
  );
}
private apiUrl = environment.apiUrl;  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(userData: SignupRequest): Observable<User> {
    const { confirmPassword, ...user } = userData;
    
    console.log('Sending data to server:', user);
    
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(newUser => {
        console.log('Signup successful:', newUser);
        this.setCurrentUser(newUser);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error
    });
    
    let errorMessage = 'حدث خطأ غير متوقع';
    
    if (error.status === 400) {
      if (typeof error.error === 'string') {
        if (error.error.includes('email')) {
          errorMessage = 'Erreur: L\'email existe déjà';
        } else if (error.error.includes('téléphone')) {
          errorMessage = 'Erreur: Le numéro de téléphone existe déjà';
        } else {
          errorMessage = error.error;
        }
      } else {
        errorMessage = 'بيانات غير صالحة - تأكد من صحة جميع الحقول';
      }
    } else if (error.status === 500) {
      errorMessage = 'خطأ في السيرفر، يرجى المحاولة لاحقاً';
    } else {
      errorMessage = `خطأ ${error.status}: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  login(credentials: LoginRequest): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      tap(users => {
        const user = users.find(u => u.email === credentials.email && u.psw === credentials.psw);
        if (user) {
          this.setCurrentUser(user);
        } else {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const userExists = users.some(user => user.email === email);
        console.log('User exists check for', email, ':', userExists);
        return userExists;
      })
    );
  }

updatePassword(email: string, newPassword: string): Observable<any> {
  const updateData = {
    email: email,
    newPassword: newPassword
  };
  
  console.log('💾 Updating password for:', email);
  console.log('🌐 API URL:', `${this.apiUrl}/update-password`);
  
  return this.http.put(`${this.apiUrl}/update-password`, updateData, {
    responseType: 'text'
  });
}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, LoginRequest, SignupRequest } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    console.log('🔐 Attempting login for:', credentials.email);
    
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        console.log('✅ Login successful:', user);
        this.setCurrentUser(user);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  signup(userData: SignupRequest): Observable<User> {
    const { confirmPassword, ...user } = userData;
    
    console.log('📝 Sending signup data:', user);
    
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(newUser => {
        console.log('✅ Signup successful:', newUser);
        this.setCurrentUser(newUser);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateProfile(userId: number, userData: any): Observable<User> {
    console.log('🔄 Updating profile for user ID:', userId);
    
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData).pipe(
      tap(updatedUser => {
        console.log('✅ Profile updated successfully:', updatedUser);
        this.setCurrentUser(updatedUser);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deleteAccount(userId: number): Observable<any> {
    console.log('🗑️ Deleting account for user ID:', userId);
    
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        console.log('✅ Account deleted successfully');
        this.logout();
      }),
      catchError(this.handleError.bind(this))
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<{exists: boolean}>(`${this.apiUrl}/check-email/${email}`).pipe(
      map(response => {
        console.log('📧 Email exists check:', email, response.exists);
        return response.exists;
      }),
      catchError(() => [false])
    );
  }

  updatePassword(email: string, newPassword: string): Observable<any> {
    const updateData = {
      email: email,
      newPassword: newPassword
    };
    
    console.log('🔑 Updating password for:', email);
    
    return this.http.put(`${this.apiUrl}/update-password`, updateData, {
      responseType: 'text'
    }).pipe(
      tap(response => {
        console.log('✅ Password update response:', response);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('🔴 HTTP Error:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error
    });

    let errorMessage = 'Une erreur inattendue est survenue';

    if (error.status === 0) {
      errorMessage = 'Erreur de connexion - Vérifiez que le serveur est démarré';
    } else if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée';
    } else if (error.status === 500) {
      if (typeof error.error === 'string') {
        try {
          const errorObj = JSON.parse(error.error);
          errorMessage = errorObj.message || errorMessage;
        } catch {
          errorMessage = error.error || errorMessage;
        }
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Erreur du serveur - Veuillez réessayer plus tard';
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  setCurrentUser(user: User): void {
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
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
    
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.setCurrentUser(user);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  signup(userData: SignupRequest): Observable<User> {
    const { confirmPassword, ...user } = userData;
    
    
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(newUser => {
        this.setCurrentUser(newUser);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateProfile(userId: number, userData: any): Observable<User> {
    
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData).pipe(
      tap(updatedUser => {
        this.setCurrentUser(updatedUser);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deleteAccount(userId: number): Observable<any> {
    
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        this.logout();
      }),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Checks if an email exists in the backend
   * @param email The email to check
   * @returns Observable<{ exists: boolean }>
   */
  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email/${email}`);
  }

  updatePassword(email: string, newPassword: string): Observable<any> {
    const updateData = {
      email: email,
      newPassword: newPassword
    };
    
    
    return this.http.put(`${this.apiUrl}/update-password`, updateData, {
      responseType: 'text'
    }).pipe(
      tap(response => {
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



  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

 
setCurrentUser(user: User): void {
  localStorage.setItem('currentUser', JSON.stringify(user));
  if (user.role) {
    localStorage.setItem('role', user.role);
  }
  this.currentUserSubject.next(user);
}

getUserRole(): string | null {
  const user = this.getCurrentUser();
  return user?.role || localStorage.getItem('role');
}

logout(): void {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('role');
  this.currentUserSubject.next(null);
}
}
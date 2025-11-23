import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Exercice, ExerciceRequest, TypeTrouble, StatutExercice } from '../models/exercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = 'http://localhost:8080/api/exercices';

  constructor(private http: HttpClient) { }

  // CRUD Operations avec gestion d'erreurs
  createExercice(exercice: ExerciceRequest): Observable<Exercice> {
    return this.http.post<Exercice>(this.apiUrl, exercice)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllExercices(): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getExerciceById(id: number): Observable<Exercice> {
    return this.http.get<Exercice>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getExercicesByPatient(patientId: number): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(`${this.apiUrl}/patient/${patientId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getExercicesByCoach(coachId: number): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(`${this.apiUrl}/coach/${coachId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getActiveExercicesByPatient(patientId: number): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(`${this.apiUrl}/patient/${patientId}/active`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getExercicesByPatientAndTroubleType(patientId: number, troubleType: TypeTrouble): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(`${this.apiUrl}/patient/${patientId}/trouble/${troubleType}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  countActiveExercicesByPatient(patientId: number): Observable<{ activeExercicesCount: number }> {
    return this.http.get<{ activeExercicesCount: number }>(`${this.apiUrl}/patient/${patientId}/active/count`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateExercice(id: number, exercice: Partial<Exercice>): Observable<Exercice> {
    return this.http.put<Exercice>(`${this.apiUrl}/${id}`, exercice)
      .pipe(
        catchError(this.handleError)
      );
  }

  markAsCompleted(id: number): Observable<Exercice> {
    return this.http.put<Exercice>(`${this.apiUrl}/${id}/complete`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteExercice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Métadonnées
  getTroubleTypes(): Observable<TypeTrouble[]> {
    return this.http.get<TypeTrouble[]>(`${this.apiUrl}/trouble-types`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getStatuts(): Observable<StatutExercice[]> {
    return this.http.get<StatutExercice[]>(`${this.apiUrl}/statuts`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Health check
  healthCheck(): Observable<string> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gestion d'erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    console.error('ExerciseService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
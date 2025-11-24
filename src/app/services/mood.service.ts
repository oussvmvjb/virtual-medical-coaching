// services/mood.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '../models/mood-evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8089/api/evaluations';

  constructor(private http: HttpClient) { }

  createEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  getEvaluationsByPatient(patientId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getRecentEvaluations(patientId: number, limit: number = 5): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/patient/${patientId}/recent?limit=${limit}`);
  }
// Récupérer toutes les évaluations
  getEvaluations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEvaluationsWithRisk(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/risk`);
  }

  updateEvaluation(id: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${id}`, evaluation);
  }

  deleteEvaluation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
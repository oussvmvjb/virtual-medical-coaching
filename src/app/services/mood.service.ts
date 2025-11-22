import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '../models/mood-evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService { 
  private apiUrl = 'http://localhost:8080/api/evaluations'; 

  constructor(private http: HttpClient) { }

  createEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }
}
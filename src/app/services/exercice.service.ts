import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class exerciceService {
  private apiUrl = 'http://localhost:8080/api/prescriptions';

  constructor(private http: HttpClient) { }

  createPrescription(prescription: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, prescription);
  }

  getPrescriptionsByPatient(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getPrescriptionsByMedecin(medecinId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medecin/${medecinId}`);
  }
}

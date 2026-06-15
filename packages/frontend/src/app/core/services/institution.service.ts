import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private apiUrl = 'http://localhost:3000/api/v1/institutions';

  constructor(private http: HttpClient) {}

  getInstitutions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getInstitutionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createInstitution(name: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name });
  }

  updateInstitution(id: string, data: { name?: string; logoUrl?: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  inviteProfessor(institutionId: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${institutionId}/invite-professor`, { email });
  }
}

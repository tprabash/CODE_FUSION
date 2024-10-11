import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Institute } from 'app/_models/institute.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  private apiUrl = 'https://localhost:7032/api/Institute';

  constructor(private http: HttpClient) { }

  getInstitutes(): Observable<Institute[]> {
    return this.http.get<Institute[]>(`${this.apiUrl}/GetInstitute`);
  }

  saveInstitute(formData: FormData): Observable<Institute> {
    return this.http.post<Institute>(`${this.apiUrl}/AddInstitute`, formData);
  }

  updateInstitute(institute: Institute): Observable<Institute> {
    return this.http.put<Institute>(`${this.apiUrl}/UpdateInstitute/${institute.id}`, institute);
  }

  deleteInstitute(instituteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteInstitute/${instituteId}`);
  }
}

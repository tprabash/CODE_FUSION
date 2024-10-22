import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveStudent } from 'app/_models/saveStudent';
import { Student } from 'app/_models/student.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class studentservice {

  private apiUrl = 'https://localhost:7032/api/student';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/GetStudent`);
  }

  saveStudents(formData: FormData): Observable<SaveStudent> {
    return this.http.post<SaveStudent>(`${this.apiUrl}/SaveStudents`, formData);
  }

  updateStudent(formData: FormData): Observable<Student> {
    return this.http.patch<Student>(`${this.apiUrl}/UpdateStudent`, formData);
  }

  deactiveStudent(studentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/DeactiveStudent/${studentId}`, {});
  }

  activeStudent(studentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/ActivateStudent/${studentId}`, {});
  }

  getCountries(): Observable<string[]> {
    return this.http.get<any[]>('https://restcountries.com/v3.1/all').pipe(
      map(data => data.map(country => country.name.common))
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CheckEmailExists/${email}`);
  }

}

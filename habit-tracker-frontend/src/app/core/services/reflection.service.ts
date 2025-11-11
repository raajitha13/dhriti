import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Reflection } from '../models/reflection.model';
import { ReflectionInsight } from '../models/reflection-insight.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReflectionService {
  private baseUrl = 'http://localhost:8080/api/reflections'; // Spring Boot backend
  private reflectionsSubject = new BehaviorSubject<ReflectionInsight[]>([]);
  reflectionInsights$ = this.reflectionsSubject.asObservable();
  
  private todaysReflectionSubject = new BehaviorSubject<ReflectionInsight | null>(null);
  todaysReflection$ = this.todaysReflectionSubject.asObservable();


  constructor(private http: HttpClient) {}

  fetchTodaysReflection() {
    // Only fetch if not already fetched
    if (this.todaysReflectionSubject.value === null) {
      this.http.get<ReflectionInsight>(`${this.baseUrl}/today`).subscribe({
        next: (reflection) => this.todaysReflectionSubject.next(reflection),
        error: (err) => {
          console.error('Error fetching today\'s reflection', err);
          this.todaysReflectionSubject.next(null); // fallback
        }
      });
    }
  }

  fetchReflectionsInRange(from: Date, to: Date): Observable<ReflectionInsight[]> {
    const params = new HttpParams()
    .set('from', from.toISOString().split('T')[0].trim())
    .set('to', to.toISOString().split('T')[0].trim());


    return this.http.get<ReflectionInsight[]>(`${this.baseUrl}/range`, { params }).pipe(
      tap((insights) => this.reflectionsSubject.next(insights))
    );
  }


  // completeReflection(inputText: String, overwrite = true) {
  //   this.http.post<ReflectionInsight>(`${this.baseUrl}?overwrite=${overwrite}`, inputText)
  //     .subscribe({
  //       next: (response) => {
  //         // Update cached value with backend response (including insights)
  //         this.todaysReflectionSubject.next({
  //           id: response.id,
  //           reflection: response.reflection,
  //           highlights: response.highlights,
  //           analysis: response.analysis,
  //           insightsVersion: response.insightsVersion,
  //           createdAt: response.createdAt
  //         });
  //       },
  //       error: (err) => {
  //         console.error('Error completing reflection', err);
  //       }
  //     });
  // }


  completeReflection(inputText: string, overwrite = false, date?: string) {
    let url = `${this.baseUrl}?overwrite=${overwrite}`;
    if (date) {
      url += `&date=${encodeURIComponent(date)}`;
    }

    return this.http.post<ReflectionInsight>(
      url,
      inputText,
      { headers: { 'Content-Type': 'text/plain' } }
    ).pipe(
      tap((response: ReflectionInsight) => {
        console.log('Completed reflection:', response);
        this.todaysReflectionSubject.next(response);
      })
    );
  }




  skipReflection() {
    this.todaysReflectionSubject.next(null);
  }

}

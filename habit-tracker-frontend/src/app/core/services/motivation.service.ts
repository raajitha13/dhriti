import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface MotivationResponse {
  motivational_quote: string;
  weekly_summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotivationService {

  private baseUrl = 'http://localhost:8080/api/motivation';

  private quoteSubject = new BehaviorSubject<string>('Still water, steady bloom. Still effort, steady you.');
  private summarySubject = new BehaviorSubject<string>('Could not fetch AI summary.');

  quote$ = this.quoteSubject.asObservable();
  summary$ = this.summarySubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchMotivation(): void {
    this.http.get<MotivationResponse>(`${this.baseUrl}`).pipe(
      tap(response => {
        this.quoteSubject.next(response.motivational_quote);
        this.summarySubject.next(response.weekly_summary);
      }),
      catchError(err => {
        console.error('Motivation fetch failed:', err);
        return of(null);
      })
    ).subscribe();
  }
}

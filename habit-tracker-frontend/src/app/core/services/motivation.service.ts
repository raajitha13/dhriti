import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MotivationService {

  private baseUrl = 'http://localhost:8080/api/motivation';

  private quoteSubject = new BehaviorSubject<string>('Still water, steady bloom. Still effort, steady you.');
  private summarySubject = new BehaviorSubject<string>('Could not fetch AI summary.');

  quote$ = this.quoteSubject.asObservable();
  summary$ = this.summarySubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchSummary();
  }

  fetchQuote(): void {
    const cachedQuote = localStorage.getItem('daily_quote');
    const cachedDate = localStorage.getItem('quote_date');
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

    if (cachedQuote && cachedDate === today) {
      this.quoteSubject.next(cachedQuote);
      return;
    }

    this.http.get<{ motivational_quote: string }>(`${this.baseUrl}/quote`).pipe(
      tap(res => {
        const quote = res.motivational_quote;
        this.quoteSubject.next(quote);
        localStorage.setItem('daily_quote', quote);
        localStorage.setItem('quote_date', today);
      }),
      catchError(err => {
        console.error('Quote fetch failed:', err);
        return of(null);
      })
    ).subscribe();
  }

  fetchSummary(): void {
    this.http.get<{ weekly_summary: string }>(`${this.baseUrl}/summary`).pipe(
      tap(res => this.summarySubject.next(res.weekly_summary)),
      catchError(err => {
        console.error('Summary fetch failed:', err);
        return of(null);
      })
    ).subscribe();
  }
}

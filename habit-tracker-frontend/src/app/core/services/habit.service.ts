import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Habit } from '../models/habit.model';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private baseUrl = 'http://localhost:8080/api/habits'; // Spring Boot backend
  // habits = signal<any[]>([]);
  private habitsSubject = new BehaviorSubject<Habit[]>([]);
  habits$ = this.habitsSubject.asObservable();


  constructor(private http: HttpClient) {
    this.getHabits();
  }

   getCompletionDates(habitId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${habitId}/completions`);
  }
  
  getHabits() {
    this.http.get<any[]>(this.baseUrl).subscribe(data => {
      
      data.forEach(habit => {
        // Fetch completion dates for each habit
        this.getCompletionDates(habit.id).subscribe(completions => {
          habit.completedDates = completions.map(date => date); // Assign completed dates to habit
        });
      });
      this.habitsSubject.next(data);
    });
  }

  addHabit(habit: Habit) {
    return this.http.post(this.baseUrl, habit);
  }
  
  updateHabit(id: number, habit: any) {
    return this.http.put(`${this.baseUrl}/${id}`, habit);
  }

  deleteHabit(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getHabits())  // refresh the habits after delete
    );;
  }

  toggleHabitCompletion(id: number, date: string) {
    return this.http.post(`${this.baseUrl}/${id}/complete`, {date});
  }
  
  getAnalytics(habitId: number): Observable<any> {
    return this.http.get(`/api/habits/${habitId}/analytics`);
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Habit } from '../models/habit.model';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin, map, mergeMap, switchMap, tap } from 'rxjs';

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
  
  //getting habits along with completions data
  getHabits() {
    this.http.get<Habit[]>(`${this.baseUrl}/HabitsWithCompletions`).subscribe(habitsWithCompletions => {
      this.habitsSubject.next(habitsWithCompletions);
    });
  }

  getHabitById(id: number): Observable<Habit> {
    return this.http.get<Habit>(`${this.baseUrl}/${id}`).pipe(
      mergeMap(habit =>
        this.getCompletionDates(habit.id).pipe(
          map(completions => {
            habit.completedDates = completions;
            return habit;
          })
        )
      )
    );
  }

  addHabit(habit: Habit) {
    return this.http.post(this.baseUrl, habit).pipe(
      tap(() => this.getHabits())
    );
  }
  
  updateHabit(id: number, habit: any) {
    return this.http.put(`${this.baseUrl}/${id}`, habit).pipe(
      tap(() => this.getHabits())
    );
  }

  deleteHabit(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getHabits())  // refresh the habits after delete
    );
  }

  toggleHabitCompletion(id: number, date: string) {
    return this.http.post(`${this.baseUrl}/${id}/complete`, {date});
  }
  
  getAnalytics(habitId: number): Observable<any> {
    return this.http.get(`/api/habits/${habitId}/analytics`);
  }

  replaceHabitInList(updatedHabit: Habit) {
    const currentHabits = this.habitsSubject.getValue();
    const updatedHabits = currentHabits.map(h =>
      h.id === updatedHabit.id ? updatedHabit : h
    );
    this.habitsSubject.next(updatedHabits);
  }

}

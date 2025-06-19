import { Component, OnInit } from '@angular/core';
import { HabitService } from '../../../core/services/habit.service';
import { Habit } from '../../../core/models/habit.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/ConfirmDialog/ConfirmDialog.component';
import { MotivationService } from '../../../core/services/motivation.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatIcon,
  ]
})
export class DashboardComponent implements OnInit {
  selectedHabit: Habit | null = null;
  visibleDates: string[] = [];
  dateOffset = 0;
  daysToShow = 7;

  currentStreak = 0;
  longestStreak = 0;

  username: string | null = null;

  quote: string = '';

  constructor(private habitService: HabitService, private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router, private authService: AuthService, private motivationService: MotivationService) {}

  ngOnInit(): void {
    const email = this.authService.getUsernameFromToken();
    this.username = email ? email.split('@')[0] : '';
    this.motivationService.fetchQuote();
    // this.motivationService.quote$.subscribe(q => this.quote = q);
    this.habitService.getHabits();
    this.generateVisibleDates();
  }

  get habits$() {
    return this.habitService.habits$;
  }

  get quote$() {
    return this.motivationService.quote$;
  }

  navigateToAddHabit() {
    this.router.navigate(['/habits/add']);
  }

  navigateToUpdateHabit(habit: Habit) {
    this.router.navigate(['/habits/edit', habit.id]);
  }

  deleteHabit(habit: Habit) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { name: habit.name },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.habitService.deleteHabit(habit.id).subscribe({
          next: () => {
            this.snackBar.open(`Habit "${habit.name}" deleted`, 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open(`Failed to delete habit`, 'Close', { duration: 3000 });
            console.error(err);
          }
        });
      }
    });
  }


  toggleHabitOnDate(habit: Habit, date: string) {
    this.habitService.toggleHabitCompletion(habit.id, date).subscribe({
      next: () => {
        this.habitService.getHabitById(habit.id).subscribe({
          next: (updatedHabit) => {
            this.habitService.replaceHabitInList(updatedHabit);
          },
          error: (err) => {
            this.snackBar.open('Failed to fetch updated habit data', 'Close', { duration: 3000 });
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to update habit', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  isHabitCompleted(habit: Habit, date: string): boolean {
    return habit.completedDates?.includes(date) || false;
  }

  generateVisibleDates() {
    const today = new Date();
    this.visibleDates = Array.from({ length: this.daysToShow }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - this.dateOffset + i - this.daysToShow + 1);
      return date.toISOString().split('T')[0];
    });
  }

  prevDates() {
    this.dateOffset += this.daysToShow;
    this.generateVisibleDates();
  }

  nextDates() {
    this.dateOffset -= this.daysToShow;
    if (this.dateOffset < 0) this.dateOffset = 0;
    this.generateVisibleDates();
  }

  selectHabit(habit: Habit) {
    this.selectedHabit = habit;
  }

}

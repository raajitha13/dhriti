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
import { ReflectionOverlayComponent } from '../../../shared/components/reflection-overlay/reflection-overlay.component';
import { ReflectionService } from '../../../core/services/reflection.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';

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
    MatProgressSpinnerModule,
    ReflectionOverlayComponent,
  ],
})
export class DashboardComponent implements OnInit {
  backgroundImage: string = '';
  reflectionTextColor: string = '#000'; // default for reflection text

  selectedHabit: Habit | null = null;
  visibleDates: string[] = [];
  dateOffset = 0;
  daysToShow = 7;

  currentStreak = 0;
  longestStreak = 0;

  username: string | null = null;

  quote: string = '';
  reflectionPending = false;

  constructor(private habitService: HabitService, private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router, private authService: AuthService, private motivationService: MotivationService, private reflectionService: ReflectionService, private userService: UserService) {}

  ngOnInit(): void {
    const email = this.authService.getUsernameFromToken();
    this.username = email ? email.split('@')[0] : '';

    setTimeout(() => {
      this.reflectionService.todaysReflection$.subscribe({
        next: (reflection) => {
          this.reflectionPending = !reflection; // true if null, false if reflection exists
          console.log('Reflection pending:', this.reflectionPending, reflection);
        },
        error: () => { 
          this.reflectionPending = false; 
        }
      });
    }, 5000);

    this.reflectionService.fetchTodaysReflection();

    this.userService.getMood().subscribe(mood => {
      console.log('Current mood:', mood);
    });

    this.setBackgroundImage();

    this.motivationService.fetchQuote();
    this.habitService.getHabits();
    this.generateVisibleDates();
  }

  setBackgroundImage() {
    const hour = new Date().getHours();
    let options: string[];

    if (hour >= 6 && hour < 12) {
      options = ['assets/bg/day1.jpg', 'assets/bg/day2.jpg', 'assets/bg/day3.jpg', 'assets/bg/day4.jpg', 'assets/bg/day5.jpg'];
    } else if (hour >= 12 && hour < 18) {
      options = ['assets/bg/afternoon1.jpg', 'assets/bg/afternoon2.jpg', 'assets/bg/afternoon3.jpg', 'assets/bg/afternoon4.jpg', 'assets/bg/afternoon5.jpg'];
    } else {
      options = ['assets/bg/night1.jpg', 'assets/bg/night2.jpg', 'assets/bg/night3.jpg', 'assets/bg/night4.jpg', 'assets/bg/night5.jpg', 'assets/bg/night6.jpg'];
    }

    this.backgroundImage = options[Math.floor(Math.random() * options.length)];
    this.setBannerTextColor();
  }

  setBannerTextColor(){
    const img = new Image();
    img.src = this.backgroundImage;
    img.crossOrigin = 'anonymous'; // just in case images are served from another origin

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

      let r = 0, g = 0, b = 0, count = 0;

      // Sample every 10th pixel to save performance
      for (let i = 0; i < imageData.length; i += 40) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      r = r / count;
      g = g / count;
      b = b / count;

      // Calculate luminance
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      this.reflectionTextColor = brightness < 128 ? '#fff' : '#000'; // dark bg => white text
    };
  }

  onReflectionComplete(inputText: string) {
    this.reflectionPending = false;
  }

  onReflectionSkip() {
    this.reflectionPending = false;
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

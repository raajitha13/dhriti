import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitService } from '../../../core/services/habit.service';
import { Habit } from '../../../core/models/habit.model';


@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './habit-form.component.html',
  styleUrl: './habit-form.component.scss'
})
export class HabitFormComponent {
  habitForm: FormGroup;
  isEdit = false;
  habitId: number | null = null;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private habitService: HabitService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.habitForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9\s\-\_.,!?()]+$/)
        ]
      ]
    });

  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.habitId = +idParam;

      this.habitService.habits$.subscribe((habits) => {
        const habit = habits.find((h: Habit) => h.id === this.habitId);
        if (habit) {
          this.habitForm.patchValue({ name: habit.name });
        }
      });
    }
  }

  onSubmit() {
    if (this.habitForm.invalid) {
      this.errorMessage = 'Please enter a habit name.';
      return;
    }

    if (this.isEdit && this.habitId !== null) {
      this.habitService.updateHabit(this.habitId, this.habitForm.value).subscribe({
        next: () => this.router.navigate(['/habits']),
        error: (err) => this.errorMessage = err.error.message || 'Failed to update habit'
      });
    } else {
      this.habitService.addHabit(this.habitForm.value).subscribe({
        next: () => this.router.navigate(['/habits']),
        error: (err) => this.errorMessage = err.error.message || 'Failed to create habit'
      });
    }
  }
}

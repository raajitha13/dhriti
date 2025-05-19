import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HabitService } from '../../core/services/habit.service';
import { Habit } from '../../core/models/habit.model';


@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habit-list.component.html',
  styleUrl: './habit-list.component.scss'
})

export class HabitListComponent implements OnInit {

  constructor(
    public habitService: HabitService,
    private router: Router
  ) {}

  ngOnInit() {
    this.habitService.getHabits();
  }

  get habits$() {
    return this.habitService.habits$;
  }

  addHabit() {
    this.router.navigate(['/habits/add']);
  }

  editHabit(id: number) {
    this.router.navigate([`/habits/edit/${id}`]);
  }

  deleteHabit(id: number) {
    this.habitService.deleteHabit(id).subscribe(() => {
      this.habitService.getHabits();
    });
  }

  // toggleCompletion(habit: Habit) {
  //   habit.completed = !habit.completed;
  // }

}


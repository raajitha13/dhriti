import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { Habit } from '../../core/models/habit.model';
import { HabitService } from '../../core/services/habit.service';
import { LeftRightArrowsComponent } from '../../shared/components/LeftRightArrows/LeftRightArrows.component';
import { MotivationService } from '../../core/services/motivation.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    NgChartsModule,
    LeftRightArrowsComponent
  ]
})
export class AnalyticsComponent implements OnInit {
  selectedHabit: Habit | null = null;
  lineChartData: { data: (number | null)[]; label: string; fill: boolean; borderColor: string; tension: number }[] = [];
  lineChartLabels: string[] = [];
  chartType: ChartType = 'line';
  chartOptions: ChartOptions = {
    responsive: true
  };

  analyticsData: {
    currentStreak: number;
    longestStreak: number;
    totalCompleted: number;
  } | null = null;

  currentMonth: Date = new Date(); // Controls current month being viewed

  summary: string = '';

  constructor(private habitService: HabitService, private motivationService: MotivationService) {}

  ngOnInit(): void {
    this.habitService.getHabits();
    this.habitService.habits$.subscribe(habits => {
      if (habits.length > 0) {
        this.selectedHabit = { ...habits[0] };
        this.updateAnalytics();
      }
    });

    this.motivationService.fetchMotivation();
    this.motivationService.summary$.subscribe(s => this.summary = s);
  }

  get habits$() {
    return this.habitService.habits$;
  }

  onHabitChange(): void {
    if (this.selectedHabit?.completedDates?.length) {
      this.updateAnalytics();
    } else {
      // Reset chart and analytics
      this.lineChartData = [];
      this.lineChartLabels = [];
      this.analyticsData = null;
    }
  }


  changeMonth(direction: 'prev' | 'next'): void {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(this.currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    this.currentMonth = newMonth;
    this.updateAnalytics();
  }

  updateAnalytics(): void {
    if (!this.selectedHabit || !this.selectedHabit.completedDates?.length) {
      this.lineChartData = [];
      this.lineChartLabels = [];
      this.analyticsData = null;
      return;
    }

    const completedDates = new Set(this.selectedHabit.completedDates || []);
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth =
      year === today.getFullYear() && month === today.getMonth();
    const todayDate = today.getDate();

    const labels: string[] = [];
    const data: (number | null)[] = [];

    let currentStreak = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      const label = day.toString().padStart(2, '0');
      labels.push(label);

      if (isCurrentMonth && day > todayDate) {
        // For days after today in the current month, push null to stop the line
        data.push(null);
      } else {
        if (completedDates.has(dateStr)) {
          currentStreak++;
        } else {
          currentStreak = 0;
        }
        data.push(currentStreak);
      }
    }

    this.lineChartLabels = labels;
    this.lineChartData = [
      {
        data,
        label: `${this.selectedHabit.name} - Streak`,
        fill: true,
        borderColor: '#66BB6A',
        tension: 0.3,
        spanGaps: false, // important so it does NOT connect null gaps
      } as any,
    ];


    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            font: { size: 10 },
            maxRotation: 45,
            minRotation: 45,
          },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { font: { size: 12 } },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
      },
    };

    this.analyticsData = {
      currentStreak: this.selectedHabit.currentStreak || 0,
      longestStreak: this.selectedHabit.longestStreak || 0,
      totalCompleted: this.selectedHabit.completedDates?.length || 0,
    };
  }


}

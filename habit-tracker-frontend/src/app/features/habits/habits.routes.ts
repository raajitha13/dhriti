import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { authGuardGuard } from '../../auth/auth-guard.guard';
import { HabitFormComponent } from '../../shared/components/HabitsForm/habit-form.component';

export const habitsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full', 
  },
  {
    path: 'add',
    component: HabitFormComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'edit/:id',
    component: HabitFormComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [authGuardGuard],
  },
];

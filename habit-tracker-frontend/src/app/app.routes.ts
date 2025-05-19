import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'habits',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'habits',
    loadChildren: () =>
      import('./features/habits/habits.module').then(m => m.HabitsModule),
  },
];

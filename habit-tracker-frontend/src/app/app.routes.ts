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
      import('./features/routes/habits/habits.module').then(m => m.HabitsModule),
  },
  {
    path: 'reflections',
    loadChildren: () =>
      import('./features/routes/reflections/reflections.module').then(m => m.ReflectionsModule),
  },
];

import { Routes } from '@angular/router';
import { authGuardGuard } from '../../../auth/auth-guard.guard';
import { ReflectionVoicePageComponent } from '../../../shared/components/reflection-voice-page/reflection-voice-page.component';
import { ReflectionTextPageComponent } from '../../../shared/components/reflection-text-page/reflection-text-page.component';

export const reflectionsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full', 
  },
  {
    path: 'voice',
    component: ReflectionVoicePageComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'text',
    component: ReflectionTextPageComponent,
    canActivate: [authGuardGuard],
  },
];

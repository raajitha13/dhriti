import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { habitsRoutes } from './habits.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(habitsRoutes), // Feature routes
  ],
  declarations: [],
})
export class HabitsModule {}

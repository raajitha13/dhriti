import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { reflectionsRoutes } from './reflections.routes';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(reflectionsRoutes), // Feature routes
  ],
  declarations: [],
})
export class ReflectionsModule {}

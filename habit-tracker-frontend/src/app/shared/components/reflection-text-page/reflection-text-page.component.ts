import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reflection-text-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './reflection-text-page.component.html',
  styleUrl: './reflection-text-page.component.scss'
})
export class ReflectionTextPageComponent {
  reflectionText = '';

  constructor(private router: Router) {}

  submit() {
    console.log("Reflection submitted:", this.reflectionText);
    // TODO: Call API or save
    this.router.navigate(['/dashboard']);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}

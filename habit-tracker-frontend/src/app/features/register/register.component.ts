import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: [
                  '',
                  [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
                  ]
                ]
    });
  }

  register() {
    if (this.registerForm.invalid) return;

    const userData = this.registerForm.value;

    this.auth.register(userData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.successMessage = '';
        console.error(err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

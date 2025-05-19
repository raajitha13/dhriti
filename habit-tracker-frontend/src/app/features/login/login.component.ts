import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../core/models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  user: User = {
    username: '',
    password: ''
  };
  loginForm: FormGroup;

  errorMessage: string = '';
  


  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;
    this.auth.login(loginData).subscribe({
      next: (res: any) => {
        this.auth.storeToken(res.token);
        this.router.navigate(['/habits/dashboard']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        console.log(err.error);
      }
    });
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }

}


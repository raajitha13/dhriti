import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../core/models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DisableOnSubmitDirective } from '../../shared/directive/disable-on-submit.directive';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, DisableOnSubmitDirective],
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
  
  loginObservable?: Observable<any>;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;
    this.loginObservable = this.auth.login(loginData);

    this.loginObservable.subscribe({
      next: (res: any) => {
        this.auth.storeToken(res.token);
        this.router.navigate(['/habits/dashboard']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        console.log(err.error);
      },
      complete: () => {
        this.loginObservable = undefined; // reset
      }
    });
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }

}


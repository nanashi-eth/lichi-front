import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/auth/login.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  providers: [LoginService]
})
export class LoginFormComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  get username() {
    return this.loginForm.controls['username'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginError = '';
      const credentials = this.loginForm.value;

      this.loginService.login(credentials).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.loginError = 'Invalid credentials.';
          } else if (err.status === 0) {
            this.loginError = 'Server connection error. Please try again later.';
          } else {
            this.loginError = 'Unknown error. Please try again later.';
          }
        },
        complete: () => {
          console.info("Login completo");
          this.router.navigateByUrl('/home');
          this.loginForm.reset();
        }

      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginError = 'Please complete all fields.';
    }
  }

  clearError(): void {
    this.loginError = '';
  }
}

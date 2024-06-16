import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/auth/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import {  HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, ReactiveFormsModule , HttpClientModule, CommonModule],
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
  get username(){
    return this.loginForm.controls["username"];
  }

  get password()
  {
    return this.loginForm.controls["password"];
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginError = '';
      const credentials = this.loginForm.value;

      this.loginService.login(credentials).subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 403) {
            this.loginError = 'Credenciales inválidas. Por favor, verifique su usuario y contraseña.';
          } else if (err.status === 0) {
            this.loginError = 'Error de conexión. Por favor, revise su conexión a internet.';
          } else {
            this.loginError = 'Error desconocido. Por favor, inténtelo de nuevo más tarde.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginError = 'Por favor, complete todos los campos.';
    }
  }

  clearError(): void {
    this.loginError = '';
  }
}

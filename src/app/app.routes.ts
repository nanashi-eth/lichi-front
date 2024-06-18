import { Routes } from '@angular/router';
import { LoginFormComponent } from './pages/auth/login-form/login-form.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
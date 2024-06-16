import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) { 
    if (this.isSessionStorageAvailable()) {
      this.currentUserLoginOn.next(sessionStorage.getItem("token") != null);
      this.currentUserData.next(sessionStorage.getItem("token") || "");
    }
  }

  private isSessionStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${environment.urlHost}auth/login`, credentials).pipe(
      tap((userData) => {
        if (this.isSessionStorageAvailable()) {
          sessionStorage.setItem("token", userData.token);
          this.currentUserData.next(userData.token);
          this.currentUserLoginOn.next(true);
        }
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    );
  }

  logout(): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem("token");
      this.currentUserLoginOn.next(false);
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error', error.error);
    } else {
      console.error('Backend retornó el código de estado', error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }

  get userData(): Observable<string> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userToken(): string {
    return this.currentUserData.value;
  }

}

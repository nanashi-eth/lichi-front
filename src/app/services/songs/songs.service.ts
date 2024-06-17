import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Song } from './song';
import { SongsRequest } from './songsRequest';

@Injectable({
  providedIn: 'root'
})
export class CancionesService {

  private apiUrl = `${environment.urlApi}api/songs`;

  constructor(private http: HttpClient) { }

  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  getCanciones(): Observable<Song[]> {
    const headers = this.getHeaders();
    return this.http.get<Song[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getCancionesConFiltros(request: SongsRequest): Observable<Song[]> {
    const headers = this.getHeaders();
    const params = {
      ...request
    };

    return this.http.get<Song[]>(this.apiUrl, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error('Backend retornó el código de estado', error.status, error.error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }
}

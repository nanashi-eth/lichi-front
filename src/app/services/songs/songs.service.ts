import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
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
    if (this.isSessionStorageAvailable()) {
      return sessionStorage.getItem('token') || '';
    }
    return '';
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

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  getCanciones(page: number, limit: number): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', limit.toString());

    return this.http.get<Song[]>(this.apiUrl, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

  getCancionesConFiltros(keyword: string): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams();

    console.log(keyword.toString());
    
    // Agregar parámetros de búsqueda al objeto HttpParams
    if (keyword) {
      params = params.set('keyword', keyword.toString());
    }

    return this.http.get<Song[]>(`${this.apiUrl}/search`, { headers, params }).pipe(
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

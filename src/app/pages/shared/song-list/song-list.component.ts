import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Song } from '../../../services/songs/song';
import { CancionesService } from '../../../services/songs/songs.service';
import {MatListModule} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { SongsRequest } from '../../../services/songs/songsRequest';
import { LoginService } from '../../../services/auth/login.service';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIcon, MatButtonModule, FormsModule],
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.scss'
})
export class SongListComponent {
  canciones: Song[] = [];
  loading = true;
  currentPage = 0;
  itemsPerPage = 100;
  totalPages = 0;
  totalElements = 0;
  searchTerm = '';

  constructor(private cancionesService: CancionesService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    if (!this.loginService.userToken) {
      return;
    }
    this.loadCanciones();
  }

  loadCanciones(): void {
    this.loading = true;

    // Si hay término de búsqueda, llamamos al método de búsqueda
    if (this.searchTerm.trim() !== '') {

      this.cancionesService.getCancionesConFiltros(this.searchTerm).subscribe(
        response => {
          this.canciones = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error => {
          console.error('Error al cargar las canciones', error);
          this.loading = false;
        }
      );
    } else { // Si no hay término de búsqueda, cargamos todas las canciones paginadas
      this.cancionesService.getCanciones(this.currentPage, this.itemsPerPage).subscribe(
        response => {
          this.canciones = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error => {
          console.error('Error al cargar las canciones', error);
          this.loading = false;
        }
      );
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCanciones();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCanciones();
    }
  }

  formatDuration(durationMs: number): string {
    const minutes: number = Math.floor(durationMs / 60000);
    const seconds: number = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  getCoverImageUrl(coverImage: string): string {
    return `covers/${coverImage}`;
  }

  search(): void {
    console.log('Buscando:', this.searchTerm);
    this.currentPage = 0; 
    this.loadCanciones();
  }
}
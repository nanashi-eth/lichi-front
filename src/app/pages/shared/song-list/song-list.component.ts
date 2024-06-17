import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../../services/songs/song';
import { CancionesService } from '../../../services/songs/songs.service';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.scss'
})
export class SongListComponent {
  canciones: Song[] = [];
  loading = true;

  constructor(private cancionesService: CancionesService) { }

  ngOnInit(): void {
    this.cancionesService.getCanciones().subscribe(
      data => {
        this.canciones = data;
        this.loading = false;
      },
      error => {
        console.error('Error al cargar las canciones', error);
        this.loading = false;
      }
    );
  }
  formatDuration(durationMs: number): string {
    const minutes: number = Math.floor(durationMs / 60000);
    const seconds: number = Math.floor((durationMs % 60000) / 1000); 
  
    const secondsString: string = seconds < 10 ? '0' + seconds : String(seconds);
  
    return `${minutes}:${secondsString}`;
  }

  getCoverImageUrl(coverImage: string): string {
    return `covers/${coverImage}`;
  }
  

}

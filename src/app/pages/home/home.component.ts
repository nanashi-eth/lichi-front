import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SongListComponent } from '../shared/song-list/song-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSidenavModule, SongListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  opened = true;

  options = {
    bottom: 0,
    fixed: false,
    top: 0,
  }

  isMenuOpen = true;
  contentMargin = 240;


  onToolbarMenuToggle() {
    console.log('On toolbar toggled', this.isMenuOpen);
    this.isMenuOpen = !this.isMenuOpen;

    if(!this.isMenuOpen) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 240;
    }
  }
}

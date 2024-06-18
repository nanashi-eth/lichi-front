import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { UserService } from '../../services/user/user.service'; 
import { User } from '../../services/auth/user'; 
import { Router } from '@angular/router';
import { SongListComponent } from '../shared/song-list/song-list.component';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSidenavModule, SongListComponent, MatIcon, MatListModule, MatCardModule],
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
  username: string = '';

  constructor(private userService: UserService, private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    if (!this.loginService.userToken) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUser(1).subscribe(
      (user: User) => {
        this.username = user.username; 
      },
      error => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }


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

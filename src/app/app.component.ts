import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'school-attendance-system';
  isLoggedIn = false;
  private authSubscription!: Subscription;
  
  navLinks = [
    { path: '/dashboard', label: 'Panel de Control', icon: 'fas fa-tachometer-alt' },
    { path: '/data-view', label: 'Visualización', icon: 'fas fa-chart-bar' },
    { path: '/crud', label: 'Edición', icon: 'fas fa-edit' },
    { path: '/file-upload', label: 'Subir Archivos', icon: 'fas fa-upload' }
  ];

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
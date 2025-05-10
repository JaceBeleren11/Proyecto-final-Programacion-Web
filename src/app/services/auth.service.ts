import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface User {
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { email: 'admin@escuela.com', password: 'admin123', role: 'admin' },
    { email: 'profesor@escuela.com', password: 'profesor123', role: 'user' }
  ];

  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.authStatus.next(this.isLoggedIn());
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  register(email: string, password: string, role: string): boolean {
    if (this.users.some(u => u.email === email)) {
      return false;
    }
    
    this.users.push({ email, password, role });
    return true;
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      if (this.isBrowser()) {
        localStorage.setItem('auth_token', 'simulated-token');
        localStorage.setItem('user_role', user.role);
      }
      this.authStatus.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
    }
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isBrowser() ? !!localStorage.getItem('auth_token') : false;
  }
}
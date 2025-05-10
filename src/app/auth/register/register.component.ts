import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  };
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    // Validaciones básicas
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Email y contraseña son requeridos';
      return;
    }

    // Registrar usuario
    const success = this.authService.register(
      this.user.email,
      this.user.password,
      this.user.role
    );

    if (success) {
      this.successMessage = 'Registro exitoso! Redirigiendo...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = 'El email ya está registrado';
    }
  }
  testRedirection() {
    this.router.navigate(['/login']);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h2>Admin Login</h2>
        
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Email</label>
            <input [(ngModel)]="email" name="email" type="email" required class="form-control" placeholder="admin@luxecut.com">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input [(ngModel)]="password" name="password" type="password" required class="form-control" placeholder="••••••••">
          </div>

          <div *ngIf="error" class="error-msg">{{ error }}</div>

          <button type="submit" [disabled]="loading" class="btn btn-primary full-width">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background-color: var(--color-navy-900);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      font-family: var(--font-sans);
    }

    .login-card {
      background-color: var(--color-white);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: var(--shadow-2xl);
      width: 100%;
      max-width: 26rem;

      h2 {
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--color-navy-900);
        margin-bottom: 2rem;
        text-align: center;
      }

      .error-msg {
        color: var(--color-error);
        margin-bottom: 1rem;
        font-size: 0.875rem;
        text-align: center;
        background-color: rgba(239, 68, 68, 0.1);
        padding: 0.5rem;
        border-radius: 0.375rem;
      }

      .btn.full-width {
        width: 100%;
        margin-top: 1rem;
      }
    }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';
    
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.error = 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}

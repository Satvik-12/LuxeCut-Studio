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
            <input [(ngModel)]="email" name="email" type="email" required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input [(ngModel)]="password" name="password" type="password" required>
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
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: var(--shadow-2xl);
      width: 100%;
      max-width: 28rem;

      h2 {
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--color-navy-900);
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          color: var(--color-gray-600);
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        input {
          width: 100%;
          border: 1px solid var(--color-gray-300);
          border-radius: 0.5rem;
          padding: 0.75rem;
          outline: none;
          box-sizing: border-box;

          &:focus {
            border-color: var(--color-orange-500);
            box-shadow: 0 0 0 2px rgba(255, 138, 61, 0.2);
          }
        }
      }

      .error-msg {
        color: #EF4444;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      .btn.full-width {
        width: 100%;
        border-radius: 0.5rem;
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

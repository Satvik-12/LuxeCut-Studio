import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Login to manage your appointments</p>
        
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Email</label>
            <input [(ngModel)]="email" name="email" type="email" required placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input [(ngModel)]="password" name="password" type="password" required placeholder="Enter your password">
          </div>

          <div *ngIf="error" class="error-msg">{{ error }}</div>

          <button type="submit" [disabled]="loading" class="btn btn-primary full-width">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="auth-footer">
            Don't have an account? <a routerLink="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-color: var(--color-gray-50);
    }

    .auth-card {
      background-color: var(--color-white);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: var(--shadow-xl);
      width: 100%;
      max-width: 26rem;
      border: 1px solid var(--color-gray-100);

      h2 {
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--color-navy-900);
        margin-bottom: 0.5rem;
        text-align: center;
      }

      .subtitle {
        text-align: center;
        color: var(--color-gray-500);
        margin-bottom: 2rem;
      }

      .form-group {
        margin-bottom: 1.25rem;

        label {
          display: block;
          color: var(--color-gray-700);
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        input {
          width: 100%;
          border: 1px solid var(--color-gray-300);
          border-radius: 0.5rem;
          padding: 0.75rem;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;

          &:focus {
            border-color: var(--color-navy-900);
            box-shadow: 0 0 0 2px rgba(30, 41, 59, 0.1);
          }
        }
      }

      .error-msg {
        background-color: #FEE2E2;
        color: #991B1B;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        text-align: center;
      }

      .btn.full-width {
        width: 100%;
        padding: 0.875rem;
        border-radius: 0.5rem;
        background-color: var(--color-navy-900);
        color: white;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--color-navy-800);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .auth-footer {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 0.875rem;
        color: var(--color-gray-600);

        a {
          color: var(--color-navy-900);
          font-weight: 600;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  `]
})
export class UserLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';
    
    this.auth.userLogin(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Create Account</h2>
        <p class="subtitle">Join LuxeCut Studio today</p>
        
        <form [formGroup]="signupForm" (ngSubmit)="signup()">
          <div class="form-group">
            <label>Full Name</label>
            <input formControlName="name" type="text" placeholder="Enter your full name">
            <div *ngIf="f['name'].touched && f['name'].errors" class="field-error">
              <span *ngIf="f['name'].errors['required']">Name is required</span>
              <span *ngIf="f['name'].errors['minlength']">Name must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input formControlName="email" type="email" placeholder="Enter your email">
            <div *ngIf="f['email'].touched && f['email'].errors" class="field-error">
              <span *ngIf="f['email'].errors['required']">Email is required</span>
              <span *ngIf="f['email'].errors['email']">Invalid email format</span>
            </div>
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input formControlName="phone" type="tel" placeholder="Enter your phone number">
            <div *ngIf="f['phone'].touched && f['phone'].errors" class="field-error">
              <span *ngIf="f['phone'].errors['required']">Phone number is required</span>
              <span *ngIf="f['phone'].errors['minlength']">Phone must be at least 10 digits</span>
              <span *ngIf="f['phone'].errors['maxlength']">Phone cannot exceed 15 digits</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input formControlName="password" type="password" placeholder="Create a password">
            <div *ngIf="f['password'].touched && f['password'].errors" class="field-error">
              <span *ngIf="f['password'].errors['required']">Password is required</span>
              <span *ngIf="f['password'].errors['minlength']">Password must be at least 8 characters</span>
              <span *ngIf="f['password'].errors['passwordStrength']">
                Password must contain uppercase, lowercase, number, and special char
              </span>
            </div>
          </div>

          <div *ngIf="error" class="error-msg">{{ error }}</div>

          <button type="submit" [disabled]="signupForm.invalid || loading" class="btn btn-primary full-width">
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>

          <div class="auth-footer">
            Already have an account? <a routerLink="/login">Login</a>
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

      .field-error {
        color: #DC2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
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
          background-color: var(--color-gray-400);
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
export class UserSignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private auth: AuthService, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]]
    });
  }

  get f() { return this.signupForm.controls; }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  signup() {
    if (this.signupForm.invalid) return;

    this.loading = true;
    this.error = '';
    
    this.auth.userSignup(this.signupForm.value).subscribe({
      next: () => {
        // Auto login after signup or redirect to login
        const { email, password } = this.signupForm.value;
        this.auth.userLogin(email, password).subscribe(() => {
          this.router.navigate(['/user/dashboard']);
        });
      },
      error: (err) => {
        this.error = err.error?.detail || 'Signup failed. Please try again.';
        this.loading = false;
      }
    });
  }
}

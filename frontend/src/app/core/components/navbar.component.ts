import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container">
        <a routerLink="/" class="brand">LuxeCut Studio</a>
        
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/book" routerLinkActive="active">Book Now</a>
        </div>

        <div class="auth-buttons">
          <ng-container *ngIf="auth.isLoggedIn$ | async">
            <a routerLink="/user/dashboard" class="btn btn-outline">Dashboard</a>
            <button (click)="auth.logout()" class="btn btn-text">Logout</button>
          </ng-container>
          
          <ng-container *ngIf="!(auth.isLoggedIn$ | async) && !(auth.isLoading$ | async)">
            <a routerLink="/login" class="btn btn-text">Login</a>
            <a routerLink="/signup" class="btn btn-primary">Sign Up</a>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--color-white);
      border-bottom: 1px solid var(--color-gray-200);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .container {
      max-width: 80rem;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-navy-900);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;

      a {
        color: var(--color-gray-600);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover {
          color: var(--color-navy-900);
        }

        &.active {
          color: var(--color-orange-600);
          font-weight: 600;
        }
      }
    }

    .auth-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 0.875rem;

      &.btn-text {
        color: var(--color-gray-600);
        background: none;
        border: none;

        &:hover {
          color: var(--color-navy-900);
        }
      }

      &.btn-primary {
        background-color: var(--color-navy-900);
        color: var(--color-white);
        border: 1px solid var(--color-navy-900);

        &:hover {
          background-color: var(--color-navy-800);
        }
      }

      &.btn-outline {
        background-color: transparent;
        border: 1px solid var(--color-gray-300);
        color: var(--color-navy-900);

        &:hover {
          border-color: var(--color-navy-900);
        }
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}

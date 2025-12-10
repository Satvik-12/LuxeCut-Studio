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
        <div class="brand-wrapper">
          <a routerLink="/" class="brand">LuxeCut Studio</a>
          <button class="mobile-menu-btn" (click)="toggleMenu()" [class.active]="isMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <div class="nav-content" [class.open]="isMenuOpen">
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Home</a>
            <a routerLink="/services" routerLinkActive="active" (click)="closeMenu()">Services</a>
            <a routerLink="/book" routerLinkActive="active" (click)="closeMenu()">Book Now</a>
          </div>

          <div class="auth-buttons">
            <ng-container *ngIf="auth.isLoggedIn$ | async">
              <a routerLink="/user/dashboard" class="btn btn-outline" (click)="closeMenu()">Dashboard</a>
              <button (click)="auth.logout(); closeMenu()" class="btn btn-text">Logout</button>
            </ng-container>
            
            <ng-container *ngIf="!(auth.isLoggedIn$ | async) && !(auth.isLoading$ | async)">
              <a routerLink="/login" class="btn btn-text" (click)="closeMenu()">Login</a>
              <a routerLink="/signup" class="btn btn-primary" (click)="closeMenu()">Sign Up</a>
            </ng-container>
          </div>
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
    }

    .brand-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-navy-900);
      text-decoration: none;
    }

    .mobile-menu-btn {
      display: none; /* Hidden on desktop */
      flex-direction: column;
      justify-content: space-between;
      width: 1.5rem;
      height: 1.25rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 60;

      span {
        display: block;
        width: 100%;
        height: 2px;
        background-color: var(--color-navy-900);
        transition: all 0.3s ease;
      }

      &.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }
      &.active span:nth-child(2) {
        opacity: 0;
      }
      &.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-grow: 1;
      margin-left: 3rem;
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

    /* Mobile Styles */
    @media (max-width: 768px) {
      .container {
        flex-direction: column;
      }

      .mobile-menu-btn {
        display: flex;
      }

      .nav-content {
        display: none;
        flex-direction: column;
        width: 100%;
        margin-left: 0;
        margin-top: 1rem;
        gap: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-gray-100);

        &.open {
          display: flex;
        }
      }

      .nav-links {
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;

        a {
          font-size: 1.125rem;
        }
      }

      .auth-buttons {
        flex-direction: column;
        width: 100%;
        gap: 1rem;

        .btn {
          width: 100%;
          text-align: center;
          justify-content: center;
        }
      }
    }

    /* Desktop Styles specific adjustments */
    @media (min-width: 769px) {
        .container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .brand-wrapper {
            width: auto;
        }
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;

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
  isMenuOpen = false;

  constructor(public auth: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}


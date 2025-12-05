import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="brand">LuxeCut Admin</div>
        <nav>
          <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/admin/appointments" routerLinkActive="active">Appointments</a>
          <a routerLink="/admin/services" routerLinkActive="active">Services</a>
        </nav>
        <div class="logout-wrapper">
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      height: 100vh;
      background-color: var(--color-gray-100);
      font-family: var(--font-sans);
    }

    .sidebar {
      width: 16rem;
      background-color: var(--color-navy-900);
      color: var(--color-white);
      display: flex;
      flex-direction: column;

      .brand {
        padding: 1.5rem;
        font-size: 1.5rem;
        font-weight: 700;
        border-bottom: 1px solid var(--color-navy-800);
      }

      nav {
        flex: 1;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        a {
          display: block;
          padding: 0.75rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;

          &:hover {
            background-color: var(--color-navy-800);
          }

          &.active {
            background-color: var(--color-navy-800);
          }
        }
      }

      .logout-wrapper {
        padding: 1rem;
        border-top: 1px solid var(--color-navy-800);

        .logout-btn {
          width: 100%;
          text-align: left;
          padding: 0.75rem;
          color: #F87171;
          background: none;
          border-radius: 0.375rem;
          transition: background-color 0.2s;

          &:hover {
            background-color: var(--color-navy-800);
          }
        }
      }
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private auth: AuthService) {}
  
  logout() {
    this.auth.logout();
  }
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="page-title">Dashboard</h2>
    
    <div class="stats-grid">
      <div class="stat-card blue">
        <h3>Appointments Today</h3>
        <p>{{ stats?.appointments_today || 0 }}</p>
      </div>
      
      <div class="stat-card orange">
        <h3>Pending Requests</h3>
        <p>{{ stats?.pending_appointments || 0 }}</p>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--color-navy-900);
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .stat-card {
      background-color: var(--color-white);
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: var(--shadow-sm);
      border-left-width: 4px;
      border-left-style: solid;

      &.blue { border-left-color: #3B82F6; }
      &.orange { border-left-color: var(--color-orange-500); }

      h3 {
        color: var(--color-gray-500);
        font-size: 0.875rem;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 2.25rem;
        font-weight: 700;
        color: var(--color-navy-900);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAdminDashboard().subscribe(data => this.stats = data);
  }
}

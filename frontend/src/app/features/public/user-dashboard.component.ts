import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="header">
          <h1>My Appointments</h1>
          <p>Manage your upcoming and past bookings</p>
        </div>

        <div class="appointments-list">
          <div *ngIf="appointments.length === 0" class="empty-state">
            <p>You haven't made any bookings yet.</p>
            <a href="/book" class="btn-link">Book an Appointment</a>
          </div>

          <div *ngFor="let apt of appointments" class="appointment-card">
            <div class="apt-header">
              <span class="service-name">{{ apt.service_name }}</span>
              <span class="status-badge" [ngClass]="apt.status.toLowerCase()">{{ apt.status }}</span>
            </div>
            
            <div class="apt-details">
              <div class="detail-item">
                <span class="label">Date</span>
                <span class="value">{{ apt.date }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Time</span>
                <span class="value">{{ apt.start_time }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Stylist</span>
                <span class="value">{{ apt.stylist_name || 'Any Stylist' }}</span>
              </div>
            </div>

            <div class="apt-footer">
              <span class="price">₹{{ apt.price }}</span>
              <span class="id">#{{ apt.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 80vh;
      background-color: var(--color-gray-50);
      padding: 3rem 1rem;
      font-family: var(--font-sans);
    }

    .container {
      max-width: 48rem;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
      
      h1 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-navy-900);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-gray-600);
      }
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .appointment-card {
      background-color: var(--color-white);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-gray-200);
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }

    .apt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-gray-100);

      .service-name {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-navy-900);
      }
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;

      &.pending { background-color: #FEF3C7; color: #92400E; }
      &.confirmed { background-color: #DCFCE7; color: #166534; }
      &.completed { background-color: #DBEAFE; color: #1E40AF; }
      &.cancelled { background-color: #FEE2E2; color: #991B1B; }
    }

    .apt-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;

      .detail-item {
        display: flex;
        flex-direction: column;
        
        .label {
          font-size: 0.75rem;
          color: var(--color-gray-500);
          margin-bottom: 0.25rem;
        }
        
        .value {
          font-weight: 600;
          color: var(--color-navy-900);
        }
      }
    }

    .apt-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--color-gray-100);

      .price {
        font-weight: 700;
        color: var(--color-orange-600);
        font-size: 1.125rem;
      }

      .id {
        font-family: monospace;
        color: var(--color-gray-400);
        font-size: 0.875rem;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background-color: var(--color-white);
      border-radius: 1rem;
      border: 1px dashed var(--color-gray-300);

      p {
        color: var(--color-gray-500);
        margin-bottom: 1.5rem;
      }

      .btn-link {
        color: var(--color-orange-600);
        font-weight: 600;
        text-decoration: none;
        
        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  appointments: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUserAppointments().subscribe(data => {
      this.appointments = data;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h2>Appointments</h2>
      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="loadAppointments()">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input type="date" [(ngModel)]="dateFilter" (change)="loadAppointments()">
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date & Time</th>
            <th>Stylist</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let apt of appointments">
            <td>
              <div class="font-bold">{{ apt.customer_name }}</div>
              <div class="sub-text">{{ apt.customer_phone }}</div>
            </td>
            <td>{{ apt.service?.name }}</td>
            <td>
              <div>{{ apt.date }}</div>
              <div class="sub-text">{{ apt.start_time | slice:0:5 }}</div>
            </td>
            <td>{{ apt.stylist?.name || '-' }}</td>
            <td>
              <span class="status-badge" [ngClass]="apt.status.toLowerCase()">
                {{ apt.status }}
              </span>
            </td>
            <td>
              <select [ngModel]="apt.status" (ngModelChange)="updateStatus(apt.id, $event)" class="action-select">
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirm</option>
                <option value="COMPLETED">Complete</option>
                <option value="CANCELLED">Cancel</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="appointments.length === 0" class="empty-state">
        No appointments found.
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--color-navy-900);
      }

      .filters {
        display: flex;
        gap: 1rem;

        select, input {
          padding: 0.5rem;
          border: 1px solid var(--color-gray-300);
          border-radius: 0.5rem;
          outline: none;
          
          &:focus {
            border-color: var(--color-orange-500);
          }
        }
      }
    }

    .table-container {
      background-color: var(--color-white);
      border-radius: 0.75rem;
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      border: 1px solid var(--color-gray-200);

      table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;

        th {
          padding: 1rem;
          background-color: var(--color-gray-50);
          border-bottom: 1px solid var(--color-gray-200);
          font-weight: 700;
          color: var(--color-gray-600);
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid var(--color-gray-100);
          color: var(--color-navy-900);
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover {
          background-color: var(--color-gray-50);
        }
      }
    }

    .font-bold { font-weight: 600; }
    .sub-text { font-size: 0.875rem; color: var(--color-gray-500); }

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

    .action-select {
      padding: 0.25rem;
      border: 1px solid var(--color-gray-300);
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: var(--color-gray-500);
    }
  `]
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  statusFilter = 'ALL';
  dateFilter = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.api.getAdminAppointments(this.dateFilter, this.statusFilter).subscribe(data => {
      this.appointments = data;
    });
  }

  updateStatus(id: number, status: string) {
    if (confirm(`Change status to ${status}?`)) {
      this.api.updateAppointmentStatus(id, status).subscribe(() => {
        this.loadAppointments();
      });
    } else {
      this.loadAppointments(); // Revert UI if cancelled
    }
  }
}

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
              <span class="badge" 
                [class.badge-warning]="apt.status === 'PENDING'"
                [class.badge-success]="apt.status === 'CONFIRMED'"
                [class.badge-neutral]="apt.status === 'COMPLETED'"
                [class.badge-error]="apt.status === 'CANCELLED'">
                {{ apt.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button *ngIf="apt.status === 'PENDING'" 
                        (click)="updateStatus(apt.id, 'CONFIRMED')" 
                        class="btn-action btn-confirm">
                  Confirm
                </button>
                
                <button *ngIf="apt.status === 'CONFIRMED'" 
                        (click)="updateStatus(apt.id, 'COMPLETED')" 
                        class="btn-action btn-complete">
                  Complete
                </button>

                <button *ngIf="apt.status === 'PENDING' || apt.status === 'CONFIRMED'" 
                        (click)="updateStatus(apt.id, 'CANCELLED')" 
                        class="btn-action btn-cancel">
                  Cancel
                </button>
                
                <span *ngIf="apt.status === 'COMPLETED' || apt.status === 'CANCELLED'" class="text-gray-400 text-sm">
                  No actions
                </span>
              </div>
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
          vertical-align: middle;
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



    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }


    .btn-action {
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    .btn-confirm {
      background-color: #DCFCE7;
      color: #166534;
      border-color: #86EFAC;

      &:hover {
        background-color: #BBF7D0;
      }
    }

    .btn-complete {
      background-color: #DBEAFE;
      color: #1E40AF;
      border-color: #93C5FD;

      &:hover {
        background-color: #BFDBFE;
      }
    }

    .btn-cancel {
      background-color: white;
      color: #991B1B;
      border-color: #FECACA;

      &:hover {
        background-color: #FEE2E2;
      }
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

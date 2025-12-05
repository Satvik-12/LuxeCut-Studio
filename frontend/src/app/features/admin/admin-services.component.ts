import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h2>Services</h2>
      <button (click)="showModal = true" class="btn btn-primary">Add Service</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let service of services">
            <td class="font-bold">{{ service.name }}</td>
            <td class="text-gray">{{ service.description }}</td>
            <td>{{ service.duration_minutes }} mins</td>
            <td>₹{{ service.price }}</td>
            <td>
              <span class="status-badge" [class.active]="service.is_active" [class.inactive]="!service.is_active">
                {{ service.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Service Modal -->
    <div *ngIf="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Add New Service</h3>
        <form (ngSubmit)="createService()">
          <div class="form-group">
            <label>Name</label>
            <input [(ngModel)]="newService.name" name="name" type="text" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="newService.description" name="description"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Duration (min)</label>
              <input [(ngModel)]="newService.duration_minutes" name="duration" type="number" required>
            </div>
            <div class="form-group">
              <label>Price</label>
              <input [(ngModel)]="newService.price" name="price" type="number" required>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" (click)="showModal = false" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
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
    .text-gray { color: var(--color-gray-600); }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;

      &.active { background-color: #DCFCE7; color: #166534; }
      &.inactive { background-color: #FEE2E2; color: #991B1B; }
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 50;
    }

    .modal-content {
      background-color: var(--color-white);
      border-radius: 1rem;
      padding: 2rem;
      width: 100%;
      max-width: 28rem;
      box-shadow: var(--shadow-2xl);

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: var(--color-navy-900);
      }
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        color: var(--color-gray-600);
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }

      input, textarea {
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-cancel {
      padding: 0.75rem 1.5rem;
      color: var(--color-gray-600);
      background: none;
      font-weight: 600;
      
      &:hover { color: var(--color-navy-900); }
    }
  `]
})
export class AdminServicesComponent implements OnInit {
  services: any[] = [];
  showModal = false;
  newService = {
    name: '',
    description: '',
    duration_minutes: 30,
    price: 0,
    is_active: true
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.api.getServices().subscribe(data => this.services = data);
  }

  createService() {
    this.api.createService(this.newService).subscribe(() => {
      this.showModal = false;
      this.loadServices();
      this.newService = { name: '', description: '', duration_minutes: 30, price: 0, is_active: true };
    });
  }
}

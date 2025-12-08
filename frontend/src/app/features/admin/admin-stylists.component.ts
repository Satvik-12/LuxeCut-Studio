import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-stylists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h2>Stylists</h2>
      <button (click)="openAddModal()" class="btn btn-primary">Add Stylist</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialties</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let stylist of stylists">
            <td class="font-bold">{{ stylist.name }}</td>
            <td class="text-gray">{{ stylist.specialties || '-' }}</td>
            <td>
              <span class="badge" [class.badge-success]="stylist.is_active" [class.badge-error]="!stylist.is_active">
                {{ stylist.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button (click)="openEditModal(stylist)" class="btn-icon">Edit</button>
                <button (click)="toggleStatus(stylist)" class="btn-icon" [class.text-red]="stylist.is_active" [class.text-green]="!stylist.is_active">
                  {{ stylist.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Stylist Modal -->
    <div *ngIf="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Stylist' : 'Add New Stylist' }}</h3>
        <form (ngSubmit)="saveStylist()">
          <div class="form-group">
            <label>Name</label>
            <input [(ngModel)]="newStylist.name" name="name" type="text" required class="form-control">
          </div>
          <div class="form-group">
            <label>Specialties</label>
            <textarea [(ngModel)]="newStylist.specialties" name="specialties" class="form-control" placeholder="e.g. Haircuts, Coloring"></textarea>
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

    .actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn-icon {
      background: none;
      border: none;
      color: var(--color-primary-blue);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0;
      
      &:hover { text-decoration: underline; }
    }
    
    .text-red { color: var(--color-error); }
    .text-green { color: var(--color-success); }

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
export class AdminStylistsComponent implements OnInit {
  stylists: any[] = [];
  showModal = false;
  isEditing = false;
  editingId: number | null = null;
  
  newStylist = {
    name: '',
    specialties: '',
    is_active: true
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadStylists();
  }

  loadStylists() {
    this.api.getAdminStylists().subscribe(data => this.stylists = data);
  }

  openAddModal() {
    this.isEditing = false;
    this.editingId = null;
    this.newStylist = { name: '', specialties: '', is_active: true };
    this.showModal = true;
  }

  openEditModal(stylist: any) {
    this.isEditing = true;
    this.editingId = stylist.id;
    this.newStylist = { ...stylist };
    this.showModal = true;
  }

  saveStylist() {
    if (this.isEditing && this.editingId) {
      this.api.updateStylist(this.editingId, this.newStylist).subscribe(() => {
        this.showModal = false;
        this.loadStylists();
      });
    } else {
      this.api.createStylist(this.newStylist).subscribe(() => {
        this.showModal = false;
        this.loadStylists();
      });
    }
  }
  
  toggleStatus(stylist: any) {
    const updatedStylist = { ...stylist, is_active: !stylist.is_active };
    this.api.updateStylist(stylist.id, updatedStylist).subscribe(() => {
      this.loadStylists();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="booking-page">
      <div class="booking-container">
        <!-- Progress Steps -->
        <div class="steps-container">
          <div class="progress-bar"></div>
          
          <!-- Step 1 -->
          <div class="step-item">
            <div class="step-circle" [class.active]="step >= 1">1</div>
            <span class="step-label">Service</span>
          </div>
          
          <!-- Step 2 -->
          <div class="step-item">
            <div class="step-circle" [class.active]="step >= 2">2</div>
            <span class="step-label">Date & Time</span>
          </div>
          
          <!-- Step 3 -->
          <div class="step-item">
            <div class="step-circle" [class.active]="step >= 3">3</div>
            <span class="step-label">Details</span>
          </div>
        </div>

        <div class="booking-card">
          <div class="card-body">
            <!-- Step 1: Service Selection -->
            <div *ngIf="step === 1" class="step-content">
              <h2>Select a Service</h2>
              <div class="service-list">
                <div *ngFor="let service of services" 
                     (click)="selectService(service)"
                     class="service-option"
                     [class.selected]="selectedService?.id === service.id">
                  <div>
                    <h3>{{ service.name }}</h3>
                    <p>{{ service.duration_minutes }} mins</p>
                  </div>
                  <span class="price">₹{{ service.price }}</span>
                </div>
              </div>
            </div>

            <!-- Step 2: Date & Time -->
            <div *ngIf="step === 2" class="step-content">
              <h2>Choose a Time</h2>
              
              <div class="form-group">
                <label>Date</label>
                <input type="date" [(ngModel)]="selectedDate" (change)="checkAvailability()">
              </div>

              <div *ngIf="availableSlots.length > 0" class="slots-grid">
                <button *ngFor="let slot of availableSlots"
                        (click)="selectTime(slot)"
                        class="slot-btn"
                        [class.selected]="selectedTime === slot">
                  {{ slot }}
                </button>
              </div>
              
              <div *ngIf="selectedDate && availableSlots.length === 0" class="no-slots">
                No slots available for this date. Please try another day.
              </div>
            </div>

            <!-- Step 3: Customer Details -->
            <div *ngIf="step === 3" class="step-content">
              <h2>Your Details</h2>
              <form [formGroup]="bookingForm" class="booking-form">
                <div class="form-group">
                  <label>Full Name</label>
                  <input formControlName="customer_name" type="text">
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input formControlName="customer_phone" type="tel">
                </div>
                <div class="form-group">
                  <label>Notes (Optional)</label>
                  <textarea formControlName="notes" rows="3"></textarea>
                </div>
              </form>

              <div class="summary-box">
                <h3>Booking Summary</h3>
                <div class="summary-row">
                  <span>Service</span>
                  <span class="value">{{ selectedService?.name }}</span>
                </div>
                <div class="summary-row">
                  <span>Date & Time</span>
                  <span class="value">{{ selectedDate }} at {{ selectedTime }}</span>
                </div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span class="price">₹{{ selectedService?.price }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="card-footer">
            <button *ngIf="step > 1" (click)="prevStep()" class="btn-back">
              ← Back
            </button>
            <div *ngIf="step === 1"></div> <!-- Spacer -->

            <button *ngIf="step < 3" (click)="nextStep()" 
                    [disabled]="!canProceed()"
                    class="btn btn-dark"
                    [class.disabled]="!canProceed()">
              Next Step
            </button>

            <button *ngIf="step === 3" (click)="submitBooking()" 
                    [disabled]="bookingForm.invalid"
                    class="btn btn-primary"
                    [class.disabled]="bookingForm.invalid">
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-page {
      min-height: 100vh;
      background-color: var(--color-gray-50);
      padding: 3rem 1rem;
      font-family: var(--font-sans);
    }

    .booking-container {
      max-width: 48rem;
      margin: 0 auto;
    }

    /* Steps */
    .steps-container {
      margin-bottom: 3rem;
      display: flex;
      justify-content: space-between;
      position: relative;
      max-width: 24rem;
      margin-left: auto;
      margin-right: auto;

      .progress-bar {
        position: absolute;
        top: 1.25rem;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--color-gray-200);
        z-index: 0;
      }

      .step-item {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--color-gray-50);
        padding: 0 0.5rem;

        .step-circle {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background-color: var(--color-gray-300);
          color: var(--color-gray-500);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.3s ease;

          &.active {
            background-color: var(--color-navy-900);
            color: var(--color-white);
          }
        }

        .step-label {
          font-size: 0.875rem;
          margin-top: 0.5rem;
          font-weight: 500;
          color: var(--color-gray-600);
        }
      }
    }

    /* Card */
    .booking-card {
      background-color: var(--color-white);
      border-radius: 1rem;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--color-gray-100);
      overflow: hidden;

      .card-body {
        padding: 2rem;
      }

      .card-footer {
        background-color: var(--color-gray-50);
        padding: 1.5rem 2rem;
        border-top: 1px solid var(--color-gray-100);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-navy-900);
      margin-bottom: 1.5rem;
    }

    /* Service List */
    .service-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .service-option {
        padding: 1rem;
        border-radius: 0.75rem;
        border: 2px solid var(--color-gray-100);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--color-orange-500);
        }

        &.selected {
          border-color: var(--color-orange-500);
          background-color: #FFF7ED;
        }

        h3 {
          font-weight: 700;
          color: var(--color-navy-900);
          margin-bottom: 0.25rem;
        }

        p {
          font-size: 0.875rem;
          color: var(--color-gray-500);
        }

        .price {
          font-weight: 700;
          color: var(--color-orange-600);
        }
      }
    }

    /* Form Elements */
    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-gray-600);
        margin-bottom: 0.5rem;
      }

      input, textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--color-gray-300);
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;

        &:focus {
          border-color: var(--color-orange-500);
          box-shadow: 0 0 0 2px rgba(255, 138, 61, 0.2);
        }
      }
    }

    /* Slots Grid */
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(4, 1fr);
      }

      .slot-btn {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        background-color: var(--color-gray-100);
        color: var(--color-gray-600);
        transition: all 0.2s;

        &:hover {
          background-color: var(--color-gray-200);
        }

        &.selected {
          background-color: var(--color-navy-900);
          color: var(--color-white);
          box-shadow: var(--shadow-md);
        }
      }
    }

    .no-slots {
      text-align: center;
      padding: 2rem 0;
      color: var(--color-gray-500);
    }

    /* Summary Box */
    .summary-box {
      background-color: var(--color-gray-50);
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--color-gray-200);
      margin-top: 2rem;

      h3 {
        font-size: 1rem;
        margin-bottom: 1rem;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;

        span:first-child { color: var(--color-gray-600); }
        .value { font-weight: 500; color: var(--color-navy-900); }

        &.total {
          border-top: 1px solid var(--color-gray-200);
          margin-top: 1rem;
          padding-top: 1rem;
          font-size: 1rem;
          
          span:first-child { font-weight: 700; color: var(--color-navy-900); }
          .price { font-weight: 700; color: var(--color-orange-600); }
        }
      }
    }

    /* Buttons */
    .btn-back {
      color: var(--color-gray-600);
      font-weight: 500;
      &:hover { color: var(--color-navy-900); }
    }

    .btn.disabled {
      background-color: var(--color-gray-300);
      color: var(--color-gray-500);
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class BookingComponent implements OnInit {
  step = 1;
  services: any[] = [];
  selectedService: any = null;
  selectedDate: string = '';
  selectedTime: string = '';
  availableSlots: string[] = [];
  bookingForm: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookingForm = this.fb.group({
      customer_name: ['', Validators.required],
      customer_phone: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.api.getServices().subscribe(data => {
      this.services = data;
      // Check for query param pre-selection
      this.route.queryParams.subscribe(params => {
        if (params['serviceId']) {
          const service = this.services.find(s => s.id == params['serviceId']);
          if (service) {
            this.selectService(service);
          }
        }
      });
    });
  }

  selectService(service: any) {
    this.selectedService = service;
    if (this.step === 1) this.nextStep();
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  checkAvailability() {
    if (this.selectedService && this.selectedDate) {
      this.api.checkAvailability(this.selectedDate, this.selectedService.id).subscribe(data => {
        this.availableSlots = data.available_slots;
      });
    }
  }

  canProceed(): boolean {
    if (this.step === 1) return !!this.selectedService;
    if (this.step === 2) return !!this.selectedDate && !!this.selectedTime;
    return false;
  }

  nextStep() {
    if (this.canProceed()) {
      this.step++;
    }
  }

  prevStep() {
    this.step--;
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      const bookingData = {
        service_id: this.selectedService.id,
        date: this.selectedDate,
        start_time: this.selectedTime,
        ...this.bookingForm.value
      };
      this.api.createAppointment(bookingData).subscribe({
        next: (res) => {
          this.router.navigate(['/success'], { queryParams: { id: res.id } });
        },
        error: (err) => alert('Booking failed. Please try again.')
      });
    }
  }
}

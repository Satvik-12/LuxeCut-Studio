import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CalendarComponent } from '../../core/components/calendar.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CalendarComponent],
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
            <span class="step-label">Stylist</span>
          </div>
          
          <!-- Step 3 -->
          <div class="step-item">
            <div class="step-circle" [class.active]="step >= 3">3</div>
            <span class="step-label">Time</span>
          </div>
          
          <!-- Step 4 -->
          <div class="step-item">
            <div class="step-circle" [class.active]="step >= 4">4</div>
            <span class="step-label">Details</span>
          </div>
        </div>

        <div class="booking-card">
          <div class="card-body">
            <!-- Step 1: Service Selection -->
            <div *ngIf="step === 1" class="step-content animate-fade-in">
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

            <!-- Step 2: Stylist Selection -->
            <div *ngIf="step === 2" class="step-content animate-fade-in">
              <h2>Choose a Stylist (Optional)</h2>
              <div class="stylist-list">
                <div (click)="selectStylist(null)"
                     class="stylist-option"
                     [class.selected]="selectedStylist === null">
                  <div class="avatar-placeholder">?</div>
                  <h3>Any Stylist</h3>
                  <p>Maximum availability</p>
                </div>
                
                <div *ngFor="let stylist of stylists" 
                     (click)="selectStylist(stylist)"
                     class="stylist-option"
                     [class.selected]="selectedStylist?.id === stylist.id">
                  <div class="avatar-placeholder">{{ stylist.name.charAt(0) }}</div>
                  <h3>{{ stylist.name }}</h3>
                  <p>{{ stylist.specialties || 'General Stylist' }}</p>
                </div>
              </div>
            </div>

            <!-- Step 3: Date & Time -->
            <div *ngIf="step === 3" class="step-content animate-fade-in">
              <h2>Choose a Time</h2>
              
              <div class="form-group center-calendar">
                <label>Select Date</label>
                <div class="calendar-wrapper">
                  <app-calendar 
                    [minDate]="minDate" 
                    [selectedDate]="selectedDate"
                    (dateChange)="onDateSelect($event)">
                  </app-calendar>
                </div>
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

            <!-- Step 4: Customer Details -->
            <div *ngIf="step === 4" class="step-content animate-fade-in">
              <h2>Your Details</h2>
              <form [formGroup]="bookingForm" class="booking-form">
                <div class="form-group">
                  <label>Full Name</label>
                  <input formControlName="customer_name" type="text" class="form-control" placeholder="John Doe">
                  <div *ngIf="bookingForm.get('customer_name')?.touched && bookingForm.get('customer_name')?.invalid" class="error-text">
                    Name is required
                  </div>
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input formControlName="customer_phone" type="tel" class="form-control" placeholder="+91 98765 43210">
                  <div *ngIf="bookingForm.get('customer_phone')?.touched && bookingForm.get('customer_phone')?.invalid" class="error-text">
                    Valid phone number is required
                  </div>
                </div>
                <div class="form-group">
                  <label>Notes (Optional)</label>
                  <textarea formControlName="notes" rows="3" class="form-control" placeholder="Any special requests?"></textarea>
                </div>
              </form>

              <div class="summary-box">
                <h3>Booking Summary</h3>
                <div class="summary-row">
                  <span>Service</span>
                  <span class="value">{{ selectedService?.name }}</span>
                </div>
                <div class="summary-row">
                  <span>Stylist</span>
                  <span class="value">{{ selectedStylist?.name || 'Any Stylist' }}</span>
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

            <button *ngIf="step < 4" (click)="nextStep()" 
                    [disabled]="!canProceed()"
                    class="btn btn-dark"
                    [class.disabled]="!canProceed()">
              Next Step
            </button>

            <button *ngIf="step === 4" (click)="submitBooking()" 
                    [disabled]="bookingForm.invalid || isSubmitting"
                    class="btn btn-primary"
                    [class.disabled]="bookingForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Booking...' : 'Confirm Booking' }}
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
      max-width: 32rem;
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
          border-color: var(--color-accent-orange);
        }

        &.selected {
          border-color: var(--color-accent-orange);
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
          color: var(--color-accent-orange);
        }
      }
    }

    /* Stylist List */
    .stylist-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      
      @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
      }

      .stylist-option {
        padding: 1rem;
        border-radius: 0.75rem;
        border: 2px solid var(--color-gray-100);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--color-accent-orange);
        }

        &.selected {
          border-color: var(--color-accent-orange);
          background-color: #FFF7ED;
        }

        .avatar-placeholder {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background-color: var(--color-gray-200);
          color: var(--color-gray-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }

        h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        p {
          font-size: 0.75rem;
          color: var(--color-gray-500);
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
          background-color: var(--color-accent-orange);
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
    
    .center-calendar {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .calendar-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
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
          .price { font-weight: 700; color: var(--color-accent-orange); }
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
    
    .error-text {
      color: var(--color-error);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class BookingComponent implements OnInit {
  step = 1;
  services: any[] = [];
  stylists: any[] = [];
  selectedService: any = null;
  selectedStylist: any = null;
  selectedDate: string = '';
  selectedTime: string = '';
  availableSlots: string[] = [];
  bookingForm: FormGroup;
  minDate: string = '';
  isSubmitting = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookingForm = this.fb.group({
      customer_name: ['', Validators.required],
      customer_phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      notes: ['']
    });
    
    // Set min date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
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
    
    this.api.getStylists().subscribe(data => {
      this.stylists = data;
    });
  }

  selectService(service: any) {
    this.selectedService = service;
    if (this.step === 1) this.nextStep();
  }
  
  selectStylist(stylist: any) {
    this.selectedStylist = stylist;
    if (this.step === 2) this.nextStep();
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  onDateSelect(date: string) {
    this.selectedDate = date;
    this.checkAvailability();
  }

  checkAvailability() {
    if (this.selectedService && this.selectedDate) {
      this.availableSlots = []; // Reset slots
      this.selectedTime = ''; // Reset selected time
      
      const stylistId = this.selectedStylist ? this.selectedStylist.id : undefined;
      
      this.api.checkAvailability(this.selectedDate, this.selectedService.id, stylistId).subscribe(data => {
        this.availableSlots = data.available_slots;
      });
    }
  }

  canProceed(): boolean {
    if (this.step === 1) return !!this.selectedService;
    if (this.step === 2) return true; // Stylist is optional, but we force selection of "Any" or specific to move forward via click, or next button
    if (this.step === 3) return !!this.selectedDate && !!this.selectedTime;
    return false;
  }

  nextStep() {
    // If on stylist step and no stylist selected, it means "Any" (if we allow skipping without clicking "Any")
    // But my UI forces clicking an option. 
    // Actually, let's allow "Next" on step 2 to mean "Any" if nothing selected? 
    // Better to force user to pick "Any" or a stylist.
    // In my template, I have "Any Stylist" option which sets selectedStylist to null.
    // So if selectedStylist is undefined, we might want to default to null (Any) if they click Next?
    // Let's just require them to click an option.
    
    if (this.step === 2 && this.selectedStylist === undefined) {
        // If they haven't clicked anything, we can't proceed unless we default.
        // But the "Next Step" button is disabled if !canProceed().
        // Let's make canProceed return true for step 2 ONLY if they selected something (even null).
        // Wait, I initialized selectedStylist to null. So it IS null by default.
        // So "Any" is selected by default? No, I want them to choose.
        // Let's change initialization to undefined.
    }
    
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      const bookingData = {
        service_id: this.selectedService.id,
        stylist_id: this.selectedStylist ? this.selectedStylist.id : null,
        date: this.selectedDate,
        start_time: this.selectedTime,
        ...this.bookingForm.value
      };
      
      this.api.createAppointment(bookingData).subscribe({
        next: (res) => {
          this.router.navigate(['/success', res.id]);
        },
        error: (err) => {
          alert('Booking failed. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
}


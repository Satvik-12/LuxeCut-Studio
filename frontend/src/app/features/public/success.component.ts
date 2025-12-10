import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="success-page">
      <div class="success-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1>Booking Confirmed!</h1>
        <p class="subtitle">Your appointment has been successfully scheduled.</p>
        
        <div *ngIf="appointment" class="details-box">
          <div class="detail-row">
            <span class="label">Service</span>
            <span class="value">{{ appointment.service?.name }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Stylist</span>
            <span class="value">{{ appointment.stylist?.name || 'Any Stylist' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Date</span>
            <span class="value">{{ appointment.date }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Time</span>
            <span class="value">{{ appointment.start_time }}</span>
          </div>
          <div class="detail-row id-row">
            <span class="label">Booking ID</span>
            <span class="value id">#{{ appointment.id }}</span>
          </div>
        </div>
        
        <a routerLink="/" class="btn btn-dark full-width">
          Return Home
        </a>
      </div>
    </div>
  `,
  styles: [`
    .success-page {
      min-height: 100vh;
      background-color: var(--color-gray-50);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      font-family: var(--font-sans);
    }

    .success-card {
      background-color: var(--color-white);
      padding: 3rem;
      border-radius: 1.5rem;
      box-shadow: var(--shadow-2xl);
      max-width: 28rem;
      width: 100%;
      text-align: center;
      border: 1px solid var(--color-gray-100);

      .icon-wrapper {
        width: 5rem;
        height: 5rem;
        background-color: #DCFCE7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;

        svg {
          width: 2.5rem;
          height: 2.5rem;
          color: #16A34A;
        }
      }

      h1 {
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--color-navy-900);
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: var(--color-gray-500);
        margin-bottom: 2rem;
      }

      .details-box {
        background-color: var(--color-gray-50);
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: left;
        border: 1px solid var(--color-gray-200);

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;

          .label { color: var(--color-gray-500); }
          .value { font-weight: 600; color: var(--color-navy-900); }

          &.id-row {
            border-top: 1px solid var(--color-gray-200);
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            margin-bottom: 0;

            .id {
              font-family: monospace;
              color: var(--color-orange-600);
              font-size: 1rem;
            }
          }
        }
      }

      .btn.full-width {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  `]
})
export class SuccessComponent implements OnInit {
  appointment: any;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.api.getAppointment(params['id']).subscribe(data => {
          this.appointment = data;
        });
      }
    });
  }
}

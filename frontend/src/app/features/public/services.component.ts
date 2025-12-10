import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LoadingBannerComponent } from '../../core/components/loading-banner.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingBannerComponent],
  template: `
    <div class="services-page">
      <!-- Header -->
      <div class="page-header">
        <h1>Our Services</h1>
        <p>Choose from our wide range of premium grooming and styling services.</p>
      </div>

      <div class="container">
        <app-loading-banner *ngIf="isLoading" message="Loading services..."></app-loading-banner>
        
        <div *ngIf="!isLoading" class="services-grid animate-fade-in">
          <div *ngFor="let service of services" class="service-card">
            <!-- Placeholder Image for services -->
            <div class="image-wrapper">
               <img src="assets/images/service_haircut_1764921292610.png" alt="Service">
               <div class="duration-badge">
                 {{ service.duration_minutes }} min
               </div>
            </div>
            
            <div class="card-content">
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              
              <div class="card-footer">
                <span class="price">₹{{ service.price }}</span>
                <a [routerLink]="['/book']" [queryParams]="{serviceId: service.id}" class="btn btn-dark">
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .services-page {
      min-height: 100vh;
      background-color: var(--color-gray-50);
      font-family: var(--font-sans);
    }

    .page-header {
      background-color: var(--color-navy-900);
      color: var(--color-white);
      padding: 4rem 1rem;
      text-align: center;

      h1 {
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      p {
        color: var(--color-gray-300);
        max-width: 42rem;
        margin: 0 auto;
      }
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 4rem 1rem;
    }

    .services-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .service-card {
      background-color: var(--color-white);
      border-radius: 1rem;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid var(--color-gray-100);

      &:hover {
        box-shadow: var(--shadow-xl);
        
        img {
          transform: scale(1.1);
        }
      }

      .image-wrapper {
        height: 12rem;
        background-color: var(--color-gray-200);
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .duration-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-navy-900);
          box-shadow: var(--shadow-sm);
        }
      }

      .card-content {
        padding: 1.5rem;

        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-navy-900);
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--color-gray-600);
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--color-gray-100);

          .price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-orange-500);
          }
        }
      }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  isLoading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}

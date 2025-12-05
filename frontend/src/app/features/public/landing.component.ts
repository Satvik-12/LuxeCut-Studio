import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg">
          <img src="assets/images/hero_salon_interior_1764921274472.png" alt="Luxury Salon">
          <div class="overlay"></div>
        </div>

        <div class="hero-content">
          <h1 class="animate-fade-in-up">
            LuxeCut <span>Studio</span>
          </h1>
          <p class="animate-fade-in-up delay-100">
            Experience the art of styling in an atmosphere of pure luxury. Book your transformation in seconds.
          </p>
          <div class="cta-group animate-fade-in-up delay-200">
            <a routerLink="/book" class="btn btn-primary">
              Book Appointment
            </a>
            <a routerLink="/services" class="btn btn-secondary">
              Explore Services
            </a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <div class="section-header">
            <h2>Why Choose LuxeCut?</h2>
            <div class="divider"></div>
          </div>
          
          <div class="features-grid">
            <!-- Feature 1 -->
            <div class="feature-card">
              <div class="icon-wrapper blue">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Zero Wait Time</h3>
              <p>Your time is precious. Book your slot online and walk straight into your appointment without the queue.</p>
            </div>

            <!-- Feature 2 -->
            <div class="feature-card">
              <div class="icon-wrapper orange">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3>Expert Stylists</h3>
              <p>Our team consists of award-winning professionals dedicated to crafting your perfect look.</p>
            </div>

            <!-- Feature 3 -->
            <div class="feature-card">
              <div class="icon-wrapper green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Instant Confirmation</h3>
              <p>Receive immediate booking confirmation via SMS and Email. Manage your appointments with ease.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Preview -->
      <section class="services-preview">
        <div class="container">
          <div class="services-header">
            <div>
              <h2>Popular Services</h2>
              <p>Discover our most sought-after treatments.</p>
            </div>
            <a routerLink="/services" class="view-all">
              View All Services <span>→</span>
            </a>
          </div>

          <div class="services-grid">
            <div class="service-card">
              <img src="assets/images/service_haircut_1764921292610.png" alt="Haircut">
              <div class="overlay"></div>
              <div class="content">
                <h3>Precision Haircuts</h3>
                <p>Tailored to your face shape and lifestyle.</p>
                <span class="book-link">Book Now</span>
              </div>
            </div>

            <div class="service-card">
              <img src="assets/images/service_facial_1764921309258.png" alt="Facial">
              <div class="overlay"></div>
              <div class="content">
                <h3>Rejuvenating Facials</h3>
                <p>Restore your glow with our premium treatments.</p>
                <span class="book-link">Book Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer>
        <div class="container">
          <div class="footer-content">
            <div class="brand">
              <h2>LuxeCut <span>Studio</span></h2>
              <p>Premium styling for the modern individual.</p>
            </div>
            <div class="social-links">
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
              <a href="#">Facebook</a>
            </div>
          </div>
          <div class="copyright">
            © 2025 LuxeCut Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      font-family: var(--font-sans);
      color: var(--color-gray-800);
    }

    /* Hero Section */
    .hero {
      position: relative;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .hero-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(13, 26, 45, 0.7);
          backdrop-filter: blur(2px);
        }
      }

      .hero-content {
        position: relative;
        z-index: 10;
        text-align: center;
        padding: 0 1rem;
        max-width: 56rem;
        margin: 0 auto;

        h1 {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-white);
          margin-bottom: 1.5rem;
          letter-spacing: -0.025em;

          span {
            color: var(--color-orange-500);
          }

          @media (min-width: 768px) {
            font-size: 4.5rem;
          }
        }

        p {
          font-size: 1.25rem;
          color: var(--color-gray-200);
          margin-bottom: 2.5rem;
          font-weight: 300;
          max-width: 42rem;
          margin-left: auto;
          margin-right: auto;

          @media (min-width: 768px) {
            font-size: 1.5rem;
          }
        }

        .cta-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;

          @media (min-width: 640px) {
            flex-direction: row;
          }
        }
      }
    }

    /* Features Section */
    .features {
      padding: 5rem 0;
      background-color: var(--color-gray-50);

      .section-header {
        text-align: center;
        margin-bottom: 4rem;

        h2 {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-navy-900);
          margin-bottom: 1rem;

          @media (min-width: 768px) {
            font-size: 2.5rem;
          }
        }

        .divider {
          width: 6rem;
          height: 0.25rem;
          background-color: var(--color-orange-500);
          margin: 0 auto;
          border-radius: 9999px;
        }
      }

      .features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2.5rem;

        @media (min-width: 768px) {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .feature-card {
        background-color: var(--color-white);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: var(--shadow-xl);
        border: 1px solid var(--color-gray-100);
        transition: box-shadow 0.3s ease;

        &:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .icon-wrapper {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;

          svg {
            width: 2rem;
            height: 2rem;
          }

          &.blue { background-color: #EFF6FF; color: #2563EB; }
          &.orange { background-color: #FFF7ED; color: var(--color-orange-500); }
          &.green { background-color: #F0FDF4; color: #16A34A; }
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-navy-900);
          margin-bottom: 0.75rem;
        }

        p {
          color: var(--color-gray-600);
          line-height: 1.625;
        }
      }
    }

    /* Services Preview */
    .services-preview {
      padding: 5rem 0;
      background-color: var(--color-white);

      .services-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 3rem;

        @media (min-width: 768px) {
          flex-direction: row;
        }

        div {
          width: 100%;
          h2 {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--color-navy-900);
            margin-bottom: 0.5rem;
            @media (min-width: 768px) { font-size: 2.5rem; }
          }
          p { color: var(--color-gray-500); }
        }

        .view-all {
          color: var(--color-orange-500);
          font-weight: 600;
          display: flex;
          align-items: center;
          margin-top: 1rem;
          white-space: nowrap;

          &:hover { color: var(--color-orange-600); }
          span { margin-left: 0.5rem; }
          @media (min-width: 768px) { margin-top: 0; }
        }
      }

      .services-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;

        @media (min-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .service-card {
        position: relative;
        border-radius: 1rem;
        overflow: hidden;
        height: 20rem;
        cursor: pointer;

        &:hover {
          img { transform: scale(1.1); }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        }

        .content {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 2rem;

          h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-white);
            margin-bottom: 0.5rem;
          }

          p {
            color: var(--color-gray-300);
            margin-bottom: 1rem;
          }

          .book-link {
            color: var(--color-white);
            border-bottom: 1px solid var(--color-orange-500);
            padding-bottom: 0.25rem;
          }
        }
      }
    }

    /* Footer */
    footer {
      background-color: var(--color-navy-900);
      color: var(--color-white);
      padding: 3rem 0;

      .footer-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;

        @media (min-width: 768px) {
          flex-direction: row;
        }

        .brand {
          text-align: center;
          margin-bottom: 1.5rem;
          @media (min-width: 768px) { text-align: left; margin-bottom: 0; }

          h2 {
            font-size: 1.5rem;
            font-weight: 700;
            span { color: var(--color-orange-500); }
          }
          p { color: var(--color-gray-500); margin-top: 0.5rem; }
        }

        .social-links {
          display: flex;
          gap: 1.5rem;
          a {
            color: var(--color-gray-500);
            transition: color 0.3s;
            &:hover { color: var(--color-white); }
          }
        }
      }

      .copyright {
        border-top: 1px solid var(--color-navy-800);
        padding-top: 2rem;
        text-align: center;
        color: var(--color-gray-500);
        font-size: 0.875rem;
      }
    }

    /* Animations */
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class LandingComponent {}

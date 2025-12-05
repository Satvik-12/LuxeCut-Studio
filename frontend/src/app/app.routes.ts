import { Routes } from '@angular/router';
import { LandingComponent } from './features/public/landing.component';
import { ServicesComponent } from './features/public/services.component';
import { BookingComponent } from './features/public/booking.component';
import { SuccessComponent } from './features/public/success.component';
import { AdminLoginComponent } from './features/admin/admin-login.component';
import { AdminLayoutComponent, AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminAppointmentsComponent } from './features/admin/admin-appointments.component';
import { AdminServicesComponent } from './features/admin/admin-services.component';
import { PublicLayoutComponent } from './features/public/public-layout.component';
import { UserLoginComponent } from './features/public/auth/user-login.component';
import { UserSignupComponent } from './features/public/auth/user-signup.component';
import { UserDashboardComponent } from './features/public/user-dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.getToken()) return true;
  router.navigate(['/admin/login']);
  return false;
};

export const routes: Routes = [
  // Public Routes with Layout
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'book', component: BookingComponent },
      { path: 'success/:id', component: SuccessComponent },
      { path: 'login', component: UserLoginComponent },
      { path: 'signup', component: UserSignupComponent },
      { 
        path: 'user/dashboard', 
        component: UserDashboardComponent,
        canActivate: [authGuard] 
      }
    ]
  },

  // Admin Routes
  { path: 'admin/login', component: AdminLoginComponent },
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'appointments', component: AdminAppointmentsComponent },
      { path: 'services', component: AdminServicesComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];

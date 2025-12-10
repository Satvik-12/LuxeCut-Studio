import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from './toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
           errorMessage = error.error?.detail || error.message || 'Something went wrong';
        }
      }

      toastService.show(errorMessage, 'error');
      
      // Notify about redirection
      toastService.show('Redirecting to home in 10 seconds...', 'info', 10000);

      // Redirect to home after 10 seconds
      setTimeout(() => {
        router.navigate(['/']);
      }, 10000);

      return throwError(() => error);
    })
  );
};

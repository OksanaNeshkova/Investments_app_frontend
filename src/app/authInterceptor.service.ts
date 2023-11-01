import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environments";

@Injectable({
    providedIn: 'root'
  })

  export class AuthInterceptor implements HttpInterceptor{

    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('auth-token'); // Get the access token from storage
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Basic ${token}`
          }
        });
      }
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Handle token expiry, for example, redirect to login page
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
        );
      }
    }
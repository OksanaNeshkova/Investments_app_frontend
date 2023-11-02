import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

  export class LoginService{
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private authTokenKey = 'auth-token';
    private loginUrl = 'http://localhost:8080/login';

      constructor(private http: HttpClient,private router: Router) { 
        this.checkTokenInLocalStorage()
      }
      private checkTokenInLocalStorage() {
        const authToken = localStorage.getItem(this.authTokenKey);
        if (authToken) {
          this.isAuthenticated.next(true);
          console.log("got the token");
          console.log(authToken);
        }
      }
    
      login(email: string, password: string): Observable<any> {
        const body = {
          email: email,
          password: password
        };
    
        const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    
        return this.http.post(this.loginUrl, body, { headers: headers, responseType: 'text' })
          .pipe(
            tap(token => {
              // Save the token in localStorage
              localStorage.setItem(this.authTokenKey, token);
              console.log(token);
              console.log("token is saved to localstorage");
              if(!token){
                console.log("token is undefined or null")
              }
              this.isAuthenticated.next(true);
            }),
            catchError(error => {
              console.log('Authentication failed!');
              throw error;
            })
          );
      }
      logout() {
        // Remove token from localStorage and update authentication status
        localStorage.removeItem(this.authTokenKey);
        this.isAuthenticated.next(false);
        this.router.navigate(['/login']);
      }
    
      isAuthenticated$(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
      }

      getAuthToken(): string | null {
        console.log(localStorage.getItem(this.authTokenKey));
        console.log("token retrieved")
        return localStorage.getItem(this.authTokenKey);
        
      }
  }
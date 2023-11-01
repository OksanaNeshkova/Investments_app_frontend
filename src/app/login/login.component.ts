
import { AuthInterceptor } from "../authInterceptor.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environments";
import { Observable, catchError, tap, throwError } from "rxjs";
import { LoginService } from "./login.service";
import { Component } from "@angular/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit(): void {
    this.loginService.login(this.email, this.password)
      .subscribe(
        () => {
          this.router.navigate(['/']);
          console.log('Login successful');
        },
        error => {
          this.loginError = true; // Set a flag for displaying error message in the template
          console.error('Login failed', error);
        }
      );
  }
}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TransactionComponent } from './transaction/transaction.component';
import { EmployeeComponent } from './employee/employee.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './authInterceptor.service';
import { TransactionService } from './transaction/transaction.service';

@NgModule({
  declarations: [
    AppComponent,
    TransactionComponent,
    EmployeeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },TransactionService],
  bootstrap: [AppComponent]
})

export class AppModule { }


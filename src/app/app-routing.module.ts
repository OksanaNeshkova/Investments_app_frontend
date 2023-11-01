import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionComponent } from './transaction/transaction.component';
import { EmployeeComponent } from './employee/employee.component';
import { ShareComponent } from './share/share.component';

// import { AboutComponent } from './about/about.component';
// import { LoginComponent } from './login/login.component';

const routes: Routes = [
//   { path: '', component: TransactionComponent }, // Default route
  { path: 'transaction', component: TransactionComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'share', component: ShareComponent }
//   { path: 'about', component: AboutComponent },
//   { path: 'login', component: LoginComponent },
  // Add more routes for other components as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
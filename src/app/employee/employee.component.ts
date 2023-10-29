import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
  })

  export class EmployeeComponent implements OnInit{
    public employees: Employee[] | undefined;
    // public editEmployee: Employee | undefined | null;
    // public deleteEmployee: Employee | undefined | null;

    constructor(private employeeService: EmployeeService, private router: Router){}

    ngOnInit(){
        this.getAllEmployees();
      }

      goToEmployee(): void {
        this.router.navigate(['/employee']); // Navigate to the '/transaction' route
      }

      public getAllEmployees():void{
        this.employeeService.getAllEmployees().subscribe(
          (response: Employee[]) =>{
            this.employees = response;
            console.log(this.employees);
          },
          (error: HttpErrorResponse) => {
            alert(error.message)
          }
        )
      }
  }
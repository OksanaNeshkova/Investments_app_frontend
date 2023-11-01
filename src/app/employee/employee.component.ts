import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
    public employees: Employee[] | undefined;
    public editEmployee: Employee | undefined | null;
    public deleteEmployee: Employee | undefined | null;

    constructor(private employeeService: EmployeeService, private router: Router) { }

    navigateToSharePage() {
        // You can use the Angular Router to navigate to the "share" page
        this.router.navigate(['./share']);
      }
       

    ngOnInit() {
        this.getAllEmployees();
    }



    goToEmployee(): void {
        this.router.navigate(['/employee']); // Navigate to the '/employee' route
    }

    public getAllEmployees(): void {
        this.employeeService.getAllEmployees().subscribe(
            (response: Employee[]) => {
                this.employees = response;
                console.log(this.employees);
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
            }
        )
    }

    //Method to handle the addition of a new employee
    public onAddEmployee(addForm: NgForm): void {
        this.employeeService.addEmployee(addForm.value).subscribe(
            (response: Employee) => {
                console.log(response);
                this.getAllEmployees(); //Retrieve all employees after adding new one
                addForm.reset(); //Reset the form after successful addition
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
                addForm.reset();
            }
        )
    }


    //To handle updating existing employee
    public onUpdateEmployee(formValues: any): void {
        const updatedEmployee: Employee = { ...this.editEmployee, ...formValues };
    
        this.employeeService.updateEmployee(updatedEmployee).subscribe(
            (response: Employee) => {
                console.log(response);
                this.getAllEmployees();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    }

    public onOpenModal(employee: Employee | null, mode: string): void {
        // Method to handle modal window for adding, editing or deleting an employee
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'add') {
            button.setAttribute('data-target', '#addEmployeeModal');
        }
        if (mode === 'edit') {
            this.editEmployee = employee; // Assign the employee to be edited to the editEmployee object
            button.setAttribute('data-target', '#updateEmployeeModal');
        }
        if (mode === 'delete') {
          this.deleteEmployee = employee; // Assign the employee to be deleted to the deleteEmployee object
          button.setAttribute('data-target', '#deleteEmployeeModal');
        }
        if (container) {
            container.appendChild(button);
        }
        button.click();
    }

    public searchEmployees(key: string): void {
        // Method to search for employees based on a keyword
        console.log(key);
        if (!this.employees|| !key.trim()) {
            this.getAllEmployees();
            return;
        }
        const results: Employee[] = [];
        for (const employee of this.employees) {
            if (employee.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || employee.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
                ||  (employee.personalCode?.toString().includes(key))
                || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || employee.address.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                results.push(employee); // Add the matching employees to the results array
            }
        }
        this.employees = results; // Replace the component's employees array with the results array
        if (results.length === 0 || !key) {
            this.getAllEmployees(); // Retrieve all employees if the keyword is empty or no results are found
        }
    }


    public onDeleteEmployee(employeeId: number | undefined): void{
        if(employeeId == null){
            return;
        }
        this.employeeService.deleteEmployee(employeeId).subscribe(
          (response: void) => {
            console.log(response);
            this.getAllEmployees();
          },
          (error: HttpErrorResponse) =>{
            alert(error.message);
          }   
        )
      }
}
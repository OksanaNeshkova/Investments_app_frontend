import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login/login.service';



@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
    employees: Employee[] = [];
    public editEmployee: Employee | undefined | null;
    public updateProfile: Employee | undefined | null;
    public deleteEmployee: Employee | undefined | null;
    isAdmin:boolean = false;
    public errorMessage: string = '';
    public customPlaceholder: string = 'Search employee...';
    searchKey: string = '';
    filteredEmployees: Employee[] = [];

    constructor(private employeeService: EmployeeService, private router: Router, private loginService: LoginService) { }

    navigateToSharePage() {
        // You can use the Angular Router to navigate to the "share" page
        this.router.navigate(['./share']);
    }


    ngOnInit() {
        this.getAllEmployees();
        const userRole = localStorage.getItem('user-role');
        this.isAdmin = userRole === 'ROLE_ADMIN';
    }

    logout() {
        this.loginService.logout();
    }

    goToEmployee(): void {
        this.router.navigate(['/employee']); // Navigate to the '/employee' route
    }

    public getAllEmployees(): void {
        this.employeeService.getAllEmployees().subscribe(
            (response: Employee[]) => {
                this.employees = response;
                console.log(this.employees);
                this.filteredEmployees = [...this.employees]
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

    public onUpdateProfile(formValues: any): void {
        const updatedProfile: Employee = { ...this.updateProfile, ...formValues };
    
        this.employeeService.updateProfile(updatedProfile).subscribe(
            (response: Employee) => {
                console.log(response);
                // Optionally close the modal here
                // Refresh data or redirect as needed
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
                // Handle errors appropriately
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
        if (mode === 'update') {
            this.editEmployee = employee; // Assign the employee to be edited to the editEmployee object
            button.setAttribute('data-target', '#updateProfileModal');
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

    handleSearch(searchText: string): void {
        this.filteredEmployees = this.employees.filter(employee =>
            employee.firstName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.lastName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                ||  (employee.personalCode?.toString().includes(searchText))
                || employee.email.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.address.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.phone.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.role.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
        if (this.filteredEmployees.length === 0) {
          this.errorMessage = 'No matching records found.';
        } else {
          this.errorMessage = '';
        }
    }
    
      onSearchTextEntered(key: string) {
        this.searchKey = key;
        this.handleSearch(this.searchKey);
    }

    public onDeleteEmployee(employeeId: number | undefined): void {
        if (employeeId == null) {
            return;
        }
        this.employeeService.deleteEmployee(employeeId).subscribe(
            (response: void) => {
                console.log(response);
                this.getAllEmployees();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        )
    }

}
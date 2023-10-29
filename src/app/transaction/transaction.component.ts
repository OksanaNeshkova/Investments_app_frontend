import { Component, OnInit } from "@angular/core";
import { Transaction } from "./transaction";
import { TransactionService } from "./transaction.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css']
  })
  export class TransactionComponent implements OnInit {

  public transactions: Transaction[] | undefined;
//   public editTransaction:Transaction | undefined | null;
//   public deleteTransaction:Transaction | undefined | null;

  constructor(private transactionService: TransactionService,private router: Router) {}

  title = 'employeemanagerapp';
  ngOnInit() {
    this.getTransactions();
  }
  
  goToTransactions(): void {
    this.router.navigate(['/transaction']); // Navigate to the '/transaction' route
  }

  public getTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      (response: Transaction[]) => {
        this.transactions = response;
        console.log(this.transactions);
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  //Method to handle addition of a new employee
  public onAddEmployee(addForm: NgForm): void {
    const addEmployeeForm = document.getElementById('add-empployee-form');
    if(addEmployeeForm){
      addEmployeeForm.click();
    }
    this.transactionService.addEmployee(addForm.value).subscribe(
      (response: Transaction) => {
        console.log(response);
        this.getTransactions(); //Retrieve all transactions after adding a new one
        addForm.reset(); //Rest the form after successful addition
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    )
  }

  //To handle updating existing employee
  public onUpdateEmployee (employee:Transaction): void {
    this.transactionService.updateEmployee(employee).subscribe(
      (response:Transaction) => {
        console.log(response);
        this.getTransactions()
      },
      (error:HttpErrorResponse) => {
        alert (error.message);
      }
    )
  }

  //To handle deletion of an employee
  public onDeleteEmployee (employeeId:number|undefined):void {
    if (employeeId == undefined){
      return;
    }
    this.transactionService.deleteEmployee(employeeId).subscribe(
      (response:void) => {
        console.log(response);
        this.getTransactions()
      },
      (error:HttpErrorResponse) => {
        alert (error.message);
      }
    )
  }

  public onOpenModal(employee: Transaction | null, mode: string): void {
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
    if(container){
      container.appendChild(button);
    }
    button.click();
  }

  public searchEmployees(key: string): void {
    // Method to search for transactions based on a keyword
    console.log(key);
    if (!this.transactions) {
      return;
    }
    const results: Transaction[] = [];
    for (const employee of this.transactions) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee); // Add the matching transactions to the results array
      }
    }
    this.transactions = results; // Replace the component's transactions array with the results array
    if (results.length === 0 || !key) {
      this.getTransactions(); // Retrieve all transactions if the keyword is empty or no results are found
    }
  }
  }
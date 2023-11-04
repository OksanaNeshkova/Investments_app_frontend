import { Component, OnInit } from "@angular/core";
import { Transaction } from "./transaction";
import { TransactionService } from "./transaction.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subject, debounceTime } from "rxjs";
import { ShareService } from "../share/share.service";
import { Share } from "../share/share";
import { Employee } from "../employee/employee";
import { EmployeeService } from "../employee/employee.service";
import { LoginService } from "../login/login.service";

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css']
  })
  export class TransactionComponent implements OnInit {

  public transactions: Transaction[] | undefined;
  public editTransaction:Transaction | undefined | null;
  public deleteTransaction:Transaction | undefined | null;
  public searchKey: string = '';

  constructor(private transactionService: TransactionService,private router: Router,private shareService:ShareService, private employeeService:EmployeeService, private loginService: LoginService) {}

  title = 'Transactions';
  ngOnInit() {
      this.getTransactionsWithShares();
}
  
  
  goToTransactions(): void {
    this.router.navigate(['/transaction']); // Navigate to the '/transaction' route
  }

  logout(){
    this.loginService.logout();
  }

  public getTransactionsWithShares(): void {
    this.transactionService.getAllTransactions().subscribe(
      (response: Transaction[]) => {
        this.transactions = response;
        this.attachShareInfoToTransactions();
        console.log(this.transactions);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  
  private attachShareInfoToTransactions(): void {
    if (this.transactions) {
      this.transactions.forEach(transaction => {
        this.shareService.getShareByTransactionId(transaction.id).subscribe(
          (share: Share) => {
            transaction.share = share;
          },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
        this.employeeService.getEmployeeByTransactionId(transaction.id).subscribe(
          (employee: Employee) => {
            transaction.employee = employee;
          },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
      });
    }
  }
  public onAddTransaction(addForm: NgForm): void {
    const empId = addForm.value.empId;
    const secId = addForm.value.secId;
  this.transactionService.addTransaction(addForm.value, empId, secId).subscribe(
    (response: Transaction) => {
      console.log(response);
      this.getTransactionsWithShares();
      addForm.reset();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
      addForm.reset();
    }
  );
  }
  //To handle updating existing transaction
  public onUpdateTransaction (transaction:Transaction): void {
    this.transactionService.updateTransaction(transaction).subscribe(
      (response:Transaction) => {
        console.log(response);
        this.getTransactionsWithShares()
      },
      (error:HttpErrorResponse) => {
        alert (error.message);
      }
    )
  }

  //To handle deletion of a transaction
  public onDeleteTransaction (transactionId:number|undefined):void {
    if (transactionId == undefined){
      return;
    }
    this.transactionService.deleteTransaction(transactionId).subscribe(
      (response:void) => {
        console.log(response);
        this.getTransactionsWithShares()
      },
      (error:HttpErrorResponse) => {
        alert (error.message);
      }
    )
  }

  public onOpenModal(transaction: Transaction | null, mode: string): void {
    // Method to handle modal window for adding, editing or deleting a transaction
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addTransactionModal');
    }
    if (mode === 'edit') {
      this.editTransaction = transaction; // Assign the transaction to be edited to the editEmployee object
      button.setAttribute('data-target', '#updateTransactionModal');
    }
    if (mode === 'delete') {
      this.deleteTransaction = transaction; // Assign the transaction to be deleted to the deleteEmployee object
      button.setAttribute('data-target', '#deleteTransactionModal');
    }
    if(container){
      container.appendChild(button);
    }
    button.click();
  }

  public searchTransaction(): void {
    if (!this.transactions) {
      return;
    }
  
    const lowerCaseKey = this.searchKey.toLowerCase(); // Convert search key to lowercase for case-insensitive comparison
    const results: Transaction[] = [];
  
    for (const transaction of this.transactions) {

      if (
        transaction.share.isin.toLowerCase().includes(lowerCaseKey) ||
        transaction.volume.toString().includes(this.searchKey) ||
        transaction.price.toString().includes(this.searchKey) ||
        transaction.currency.toLowerCase().includes(lowerCaseKey) ||
        transaction.employee.firstName.toLowerCase().includes(lowerCaseKey) ||
        transaction.employee.lastName.toLowerCase().includes(lowerCaseKey)
      ) {
        results.push(transaction);
      }
    }
    
    this.transactions = results;
  
    if (results.length === 0 || !this.searchKey) {
      this.getTransactionsWithShares();
    }
  }
  }
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

  transactions: Transaction[]=[];
  public editTransaction:Transaction | undefined | null;
  public deleteTransaction:Transaction | undefined | null;
  isAdmin:boolean = false;
  public customPlaceholder: string = 'Search transaction...';
  public errorMessage: string = '';
  searchKey: string = '';
  filteredTransactions: Transaction[] = [];

  constructor(private transactionService: TransactionService,private router: Router,private shareService:ShareService, private employeeService:EmployeeService, private loginService: LoginService) {}

  title = 'Transactions';
  ngOnInit() {
      this.getTransactionsWithShares();
      const userRole = localStorage.getItem('user-role');
        this.isAdmin=userRole === 'ROLE_ADMIN';
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
        this.filteredTransactions = [...this.transactions]
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


  handleSearch(searchText: string): void {
    this.filteredTransactions = this.transactions.filter(transaction =>
      transaction.share.symbol.toLowerCase().includes(searchText) ||
      transaction.share.currency.toLowerCase().includes(searchText) ||
      transaction.volume.toString().includes(this.searchKey) ||
      transaction.price.toString().includes(this.searchKey) ||
      transaction.employee.firstName.toLowerCase().includes(searchText) ||
      transaction.employee.lastName.toLowerCase().includes(searchText)
    );
    if (this.filteredTransactions.length === 0) {
      this.errorMessage = 'No matching records found.';
    } else {
      this.errorMessage = '';
    }
}

  onSearchTextEntered(key: string) {
    this.searchKey = key;
    this.handleSearch(this.searchKey);
}
  }
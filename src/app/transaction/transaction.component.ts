import { Component, OnInit } from "@angular/core";
import { Transaction } from "./transaction";
import { TransactionService } from "./transaction.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subject, debounceTime } from "rxjs";

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
  private searchTermSubject = new Subject<string>();

  constructor(private transactionService: TransactionService,private router: Router) {}

  title = 'Transactions';
  ngOnInit() {
    this.setupSearchDebouncing();
    this.getTransactions();
  }
  private setupSearchDebouncing(): void {
    this.searchTermSubject.pipe(debounceTime(300)).subscribe(() => {
      this.getTransactions();
    });
  }

  public onSearchChange(): void {
    this.searchTermSubject.next(this.searchKey);
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

  //Method to handle addition of a new transaction
  // public onAddTransaction(addForm: NgForm): void {
  //   const addTransactionForm = document.getElementById('add-transaction-form');
  //   if(addTransactionForm){
  //     addTransactionForm.click();
  //   }
  //   this.transactionService.addTransaction(addForm.value).subscribe(
  //     (response: Transaction) => {
  //       console.log(response);
  //       this.getTransactions(); //Retrieve all transactions after adding a new one
  //       addForm.reset(); //Rest the form after successful addition
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error.message);
  //       addForm.reset();
  //     }
  //   )
  // }
  public onAddTransaction(addForm: NgForm): void {
    const empId = addForm.value.empId;
    const secId = addForm.value.secId;


  this.transactionService.addTransaction(addForm.value, empId, secId).subscribe(
    (response: Transaction) => {
      console.log(response);
      this.getTransactions();
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
        this.getTransactions()
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
        this.getTransactions()
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
      this.getTransactions();
    }
  }
  }
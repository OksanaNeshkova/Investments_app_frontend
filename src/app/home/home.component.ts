import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ShareService } from '../share/share.service';
import { EmployeeService } from '../employee/employee.service';
import { Balance } from '../share/balance';
import { TwelvedataService } from '../twelvedata/twelvedata.service';
import { Employee } from '../employee/employee';
import { EmployeeComponent } from '../employee/employee.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  [x: string]: any;
  isAuthenticated: boolean = false;
  updateProfile: Employee | undefined;
  shareBalances: Balance[] = [];
  isAdmin:boolean = false;
  currentUser: Employee | undefined;
  public errorMessage: string = '';
  public customPlaceholder: string = 'Search position...';
  searchKey: string = '';
  filteredShareBalances: Balance[] = [];

  constructor(private loginService: LoginService, private router:Router, private employeeService: EmployeeService, private shareService: ShareService, private twelvedataService:TwelvedataService) { }

  ngOnInit() {
    this.loadShareBalances();
    // this.loadCurrentUser();
    const userRole = localStorage.getItem('user-role');
        this.isAdmin=userRole === 'ROLE_ADMIN';
  }

  getRowClass(shareBalance: Balance): string {
    const totalReturnPercentage = this.getTotalReturnPercentage(shareBalance);
    return totalReturnPercentage >= 0 ? 'text-success' : 'text-danger';
  }

  formatPositiveNumber(number: any): string {
    const numericValue = +number;
    const formattedValue = numericValue.toFixed(2);
    return numericValue >= 0 ? `+${formattedValue}` : `${formattedValue}`;
  }
  
  getBookValue(shareBalance: Balance): number {
    return shareBalance.balance * shareBalance.bookPrice;
  }
  
  getCurrentMarketValue(shareBalance: Balance): number {
    return shareBalance.balance * shareBalance.currentPrice;
  }
  
  getTotalReturnPercentage(shareBalance: Balance): number {
    const bookValue = this.getBookValue(shareBalance);
    const marketValue = this.getCurrentMarketValue(shareBalance);
    const totalReturn = ((marketValue / bookValue - 1) * 100);
    return Number(totalReturn.toFixed(2));
  }

  loadShareBalances() {
    this.shareService.getBalances().subscribe(
      (balances: Balance[]) => {
        this.shareBalances = balances;
        this.fetchCurrentQuote();
        this.filteredShareBalances = [...this.shareBalances];
        console.log('Share Balances:', this.shareBalances);
      },
      (error) => {
        console.error('Error fetching share balances: ', error);
      }
    );
  }

  fetchCurrentQuote() {
    this.shareBalances.forEach((balance) => {
      this.twelvedataService.getCurrentPrice(balance.symbol).subscribe(
        (response: any) => {
          balance.currentPrice = response.price; 
        },
        (error) => {
          console.error(`Error fetching current quote for ${balance.symbol}: `, error);
        }
      );
    });
   
  }

handleSearch(searchText: string): void {
    this.filteredShareBalances = this.shareBalances.filter(shareBalance =>
        shareBalance.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
        shareBalance.shareName.toLowerCase().includes(searchText.toLowerCase())
    );
    if (this.filteredShareBalances.length === 0) {
      this.errorMessage = 'No matching records found.';
    } else {
      this.errorMessage = '';
    }
}

  onSearchTextEntered(key: string) {
    this.searchKey = key;
    this.handleSearch(this.searchKey);
}
  
  logout(){
    this.loginService.logout();
  }
  // loadCurrentUser() {
  //   // Assuming you have a method in employeeService to fetch the current user's data
  //   // This should ideally use the token to fetch the corresponding user data
  //   this.employeeService.getCurrentUser().subscribe(
  //     (userData: Employee) => {
  //       this.currentUser = userData;
  //       this.updateProfile = { ...userData }; // Initialize updateProfile with currentUser data
  //     },
  //     (error) => {
  //       console.error('Error fetching current user data: ', error);
  //     }
  //   );
  // }


  public onUpdateProfile(formValues: any): void {
    const token = this.loginService.getAuthToken();
    if (!token) {
      console.error('No auth token found. User might not be logged in.');
      return;
    }

    // Decode the token to get the email
    const decodedToken = this.loginService.decodeToken(token);
    const userEmail = decodedToken.email; // Replace 'email' with the correct key if different
    const userId = decodedToken.userId;
    //

    if (!userEmail) {
      console.error('Email not found in the token.');
      return;
    }

    if (!userId) {
      console.error('User ID not found in the token.');
      return;
    }

    const decodedEmail = decodedToken.decodedEmail;

    if (!decodedEmail) {
      console.error('Decoded email not found in the token.');
      return;
    }

    const updatedProfile: Employee = { ...this.updateProfile, ...formValues };

    this.employeeService.updateProfile(updatedProfile).subscribe(
        (response: Employee) => {
          console.log('Profile updated:', response);

        },
        (error: HttpErrorResponse) => {
          alert('Error updating profile: ' + error.message);
        }
    );
}
}

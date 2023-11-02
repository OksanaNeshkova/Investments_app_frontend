import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ShareService } from '../share/share.service';
import { Balance } from '../share/balance';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  shareBalances: Balance[] = [];
  constructor(private loginService: LoginService, private router:Router, private shareService: ShareService) { }

  ngOnInit() {
    this.loadShareBalances()
  }
  loadShareBalances() {
    this.shareService.getBalances().subscribe(
      (balances: Balance[]) => {
        this.shareBalances = balances;
      },
      (error) => {
        console.error('Error fetching share balances: ', error);
      }
    );
  }

  logout(){
    this.loginService.logout();
  }
}
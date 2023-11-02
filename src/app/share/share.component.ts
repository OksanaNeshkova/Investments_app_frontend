
import { Component, OnInit } from '@angular/core';
import { Share } from './share';
import { ShareService } from './share.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login/login.service';
@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
    public shares: Share[] | undefined;
    public editShare: Share | undefined | null;
    constructor(private shareService: ShareService, private router: Router, private loginService: LoginService) { }
    ngOnInit() {
        this.getAllShares();
    }
    goToEmployee(): void {
        this.router.navigate(['/share']); // Navigate to the '/share' route
    }
    public getAllShares(): void {
        this.shareService.getAllShares().subscribe(
            (response: Share[]) => {
                this.shares = response;
                console.log(this.shares);
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
            }
        )
    }

    logout(){
        this.loginService.logout();
      }
    //Method to handle the addition of a new share
    public onAddShare(addForm: NgForm): void {
        this.shareService.addShares(addForm.value).subscribe(
            (response: Share) => {
                console.log(response);
                this.getAllShares(); //Retrieve all shares after adding new one
                addForm.reset(); //Reset the form after successful addition
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
                addForm.reset();
            }
        )
    }
    //To handle updating existing share
    public onUpdateShare(formValues: any): void {
        const updatedShare: Share = { ...this.editShare, ...formValues };
        this.shareService.updateShare(updatedShare).subscribe(
            (response: Share) => {
                console.log(response);
                this.getAllShares();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    }
    public onOpenModal(share: Share | null, mode: string): void {
        // Method to handle modal window for adding, editing or deleting an share
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'add') {
            button.setAttribute('data-target', '#addShareModal');
        }
        if (mode === 'edit') {
            this.editShare = share; // Assign the share to be edited to the editShare object
            button.setAttribute('data-target', '#updateShareModal');
        }
        if (container) {
            container.appendChild(button);
        }
        button.click();
    }
    public searchShares(key: string): void {
        // Method to search for shares based on a keyword
        console.log(key);
        if (!this.shares|| !key.trim()) {
            this.getAllShares();
            return;
        }
        const results: Share[] = [];
        for (const share of this.shares) {
            if (share.companyName.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || share.shareName.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || share.isin.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || share.country.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || share.economicField.toLowerCase().indexOf(key.toLowerCase()) !== -1
                || share.transaction?.toString().includes(key)) {
                results.push(share); // Add the matching shares to the results array
            }
        }
        this.shares = results; // Replace the component's shares array with the results array
        if (results.length === 0 || !key) {
            this.getAllShares(); // Retrieve all shares if the keyword is empty or no results are found
        }
    }
}
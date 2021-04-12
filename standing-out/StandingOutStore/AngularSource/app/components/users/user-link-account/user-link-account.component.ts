import { Component, OnInit, Input } from '@angular/core';
import { UsersService, TutorsService } from '../../../services/index';

@Component({
    selector: 'app-user-link-account',
    templateUrl: './user-link-account.component.html',
    styleUrls: ['./user-link-account.component.css']
})
export class UserLinkAccountComponent implements OnInit {

    @Input() tutor: boolean;

    constructor(private usersService: UsersService, private tutorsService: TutorsService) { }

    userLocalLogin: boolean = false;
    userHasGoogleAccountLinked: boolean = false;
    currentUrl: string = window.location.href;

    ngOnInit(): void {
        if (this.tutor == true) {
            this.tutorsService.getMy()
                .subscribe(success => {
                    this.userLocalLogin = success.localLogin;
                    this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
                }, error => {
                });
        } else {
            this.usersService.getMy()
                .subscribe(success => {
                    this.userLocalLogin = success.localLogin;
                    this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;
                }, error => {
                });
        }
    }

}

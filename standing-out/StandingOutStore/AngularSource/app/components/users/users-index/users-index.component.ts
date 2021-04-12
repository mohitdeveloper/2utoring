import { Component, OnInit } from '@angular/core';
import { TableSearch, PagedList, UserProfile } from '../../../models/index';
import { UsersService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

declare let title: string;
declare let userType: string;
declare let area: string;


@Component({
    selector: 'app-users-index',
    templateUrl: './users-index.component.html',
    styleUrls: ['./users-index.component.css'],
})

export class UsersIndexComponent implements OnInit {
    constructor(private usersService: UsersService, public dialog: MatDialog, private dialogRef: MatDialogRef<UsersIndexComponent>) { }

    title: string = title;
    userType: string = userType;
    area: string = area;
    takeValues: any[] = [
        { take: 10, name: 'Show 10' },
        { take: 25, name: 'Show 25' },
        { take: 50, name: 'Show 50' },
        { take: 100, name: 'Show 100' }
    ];

    searchModel: TableSearch = {
        take: 10,
        search: '',
        page: 1,
        totalPages: 1,
        sortType: 'Email',
        order: 'ASC',
        filter: '',
    };

    results: PagedList<UserProfile> = { paged: null, data: null };

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getUsers();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getUsers();
    };

    next(): void {
        this.searchModel.page++;
        this.getUsers();
    };

    previous(): void {
        this.searchModel.page--;
        this.getUsers();
    };

    alterOrder(type: string): void {
        this.searchModel.sortType = type;

        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        } else {
            this.searchModel.order = 'DESC';
        }

        this.reloadData();
    }

    getUsers(): void {
        $('.loading').show();
        if (this.userType == 'Student') {
            this.usersService.getStudentsPaged(this.searchModel)
                .subscribe(success => {
                    this.results = success;

                    if (environment.indexPageAnchoringEnabled == true) {
                        if (environment.smoothScroll == false) {
                            //quick and snappy
                            window.scroll(0, 0);
                        } else {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: 'smooth'
                            });
                        }
                    }

                    $('.loading').hide();
                }, error => {
                    console.log(error);
                });
        } else if (this.userType == 'Admin') {
            this.usersService.getAdminsPaged(this.searchModel)
                .subscribe(success => {
                    this.results = success;
                    console.log("admins:", this.results);
                    if (environment.indexPageAnchoringEnabled == true) {
                        if (environment.smoothScroll == false) {
                            //quick and snappy
                            window.scroll(0, 0);
                        } else {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: 'smooth'
                            });
                        }
                    }

                    $('.loading').hide();
                }, error => {
                    console.log(error);
                });
        }
        else if (this.userType == 'Super Admin') {
            this.usersService.getAdminsPaged(this.searchModel)
                .subscribe(success => {
                    this.results = success;
                    console.log("admins:", this.results);
                    if (environment.indexPageAnchoringEnabled == true) {
                        if (environment.smoothScroll == false) {
                            //quick and snappy
                            window.scroll(0, 0);
                        } else {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: 'smooth'
                            });
                        }
                    }

                    $('.loading').hide();
                }, error => {
                    console.log(error);
                });
        }
        
    };

    ngOnInit() {
        this.getUsers();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };

    showStudentInfoBox(templateRef) {
        this.dialogRef = this.dialog.open(templateRef, {
            maxWidth: '60vw',
            panelClass: 'myClass',
            autoFocus: false,
            data: {
                'id': ''
            }
        });

        this.dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`); // Pizza!
        });
    }

    hideStudnetBox() {
        this.dialog.closeAll();
    }
}

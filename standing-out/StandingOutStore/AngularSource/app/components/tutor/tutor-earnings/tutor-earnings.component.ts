import { Component, OnInit } from '@angular/core';
import { TableSearch, PagedList, ClassSession } from '../../../models/index';
import { ClassSessionsService, UsersService, StripeService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

declare let area: string;

@Component({
    selector: 'app-tutor-earnings',
  templateUrl: './tutor-earnings.component.html',
    styleUrls: ['./tutor-earnings.component.css']
})
export class TutorEarningsComponent implements OnInit {
    colspan: number = 7;
    alertMessage: any = null;
    showReloadList: boolean = false;
    //toLoad: number = this.stripeConnectAccountId !== undefined && this.stripeConnectAccountId != null && this.stripeConnectAccountId != '' && (success == true || success === undefined) ? 1 : 0;
    //loaded: number = 0;

    constructor(private classSessionsService: ClassSessionsService, private usersService: UsersService, private stripeService: StripeService, private toastr: ToastrService) {
        if (this.area == 'Admin')
            this.colspan = 8;

    }
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
        sortType: 'StartDate',
        order: 'DESC',
        filter: '',
    };

    results: PagedList<ClassSession> = { paged: null, data: null };

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getClassSessions();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getClassSessions();
    };

    next(): void {
        this.searchModel.page++;
        this.getClassSessions();
    };

    previous(): void {
        this.searchModel.page--;
        this.getClassSessions();
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

    getClassSessions(): void {
        debugger;
        $('.loading').show();
        this.classSessionsService.getEarnings(this.searchModel)
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
    };


    ngOnInit() {
        this.getClassSessions();
        this.getUserAlertMessage();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };

    getTotalEarnings(): number {
        var result = 0;

        if (this.results.data != null) {
            for (var i = 0; i < this.results.data.length; i++) {
                result += this.results.data[i].vendorEarningAmount;
            }
        }

        return result;
    };


    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }
}


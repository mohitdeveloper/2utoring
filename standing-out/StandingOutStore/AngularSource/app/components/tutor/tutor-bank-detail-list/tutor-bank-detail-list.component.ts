import { Component, OnInit } from '@angular/core';
import { TableSearch, PagedList, TutorBankDetailsItem } from '../../../models/index';
import { CompanyService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-tutor-bank-detail-list',
    templateUrl: './tutor-bank-detail-list.component.html',
    styleUrls: ['./tutor-bank-detail-list.component.css']
})
export class TutorBankDetailsListComponent implements OnInit {
    constructor(private companyService: CompanyService) { }

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
        sortType: 'UserFullName',
        order: 'DESC',
        filter: '',
    };

    results: PagedList<TutorBankDetailsItem> = { paged: null, data: null };

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getPagedBankDetails();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getPagedBankDetails();
    };

    next(): void {
        this.searchModel.page++;
        this.getPagedBankDetails();
    };

    previous(): void {
        this.searchModel.page--;
        this.getPagedBankDetails();
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

    getPagedBankDetails(): void {
        $('.loading').show();
        this.companyService.getPagedBankDetails(this.searchModel)
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
            }, error => {
                console.log(error);
            }, () => {
                $('.loading').hide();
            });
    };

    ngOnInit() {
        this.getPagedBankDetails();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
}

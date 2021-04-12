import { Component, OnInit } from '@angular/core';
import { TableSearch, PagedList, SafeguardReportIndex } from '../../../models/index';
import { SafeguardingReportsService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';

declare let title: string;


@Component({
    selector: 'app-safeguarding-index',
    templateUrl: './safeguarding-index.component.html'
})

export class SafeguardingIndexComponent implements OnInit {
    constructor(private safeguardingReportsService: SafeguardingReportsService) { }

    title: string = title;

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
        sortType: 'LogDate',
        order: 'DESC',
        filter: '',
    };

    results: PagedList<SafeguardReportIndex> = { paged: null, data: null };

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
        this.safeguardingReportsService.getPaged(this.searchModel)
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
        this.getUsers();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
}

import { Component, OnInit } from '@angular/core';
import { TableSearch, PagedList, Subject } from '../../../models/index';
import { SubjectsService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';

declare var title: any;

@Component({
    selector: 'app-subjects-index',
    templateUrl: './subjects-index.component.html'
})

export class SubjectsIndexComponent implements OnInit {
    constructor(private subjectsService: SubjectsService) { }

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
        sortType: 'Name',
        order: 'ASC',
        filter: '',
    };

    results: PagedList<Subject> = { paged: null, data: null };

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getSubjects();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getSubjects();
    };

    next(): void {
        this.searchModel.page++;
        this.getSubjects();
    };

    previous(): void {
        this.searchModel.page--;
        this.getSubjects();
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

    getSubjects(): void {
        $('.loading').show();

        this.subjectsService.getPaged(this.searchModel)
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
        this.getSubjects();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
}

